# BookmarkBanner

书签横幅组件，用于在页面中展示重要的提示信息或操作引导。

## 简介

BookmarkBanner 是一个业务组件，基于 MUI Stack 构建，常用于展示系统通知、活动推广、重要提示等信息。组件支持自定义图标、描述文本样式

**设计稿**: [Figma 设计链接](https://www.figma.com/design/LSdw4LtjDlYUs5oViNMXKT/Pear-Design-Lib?node-id=3105-526&p=f&m=dev)

## 基本用法

```tsx
import { BookmarkBanner } from '@webCommon/components-ui/molecules/TipBanner';
import { useTranslation } from 'hooks/use-intl';

function App() {
  const t = useTranslation();

  return (
    <BookmarkBanner description={t("Message")} />
  )
}
```

## API

### 默认样式

组件默认样式：

- `backgroundColor`: `shades.a5`
- `borderRadius`: `8px`
- `padding`: `12px`
- 文字颜色: `shades.900`
- 字体大小: `'0.75rem'`
- 行高: `1.4`
- Typography variant: `'body2'`
- 图标尺寸: `width: 12, height: 12`

### Props

BookmarkBanner 继承自 MUI `StackProps`，因此可以使用所有 Stack 的属性（如 `sx`、`direction`、`spacing` 等）。

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| description | 显示的描述内容 | `ReactNode` | - |
| children | 子元素，当 `description` 未提供时使用 | `ReactNode` | - |
| icon | 图标组件 | `ComponentType<SvgIconProps>` | `BookmarkIcon` |
| IconProps | 传递给图标组件的属性 | `SvgIconProps` | - |
| DescriptionProps | 传递给 Typography 组件的属性 | `MuiTypographyProps` | - |
| sx | 自定义样式 | `SxProps` | - |

## 注意事项

- 如无特殊需求，应使用组件默认样式，避免自定义样式

## 示例

### 基础用法

```tsx
function Component() {
  return (
    <BookmarkBanner description={t("Message")} />
  );
}
```

### 使用富文本

当需要在描述文本中包含可点击的链接或其他自定义组件时，可以使用 `t.rich()` 函数：

```tsx
function Component() {

  const LinkTextComponent = useMemoizedFn((chunks) => (
    <MuiTypography
      sx={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'shades.900',
        textDecoration: 'underline',
      }}
    >
      {chunks}
    </MuiTypography>
  ));

  return (
    <BookmarkBanner
      description={
        <>
          {t.rich('Message', {
            Link: LinkTextComponent,
          })}
        </>
      }
    />
  );
}
```

### 使用 children

```tsx
function Component() {
  return (
    <BookmarkBanner>
      {t("Message")}
    </BookmarkBanner>
  );
}
```

### 自定义图标

```tsx
import { CustomIcon } from 'icons';

function Component() {
  return (
    <BookmarkBanner
      description={t("Message")}
      icon={CustomIcon}
    />
  );
}
```

### 自定义图标样式

```tsx
function Component() {
  return (
    <BookmarkBanner
      description={t("Message")}
      IconProps={{
        sx: { color: 'shades.800', width: 16, height: 16 }
      }}
    />
  );
}
```

### 自定义描述文本样式

```tsx
function Component() {
  return (
    <BookmarkBanner
      description={t("CustomTextStyleMessage")}
      DescriptionProps={{
        sx: { fontWeight: 'bold', color: 'error.main' }
      }}
    />
  );
}
```

### 自定义容器样式

```tsx

function Component() {
  const t = useTranslation();
  return (
    <BookmarkBanner
      description={t("CustomContainerMessage")}
      sx={{
        backgroundColor: 'primary.light',
        borderRadius: 3,
        p: 2
      }}
    />
  );
}
```

### 使用 MUI Stack 属性

```tsx
function Component() {
  return (
    <BookmarkBanner
      description={t("StackPropsMessage")}
      direction="row"
      spacing={2}
      alignItems="center"
    />
  );
}
```
