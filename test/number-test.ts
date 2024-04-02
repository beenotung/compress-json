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
    // to exponential bug reported in https://github.com/beenotung/compress-json/issues/12
    1.2e-9,
    1.2e-10,
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
  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

test()
