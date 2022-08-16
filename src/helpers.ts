export function trimUndefined<T extends object>(object: T) {
  for (const key in object) {
    if (object[key] === undefined) {
      delete object[key]
    }
  }
}

export function trimUndefinedRecursively<T extends object>(object: T) {
  trimUndefinedRecursivelyLoop(object, new Set())
}

function trimUndefinedRecursivelyLoop<T extends object>(
  object: T,
  tracks: Set<object>,
) {
  tracks.add(object)
  for (const key in object) {
    if (object[key] === undefined) {
      delete object[key]
    } else {
      const value: object = object[key] as any
      if (value && typeof value === 'object' && !tracks.has(value)) {
        trimUndefinedRecursivelyLoop(value, tracks)
      }
    }
  }
}
