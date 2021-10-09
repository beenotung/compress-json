import { writeFileSync } from 'fs'
import { compress, decompress } from '../src/core'
import { sample } from './sample'

export function test() {
  const data = sample()

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

  // debug for https://github.com/beenotung/compress-json/issues/2
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
    // hasOwnProperty: 3, // FIXME
    constructor: 4,
    isPrototypeOf: 5,
    propertyIsEnumerable: 6,
  })

  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

test()
