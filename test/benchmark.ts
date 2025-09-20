// tslint:disable:no-console
import { shuffle } from '@beenotung/tslib/array'
import { compress, decode } from '../src/core'
import { decode as decode2 } from '../src/core2'

test()

function test() {
  console.time('prepare json data')
  const data = sample(10_000_000)
  console.timeEnd('prepare json data')

  console.time('compress')
  const compressed = compress(data)
  console.timeEnd('compress')

  const [values, root] = compressed

  let v1 = 0
  let v2 = 0
  let t0 = 0
  const batch = 1
  for (let i = 0; ; i++) {
    t0 = performance.now()
    for (let i = 0; i < batch; i++) {
      decode(values, root)
    }
    v1 += performance.now() - t0

    t0 = performance.now()
    for (let i = 0; i < batch; i++) {
      decode2(values, root)
    }
    v2 += performance.now() - t0

    if (i == 0) {
      // warmup
      v1 = 0
      v2 = 0
    } else {
      report()
    }
  }

  function report() {
    console.log()
    console.log('v1', v1)
    console.log('v2', v2)

    const speedup = v1 / v2
    console.log('speedup', speedup)
  }
}

function sample(n: number) {
  const data = new Array(n)
  for (let i = 0; i < n; i++) {
    data[i] = [Infinity, -Infinity, NaN, i + 1][i % 4]
  }
  return data
}
