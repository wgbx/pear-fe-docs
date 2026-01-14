---
title: PR Description Guidelines
description: Standard format and content requirements for Pull Request descriptions
---

# PR Description Guidelines

When you modify a feature (e.g., button logic), please clearly explain the following in your PR description:

## Why

Explain the reason for the change—whether it's fixing a **BUG** or based on a **requirement**. Briefly describe the background and include a **JIRA link**.

**Example:**

Fix the button click issue described in KAT-1234. The cause was an event binding error that prevented state updates.

## What

Specifically explain what changes you made at the code level, for example:

+ Adjusted logical conditions
+ Modified component state management
+ Added API requests or parameter passing

**Example:**

Adjusted the ButtonAction component logic, added click debouncing to fix multiple trigger issues.

## Impact

Explain where this feature or button is used, and which other pages or modules might be affected.

**Example:**

This button is used in both the order details page and user information page. After modification, verify that both pages behave correctly.

## How to Test

Provide detailed testing steps, especially when the feature requires specific conditions to be displayed or triggered (e.g., a button that is only visible in a certain state).

Please include **screenshots or screen recordings** to prove you have verified the related functionality.

**Example:**

1. Log in with test account
2. Navigate to order details page
3. Click the "Repay" button
4. Verify button state changes and payment flow are normal
