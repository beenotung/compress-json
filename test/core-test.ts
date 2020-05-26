import { compress, decompress } from '../src/core'
import { sample } from './sample'

export function test() {
  const data = sample()

  function test(name: keyof typeof data) {
    const x = data[name]
    const s = compress(x)
    const y = decompress(s)
    console.dir({ name, x, s }, { depth: 20 })
    if (JSON.stringify(x) !== JSON.stringify(y)) {
      console.error({ x, s, y })
      throw new Error('compress/decompress mismatch')
    }
  }

  test('rich')
  test('conflict')
  test('sparse')
  test('same_array')
  test('collection')

  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

test()
