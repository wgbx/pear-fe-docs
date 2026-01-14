---
title: SVG File Optimization Standard
description: Unify the usage of SVG files in frontend projects, improve icon maintainability, reusability, and theme adaptability
---

# SVG File Optimization Standard

## Purpose

This standard aims to unify the usage of SVG files (*.svg) in frontend projects, improve icon maintainability, reusability, and theme adaptability, reduce style conflicts and rendering issues, and ensure all team members follow consistent standards when importing, optimizing, and using SVGs.

## Scope

This standard applies to:

+ All .svg files in the project (icons, UI assets)
+ SVG icon files exported from design tools (Figma / Illustrator)
+ SVG source files in component libraries or icon libraries
+ Files before converting SVG to frontend components

Does not apply to:

+ Brand logos that require multi-color rendering and must retain original colors
+ Image-type SVGs (containing many paths or bitmap embeds)
+ Animated SVGs (e.g., Lottie/SVG Animation)

## Requirements

### Delete `width` and `height`

SVG files are prohibited from containing fixed size attributes:

```xml
width="24"
height="24"
```

Reason: Avoid hardcoding icon sizes, allowing flexible control via CSS.

### Must Include `viewBox`

SVG files must include:

```xml
viewBox="0 0 x y"
```

viewBox is the basis for SVG scaling. Icons can only display correctly after removing width and height.

### Use `currentColor` as Fill Color

Icon-type SVGs must use:

```xml
fill="currentColor"
```

Line icons use:

```xml
stroke="currentColor"
```

Brand logos are exceptions and may retain original colors.

### Remove Meaningless Attributes

Attributes to delete include:

+ xmlns:xlink
+ version
+ enable-background
+ xml:space
+ data-*
+ Unnecessary id
+ Empty &lt;g&gt; or &lt;path&gt;

### Keep Structure Flat

Reduce nesting, avoid unnecessary &lt;g&gt;, transform, clipPath, and mask.

### Retain `xmlns` (if SVG is used independently)

".svg" files used as independent resources should include:

```xml
xmlns="http://www.w3.org/2000/svg"
```

Can be omitted in component mode.

## Rationale

### Reasons for Deleting Size

+ More flexible to control icon size with CSS
+ Supports responsive layouts
+ Avoids hardcoding
+ More unified in component libraries

### Reasons for Using `viewBox`

+ Defines icon coordinate system
+ Can still render after removing width and height
+ Maintains proportional scaling of icons

### Reasons for Using `currentColor`

+ Automatically inherits parent text color
+ Supports theme switching (Light/Dark)
+ Avoids duplicate color definitions
+ More consistent with UI systems

### Reasons for Deleting Meaningless Attributes

+ Design tool exports are mostly redundant
+ Reduces file size
+ Avoids potential rendering differences
+ Keeps files clean and controllable

## Examples

### ❌ Bad Example — Has width/height, Missing viewBox

```xml
<svg width="24" height="24" fill="#000">
  <path d="M12 2L2 7v10l10 5 10-5V7z" />
</svg>
```

### ❌ Bad Example — Using Fixed Color

```xml
<svg viewBox="0 0 24 24">
  <path fill="#333" d="..." />
</svg>
```

### ✅ Good Example — Standard Compliant SVG File

```xml
<svg
  viewBox="0 0 24 24"
  fill="currentColor"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M12 2L2 7v10l10 5 10-5V7z" />
</svg>
```

### ⭐ Extended Example — Stroke Icon

```xml
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M5 12h14" />
</svg>
```

## Summary

All SVG files must meet the following requirements:

+ Delete width/height
+ Add viewBox
+ Use currentColor
+ Remove redundant attributes
+ Flat structure
+ Retain xmlns when used independently

Goal: A more consistent, flexible, and maintainable icon system.

## References

+ MDN SVG: [https://developer.mozilla.org/en-US/docs/Web/SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
+ W3C SVG 2 Specification
+ Figma SVG Export Documentation
+ SVGO Project: [https://github.com/svg/svgo](https://github.com/svg/svgo)
