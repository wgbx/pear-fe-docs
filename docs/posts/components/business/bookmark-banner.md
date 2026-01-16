# BookmarkBanner

A bookmark banner component for displaying important messages or action prompts on the page.

## Introduction

BookmarkBanner is a business component built on MUI Stack, commonly used to display system notifications, promotional activities, important reminders, and other information. The component supports custom icons, description text styles

**Design**: [Figma Design Link](https://www.figma.com/design/LSdw4LtjDlYUs5oViNMXKT/Pear-Design-Lib?node-id=3105-526&p=f&m=dev)

## Basic Usage

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

### Default Styles

Component default styles:

- `backgroundColor`: `shades.a5`
- `borderRadius`: `8px`
- `padding`: `12px`
- Text color: `shades.900`
- Font size: `'0.75rem'`
- Line height: `1.4`
- Typography variant: `'body2'`
- Icon size: `width: 12, height: 12`

### Props

BookmarkBanner extends MUI `StackProps`, so you can use all Stack properties (such as `sx`, `direction`, `spacing`, etc.).

| Parameter | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| description | The description content to display | `ReactNode` | - |
| children | Child elements, used when `description` is not provided | `ReactNode` | - |
| icon | Icon component | `ComponentType<SvgIconProps>` | `BookmarkIcon` |
| IconProps | Properties passed to the icon component | `SvgIconProps` | - |
| DescriptionProps | Properties passed to the Typography component | `MuiTypographyProps` | - |
| sx | Custom styles | `SxProps` | - |

## Notes

- Use the component's default styles unless there are special requirements; avoid custom styling

## Examples

### Basic Usage

```tsx
function Component() {
  return (
    <BookmarkBanner description={t("Message")} />
  );
}
```

### Using Rich Text

When you need to include clickable links or other custom components in the description text, you can use the `t.rich()` function:

```tsx
import { BookmarkBanner, descriptionSx } from '@webCommon/components-ui/molecules/TipBanner';

function Component() {

  const LinkTextComponent = useMemoizedFn((chunks) => (
    <MuiTypography
      sx={{
        ...descriptionSx,
        fontWeight: 700,
        textDecoration: 'underline',
      }}
    >
      {chunks}
    </MuiTypography>
  ));

  return (
    <BookmarkBanner
      description={t.rich('Message', {
        Link: LinkTextComponent,
      })}
    />
  );
}
```

### Using children

```tsx
function Component() {
  return (
    <BookmarkBanner>
      {t("Message")}
    </BookmarkBanner>
  );
}
```

### Custom Icon

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

### Custom Icon Styles

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

### Custom Description Text Styles

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

### Custom Container Styles

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

### Using MUI Stack Properties

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
