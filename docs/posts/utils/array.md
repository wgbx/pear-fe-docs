# 数组操作

数组操作相关的工具函数。

## unique

数组去重。

### 用法

```typescript
import { unique } from '@pear/utils'

unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
unique(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']
```

## chunk

数组分块。

### 用法

```typescript
import { chunk } from '@pear/utils'

chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
```

## flatten

数组扁平化。

### 用法

```typescript
import { flatten } from '@pear/utils'

flatten([1, [2, 3], [4, [5, 6]]]) // [1, 2, 3, 4, 5, 6]
```

## groupBy

数组分组。

### 用法

```typescript
import { groupBy } from '@pear/utils'

const users = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 20 },
  { name: 'Charlie', age: 30 }
]

groupBy(users, 'age')
// {
//   20: [{ name: 'Alice', age: 20 }, { name: 'Bob', age: 20 }],
//   30: [{ name: 'Charlie', age: 30 }]
// }
```

