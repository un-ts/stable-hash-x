// Use WeakMap to store the object-key mapping so the objects can still be
// garbage collected. WeakMap uses a hash table under the hood, so the lookup
// complexity is almost O(1).
const table = new WeakMap<object, string>()

// A counter of the key.
let counter = 0

// eslint-disable-next-line @typescript-eslint/unbound-method
const { toString } = Object.prototype // type-coverage:ignore-line

const isType = (arg: unknown, type: string): boolean =>
  toString.call(arg) === `[object ${type}]`

// based on https://github.com/sindresorhus/is-plain-obj
const isPlainObject = (val: object) => {
  const prototype: unknown = Object.getPrototypeOf(val)
  return (
    prototype === null ||
    prototype === Object.prototype || // type-coverage:ignore-line
    Object.getPrototypeOf(prototype) === null
  )
}

// A stable hash implementation that supports:
//  - Fast and ensures unique hash properties
//  - Handles unserializable values
//  - Handles object key ordering
//  - Generates short results
//
// This is not a serialization function, and the result is not guaranteed to be
// parsable.
// eslint-disable-next-line sonarjs/cognitive-complexity
export function stableHash(arg: unknown): string {
  const type = typeof arg
  const isDate = isType(arg, 'Date')

  if (Object(arg) === arg && !isDate && !isType(arg, 'RegExp')) {
    const arg_ = arg as object
    // Object/function, not null/date/regexp. Use WeakMap to store the id first.
    // If it's already hashed, directly return the result.
    let result = table.get(arg_)
    if (result) {
      return result
    }
    // Store the hash first for circular reference detection before entering the
    // recursive `stableHash` calls.
    // For other objects like set and map, we use this id directly as the hash.
    result = ++counter + '~'
    table.set(arg_, result)
    let index: number | string | undefined
    if (Array.isArray(arg)) {
      const arg_ = arg as unknown[]
      // Array.
      result = '@'
      for (index = 0; index < arg_.length; index++) {
        result += stableHash(arg_[index]) + ','
      }
      table.set(arg_, result)
    } else if (isPlainObject(arg_)) {
      // Object, sort keys.
      result = '#'
      // eslint-disable-next-line sonarjs/no-alphabetical-sort
      const keys = Object.keys(arg_).sort()
      while ((index = keys.pop()) !== undefined) {
        const index_ = index as keyof typeof arg_
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (arg_[index_] !== undefined) {
          result += index + ':' + stableHash(arg_[index_]) + ','
        }
      }
      table.set(arg_, result)
    }
    return result
  }

  if (isDate) {
    return (arg as Date).toJSON()
  }

  if (type === 'symbol') {
    return (arg as symbol).toString()
  }

  return type === 'string'
    ? JSON.stringify(arg)
    : // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      '' + arg
}

export { stableHash as hash }
