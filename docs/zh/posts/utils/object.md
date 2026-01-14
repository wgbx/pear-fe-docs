# 对象操作

对象操作相关的工具函数。

## deepClone

深拷贝对象。

### 用法

```typescript
import { deepClone } from '@pear/utils'

const obj = { a: 1, b: { c: 2 } }
const cloned = deepClone(obj)
```

## pick

选择对象属性。

### 用法

```typescript
import { pick } from '@pear/utils'

const obj = { a: 1, b: 2, c: 3 }
pick(obj, ['a', 'c']) // { a: 1, c: 3 }
```

## omit

排除对象属性。

### 用法

```typescript
import { omit } from '@pear/utils'

const obj = { a: 1, b: 2, c: 3 }
omit(obj, ['b']) // { a: 1, c: 3 }
```

## merge

对象合并。

### 用法

```typescript
import { merge } from '@pear/utils'

const obj1 = { a: 1, b: 2 }
const obj2 = { b: 3, c: 4 }
merge(obj1, obj2) // { a: 1, b: 3, c: 4 }
```

