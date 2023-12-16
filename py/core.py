from encode import decode_key, decode_num, decode_str
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
    if prefix == 'o|':
      return decode_object(values, v)
    if prefix == 'n|':
      return decode_num(v)
    if prefix == 'a|':
      return decode_array(values, v)
    return decode_str(v)

  raise Exception(f"unknown data type: {data_class}, v: {v}")

def decode_object(values, s):
  if s == 'o|':
    return {}
  o = {}
  vs = s.split('|')
  key_id = vs[1]
  keys = decode(values, key_id)
  n = len(vs)
  if n - 2 == 1 and type(keys) != list_class:
    # single-key object using existing value as keys
    keys = [keys]
  i = 2
  while i < n:
    k = keys[i-2]
    v = vs[i]
    v = decode(values, v)
    o[k] = v
    i += 1
  return o

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
