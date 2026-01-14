---
title: useMemo and useCreation Usage Guide
description: Learn when to use useMemo and useCreation, and when not to use them
---

# useMemo and useCreation Usage Guide

## Core Conclusion

For **simple calculations** (such as addition/subtraction, string concatenation, boolean judgments, etc.), **do not use** useMemo or useCreation.

+ useMemo is a native React Hook used to cache expensive calculation results.
+ useCreation is a Hook provided by ahooks, used to cache computed values and ensure recreation only when dependencies change, suitable for expensive calculations or object/function creation.

Simple calculations don't need caching, as the caching overhead may exceed the calculation itself.

## Analysis

### 1. useMemo overhead

Every time a component renders, React checks the dependency array and decides whether to recalculate. For lightweight calculations, these operations may take longer than the calculation itself.

### 2. useCreation overhead

useCreation creates new values when dependencies change and ensures stable references, suitable for creating complex objects or functions. For simple calculations, this is also an additional burden.

### 3. Simple calculations are very cheap

For example:

```typescript
const fullName = `${user.firstName} ${user.lastName}`;
const total = price * count;
```

These calculations are O(1) and don't need caching.

### 4. React's own rendering optimizations are sufficient

Virtual DOM diff and component-level optimizations already avoid most unnecessary renders. Unless calculations are very expensive, useMemo or useCreation are not needed.

### 5. Overuse reduces readability

Abuse makes code verbose and complex, misleading the team into thinking calculations are expensive, reducing maintainability.

## Practical Recommendations

| Scenario | Use useMemo/useCreation? | Example |
| --- | --- | --- |
| Simple string concatenation, arithmetic | ❌ No | `const total = a + b` |
| Logic judgment based on small data | ❌ No | `const isValid = items.length > 0` |
| Large data filtering, sorting, aggregation | ✅ Yes | `const sorted = useMemo(() => sort(list), [list])` |
| Creating complex objects or function references | ✅ Yes | `const options = useCreation(() => ({ mode }), [mode])` |
| Complex calculation results passed to child components | ✅ Yes | `const filtered = useMemo(() => filter(items), [items])` |

## Summary

Simple, fast, side-effect-free calculations should not use useMemo or useCreation.
Only use these Hooks when calculations are expensive, dependencies change infrequently, or objects/functions need stable references.
