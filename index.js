function BinaryFormat(fields) {
  var offsetTable = {};
  var maskTable = {};

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
    maskTable[field.name] = (2 << (field.length - 1)) - 1;
    offsetTable[field.name] = calculateOffset(index);
    return field;
  });

  this.offsetTable = offsetTable;
  this.maskTable = maskTable;
}

BinaryFormat.prototype.pack = function() {
  var packed, field, i;

  for(i = this.start; i <= this.end; i++) {
    field = this.fields[i];

    // make space for the next value
    packed <<= field.length;
    // store the value
    packed |= arguments[i];
  }

  return packed;
};

BinaryFormat.prototype.unpack = function(packed) {
  var field, unpacked, index;

  unpacked = {};

  for(index = this.end; index >= this.start; index--) {
    field = this.fields[index];
    // use the mask to separate the relevant bits
    unpacked[field.name] = packed & this.maskTable[field.name];
    // shift on for the next field
    packed >>= field.length;
  }

  return unpacked;
};

BinaryFormat.prototype.unpackArray = function(packed) {
  var field, unpacked, index;

  index = this.end + 1;
  unpacked = new Array(index);

  while (index--) {
    field = this.fields[index];
    // use the mask to separate the relevant bits
    unpacked[index] = packed & this.maskTable[field.name];
    // shift on for the next field
    packed >>= field.length;
  }

  return unpacked;
};

BinaryFormat.prototype.unpackField = function(packed, targetfieldName) {
  return (packed >> this.offsetTable[targetfieldName]) & this.maskTable[targetfieldName];
};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = BinaryFormat;
}

