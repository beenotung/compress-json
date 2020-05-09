# compress-json

Store JSON data in space efficient manner.

[![npm Package Version](https://img.shields.io/npm/v/compress-json.svg?maxAge=2592000)](https://www.npmjs.com/package/compress-json)

Inspired by [compressed-json](https://github.com/okunishinishi/node-compressed-json) and [jsonpack](https://github.com/rgcl/jsonpack).

This library is optimized to reduce represent json object in compact format, which can save network bandwidth and disk space.
It is not optimized for writing nor querying throughput.
Although the reduced IO may speed up usage of lmdb on frequently redundant data, that is not the design goal.

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
let data = {
  int: 42,
  float: 12.34,
  str: 'Alice',
  longStr: 'A very very long string, that is repeated',
  longNum: 9876543210.123455,
  bool: true,
  arr: [
    42,
    12.34,
    'Alice',
    true,
    false,
    'A very very long string, that is repeated',
    9876543210.123455
  ],
  obj: {
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
    'n|g', // number (integer) (base62-encoded)
    'float',
    'n|C.h', // number (float) (integer part and decimals are base62-encoded separately)
    'str',
    'Alice',
    'longStr',
    'A very very long string, that is repeated',
    'longNum',
    'n|AmOy42.2KCf',
    'bool',
    'b|T', // boolean (true)
    'arr',
    'b|F', // boolean (false)
    'a|1|3|5|B|D|7|9', // array
    'obj',
    'id',
    'n|1z',
    'name',
    'role',
    'Admin',
    'User',
    'Guest',
    'a|K|L|M',
    'o|G|H|I|5|J|N|6|7|8|9', // object
    'escape',
    's|s|str', // string (escaped)
    's|n|123',
    's|o|1',
    's|a|1',
    's|b|T',
    's|b|F',
    'a|Q|R|S|T|U|V',
    'o|0|1|2|3|4|5|6|7|8|9|A|B|C|E|F|O|P|W'
  ],
  'X' // root value index
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
|     all | 263M | 199M |    - | 180M |
| 100,000 | 235M | 178M |    - | 162M |
|  50,000 |  70M |  55M |    - |  51M |
|  10,000 |  34M |  26M |    - |  24M |
|   2,000 | 6.6M | 5.0M | 5.3M | 4.7M |
|   1,000 | 4.8M | 3.7M | 3.8M | 3.5M |
|     100 | 335K | 265K | 271K | 251K |
|      10 | 4.0K | 3.3K | 3.0K | 3.4K |

### Compression Time
| sample  | JSON | compressed-json | jsonpack | **compress-json** |
|---|---|---|---|---|
|     all | 1,654ms | 12,674ms | timeout* | 20,208ms |
| 100,000 | 1,500ms | 10,921ms | timeout* | 16,773ms |
|  50,000 |   462ms |  3,047ms | timeout* |  5,127ms |
|  10,000 |   146ms |  1,278ms | timeout* |  2,097ms |
|   2,000 |    35ms |    328ms | 21,018ms |    520ms |
|   1,000 |    20ms |    270ms | 12,960ms |    487ms |
|     100 |     1ms |     18ms |     47ms |     35ms |
|      10 |   0.3ms |    1.8ms |    1.6ms |    2.4ms |

*timeout: excess 1 minute

### Decompress Time
| sample  | JSON | compressed-json | jsonpack | **compress-json** |
|---|---|---|---|---|
|     all | 1,908ms | 4,611ms |     - | 9,085ms |
| 100,000 | 1,744ms | 3,740ms |     - | 7,707ms |
|  50,000 |   558ms | 1,066ms |     - | 2,900ms |
|  10,000 |   173ms |   460ms |     - | 1,144ms |
|   2,000 |    47ms |   108ms | 189ms |   347ms |
|   1,000 |    34ms |    90ms | 160ms |   297ms |
|     100 |     8ms |    11ms |  16ms |    22ms |
|      10 |   2.9ms |   2.1ms | 1.1ms |   1.2ms |

