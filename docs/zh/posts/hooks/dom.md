# DOM 操作

DOM 操作相关的 Hooks，用于处理点击外部、窗口尺寸、滚动等场景。

## useClickOutside

点击外部区域 Hook。

### 用法

```typescript
import { useClickOutside } from '@pear/hooks'
import { useRef } from 'react'

function Dropdown() {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  useClickOutside(ref, () => {
    setIsOpen(false)
  })

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>打开菜单</button>
      {isOpen && <div>菜单内容</div>}
    </div>
  )
}
```

## useWindowSize

窗口尺寸监听 Hook。

### 用法

```typescript
import { useWindowSize } from '@pear/hooks'

function ResponsiveComponent() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>窗口宽度: {width}px</p>
      <p>窗口高度: {height}px</p>
    </div>
  )
}
```

## useScroll

滚动监听 Hook。

### 用法

```typescript
import { useScroll } from '@pear/hooks'

function ScrollComponent() {
  const { x, y } = useScroll()

  return (
    <div>
      <p>横向滚动: {x}px</p>
      <p>纵向滚动: {y}px</p>
    </div>
  )
}
```

