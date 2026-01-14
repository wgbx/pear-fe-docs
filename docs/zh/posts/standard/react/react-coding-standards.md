---
title: React 编码规范
description: React 组件开发的标准编码规范和最佳实践
outline:
  level: 2
---
# React 编码规范

## JSX 中禁止箭头函数

### 🎯 规则说明

**禁止在 JSX 中使用箭头函数（任何形式）**，包括：

+ 内联箭头函数
+ 组件内的箭头函数赋值
+ 事件处理器中的箭头函数

### 💡 为什么这么做？

+ ✅ 提高代码可读性和一致性
+ ✅ 避免每次渲染创建新函数引用，减少性能损耗
+ ✅ function 声明支持 hoisting，代码组织更灵活
+ ✅ 清晰区分函数定义和调用

### ✅ 解决方案

| 场景 | 解决方案 |
| --- | --- |
| **事件处理器** | 使用 useMemoizedFn |
| **渲染函数（无状态依赖）** | 定义在组件外部  |
| **渲染函数（有状态依赖）** | 使用 useMemoizedFn |

### 📝 示例

#### ❌ 错误示例

```plain
// 错误 1: 内联箭头函数（事件处理器）
<button onClick={() => handleClick()}>Click</button>

// 错误 2: 内联箭头函数（map 回调）
<div>{items.map(item => <Item key={item.id} />)}</div>

// 错误 3: 组件内箭头函数赋值
function Component() {
  const handleSubmit = () => { /* logic */ }
  return <form onSubmit={handleSubmit}>...</form>
}

// 错误 4: 箭头函数赋值给变量（组件外）
const renderUser = (user: User) => <UserCard user={user} />
```

#### ✅ 正确示例

```plain
// 正确 1: 使用 useMemoizedFn（事件处理器）
import { useMemoizedFn } from 'ahooks'

function Component() {
  const handleClick = useMemoizedFn(() => {
    // 处理逻辑
  })

  return <button onClick={handleClick}>Click</button>
}
```

```plain
// 正确 2: 函数定义在组件外部（无状态依赖）
function renderItem(item: ItemType) {
  return <Item key={item.id} />
}

function List({ items }: Props) {
  return <div>{items.map(renderItem)}</div>
}
```

```plain
// 正确 3: useMemoizedFn（需要访问组件状态）
function List({ items, currentId }: Props) {
  const renderItem = useMemoizedFn((item: ItemType) => (
    <Item key={item.id} active={currentId === item.id} />
  ))

  return <div>{items.map(renderItem)}</div>
}
```

```plain
// 正确 4: function 声明（组件外）
function renderUser(user: User) {
  return <UserCard key={user.id} user={user} />
}
```

## 列表渲染规范

### 🎯 规则说明

**列表渲染必须使用唯一且稳定的 key**，避免使用数组索引作为 key。

### 💡 为什么这么做？

React 使用 key 来识别哪些元素改变了、被添加或被删除。错误的 key 会导致：

+ ❌ 性能问题（不必要的 DOM 重建）
+ ❌ 状态错乱（组件状态绑定到错误的元素）
+ ❌ 动画异常
+ ❌ 表单输入值混乱

### ✅ 解决方案

| 场景 | 推荐方案 |
| --- | --- |
| **有唯一 ID** | 直接使用 item.id |
| **多字段组合唯一** | 使用复合 key：${userId}-${postId} |
| **数据无 ID** | 方案 1: 后端添加 ID<br>方案 2: 前端生成稳定 ID（nanoid）<br>方案 3: 使用哈希值  |
| **静态列表** | 例外：可以使用索引  |

### 📝 示例

#### ❌ 错误示例

```plain
// 错误 1: 使用索引作为 key
<ul>
  {items.map((item, index) => (
    <li key={index}>{item.name}</li>
  ))}
</ul>

// 错误 2: 没有 key
<ul>
  {items.map(item => (
    <li>{item.name}</li>
  ))}
</ul>

// 错误 3: 使用非唯一值作为 key
<ul>
  {items.map(item => (
    <li key={item.name}>{item.name}</li>  // name 可能重复
  ))}
</ul>

// 错误 4: 使用随机数作为 key
<ul>
  {items.map(item => (
    <li key={Math.random()}>{item.name}</li>  // 每次渲染都变
  ))}
</ul>
```

#### ✅ 正确示例

```plain
// 正确 1: 使用唯一 ID
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>

// 正确 2: 使用复合 key（多个字段组合保证唯一）
<ul>
  {items.map(item => (
    <li key={`${item.userId}-${item.postId}`}>{item.content}</li>
  ))}
</ul>

// 正确 3: 使用稳定的哈希值
import { hash } from './utils'

<ul>
  {items.map(item => (
    <li key={hash(item)}>{item.name}</li>
  ))}
</ul>
```

#### ⚠️ 例外：索引作为 key 的特殊情况

**只有**当满足以下**所有条件**时，才可以使用索引作为 key：

```plain
// ✅ 允许使用索引的场景：
// 1. 列表固定，不会增删改
// 2. 列表项没有状态（纯展示）
// 3. 列表不会重新排序

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

<ul>
  {WEEKDAYS.map((day, index) => (
    <li key={index}>{day}</li>
  ))}
</ul>
```

#### 🐛 问题演示：索引作为 key 导致状态错乱

```plain
// ❌ 问题演示：使用索引会导致状态错乱
function TodoList() {
  const [todos, setTodos] = useState([
    { text: '任务1' },
    { text: '任务2' },
    { text: '任务3' },
  ])

  // 使用索引作为 key
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} />  // ❌ 删除第一项后，状态会错位
      ))}
    </ul>
  )
}

// ✅ 正确：使用唯一 ID
function TodoList() {
  const [todos, setTodos] = useState([
    { id: '1', text: '任务1' },
    { id: '2', text: '任务2' },
    { id: '3', text: '任务3' },
  ])

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />  // ✅ 删除任意项都不会错位
      ))}
    </ul>
  )
}
```

#### 🔧 如果数据没有 ID 怎么办？

```plain
// 方案 1: 后端添加 ID
// 最佳方案，让后端返回唯一标识

// 方案 2: 前端生成稳定 ID
import { nanoid } from 'nanoid'

const itemsWithId = items.map(item => ({
  ...item,
  _id: nanoid()  // 只生成一次，保持稳定
}))

// 方案 3: 使用数据内容生成哈希
import { hash } from 'object-hash'

<ul>
  {items.map(item => (
    <li key={hash(item)}>{item.name}</li>
  ))}
</ul>
```

## 业务逻辑必须在 Hooks

### 🎯 规则说明

**业务逻辑必须提取到自定义 Hooks**，组件只负责 UI 渲染。

**什么是业务逻辑？**

+ 数据获取（API 调用）
+ 数据转换和处理
+ 表单验证
+ 复杂计算
+ 状态管理
+ 副作用处理

### 💡 为什么这么做？

+ ✅ 逻辑可复用（多个组件可共享同一 Hook）
+ ✅ 组件更简洁（只关注 UI 渲染）
+ ✅ 更易测试（可单独测试业务逻辑）
+ ✅ 职责清晰（UI 和逻辑分离）

### ✅ 解决方案

将业务逻辑提取到 hooks/ 目录下的自定义 Hook：

+ 数据获取 → useUserData.ts
+ 表单处理 → useFormValidation.ts
+ 复杂计算 → useCalculation.ts

### 📝 示例

#### ❌ 错误示例：业务逻辑混在组件中

```plain
function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // ❌ 业务逻辑直接写在组件里
  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      setUser(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return <div>{loading ? 'Loading...' : user?.name}</div>
}
```

#### ✅ 正确示例：业务逻辑提取到 Hook

```plain
// hooks/useUser.ts
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchUser = useMemoizedFn(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setUser(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  })

  useEffect(() => {
    fetchUser()
  }, [fetchUser, userId])

  return { user, loading, error, refetch: fetchUser }
}

// UserProfile.tsx - 只负责 UI
function UserProfile({ userId }: Props) {
  const { user, loading, error } = useUser(userId)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  if (!user) return <EmptyState />

  return <UserCard user={user} />
}
```

## 每个 Hook 一个职责

### 🎯 规则说明

**每个自定义 Hook 应该有明确的单一职责**，避免臃肿的、包含过多不相关功能的 Hook。

**良好 Hook 的特征：**

+ 有**一个明确的目的/职责**（在名称中体现）
+ 返回少量相关（**紧密耦合**）的值（最多 2-5 个；1 个理想）
+ 可以独立使用
+ 有明确的依赖关系

### 💡 为什么这么做？

**臃肿 Hook 的问题：**

+ ❌ 不必要的性能开销（每次调用都加载不需要的函数和计算）
+ ❌ 维护性差（难以删除死代码，需要检查所有使用位置的每个返回值）
+ ❌ 职责不清晰，增加理解成本
+ ❌ 难以复用（使用者被迫接受所有功能）

**单一职责 Hook 的优势：**

+ ✅ 按需使用，避免不必要的膨胀
+ ✅ 更容易测试和维护
+ ✅ 清晰的依赖关系
+ ✅ 易于删除（直接查找使用情况即可）

### ✅ 解决方案

**拆分策略：**

| Hook 类型 | 职责范围 | 返回值数量 | 示例 |
| --- | --- | --- | --- |
| **数据获取** | 单一数据源  | 2-4 个  | useUser() → { user, loading, error } |
| **状态管理** | 单一状态  | 1-3 个  | useToggle() → { isOpen, open, close } |
| **表单处理** | 单一表单  | 3-5 个  | useForm() → { values, errors, handleSubmit } |
| **计算逻辑** | 单一计算  | 1 个  | useFilteredList() → filteredList |

**判断标准：**

+ ✅ 能用一句话清晰描述职责
+ ✅ 名称中没有 "and"、"或" 等连接词
+ ✅ 返回值之间紧密相关
+ ❌ 包含多个独立功能
+ ❌ 某些返回值只在特定场景使用

### 📝 示例

#### ❌ 错误示例：臃肿的 Hook

```plain
// ❌ 错误：一个 Hook 做了太多事情
function useUserDashboard(userId: string) {
  // 功能 1: 用户数据
  const [user, setUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(false)

  // 功能 2: 订单数据
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // 功能 3: 统计数据
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // 功能 4: 通知数据
  const [notifications, setNotifications] = useState<Notification[]>([])

  // 功能 5: 设置
  const [settings, setSettings] = useState<Settings | null>(null)

  // ... 大量获取逻辑

  // ❌ 返回过多不相关的值（10+ 个）
  return {
    user,
    userLoading,
    orders,
    ordersLoading,
    stats,
    statsLoading,
    notifications,
    settings,
    updateSettings,
    refreshAll,
  }
}

// ❌ 问题：使用者只需要用户数据，却被迫加载所有功能
function UserProfile({ userId }: Props) {
  const { user, userLoading } = useUserDashboard(userId)
  // 订单、统计、通知等都被加载，但这里不需要

  return <div>{user?.name}</div>
}
```

```plain
// ❌ 错误：职责不清晰的 Hook
function useFormAndValidationAndSubmit() {
  // 包含多个独立职责：表单管理、验证、提交
  // 名称中的 "And" 就说明职责不单一
}
```

#### ✅ 正确示例：拆分为多个单一职责 Hook

```plain
// ✅ 正确：拆分成独立的 Hooks

// Hook 1: 只负责用户数据
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchUser = useMemoizedFn(async () => {
    setLoading(true)
    try {
      const data = await api.getUser(userId)
      setUser(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  })

  useEffect(() => {
    fetchUser()
  }, [userId, fetchUser])

  return { user, loading, error, refetch: fetchUser }
}

// Hook 2: 只负责订单数据
function useUserOrders(userId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  // ... 订单获取逻辑

  return { orders, loading }
}

// Hook 3: 只负责统计数据
function useUserStats(userId: string) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  // ... 统计计算逻辑

  return { stats, loading }
}

// Hook 4: 只负责通知
function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // ... 通知逻辑

  return { notifications }
}

// Hook 5: 只负责设置
function useUserSettings(userId: string) {
  const [settings, setSettings] = useState<Settings | null>(null)

  const updateSettings = useMemoizedFn(async (newSettings: Partial<Settings>) => {
    // ... 更新逻辑
  })

  return { settings, updateSettings }
}
```

```plain
// ✅ 使用：按需组合
function UserProfile({ userId }: Props) {
  // 只加载需要的数据
  const { user, loading } = useUser(userId)

  if (loading) return <Spinner />
  return <div>{user?.name}</div>
}

function UserDashboard({ userId }: Props) {
  // 按需组合多个 Hooks
  const { user } = useUser(userId)
  const { orders } = useUserOrders(userId)
  const { stats } = useUserStats(userId)

  return (
    <div>
      <UserHeader user={user} />
      <OrderList orders={orders} />
      <StatsPanel stats={stats} />
    </div>
  )
}
```

#### 📌 进阶：Hook 组合模式

```plain
// ✅ 正确：使用组合模式构建复杂功能
function useUserDashboard(userId: string) {
  // 组合多个单一职责的 Hooks
  const user = useUser(userId)
  const orders = useUserOrders(userId)
  const stats = useUserStats(userId)

  // 只返回组合后的结果，不添加额外逻辑
  return { user, orders, stats }
}

// 每个底层 Hook 仍然可以独立使用
// 组合 Hook 只是提供便利，不强制使用
```

#### ⚠️ 返回值数量指南

```plain
// ✅ 理想：返回 1 个值
function useFilteredList(items: Item[], filter: string) {
  const filtered = useMemo(() =>
    items.filter(item => item.name.includes(filter)),
    [items, filter]
  )
  return filtered  // 只返回一个值
}

// ✅ 良好：返回 2-3 个紧密相关的值
function useToggle(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue)
  const open = useMemoizedFn(() => setIsOpen(true))
  const close = useMemoizedFn(() => setIsOpen(false))
  const toggle = useMemoizedFn(() => setIsOpen(v => !v))

  return { isOpen, open, close, toggle }  // 4 个值，但都紧密相关
}

// ⚠️ 可接受：返回 4-5 个值（但需确保紧密相关）
function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useMemoizedFn(async () => { /* ... */ })
  const reset = useMemoizedFn(() => { /* ... */ })

  return { data, loading, error, refetch, reset }  // 5 个值，都与异步数据相关
}

// ❌ 过多：返回 6+ 个值（考虑拆分）
function useTooManyThings() {
  return {
    value1, value2, value3,
    value4, value5, value6,
    fn1, fn2, fn3
  }  // 太多了，可能职责不单一
}
```

## 单文件单组件原则

### 🎯 规则说明

遵循三个核心原则：

1. **一个文件只能有一个主组件**（包括导出和未导出的组件）
2. **每个组件只做一件事**（单一职责原则）
3. **文件名与组件名保持一致**

### 💡 为什么这么做？

+ ✅ 代码结构清晰，易于查找和维护
+ ✅ 遵循单一职责原则，降低耦合度
+ ✅ 便于代码复用和测试
+ ✅ 避免文件过大，提高可读性

### ✅ 解决方案

**命名规范：**

| 场景 | 文件名 | 组件名 | 示例 |
| --- | --- | --- | --- |
| **React 组件** | PascalCase  | PascalCase  | UserCard.tsx → UserCard |
| **自定义 Hook** | camelCase  | camelCase  | useUserData.ts → useUserData |
| **工具函数** | camelCase  | camelCase  | formatDate.ts → formatDate |
| **类型定义** | PascalCase  | | UserTypes.ts |

**单一职责判断标准：**

+ ✅ 只有一个改变的理由
+ ✅ 可以用一句话描述清楚
+ ✅ 不包含"和"、"或"等连接词

### 📝 示例

#### ❌ 错误示例

```plain
// ❌ 错误 1: 一个文件多个导出组件
// UserComponents.tsx
export function UserCard() { }
export function UserList() { }
export function UserProfile() { }

// ❌ 错误 2: 主组件 + 多个辅助组件
// Dashboard.tsx
export function Dashboard() { }
function Header() { }  // 不导出但存在
function Sidebar() { }
function Content() { }

// ❌ 错误 3: 文件名与组件名不一致
// user-card.tsx
export function UserCard() { }  // 应该是 UserCard.tsx

// ❌ 错误 4: 组件职责不单一
function UserDashboard() {
  // 同时处理：用户信息、订单列表、统计图表、设置面板
  return (
    <div>
      <UserProfile />
      <OrderList />
      <Statistics />
      <SettingsPanel />
    </div>
  )
}
```

#### ✅ 正确示例

```plain
// ✅ 正确 1: 拆分成独立文件
// UserCard.tsx
export function UserCard() { }

// UserList.tsx
export function UserList() { }

// UserProfile.tsx
export function UserProfile() { }
```

```plain
// ✅ 正确 2: 组件 + 小型私有辅助组件（< 10 行）
// Form.tsx
export function Form() {
  return (
    <form>
      <FormField />
    </form>
  )
}

// 仅在此文件内部使用的小型辅助组件
function FormField() { // < 10 行，不可复用
  return <div>...</div>
}
```

```plain
// ✅ 正确 3: 单一职责，清晰拆分
// UserDashboard.tsx - 只负责布局
export function UserDashboard() {
  return (
    <div className="dashboard">
      <UserSection />
      <OrderSection />
      <StatisticsSection />
      <SettingsSection />
    </div>
  )
}

// UserSection.tsx - 只负责用户信息
export function UserSection() {
  const { user } = useUser()
  return <UserProfile user={user} />
}
```

```plain
// ✅ 正确 4: 职责单一
function UserProfile() { }  // 只展示用户资料
function UserSettings() { }  // 只处理用户设置

// ❌ 错误: 职责不单一
function UserProfileAndSettings() { }  // "和"表示多个职责
```

#### 🔓 例外情况

允许存在于同一文件：

+ ✅ 组件的私有辅助组件（< 10 行 且 不可复用）
+ ✅ 类型定义
+ ✅ 常量

## JSX 可读性规范

### 🎯 规则说明

**大括号内不要写复杂逻辑**，保持 JSX 简洁易读。

**什么是复杂逻辑？**

+ 多层嵌套的条件判断
+ 链式可选链（超过 2 层）
+ 复杂的计算表达式
+ 多个逻辑运算符组合

### 💡 为什么这么做？

+ ✅ 提高代码可读性，减少理解成本
+ ✅ 便于维护和调试
+ ✅ 降低出错概率
+ ✅ 让 JSX 更接近声明式 UI

### ✅ 解决方案

**最佳实践：**

| 复杂逻辑类型 | 解决方案 |
| --- | --- |
| **多层条件** | 提前处理，提取到变量  |
| **复杂计算** | 使用 useMemo 或辅助函数  |
| **链式调用** | 提取到变量，添加空值保护  |
| **多个判断** | 提取为有意义的变量名  |
| **复杂渲染** | 拆分为子组件或辅助函数  |

**判断标准：**

| JSX 表达式复杂度 | 是否需要提取 |
| --- | --- |
| 单层条件（user && <div/>）  | ✅ 可以保留  |
| 三元运算符（a ? b : c）  | ✅ 可以保留  |
| 2 层可选链（user?.name）  | ✅ 可以保留  |
| 3+ 层可选链  | ❌ 必须提取  |
| 多个 && 或 \\|\\| | ❌ 必须提取  |
| 数组方法链（filter().map()）  | ❌ 必须提取  |
| 复杂计算  | ❌ 必须提取  |

### 📝 示例

#### ❌ 错误示例

```plain
// 错误 1: 多层条件嵌套
<div>
  {user && user.profile && user.profile.avatar ? (
    <img src={user.profile.avatar} />
  ) : (
    <DefaultAvatar />
  )}
</div>

// 错误 2: 复杂的链式调用
<div>
  {data?.user?.posts?.filter(p => p.published)?.slice(0, 5)?.map(p => (
    <Post key={p.id} post={p} />
  ))}
</div>

// 错误 3: 复杂的计算逻辑
<div>
  {items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
</div>

// 错误 4: 多个逻辑运算符
<button disabled={!user || !user.verified || user.posts.length === 0 || loading}>
  Submit
</button>
```

#### ✅ 正确示例

```plain
// 正确 1: 提前处理条件
function UserAvatar({ user }: Props) {
  const avatarUrl = user?.profile?.avatar

  return (
    <div>
      {avatarUrl ? <img src={avatarUrl} /> : <DefaultAvatar />}
    </div>
  )
}
```

```plain
// 正确 2: 提取到变量
function PostList({ data }: Props) {
  const publishedPosts = data?.user?.posts
    ?.filter(p => p.published)
    ?.slice(0, 5) ?? []

  return (
    <div>
      {publishedPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
```

```plain
// 正确 3: 使用 useMemo 或提取到函数
function ShoppingCart({ items }: Props) {
  const total = useMemo(() => {
    return items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  }, [items])

  return <div>总计: ¥{total}</div>
}
```

```plain
// 正确 4: 提取到有意义的变量名
function SubmitButton({ user, loading }: Props) {
  const canSubmit = user?.verified && user.posts.length > 0 && !loading

  return <button disabled={!canSubmit}>Submit</button>
}
```

#### 📌 进阶技巧

**1. 早期返回（Early Return）**

```plain
// ✅ 使用早期返回简化逻辑
function UserProfile({ user }: Props) {
  if (!user) return <EmptyState />
  if (user.banned) return <BannedMessage />
  if (!user.verified) return <VerificationPrompt />

  return <ProfileContent user={user} />
}
```

**2. 使用辅助函数**

```plain
// ✅ 提取渲染逻辑到函数
function OrderList({ orders }: Props) {
  function renderOrderStatus(order: Order) {
    if (order.status === 'pending') return <PendingBadge />
    if (order.status === 'shipped') return <ShippedBadge />
    return <CompletedBadge />
  }

  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>
          {order.title}
          {renderOrderStatus(order)}
        </li>
      ))}
    </ul>
  )
}
```

**3. 使用组件拆分**

```plain
// ✅ 拆分为子组件
function UserCard({ user }: Props) {
  return (
    <div>
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions user={user} />
    </div>
  )
}
```

## 文件大小限制：350 行

### 🎯 规则说明

+ **单个文件最大 350 行**（包括空行和注释）
+ 超过限制必须拆分

### 💡 为什么这么做？

+ ✅ 提高代码可读性和可维护性
+ ✅ 降低认知负担，便于理解
+ ✅ 促进模块化设计
+ ✅ 减少合并冲突

### ✅ 解决方案

**拆分策略：**

| 拆分方式 | 适用场景 | 方法 |
| --- | --- | --- |
| **组件拆分** | 组件过大  | 拆分为多个子组件  |
| **逻辑拆分** | 业务逻辑复杂  | 提取到自定义 Hooks  |
| **类型拆分** | 类型定义多  | 移到独立的 types.ts  |
| **工具拆分** | 工具函数多  | 移到 utils.ts  |

### 📝 示例

#### 策略 1: 组件拆分

```plain
// ❌ 单个文件 500 行
UserProfile.tsx (500 lines)
  - UserHeader
  - UserStats
  - UserActivity
  - UserSettings

// ✅ 拆分为多个文件
/components/UserProfile/
  index.tsx (50 lines)        - 主组件
  UserHeader.tsx (80 lines)
  UserStats.tsx (100 lines)
  UserActivity.tsx (120 lines)
  UserSettings.tsx (150 lines)
  types.ts (30 lines)
```

#### 策略 2: 逻辑拆分

```plain
// ❌ 单文件包含所有逻辑
PageWithData.tsx (400 lines)
  - 数据获取
  - 数据处理
  - UI 渲染
  - 事件处理

// ✅ 逻辑分离
Page.tsx (100 lines)           - UI 组件
usePageData.ts (80 lines)      - 数据 hook
usePageActions.ts (70 lines)   - 事件处理 hook
utils.ts (60 lines)            - 工具函数
types.ts (40 lines)            - 类型定义
```

## 使用动态加载

### 🎯 规则说明

**使用动态导入（React.lazy）进行代码拆分**，通过不发送用户不可见的 UI 组件的代码来改善初始加载时间。

**适用场景：**

+ 模态框（Modal）
+ 弹出层 / Popover
+ 工具提示（Tooltip）
+ 富文本编辑器
+ 图表组件（如 ECharts、Chart.js）
+ 体积较大的第三方组件
+ 后台管理中的大型页面模块
+ 条件渲染的页面或 Tab 内组件

### 💡 为什么这么做？

+ ❌ 一次发送所有内容会膨胀页面大小
+ ❌ 不必要地减慢加载时间（发送用户可能永远不会看到的组件）
+ ❌ 浪费用户流量
+ ✅ 用户**不点击、不打开**，就不会加载对应代码
+ ✅ 改善首屏加载性能
+ ✅ 按需加载，减少初始包体积

### ✅ 解决方案

使用 React.lazy + Suspense 实现动态导入：

```plain
// 动态导入组件
const ComponentName = React.lazy(() => import('./ComponentName'))

// 使用时包裹 Suspense
<Suspense fallback={<Loading />}>
  {condition && <ComponentName />}
</Suspense>
```

### 📝 示例

#### ❌ 错误示例：所有组件都在首屏加载

```plain
// ❌ 错误：直接导入，首屏就加载
import UserModal from './UserModal'
import ChartPanel from './ChartPanel'
import RichTextEditor from './RichTextEditor'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [showChart, setShowChart] = useState(false)

  return (
    <>
      <button onClick={() => setShowModal(true)}>打开弹窗</button>
      {showModal && <UserModal />}  {/* 虽然条件渲染，但代码已加载 */}

      <button onClick={() => setShowChart(true)}>显示图表</button>
      {showChart && <ChartPanel />}  {/* 虽然条件渲染，但代码已加载 */}
    </>
  )
}
```

#### ✅ 正确示例：使用动态加载

```plain
// ✅ 正确：动态导入，按需加载
import { lazy, Suspense } from 'react'

const UserModal = lazy(() => import('./UserModal'))
const ChartPanel = lazy(() => import('./ChartPanel'))
const RichTextEditor = lazy(() => import('./RichTextEditor'))

function App() {
  const [showModal, setShowModal] = useState(false)
  const [showChart, setShowChart] = useState(false)

  return (
    <>
      <button onClick={() => setShowModal(true)}>打开弹窗</button>
      <Suspense fallback={<div>加载中...</div>}>
        {showModal && <UserModal />}  {/* 点击按钮时才加载代码 */}
      </Suspense>

      <button onClick={() => setShowChart(true)}>显示图表</button>
      <Suspense fallback={<Spinner />}>
        {showChart && <ChartPanel />}  {/* 点击按钮时才加载代码 */}
      </Suspense>
    </>
  )
}
```

#### 📌 常见场景示例

**1. 模态框动态加载**

```plain
const UserDetailModal = lazy(() => import('./UserDetailModal'))

function UserList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <>
      <table>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <button onClick={() => setSelectedUser(user)}>
                查看详情
              </button>
            </td>
          </tr>
        ))}
      </table>

      <Suspense fallback={<Loading />}>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Suspense>
    </>
  )
}
```

**2. Tab 内容动态加载**

```plain
const SettingsTab = lazy(() => import('./tabs/SettingsTab'))
const ProfileTab = lazy(() => import('./tabs/ProfileTab'))
const OrdersTab = lazy(() => import('./tabs/OrdersTab'))

function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile')

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab value="profile">个人资料</Tab>
        <Tab value="orders">订单记录</Tab>
        <Tab value="settings">设置</Tab>
      </Tabs>

      <Suspense fallback={<TabLoading />}>
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </Suspense>
    </div>
  )
}
```

**3. 大型第三方组件动态加载**

```plain
// ✅ 正确：图表组件按需加载
const EChartsChart = lazy(() => import('./charts/EChartsChart'))

function Dashboard() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        显示销售统计图表
      </button>

      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <EChartsChart data={salesData} />
        </Suspense>
      )}
    </div>
  )
}
```

**4. 路由级别的代码拆分**

```plain
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// 路由页面动态加载
const HomePage = lazy(() => import('./pages/Home'))
const AboutPage = lazy(() => import('./pages/About'))
const UserPage = lazy(() => import('./pages/User'))
const AdminPage = lazy(() => import('./pages/Admin'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

#### ⚠️ 注意事项

**1. Suspense 位置**

```plain
// ❌ 错误：Suspense 位置不当，可能导致整个页面闪烁
function App() {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <Header />
      <Content />
      {condition && <LazyModal />}  {/* 只有 Modal 是 lazy 的 */}
    </Suspense>
  )
}

// ✅ 正确：Suspense 只包裹 lazy 组件
function App() {
  return (
    <>
      <Header />
      <Content />
      <Suspense fallback={<ModalLoading />}>
        {condition && <LazyModal />}
      </Suspense>
    </>
  )
}
```

**2. 预加载优化**

```plain
// ✅ 高级：鼠标悬停时预加载
const UserModal = lazy(() => import('./UserModal'))

// 创建预加载函数
const preloadUserModal = () => {
  import('./UserModal')
}

function UserCard({ user }: Props) {
  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        onMouseEnter={preloadUserModal}  // 悬停时预加载
      >
        查看详情
      </button>

      <Suspense fallback={<Loading />}>
        {showModal && <UserModal user={user} />}
      </Suspense>
    </div>
  )
}
```

**3. 错误边界处理**

```plain
// ✅ 结合 ErrorBoundary 处理加载失败
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary fallback={<div>加载失败，请刷新页面</div>}>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## 禁止使用 React.FC

### 🎯 规则说明

**不使用**React.FC 或 FC 类型，使用普通 function 声明组件。

### 💡 为什么这么做？

+ ❌ React.FC 隐式添加 children，导致类型不准确
+ ❌ 难以与泛型组件配合使用
+ ❌ 不支持条件类型推断
+ ❌ 官方已不推荐使用
+ ✅ function 声明更清晰、更灵活

### ✅ 解决方案

使用普通 function 声明 + 显式 Props 类型定义。

### 📝 示例

#### ❌ 错误示例

```plain
// 错误 1: 使用 React.FC
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

// 错误 2: 使用 FC 别名
import { FC } from 'react'
const Button: FC<ButtonProps> = (props) => { }
```

#### ✅ 正确示例

```plain
// 正确 1: 普通 function + Props 类型
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
```

```plain
// 正确 2: 命名导出
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

export function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

## useMemo 使用限制

### 🎯 规则说明

**只在必要时使用 useMemo**，避免过度优化。

### 💡 为什么这么做？

+ ❌ useMemo 本身有成本（依赖比较、内存占用）
+ ❌ 过度使用增加代码复杂度
+ ✅ 仅在有性能收益时使用
+ ✅ 传给 React.memo 子组件时必须使用

### ✅ 解决方案

**何时使用 useMemo：**

| 场景 | 是否使用 | 原因 |
| --- | --- | --- |
| 简单计算（a + b）  | ❌  | 计算成本低于 useMemo 开销  |
| 复杂计算（> 几毫秒）  | ✅  | 避免重复计算  |
| 小数组操作（< 100 项） | ❌  | 计算成本低（除非传给 memo 子组件）  |
| 大数组操作（> 1000 项） | ✅  | 计算成本高  |
| 传给 React.memo 子组件  | ✅  | 保持引用稳定，避免子组件重渲染  |
| 传给普通子组件  | ❌  | 普通组件不做浅比较  |

**判断标准：**

| 计算耗时 | 传给 memo 子组件 | 建议 |
| --- | --- | --- |
| < 0.5ms  | 否  | ❌ 不用  |
| < 0.5ms  | 是  | ✅ 使用  |
| 0.5-5ms  | 否  | ⚠️ 测量后决定  |
| 0.5-5ms  | 是  | ✅ 使用  |
| 5ms  | 否  | ✅ 使用  |
| 5ms  | 是  | ✅ 使用  |

**快速决策流程图：**

```plain
计算结果是 对象/数组？
  ├─ 否 → 简单值（number/string/boolean）
  │        └─ 计算耗时？（> 几毫秒）
  │             ├─ 是 → ✅ 使用 useMemo
  │             └─ 否 → ❌ 不用 useMemo
  │
  └─ 是 → 传给子组件？
           ├─ 否 → 计算量大？（> 1000 项或复杂运算）
           │        ├─ 是 → ✅ 使用 useMemo
           │        └─ 否 → ❌ 不用 useMemo
           │
           └─ 是 → 子组件用 React.memo？
                    ├─ 是 → ✅ 必须使用 useMemo
                    └─ 否 → 计算量大？
                             ├─ 是 → ✅ 使用 useMemo
                             └─ 否 → ❌ 不用 useMemo
```

### 📝 示例

#### ❌ 错误示例：过度优化

```plain
// 错误 1: 简单计算不需要 useMemo
const total = useMemo(() => price * quantity, [price, quantity])
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName])

// 错误 2: 小数据量用 useMemo
const filtered = useMemo(
  () => items.filter(item => item.active),  // items < 100
  [items]
)
```

#### ❌ 错误示例：忘记使用 useMemo

```plain
// 错误 3: 传给 memo 子组件但不用 useMemo
const Child = React.memo(ChildComponent)

// 每次渲染 config 都是新对象，导致 Child 重渲染
const config = { theme: 'dark', settings: complexSettings }

return <Child config={config} />
```

#### ✅ 正确示例

```plain
// 正确 1: 简单计算直接写
const total = price * quantity
const fullName = `${firstName} ${lastName}`
```

```plain
// 正确 2: 复杂计算或大数据量使用 useMemo
const processedData = useMemo(() => {
  return items
    .filter(item => item.status === 'active')
    .map(item => ({
      ...item,
      calculated: expensiveCalculation(item),
    }))
    .sort((a, b) => a.priority - b.priority)
}, [items])
```

```plain
// 正确 3: 传给 memo 子组件必须用 useMemo
const Child = React.memo(ChildComponent)

const config = useMemo(() => ({
  theme: 'dark',
  settings: complexSettings
}), [complexSettings])

return <Child config={config} />
```

#### ⚠️ 关键判断：React.memo 子组件

```plain
// 场景 1: 不传给子组件 - 小数据量可以不用
function Parent({ items }) {  // items < 100
  const filtered = items.filter(item => item.active)  // ✅ 直接计算
  return <div>{filtered.map(item => <div key={item.id}>{item.name}</div>)}</div>
}

// 场景 2: 传给普通子组件 - 不需要
function Parent({ items }) {
  const filtered = items.filter(item => item.active)  // ✅ 直接计算
  return <RegularChild data={filtered} />  // 普通组件
}

// 场景 3: 传给 memo 子组件 - 必须用
function Parent({ items }) {
  const filtered = useMemo(
    () => items.filter(item => item.active),
    [items]
  )  // ✅ 保持引用稳定
  return <MemoChild data={filtered} />  // React.memo 组件
}

const MemoChild = React.memo(function MemoChild({ data }) {
  return <div>{data.length}</div>
})
```

#### 🔬 如何测量性能

**方法 1: console.time()**

```plain
function MyComponent({ items }) {
  console.time('filter')
  const filtered = items.filter(item => item.active)
  console.timeEnd('filter')  // 输出: filter: 0.123ms

  return <div>{filtered.length}</div>
}

// 判断：< 1ms → 不值得用 useMemo
//      > 5ms → 应该用 useMemo
```

**方法 2: React DevTools Profiler**

1. 打开 React DevTools > Profiler 标签
2. 录制并触发组件重渲染
3. 查看 "Render duration"
4. 对比使用/不使用 useMemo 的渲染时间

## forwardRef 使用规范

### 🎯 规则说明

forwardRef **必须设置 displayName**（箭头函数）或**使用具名函数**（推荐）。

### 💡 为什么这么做？

+ ✅ 错误堆栈更清晰，便于调试
+ ✅ React DevTools 中显示组件名
+ ✅ 提高代码可读性
+ ✅ 符合项目整体代码风格

### ✅ 解决方案

**两种方案对比：**

| 方案 | 优点 | 缺点 | 推荐度 |
| --- | --- | --- | --- |
| **箭头函数 + displayName** | 代码简洁  | 错误堆栈不清晰，容易忘记设置  | ⭐⭐⭐  |
| **具名函数** | 错误堆栈清晰，无需手动设置 displayName  | 代码稍长  | ⭐⭐⭐⭐⭐  |

**推荐使用具名函数**。

### 📝 示例

#### ❌ 错误示例

```plain
// 错误 1: 箭头函数但没有 displayName
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />
})

// 错误 2: 匿名函数
const Input = forwardRef<HTMLInputElement, InputProps>(function(props, ref) {
  return <input ref={ref} {...props} />
})
```

#### ✅ 正确示例

```plain
// 正确 1: 箭头函数 + displayName
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />
})
Input.displayName = "Input"
```

```plain
// 正确 2: 具名函数（推荐）
const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />
  }
)
```

```plain
// 正确 3: 复杂组件示例
const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function CustomButton({ children, variant = 'primary', ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
```
