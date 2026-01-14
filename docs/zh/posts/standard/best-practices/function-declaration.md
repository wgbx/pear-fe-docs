---
title: 工具函数使用 function 声明规范
description: 确保项目中所有工具函数的实现方式统一、可维护，并能在 IDE 中获得最佳的开发体验与文档支持
---

# 工具函数使用 function 声明规范

## 目的

确保项目中所有工具函数的实现方式统一、可维护，并能在 IDE 中获得最佳的开发体验与文档支持。

## 适用范围

本规范适用于：

+ 所有工具函数（utility functions）
+ 所有非 React 环境下的纯函数逻辑
+ 所有可复用逻辑函数（helpers, utils）

不适用于：

+ React 组件内部的事件处理器
+ map/filter/reduce 等回调函数场景
+ 仅在单处使用的匿名函数

## 规范内容

### 1. 工具函数必须使用 function 声明

```typescript
function doSomething() {}
```

### 2. 工具函数必须具有 TSDoc 注释

TSDoc 注释必须包含：

+ 函数用途的简要描述
+ 所有参数的 @param
+ 返回值说明 @returns
+ 至少一个 @example 示例

### 3. 回调函数应使用箭头函数

如：map、filter、reduce、事件回调等。

### 4. 禁止使用箭头函数声明工具函数

```typescript
// ❌ Bad
const format = () => {}
```

## 背景与原因分析

### 使用 function 声明的优势

+ **支持 Hoisting**，提升代码组织灵活性
+ **错误堆栈中显示完整函数名**，调试更友好
+ **与 class method 语法风格一致**
+ **符合传统函数式编程风格**

### 为什么必须写 TSDoc？

+ 提供清晰、结构化的 API 文档
+ IDE 能展示完整智能提示
+ 降低维护成本，提高可读性
+ 增强跨团队协作能力

### 箭头函数适用的特定场景

+ map / filter / reduce 等函数式回调
+ Promise 链的短回调
+ React 事件与 hook 回调（尤其配合 useMemoizedFn）

## 示例

### ❌ Bad 示例 — 使用箭头函数声明工具函数

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
```

### ✅ Good 示例 — 使用 function 声明 + TSDoc

```typescript
/**
 * Formats a number as USD currency
 *
 * @param amount - The numeric amount to format
 * @returns The formatted currency string with $ symbol
 *
 * @example
 * ```ts
 * formatCurrency(1234.56) // "$1,234.56"
 * ```
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
```

### ✅ Good 示例 — 泛型工具函数

```typescript
/**
 * Safely parses JSON string with type safety
 *
 * @template T - Expected result type
 * @param json - The JSON string to parse
 * @returns Parsed object of type T or null
 *
 * @example
 * ```ts
 * const user = parseJSON<User>("{\n  \"id\": 1, \"name\": \"John\"}\n")
 * ```
 */
function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
```

## 总结

+ 工具函数必须：function 声明 + 完整 TSDoc
+ 回调场景使用箭头函数
+ 严格禁止工具函数使用箭头函数声明
+ TSDoc 可提升可维护性、可读性与 IDE 支持

## 参考文档

+ [TypeScript Handbook — Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
+ [TSDoc 官方文档](https://tsdoc.org/)
+ [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
+ [Microsoft TypeScript 风格建议](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
