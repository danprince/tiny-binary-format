var assert = require('assert'),
    BinaryFormat = require('./');

describe('Tiny Binary Format', function() {
  var Tile;

  beforeEach(function() {
    Tile = new BinaryFormat([
      { length: 8, name: 'type' },
      { length: 8, name: 'height' },
      { length: 1, name: 'veg' }
    ]);
  });

  it('should be a function', function() {
    assert.equal(typeof BinaryFormat, 'function');
  });

  it('should return an object', function() {
    assert.equal(typeof Tile, 'object');
  });

  it('the object should have the correct prototype', function() {
    assert.equal(Tile instanceof BinaryFormat, true);
  });


  describe('#pack', function() {
    var testCases;

    beforeEach(function() {
      testCases = [
        { input: [14, 31, 1], expected: 7231 },
        { input: [0,  79, 0], expected: 158 },
        { input: [8,  60, 1], expected: 4217 },
        { input: [46, 18, 0], expected: 23588 },
        { input: [18, 32, 1], expected: 9281 }
      ];
    });

    it('should be a function', function() {
      assert.equal(typeof Tile.pack, 'function');
    });

    it('should return a number', function() {
      testCases.forEach(function(test) {
        assert.equal(typeof Tile.pack.apply(Tile, test.input), 'number');
      });
    });

    it('should return the correct numbers', function() {
      testCases.forEach(function(test) {
        assert.equal(Tile.pack.apply(Tile, test.input), test.expected);
      });
    });
  });

  describe('#unpack', function() {
    var testCases;

    beforeEach(function() {
      testCases = [
        { input: [26, 2, 0] },
        { input: [125, 5, 1] },
        { input: [3, 99, 1] },
        { input: [88, 99, 1] }
      ];
    });

    it('should be a function', function() {
      assert.equal(typeof Tile.unpack, 'function');
    });

    it('should return an object', function() {
      testCases.forEach(function(test) {
        var packed = Tile.pack.apply(Tile, test.input);
        var unpacked = Tile.unpack(packed);
        assert.equal(typeof unpacked, 'object');
        assert.equal(unpacked instanceof Array, false);
      });
    });

    it('should be reversible', function() {
      testCases.forEach(function(test) {
        var packed = Tile.pack.apply(Tile, test.input);
        assert.deepEqual(Tile.unpack(packed), {
          type: test.input[0],
          height: test.input[1],
          veg: test.input[2]
        });
      });
    });
  });

  describe('#unpackArray', function() {
    var testCases;

    beforeEach(function() {
      testCases = [
        { input: [53, 49, 1] },
        { input: [111, 31, 0] },
        { input: [9, 5, 1] },
        { input: [16, 9, 0] }
      ];
    });

    it('should be a function', function() {
      assert.equal(typeof Tile.unpackArray, 'function');
    });

    it('should return an array', function() {
      testCases.forEach(function(test) {
        var packed = Tile.pack.apply(Tile, test.input);
        var unpacked = Tile.unpackArray(packed);
        assert.equal(unpacked instanceof Array, true);
      });
    });

    it('should be reversible', function() {
      testCases.forEach(function(test) {
        var packed = Tile.pack.apply(Tile, test.input);
        assert.deepEqual(Tile.unpackArray(packed), test.input);
      });
    });
  });
});
