# Utils

A collection of utility functions providing commonly used JavaScript utilities covering string, object, array, time, and other common operations.

## Introduction

The Utils module includes a series of practical utility functions to simplify common operations in daily development and improve development efficiency.

## Quick Start

```typescript
import { formatDate, deepClone, debounce } from '@pear/utils'
```

## Categories

### String

- `camelCase` - Convert to camelCase
- `kebabCase` - Convert to kebab-case
- `capitalize` - Capitalize first letter
- `trim` - Trim whitespace

### Object

- `deepClone` - Deep clone
- `pick` - Pick object properties
- `omit` - Omit object properties
- `merge` - Merge objects

### Array

- `unique` - Remove duplicates
- `chunk` - Chunk array
- `flatten` - Flatten array
- `groupBy` - Group array

### Time

- `formatDate` - Format date
- `getTimeAgo` - Relative time
- `isSameDay` - Check if same day
- `getDaysBetween` - Calculate days between dates

### Function

- `debounce` - Debounce
- `throttle` - Throttle
- `memoize` - Function memoization
- `pipe` - Function pipeline

### Type

- `isString` - Check if string
- `isNumber` - Check if number
- `isObject` - Check if object
- `isArray` - Check if array

### Others

- `sleep` - Delay function
- `random` - Random number generator
- `uuid` - Generate unique ID
- `formatBytes` - Format byte size

## Examples

### Deep Clone

```typescript
import { deepClone } from '@pear/utils'

const obj = { a: 1, b: { c: 2 } }
const cloned = deepClone(obj)
```

### Debounce

```typescript
import { debounce } from '@pear/utils'

const handleSearch = debounce((keyword) => {
  console.log('Search:', keyword)
}, 500)

handleSearch('hello')
```

### Date Formatting

```typescript
import { formatDate } from '@pear/utils'

const date = new Date()
formatDate(date, 'YYYY-MM-DD HH:mm:ss') // '2024-01-01 12:00:00'
```

### Remove Duplicates

```typescript
import { unique } from '@pear/utils'

const arr = [1, 2, 2, 3, 3, 3]
unique(arr) // [1, 2, 3]
```

## More

For more utility functions usage and API documentation, please check the detailed documentation for each function.

