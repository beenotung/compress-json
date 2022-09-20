let i_to_s = ''
for (let i = 0; i < 10; i++) {
  const c = String.fromCharCode(48 + i)
  i_to_s += c
}
for (let i = 0; i < 26; i++) {
  const c = String.fromCharCode(65 + i)
  i_to_s += c
}
for (let i = 0; i < 26; i++) {
  const c = String.fromCharCode(65 + 32 + i)
  i_to_s += c
}
const N = i_to_s.length
const s_to_i: Record<string, number> = {}
for (let i = 0; i < N; i++) {
  const s = i_to_s[i]
  s_to_i[s] = i
}

export function s_to_int(s: string): number {
  let acc = 0
  let pow = 1
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s[i]
    let x = s_to_i[c]
    x *= pow
    acc += x
    pow *= N
  }
  return acc
}

export function s_to_big_int(s: string): bigint {
  let acc = BigInt(0)
  let pow = BigInt(1)
  const n = BigInt(N)
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s[i]
    let x = BigInt(s_to_i[c])
    x *= pow
    acc += x
    pow *= n
  }
  return acc
}

export function int_to_s(int: number): string {
  if (int === 0) {
    return i_to_s[0]
  }
  const acc: string[] = []
  while (int !== 0) {
    const i = int % N
    const c = i_to_s[i]
    acc.push(c)
    int -= i
    int /= N
  }
  return acc.reverse().join('')
}

export function big_int_to_s(int: bigint): string {
  const zero = BigInt(0)
  const n = BigInt(N)
  if (int === zero) {
    return i_to_s[0]
  }
  const acc: string[] = []
  while (int !== zero) {
    const i = int % n
    const c = i_to_s[Number(i)]
    acc.push(c)
    int -= i
    int /= n
  }
  return acc.reverse().join('')
}

function reverse(s: string): string {
  return s.split('').reverse().join('')
}

export function num_to_s(num: number | bigint): string {
  if (num < 0) {
    return '-' + num_to_s(-num)
  }
  if (typeof num === 'bigint') {
    return ':' + big_int_to_s(num)
  }
  let [a, b] = num.toString().split('.')
  if (!b) {
    return int_to_s(num)
  }
  a = int_str_to_s(a)
  b = reverse(b)
  b = int_str_to_s(b)
  return a + '.' + b
}

export function int_str_to_s(int_str: string): string {
  const num = +int_str
  if (num.toString() === int_str) {
    return int_to_s(num)
  }
  return ':' + big_int_to_s(BigInt(int_str))
}

function s_to_int_or_bigint(s: string): number | bigint {
  if (s[0] === ':') {
    return s_to_big_int(s.substring(1))
  }
  return s_to_int(s)
}

export function s_to_num(s: string): number | bigint {
  if (s[0] === '-') {
    return -s_to_num(s.substr(1))
  }
  let [a, b] = s.split('.')
  if (!b) {
    return s_to_int_or_bigint(a)
  }
  a = s_to_int_or_bigint(a).toString()
  b = s_to_int_or_bigint(b).toString()
  b = reverse(b)
  return +(a + '.' + b)
}
