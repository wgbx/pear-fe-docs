# 其他 Hooks

其他实用的 Hooks。

## usePrevious

获取上一次的值 Hook。

### 用法

```typescript
import { usePrevious } from '@pear/hooks'

function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return (
    <div>
      <p>当前值: {count}</p>
      <p>上一次值: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  )
}
```

## useUpdateEffect

更新时执行副作用 Hook。

### 用法

```typescript
import { useUpdateEffect } from '@pear/hooks'

function Component() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('首次渲染')
  }, [])

  useUpdateEffect(() => {
    console.log('更新时执行:', count)
  }, [count])

  return <button onClick={() => setCount(count + 1)}>计数: {count}</button>
}
```

