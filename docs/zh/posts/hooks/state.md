# 状态管理

状态管理相关的 Hooks，用于管理组件中的各种状态。

## useLocalStorage

本地存储状态管理 Hook。

### 用法

```typescript
import { useLocalStorage } from '@pear/hooks'

function App() {
  const [value, setValue] = useLocalStorage('key', 'defaultValue')

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  )
}
```

## useSessionStorage

会话存储状态管理 Hook。

### 用法

```typescript
import { useSessionStorage } from '@pear/hooks'

function App() {
  const [value, setValue] = useSessionStorage('key', 'defaultValue')

  return <div>{value}</div>
}
```

## useToggle

布尔值切换 Hook。

### 用法

```typescript
import { useToggle } from '@pear/hooks'

function App() {
  const [value, toggle] = useToggle(false)

  return (
    <button onClick={toggle}>
      {value ? '开启' : '关闭'}
    </button>
  )
}
```

## useCounter

计数器 Hook。

### 用法

```typescript
import { useCounter } from '@pear/hooks'

function App() {
  const [count, { inc, dec, reset }] = useCounter(0)

  return (
    <div>
      <button onClick={dec}>-</button>
      <span>{count}</span>
      <button onClick={inc}>+</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

