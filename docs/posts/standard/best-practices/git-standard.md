---
title: Git Standard
description: Git workflow, branch management, commit standards, and other development standards
---

# Git Standard

## Project Initialization Configuration

**Operation:** git clone → git config

After cloning the project for the first time, you must set project-level Git configurations:

```bash
# Clone project
git clone <repository-url>
cd <project-name>

# Set project-level user information (does not affect global configuration)
git config user.name "Your Name"
git config user.email "your.email@1m.app"

# Verify configuration
git config user.name
git config user.email
```

**Checklist:**

+ [ ] Project-level user.email configured
+ [ ] Using company email (@1m.app)
+ [ ] Commit records show correct author information

## Git Workflow

### Complete Development Flow Diagram

![Git Workflow Diagram](/posts/git-flow.png)

### Workflow Steps

**1. Create Branch** - Create corresponding development branch from base branch according to task type

+ See [3. Branch Management Standards](#3-branch-management-standards)

**2. Development** - Develop or fix on the branch

+ Can commit multiple times, keep commit granularity reasonable
+ Follow Conventional Commits standard for commit messages
+ See [4. Development and Commit Standards](#4-development-and-commit-standards)

**3. Commit Code** - Commit changes after completing staged development

+ Ensure code complies with team coding standards
+ Commit messages clearly describe changes

**4. Local Testing** - Developer verifies functionality correctness

+ Verify core functionality works normally
+ Check if new issues are introduced
+ Ensure requirements are met or bugs are fixed

**5. Push Code** - Push local commits to remote repository

+ First push uses `git push -u origin &lt;branch-name&gt;`
+ Subsequent pushes use `git push`

**6. Create PR** - Create Pull Request on GitHub

+ **base branch**: release (hotfix uses main)
+ **PR title**: Follow naming convention, include JIRA number
+ **PR description**: Explain changes and testing status

**7. Code Review** - Wait for team members to review code

+ **Approved**: Merge PR, remote branch automatically deleted
+ **Not approved**:
    1. Modify code based on feedback
    2. Commit changes (new commit)
    3. Local testing verification
    4. Push code (PR automatically updates)
    5. Wait for re-review

**8. QA Testing** - QA tests in Release environment

+ **Passed**: Delete local branch, process ends
+ **Bug Found**:
    1. Fix issue on original branch
    2. Return to step 3 to continue process (commit → test → push → create new PR → Code Review → QA testing)

### New Feature Development Example

```bash
# 1. Create feature branch from release
git checkout release
git pull origin release
git checkout -b feature/user-settings

# 2. Develop and commit on feature branch (can commit multiple times)
git add .
git commit -m "feat(user): add user model"
git add .
git commit -m "feat(user): add user API"
git add .
git commit -m "feat(user): add user settings page"

# 3. Development complete

# 4. After local testing passes, push to remote
git push -u origin feature/user-settings

# 5. Create PR on GitHub (base: release)
# PR Title: feat(user): add user settings page #KAT-123
# See review-process.md for details

# 6. After Code Review passes, merge PR on platform
# Note: Remote feature branch is automatically deleted when merging

# 7. If QA finds BUG in Release:
#    - Fix bug on original feature branch
#    - Push after local testing passes
#    - Create new PR
#    - Merge after Code Review passes
git add .
git commit -m "fix(user): fix validation error in settings"
git push
# Then create new PR (base: release)

# 8. After feature is completely done, delete local branch
git checkout release
git pull origin release
git branch -d feature/user-settings
```

### Bug Fix Example

```bash
# 1. Create fix branch from release
git checkout release
git pull origin release
git checkout -b fix/cart-calculation-error

# 2. Fix bug and commit on fix branch
git add .
git commit -m "fix(cart): fix discount calculation error"

# 3. Fix complete

# 4. After local testing passes, push to remote
git push -u origin fix/cart-calculation-error

# 5. Create PR on GitHub (base: release)
# PR Title: fix(cart): fix discount calculation error #KAT-456
# See review-process.md for details

# 6. After Code Review passes, merge PR on platform

# 7. After PR is merged, delete fix branch
git checkout release
git pull origin release
git branch -d fix/cart-calculation-error
git push origin --delete fix/cart-calculation-error
```

### Important Reminders

+ ✅ New feature development and bug fixes both create from **release** branch
+ ✅ PR base branch set to **release**
+ ✅ Must pass local testing before submitting PR
+ ❌ Never develop directly on main or release branches
+ ❌ Never force push to main or release branches
+ ✅ All changes must be merged through PR (see review process)

## Branch Management Standards

**Operation:** git checkout -b &lt;branch-name&gt;

### Protected Branches

**main** and **release** are protected branches with strict restrictions:

**Prohibited Operations:**

+ ❌ Prohibit developing directly on main/release branches
+ ❌ Prohibit direct push or force push to main/release branches
+ ❌ Prohibit committing large files (over 10MB)

**Must Follow:**

+ ✅ Code can only be merged through PR (Pull Request)
+ ✅ Must go through Code Review (**at least 1 person must approve**)

### Branch Naming Standards

**Format:** &lt;type&gt;/&lt;description&gt;

**Type Types:**

+ **Feature Development** feature/xxx
  + Base branch: release
  + Purpose: Develop new features or new functionality
  + Examples: feature/user-profile, feature/oauth-login
+ **Bug Fix** fix/xxx
  + Base branch: release
  + Purpose: Fix bugs found in test environment
  + Examples: fix/cart-calculation-error, fix/login-timeout
+ **Hotfix** hotfix/xxx
  + Base branch: main
  + Purpose: Fix urgent issues in production environment
  + ✅ **Applicable scenarios**: Small bugs, text errors, style issues, and other lightweight fixes
  + ❌ **Not applicable**: Complex bugs or issues requiring thorough testing, should use fix/xxx
  + Example: hotfix/payment-gateway-timeout
+ **Refactoring** refactor/xxx
  + Base branch: release
  + Purpose: Code refactoring, optimize code structure (limited to self-initiated refactoring)
  + ⚠️ **Note**: If it's an explicitly assigned refactoring task, should use feature/xxx
  + Example: refactor/user-service
+ **Configuration/Build** chore/xxx
  + Base branch: release
  + Purpose: Configuration file changes, build script adjustments, dependency updates, etc.
  + Examples: chore/upgrade-react, chore/update-eslint-config

**Description Rules:**

+ Use kebab-case
+ Briefly describe branch purpose
+ JIRA number not required

**Examples:**

```bash
# ✅ Good
git checkout -b feature/user-profile
git checkout -b feature/oauth-login
git checkout -b fix/cart-calculation-error
git checkout -b hotfix/payment-gateway-timeout

# ❌ Bad
git checkout -b new-feature     # Name not specific
git checkout -b fix             # Too simple
git checkout -b 张三-开发        # Using Chinese
```

### Create Branch Operations

```bash
# New feature development - create from release
git checkout release
git pull origin release
git checkout -b feature/user-settings

# Bug fix - create from release
git checkout release
git pull origin release
git checkout -b fix/cart-calculation-error

# Hotfix - create from main
git checkout main
git pull origin main
git checkout -b hotfix/payment-timeout
```

### Common Issues

**🔴 [BLOCKER] Developing directly on protected branch**

```bash
# If you accidentally developed on main branch
git checkout main
git checkout -b feature/my-fix  # Create new branch
# Now your changes are on the new branch
```

**🟢 [MINOR] Branch naming not standardized**

❌ git checkout -b fix naming too simple

✅ git checkout -b fix/user-login-error

## Development and Commit Standards

**Operation:** Develop code → git add → git commit

### Development Process Notes

**Commit Frequency:**

+ ✅ Small commits, each commit does one thing
+ ✅ Commit when part of feature is complete, don't accumulate
+ ❌ Avoid large, all-encompassing commits
+ ❌ Avoid "work in progress" style commits

**Pre-commit Checklist:**

+ [ ] Code passes lint and build
+ [ ] Commit message in English
+ [ ] Remove debug code (console.log, debugger)
+ [ ] Remove commented code, demo code, mock data
+ [ ] No unrelated files committed

**Sensitive Information Check:**

+ [ ] No .env files committed
+ [ ] No API keys, passwords, tokens committed
+ [ ] No personal configuration files committed

### Commit Message Standards

**Basic Format:**

```bash
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Type Types:**

| Type | Description | Example |
| --- | --- | --- |
| feat / feature  | New feature development  | feat(auth): add OAuth login |
| fix  | Bug fix  | fix(cart): prevent duplicate items |
| refactor  | Refactoring  | refactor(user): extract profile logic |
| style  | Code format adjustment  | style(button): adjust padding |
| perf  | Performance optimization  | perf(list): implement virtual scrolling |
| docs  | Documentation changes  | docs(readme): update installation steps |
| chore  | Build/config/dependencies  | chore(deps): upgrade react to 18.3 |

**Scope (Optional):**

Affected module or feature scope, e.g.: auth, cart, user, api

**Subject:**

+ Briefly describe this change
+ **Must use English**, Chinese prohibited
+ Use imperative mood, lowercase first letter
+ No more than 50 characters
+ No period
+ Optional: Add JIRA Issue number at the end (format: #KAT-&lt;number&gt;)

**Examples:**

```bash
# ✅ Good
git commit -m "feat(auth): add OAuth login support"
git commit -m "fix(cart): prevent duplicate items in shopping cart"
git commit -m "refactor(user): extract user profile logic to custom hook"
git commit -m "perf(list): implement virtual scrolling for large datasets"

# ✅ Good - Link JIRA Issue
git commit -m "feat(auth): add OAuth login support #KAT-123"
git commit -m "fix(cart): prevent duplicate items #KAT-456"

# ❌ Bad
git commit -m "update"                    # Not specific
git commit -m "fix bug"                   # Too simple
git commit -m "改了一下代码"               # Using Chinese
git commit -m "添加了用户登录功能,修复了购物车的bug"  # Doing multiple things at once
```

### JIRA Issue Linking Standards

**Commit Subject (Optional):**

```bash
# Simple change: Add directly at end of subject
git commit -m "feat(user): add profile page #KAT-123"
```

**Commit Footer (Complex Changes):**

```bash
# Partially complete - Use Refs
git commit -m "feat(user): add avatar upload

Completed item #2 of JIRA KAT-123

Refs #KAT-123"

# Feature complete - Use Closes
git commit -m "feat(auth): complete OAuth integration

- Implement Google OAuth
- Add login callback handler
- Update authentication flow

Closes #KAT-123"

# Bug fix complete - Use Fixes
git commit -m "fix(cart): prevent duplicate items

- Add duplicate check logic
- Update cart state management
- Add unit tests

Fixes #KAT-456"
```

**Keyword Usage Rules:**

| Keyword | Usage Scenario | Description |
| --- | --- | --- |
| Refs #KAT-123 | Partially complete  | Issue contains multiple subtasks, only part completed  |
| Closes #KAT-123 | Feature complete  | Feature development complete and tested  |
| Fixes #KAT-456 | Bug fix complete  | Bug fixed and verified  |

**When to Use Which Keyword:**

+ ✅ All subtasks complete → Use Closes or Fixes
+ ❌ Only partially complete → Use Refs and explain what was completed in body
+ ❌ Still needs follow-up work → Use Refs

**Multi-subtask Marking Method:**

```bash
# Example: JIRA KAT-123 contains 5 subtasks

# First commit - Complete subtask #2
git commit -m "feat(user): add avatar upload

Completed item #2: Add user avatar upload functionality

Refs #KAT-123"

# Second commit - Complete subtasks #3, #4
git commit -m "feat(user): add validation features

Completed items:
- #3: Phone number validation
- #4: Email verification

Refs #KAT-123"

# Last commit - Complete all remaining subtasks
git commit -m "feat(user): complete user profile feature

Completed remaining items:
- #1: User basic info form
- #5: Password strength validation

All tasks completed.

Closes #KAT-123"
```

### Modify Commit (Unpushed Only)

```bash
# Modify last commit message
git commit --amend -m "feat(auth): add OAuth login support"

# Merge last few commits
git rebase -i HEAD~3
```

### Conflict Resolution

**When development branch conflicts with release branch:**

```bash
# Merge release branch into development branch
git checkout feature/my-feature
git merge origin/release
# After resolving conflicts
git add .
git commit -m "merge: resolve conflicts with release branch"
```

### Common Issues

**🔴 [BLOCKER] Commit message in Chinese**

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

**🟡 [MINOR] Commit message not standardized**

❌ git commit -m "update" cannot understand specific changes

✅ git commit -m "feat(user): add user profile page"

**🟡 [MINOR] JIRA number format error**

❌ Bad:

```bash
feat(user): add profile [KAT-123]    # Used square brackets
feat(user): add profile KAT-123      # Missing # symbol
Closes KAT-123                       # Footer missing #
```

✅ Good:

```bash
feat(user): add profile #KAT-123
Closes #KAT-123
Refs #KAT-456
Fixes #KAT-789
```

**🟡 [MINOR] Incorrectly using Closes when partially complete**

❌ Issue contains 10 subtasks, only completed 2 but used Closes

✅ When partially complete, should use Refs and explain what was completed

**🔴 [BLOCKER] Committed .env file**

Recommendations:

1. Immediately delete from history: git filter-branch
2. Add to .gitignore
3. Regenerate leaked keys

**🟡 [MINOR] Committed formatting changes**

Recommendations:

1. Commit formatting changes separately
2. Or execute formatting uniformly across team
