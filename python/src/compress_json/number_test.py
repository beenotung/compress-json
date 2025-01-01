from number import num_to_s, s_to_num

def test(num, expected_s):
  s = num_to_s(num)

  if not s == expected_s:
    raise Exception(f"[num_to_s fail] num: {num}, expected_s: {expected_s} s: {s}")

  decoded_num = s_to_num(s)

  if not num == decoded_num:
    raise Exception(f"[s_to_num fail] num: {num}, s: {s}, decoded_num: {decoded_num}")

  print("[pass]", num)

# single digit positive integer
## 0-9
test(0, '0')
test(1, '1')
test(9, '9')
## A-Z
test(10, 'A')
test(11, 'B')
test(35, 'Z')
## a-z
test(36, 'a')
test(37, 'b')
test(61, 'z')

# single digit negative integer
test(-1, '-1')
test(-61, '-z')

# multi-digit positive integer
test(62, '10')
test(63, '11')
test(3843, 'zz')
test(3844, '100')

# multi-digit negative integer
test(-62, '-10')
test(-63, '-11')
test(-3843, '-zz')
test(-3844, '-100')

# floating number without fractional part
test(1.0, '1')

# positive floating number
test(1.5, '1.5')
test(3.1, '3.1')
test(3.01, '3.A')
test(3.3483, '3.zz')
test(10.3483, 'A.zz')
test(62.3483, '10.zz')

# negative floating number
test(-3.1, '-3.1')
test(-3.01, '-3.A')
test(-62.3483, '-10.zz')

# exponential representation
test( 1.23456789123789e+22,  "1.S2Ec8DtI.M")
test( 1.23456789123789e-22,  "1.S2Ec8DtI.-M")
test(-1.23456789123789e+22, "-1.S2Ec8DtI.M")
test(-1.23456789123789e-22, "-1.S2Ec8DtI.-M")
test(1.2e-9,  '1.2.-9')
test(1.2e-10, '1.2.-A')

# exponential number without fractional part
test(1e21, '1.0.L')
test(2e-13, '2.0.-D')

# floating number requiring bigint in fraction part
test(0.032989690721649485, "0.:hD3gasB3de")
