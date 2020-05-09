import { Key } from './memory'
import { num_to_s, s_to_int, s_to_num } from './number'

export function encodeNum(num: number): string {
  let a = 'n|' + num_to_s(num)
  return a
  // let b = num.toString()
  // return a.length < b.length ? a : num
}

export function decodeNum(s: string): number {
  s = s.replace('n|', '')
  return s_to_num(s)
}

export function decodeKey(key: Key): number {
  return typeof key === 'number'
    ? key
    : s_to_int(key)
}

export function encodeBool(b: boolean): string {
  // return 'b|' + bool_to_s(b)
  return b
    ? 'b|T'
    : 'b|F'
}

export function decodeBool(s: string): boolean {
  switch (s) {
    case 'b|T':
      return true
    case 'b|F':
      return false
  }
  return !!s
}

export function encodeStr(str: string): string {
  let prefix = str[0] + str[1]
  switch (prefix) {
    case 'b|':
    case 'o|':
    case 'n|':
    case 'a|':
    case 's|':
      str = 's|' + str
  }
  return str
}

export function decodeStr(s: string): string {
  return s.replace('s|', '')
}
