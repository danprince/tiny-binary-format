function BinaryFormat(fields) {
  this.start = 0;
  this.end = fields.length - 1;

  this.fields = fields.map(function(field) {
    // turns int:n into 2^n-1 where n > 0
    field.mask = (2 << (field.length - 1)) - 1;
    return field;
  });
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
    unpacked[field.name] = packed & field.mask;
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
    unpacked[index] = packed & field.mask;
    // shift on for the next field
    packed >>= field.length;
  }

  return unpacked;
};

BinaryFormat.prototype.unpackField = function(packed, targetfieldName) {
  var unpackedField, field, index;

  for(index = this.end; index >= this.start; index--) {
    field = this.fields[index];

    if (field.name == targetfieldName) {
      unpackedField = packed & field.mask;
      break;
    }
    else {
      packed >>= field.length;
    }
  }

  return unpackedField;
}

if(typeof module !== 'undefined' && module.exports) {
  module.exports = BinaryFormat;
}

