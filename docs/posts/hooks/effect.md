# 副作用处理

副作用处理相关的 Hooks，用于处理防抖、节流、定时器等场景。

## useDebounce

防抖处理 Hook。

### 用法

```typescript
import { useDebounce } from '@pear/hooks'

function SearchInput() {
  const [input, setInput] = useState('')
  const debouncedValue = useDebounce(input, 500)

  useEffect(() => {
    console.log('搜索:', debouncedValue)
  }, [debouncedValue])

  return <input value={input} onChange={(e) => setInput(e.target.value)} />
}
```

## useThrottle

节流处理 Hook。

### 用法

```typescript
import { useThrottle } from '@pear/hooks'

function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0)
  const throttledScrollY = useThrottle(scrollY, 200)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div>滚动位置: {throttledScrollY}</div>
}
```

## useInterval

定时器 Hook。

### 用法

```typescript
import { useInterval } from '@pear/hooks'

function Timer() {
  const [count, setCount] = useState(0)

  useInterval(() => {
    setCount(count + 1)
  }, 1000)

  return <div>计数: {count}</div>
}
```

## useTimeout

延时执行 Hook。

### 用法

```typescript
import { useTimeout } from '@pear/hooks'

function DelayedMessage() {
  const [show, setShow] = useState(false)

  useTimeout(() => {
    setShow(true)
  }, 2000)

  return show ? <div>延迟显示的消息</div> : null
}
```

