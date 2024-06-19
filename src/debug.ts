export function getType(o: any) {
  return Object.prototype.toString.call(o)
}

export function throwUnknownDataType(o: any): never {
  throw new TypeError('unsupported data type: ' + getType(o))
}

export function throwUnsupportedData(name: string): never {
  throw new TypeError('unsupported data type: ' + name)
}
