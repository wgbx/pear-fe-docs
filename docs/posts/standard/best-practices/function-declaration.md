---
title: Function Declaration Standard
description: Ensure all utility functions in the project are implemented uniformly, maintainable, and provide the best development experience and documentation support in the IDE
---

# Function Declaration Standard

## Purpose

Ensure all utility functions in the project are implemented uniformly, maintainable, and provide the best development experience and documentation support in the IDE.

## Scope

This standard applies to:

+ All utility functions
+ All pure function logic outside of React environments
+ All reusable logic functions (helpers, utils)

Does not apply to:

+ Event handlers within React components
+ Callback function scenarios like map/filter/reduce
+ Anonymous functions used only in a single place

## Requirements

### 1. Utility Functions Must Use `function` Declaration

```typescript
function doSomething() {}
```

### 2. Utility Functions Must Have TSDoc Comments

TSDoc comments must include:

+ Brief description of function purpose
+ All parameters with @param
+ Return value description @returns
+ At least one @example

### 3. Callback Functions Should Use Arrow Functions

Such as: map, filter, reduce, event callbacks, etc.

### 4. Prohibit Using Arrow Functions to Declare Utility Functions

```typescript
// ❌ Bad
const format = () => {}
```

## Rationale

### Advantages of Using `function` Declaration

+ **Supports Hoisting**, improving code organization flexibility
+ **Shows complete function name in error stack**, more debugging-friendly
+ **Consistent with class method syntax style**
+ **Conforms to traditional functional programming style**

### Why Must Write TSDoc?

+ Provides clear, structured API documentation
+ IDE can display complete IntelliSense
+ Reduces maintenance costs, improves readability
+ Enhances cross-team collaboration

### Specific Scenarios for Arrow Functions

+ Functional callbacks like map / filter / reduce
+ Short callbacks in Promise chains
+ React events and hook callbacks (especially with useMemoizedFn)

## Examples

### ❌ Bad Example — Using Arrow Function to Declare Utility Function

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
```

### ✅ Good Example — Using `function` Declaration + TSDoc

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

### ✅ Good Example — Generic Utility Function

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

## Summary

+ Utility functions must: `function` declaration + complete TSDoc
+ Use arrow functions for callback scenarios
+ Strictly prohibit using arrow functions to declare utility functions
+ TSDoc improves maintainability, readability, and IDE support

## References

+ [TypeScript Handbook — Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
+ [TSDoc Official Documentation](https://tsdoc.org/)
+ [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
+ [Microsoft TypeScript Style Guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
