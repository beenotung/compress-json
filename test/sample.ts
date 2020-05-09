export function sample() {
  const longStr = 'A very very long string, that is repeated'
  const longNum = 9876543210.123456
  const sparse = []
  sparse[10] = 1
  return {
    rich: {
      int: 42,
      float: 12.34,
      str: 'Alice',
      longStr,
      longNum,
      bool: true,
      arr: [42, 12.34, 'Alice', true, false, longStr, longNum],
      obj: {
        id: 123,
        name: 'Alice',
        role: ['Admin', 'User', 'Guest'],
        longStr,
        longNum,
      },
      escape: ['s|str', 'n|123', 'o|1', 'a|1', 'b|T', 'b|F'],
    },
    conflict: {
      str: '1',
      num: 1,
    },
    sparse,
  }
}
