# %%
## import library

import os
import json


# %%
## generate samples

os.system("npx ts-node ../test/core-test.ts")


# %%
## helper functions for testing

int_class = type(1)
float_class = type(1.0)

def is_same(a, b):
  a_class = type(a)
  b_class = type(b)

  if a_class == int_class and b_class == float_class:
    a = float(a)
  elif a_class == float_class and b_class == int_class:
    b = float(b)

  return a == b

# %%
## test is_same

def test_is_same(name, a, b, expected_match = False):
  if not is_same(a, a):
    raise Exception(f"is_same failed for {name} test case (a, a)")

  if not is_same(b, b):
    raise Exception(f"is_same failed for {name} test case (b, b)")

  if not is_same(a, b) == expected_match:
    raise Exception(f"is_same failed for {name} test case (a, b)")

  if not is_same(b, a) == expected_match:
    raise Exception(f"is_same failed for {name} test case (b, a)")

  print(f"[is_same] {name} pass")

test_is_same('int', 1, 2)
test_is_same('float', 1.1, 1.2)
test_is_same('array', [1,2], [1,3])
test_is_same(
  'dict',
  {'id': 1, 'name': 'alice'},
  {'id': 2, 'name': 'bob'}
)
test_is_same(
  'complex',
  [
    {'id': 1, 'name': 'alice'},
    {'id': 2, 'name': 'bob'}
  ],
  [
    {'id': 1, 'name': 'alice'},
    {'id': 3, 'name': 'charlie'}
  ],
)
test_is_same(
  name='int vs float (same value)',
  expected_match=True,
  a=1,
  b=1.0,
)
test_is_same('int vs float (diff value)', 1, 1.5)
test_is_same('int vs string', 1, '1')
test_is_same('array vs string', [1], '1')


# %%
## test the implementation against sample

from core import compress, decompress

def load_sample(file):
  with open(file) as fd:
    # Load sample from json file
    sample = json.load(fd)
    i = sample['i']
    name = sample['name']
    data = sample['data']
    expect_compressed = sample['compressed']

    # Test the implementation
    print(f"case {i}: {name}")
    compressed = compress(data)
    decompressed = decompress(compressed)

    # Check if matched
    if not is_same(compressed, expect_compressed):
      print("data:", data)
      print("compressed:", compressed)
      print("expect_compressed:", expect_compressed)
      raise Exception("compressed mismatch")
    if not is_same(decompressed, data):
      print("data:", data)
      print("decompressed:", decompressed)
      raise Exception("decompressed mismatch")
    print("pass.")


# %%
## try the test flow

load_sample('samples/7.json')

# %%
## test step by step

# empty object
load_sample('samples/7.json')

# flat object
load_sample('samples/14.json')

# %%
## test against all samples

dir = 'samples'
n = len(os.listdir(dir))
for i in range(n):
  filename = f"{i+1}.json"
  file = os.path.join(dir, filename)
  load_sample(file)
