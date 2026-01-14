---
title: React Architecture 30 Principles
description: Best practices and principles for React component architecture design
---

# React Architecture 30 Principles

## Minimal Surface API
Components should only expose the minimum necessary props, hiding internal implementation details, reducing coupling and change costs.

**Bad**

```typescript
// Exposes all implementation details to caller, difficult to refactor
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
// Only expose necessary fields, easy to replace and refactor
function UserCard(props: { name: string; avatar?: string }) {
  return (
    <div>
      <img src={props.avatar} alt="avatar" />
      <span>{props.name}</span>
    </div>
  );
}
```

## Stable Interface
External interfaces (props / hook return values) should remain stable, avoid frequent changes that break callers.

**Bad**

```typescript
// Hook randomly returns miscellaneous fields, difficult for callers to maintain
function useUser() {
  return { a: 1, b: 2, c: 3 } as any;
}
const { a, b } = useUser();
```

**Good**

```typescript
// Clearly define return value, use optional fields for extension
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

## Dependency Inversion
UI components depend on abstractions (hook/service), not directly on implementations (fetch/axios), facilitating testing and replacement.

**Bad**

```typescript
// UI directly calls network request — difficult to mock / reuse
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
// UI gets data through abstract hook, implementation is replaceable
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

## One-way Data Flow
State should flow top-down, child components notify parent of changes through callbacks, avoid directly modifying parent state.

**Bad**

```typescript
// Child component directly modifies mutable object passed from parent
function Parent() {
  const [state] = useState({ count: 0 });
  return <Child parentState={state} />;
}
function Child({ parentState }: { parentState: { count: number } }) {
  // Directly modify external object (prohibited)
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

## Immutability
Don't directly mutate state, always return new objects to trigger React's normal comparison and rendering.

**Bad**

```typescript
const [user, setUser] = useState({ friends: [] as string[] });
function addFriend(name: string) {
  // Directly modify array (wrong)
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

## Component Layering (UI / Logic / Data)
Separate presentation, business logic, and data access into different layers, facilitating testing and reuse.

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

## Hooks Layering (UI state / Business logic / Data access)
Custom hooks should also be layered, don't stuff everything into one hook.

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

## Separation of Concerns
Separate business rules, UI presentation, and data access into their respective modules, facilitating maintenance and reuse.

**Bad**

```typescript
// Write complex business logic directly in component
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

## Pure Component (No Side Effects)
Component rendering should remain pure, side effects go in useEffect.

**Bad**

```typescript
function UsersList() {
  // Side effects occur directly during render phase
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

## Composition over Inheritance
Use composition (children / props) to build reusable components, avoid complexity from class inheritance.

**Bad**

```typescript
// Attempting to reuse UI with inheritance (not recommended)
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

## Controlled vs Uncontrolled Clear Distinction
Decide whether an input is controlled or uncontrolled, and remain consistent, avoid mixing causing uncertain behavior.

**Bad**

```typescript
// Mixing value and defaultValue
function NameInput({ value }: { value?: string }) {
  return <input value={value} defaultValue="guest" />;
}
```

**Good**

```typescript
// Controlled example
function ControlledName({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
// Uncontrolled example
function UncontrolledName() {
  const ref = useRef<HTMLInputElement | null>(null);
  return <input defaultValue="guest" ref={ref} />;
}
```

## Minimal State
Only put values that affect rendering and need persistence into state, avoid redundant state.

**Bad**

```typescript
const [first, setFirst] = useState("John");
const [last, setLast] = useState("Doe");
const [full, setFull] = useState(first + " " + last);
// Need to synchronously manage full, error-prone
```

**Good**

```typescript
const [first, setFirst] = useState("John");
const [last, setLast] = useState("Doe");
const full = `${first} ${last}`; // Computed property, don't put in state
```

## Container-first Organization
Design container (logic / data) first, then implement presentation components, making UI easier to replace.

**Bad**

```typescript
// Write lots of UI first, then piece logic in, messy structure
function ProfilePage() {
  return <ProfileView />;
}
```

**Good**

```typescript
// Write hook / container first
function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  /* load */ return { user };
}
function ProfileContainer() {
  const { user } = useProfile();
  return <ProfileView user={user} />;
}
```

## Avoid Deep Prop Drilling
When passing the same prop through more than a few layers, use context or custom hook instead.

**Bad**

```typescript
// Passing same props layer by layer
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

## Context Must Stay Lightweight
Context causes entire subtree to re-render, avoid putting large, frequently changing data into Context.

**Bad**

```typescript
// Putting large list or frequently changing state into context causes performance issues
const UserContext = createContext<any>(null);
function Provider({ value }: any) {
  return (
    <UserContext.Provider value={value}>{/* big tree */}</UserContext.Provider>
  );
}
```

**Good**

```typescript
// Only put "small and stable" values, e.g., theme / locale / auth token
const ThemeContext = createContext("light");
function ThemeProvider({ theme, children }: any) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
```

## Avoid Creating Functions/Objects During Render
Continuously creating anonymous objects/functions during render triggers unnecessary child component re-renders, use useMemo/useCallback/useMemoizedFn to stabilize references when necessary.

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

## Avoid useEffect Abuse
Don't put values that can be calculated during render into useEffect, useEffect should be used for side effects (IO, subscriptions, manual DOM operations).

**Bad**

```typescript
// Put calculable value in effect
useEffect(() => {
  setTotal(a + b);
}, [a, b]);
```

**Good**

```typescript
// Calculate directly, not a side effect
const total = a + b;
```

## Lift State Minimally (Lift state only when necessary)
State should be placed in the smallest common parent component that needs it, don't lift all state to the top.

**Bad**

```typescript
// Put all state in App, causing lots of unnecessary re-renders
function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  return <BigTree a={a} b={b} />;
}
```

**Good**

```typescript
// Only lift to the level that actually needs to share
function Parent() {
  const [shared, setShared] = useState(0);
  return <Child shared={shared} />;
}
```

## Component Size
Keep individual components lean (logic/rendering can be understood at a glance), split when exceeding certain line count or complexity.

**Bad**

```typescript
// 500+ line single component (pseudo example) — poor readability, hard to maintain
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

## Avoid Smart/Dumb Component Inversion
Container (smart) should be at outer layer, UI (dumb) components focus on rendering, don't swap responsibilities.

**Bad**

```typescript
// UI component contains network requests and complex logic
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

## Semantic Event Handling
Event naming should reflect behavioral semantics (onSubmit/onSelect/onCancel), facilitating understanding and replacement.

**Bad**

```typescript
<button onClick={() => handleClick1()} />
```

**Good**

```typescript
<button onClick={handleSubmit}>Submit</button>
// handleSubmit naming should be meaningful
```

## Avoid Cross-Component Implicit Dependencies
Components should communicate through explicit interfaces (props / context), avoid sharing state through global variables or window.

**Bad**

```typescript
// Depends on global window object
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

## Stable Keys for List Rendering
Keys should use stable unique ids, avoid using index causing reordering issues.

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

## Avoiding Temporary Anonymous Components
Components should be named for debugging and performance analysis, avoid temporarily declaring components in render.

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

## Error Boundaries Must Exist
Place ErrorBoundary at root or important subtrees to catch rendering errors, improve robustness.

**Bad**

```typescript
// Root component has no error boundary
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

## Avoiding Deep Render Branches
Complex branch logic should be split into small components or state views, avoid multi-level nested if/else causing poor readability.

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

## Suspense First (Async Rendering)
Prioritize using Suspense / lazy loading or concurrent features to handle async UI, reduce manual loading branches.

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

## Avoiding Global State Abuse
Don't put everything into Redux / global store, prioritize local state or local sharing.

**Bad**

```typescript
// All state goes into redux, lots of unnecessary global dependencies
```

**Good**

```typescript
// Only use global store for data that truly needs to be shared across many unrelated components, use local state for the rest
function TodoItem({ id }: { id: string }) {
  const [open, setOpen] = useState(false); /* local state */
}
```

## useMemoizedFn / useCallback / useMemo for Stability (Not Abuse)
These hooks are used to stabilize references and avoid unnecessary re-renders, avoid blindly wrapping all functions.

**Bad**

```typescript
// Blind usage
const onClick = useMemoizedFn(() => doSomething(), []);
const compute = useMemo(() => heavyCalc(), []);
```

**Good**

```typescript
// Only use when passing to deep child components or dependency array is sensitive
const onClick = useMemoizedFn(() => doSomething(id));
const memoizedValue = useMemo(() => computeExpensive(a), [a]);
```

## SSR / CSR / RSC Boundaries Clear (Especially Next.js)
Clearly distinguish server components (server rendering), client components (browser interaction), and RSC (React Server Components) scenarios, avoid using browser APIs (like window / document) in server components.

Especially Next.js must follow:
Server logic goes in server components
Browser logic goes in client components
Don't mix

**Bad**

```typescript
// Using browser API in server component (wrong)
// app/profile/page.tsx (server component)
export default function ProfilePage() {
  console.log(window.location.href); // ❌ Not available on server
  return <div>Profile</div>;
}
```

**Good**

```typescript
// Server component provides data, client component handles interaction
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
    // Can only use on client
    console.log(window.location.href);
  }, []);
  return <div>{user.name}</div>;
}
```
