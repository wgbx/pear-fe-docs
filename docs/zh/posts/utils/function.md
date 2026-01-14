# 函数工具

函数工具相关的工具函数。

## debounce

防抖函数。

### 用法

```typescript
import { debounce } from '@pear/utils'

const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword)
}, 500)

handleSearch('hello')
```

## throttle

节流函数。

### 用法

```typescript
import { throttle } from '@pear/utils'

const handleScroll = throttle(() => {
  console.log('滚动事件')
}, 200)

window.addEventListener('scroll', handleScroll)
```

## memoize

函数缓存。

### 用法

```typescript
import { memoize } from '@pear/utils'

const expensiveFunction = (n) => {
  // 复杂计算
  return n * n
}

const memoizedFn = memoize(expensiveFunction)
memoizedFn(5) // 计算结果并缓存
memoizedFn(5) // 直接返回缓存结果
```

## pipe

函数管道。

### 用法

```typescript
import { pipe } from '@pear/utils'

const add = (x) => x + 1
const multiply = (x) => x * 2
const subtract = (x) => x - 1

const result = pipe(add, multiply, subtract)(5)
// 执行顺序: add(5) -> multiply(6) -> subtract(12) -> 11
```

