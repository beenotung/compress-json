import { throwUnknownDataType } from './debug'
import { decodeBool, decodeKey, decodeNum, decodeStr } from './encode'
import {
  addValue,
  Key,
  makeInMemoryMemory,
  Memory,
  memToValues,
  Value,
} from './memory'

export type Values = Value[]
export type Compressed = [Values, Key] // [values, root

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
  const n = vs.length
  for (let i = 1; i < n; i += 2) {
    let k = vs[i]
    k = decode(values, k)
    let v = vs[i + 1]
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

function decode(values: Values, key: Key) {
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
      const prefix = v[0] + v[1]
      switch (prefix) {
        case 'b|':
          return decodeBool(v)
        case 'o|':
          return decodeObject(values, v)
        case 'n|':
          return decodeNum(v)
        case 'a|':
          return decodeArray(values, v)
        default:
          return decodeStr(v)
      }
  }
  return throwUnknownDataType(v)
}

export function decompress(c: Compressed) {
  const [values, root] = c
  return decode(values, root)
}
