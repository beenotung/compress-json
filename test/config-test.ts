import { config } from '../src/config'
import { compress, decompress } from '../src/core'

// test NaN
{
  /* default config */
  let c = compress([1, NaN, 2])
  let d = decompress(c)
  console.assert(d[1] === null, 'default config should convert NaN to null')

  /* config.preserve_nan = true */
  config.preserve_nan = true
  c = compress([1, NaN, 2])
  d = decompress(c)
  console.assert(
    Number.isNaN(d[1]),
    'config.preserve_nan = true should preserve NaN',
  )
}

// test Infinity
{
  /* default config */
  let c = compress([1, Infinity, -Infinity, 2])
  let d = decompress(c)
  console.assert(
    d[1] === null,
    'default config should convert Infinity to null',
  )
  console.assert(
    d[2] === null,
    'default config should convert -Infinity to null',
  )

  /* config.preserve_infinite = true */
  config.preserve_infinite = true
  c = compress([1, Infinity, -Infinity, 2])
  d = decompress(c)
  console.assert(
    d[1] === Infinity,
    'config.preserve_infinite = true should preserve Infinity',
  )
  console.assert(
    d[2] === -Infinity,
    'config.preserve_infinite = true should preserve -Infinity',
  )
}

console.log('finished config-test.ts')
