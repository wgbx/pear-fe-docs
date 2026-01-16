# PayPal SDK 崩溃事故复盘

**事故日期**: 2026-01-15
**严重程度**: P0 - 生产环境页面崩溃

## 事故时间线

- **08:55** Thomas Xu 上报 Post 页面无法正常工作
- **09:30** 成立专项解决小组，进入问题排查阶段
- **12:14** QA 团队在 Release 环境复现：加入购物车后点击 Checkout，页面发生崩溃
- **14:00** 经过 Debug，初步定位为 PayPal 相关故障
- **15:06** Thomas Xu 反馈更多用户出现页面不可用情况
- **15:27** 监测到 PayPal SDK 从 5.0.525 回滚至 5.0.520，崩溃问题逐步缓解
- **15:31** QA 发现 Post 页面同样存在崩溃。经解决小组分析，确认根因同样来自 PayPal SDK

## 根因分析

### 问题描述

PayPal 升级了 SDK：`@paypal/react-paypal-js` 5.0.520 -> 5.0.525

在版本 5.0.525 中：

- `initActions.enable()` 在某些场景下返回 `undefined`
- 但 SDK 内部仍直接调用了：

  ```typescript
  initActions.enable().catch(() => {
    // ignore errors when enabling the component
  });
  ```

- 代码位置：<https://github.com/paypal/paypal-js/blob/@paypal/react-paypal-js@8.8.1/packages/react-paypal-js/src/components/PayPalButtons.tsx#L144-L146>

### 技术细节

当 `enable()` 返回 `undefined` 时，`.catch()` 触发 `TypeError`，导致 React 组件树未被捕获的异常，最终页面整体崩溃（包括 Post 页面与 Checkout 流程）。

## 影响范围

- ✅ Checkout 流程在点击后直接崩溃
- ✅ Post 页面在加载 PayPal 组件时崩溃
- ✅ 所有依赖 `@paypal/react-paypal-js` 的页面存在同类风险
- ⚠️ 属于第三方 SDK 引发的前端致命异常，未被当前系统的错误隔离机制兜底

## 处置措施

### 临时方案

- 临时禁用 PayPal 支付能力
- 在前端配置中下线 PayPal 相关入口与组件渲染
- 避免触发 `@paypal/react-paypal-js` 中的异常代码路径
- 确保 Post 页面与 Checkout 主流程可继续使用其它支付方式

## 改进与行动项

### 1. 错误上报与告警

- [ ] 接入前端全局异常采集：
  - `window.onerror`
  - `unhandledrejection`
  - React Error Boundary
- [ ] 自建监控与告警系统
- [ ] 崩溃率阈值告警

### 2. 第三方组件隔离

对 PayPal 等高风险第三方 SDK 进行独立错误边界包裹：

```tsx
<ErrorBoundary fallback={<PaymentUnavailable />}>
  <PayPalButtons />
</ErrorBoundary>
```

确保：

- 第三方 SDK 崩溃不影响整页渲染
- 可以优雅降级为"支付暂不可用"而不是白屏

## 结论

本次事故为**第三方 PayPal SDK 升级引入的未捕获运行时异常**，由于缺少：

- 前端错误边界隔离
- 统一崩溃告警

导致单点异常放大为整页不可用。

后续将通过：

- 全链路错误上报与告警
- 第三方组件 ErrorBoundary 隔离

来避免同类事故再次发生。
