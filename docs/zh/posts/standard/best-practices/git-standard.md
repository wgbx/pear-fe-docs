---
title: Git 规范
description: Git 工作流程、分支管理、提交规范等开发规范
---
# Git 规范

## 项目初始化配置

**操作:**git clone → git config

首次克隆项目后,必须设置项目级别的 Git 配置:

```bash
# 克隆项目
git clone <repository-url>
cd <project-name>

# 设置项目级别的用户信息(不影响全局配置)
git config user.name "Your Name"
git config user.email "your.email@1m.app"

# 验证配置
git config user.name
git config user.email
```

**检查项:**

+ [ ] 项目级别已配置 user.email
+ [ ] 使用公司邮箱(@1m.app)
+ [ ] Commit 记录显示正确的作者信息

## Git 工作流程

### 完整开发流程图

![Git 工作流程图](/posts/git-flow.png)

### 流程步骤详解

**1. 创建分支** - 根据任务类型从基准分支创建对应的开发分支

+ 参见 [3. 分支管理规范](#3-分支管理规范)

**2. 开发实现** - 在分支上进行开发或修复工作

+ 可以多次提交(commit),保持提交粒度合理
+ 遵循 Conventional Commits 规范编写 commit message
+ 参见 [4. 开发和提交规范](#4-开发和提交规范)

**3. 提交代码** - 完成阶段性开发后提交变更

+ 确保代码符合团队编码规范
+ 提交信息清晰描述变更内容

**4. 本地自测** - 开发者自行验证功能正确性

+ 验证核心功能是否正常工作
+ 检查是否引入新的问题
+ 确保满足需求或修复了 Bug

**5. 推送代码** - 将本地提交推送到远程仓库

+ 首次推送使用 git push -u origin &lt;branch-name&gt;
+ 后续推送使用 git push

**6. 创建 PR** - 在 GitHub 上创建 Pull Request

+ **base 分支**: release(hotfix 使用 main)
+ **PR 标题**: 遵循命名规范,包含 JIRA 编号
+ **PR 描述**: 说明变更内容和测试情况

**7. Code Review** - 等待团队成员审核代码

+ **通过**: 合并 PR,远程分支自动删除
+ **不通过**:
    1. 根据反馈修改代码
    2. 提交修改(新的 commit)
    3. 本地自测验证
    4. 推送代码(PR 自动更新)
    5. 等待重新审核

**8. QA 测试** - QA 在 Release 环境进行测试

+ **通过**: 删除本地分支,流程结束
+ **发现 BUG**:
    1. 在原分支上修复问题
    2. 回到步骤 3 继续流程(提交 → 自测 → 推送 → 创建新 PR → Code Review → QA 测试)

### 新功能开发示例

```bash
# 1. 从 release 创建功能分支
git checkout release
git pull origin release
git checkout -b feature/user-settings

# 2. 在功能分支上开发和提交(可多次提交)
git add .
git commit -m "feat(user): add user model"
git add .
git commit -m "feat(user): add user API"
git add .
git commit -m "feat(user): add user settings page"

# 3. 开发完成

# 4. 自测通过后,推送到远程
git push -u origin feature/user-settings

# 5. 在 GitHub 上创建 PR (base: release)
# PR Title: feat(user): add user settings page #KAT-123
# 详见 review-process.md

# 6. Code Review 通过后,在平台上合并 PR
# 注: 合并时会自动删除远程功能分支

# 7. 如果 QA 在 Release 测出 BUG:
#    - 在原功能分支修复 bug
#    - 自测通过后推送
#    - 创建新的 PR
#    - Code Review 通过后合并
git add .
git commit -m "fix(user): fix validation error in settings"
git push
# 然后创建新 PR (base: release)

# 8. 功能完全完成后,删除本地分支
git checkout release
git pull origin release
git branch -d feature/user-settings
```

### Bug 修复示例

```bash
# 1. 从 release 创建 fix 分支
git checkout release
git pull origin release
git checkout -b fix/cart-calculation-error

# 2. 在 fix 分支上修复 bug 和提交
git add .
git commit -m "fix(cart): fix discount calculation error"

# 3. 修复完成

# 4. 自测通过后,推送到远程
git push -u origin fix/cart-calculation-error

# 5. 在 GitHub 上创建 PR (base: release)
# PR Title: fix(cart): fix discount calculation error #KAT-456
# 详见 review-process.md

# 6. Code Review 通过后,在平台上合并 PR

# 7. PR 合并后,删除 fix 分支
git checkout release
git pull origin release
git branch -d fix/cart-calculation-error
git push origin --delete fix/cart-calculation-error
```

### 重要提醒

+ ✅ 新功能开发和 Bug 修复都从 **release** 分支创建
+ ✅ PR 的 base 分支设置为 **release**
+ ✅ 必须自测通过后才能提交 PR
+ ❌ 永远不要在 main 或 release 分支上直接开发
+ ❌ 永远不要 force push 到 main 或 release 分支
+ ✅ 所有改动必须通过 PR 合并(详见 审核流程)

## 分支管理规范

**操作:**git checkout -b &lt;branch-name&gt;

### 保护分支

**main** 和 **release** 是保护分支,有严格的限制:

**禁止操作:**

+ ❌ 禁止直接在 main/release 分支上开发
+ ❌ 禁止 直接 push 或 force push 到 main/release 分支
+ ❌ 禁止提交大文件(超过 10MB)

**必须遵守:**

+ ✅ 只能通过 PR(Pull Request)合并代码
+ ✅ 需要经过 Code Review(**至少 1 个人审核通过**)

### 分支命名规范

**格式:**&lt;type&gt;/&lt;description&gt;

**Type 类型:**

+ **功能开发**feature/xxx
  + 基准分支: release
  + 用途: 开发新功能或新特性
  + 示例: feature/user-profile, feature/oauth-login
+ **Bug 修复**fix/xxx
  + 基准分支: release
  + 用途: 修复测试环境发现的 Bug
  + 示例: fix/cart-calculation-error, fix/login-timeout
+ **紧急修复**hotfix/xxx
  + 基准分支: main
  + 用途: 修复生产环境的紧急问题
  + ✅ **适用场景**: 小型 Bug、文案错误、样式问题等轻量级修复
  + ❌ **不适用场景**: 复杂 Bug 或需要充分测试的问题,应使用 fix/xxx
  + 示例: hotfix/payment-gateway-timeout
+ **重构任务**refactor/xxx
  + 基准分支: release
  + 用途: 代码重构、优化代码结构(限自发性重构)
  + ⚠️ **注意**: 如果是明确指派的重构任务,应使用 feature/xxx
  + 示例: refactor/user-service
+ **配置/构建**chore/xxx
  + 基准分支: release
  + 用途: 配置文件修改、构建脚本调整、依赖更新等
  + 示例: chore/upgrade-react, chore/update-eslint-config

**Description 规则:**

+ 使用 kebab-case
+ 简短描述分支用途
+ 不强制要求包含 JIRA 编号

**示例:**

```bash
# ✅ Good
git checkout -b feature/user-profile
git checkout -b feature/oauth-login
git checkout -b fix/cart-calculation-error
git checkout -b hotfix/payment-gateway-timeout

# ❌ Bad
git checkout -b new-feature     # 命名不具体
git checkout -b fix             # 过于简单
git checkout -b 张三-开发        # 使用中文
```

### 创建分支操作

```bash
# 新功能开发 - 从 release 创建
git checkout release
git pull origin release
git checkout -b feature/user-settings

# Bug 修复 - 从 release 创建
git checkout release
git pull origin release
git checkout -b fix/cart-calculation-error

# 紧急修复 - 从 main 创建
git checkout main
git pull origin main
git checkout -b hotfix/payment-timeout
```

### 常见问题

**🔴****[BLOCKER] 直接在保护分支上开发**

```bash
# 如果不小心在 main 分支开发了
git checkout main
git checkout -b feature/my-fix  # 创建新分支
# 现在你的改动在新分支上了
```

**🟢****[MINOR] 分支命名不规范**

❌ git checkout -b fix 命名过于简单

✅ git checkout -b fix/user-login-error

## 开发和提交规范

**操作:** 开发代码 → git add → git commit

### 开发过程中的注意事项

**提交频率:**

+ ✅ 小步提交,每个 commit 只做一件事
+ ✅ 功能完成一部分就提交,不要积累
+ ❌ 避免大而全的 commit
+ ❌ 避免"work in progress"式的提交

**提交前检查:**

+ [ ] 代码已通过 lint 和 build
+ [ ] Commit message 使用英文
+ [ ] 移除调试代码(console.log, debugger)
+ [ ] 移除注释掉的代码、demo 代码、mock 数据
+ [ ] 没有提交不相关的文件

**敏感信息检查:**

+ [ ] 没有提交 .env 文件
+ [ ] 没有提交 API keys、密码、token
+ [ ] 没有提交个人配置文件

### Commit Message 规范

**基本格式:**

```bash
<type>(<scope>): <subject>

[可选 body]

[可选 footer]
```

**Type 类型:**

| Type | 说明 | 示例 |
| --- | --- | --- |
| feat / feature  | 新功能开发  | feat(auth): add OAuth login |
| fix  | Bug 修复  | fix(cart): prevent duplicate items |
| refactor  | 重构  | refactor(user): extract profile logic |
| style  | 代码格式调整  | style(button): adjust padding |
| perf  | 性能优化  | perf(list): implement virtual scrolling |
| docs  | 文档变更  | docs(readme): update installation steps |
| chore  | 构建/配置/依赖  | chore(deps): upgrade react to 18.3 |

**Scope(可选):**

影响的模块或功能范围,例如: auth, cart, user, api

**Subject:**

+ 简洁描述本次变更
+ **必须使用英文**,禁止使用中文
+ 使用祈使句,首字母小写
+ 不超过 50 个字符
+ 不加句号
+ 可选: 在末尾添加 JIRA Issue 编号(格式: #KAT-&lt;number&gt;)

**示例:**

```bash
# ✅ Good
git commit -m "feat(auth): add OAuth login support"
git commit -m "fix(cart): prevent duplicate items in shopping cart"
git commit -m "refactor(user): extract user profile logic to custom hook"
git commit -m "perf(list): implement virtual scrolling for large datasets"

# ✅ Good - 关联 JIRA Issue
git commit -m "feat(auth): add OAuth login support #KAT-123"
git commit -m "fix(cart): prevent duplicate items #KAT-456"

# ❌ Bad
git commit -m "update"                    # 不具体
git commit -m "fix bug"                   # 过于简单
git commit -m "改了一下代码"               # 使用中文
git commit -m "添加了用户登录功能,修复了购物车的bug"  # 一次做多件事
```

### JIRA Issue 关联规范

**Commit Subject(可选):**

```bash
# 简单改动: 直接在 subject 末尾添加
git commit -m "feat(user): add profile page #KAT-123"
```

**Commit Footer(复杂改动):**

```bash
# 部分完成 - 使用 Refs
git commit -m "feat(user): add avatar upload

Completed item #2 of JIRA KAT-123

Refs #KAT-123"

# 功能完成 - 使用 Closes
git commit -m "feat(auth): complete OAuth integration

- Implement Google OAuth
- Add login callback handler
- Update authentication flow

Closes #KAT-123"

# Bug 修复完成 - 使用 Fixes
git commit -m "fix(cart): prevent duplicate items

- Add duplicate check logic
- Update cart state management
- Add unit tests

Fixes #KAT-456"
```

**关键字使用规则:**

| 关键字 | 使用场景 | 说明 |
| --- | --- | --- |
| Refs #KAT-123 | 部分完成  | Issue 包含多个子任务,只完成了部分  |
| Closes #KAT-123 | 功能完成  | 功能开发完成且已测试  |
| Fixes #KAT-456 | Bug 修复完成  | Bug 已修复且已验证  |

**何时使用哪个关键字:**

+ ✅ 所有子任务都完成 → 使用 Closes 或 Fixes
+ ❌ 仅部分完成 → 使用 Refs 并在 body 中说明完成了哪些
+ ❌ 还需要后续工作 → 使用 Refs

**多子任务的标记方法:**

```bash
# 示例: JIRA KAT-123 包含 5 个子任务

# 第一次提交 - 完成第 2 个子任务
git commit -m "feat(user): add avatar upload

Completed item #2: Add user avatar upload functionality

Refs #KAT-123"

# 第二次提交 - 完成第 3、4 个子任务
git commit -m "feat(user): add validation features

Completed items:
- #3: Phone number validation
- #4: Email verification

Refs #KAT-123"

# 最后一次提交 - 完成剩余所有子任务
git commit -m "feat(user): complete user profile feature

Completed remaining items:
- #1: User basic info form
- #5: Password strength validation

All tasks completed.

Closes #KAT-123"
```

### 修改 Commit(仅限未推送)

```bash
# 修改最后一次 commit message
git commit --amend -m "feat(auth): add OAuth login support"

# 合并最后几次 commit
git rebase -i HEAD~3
```

### 冲突处理

**开发分支与 release 分支冲突时:**

```bash
# 将 release 分支合并到开发分支
git checkout feature/my-feature
git merge origin/release
# 解决冲突后
git add .
git commit -m "merge: resolve conflicts with release branch"
```

### 常见问题

**🔴****[BLOCKER] Commit message 使用中文**

❌ Bad:

```bash
git commit -m "添加了用户登录功能"
git commit -m "改了一下代码"
```

✅ Good:

```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "refactor(user): extract profile logic to hook"
```

**🟡****[MINOR] Commit message 不规范**

❌ git commit -m "update" 无法了解具体改动

✅ git commit -m "feat(user): add user profile page"

**🟡****[MINOR] JIRA 编号格式错误**

❌ Bad:

```bash
feat(user): add profile [KAT-123]    # 使用了方括号
feat(user): add profile KAT-123      # 缺少 # 符号
Closes KAT-123                       # footer 缺少 #
```

✅ Good:

```bash
feat(user): add profile #KAT-123
Closes #KAT-123
Refs #KAT-456
Fixes #KAT-789
```

**🟡****[MINOR] 部分完成时错误使用 Closes**

❌ Issue 包含 10 个子任务,只完成 2 个就用了 Closes

✅ 部分完成时应使用 Refs 并说明完成了哪些

**🔴****[BLOCKER] 提交了 .env 文件**

建议:

1. 立即从历史中删除: git filter-branch
2. 添加到 .gitignore
3. 重新生成泄露的 keys

**🟡****[MINOR] 提交了格式化变更**

建议:

1. 单独提交格式化变更
2. 或在团队统一执行格式化
