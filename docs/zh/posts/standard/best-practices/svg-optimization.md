---
title: SVG 文件优化规范
description: 统一前端项目中 SVG 文件的使用方式，提高图标的可维护性、可复用性与主题适配能力
---

# SVG 文件优化规范

## 目的

本规范旨在统一前端项目中 SVG 文件（*.svg）的使用方式，提高图标的可维护性、可复用性与主题适配能力，减少样式冲突和渲染问题，并确保所有团队成员在导入、优化与使用 SVG 时遵循一致标准。

## 适用范围

本规范适用于：

+ 项目中的所有 .svg 文件（icon、UI 素材）
+ 设计输出的 SVG 图标文件（Figma / Illustrator）
+ 组件库或图标库中的 SVG 源文件
+ 将 SVG 转换为前端组件之前的文件

不适用于：

+ 需要多色渲染且必须保留原始色彩的品牌 Logo
+ 图片型 SVG（包含大量 path 或 bitmap embed）
+ 动画型 SVG（如 Lottie/SVG Animation）

## 规范内容

### 删除 width 和 height

SVG 文件禁止包含固定尺寸属性：

```xml
width="24"
height="24"
```

原因：避免图标尺寸被硬编码，使其可通过 CSS 灵活控制。

### 必须包含 viewBox

SVG 文件必须包含：

```xml
viewBox="0 0 x y"
```

viewBox 是 SVG 缩放的基础，删除宽高后图标才能正常显示。

### 使用 currentColor 作为填充色

图标类 SVG 必须使用：

```xml
fill="currentColor"
```

线条图标使用：

```xml
stroke="currentColor"
```

品牌 Logo 例外，可保留原始颜色。

### 移除无意义属性

需要删除的属性包括：

+ xmlns:xlink
+ version
+ enable-background
+ xml:space
+ data-*
+ 不必要的 id
+ 空的 &lt;g&gt; 或 &lt;path&gt;

### 结构尽量扁平

减少嵌套，避免不必要的 &lt;g&gt;、transform、clipPath 和 mask。

### 保留 xmlns（如 SVG 独立使用）

"svg" 文件作为独立资源时应包含：

```xml
xmlns="http://www.w3.org/2000/svg"
```

组件模式可省略。

## 背景与原因分析

### 删除尺寸的原因

+ 使用 CSS 控制图标大小更灵活
+ 支持响应式布局
+ 避免硬编码
+ 组件库中更统一

### 必须使用 viewBox 的原因

+ 定义图标坐标系
+ 删除宽高后依然能渲染
+ 保持图标按比例缩放

### 使用 currentColor 的原因

+ 自动继承父级文本颜色
+ 支持主题切换（Light/Dark）
+ 避免重复定义颜色
+ 与 UI 系统更一致

### 删除无意义属性的原因

+ 设计工具导出属性多为冗余
+ 减少文件体积
+ 避免潜在渲染差异
+ 保持文件干净可控

## 示例

### ❌ Bad 示例 — 有 width/height、缺 viewBox

```xml
<svg width="24" height="24" fill="#000">
  <path d="M12 2L2 7v10l10 5 10-5V7z" />
</svg>
```

### ❌ Bad 示例 — 使用固定颜色

```xml
<svg viewBox="0 0 24 24">
  <path fill="#333" d="..." />
</svg>
```

### ✅ Good 示例 — 标准合规 SVG 文件

```xml
<svg
  viewBox="0 0 24 24"
  fill="currentColor"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M12 2L2 7v10l10 5 10-5V7z" />
</svg>
```

### ⭐ 扩展示例 — stroke 图标

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

## 总结

所有 SVG 文件必须满足以下要求：

+ 删除 width/height
+ 添加 viewBox
+ 使用 currentColor
+ 移除冗余属性
+ 扁平结构
+ 独立使用时保留 xmlns

目标：更一致、更灵活、更可维护的图标体系。

## 参考文档

+ MDN SVG: [https://developer.mozilla.org/en-US/docs/Web/SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
+ W3C SVG 2 Specification
+ Figma SVG Export Documentation
+ SVGO Project: [https://github.com/svg/svgo](https://github.com/svg/svgo)
