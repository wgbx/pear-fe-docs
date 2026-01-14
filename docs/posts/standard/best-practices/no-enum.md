---
title: Prohibition of Enum Standard
description: Clearly prohibit the use of TypeScript enums and provide unified alternatives
---

# Prohibition of Enum Standard

## Purpose

To clearly prohibit the use of TypeScript enums and provide unified alternatives to improve project maintainability, type safety, and runtime performance.

## Scope

Applies to all frontend and backend TypeScript code in this project, including:

+ React / Next.js frontend code
+ Node.js / NestJS backend code
+ Any shared type definitions and utility libraries

## Requirements

+ **Prohibit the use of `enum`** (including regular and `const enum`)
+ **Must use** `const` + `as const` objects or string/number union types to replace `enum`
+ Utility types must follow a unified writing style, such as `ValueOf&lt;T&gt;`, `ArrayElement&lt;T&gt;`
+ All objects replacing enums must be read-only objects (`as const`)

## Rationale

### Why Prohibit `enum`?

`enum` is a unique syntax in TypeScript with several drawbacks:

+ **Generates extra code at runtime**, increasing bundle size
+ **Numeric enums are not type-safe** (can pass any number)
+ **Reverse mapping leads to unexpected behavior**
+ **Does not support tree-shaking** (leading to dead code that cannot be eliminated)
+ **Incompatible with the JavaScript ecosystem**, higher conversion cost
+ `const enum` has limitations under certain build tools (especially in Babel environments)

### Advantages of `const` + `as const`

+ **Zero runtime code** → does not increase bundle
+ **Excellent type inference** → automatically generates union types
+ **Supports tree-shaking**
+ **Compatible with all JavaScript code**
+ More flexible (can be combined with arrays, utility types)

## Examples

### Basic Enum Replacement

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

### Numeric Enum Replacement

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

### String Enum Replacement

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

### Utility Type Examples

```typescript
type KeyOf<T> = keyof T;
type ValueOf<T> = T[keyof T];

type ArrayElement<T extends readonly unknown[]> = T[number];
```

## Summary

To maintain code consistency and runtime performance, the project uniformly prohibits the use of TypeScript enums (`enum`). All enum scenarios must use `const` + `as const` or union types as replacements to improve type safety, tree-shaking effectiveness, and cross-environment compatibility.

## References

+ [TypeScript Handbook - Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
+ [Why TypeScript Enums Suck](https://www.youtube.com/watch?v=jjMbPt_H3RQ) - Matt Pocock
+ [Google TypeScript Style Guide - Enums](https://google.github.io/styleguide/tsguide.html#enums)
