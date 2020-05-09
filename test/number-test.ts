import { num_to_s, s_to_num } from '../src/number'

export function test() {
  const xs = [1234567890, 987654321, 1234.4321]
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
