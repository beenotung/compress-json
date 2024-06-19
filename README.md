# compress-json

Store JSON data in space efficient manner.

[![npm Package Version](https://img.shields.io/npm/v/compress-json.svg)](https://www.npmjs.com/package/compress-json)
[![Minified Package Size](https://img.shields.io/bundlephobia/min/compress-json)](https://bundlephobia.com/package/compress-json)
[![npm Package Downloads](https://img.shields.io/npm/dm/compress-json)](https://www.npmtrends.com/compress-json)

Inspired by [compressed-json](https://github.com/okunishinishi/node-compressed-json) and [jsonpack](https://github.com/rgcl/jsonpack).

This library is optimized to compress json object in compact format, which can save network bandwidth and disk space.
It is not optimized for writing nor querying throughput.
Although the reduced IO may speed up usage of lmdb on frequently redundant data, that is not the design goal.

## Features

- Supports all JSON types
- Object key order is preserved
- Repeated values are stored only once
- Numbers are encoded in base62 format (0-9A-Za-z)
- Support multiple storage backend
  - in-memory object / array / Map
  - localStorage
  - lmdb
  - leveldb (sync mode)
  - custom adapter

## All Implementations

- Javascript/Typescript: [source](https://github.com/beenotung/compress-json) / [package](https://www.npmjs.com/package/compress-json)
- PHP: [source](https://github.com/inkrot/php-compress-json) / [package](https://packagist.org/packages/inkrot/php-compress-json)
- Python: [source](https://github.com/beenotung/compress-json/tree/master/python) / [package](https://pypi.org/project/compress-json-python)
- C#: (TODO)

## Installation

You can install `compress-json` from npm:

```bash
npm i -S compress-json
```

Then import from typescript using named import or star import:

```typescript
import { compress, decompress } from 'compress-json'
import * as compressJSON from 'compress-json'
```

Or import from javascript as commonjs module:

```javascript
var compressJSON = require('compress-json')
```

You can also load `compress-json` directly in html via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/compress-json@3/bundle.js"></script>
<script>
  console.log(compressJSON)
  /*
  {
    // for direct usage
    compress,
    decompress,

    // for custom wrapper
    decode,
    addValue,

    // to remove undefined object fields
    trimUndefined,
    trimUndefinedRecursively,
  }
  */
</script>
```

If you do not intend to inspect the source of `compress-json`, you can load the minified version for smaller file size:

```html
<script src="https://cdn.jsdelivr.net/npm/compress-json@3/bundle.min.js"></script>
```

Details see [index.ts](./src/index.ts)

## Usage

```typescript
import { compress, decompress } from 'compress-json'

let data = {
  user: 'Alice',
  // more fields of any json values (string, number, array, object, e.t.c.)
}

let compressed = compress(data) // the result is an array
fetch('/submit', {
  method: 'post',
  body: JSON.stringify(compressed), // convert into string if needed
})

let reversed = decompress(compressed)
data === reversed // will be false
JSON.stringify(data) === JSON.stringify(reversed) // will be true
```

## Format

**Sample data**:

```typescript
let longStr = 'A very very long string, that is repeated'
let data = {
  int: 42,
  float: 12.34,
  str: 'Alice',
  longStr,
  longNum: 9876543210.123455,
  bool: true,
  bool2: false,
  arr: [42, longStr],
  arr2: [42, longStr], // identical values will be deduplidated, including array and object
  obj: {
    // nested values are supported
    id: 123,
    name: 'Alice',
    role: ['Admin', 'User', 'Guest'],
    longStr: 'A very very long string, that is repeated',
    longNum: 9876543210.123455,
  },
  escape: ['s|str', 'n|123', 'o|1', 'a|1', 'b|T', 'b|F'],
}
```

**Compressed data**:

```typescript
// [ encoded value array, root value index ]
let compressed = [
  [
    // encoded value array
    'int', // string
    'float',
    'str',
    'longStr',
    'longNum',
    'bool',
    'bool2',
    'arr',
    'arr2',
    'obj',
    'escape',
    'a|0|1|2|3|4|5|6|7|8|9|A',
    'n|g', // number (integer) (base62-encoded)
    'n|C.h', // number (float) (integer part and decimals are base62-encoded separately)
    'Alice',
    'A very very long string, that is repeated',
    'n|AmOy42.2KCf',
    'b|T', // boolean (true)
    'b|F', // boolean (false)
    'a|C|F', // array
    'id',
    'name',
    'role',
    'a|K|L|M|3|4',
    'n|1z',
    'Admin',
    'User',
    'Guest',
    'a|P|Q|R',
    'o|N|O|E|S|F|G', // object
    's|s|str', // escaped string
    's|n|123', // escaped number
    's|o|1',
    's|a|1',
    's|b|T', // escaped boolean
    's|b|F',
    'a|U|V|W|X|Y|Z',
    'o|B|C|D|E|F|G|H|I|J|J|T|a',
  ],
  'b', // root value index
]
```

## Helper Functions

```typescript
import { compress } from 'compress-json'
import { trimUndefined, trimUndefinedRecursively } from 'compress-json'

let user = { name: 'Alice', role: undefined }

compress(user) // will throw an error since undefined field is not supported

trimUndefined(user) // explicitly remove undefined fields

compress(user) // now it will not throw error since user.role is deleted

let a = { name: 'a', extra: undefined }
let b = { name: 'b', a }
trimUndefinedRecursively(b)
compress(b) // now it will not throw error since b.a.extra is deleted
```

## Config

```typescript
import { config } from 'compress-json'

// default will not sort the object key
config.sort_key = true

// default will convert into null silently like JSON.stringify
config.error_on_nan = true
config.error_on_infinite = true
```

## Benchmark

Test file: [compress-test.ts](./test/compress-test.ts)

Sample data in use: json data of 109,164 threads and 724,905 post crawled from a discuz forum. Truncated in varies of size for testing.

Algorithms in comparison:

- JSON (`JSON.stringify` without indentation)
- compressed-json
- jsonpack
- compress-json (this library)

(Binary compression algorithm is not considered)

### Compressed Size

| sample  | JSON | compressed-json | jsonpack | **compress-json** |
| ------- | ---- | --------------- | -------- | ----------------- |
| all     | 263M | 199M            | -        | 176M              |
| 100,000 | 235M | 178M            | -        | 158M              |
| 50,000  | 70M  | 55M             | -        | 50M               |
| 10,000  | 34M  | 26M             | -        | 23M               |
| 2,000   | 6.6M | 5.0M            | 5.3M     | 4.4M              |
| 1,000   | 4.8M | 3.7M            | 3.8M     | 3.3M              |
| 100     | 335K | 265K            | 271K     | 243K              |
| 10      | 4.0K | 3.3K            | 3.0K     | 3.2K              |

### Compression Time

| sample  | JSON    | compressed-json | jsonpack  | **compress-json** |
| ------- | ------- | --------------- | --------- | ----------------- |
| all     | 1,654ms | 12,674ms        | timeout\* | 15,788ms          |
| 100,000 | 1,500ms | 10,921ms        | timeout\* | 12,715ms          |
| 50,000  | 462ms   | 3,047ms         | timeout\* | 3,935ms           |
| 10,000  | 146ms   | 1,278ms         | timeout\* | 1,733ms           |
| 2,000   | 35ms    | 328ms           | 21,018ms  | 456ms             |
| 1,000   | 20ms    | 270ms           | 12,960ms  | 390ms             |
| 100     | 1ms     | 18ms            | 47ms      | 37ms              |
| 10      | 0.3ms   | 1.8ms           | 1.6ms     | 1.9ms             |

\*timeout: excess 1 minute

### Decompress Time

| sample  | JSON    | compressed-json | jsonpack | **compress-json** |
| ------- | ------- | --------------- | -------- | ----------------- |
| all     | 1,908ms | 4,611ms         | -        | 9,225ms           |
| 100,000 | 1,744ms | 3,740ms         | -        | 7,576ms           |
| 50,000  | 558ms   | 1,066ms         | -        | 2,452ms           |
| 10,000  | 173ms   | 460ms           | -        | 1,055ms           |
| 2,000   | 47ms    | 108ms           | 189ms    | 317ms             |
| 1,000   | 34ms    | 90ms            | 160ms    | 263ms             |
| 100     | 2ms     | 11ms            | 16ms     | 19ms              |
| 10      | 2.9ms   | 2.1ms           | 1.1ms    | 1.3ms             |

## License

[BSD 2-Clause License](./LICENSE) (Free Open Sourced Software)
