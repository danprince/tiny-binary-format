![Travis Status](https://travis-ci.org/danprince/tiny-binary-format.svg)

# tiny-binary-format
Memory efficient JS using binary formats instead of objects.

```js
var BinaryFormat = require('tiny-binary-format');

var Tile = new BinaryFormat([
  { length: 8, name: 'type' },
  { length: 8, name: 'height' },
  { length: 1, name: 'vegetation' }
]);

Tile.pack(4, 48, 1);
// 000000100001100001 (2145)

Tile.unpack(2145);
// { type: 4, height: 48, vegetation: 1 }

Tile.unpackArray(2145);
// [4, 48, 1]
```

This library is designed to be used as a very thin wrapper around dealing with binary data yourself.

Define a format by creating an instance of `BinaryFormat` and passing in your field specifications. Then call the resulting object, passing instance data as arguments in order to create a binary representation.

When you need to read the values back, pass the number to either `.unpack` which returns the values in an object, or `.unpackArray` which returns them in an array.

## Install

```bash
npm install tiny-binary-format
# or
bower install tiny-binary-format
```

## Gotchas
The module was designed for storing lightweight tile representations for games, however it could be used for a lot of other things too. Just remember that once the data has been serialized, __it will always be read back out as numbers__.

This module should be used for removing the _neccessity_ of working with bitwise operators when dealing with binary formats. It's not a framework and it won't hold your hand.

This module __does no error handling whatsoever__. If you care enough about performance to be using a binary format in the first place, then you'll appreciate the transparency of the pack and unpack methods.

However, this does mean that if you pass in a 9 bit number into an 8 bit field, you'll lose precision silently. Use it carefully.

As pointed out by [@dioxmat](https://twitter.com/dioxmat), you're still bound by the restrictions of [MAX_SAFE_INTEGER](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER). If you're dealing with integers greater than `2 ^ 53`, then expect things to break.

## FAQ
#### What if I need to store strings or objects too?
If you arrived here looking for a Javascript library for parsing binary format files that include lots of data types, you've come to the wrong place. Go and check out [binary-format](https://www.npmjs.com/package/binary-format)
#### It doesn't seem to work for 64 bit floating numbers?
That's because the Javascript bitwise operators don't either. For a quick workaround, use the [`64-bit-support` branch](https://github.com/danprince/tiny-binary-format/tree/64-bit-support).
#### What would be a good use case for this library?
This code was born from a game engine, read more about where it might be useful in the [accompanying blog blost](http://danthedev.com/2015/07/25/binary-in-javascript/).

