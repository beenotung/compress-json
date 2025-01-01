from .type import int_class

i_to_s = ''

for i in range(0, 10):
  i_to_s += str(i)

for i in range(0, 26):
  i_to_s += chr(65 + i)

for i in range(0, 26):
  i_to_s += chr(65 + i + 32)

N = len(i_to_s)

s_to_i = {}
for i in range(0, N):
  s = i_to_s[i]
  s_to_i[s] = i

def num_to_s(num):
  if num < 0:
    return '-' + num_to_s(-num)

  parts = str(float(num)).split('.')
  if len(parts) == 1:
    if 'e' in parts[0]:
      [a] = parts
      # e.g. 2e-13 -> 2.0e-13
      [a1, a2] = a.split('e')
      a = a1
      b = '0e' + a2
    else:
      return int_to_s(num)
  else:
    [a, b] = parts

  if b == '0':
    if type(num) == int_class:
      return int_to_s(num)
    return int_str_to_s(a)

  parts = b.split('e')
  if len(parts) == 1:
    c = '0'
  else:
    [b, c] = parts

  a = int_str_to_s(a)

  b = b[::-1]
  b = int_str_to_s(b)

  string = a + '.' + b

  if c != '0':
    string += '.'
    if c[0] == '+':
      c = c[1:]
    elif c[0] == '-':
      string += '-'
      c = c[1:]
    c = int_str_to_s(c)
    string += c

  return string

max_int = 2**53

def int_str_to_s(int_str):
  integer = int(int_str)
  if integer <= max_int:
    return int_to_s(integer)
  return ':' + int_to_s(integer)

def s_to_int_str(s):
  if s[0] == ':':
    s = s[1:]
  return str(s_to_int(s))

def s_to_num(s):
  if s[0] == '-':
    return -s_to_num(s[1:])

  parts = s.split('.')
  length = len(parts)

  if length == 1:
    return s_to_int(s)


  a = s_to_int_str(parts[0])

  b = s_to_int_str(parts[1])
  b = b[::-1]

  string = a + '.' + b

  if length == 3:
    string += 'e'
    neg = False
    c = parts[2]
    if c[0] == '-':
      neg = True
      c = c[1:]
    c = s_to_int_str(c)
    if neg:
      string += '-' + c
    else:
      string += c

  if '.' in string:
    return float(string)
  else:
    return int(string)

def int_to_s(integer):
  if integer == 0:
    return i_to_s[0]
  acc = []
  while integer != 0:
    i = integer % N
    # check if integer is indeed an exponential big number
    if type(i) == float:
      int_val = int(i)
      float_val = float(int_val)
      if i != float_val:
        raise Exception(f"precision loss when int_to_s({integer})")
      i = int_val
    c = i_to_s[i]
    acc.append(c)
    integer //= N
  return ''.join(acc[::-1])

def s_to_int(s) -> int:
  acc = 0
  pow = 1
  for i in range(len(s) - 1, -1, -1):
    c = s[i]
    x = s_to_i[c]
    x *= pow
    acc += x
    pow *= N
  return acc
