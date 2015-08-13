(function(global){
'use strict';

// Split a 64-bit number primitive into two 32-bit numbers.
// This is useful because JS treats bitwise operands as 32-bit
function split32(n){
  var low = (n & 0xFFFFFFFF) >>> 0;
  var high = ((n - low) / 0x100000000) >>> 0;
  return [high,low];
}

function BinaryFormat(fields) {
  var indexTable = {};

  this.start = 0;
  this.end = fields.length - 1;

  function calculateOffset(index) {
    var tail = fields.slice(index + 1, fields.length);

    return tail.reduce(function(acc, field) {
      return acc += field.length;
    }, 0);
  }

  this.fields = fields.map(function(field, index) {
    // turns int:n into 2^n-1 where n > 0
    // Use pow() to avoid bitwise operand truncation
    field.mask = Math.pow(2, field.length) - 1;
    field.offset = calculateOffset(index);
    indexTable[field.name] = index;
    return field;
  });

  this.indexTable = indexTable;
}

BinaryFormat.prototype.pack = function() {
  var high, low, field, i, maskSplit;
  high = 0;
  low = 0;
  
  for(i = this.start; i <= this.end; i++) {
    field = this.fields[i];
    maskSplit = split32(field.mask);
    if (field.length > 32){ // This case should happen at most once
      var valSplit = split32(arguments[i]);
      // Move lower bits to upper register
      high = low << (field.length-32);
      // Store >32-bit number
      high |= valSplit[0];
      low = valSplit[1];
    } else {
      // Left-shift and store normally
      high <<= field.length;
      high |= low >>> (32-field.length);
      low <<= field.length;
      low |= arguments[i] & maskSplit[1];
    }
    // Truncate to 32 bits if needed
    high &= 0xFFFFFFFF;
    low &= 0xFFFFFFFF;
  }

  // Use multiplication, or else bits will truncate
  return ((high >>> 0) * 0x100000000) + (low >>> 0);
};

BinaryFormat.prototype.unpack = function(packed, asArray) {
  var field, unpacked, index, packedSplit, maskSplit, valSplit;

  unpacked = asArray ? [] : {};
  packedSplit = split32(packed);
  valSplit = [0, 0];

  for(index = this.end; index >= this.start; index--) {
    field = this.fields[index];
    maskSplit = split32(field.mask);
    // use the mask to separate the relevant bits
    valSplit[0] = (packedSplit[0] & maskSplit[0]) >>> 0;
    valSplit[1] = (packedSplit[1] & maskSplit[1]) >>> 0;
    unpacked[asArray ? index : field.name] = (valSplit[0] * 0x100000000) + valSplit[1];
    if (field.length > 32){
      // If field > 32 bits, dump the low register and move relevant high register bits over
      packedSplit[1] = packedSplit[0] >>> (field.length - 32);
      packedSplit[0] = 0;
    } else {
      // shift on for the next field
      packedSplit[1] = packedSplit[1] >>> field.length;
      packedSplit[1] |= (packedSplit[0] & maskSplit[1]) << (32 - field.length);
      packedSplit[0] = packedSplit[0] >>> field.length;
    }
  }

  return unpacked;
};

BinaryFormat.prototype.unpackArray = function(packed) {
  return this.unpack(packed, true);
};

BinaryFormat.prototype.unpackField = function(packed, targetfieldName) {
  var field, offset, mask, packedSplit, maskSplit, fieldMaskHigh, valSplit;

  field = this.fields[this.indexTable[targetfieldName]];
  packedSplit = split32(packed);
  maskSplit = split32(field.mask);
  valSplit = [0, 0];

  // Field value resides in upper 32 bits
  if (field.offset >= 32){
    return (packedSplit[0] >>> (field.offset - 32)) & maskSplit[1];
  }

  // Field value resides in lower 32 bits
  if (field.offset + field.length <= 32){
    return (packedSplit[1] >>> field.offset) & maskSplit[1];
  }

  // Field > 32 bits and/or resides in both registers
  // Get the upper value bits
  fieldMaskHigh = (2 << (field.offset + field.length - 33)) - 1;
  valSplit[0] = packedSplit[0] & fieldMaskHigh;
  // Right shift the lower register
  valSplit[1] = (packedSplit[1] >>> field.offset) & maskSplit[1];
  // Right shift the upper register, moving n=offset bits into lower register
  var offsetBits = valSplit[0] & ((2 << (field.offset - 1)) - 1);
  valSplit[1] |= (offsetBits << (32 - field.offset));
  valSplit[0] = valSplit[0] >>> field.offset;

  return ((valSplit[0] >>> 0) * 0x100000000) + (valSplit[1] >>> 0);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BinaryFormat;
} else {
  global.BinaryFormat = BinaryFormat;
}

})(this);
