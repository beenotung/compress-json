import { decodeNum, encodeNum } from '../src/encode'
import { num_to_s, s_to_num } from '../src/number'

export function test() {
  // prettier-ignore
  const xs = [
    1234567890,
    987654321,
    1234.4321,
    -5,
    // to test precision bug reported in https://github.com/beenotung/compress-json/issues/3
    0.12371134020618557,
    // to test exponential number suggested in https://github.com/beenotung/compress-json/issues/9
    1.23456789123789e22,
    // to test exponential bug reported in https://github.com/beenotung/compress-json/issues/12
    1.2e-9,
    1.2e-10,
    // to test exponential bug reported in https://github.com/beenotung/compress-json/issues/22
    1e21,
    2e-13,
    // to test overflow bug reported in https://github.com/beenotung/compress-json/issues/16
    1 / 12,
    // to test recurring and non terminating number reported in https://github.com/beenotung/compress-json/issues/23
    1 / 3,
  ]
  for (const x of xs) {
    const s = num_to_s(x)
    const y = s_to_num(s)
    if (x !== y) {
      console.error({ x, s, y })
      throw new Error('incorrect encode/decode')
    }
    console.log(x, '->', s)
  }

  // to test infinity number reported in https://github.com/beenotung/compress-json/issues/23
  let edge_values = [
    1 / 0, // Infinity
    -1 / 0, // -Infinity
    0 / 0, // NaN
  ]
  for (let value of edge_values) {
    let str = encodeNum(value)
    let decoded = decodeNum(str)
    if (decoded.toString() !== value.toString()) {
      console.error({ value, str, decoded })
      throw new Error('incorrect encode/decode')
    }
    console.log(value, '->', str)
  }

  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

test()
