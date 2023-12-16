from encode import encode_bool, encode_num, encode_str
from number import num_to_s
from type import dict_class, list_class, int_class, float_class, str_class, bool_class
from config import config

class InMemoryMemory:
  def __init__(self):
    self.store = []
    self.cache = []
    self.key_count = 0

def make_memory():
  mem = []
  return mem

def get_schema(mem, keys):
  if config.sort_key:
    keys = sorted(keys)
  schema = ','.join(keys)
  key_id = add_value(mem, keys, parent=None)
  return key_id, keys

def add_value(mem, o, parent):
  if o == None:
    return ''

  data_class = type(o)

  if data_class == list_class:
    acc = 'a'
    for v in o:
      key = '_' if v is None else add_value(mem, v, o)
      acc += '|' + key
    if acc == 'a':
      acc = 'a|'
    return get_value_key(mem, acc)

  if data_class == dict_class:
    keys = list(o.keys())
    if len(keys) == 0:
      return get_value_key(mem, 'o|')
    acc = 'o'
    key_id, keys = get_schema(mem, keys)
    acc += '|' + key_id
    for key in keys:
      value = o[key]
      v = add_value(mem, value, o)
      acc += '|' + v
    return get_value_key(mem, acc)

  if data_class == bool_class:
    return get_value_key(mem, encode_bool(o))

  if data_class == int_class or data_class == float_class:
    return get_value_key(mem, encode_num(o))

  if data_class == str_class:
    return get_value_key(mem, encode_str(o))

  raise Exception(f'unknown data type: {data_class}, o: {o}')

def get_value_key(mem, value):
  index = len(mem)
  mem.append(value)
  key = num_to_s(index)
  return key

def mem_to_values(mem):
  return mem
