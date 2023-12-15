import { mkdirSync, writeFileSync } from 'fs'
import { compress, decompress } from '../src/core'
import { sample } from './sample'
import { join } from 'path'

export function test() {
  const data = sample()
  let last_decompressed: any

  let dir = 'samples'
  mkdirSync(dir, { recursive: true })
  let i = 0
  function test_data(name: string, data: any) {
    const compressed = compress(data)
    const decompressed = decompress(compressed)
    console.dir({ name, data, compressed, decompressed }, { depth: 20 })
    if (JSON.stringify(data) !== JSON.stringify(decompressed)) {
      writeFileSync('data.json', JSON.stringify(data, null, 2))
      writeFileSync('compressed.json', JSON.stringify(compressed, null, 2))
      writeFileSync('decompressed.json', JSON.stringify(decompressed, null, 2))
      throw new Error('compress/decompress mismatch')
    }
    last_decompressed = decompressed
    i++
    writeFileSync(
      join(dir, `${i}.json`),
      JSON.stringify(
        {
          i,
          name,
          data,
          compressed,
        },
        null,
        2,
      ),
    )
  }

  function test(name: keyof typeof data) {
    test_data(name, data[name])
  }

  test('floating')
  test('rich')
  test('conflict')
  test('sparse')
  test('same_array')
  test('collection')

  // test for https://github.com/beenotung/compress-json/issues/2
  test_data('empty object', {})
  test_data('object with one key', { Name: 'Triangle-01' })
  test_data('nested object with one key', {
    Triangles: { Name: 'Triangle-01' },
  })
  test_data('nested object with same key', {
    Triangles: { Triangles: { Name: 'Triangle-01' } },
  })
  test_data('nested object and array with same key', {
    Triangles: { Triangles: [{ Name: 'Triangle-01' }] },
  })
  test_data('Single-key object using existing value as key', {
    Name: 'Start',
    Triangles: {
      Name: 'Triangle-01',
    },
  })
  test_data('Array using existing values used by object key', {
    obj: {
      id: 1,
      name: 'arr',
    },
    str: 'id,name',
  })

  test_data('Handle name conflict with Object.prototype', {
    toString: 1,
    valueOf: 2,
    hasOwnProperty: 3,
    constructor: 4,
    isPrototypeOf: 5,
    propertyIsEnumerable: 6,
  })

  // test for https://github.com/beenotung/compress-json/issues/5
  test_data('A string appears as both key and value', {
    'any-1': {
      'key-and-value': 'any-3',
    },
    'any-2': 'key-and-value',
  })
  test_data('empty array', [])
  test_data('array with a null element', [null])
  if (last_decompressed[0] !== null) {
    console.error('expected null, got undefined?')
    throw new Error('compress/decompress mismatch')
  }
  test_data('array with multiple null elements', [null, null])

  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

test()
