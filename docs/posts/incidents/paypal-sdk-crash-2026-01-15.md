# PayPal SDK Crash Incident Postmortem

**Date**: 2026-01-15
**Severity**: P0 - Production page crash

## Timeline

- **08:55** Thomas Xu reported Post page not working
- **09:30** Task force established, entered troubleshooting phase
- **12:14** QA team reproduced in Release environment: page crashed after adding to cart and clicking Checkout
- **14:00** After debugging, initially identified as PayPal-related issue
- **15:06** Thomas Xu reported more users experiencing page unavailability
- **15:27** Detected PayPal SDK rollback from 5.0.525 to 5.0.520, crash issue gradually resolved
- **15:31** QA found Post page also experiencing crashes. Task force analysis confirmed root cause also from PayPal SDK

## Root Cause

### Problem Description

PayPal upgraded SDK: `@paypal/react-paypal-js` 5.0.520 -> 5.0.525

In version 5.0.525:

- `initActions.enable()` returns `undefined` in certain scenarios
- But SDK internally still directly calls:

  ```typescript
  initActions.enable().catch(() => {
    // ignore errors when enabling the component
  });
  ```

- Code location: <https://github.com/paypal/paypal-js/blob/@paypal/react-paypal-js@8.8.1/packages/react-paypal-js/src/components/PayPalButtons.tsx#L144-L146>

### Technical Details

When `enable()` returns `undefined`, `.catch()` triggers `TypeError`, causing uncaught exception in React component tree, ultimately leading to complete page crash (including Post page and Checkout flow).

## Impact

- ✅ Checkout flow crashes immediately after clicking
- ✅ Post page crashes when loading PayPal component
- ✅ All pages depending on `@paypal/react-paypal-js` have similar risks
- ⚠️ Third-party SDK triggered fatal frontend exception, not handled by current system's error isolation mechanism

## Mitigation

### Temporary Solution

- Temporarily disabled PayPal payment capability
- Removed PayPal-related entries and component rendering in frontend configuration
- Avoided triggering exception code path in `@paypal/react-paypal-js`
- Ensured Post page and Checkout main flow can continue using other payment methods

## Action Items

### 1. Error Reporting and Alerting

- [ ] Integrate frontend global exception collection:
  - `window.onerror`
  - `unhandledrejection`
  - React Error Boundary
- [ ] Build monitoring and alerting system
- [ ] Crash rate threshold alerts

### 2. Third-party Component Isolation (Error Boundary)

Wrap high-risk third-party SDKs like PayPal with independent error boundaries:

```tsx
<ErrorBoundary fallback={<PaymentUnavailable />}>
  <PayPalButtons />
</ErrorBoundary>
```

Ensure:

- Third-party SDK crashes don't affect entire page rendering
- Graceful degradation to "Payment temporarily unavailable" instead of white screen

## Conclusion

This incident was an **uncaught runtime exception introduced by third-party PayPal SDK upgrade**. Due to lack of:

- Frontend error boundary isolation
- Unified crash alerting

A single point exception escalated to complete page unavailability.

Future prevention through:

- End-to-end error reporting and alerting
- Third-party component ErrorBoundary isolation
