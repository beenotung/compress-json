# for direct usage
from .core import compress, decompress

# for custom wrapper
from .core import decode
from .memory import add_value, Memory, Store, Cache

# to remove undefined object fields
from .helpers import trim_undefined, trim_undefined_recursively

__version__ = "2.1.3"
