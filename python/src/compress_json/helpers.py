from type import dict_class

def trim_undefined(object):
  keys_to_remove = []
  for key in object:
    if object[key] is None:
      keys_to_remove.append(key)
  for key in keys_to_remove:
    del object[key]

def trim_undefined_recursively(object):
  _trim_undefined_recursively_loop(object, [])

def _trim_undefined_recursively_loop(object, tracks: list):
  tracks.append(object)
  keys_to_remove = []
  for key in object:
    value = object[key]
    if value is None:
      keys_to_remove.append(key)
    elif type(value) == dict_class and not value in tracks:
      _trim_undefined_recursively_loop(value, tracks)
  for key in keys_to_remove:
    del object[key]
