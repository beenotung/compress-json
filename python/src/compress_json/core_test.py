# %%
## import library

import os
import json


# %%
## generate samples

os.system("npx ts-node ../../../test/core-test.ts")


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

    print(f"case {i}: {name}")

    # Test compress
    compressed = compress(data)
    if compressed != expect_compressed:
      print("data:", data)
      print("compressed:", compressed)
      print("expect_compressed:", expect_compressed)
      raise Exception("compressed mismatch")

    # Test decompress
    decompressed = decompress(compressed)
    if decompressed != data:
      print("data:", data)
      print("decompressed:", decompressed)
      raise Exception("decompressed mismatch")
    print("pass.")


# %%
## test step by step

# array of number
load_sample('samples/7.json')

# empty object
load_sample('samples/8.json')

# flat object
load_sample('samples/15.json')

# %%
## test against all samples

dir = 'samples'
n = len(os.listdir(dir))
for i in range(n):
  filename = f"{i+1}.json"
  file = os.path.join(dir, filename)
  load_sample(file)
