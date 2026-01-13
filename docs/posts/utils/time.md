# 时间处理

时间处理相关的工具函数。

## formatDate

日期格式化。

### 用法

```typescript
import { formatDate } from '@pear/utils'

const date = new Date()
formatDate(date, 'YYYY-MM-DD HH:mm:ss') // '2024-01-01 12:00:00'
formatDate(date, 'YYYY/MM/DD') // '2024/01/01'
```

## getTimeAgo

相对时间。

### 用法

```typescript
import { getTimeAgo } from '@pear/utils'

const date = new Date(Date.now() - 3600000) // 1小时前
getTimeAgo(date) // '1小时前'
```

## isSameDay

判断是否同一天。

### 用法

```typescript
import { isSameDay } from '@pear/utils'

const date1 = new Date('2024-01-01')
const date2 = new Date('2024-01-01')
isSameDay(date1, date2) // true
```

## getDaysBetween

计算日期差。

### 用法

```typescript
import { getDaysBetween } from '@pear/utils'

const date1 = new Date('2024-01-01')
const date2 = new Date('2024-01-10')
getDaysBetween(date1, date2) // 9
```

