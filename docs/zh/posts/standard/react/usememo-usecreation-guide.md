---
title: useMemo 与 useCreation 使用指南
description: 了解何时应该使用 useMemo 和 useCreation，何时不应该使用
---

# useMemo 与 useCreation 使用指南

## 核心结论

对于**简单计算**（如加减、字符串拼接、布尔判断等），**不应使用** useMemo 或 useCreation。

+ useMemo 是 React 原生 Hook，用于缓存昂贵计算的结果。
+ useCreation 是 ahooks 提供的 Hook，用于缓存计算值，并保证只在依赖变化时重新创建，适合昂贵计算或对象/函数创建。

简单计算不需要缓存，因为缓存开销可能超过计算本身。

## 原因分析

### 1. useMemo 的开销

每次组件渲染时，React 会检查依赖数组并决定是否重新计算。对于轻量计算，这些操作可能比计算本身更耗时。

### 2. useCreation 的开销

useCreation 会在依赖变化时创建新的值，并保证引用稳定，适合创建复杂对象或函数。对于简单计算，这也是额外负担。

### 3. 简单计算代价极低

例如：

```typescript
const fullName = `${user.firstName} ${user.lastName}`;
const total = price * count;
```

这些计算 O(1)，无需缓存。

### 4. React 自身渲染优化已足够

Virtual DOM diff 和组件级优化已经避免了大多数不必要渲染，除非计算非常昂贵，否则不需要 useMemo 或 useCreation。

### 5. 过度使用降低可读性

滥用会让代码冗长复杂，误导团队认为计算昂贵，降低可维护性。

## 实战建议

| 场景 | 是否使用 useMemo/useCreation | 示例 |
| --- | --- | --- |
| 简单字符串拼接、四则运算 | ❌ 否 | `const total = a + b` |
| 基于少量数据的逻辑判断 | ❌ 否 | `const isValid = items.length > 0` |
| 大量数据过滤、排序、聚合 | ✅ 是 | `const sorted = useMemo(() => sort(list), [list])` |
| 创建复杂对象或函数引用 | ✅ 是 | `const options = useCreation(() => ({ mode }), [mode])` |
| 复杂计算结果传递给子组件 | ✅ 是 | `const filtered = useMemo(() => filter(items), [items])` |

## 总结

简单、快速、无副作用的计算不使用 useMemo 或 useCreation。
只有计算昂贵或依赖变化少、对象/函数需要稳定引用时才使用这些 Hook。
