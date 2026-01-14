# 类型判断

类型判断相关的工具函数。

## isString

判断是否为字符串。

### 用法

```typescript
import { isString } from '@pear/utils'

isString('hello') // true
isString(123) // false
```

## isNumber

判断是否为数字。

### 用法

```typescript
import { isNumber } from '@pear/utils'

isNumber(123) // true
isNumber('123') // false
isNumber(NaN) // false
```

## isObject

判断是否为对象。

### 用法

```typescript
import { isObject } from '@pear/utils'

isObject({}) // true
isObject([]) // false
isObject(null) // false
```

## isArray

判断是否为数组。

### 用法

```typescript
import { isArray } from '@pear/utils'

isArray([]) // true
isArray({}) // false
isArray('array') // false
```

