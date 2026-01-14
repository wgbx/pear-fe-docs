# Utils

工具函数集合，提供常用的 JavaScript 工具函数，涵盖字符串、对象、数组、时间等常见操作。

## 简介

Utils 模块包含了一系列实用的工具函数，帮助简化日常开发中的常见操作，提高开发效率。

## 快速开始

```typescript
import { formatDate, deepClone, debounce } from '@pear/utils'
```

## 功能分类

### 字符串处理

- `camelCase` - 转换为驼峰命名
- `kebabCase` - 转换为短横线命名
- `capitalize` - 首字母大写
- `trim` - 去除首尾空格

### 对象操作

- `deepClone` - 深拷贝
- `pick` - 选择对象属性
- `omit` - 排除对象属性
- `merge` - 对象合并

### 数组操作

- `unique` - 数组去重
- `chunk` - 数组分块
- `flatten` - 数组扁平化
- `groupBy` - 数组分组

### 时间处理

- `formatDate` - 日期格式化
- `getTimeAgo` - 相对时间
- `isSameDay` - 判断是否同一天
- `getDaysBetween` - 计算日期差

### 函数工具

- `debounce` - 防抖
- `throttle` - 节流
- `memoize` - 函数缓存
- `pipe` - 函数管道

### 类型判断

- `isString` - 判断字符串
- `isNumber` - 判断数字
- `isObject` - 判断对象
- `isArray` - 判断数组

### 其他工具

- `sleep` - 延时函数
- `random` - 随机数生成
- `uuid` - 生成唯一ID
- `formatBytes` - 格式化字节大小

## 示例

### 深拷贝

```typescript
import { deepClone } from '@pear/utils'

const obj = { a: 1, b: { c: 2 } }
const cloned = deepClone(obj)
```

### 防抖

```typescript
import { debounce } from '@pear/utils'

const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword)
}, 500)

handleSearch('hello')
```

### 日期格式化

```typescript
import { formatDate } from '@pear/utils'

const date = new Date()
formatDate(date, 'YYYY-MM-DD HH:mm:ss') // '2024-01-01 12:00:00'
```

### 数组去重

```typescript
import { unique } from '@pear/utils'

const arr = [1, 2, 2, 3, 3, 3]
unique(arr) // [1, 2, 3]
```

## 更多

更多工具函数的使用方法和 API 文档，请查看各个函数的详细文档。

