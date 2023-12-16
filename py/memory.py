from encode import encode_bool, encode_num, encode_str
from number import num_to_s
from type import dict_class, list_class, int_class, float_class, str_class, bool_class
from config import config

class InMemoryStore:
  def __init__(self):
    self.mem = []

  def add(self, value):
    self.mem.append(value)

  def to_array(self):
    return self.mem

class InMemoryCache:
  def __init__(self):
    self.schema_mem = {}
    self.value_mem = {}

  def get_value(self, key):
    return self.value_mem[key]

  def get_schema(self, key):
    return self.schema_mem[key]

  def set_value(self, key, value):
    self.value_mem[key] = value

  def set_schema(self, key, value):
    self.schema_mem[key] = value

  def has_value(self, key):
    return key in self.value_mem

  def has_scheme(self, key):
    return key in self.schema_mem

class InMemoryMemory:
  def __init__(self):
    self.store = InMemoryStore()
    self.cache = InMemoryCache()
    self.key_count = 0

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
    empty_value = '' if is_sparse_array(o) else '_'
    for v in o:
      key = empty_value if v is None else add_value(mem, v, o)
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
  if mem.cache.has_value(value):
    return mem.cache.get_value(value)
  id = mem.key_count
  mem.key_count += 1
  key = num_to_s(id)
  mem.store.add(value)
  mem.cache.set_value(value, key)
  return key

def mem_to_values(mem):
  return mem.store.to_array()

def is_sparse_array(array):
  return len(array) > 0 and array[-1] is not None
