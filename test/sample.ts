import { allNames } from '@beenotung/tslib/constant/character-name'
import { Random } from '@beenotung/tslib/random'
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
      bool2: false,
      arr: [42, longStr],
      arr2: [42, longStr],
      obj: {
        id: 123,
        name: 'Alice',
        role: ['Admin', 'User', 'Guest'],
        longStr,
        longNum,
      },
      escape: ['s|str', 'n|123', 'o|1', 'a|1', 'b|T', 'b|F', '...s|...'],
    },
    conflict: {
      str: '1',
      num: 1,
    },
    sparse,
    same_array: {
      arr_1: [1, 2, 3, 4, 5],
      arr_2: [1, 2, 3, 4, 5],
    },
    collection: new Array(10).fill(0).map((_, i) => ({
      user_id: i + 1,
      name: Random.element(allNames),
      region: 'HK',
      role: 'user',
      more: 'fields',
    })),
  }
}
