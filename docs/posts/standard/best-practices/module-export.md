---
title: Module Export Standard
description: Module export standard to improve code maintainability, readability, consistency, and engineering quality
---

# Module Export Standard

## Purpose

To improve code maintainability, readability, consistency, and engineering quality, this module export standard is formulated. This standard explicitly prohibits default exports and anonymous exports, unifying to named exports to ensure team collaboration efficiency and code stability in large projects.

## Scope

This standard applies to:

+ All TypeScript / JavaScript source files
+ All frontend business repositories, component libraries, utility libraries, and infrastructure code
+ Monolithic projects and Monorepo scenarios

## Requirements

### 1. Prohibited Export Methods

The following writing styles are **explicitly prohibited** in this project:

1. `export default`
2. Anonymous function exports
3. Anonymous class exports
4. `default` + any form of mixed exports

Examples:

```typescript
export default function () {}
export default class {}
export default {}
export default () => {}
```

### 2. Recommended Export Methods

All modules must use named exports, including but not limited to:

**Named Functions**

```typescript
export function Button() {}
```

**Named Constants / Objects**

```typescript
export const config = { timeout: 5000 };
```

**Named Classes**

```typescript
export class HttpClient {}
```

**Type Exports**

```typescript
export interface User { id: string; name: string }
export type Result<T> = { data: T };
```

## Rationale

Reasons for prohibiting default exports:

### Low Refactoring Capability (IDE Difficult to Track)

Default exports can be arbitrarily named when imported, making static analysis and batch renaming difficult, increasing refactoring risks.

### Naming Inconsistency Causes Collaboration Confusion

Team members may name them differently:

```typescript
import Button from "./Button";
import Btn from "./Button";
import MainButton from "./Button";
```

Causing confusion and review difficulties.

### Not Conducive to Tree-shaking

Build tools have difficulty safely judging default export side effects, affecting output size and performance.

### Module API Not Clear

Named exports more clearly expose module capabilities, beneficial for review, reading, and maintenance.

### Engineering Practices of Large Organizations

Google, Meta, Airbnb, etc., all recommend avoiding default exports to strengthen engineering consistency and toolchain optimization.

## Examples

### Utility Functions

```typescript
// ❌ Prohibited
export default function formatDate() {}

// ✅ Recommended
export function formatDate() {}
export function parseDate() {}
```

### Configuration Objects

```typescript
// ❌ Prohibited
export default {
  apiUrl: "...",
};

// ✅ Recommended
export const apiConfig = {
  apiUrl: "...",
};
```

### Classes

```typescript
// ❌ Prohibited
export default class HttpClient {}

// ✅ Recommended
export class HttpClient {}
```

## Summary

+ This project strictly prohibits the use of default exports and anonymous exports.
+ Fully adopt named exports to ensure:
  + Stronger refactoring capability
  + Clear module boundaries
  + Unified import naming
  + Better tree-shaking
  + Better engineering consistency
+ This standard applies to all modules in the entire project.

## References

**Nicholas C. Zakas** (ESLint author, "Professional JavaScript for Web Developers" author)

[Why I've stopped exporting defaults from my JavaScript modules](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/)

**Google JavaScript Style Guide**

[Exports - Use named exports](https://google.github.io/styleguide/jsguide.html#file-goog-module-exports)

**Google TypeScript Style Guide**

[Exports - Avoid default exports](https://google.github.io/styleguide/tsguide.html#exports)

**Top Frontend Team Practices**

[Why Some Top Frontend Teams Avoid Export Default](https://medium.com/@sampan090611/why-some-top-frontend-teams-avoid-export-default-ef7ab0d8daee)

**In-depth Analysis Articles**

+ [Death to Default Exports!](https://www.olivare.net/blog/2023/death-to-default-exports)
+ [Default Exports in JavaScript Modules Are Terrible](https://www.lloydatkinson.net/posts/2022/default-exports-in-javascript-modules-are-terrible/)
