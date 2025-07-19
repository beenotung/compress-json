# compress-json-python

Store JSON data in space efficient manner.

[![PyPi Package Version](https://img.shields.io/pypi/v/compress-json-python)](https://pypi.org/project/compress-json-python)

This library is optimized to compress json object in compact format, which can save network bandwidth and disk space.

## Features

- Supports all JSON types
- Object key order is preserved
- Repeated values are stored only once
- Numbers are encoded in base62 format (0-9A-Za-z)
- Support custom backend for memory store and cache

### Special Values

- `null` is encoded as `''` (empty string)
- `undefined` is converted to `null` and encoded as `''` (empty string)
- `True` is encoded as `b|T`
- `False` is encoded as `b|F`
- `float('inf')` is encoded as `N|+`
- `float('-inf')` is encoded as `N|-`
- `float('nan')` is encoded as `N|0`

## Multi Language Implementation

This package is a python implementation of [compress-json](https://github.com/beenotung/compress-json). It is fully compatible with the npm package so the data compressed by either side can be decompressed by another side.

### All Implementations

- Javascript/Typescript: [source](https://github.com/beenotung/compress-json) / [package](https://www.npmjs.com/package/compress-json)
- PHP: [source](https://github.com/inkrot/php-compress-json) / [package](https://packagist.org/packages/inkrot/php-compress-json)
- Python: [source](https://github.com/beenotung/compress-json/tree/master/python) / [package](https://pypi.org/project/compress-json-python)
- Rust: [source](https://github.com/web-mech/compress-json-rs) / [package](https://crates.io/crates/compress-json-rs)
- C#: (TODO)

## Installation

```bash
pip install compress-json-python
```

## Usage Example

```python
# Import functions from the Python package
from compress_json import compress, decompress

data = {
  'user': 'Alice',
  # more fields of any json values (string, number, array, object, e.t.c.)
}

compressed = compress(data) # the result is a list (array)

import requests
requests.post('https://example.com/submit', json=compressed) # used as json value

import json
with open("data.json", "w") as fd:
	fd.write(json.dumps(compressed)) # convert into string if needed

reversed = decompress(compressed)
data === reversed # will be true
```

Detail example can refer to the demo [cli.py](./src/compress_json/cli.py) and tests in [core_test.py](./src/compress_json/core_test.py)

## Compression Format

**Sample data**:

```python
long_str = 'A very very long string, that is repeated'
data = {
  'int': 42,
  'float': 12.34,
  'str': 'Alice',
  'long_str': long_str,
  'longNum': 9876543210.123455,
  'bool': True,
  'bool2': False,
  'arr': [42, long_str],
  'arr2': [42, long_str], # identical values will be deduplidated, including array and object
  'obj': { # nested values are supported
    'id': 123,
    'name': 'Alice',
    'role': [ 'Admin', 'User', 'Guest' ],
    'long_str': 'A very very long string, that is repeated',
    'longNum': 9876543210.123455
  },
  'escape': [ 's|str', 'n|123', 'o|1', 'a|1', 'b|T', 'b|F' ]
}
```

**Compressed data**:

```python
# [ encoded value array, root value index ]
compressed = [
  [  # encoded value array
    'int', # string
    'float',
    'str',
    'long_str',
    'longNum',
    'bool',
    'bool2',
    'arr',
    'arr2',
    'obj',
    'escape',
    'a|0|1|2|3|4|5|6|7|8|9|A',
    'n|g', # number (integer) (base62-encoded)
    'n|C.h', # number (float) (integer part and decimals are base62-encoded separately)
    'Alice',
    'A very very long string, that is repeated',
    'n|AmOy42.2KCf',
    'b|T', # boolean (True)
    'b|F', # boolean (False)
    'a|C|F', # array
    'id',
    'name',
    'role',
    'a|K|L|M|3|4',
    'n|1z',
    'Admin',
    'User',
    'Guest',
    'a|P|Q|R',
    'o|N|O|E|S|F|G', # object
    's|s|str', # escaped string
    's|n|123', # escaped number
    's|o|1',
    's|a|1',
    's|b|T', # escaped boolean
    's|b|F',
    'a|U|V|W|X|Y|Z',
    'o|B|C|D|E|F|G|H|I|J|J|T|a'
  ],
  'b' # root value index
]
```

## Example structure for efficient compression

**Original JSON data**: (749 characters without white-spaces)

```json
{
  "count": 5,
  "names": ["New York", "London", "Paris", "Beijing", "Moscow"],
  "cities": [
    {
      "id": 1,
      "name": "New York",
      "countryName": "USA",
      "location": { "latitude": 40.714606, "longitude": -74.0028 },
      "localityType": "BIG_CITY"
    },
    {
      "id": 2,
      "name": "London",
      "countryName": "UK",
      "location": { "latitude": 51.507351, "longitude": -0.127696 },
      "localityType": "COUNTRY_CAPITAL"
    },
    {
      "id": 3,
      "name": "Paris",
      "countryName": "France",
      "location": { "latitude": 48.856663, "longitude": 2.351556 },
      "localityType": "COUNTRY_CAPITAL"
    },
    {
      "id": 4,
      "name": "Beijing",
      "countryName": "China",
      "location": { "latitude": 39.90185, "longitude": 116.391441 },
      "localityType": "COUNTRY_CAPITAL"
    },
    {
      "id": 5,
      "name": "Moscow",
      "countryName": "Russia",
      "location": { "latitude": 55.755864, "longitude": 37.617698 },
      "localityType": "COUNTRY_CAPITAL"
    }
  ]
}
```

**Compressed json**: (562 characters without white-spaces)

```json
[
  [
    "count",
    "names",
    "cities",
    "a|0|1|2",
    "n|5",
    "New York",
    "London",
    "Paris",
    "Beijing",
    "Moscow",
    "a|5|6|7|8|9",
    "id",
    "name",
    "countryName",
    "location",
    "localityType",
    "a|B|C|D|E|F",
    "n|1",
    "USA",
    "latitude",
    "longitude",
    "a|J|K",
    "n|e.2Xkv",
    "n|-1C.28G",
    "o|L|M|N",
    "BIG_CITY",
    "o|G|H|5|I|O|P",
    "n|2",
    "UK",
    "n|p.dz7",
    "n|-0.2vFR",
    "o|L|T|U",
    "COUNTRY_CAPITAL",
    "o|G|R|6|S|V|W",
    "n|3",
    "France",
    "n|m.1XNq",
    "n|2.2kQz",
    "o|L|a|b",
    "o|G|Y|7|Z|c|W",
    "n|4",
    "China",
    "n|d.F7F",
    "n|1s.bVh",
    "o|L|g|h",
    "o|G|e|8|f|i|W",
    "Russia",
    "n|t.1xtN",
    "n|b.3lHA",
    "o|L|l|m",
    "o|G|4|9|k|n|W",
    "a|Q|X|d|j|o",
    "o|3|4|A|p"
  ],
  "q"
]
```

In this example, compression saves 25% of characters. However, the more complex and repetitive the structure, the more characters can be saved.

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
