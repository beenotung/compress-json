import { Key } from './memory'
import { num_to_s, s_to_int, s_to_num } from './number'

export function encodeNum(num: number): string {
  if (num === Infinity) {
    return 'N|+'
  }
  if (num === -Infinity) {
    return 'N|-'
  }
  if (Number.isNaN(num)) {
    return 'N|0'
  }
  return 'n|' + num_to_s(num)
}

export function decodeNum(s: string): number {
  if (s.length === 3 && s[0] === 'N' && s[1] === '|') {
    switch (s[2]) {
      case '+':
        return Infinity
      case '-':
        return -Infinity
      case '0':
        return NaN
    }
  }
  return s_to_num(s.slice(2))
}

export function decodeKey(key: Key): number {
  return typeof key === 'number' ? key : s_to_int(key)
}

export function encodeBool(b: boolean): string {
  return b ? 'b|T' : 'b|F'
}

export function decodeBool(s: string): boolean {
  if (s.length === 3 && s[0] === 'b' && s[1] === '|') {
    switch (s[2]) {
      case 'T':
        return true
      case 'F':
        return false
    }
  }
  return !!s
}

export function encodeStr(str: string): string {
  if (str[1] === '|') {
    switch (str[0]) {
      case 'b':
      case 'o':
      case 'n':
      case 'a':
      case 's':
        return 's|' + str
    }
  }
  return str
}

export function decodeStr(s: string): string {
  return s[0] === 's' && s[1] === '|' ? s.substr(2) : s
}
