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

def encode_str(string):
  prefix = string[0:2]
  if (
    prefix == 'b|' or
    prefix == 'o|' or
    prefix == 'n|' or
    prefix == 'a|' or
    prefix == 's|'
  ):
    return 's|' + string
  return string

def decode_str(string):
  prefix = string[0:2]
  if prefix == 's|':
    return string[2:]
  return string

def encode_bool(b):
  return 'b|T' if b else 'b|F'

def decode_bool(s):
  if s == 'b|T':
    return True
  if s == 'b|F':
    return False
  return not not s
