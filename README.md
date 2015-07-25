# tiny-binary-format
Memory efficient JS using binary formats instead of objects.

```
var BinaryFormat = require('tiny-binary-format');

var Tile = new BinaryFormat([
  { length: 8, name: 'type' },
  { length: 8, name: 'height' },
  { length: 1, name: 'vegetation' }
]);

Tile.pack(4, 48, 1);   // 000000100001100001 (2145)
Tile.unpack(2145);     // { type: 4, height: 48, vegetation: 1 }
Tile.unpackArray(2145) // [4, 48, 1]
```

This library is designed to be used as a very thin wrapper around dealing with binary data yourself.

Define a format by creating an instance of `BinaryFormat` and passing in your field specifications.

Then call the resulting object, passing instance data as arguments in order to create a binary representation.

When you need to read the values back, pass the number to either `.unpack` which returns the values in an object, or `.unpackArray` which returns them in an array.

## Install

```
npm install tiny-binary-format
```

## Error Handling
This module should be used for removing the _neccessity_ of working with bitwise operators when dealing with binary formats. It's not a framework and it won't hold your hand.

This module __does no error handling whatsoever__. If you pass in a 9 bit number into an 8 bit field, you'll lose precision silently. Use it carefully.

