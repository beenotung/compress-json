import { shuffle } from '@beenotung/tslib/array'
import { compress, decompress } from '../src/core'

test()

function test() {
  console.time('prepare json data')
  const data = sample(5_000_000)
  console.timeEnd('prepare json data')

  console.time('compress')
  const compressed = compress(data)
  console.timeEnd('compress')

  console.time('decompress')
  const decompressed = decompress(compressed)
  console.timeEnd('decompress')
}

function sample(n: number) {
  let data = new Array(n)
  for (let i = 0; i < n; i++) {
    data[i] = i + 1
  }
  return shuffle(data)
}
