---
title: 禁止使用枚举（enum）规范
description: 明确禁止使用 TypeScript enum 的原则，并提供统一的替代方案
---

# 禁止使用枚举（enum）

## 目的

明确禁止使用 TypeScript enum 的原则，并提供统一的替代方案，以提升项目的可维护性、类型安全性以及运行时性能。

## 适用范围

适用于本项目所有前端与后端 TypeScript 代码，包括：

+ React / Next.js 前端代码
+ Node.js / NestJS 后端代码
+ 任何共享的类型定义与工具库

## 规范内容

+ **禁止使用**enum（包括普通 enum 和 const enum）
+ **必须使用**const + as const 对象 或 字符串/数字联合类型 替代 enum
+ 工具类型必须遵循统一写法，如 ValueOf&lt;T&gt;、ArrayElement&lt;T&gt;
+ 所有替代枚举的对象必须是只读对象（as const）

## 背景与原因分析

### 为什么禁止 enum？

enum 在 TypeScript 中是特有语法，存在多项缺点：

+ **运行时会生成额外代码**，增加 bundle 体积
+ **数字枚举类型不安全**（可以传入任意 number）
+ **反向映射带来意外行为**
+ **不支持 tree-shaking**（导致死代码无法消除）
+ **与 JavaScript 生态不兼容**，转换成本更高
+ const enum 在某些构建工具下存在限制（尤其是 Babel 环境）

### const + as const 的优势

+ **零运行时代码** → 不会增加 bundle
+ **类型推断优秀** → 自动生成联合类型
+ **支持 tree-shaking**
+ **兼容所有 JavaScript 代码**
+ 更灵活（可与数组、工具类型组合）

## 示例

### 基本枚举替代

```typescript
// ❌ Bad
enum Status {
  Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
    }

// ✅ Good
const Status = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
} as const;
type KeyOf<T> = keyof T;
type ValueOf<T> = T[keyof T];
type Status = ValueOf<typeof Status>;
```

### 数字枚举替代

```typescript
// ❌ Bad
enum Priority { Low = 0, Medium = 1, High = 2 }

// ✅ Good
const Priority = {
  Low: 0,
  Medium: 1,
  High: 2
} as const;
type KeyOf<T> = keyof T;
type ValueOf<T> = T[keyof T];
type Priority = ValueOf<typeof Priority>;
```

### 字符串枚举替代

```typescript
// ❌ Bad
enum ButtonVariant { Primary = "primary", Secondary = "secondary", Ghost = "ghost" }

// ✅ Good
const ButtonVariant = {
  Primary: "primary",
  Secondary: "secondary",
  Ghost: "ghost",
} as const;
type KeyOf<T> = keyof T;
type ValueOf<T> = T[keyof T];
type ButtonVariant = ValueOf<typeof ButtonVariant>;
```

### 工具类型示例

```typescript
type KeyOf<T> = keyof T;
type ValueOf<T> = T[keyof T];

type ArrayElement<T extends readonly unknown[]> = T[number];
```

## 总结

为保持代码一致性与运行时性能，项目统一禁止使用 TypeScript 枚举（enum）。所有枚举场景必须使用 const + as const 或联合类型替代，以提升类型安全性、tree-shaking 效果与跨环境兼容性。

## 参考文档

+ [TypeScript Handbook - Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
+ [Why TypeScript Enums Suck](https://www.youtube.com/watch?v=jjMbPt_H3RQ) - Matt Pocock
+ [Google TypeScript Style Guide - Enums](https://google.github.io/styleguide/tsguide.html#enums)
