---
title: Avoid Arrow Functions in JSX
description: Using arrow functions directly in JSX causes performance issues, recommend using useCallback or useMemoizedFn
---

# Avoid Arrow Functions in JSX

## Core Conclusion

Using arrow functions directly in JSX causes function references to be recreated on every component render, which may trigger unnecessary re-renders of child components. It is recommended to use useCallback or ahooks' useMemoizedFn to ensure stable function references.

## Analysis

### 1. Functions are recreated on every render

For example:

```typescript
function MyComponent() {
  return (
    <button onClick={() => console.log('clicked')}>
      Click
    </button>
  );
}
```

Every time MyComponent renders, `() => console.log('clicked')` is a newly created function. In JavaScript, functions are objects, and newly created functions have different references from old functions.

### 2. Causes child component re-renders

React will think the onClick prop has changed (different reference), and child components that rely on shallow comparison (such as components wrapped with React.memo) will incorrectly re-render, wasting performance.

### 3. Performance impact

Frequent re-renders of child components will increase Virtual DOM diff and actual DOM update times, reducing performance, especially in large component trees or lists.

## Correct Approach

Use useCallback or useMemoizedFn to keep function references stable. For example:

```typescript
import { useMemoizedFn } from 'ahooks';

function Parent() {
  const handleClick = useMemoizedFn(() => console.log('click'));
  return <Child onClick={handleClick} />;
}
```

This way, the handleClick reference won't change when dependencies remain unchanged, and Child can avoid unnecessary re-renders.

### Additional Tips

+ For frequently rendering components, especially list items, it's recommended to always use stable function references.
+ Can be combined with React.memo to improve component performance.

## Summary

Avoid writing arrow functions directly in JSX.
Using useCallback or ahooks' useMemoizedFn can keep function references stable, avoid unnecessary child component renders, and improve React performance.
