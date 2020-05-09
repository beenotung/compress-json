export function s_to_bool(s: string): boolean {
  switch (s) {
    case 'T':
      return true
    case 'F':
      return false
  }
  return !!s
}

export function bool_to_s(bool: boolean): string {
  return bool ? 'T' : 'F'
}

export function test() {
  console.log({
    true: bool_to_s(true),
    false: bool_to_s(false),
    T: s_to_bool('T'),
    F: s_to_bool('F'),
  })
}

// test()
