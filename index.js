module.exports = BinaryFormat;

function BinaryFormat(blocks) {
  this.start = 0;
  this.end = blocks.length - 1;

  this.blocks = blocks.map(function(block) {
    // turns int:n into 2^n-1 where n > 0
    block.mask = (2 << (block.bits - 1)) - 1;
    return block;
  });
}

BinaryFormat.prototype.pack = function() {
  var packed, block, i;

  for(i = this.start; i <= this.end; i++) {
    block = this.blocks[i];

    // make space for the next value
    packed <<= block.bits;
    // store the value
    packed |= arguments[i];
  }

  return packed;
};

BinaryFormat.prototype.unpack = function(packed) {
  var unpacked, i;

  unpacked = {};

  for(i = this.end; i >= this.start; i--) {
    block = this.blocks[i];
    // use the mask to separate the relevant bits
    unpacked[block.name] = packed & block.mask;
    // shift on for the next block
    packed >>= block.bits;
  }

  return unpacked;
};

BinaryFormat.prototype.unpackArray = function(packed) {
  var unpacked, i;

  unpacked = [];

  for(i = this.end; i >= this.start; i--) {
    block = this.blocks[i];
    // use the mask to separate the relevant bits
    unpacked.push(packed & block.mask);
    // shift on for the next block
    packed >>= block.bits;
  }

  return unpacked;
};

