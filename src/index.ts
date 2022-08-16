/* for direct usage */
export { compress, decompress, Compressed } from './core'

/* for custom wrapper */
export { decode } from './core'
export { addValue, Memory, Store, Cache } from './memory'

/* to remove undefined object fields */
export { trimUndefined, trimUndefinedRecursively } from './helpers'
