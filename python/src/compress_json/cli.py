import sys
import json
from .core import compress, decompress

def main():
  argv = sys.argv[1:]
  length = len(argv)

  def print_help():
    print("""
compress-json-python

Usage: compress-json [mode] [source]

Mode:
  "-c" for compress (default mode if not specified); or
  "-d" for decompress; or
  "-x" (extract) as alias to "-d"; or
  "-h" or "--help" to show this help message.

Source:
  "-" for stdin (default source if not specified); or
  path to file.

Usage Example:
  compress-json < package.json > p.json
""")

  if length == 0:
    fn = compress
  elif length == 1 or length == 2:
    mode = argv[0]
    if mode == '-h' or mode == '--help':
      print_help()
      exit(0)
    if mode == '-c':
      fn = compress
    elif mode == '-x' or mode == '-d':
      fn = decompress
    else:
      print('Error: invalid mode, expect "-c" for compress; "-x" or "-d" for extract/decompress', file=sys.stderr)
      exit(1)
  else:
    print("Error: invalid argument, expect mode and optional path to input file", file=sys.stderr)

  if length < 2 or argv[1] == "-":
    data = json.load(sys.stdin)
  else:
    with open(argv[1]) as fd:
      data = json.load(fd)

  result = fn(data)
  json.dump(result, sys.stdout, separators=(',', ':'))

if __name__ == "__main__":
  main()
