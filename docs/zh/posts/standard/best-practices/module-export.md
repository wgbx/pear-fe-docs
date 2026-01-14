---
title: 模块导出规范
description: 提升代码可维护性、可读性、一致性以及工程化质量的模块导出规范
---

# 模块导出规范

## 目的

为提升代码可维护性、可读性、一致性以及工程化质量，特制定本模块导出规范。本规范明确禁止使用 default export 及匿名导出，统一采用具名导出，以确保团队在大型项目中的协作效率与代码稳定性。

## 适用范围

本规范适用于：

+ 所有 TypeScript / JavaScript 源码文件
+ 所有前端业务仓库、组件库、工具库与基础设施代码
+ 单体项目与 Monorepo 场景

## 规范内容

### 1. 禁止的导出方式

以下写法在本项目中 **明确禁止**：

1. export default
2. 匿名函数导出
3. 匿名类导出
4. default + 任意形式的混合导出

示例：

```typescript
export default function () {}
export default class {}
export default {}
export default () => {}
```

### 2. 推荐的导出方式

所有模块必须使用具名导出，包括但不限于：

具名函数

```typescript
export function Button() {}
```

具名常量 / 对象

```typescript
export const config = { timeout: 5000 };
```

具名类

```typescript
export class HttpClient {}
```

类型导出

```typescript
export interface User { id: string; name: string }
export type Result<T> = { data: T };
```

## 背景与原因分析

禁用 default export 的原因如下：

### 重构能力低（IDE 难以追踪）

default 导出在导入时可被任意命名，导致静态分析与批量重命名困难，增加重构风险。

### 命名不一致导致协作混乱

团队成员可能自行命名：

```typescript
import Button from "./Button";
import Btn from "./Button";
import MainButton from "./Button";
```

产生混淆与审阅困难。

### 不利于 Tree-shaking

构建工具难以安全判断 default 导出副作用，影响产物体积与性能。

### 模块 API 不明确

具名导出更清晰地暴露模块能力，有利于审查、阅读与维护。

### 大型组织的工程实践

Google、Meta、Airbnb 等均推荐避免 default export，以强化工程一致性与工具链优化。

## 示例（Examples）

### 工具函数

```typescript
// ❌ 禁止
export default function formatDate() {}

// ✅ 推荐
export function formatDate() {}
export function parseDate() {}
```

### 配置对象

```typescript
// ❌ 禁止
export default {
  apiUrl: "...",
};

// ✅ 推荐
export const apiConfig = {
  apiUrl: "...",
};
```

### 类

```typescript
// ❌ 禁止
export default class HttpClient {}

// ✅ 推荐
export class HttpClient {}
```

## 总结

+ 本项目严格禁止使用 default export 与匿名导出。
+ 全面采用具名导出，以确保：
  + 更强的重构能力
  + 模块边界清晰
  + 导入命名统一
  + 更佳的 tree-shaking
  + 更好的工程一致性
+ 本规范适用于全项目所有模块。

## 参考文档

**Nicholas C. Zakas** (ESLint 作者, "JavaScript 高级程序设计"作者)

[Why I've stopped exporting defaults from my JavaScript modules](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/)

**Google JavaScript Style Guide**

[Exports - Use named exports](https://google.github.io/styleguide/jsguide.html#file-goog-module-exports)

**Google TypeScript Style Guide**

[Exports - Avoid default exports](https://google.github.io/styleguide/tsguide.html#exports)

**顶级前端团队实践**

[Why Some Top Frontend Teams Avoid Export Default](https://medium.com/@sampan090611/why-some-top-frontend-teams-avoid-export-default-ef7ab0d8daee)

**深度分析文章**

+ [Death to Default Exports!](https://www.olivare.net/blog/2023/death-to-default-exports)
+ [Default Exports in JavaScript Modules Are Terrible](https://www.lloydatkinson.net/posts/2022/default-exports-in-javascript-modules-are-terrible/)
