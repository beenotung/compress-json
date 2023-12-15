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
  return int_to_s(num)

def s_to_num(s):
  if s[0] == '-':
    return -s_to_num(s[1:])
  return s_to_int(s)

def int_to_s(integer):
  if integer == 0:
    return i_to_s[0]
  acc = []
  while integer != 0:
    i = integer % N
    c = i_to_s[i]
    acc.append(c)
    integer = int(integer / N)
  return ''.join(acc[::-1])

def s_to_int(s):
  acc = 0
  pow = 1
  for i in range(len(s) - 1, -1, -1):
    c = s[i]
    x = s_to_i[c]
    x *= pow
    acc += x
    pow *= N
  return acc
