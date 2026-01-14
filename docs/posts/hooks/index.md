# Hooks

A collection of React Hooks utilities providing commonly used custom Hooks to simplify component development.

## Introduction

The Hooks module includes a series of practical React Hooks covering state management, side effects, DOM operations, and other common scenarios.

## Quick Start

```typescript
import { useLocalStorage, useDebounce } from '@pear/hooks'
```

## Features

### State Management

- `useLocalStorage` - Local storage state management
- `useSessionStorage` - Session storage state management
- `useToggle` - Boolean toggle
- `useCounter` - Counter

### Side Effects

- `useDebounce` - Debounce handling
- `useThrottle` - Throttle handling
- `useInterval` - Timer
- `useTimeout` - Delayed execution

### DOM Operations

- `useClickOutside` - Click outside detection
- `useWindowSize` - Window size listener
- `useScroll` - Scroll listener

### Others

- `usePrevious` - Get previous value
- `useUpdateEffect` - Execute side effects on update

## Examples

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
    // Search logic
    console.log('Search:', debouncedValue)
  }, [debouncedValue])

  return <input value={input} onChange={(e) => setInput(e.target.value)} />
}
```

## More

For more Hooks usage and API documentation, please check the detailed documentation for each Hook.

