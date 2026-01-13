# 其他工具

其他实用的工具函数。

## sleep

延时函数。

### 用法

```typescript
import { sleep } from '@pear/utils'

async function example() {
  console.log('开始')
  await sleep(1000)
  console.log('1秒后')
}
```

## random

随机数生成。

### 用法

```typescript
import { random } from '@pear/utils'

random(1, 10) // 生成 1-10 之间的随机数
random(0, 100) // 生成 0-100 之间的随机数
```

## uuid

生成唯一ID。

### 用法

```typescript
import { uuid } from '@pear/utils'

uuid() // '550e8400-e29b-41d4-a716-446655440000'
```

## formatBytes

格式化字节大小。

### 用法

```typescript
import { formatBytes } from '@pear/utils'

formatBytes(1024) // '1 KB'
formatBytes(1048576) // '1 MB'
formatBytes(1073741824) // '1 GB'
```

