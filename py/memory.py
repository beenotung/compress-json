from encode import encode_num
from number import num_to_s
from type import dict_class, list_class, float_class



def make_memory():
  mem = []
  return mem


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

  if data_class == float_class:
    return get_value_key(mem, encode_num(o))

  raise Exception('unknown data type: ' + str(data_class))

def get_value_key(mem, value):
  index = len(mem)
  mem.append(value)
  key = num_to_s(index)
  return key

def mem_to_values(mem):
  return mem
