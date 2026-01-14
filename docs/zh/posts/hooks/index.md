# Hooks

React Hooks 工具函数集合，提供常用的自定义 Hooks，帮助简化组件开发。

## 简介

Hooks 模块包含了一系列实用的 React Hooks，涵盖了状态管理、副作用处理、DOM 操作等常见场景。

## 快速开始

```typescript
import { useLocalStorage, useDebounce } from '@pear/hooks'
```

## 功能列表

### 状态管理

- `useLocalStorage` - 本地存储状态管理
- `useSessionStorage` - 会话存储状态管理
- `useToggle` - 布尔值切换
- `useCounter` - 计数器

### 副作用处理

- `useDebounce` - 防抖处理
- `useThrottle` - 节流处理
- `useInterval` - 定时器
- `useTimeout` - 延时执行

### DOM 操作

- `useClickOutside` - 点击外部区域
- `useWindowSize` - 窗口尺寸监听
- `useScroll` - 滚动监听

### 其他

- `usePrevious` - 获取上一次的值
- `useUpdateEffect` - 更新时执行副作用

## 示例

### useLocalStorage

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

### useDebounce

```typescript
import { useDebounce } from '@pear/hooks'

function SearchInput() {
  const [input, setInput] = useState('')
  const debouncedValue = useDebounce(input, 500)

  useEffect(() => {
    // 搜索逻辑
    console.log('搜索:', debouncedValue)
  }, [debouncedValue])

  return <input value={input} onChange={(e) => setInput(e.target.value)} />
}
```

## 更多

更多 Hooks 的使用方法和 API 文档，请查看各个 Hook 的详细文档。
