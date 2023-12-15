from encode import decode_key, decode_num
from memory import make_memory, add_value, mem_to_values
from type import int_class, float_class, str_class

def compress(o):
  mem = make_memory()
  root = add_value(mem, o, parent=None)
  values = mem_to_values(mem)
  return [values, root]

def decompress(c):
  [values, root] = c
  return decode(values, root)

def decode(values, key):
  if key == '' or key == '_':
    return None

  id = decode_key(key)
  v = values[id]

  if v is None:
    return v

  data_class = type(v)

  if data_class == int_class or data_class == float_class:
    return v

  if data_class == str_class:
    prefix = v[0:2]
    if prefix == 'n|':
      return decode_num(v)
    if prefix == 'a|':
      return decode_array(values, v)

  raise Exception(f"unknown data type: {data_class}")

def decode_array(values, s):
  if s == 'a|':
    return []

  vs = s.split('|')
  n = len(vs) - 1
  xs = []
  for i in range(0, n):
    v = vs[i+1]
    v = decode(values, v)
    xs.append(v)
  return xs
