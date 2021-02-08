import { config } from './config'
import { throwUnknownDataType } from './debug'
import { encodeBool, encodeNum, encodeStr } from './encode'
import { num_to_s } from './number'

type Parent = any[] | object
export type Key = string
export type Value = string | null

/**
 * potential implementation of store are:
 * - raw object ({})
 * - array
 * - Map
 * - localStorage
 * - lmdb
 * - leveldb (sync mode)
 * */
export interface Store {
  add(value: Value): void

  forEach(cb: (value: Value) => void | 'break'): void

  toArray(): Value[]
}

/**
 * potential implementation of cache are:
 * - raw object ({})
 * - array
 * - Map
 * - localStorage
 * - lmdb
 * - leveldb (sync mode)
 * */
export interface Cache {
  has(key: Key): boolean

  get(key: Key): Value | undefined

  set(key: Key, value: Value): void

  forEach(cb: (key: Key, value: any) => void | 'break'): void
}

export interface Memory {
  // key -> value
  store: Store
  // value -> key
  cache: Cache
  keyCount: number
}

export function memToValues(mem: Memory): Value[] {
  return mem.store.toArray()
}

export function makeInMemoryStore(): Store {
  const mem: Value[] = []
  return {
    forEach(cb: (value: Value) => void | 'break') {
      for (let i = 0; i < mem.length; i++) {
        if (cb(mem[i]) === 'break') {
          return
        }
      }
    },
    add(value: Value) {
      mem.push(value)
    },
    toArray(): Value[] {
      return mem
    },
  }
}

export function makeInMemoryCache(): Cache {
  const mem = {} as any
  return {
    get(key: any): any {
      return mem[key]
    },
    forEach(cb: (key: any, value: any) => void | 'break'): void {
      for (const [key, value] of Object.entries(mem)) {
        if (cb(key, value) === 'break') {
          return
        }
      }
    },
    set(key: any, value: any): void {
      mem[key] = value
    },
    has(key: any): boolean {
      return mem.hasOwnProperty(key)
    },
  }
}

export function makeInMemoryMemory(): Memory {
  return {
    store: makeInMemoryStore(),
    cache: makeInMemoryCache(),
    keyCount: 0,
  }
}

function getValueKey(mem: Memory, value: Value): Key {
  if (mem.cache.has(value!)) {
    return mem.cache.get(value!)!
  }
  const id = mem.keyCount++
  const key = num_to_s(id)
  mem.store.add(value)
  mem.cache.set(value!, key)
  return key
}

/** @remark in-place sort the keys */
function getSchema(mem: Memory, keys: string[]) {
  if (config.sort_key) {
    keys.sort()
  }
  const schema = keys.join(',')
  if (mem.cache.has(schema)) {
    return mem.cache.get(schema)
  }
  const key_id = addValue(mem, keys, undefined)
  mem.cache.set(schema, key_id)
  return key_id
}

export function addValue(mem: Memory, o: any, parent: Parent | undefined): Key {
  if (o === null) {
    return ''
  }
  switch (typeof o) {
    case 'undefined':
      if (Array.isArray(parent)) {
        return addValue(mem, null, parent)
      }
      break
    case 'object':
      if (o === null) {
        return getValueKey(mem, null)
      }
      if (Array.isArray(o)) {
        let acc = 'a'
        for (let i = 0; i < o.length; i++) {
          const v = o[i]
          acc += '|' + addValue(mem, v, o)
        }
        if (acc === 'a') {
          acc = 'a|'
        }
        return getValueKey(mem, acc)
      } else {
        const keys = Object.keys(o)
        if (keys.length === 0) {
          return getValueKey(mem, 'o|')
        }
        let acc = 'o'
        const key_id = getSchema(mem, keys)
        acc += '|' + key_id
        for (const key of keys) {
          const value = o[key]
          const v = addValue(mem, value, o)
          acc += '|' + v
        }
        return getValueKey(mem, acc)
      }
    case 'boolean':
      return getValueKey(mem, encodeBool(o))
    case 'number':
      return getValueKey(mem, encodeNum(o))
    case 'string':
      return getValueKey(mem, encodeStr(o))
  }
  return throwUnknownDataType(o)
}
