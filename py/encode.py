from number import num_to_s, s_to_int, s_to_num
from type import int_class, float_class


def encode_num(num):
  return 'n|' + num_to_s(num)

def decode_num(s):
  s = s.replace('n|', '')
  return s_to_num(s)


def decode_key(key):
  if type(key) == int_class:
    return key

  if type(key) == float_class:
    return int(key)

  return s_to_int(key)
