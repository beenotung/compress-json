import { throwUnknownDataType } from './debug'
import { decodeBool, decodeKey, decodeNum, decodeStr } from './encode'
import { addValue, Key, makeInMemoryMemory, Memory, memToValues, Value } from './memory'
import { sample } from './test'

export type Values = Value[]
export type Compressed = [Values, Key] // [values, root

export function compress(o: object): Compressed {
  let mem: Memory = makeInMemoryMemory()
  let root = addValue(mem, o, undefined)
  let values = memToValues(mem)
  return [values, root]
}

function decodeObject(values: Values, s: string) {
  if (s === 'o|') {
    return {}
  }
  let o = {} as any
  let vs = s.split('|')
  let n = vs.length
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
  let vs = s.split('|')
  let n = vs.length - 1
  let xs: any[] = new Array(n)
  for (let i = 0; i < n; i++) {
    let v = vs[i + 1]
    v = decode(values, v)
    xs[i] = v
  }
  return xs
}

function decode(values: Values, key: Key) {
  let id = decodeKey(key)
  let v = values[id]
  if (v === null) {
    return v
  }
  switch (typeof v) {
    case 'undefined':
      return v
    case 'number':
      return v
    case 'string':
      let prefix = v[0] + v[1]
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

export function test() {
  function test(x: any) {
    let s = compress(x)
    let y = decompress(s)
    if (JSON.stringify(x) !== JSON.stringify(y)) {
      console.error({ x, s, y })
      throw new Error('compress/decompress mismatch')
    }
  }

  let { rich, sparse, conflict } = sample()

  test(rich)
  test(conflict)
  test(sparse)

  console.log('pass:', __filename.replace(__dirname + '/', ''))
}

// test()
