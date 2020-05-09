import { compress, decompress } from '../src/core'
import { sample } from './sample'

export function test() {
  function test(x: any) {
    const s = compress(x)
    const y = decompress(s)
    console.dir({ x, s }, { depth: 20 })
    if (JSON.stringify(x) !== JSON.stringify(y)) {
      console.error({ x, s, y })
      throw new Error('compress/decompress mismatch')
    }
  }

  const { rich, sparse, conflict } = sample()

  test(rich)
  test(conflict)
  test(sparse)

  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

test()
