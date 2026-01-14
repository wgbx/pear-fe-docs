# 字符串处理

字符串处理相关的工具函数。

## camelCase

转换为驼峰命名。

### 用法

```typescript
import { camelCase } from '@pear/utils'

camelCase('hello-world') // 'helloWorld'
camelCase('hello_world') // 'helloWorld'
```

## kebabCase

转换为短横线命名。

### 用法

```typescript
import { kebabCase } from '@pear/utils'

kebabCase('helloWorld') // 'hello-world'
kebabCase('hello_world') // 'hello-world'
```

## capitalize

首字母大写。

### 用法

```typescript
import { capitalize } from '@pear/utils'

capitalize('hello') // 'Hello'
capitalize('hello world') // 'Hello world'
```

## trim

去除首尾空格。

### 用法

```typescript
import { trim } from '@pear/utils'

trim('  hello  ') // 'hello'
```

