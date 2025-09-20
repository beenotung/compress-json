import { throwUnknownDataType } from './debug'
import { decodeBool, decodeKey, decodeStr } from './encode'
import {
  addValue,
  Key,
  makeInMemoryMemory,
  Memory,
  memToValues,
  Value,
} from './memory'
import { s_to_num } from './number'

export type Values = Value[]
export type Compressed = [Values, Key] // [values, root]

export function compress(o: object): Compressed {
  const mem: Memory = makeInMemoryMemory()
  const root = addValue(mem, o, undefined)
  const values = memToValues(mem)
  return [values, root]
}

function decodeObject(values: Values, s: string) {
  if (s === 'o|') {
    return {}
  }
  const o = {} as any
  const vs = s.split('|')
  const key_id = vs[1]
  let keys = decode(values, key_id)
  const n = vs.length
  if (n - 2 === 1 && !Array.isArray(keys)) {
    // single-key object using existing value as key
    keys = [keys]
  }
  for (let i = 2; i < n; i++) {
    const k = keys[i - 2]
    let v = vs[i]
    v = decode(values, v)
    o[k] = v
  }
  return o
}

function decodeArray(values: Values, s: string) {
  if (s === 'a|') {
    return []
  }
  const vs = s.split('|')
  const n = vs.length - 1
  const xs: any[] = new Array(n)
  for (let i = 0; i < n; i++) {
    let v = vs[i + 1]
    v = decode(values, v)
    xs[i] = v
  }
  return xs
}

export function decode(values: Values, key: Key) {
  if (key === '' || key === '_') {
    return null
  }
  const id = decodeKey(key)
  const v = values[id]
  if (v === null) {
    return v
  }
  switch (typeof v) {
    case 'undefined':
      return v
    case 'number':
      return v
    case 'string':
      if (v[1] === '|') {
        switch (v[0]) {
          case 'b': {
            switch (v[2]) {
              case 'T': // b|T
                return true
              case 'F': // b|F
                return false
              default:
                return throwUnknownDataType(v)
            }
          }
          case 'o':
            return decodeObject(values, v)
          case 'n': // n|xxx
            return s_to_num(v.slice(2))
          case 'N': {
            switch (v[2]) {
              case '+': // N|+
                return Infinity
              case '-': // N|-
                return -Infinity
              case '0': // N|0
                return NaN
              default:
                return throwUnknownDataType(v)
            }
          }
          case 'a':
            return decodeArray(values, v)
        }
      }
      return decodeStr(v)
  }
  return throwUnknownDataType(v)
}

export function decompress<TReturn = any>(c: Compressed): TReturn {
  const [values, root] = c
  return decode(values, root)
}
