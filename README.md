# compress-json

Store JSON data in space efficient manner.

[![npm Package Version](https://img.shields.io/npm/v/compress-json.svg?maxAge=2592000)](https://www.npmjs.com/package/compress-json)

Inspired by [compressed-json](https://github.com/okunishinishi/node-compressed-json) and [jsonpack](https://github.com/rgcl/jsonpack).

This library is optimized to reduce represent json object in compact format, which can save network bandwidth and disk space.
It is not optimized for writing nor querying throughput.
Although the reduced IO may speed up usage of lmdb on frequently redundant data, that is not the design goal.

## Features
- Object key order is preserved
- Repeated values are stored only once
- Numbers are encoded in base62 format (0-9A-Za-z)
- Support multiple storage backend
    - in-memory object / array / Map
    - localStorage
    - lmdb
    - leveldb (sync mode)
    - custom adapter

## Installation
```bash
npm i -S compress-json
```

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
  body: JSON.stringify(compressed) // convert into string if needed
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
  obj: { // nested values are supported
    id: 123,
    name: 'Alice',
    role: [ 'Admin', 'User', 'Guest' ],
    longStr: 'A very very long string, that is repeated',
    longNum: 9876543210.123455
  },
  escape: [ 's|str', 'n|123', 'o|1', 'a|1', 'b|T', 'b|F' ]
}
```

**Compressed data**:
```typescript
// [ encoded value array, root value index ]
let compressed = [
  [  // encoded value array
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
    'o|B|C|D|E|F|G|H|I|J|J|T|a'
  ],
  'b' // root value index
]
```

## Benchmark

Test file: [compress-test.ts](./test/compress-test.ts)

Sample data in use: json data of 109,164 threads and 724,905 post crawled from a discuz forum. Truncated in varies of size for testing.

Algorithms in comparison:
- JSON  (`JSON.stringify` without indentation)
- compressed-json
- jsonpack
- compress-json (this library)

(Binary compression algorithm is not considered)

### Compressed Size
| sample  | JSON | compressed-json | jsonpack | **compress-json** |
|---|---|---|---|---|
|     all | 263M | 199M |    - | 176M |
| 100,000 | 235M | 178M |    - | 158M |
|  50,000 |  70M |  55M |    - |  50M |
|  10,000 |  34M |  26M |    - |  23M |
|   2,000 | 6.6M | 5.0M | 5.3M | 4.4M |
|   1,000 | 4.8M | 3.7M | 3.8M | 3.3M |
|     100 | 335K | 265K | 271K | 243K |
|      10 | 4.0K | 3.3K | 3.0K | 3.2K |

### Compression Time
| sample  | JSON | compressed-json | jsonpack | **compress-json** |
|---|---|---|---|---|
|     all | 1,654ms | 12,674ms | timeout* | 15,788ms |
| 100,000 | 1,500ms | 10,921ms | timeout* | 12,715ms |
|  50,000 |   462ms |  3,047ms | timeout* |  3,935ms |
|  10,000 |   146ms |  1,278ms | timeout* |  1,733ms |
|   2,000 |    35ms |    328ms | 21,018ms |    456ms |
|   1,000 |    20ms |    270ms | 12,960ms |    390ms |
|     100 |     1ms |     18ms |     47ms |     37ms |
|      10 |   0.3ms |    1.8ms |    1.6ms |    1.9ms |

*timeout: excess 1 minute

### Decompress Time
| sample  | JSON | compressed-json | jsonpack | **compress-json** |
|---|---|---|---|---|
|     all | 1,908ms | 4,611ms |     - | 9,225ms |
| 100,000 | 1,744ms | 3,740ms |     - | 7,576ms |
|  50,000 |   558ms | 1,066ms |     - | 2,452ms |
|  10,000 |   173ms |   460ms |     - | 1,055ms |
|   2,000 |    47ms |   108ms | 189ms |   317ms |
|   1,000 |    34ms |    90ms | 160ms |   263ms |
|     100 |     2ms |    11ms |  16ms |    19ms |
|      10 |   2.9ms |   2.1ms | 1.1ms |   1.3ms |

## License
[BSD 2-Clause License](./LICENSE) (Free Open Sourced Software)
