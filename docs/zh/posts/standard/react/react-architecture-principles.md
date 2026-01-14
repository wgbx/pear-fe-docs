---
title: React 架构 30 条原则
description: React 组件架构设计的最佳实践和原则
---

# React 架构 30 条原则

## 最小 API 原则（Minimal Surface API）
组件应只暴露最少必要的 props，隐藏内部实现细节，降低耦合与变更成本。

**Bad**

```typescript
// 将实现细节全部暴露给调用方，难以重构
type User = { id: string; name: string; avatar: string };
function UserCard(props: {
  user: User;
  setUser: (u: User) => void;
  refresh: () => void;
}) {
  // ...
  return <div>{props.user.name}</div>;
}
```

**Good**

```typescript
// 只暴露必要字段，易于替换与重构
function UserCard(props: { name: string; avatar?: string }) {
  return (
    <div>
      <img src={props.avatar} alt="avatar" />
      <span>{props.name}</span>
    </div>
  );
}
```

## 稳定接口原则（Stable Interface）
外部接口（props / hook 返回值）应保持稳定，避免频繁变更破坏调用方。

**Bad**

```typescript
// hook 随意返回杂项字段，调用方难维护
function useUser() {
  return { a: 1, b: 2, c: 3 } as any;
}
const { a, b } = useUser();
```

**Good**

```typescript
// 明确定义返回值，扩展使用可选字段
type UseUserResult = {
  data: User | null;
  isLoading: boolean;
  refresh: () => void;
};
function useUser(): UseUserResult {
  /* ... */
}
const { data, isLoading, refresh } = useUser();
```

## 依赖倒置（Dependency Inversion）
UI 组件依赖抽象（hook/service），不直接依赖实现（fetch/axios），便于测试与替换。

**Bad**

```typescript
// UI 直接调用网络请求 — 难以 mock / 重用
function UserCard() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUser);
  }, []);
  return <div>{user?.name}</div>;
}
```

**Good**

```typescript
// UI 通过抽象 hook 获取数据，实现可替换
function useUserService() {
  return {
    getUser: async () => {
      const r = await fetch("/api/user");
      return r.json();
    },
  };
}
function useUser() {
  const svc = useUserService();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    svc.getUser().then(setUser);
  }, [svc]);
  return user;
}
function UserCard() {
  const user = useUser();
  return <div>{user?.name}</div>;
}
```

## 单向数据流（One-way Data Flow）
State 应自上而下流动，子组件通过回调告知父组件变更，避免直接修改父状态。

**Bad**

```typescript
// 子组件直接修改父组件传入的可变对象
function Parent() {
  const [state] = useState({ count: 0 });
  return <Child parentState={state} />;
}
function Child({ parentState }: { parentState: { count: number } }) {
  // 直接修改外部对象（禁止）
  parentState.count += 1;
  return <div>{parentState.count}</div>;
}
```

**Good**

```typescript
function Parent() {
  const [count, setCount] = useState(0);
  return <Child onIncrement={() => setCount((c) => c + 1)} count={count} />;
}
function Child({
  count,
  onIncrement,
}: {
  count: number;
  onIncrement: () => void;
}) {
  return <button onClick={onIncrement}>{count}</button>;
}
```

## 不可变状态（Immutability）
不要直接 mutate state，永远返回新的对象以触发 React 正常比较与渲染。

**Bad**

```typescript
const [user, setUser] = useState({ friends: [] as string[] });
function addFriend(name: string) {
  // 直接修改数组（错误）
  user.friends.push(name);
  setUser(user);
}
```

**Good**

```typescript
const [user, setUser] = useState({ friends: [] as string[] });
function addFriend(name: string) {
  setUser((prev) => ({ ...prev, friends: [...prev.friends, name] }));
}
```

## 组件分层（UI / Logic / Data）
将展示、业务逻辑、数据访问分成不同层次，便于测试与复用。

**Bad**

```typescript
function Panel() {
  const [data, setData] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.text())
      .then(setData);
  }, []);
  return <div>{data}</div>;
}
```

**Good**

```typescript
// data service
async function fetchData(): Promise<string> {
  return fetch("/api/data").then((r) => r.text());
}
// logic hook
function usePanelData() {
  const [data, setData] = useState<string | null>(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  return data;
}
// UI component
function PanelView({ data }: { data: string | null }) {
  return <div>{data}</div>;
}
// container
function Panel() {
  const data = usePanelData();
  return <PanelView data={data} />;
}
```

## Hooks 分层（UI state / Business logic / Data access）
自定义 hook 也应分层，不把所有内容塞到一个 hook 中。

**Bad**

```typescript
function useUserAllInOne() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUser);
  }, []);
  function toggle() {
    setOpen((v) => !v);
  }
  function business() {
    /* ... */
  }
  return { open, toggle, user, business };
}
```

**Good**

```typescript
function useUserService() {
  async function load() {
    return fetch("/api/user").then((r) => r.json());
  }
  return { load };
}
function useUserLogic() {
  // domain logic
  function canEdit(user?: User) {
    return !!user && user.role === "editor";
  }
  return { canEdit };
}
function useUserUIState() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
```

## 关注点分离（Separation of Concerns）
把业务规则、UI 呈现、数据访问分离到各自模块，便于维护和复用。

**Bad**

```typescript
// 直接在组件里写复杂业务判断
function UserActions({ user }: { user: User }) {
  if (user.role === "admin" && user.status !== "banned" && user.points > 100) {
    // ...
  }
  return <div />;
}
```

**Good**

```typescript
// domain.ts
export function canPromote(user: User) {
  return user.role === "admin" && user.status !== "banned" && user.points > 100;
}
// component
function UserActions({ user }: { user: User }) {
  if (canPromote(user)) {
    /* ... */
  }
  return <div />;
}
```

## Pure Component（无副作用）
组件渲染应保持纯粹，副作用放在 useEffect 中。

**Bad**

```typescript
function UsersList() {
  // 副作用直接发生在渲染阶段
  fetch("/api/users")
    .then((r) => r.json())
    .then(console.log);
  return <div>Users</div>;
}
```

**Good**

```typescript
function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers);
  }, []);
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

## 组合优于继承（Composition over Inheritance）
使用组合（children / props）构建可复用组件，避免类继承带来的复杂性。

**Bad**

```typescript
// 试图用继承复用 UI（不推荐）
class BaseButton extends Component<any> {
  render() {
    return <button />;
  }
}
class PrimaryButton extends (BaseButton as any) {
  /* ... */
}
```

**Good**

```typescript
function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return <button onClick={onClick}>{children}</button>;
}
function PrimaryButton(props: { children: ReactNode; onClick?: () => void }) {
  return <Button {...props} />;
}
```

## 受控 / 非受控 清晰区分（Controlled vs Uncontrolled）
决定一个输入是受控还是非受控，并保持一致，避免混用导致行为不确定。

**Bad**

```typescript
// 混用 value 与 defaultValue
function NameInput({ value }: { value?: string }) {
  return <input value={value} defaultValue="guest" />;
}
```

**Good**

```typescript
// 受控示例
function ControlledName({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
// 非受控示例
function UncontrolledName() {
  const ref = useRef<HTMLInputElement | null>(null);
  return <input defaultValue="guest" ref={ref} />;
}
```

## 状态最小化（Minimal State）
只把会影响渲染且需要持久化的值放入 state，避免冗余状态。

**Bad**

```typescript
const [first, setFirst] = useState("John");
const [last, setLast] = useState("Doe");
const [full, setFull] = useState(first + " " + last);
// 需要同步管理 full，容易出错
```

**Good**

```typescript
const [first, setFirst] = useState("John");
const [last, setLast] = useState("Doe");
const full = `${first} ${last}`; // 计算属性，不放 state
```

## Container-first 组织结构
先设计容器（逻辑 / 数据），再实现展示组件，这样 UI 更容易替换。

**Bad**

```typescript
// 先写一大堆 UI，再把逻辑拼进去，结构混乱
function ProfilePage() {
  return <ProfileView />;
}
```

**Good**

```typescript
// 先写 hook / container
function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  /* load */ return { user };
}
function ProfileContainer() {
  const { user } = useProfile();
  return <ProfileView user={user} />;
}
```

## 避免深层 prop drilling
超过几层传同一个 prop 时，改用 context 或自定义 hook。

**Bad**

```typescript
// 层层传递相同 props
function A({ x }: any) {
  return <B x={x} />;
}
function B({ x }: any) {
  return <C x={x} />;
}
function C({ x }: any) {
  return <D x={x} />;
}
```

**Good**

```typescript
const XContext = createContext<string | null>(null);
function Provider({ x, children }: any) {
  return <XContext.Provider value={x}>{children}</XContext.Provider>;
}
function D() {
  const x = useContext(XContext);
  return <div>{x}</div>;
}
```

## Context 必须保持轻量
Context 会导致整个子树重渲染，避免把大量、经常变化的数据放进 Context。

**Bad**

```typescript
// 把大列表或频繁变化的 state 放入 context，会导致性能问题
const UserContext = createContext<any>(null);
function Provider({ value }: any) {
  return (
    <UserContext.Provider value={value}>{/* big tree */}</UserContext.Provider>
  );
}
```

**Good**

```typescript
// 只放“小而稳定”的值，例如 theme / locale / auth token
const ThemeContext = createContext("light");
function ThemeProvider({ theme, children }: any) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
```

## 避免在渲染期间创建函数/对象
在渲染中不断创建匿名对象/函数会触发不必要的子组件重渲染，使用 useMemo/useCallback/useMemoizedFn 在必要时稳定引用。

**Bad**

```typescript
function Card() {
  const style = { fontSize: 12 };
  const onClick = () => console.log("click");
  return (
    <Button style={style} onClick={onClick}>
      OK
    </Button>
  );
}
```

**Good**

```typescript
function Card() {
  const style = useMemo(() => ({ fontSize: 12 }), []);
  const onClick = useMemoizedFn(() => console.log("click"));
  return (
    <Button style={style} onClick={onClick}>
      OK
    </Button>
  );
}
```

or

```typescript
const CardButtonStyle = { fontSize: 12 };
function Card() {
  const onClick = useMemoizedFn(() => console.log("click"));
  return (
    <Button style={CardButtonStyle} onClick={onClick}>
      OK
    </Button>
  );
}
```

## 避免 useEffect 滥用
能在渲染期计算的值不要放 useEffect，useEffect 应用于副作用（IO、订阅、手动 DOM 操作）。

**Bad**

```typescript
// 把可计算的值放在 effect 中
useEffect(() => {
  setTotal(a + b);
}, [a, b]);
```

**Good**

```typescript
// 直接计算而非副作用
const total = a + b;
```

## 状态提升不要过度（Lift state only when necessary）
状态应放在刚好能被需要的最小共同父组件，不要把所有状态都提升到顶层。

**Bad**

```typescript
// 将所有 state 放到 App，导致大量不必要的重渲染
function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  return <BigTree a={a} b={b} />;
}
```

**Good**

```typescript
// 仅提升到实际需要共享的层级
function Parent() {
  const [shared, setShared] = useState(0);
  return <Child shared={shared} />;
}
```

## 控制组件大小（Component Size）
保持单个组件精简（逻辑/渲染可一目了然），超过一定行数或复杂度就拆分。

**Bad**

```typescript
// 500+ 行的单一组件（伪示例） — 可读性差、难以维护
function BigComponent() {
  /* hundreds of lines */
}
```

**Good**

```typescript
function Header() {
  /* small */
}
function Footer() {
  /* small */
}
function Page() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
```

## 避免智能组件 / 傻瓜组件反转
Container（智能）应位于外层，UI（傻瓜）组件专注渲染，职责不要互换。

**Bad**

```typescript
// UI 组件里包含网络请求和复杂逻辑
function UserView() {
  const [u, setU] = useState(null);
  /* fetch */
  return <div>{u?.name}</div>;
}
```

**Good**

```typescript
function UserContainer() {
  const user = useUser();
  return <UserView user={user} />;
}
function UserView({ user }: { user?: User }) {
  return <div>{user?.name}</div>;
}
```

## 事件处理语义化
事件命名应反映行为语义（onSubmit/onSelect/onCancel），便于理解与替换。

**Bad**

```typescript
<button onClick={() => handleClick1()} />
```

**Good**

```typescript
<button onClick={handleSubmit}>Submit</button>
// handleSubmit 的命名要表意
```

## 避免跨组件隐式依赖
组件之间应通过显式接口（props / context）通信，避免通过全局变量或 window 共享状态。

**Bad**

```typescript
// 依赖全局 window 对象
(window as any).globalState = { user: null };
function A() {
  const user = (window as any).globalState.user;
}
```

**Good**

```typescript
const AuthContext = createContext<{ user?: User } | null>(null);
function A() {
  const auth = useContext(AuthContext);
  return <div>{auth?.user?.name}</div>;
}
```

## 列表渲染必须有稳定 key
key 应使用稳定唯一 id，避免用 index 导致重排问题。

**Bad**

```typescript
{
  items.map((it, i) => <li key={i}>{it.name}</li>);
}
```

**Good**

```typescript
{
  items.map((it) => <li key={it.id}>{it.name}</li>);
}
```

## 避免临时匿名组件
组件应具名以便调试与性能分析，避免在渲染里临时声明组件。

**Bad**

```typescript
const T = () => <div>{Math.random()}</div>;
function Page() {
  return <T />;
}
```

**Good**

```typescript
function RandomBox() {
  return <div>{Math.random()}</div>;
}
function Page() {
  return <RandomBox />;
}
```

## 错误边界（Error Boundary）必须存在
在根或重要子树放置 ErrorBoundary 捕获渲染错误，提升稳健性。

**Bad**

```typescript
// 根组件没有错误边界
function App() {
  return <Main />;
}
```

**Good**

```typescript
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? (
      <div>Something went wrong</div>
    ) : (
      this.props.children
    );
  }
}
function App() {
  return (
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  );
}
```

## 避免深层渲染分支
复杂分支逻辑应拆为小组件或状态视图，避免多层嵌套 if/else 导致可读性差。

**Bad**

```typescript
function View({ a, b, c }: any) {
  if (a) {
    if (b) {
      if (c) return <X />;
      return <Y />;
    }
    return <Z />;
  }
  return null;
}
```

**Good**

```typescript
function StateView({ a, b, c }: any) {
  if (!a) return null;
  if (!b) return <MissingB />;
  return c ? <X /> : <Y />;
}
```

## Suspense 优先（异步渲染）
优先使用 Suspense / lazy 加载或并发特性处理异步 UI，减少手动 loading 分支。

**Bad**

```typescript
function User() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
```

**Good**

```typescript
const UserLazy = lazy(() => import("./UserClient"));
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserLazy />
    </Suspense>
  );
}
```

## 避免滥用全局状态（Global State）
不要把所有东西都放到 Redux / 全局 store，优先 local state 或局部共享。

**Bad**

```typescript
// 所有 state 都放入 redux，大量不必要的全局依赖
```

**Good**

```typescript
// 仅对真正需要跨众多无关组件共享的数据使用全局 store，其余用 local state
function TodoItem({ id }: { id: string }) {
  const [open, setOpen] = useState(false); /* local state */
}
```

## useMemoizedFn / useCallback / useMemo 用于稳定性（而非滥用）
这些 hooks 用来稳定引用与避免不必要的重渲染，避免盲目包裹所有函数。

**Bad**

```typescript
// 盲目使用
const onClick = useMemoizedFn(() => doSomething(), []);
const compute = useMemo(() => heavyCalc(), []);
```

**Good**

```typescript
// 仅在传递到深层子组件或依赖数组敏感时使用
const onClick = useMemoizedFn(() => doSomething(id));
const memoizedValue = useMemo(() => computeExpensive(a), [a]);
```

## SSR / CSR / RSC 边界明确（尤其是 Next.js）
明确区分 server components（服务器渲染）、client components（浏览器交互）和 RSC（React Server Components）场景，避免在 server component 中使用浏览器 API（如 window / document）。

尤其是 Next.js 需要遵守：
服务器逻辑放 server components
浏览器逻辑放 client components
不要混搭

**Bad**

```typescript
// server component 中使用浏览器 API（错误）
// app/profile/page.tsx (server component)
export default function ProfilePage() {
  console.log(window.location.href); // ❌ 在服务器上不可用
  return <div>Profile</div>;
}
```

**Good**

```typescript
// server component 提供数据，client component 做交互
// app/profile/page.tsx (server component)
import ProfileClient from "./ProfileClient";
export default async function ProfilePage() {
  const user = await fetch("https://api.example.com/me").then((r) => r.json());
  return <ProfileClient user={user} />;
}

// app/profile/ProfileClient.tsx (client component)
"use client";
import React from "react";
export default function ProfileClient({ user }: { user: any }) {
  useEffect(() => {
    // 只能在客户端使用
    console.log(window.location.href);
  }, []);
  return <div>{user.name}</div>;
}
```

