---
title: React 性能优化指南：避免在 JSX 中直接写箭头函数
description: 在 JSX 中直接使用箭头函数会导致性能问题，推荐使用 useCallback 或 useMemoizedFn
---

# 避免在 JSX 中直接写箭头函数

## 核心结论

在 JSX 中直接使用箭头函数会导致每次组件渲染时重新创建函数引用，可能引发子组件不必要的重新渲染。推荐使用 useCallback 或 ahooks 的 useMemoizedFn 来保证函数引用稳定。

## 原因分析

### 1. 每次渲染都会重新创建函数

例如：

```typescript
function MyComponent() {
  return (
    <button onClick={() => console.log('clicked')}>
      Click
    </button>
  );
}
```

每次 MyComponent 渲染时，`() => console.log('clicked')` 都是一个新创建的函数。JavaScript 中函数是对象，新创建的函数与旧函数引用不同。

### 2. 引发子组件重复渲染

React 会认为 onClick prop 变了（引用不同），依赖浅比较的子组件（如 React.memo 包裹的组件）会错误地重新渲染，从而浪费性能。

### 3. 影响性能

频繁重新渲染子组件会增加 Virtual DOM diff 和实际 DOM 更新次数，降低性能，尤其在大型组件树或列表中问题更明显。

## 正确做法

使用 useCallback 或 useMemoizedFn 保持函数引用稳定。例如：

```typescript
import { useMemoizedFn } from 'ahooks';

function Parent() {
  const handleClick = useMemoizedFn(() => console.log('click'));
  return <Child onClick={handleClick} />;
}
```

这样，handleClick 的引用在依赖不变的情况下不会变化，Child 可以避免不必要的重新渲染。

### 额外提示

+ 对于高频渲染组件，尤其是列表项，推荐始终使用稳定函数引用。
+ 可以结合 React.memo 使用，提升组件性能。

## 总结

避免在 JSX 中直接写箭头函数。
使用 useCallback 或 ahooks 的 useMemoizedFn 可以保持函数引用稳定，避免子组件不必要渲染，提升 React 性能。
