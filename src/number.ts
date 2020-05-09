let i_to_s = ''
for (let i = 0; i < 10; i++) {
  let c = String.fromCharCode(48 + i)
  i_to_s += c
}
for (let i = 0; i < 26; i++) {
  let c = String.fromCharCode(65 + i)
  i_to_s += c
}
for (let i = 0; i < 26; i++) {
  let c = String.fromCharCode(65 + 32 + i)
  i_to_s += c
}
let N = i_to_s.length
let s_to_i: Record<string, number> = {}
for (let i = 0; i < N; i++) {
  let s = i_to_s[i]
  s_to_i[s] = i
}

export function s_to_int(s: string): number {
  let acc = 0
  let pow = 1
  for (let i = s.length - 1; i >= 0; i--) {
    let c = s[i]
    let x = s_to_i[c]
    x *= pow
    acc += x
    pow *= N
  }
  return acc
}

export function int_to_s(int: number): string {
  if (int === 0) {
    return i_to_s[0]
  }
  let acc: string[] = []
  while (int !== 0) {
    let i = int % N
    let c = i_to_s[i]
    acc.push(c)
    int -= i
    int /= N
  }
  return acc.reverse().join('')
}

function reverse(s: string): string {
  return s.split('').reverse().join('')
}

export function num_to_s(num: number): string {
  let [a, b] = num.toString().split('.')
  if (!b) {
    return int_to_s(num)
  }
  a = int_to_s(+a)
  b = reverse(b)
  b = int_to_s(+b)
  return a + '.' + b
}

export function s_to_num(s: string): number {
  let [a, b] = s.split('.')
  if (!b) {
    return s_to_int(a)
  }
  a = s_to_int(a).toString()
  b = s_to_int(b).toString()
  b = reverse(b)
  return +(a + '.' + b)
}

export function test() {
  let xs = [
    1234567890,
    987654321,
    1234.4321,
  ]
  for (let x of xs) {
    let s = num_to_s(x)
    let y = s_to_num(s)
    if (x !== y) {
      console.error({ x, s, y })
      throw new Error('incorrect encode/decode')
    }
    console.log(x, '->', s)
  }
  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

// test()
