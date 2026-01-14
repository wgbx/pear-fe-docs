---
title: React Coding Standards
description: Standard coding standards and best practices for React component development
outline:
  level: 2
---
# React Coding Standards

## Prohibit Arrow Functions in JSX

### 🎯 Rule Description

**Prohibit using arrow functions in JSX (any form)**, including:

+ Inline arrow functions
+ Arrow function assignments within components
+ Arrow functions in event handlers

### 💡 Why?

+ ✅ Improve code readability and consistency
+ ✅ Avoid creating new function references on every render, reducing performance overhead
+ ✅ `function` declarations support hoisting, making code organization more flexible
+ ✅ Clearly distinguish function definitions and calls

### ✅ Solution

| Scenario | Solution |
| --- | --- |
| **Event Handlers** | Use useMemoizedFn |
| **Render Functions (no state dependency)** | Define outside component |
| **Render Functions (with state dependency)** | Use useMemoizedFn |

### 📝 Examples

#### ❌ Bad Examples

```typescript
// Bad 1: Inline arrow function (event handler)
<button onClick={() => handleClick()}>Click</button>

// Bad 2: Inline arrow function (map callback)
<div>{items.map(item => <Item key={item.id} />)}</div>

// Bad 3: Arrow function assignment within component
function Component() {
  const handleSubmit = () => { /* logic */ }
  return <form onSubmit={handleSubmit}>...</form>
}

// Bad 4: Arrow function assigned to variable (outside component)
const renderUser = (user: User) => <UserCard user={user} />
```

#### ✅ Good Examples

```typescript
// Good 1: Use useMemoizedFn (event handler)
import { useMemoizedFn } from 'ahooks'

function Component() {
  const handleClick = useMemoizedFn(() => {
    // Handle logic
  })

  return <button onClick={handleClick}>Click</button>
}
```

```typescript
// Good 2: Function defined outside component (no state dependency)
function renderItem(item: ItemType) {
  return <Item key={item.id} />
}

function List({ items }: Props) {
  return <div>{items.map(renderItem)}</div>
}
```

```typescript
// Good 3: useMemoizedFn (needs to access component state)
function List({ items, currentId }: Props) {
  const renderItem = useMemoizedFn((item: ItemType) => (
    <Item key={item.id} active={currentId === item.id} />
  ))

  return <div>{items.map(renderItem)}</div>
}
```

```typescript
// Good 4: function declaration (outside component)
function renderUser(user: User) {
  return <UserCard key={user.id} user={user} />
}
```

## List Rendering Standards

### 🎯 Rule Description

**List rendering must use unique and stable keys**, avoid using array indices as keys.

### 💡 Why?

React uses keys to identify which elements have changed, been added, or removed. Wrong keys can cause:

+ ❌ Performance issues (unnecessary DOM reconstruction)
+ ❌ State confusion (component state bound to wrong elements)
+ ❌ Animation anomalies
+ ❌ Form input value confusion

### ✅ Solution

| Scenario | Recommended Approach |
| --- | --- |
| **Has unique ID** | Use item.id directly |
| **Multiple fields combine uniquely** | Use composite key: ${userId}-${postId} |
| **Data has no ID** | Option 1: Backend adds ID<br>Option 2: Frontend generates stable ID (nanoid)<br>Option 3: Use hash value |
| **Static list** | Exception: Can use index |

### 📝 Examples

#### ❌ Bad Examples

```typescript
// Bad 1: Using index as key
<ul>
  {items.map((item, index) => (
    <li key={index}>{item.name}</li>
  ))}
</ul>

// Bad 2: No key
<ul>
  {items.map(item => (
    <li>{item.name}</li>
  ))}
</ul>

// Bad 3: Using non-unique value as key
<ul>
  {items.map(item => (
    <li key={item.name}>{item.name}</li>  // name may be duplicated
  ))}
</ul>

// Bad 4: Using random number as key
<ul>
  {items.map(item => (
    <li key={Math.random()}>{item.name}</li>  // Changes on every render
  ))}
</ul>
```

#### ✅ Good Examples

```typescript
// Good 1: Use unique ID
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>

// Good 2: Use composite key (multiple fields combined to ensure uniqueness)
<ul>
  {items.map(item => (
    <li key={`${item.userId}-${item.postId}`}>{item.content}</li>
  ))}
</ul>

// Good 3: Use stable hash value
import { hash } from './utils'

<ul>
  {items.map(item => (
    <li key={hash(item)}>{item.name}</li>
  ))}
</ul>
```

#### ⚠️ Exception: Special Cases for Index as Key

**Only** when all of the following conditions are met, can index be used as key:

```typescript
// ✅ Scenarios where index is allowed:
// 1. List is fixed, won't add/delete/modify
// 2. List items have no state (pure display)
// 3. List won't be reordered

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

<ul>
  {WEEKDAYS.map((day, index) => (
    <li key={index}>{day}</li>
  ))}
</ul>
```

#### 🐛 Problem Demo: Index as Key Causes State Confusion

```typescript
// ❌ Problem demo: Using index causes state confusion
function TodoList() {
  const [todos, setTodos] = useState([
    { text: 'Task 1' },
    { text: 'Task 2' },
    { text: 'Task 3' },
  ])

  // Using index as key
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} />  // ❌ After deleting first item, state will be misaligned
      ))}
    </ul>
  )
}

// ✅ Correct: Use unique ID
function TodoList() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Task 1' },
    { id: '2', text: 'Task 2' },
    { id: '3', text: 'Task 3' },
  ])

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />  // ✅ Deleting any item won't cause misalignment
      ))}
    </ul>
  )
}
```

#### 🔧 What If Data Has No ID?

```typescript
// Option 1: Backend adds ID
// Best approach, have backend return unique identifier

// Option 2: Frontend generates stable ID
import { nanoid } from 'nanoid'

const itemsWithId = items.map(item => ({
  ...item,
  _id: nanoid()  // Generate only once, keep stable
}))

// Option 3: Use data content to generate hash
import { hash } from 'object-hash'

<ul>
  {items.map(item => (
    <li key={hash(item)}>{item.name}</li>
  ))}
</ul>
```

## Business Logic Must Be in Hooks

### 🎯 Rule Description

**Business logic must be extracted to custom Hooks**, components only handle UI rendering.

**What is business logic?**

+ Data fetching (API calls)
+ Data transformation and processing
+ Form validation
+ Complex calculations
+ State management
+ Side effect handling

### 💡 Why?

+ ✅ Logic is reusable (multiple components can share the same Hook)
+ ✅ Components are cleaner (only focus on UI rendering)
+ ✅ Easier to test (can test business logic separately)
+ ✅ Clear responsibilities (UI and logic separation)

### ✅ Solution

Extract business logic to custom Hooks in hooks/ directory:

+ Data fetching → useUserData.ts
+ Form handling → useFormValidation.ts
+ Complex calculations → useCalculation.ts

### 📝 Examples

#### ❌ Bad Example: Business Logic Mixed in Component

```typescript
function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // ❌ Business logic directly written in component
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

#### ✅ Good Example: Business Logic Extracted to Hook

```typescript
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

// UserProfile.tsx - Only handles UI
function UserProfile({ userId }: Props) {
  const { user, loading, error } = useUser(userId)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  if (!user) return <EmptyState />

  return <UserCard user={user} />
}
```

## One Hook, One Responsibility

### 🎯 Rule Description

**Each custom Hook should have a clear single responsibility**, avoid bloated Hooks containing too many unrelated features.

**Characteristics of good Hooks:**

+ Has **one clear purpose/responsibility** (reflected in the name)
+ Returns a small number of related (**tightly coupled**) values (2-5 max; 1 is ideal)
+ Can be used independently
+ Has clear dependencies

### 💡 Why?

**Problems with bloated Hooks:**

+ ❌ Unnecessary performance overhead (loads unneeded functions and calculations on every call)
+ ❌ Poor maintainability (difficult to delete dead code, need to check every return value at all usage locations)
+ ❌ Unclear responsibilities, increases understanding cost
+ ❌ Difficult to reuse (users forced to accept all features)

**Advantages of single-responsibility Hooks:**

+ ✅ Use on demand, avoid unnecessary bloat
+ ✅ Easier to test and maintain
+ ✅ Clear dependencies
+ ✅ Easy to delete (just search for usage)

### ✅ Solution

**Splitting Strategy:**

| Hook Type | Responsibility Scope | Return Value Count | Example |
| --- | --- | --- | --- |
| **Data Fetching** | Single data source | 2-4 | useUser() → { user, loading, error } |
| **State Management** | Single state | 1-3 | useToggle() → { isOpen, open, close } |
| **Form Handling** | Single form | 3-5 | useForm() → { values, errors, handleSubmit } |
| **Calculation Logic** | Single calculation | 1 | useFilteredList() → filteredList |

**Judgment Criteria:**

+ ✅ Can clearly describe responsibility in one sentence
+ ✅ Name doesn't contain "and", "or" and other conjunctions
+ ✅ Return values are tightly related
+ ❌ Contains multiple independent features
+ ❌ Some return values only used in specific scenarios

### 📝 Examples

#### ❌ Bad Example: Bloated Hook

```typescript
// ❌ Bad: One Hook does too many things
function useUserDashboard(userId: string) {
  // Feature 1: User data
  const [user, setUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(false)

  // Feature 2: Order data
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Feature 3: Statistics data
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Feature 4: Notification data
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Feature 5: Settings
  const [settings, setSettings] = useState<Settings | null>(null)

  // ... Lots of fetching logic

  // ❌ Returns too many unrelated values (10+)
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

// ❌ Problem: User only needs user data, but forced to load all features
function UserProfile({ userId }: Props) {
  const { user, userLoading } = useUserDashboard(userId)
  // Orders, stats, notifications all loaded, but not needed here

  return <div>{user?.name}</div>
}
```

```typescript
// ❌ Bad: Unclear responsibility Hook
function useFormAndValidationAndSubmit() {
  // Contains multiple independent responsibilities: form management, validation, submission
  // The "And" in the name indicates non-single responsibility
}
```

#### ✅ Good Example: Split into Multiple Single-Responsibility Hooks

```typescript
// ✅ Good: Split into independent Hooks

// Hook 1: Only responsible for user data
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

// Hook 2: Only responsible for order data
function useUserOrders(userId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  // ... Order fetching logic

  return { orders, loading }
}

// Hook 3: Only responsible for statistics data
function useUserStats(userId: string) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  // ... Statistics calculation logic

  return { stats, loading }
}

// Hook 4: Only responsible for notifications
function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // ... Notification logic

  return { notifications }
}

// Hook 5: Only responsible for settings
function useUserSettings(userId: string) {
  const [settings, setSettings] = useState<Settings | null>(null)

  const updateSettings = useMemoizedFn(async (newSettings: Partial<Settings>) => {
    // ... Update logic
  })

  return { settings, updateSettings }
}
```

```typescript
// ✅ Usage: Combine on demand
function UserProfile({ userId }: Props) {
  // Only load needed data
  const { user, loading } = useUser(userId)

  if (loading) return <Spinner />
  return <div>{user?.name}</div>
}

function UserDashboard({ userId }: Props) {
  // Combine multiple Hooks on demand
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

#### 📌 Advanced: Hook Composition Pattern

```typescript
// ✅ Good: Use composition pattern to build complex features
function useUserDashboard(userId: string) {
  // Compose multiple single-responsibility Hooks
  const user = useUser(userId)
  const orders = useUserOrders(userId)
  const stats = useUserStats(userId)

  // Only return composed result, don't add extra logic
  return { user, orders, stats }
}

// Each underlying Hook can still be used independently
// Composition Hook just provides convenience, not mandatory
```

#### ⚠️ Return Value Count Guidelines

```typescript
// ✅ Ideal: Return 1 value
function useFilteredList(items: Item[], filter: string) {
  const filtered = useMemo(() =>
    items.filter(item => item.name.includes(filter)),
    [items, filter]
  )
  return filtered  // Only return one value
}

// ✅ Good: Return 2-3 tightly related values
function useToggle(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue)
  const open = useMemoizedFn(() => setIsOpen(true))
  const close = useMemoizedFn(() => setIsOpen(false))
  const toggle = useMemoizedFn(() => setIsOpen(v => !v))

  return { isOpen, open, close, toggle }  // 4 values, but all tightly related
}

// ⚠️ Acceptable: Return 4-5 values (but ensure tightly related)
function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useMemoizedFn(async () => { /* ... */ })
  const reset = useMemoizedFn(() => { /* ... */ })

  return { data, loading, error, refetch, reset }  // 5 values, all related to async data
}

// ❌ Too many: Return 6+ values (consider splitting)
function useTooManyThings() {
  return {
    value1, value2, value3,
    value4, value5, value6,
    fn1, fn2, fn3
  }  // Too many, probably not single responsibility
}
```

## One File, One Component Principle

### 🎯 Rule Description

Follow three core principles:

1. **One file can only have one main component** (including exported and non-exported components)
2. **Each component does one thing** (Single Responsibility Principle)
3. **File name matches component name**

### 💡 Why?

+ ✅ Clear code structure, easy to find and maintain
+ ✅ Follows Single Responsibility Principle, reduces coupling
+ ✅ Convenient for code reuse and testing
+ ✅ Avoids files being too large, improves readability

### ✅ Solution

**Naming Standards:**

| Scenario | File Name | Component Name | Example |
| --- | --- | --- | --- |
| **React Component** | PascalCase | PascalCase | UserCard.tsx → UserCard |
| **Custom Hook** | camelCase | camelCase | useUserData.ts → useUserData |
| **Utility Function** | camelCase | camelCase | formatDate.ts → formatDate |
| **Type Definition** | PascalCase | | UserTypes.ts |

**Single Responsibility Judgment Criteria:**

+ ✅ Only one reason to change
+ ✅ Can be clearly described in one sentence
+ ✅ Doesn't contain "and", "or" and other conjunctions

### 📝 Examples

#### ❌ Bad Examples

```typescript
// ❌ Bad 1: One file with multiple exported components
// UserComponents.tsx
export function UserCard() { }
export function UserList() { }
export function UserProfile() { }

// ❌ Bad 2: Main component + multiple helper components
// Dashboard.tsx
export function Dashboard() { }
function Header() { }  // Not exported but exists
function Sidebar() { }
function Content() { }

// ❌ Bad 3: File name doesn't match component name
// user-card.tsx
export function UserCard() { }  // Should be UserCard.tsx

// ❌ Bad 4: Component not single responsibility
function UserDashboard() {
  // Simultaneously handles: user info, order list, statistics chart, settings panel
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

#### ✅ Good Examples

```typescript
// ✅ Good 1: Split into independent files
// UserCard.tsx
export function UserCard() { }

// UserList.tsx
export function UserList() { }

// UserProfile.tsx
export function UserProfile() { }
```

```typescript
// ✅ Good 2: Component + small private helper component (< 10 lines)
// Form.tsx
export function Form() {
  return (
    <form>
      <FormField />
    </form>
  )
}

// Small helper component only used within this file
function FormField() { // < 10 lines, not reusable
  return <div>...</div>
}
```

```typescript
// ✅ Good 3: Single responsibility, clear split
// UserDashboard.tsx - Only responsible for layout
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

// UserSection.tsx - Only responsible for user info
export function UserSection() {
  const { user } = useUser()
  return <UserProfile user={user} />
}
```

```typescript
// ✅ Good 4: Single responsibility
function UserProfile() { }  // Only displays user profile
function UserSettings() { }  // Only handles user settings

// ❌ Bad: Not single responsibility
function UserProfileAndSettings() { }  // "And" indicates multiple responsibilities
```

#### 🔓 Exceptions

Allowed in the same file:

+ ✅ Component's private helper components (< 10 lines and not reusable)
+ ✅ Type definitions
+ ✅ Constants

## JSX Readability Standards

### 🎯 Rule Description

**Don't write complex logic inside braces**, keep JSX concise and readable.

**What is complex logic?**

+ Multi-level nested conditionals
+ Chained optional chaining (more than 2 levels)
+ Complex calculation expressions
+ Multiple logical operator combinations

### 💡 Why?

+ ✅ Improve code readability, reduce understanding cost
+ ✅ Convenient for maintenance and debugging
+ ✅ Reduce error probability
+ ✅ Make JSX closer to declarative UI

### ✅ Solution

**Best Practices:**

| Complex Logic Type | Solution |
| --- | --- |
| **Multi-level Conditions** | Process early, extract to variable |
| **Complex Calculations** | Use useMemo or helper function |
| **Chained Calls** | Extract to variable, add null protection |
| **Multiple Conditions** | Extract as meaningful variable name |
| **Complex Rendering** | Split into sub-components or helper functions |

**Judgment Criteria:**

| JSX Expression Complexity | Need to Extract? |
| --- | --- |
| Single-level condition (user && <div/>) | ✅ Can keep |
| Ternary operator (a ? b : c) | ✅ Can keep |
| 2-level optional chaining (user?.name) | ✅ Can keep |
| 3+ level optional chaining | ❌ Must extract |
| Multiple && or \|\| | ❌ Must extract |
| Array method chain (filter().map()) | ❌ Must extract |
| Complex calculations | ❌ Must extract |

### 📝 Examples

#### ❌ Bad Examples

```typescript
// Bad 1: Multi-level nested conditions
<div>
  {user && user.profile && user.profile.avatar ? (
    <img src={user.profile.avatar} />
  ) : (
    <DefaultAvatar />
  )}
</div>

// Bad 2: Complex chained calls
<div>
  {data?.user?.posts?.filter(p => p.published)?.slice(0, 5)?.map(p => (
    <Post key={p.id} post={p} />
  ))}
</div>

// Bad 3: Complex calculation logic
<div>
  {items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
</div>

// Bad 4: Multiple logical operators
<button disabled={!user || !user.verified || user.posts.length === 0 || loading}>
  Submit
</button>
```

#### ✅ Good Examples

```typescript
// Good 1: Process conditions early
function UserAvatar({ user }: Props) {
  const avatarUrl = user?.profile?.avatar

  return (
    <div>
      {avatarUrl ? <img src={avatarUrl} /> : <DefaultAvatar />}
    </div>
  )
}
```

```typescript
// Good 2: Extract to variable
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

```typescript
// Good 3: Use useMemo or extract to function
function ShoppingCart({ items }: Props) {
  const total = useMemo(() => {
    return items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  }, [items])

  return <div>Total: ¥{total}</div>
}
```

```typescript
// Good 4: Extract to meaningful variable name
function SubmitButton({ user, loading }: Props) {
  const canSubmit = user?.verified && user.posts.length > 0 && !loading

  return <button disabled={!canSubmit}>Submit</button>
}
```

#### 📌 Advanced Techniques

**1. Early Return**

```typescript
// ✅ Use early return to simplify logic
function UserProfile({ user }: Props) {
  if (!user) return <EmptyState />
  if (user.banned) return <BannedMessage />
  if (!user.verified) return <VerificationPrompt />

  return <ProfileContent user={user} />
}
```

**2. Use Helper Functions**

```typescript
// ✅ Extract rendering logic to function
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

**3. Use Component Splitting**

```typescript
// ✅ Split into sub-components
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

## File Size Limit: 350 Lines

### 🎯 Rule Description

+ **Single file maximum 350 lines** (including empty lines and comments)
+ Must split if exceeds limit

### 💡 Why?

+ ✅ Improve code readability and maintainability
+ ✅ Reduce cognitive burden, easier to understand
+ ✅ Promote modular design
+ ✅ Reduce merge conflicts

### ✅ Solution

**Splitting Strategy:**

| Splitting Method | Applicable Scenario | Method |
| --- | --- | --- |
| **Component Split** | Component too large | Split into multiple sub-components |
| **Logic Split** | Business logic complex | Extract to custom Hooks |
| **Type Split** | Many type definitions | Move to independent types.ts |
| **Utility Split** | Many utility functions | Move to utils.ts |

### 📝 Examples

#### Strategy 1: Component Split

```typescript
// ❌ Single file 500 lines
UserProfile.tsx (500 lines)
  - UserHeader
  - UserStats
  - UserActivity
  - UserSettings

// ✅ Split into multiple files
/components/UserProfile/
  index.tsx (50 lines)        - Main component
  UserHeader.tsx (80 lines)
  UserStats.tsx (100 lines)
  UserActivity.tsx (120 lines)
  UserSettings.tsx (150 lines)
  types.ts (30 lines)
```

#### Strategy 2: Logic Split

```typescript
// ❌ Single file contains all logic
PageWithData.tsx (400 lines)
  - Data fetching
  - Data processing
  - UI rendering
  - Event handling

// ✅ Logic separation
Page.tsx (100 lines)           - UI component
usePageData.ts (80 lines)      - Data hook
usePageActions.ts (70 lines)   - Event handling hook
utils.ts (60 lines)            - Utility functions
types.ts (40 lines)            - Type definitions
```

## Use Dynamic Loading

### 🎯 Rule Description

**Use dynamic imports (React.lazy) for code splitting**, improve initial load time by not sending code for UI components users can't see.

**Applicable Scenarios:**

+ Modals
+ Popovers
+ Tooltips
+ Rich text editors
+ Chart components (e.g., ECharts, Chart.js)
+ Large third-party components
+ Large page modules in admin panels
+ Conditionally rendered pages or Tab content components

### 💡 Why?

+ ❌ Sending all content at once bloats page size
+ ❌ Unnecessarily slows load time (sending components users may never see)
+ ❌ Wastes user bandwidth
+ ✅ Users **don't click, don't open**, won't load corresponding code
+ ✅ Improve first-screen load performance
+ ✅ Load on demand, reduce initial bundle size

### ✅ Solution

Use React.lazy + Suspense for dynamic imports:

```typescript
// Dynamic import component
const ComponentName = React.lazy(() => import('./ComponentName'))

// Wrap with Suspense when using
<Suspense fallback={<Loading />}>
  {condition && <ComponentName />}
</Suspense>
```

### 📝 Examples

#### ❌ Bad Example: All Components Load on First Screen

```typescript
// ❌ Bad: Direct import, loads on first screen
import UserModal from './UserModal'
import ChartPanel from './ChartPanel'
import RichTextEditor from './RichTextEditor'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [showChart, setShowChart] = useState(false)

  return (
    <>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal && <UserModal />}  {/* Conditionally rendered, but code already loaded */}

      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <ChartPanel />}  {/* Conditionally rendered, but code already loaded */}
    </>
  )
}
```

#### ✅ Good Example: Use Dynamic Loading

```typescript
// ✅ Good: Dynamic import, load on demand
import { lazy, Suspense } from 'react'

const UserModal = lazy(() => import('./UserModal'))
const ChartPanel = lazy(() => import('./ChartPanel'))
const RichTextEditor = lazy(() => import('./RichTextEditor'))

function App() {
  const [showModal, setShowModal] = useState(false)
  const [showChart, setShowChart] = useState(false)

  return (
    <>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <Suspense fallback={<div>Loading...</div>}>
        {showModal && <UserModal />}  {/* Code loads only when button clicked */}
      </Suspense>

      <button onClick={() => setShowChart(true)}>Show Chart</button>
      <Suspense fallback={<Spinner />}>
        {showChart && <ChartPanel />}  {/* Code loads only when button clicked */}
      </Suspense>
    </>
  )
}
```

#### 📌 Common Scenario Examples

**1. Modal Dynamic Loading**

```typescript
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
                View Details
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

**2. Tab Content Dynamic Loading**

```typescript
const SettingsTab = lazy(() => import('./tabs/SettingsTab'))
const ProfileTab = lazy(() => import('./tabs/ProfileTab'))
const OrdersTab = lazy(() => import('./tabs/OrdersTab'))

function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile')

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab value="profile">Profile</Tab>
        <Tab value="orders">Orders</Tab>
        <Tab value="settings">Settings</Tab>
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

**3. Large Third-Party Component Dynamic Loading**

```typescript
// ✅ Good: Chart component loads on demand
const EChartsChart = lazy(() => import('./charts/EChartsChart'))

function Dashboard() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Sales Statistics Chart
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

**4. Route-Level Code Splitting**

```typescript
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Route pages dynamic loading
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

#### ⚠️ Notes

**1. Suspense Position**

```typescript
// ❌ Bad: Suspense position inappropriate, may cause entire page to flash
function App() {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <Header />
      <Content />
      {condition && <LazyModal />}  {/* Only Modal is lazy */}
    </Suspense>
  )
}

// ✅ Good: Suspense only wraps lazy components
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

**2. Preload Optimization**

```typescript
// ✅ Advanced: Preload on mouse hover
const UserModal = lazy(() => import('./UserModal'))

// Create preload function
const preloadUserModal = () => {
  import('./UserModal')
}

function UserCard({ user }: Props) {
  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        onMouseEnter={preloadUserModal}  // Preload on hover
      >
        View Details
      </button>

      <Suspense fallback={<Loading />}>
        {showModal && <UserModal user={user} />}
      </Suspense>
    </div>
  )
}
```

**3. Error Boundary Handling**

```typescript
// ✅ Combine with ErrorBoundary to handle load failures
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary fallback={<div>Load failed, please refresh page</div>}>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Prohibit Using React.FC

### 🎯 Rule Description

**Do not use** React.FC or FC type, use regular function declaration for components.

### 💡 Why?

+ ❌ React.FC implicitly adds children, causing inaccurate types
+ ❌ Difficult to use with generic components
+ ❌ Doesn't support conditional type inference
+ ❌ Officially no longer recommended
+ ✅ function declaration is clearer and more flexible

### ✅ Solution

Use regular function declaration + explicit Props type definition.

### 📝 Examples

#### ❌ Bad Examples

```typescript
// Bad 1: Using React.FC
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

// Bad 2: Using FC alias
import { FC } from 'react'
const Button: FC<ButtonProps> = (props) => { }
```

#### ✅ Good Examples

```typescript
// Good 1: Regular function + Props type
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
```

```typescript
// Good 2: Named export
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
}

export function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

## useMemo Usage Restrictions

### 🎯 Rule Description

**Only use useMemo when necessary**, avoid over-optimization.

### 💡 Why?

+ ❌ useMemo itself has cost (dependency comparison, memory usage)
+ ❌ Overuse increases code complexity
+ ✅ Only use when there's performance benefit
+ ✅ Must use when passing to React.memo child components

### ✅ Solution

**When to use useMemo:**

| Scenario | Use? | Reason |
| --- | --- | --- |
| Simple calculation (a + b) | ❌ | Calculation cost lower than useMemo overhead |
| Complex calculation (> few ms) | ✅ | Avoid repeated calculation |
| Small array operation (< 100 items) | ❌ | Low calculation cost (unless passing to memo child component) |
| Large array operation (> 1000 items) | ✅ | High calculation cost |
| Passing to React.memo child component | ✅ | Keep reference stable, avoid child re-render |
| Passing to regular child component | ❌ | Regular components don't do shallow comparison |

**Judgment Criteria:**

| Calculation Time | Pass to memo child? | Recommendation |
| --- | --- | --- |
| < 0.5ms | No | ❌ Don't use |
| < 0.5ms | Yes | ✅ Use |
| 0.5-5ms | No | ⚠️ Measure then decide |
| 0.5-5ms | Yes | ✅ Use |
| > 5ms | No | ✅ Use |
| > 5ms | Yes | ✅ Use |

**Quick Decision Flow:**

```typescript
Is calculation result object/array?
  ├─ No → Simple value (number/string/boolean)
  │        └─ Calculation time-consuming? (> few ms)
  │             ├─ Yes → ✅ Use useMemo
  │             └─ No → ❌ Don't use useMemo
  │
  └─ Yes → Pass to child component?
           ├─ No → Large calculation? (> 1000 items or complex operation)
           │        ├─ Yes → ✅ Use useMemo
           │        └─ No → ❌ Don't use useMemo
           │
           └─ Yes → Child component uses React.memo?
                    ├─ Yes → ✅ Must use useMemo
                    └─ No → Large calculation?
                             ├─ Yes → ✅ Use useMemo
                             └─ No → ❌ Don't use useMemo
```

### 📝 Examples

#### ❌ Bad Example: Over-Optimization

```typescript
// Bad 1: Simple calculation doesn't need useMemo
const total = useMemo(() => price * quantity, [price, quantity])
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName])

// Bad 2: Small data volume using useMemo
const filtered = useMemo(
  () => items.filter(item => item.active),  // items < 100
  [items]
)
```

#### ❌ Bad Example: Forgot to Use useMemo

```typescript
// Bad 3: Passing to memo child but not using useMemo
const Child = React.memo(ChildComponent)

// config is new object on every render, causing Child to re-render
const config = { theme: 'dark', settings: complexSettings }

return <Child config={config} />
```

#### ✅ Good Examples

```typescript
// Good 1: Simple calculation write directly
const total = price * quantity
const fullName = `${firstName} ${lastName}`
```

```typescript
// Good 2: Complex calculation or large data volume use useMemo
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

```typescript
// Good 3: Must use useMemo when passing to memo child component
const Child = React.memo(ChildComponent)

const config = useMemo(() => ({
  theme: 'dark',
  settings: complexSettings
}), [complexSettings])

return <Child config={config} />
```

#### ⚠️ Key Judgment: React.memo Child Component

```typescript
// Scenario 1: Not passing to child - small data volume can skip
function Parent({ items }) {  // items < 100
  const filtered = items.filter(item => item.active)  // ✅ Direct calculation
  return <div>{filtered.map(item => <div key={item.id}>{item.name}</div>)}</div>
}

// Scenario 2: Passing to regular child - not needed
function Parent({ items }) {
  const filtered = items.filter(item => item.active)  // ✅ Direct calculation
  return <RegularChild data={filtered} />  // Regular component
}

// Scenario 3: Passing to memo child - must use
function Parent({ items }) {
  const filtered = useMemo(
    () => items.filter(item => item.active),
    [items]
  )  // ✅ Keep reference stable
  return <MemoChild data={filtered} />  // React.memo component
}

const MemoChild = React.memo(function MemoChild({ data }) {
  return <div>{data.length}</div>
})
```

#### 🔬 How to Measure Performance

**Method 1: console.time()**

```typescript
function MyComponent({ items }) {
  console.time('filter')
  const filtered = items.filter(item => item.active)
  console.timeEnd('filter')  // Output: filter: 0.123ms

  return <div>{filtered.length}</div>
}

// Judgment: < 1ms → Not worth using useMemo
//           > 5ms → Should use useMemo
```

**Method 2: React DevTools Profiler**

1. Open React DevTools > Profiler tab
2. Record and trigger component re-render
3. View "Render duration"
4. Compare render time with/without useMemo

## forwardRef Usage Standards

### 🎯 Rule Description

forwardRef **must set displayName** (arrow function) or **use named function** (recommended).

### 💡 Why?

+ ✅ Error stack clearer, easier to debug
+ ✅ Shows component name in React DevTools
+ ✅ Improve code readability
+ ✅ Consistent with overall project code style

### ✅ Solution

**Two Approaches Comparison:**

| Approach | Advantages | Disadvantages | Rating |
| --- | --- | --- | --- |
| **Arrow function + displayName** | Code concise | Error stack unclear, easy to forget to set | ⭐⭐⭐ |
| **Named function** | Error stack clear, no need to manually set displayName | Code slightly longer | ⭐⭐⭐⭐⭐ |

**Recommend using named function**.

### 📝 Examples

#### ❌ Bad Examples

```typescript
// Bad 1: Arrow function but no displayName
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />
})

// Bad 2: Anonymous function
const Input = forwardRef<HTMLInputElement, InputProps>(function(props, ref) {
  return <input ref={ref} {...props} />
})
```

#### ✅ Good Examples

```typescript
// Good 1: Arrow function + displayName
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />
})
Input.displayName = "Input"
```

```typescript
// Good 2: Named function (recommended)
const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />
  }
)
```

```typescript
// Good 3: Complex component example
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
