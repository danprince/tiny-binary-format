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
  
  var unpacked = {};
  for(var i = this.end; i >= this.start; i--) {
    var field = this.fields[i];
    // use the mask to separate the relevant bits
    unpacked[field.name] = packed & field.mask;
    // shift on for the next field
    packed >>= field.length;
  }

  return unpacked;
};

BinaryFormat.prototype.unpackArray = function(packed) {
  
  var index = this.end + 1;
  var unpacked = new Array(index);
  while (index--) {
    var field = this.fields[index];
    // use the mask to separate the relevant bits
    unpacked[index] = packed & field.mask;
    // shift on for the next field
    packed >>= field.length;
  }

  return unpacked;
};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = BinaryFormat;
}

