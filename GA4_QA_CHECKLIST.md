# GA4 QA Checklist — RealtorDesk AI

Measurement ID: `G-95T79D2KJ7`
Product slug param: `realtordesk`
Stream URL: `realtordesk.ai`

## Preconditions

- GA4 property is accessible in Google Analytics.
- Use GA4 **DebugView** (Admin → DebugView).
- Validate in both environments:
  - Local: `http://localhost:<port>`
  - Production: `https://realtordesk.ai`

## Expected Baseline Behavior

- SPA page views are sent manually via app code.
- `send_page_view` is disabled in global config.
- No duplicate initial `page_view` on first load.
- Every custom event includes:
  - `product: "realtordesk"`
  - `page_path`
  - `page_location`

## Page View Validation

1. Open app root (`/`) and confirm exactly **one** `page_view`.
2. Navigate to 3–5 internal routes (e.g., `/pricing`, `/demo`, `/resources`).
3. Confirm one `page_view` per route change.
4. Confirm parameters include:
   - `page_path`
   - `page_title`
   - `page_location`
   - `product`

## Event Validation Matrix

### 1) `sign_up`
Trigger: successful registration

Expected params:
- `method`: `google` | `microsoft` | `email`
- `product`, `page_path`, `page_location`

Tests:
- Email signup success path
- Google OAuth signup success path
- Microsoft OAuth signup success path

### 2) `trial_start`
Trigger: trial activation post-signup

Expected params:
- `method`: `google` | `microsoft` | `email`
- `product`, `page_path`, `page_location`

Tests:
- Verify `trial_start` appears with corresponding signup method.
- Verify it appears alongside successful signup journey.

### 3) `demo_request`
Trigger: demo form successful submit

Expected params:
- `demo_type: "live_demo"`
- `product`, `page_path`, `page_location`

Tests:
- Submit demo form with valid values.
- Confirm event only on success (not on failed submit).

### 4) `view_pricing`
Trigger: pricing page mount (`/pricing`)

Expected params:
- `product`, `page_path`, `page_location`

Tests:
- Open `/pricing` directly.
- Navigate away and back; verify event on mount.

### 5) `roi_calculator_used`
Trigger: ROI calculator interaction leading to visible result

Expected params:
- `result_shown: true`
- `product`, `page_path`, `page_location`

Tests:
- Move any ROI slider or change plan.
- Confirm event fires (current behavior: once per page load session).

## Redirect-Safety Checks

For signup flows, confirm events are present even when navigation/redirect happens immediately after auth success:

- Email signup: `sign_up` + `trial_start` should appear before verify-email redirect completes.
- OAuth signup: `sign_up` + `trial_start` should appear after OAuth return and successful signed-in state.

## Troubleshooting

- If events are missing locally:
  - Verify hostname is `localhost` and debug mode is enabled.
  - Hard refresh and retry.
- If only page views appear:
  - Confirm action reached success path (e.g., demo insert succeeded).
- If duplicates appear:
  - Check for repeated route mounts or duplicate success callbacks.

## Event Source Map

Use this map to quickly locate where each event is fired:

- Page view tracking
  - [src/App.tsx](src/App.tsx) (`RouteAnalytics` uses `trackPageView` on route changes)
- Shared analytics helpers
  - [src/utils/analytics.ts](src/utils/analytics.ts) (`trackPageView`, `trackEvent`)
- `sign_up`
  - Email flow: [src/pages/Signup.tsx](src/pages/Signup.tsx)
  - OAuth callback flow: [src/App.tsx](src/App.tsx) (auth state listener)
- `trial_start`
  - Email flow: [src/pages/Signup.tsx](src/pages/Signup.tsx)
  - OAuth callback flow: [src/App.tsx](src/App.tsx) (auth state listener)
- `demo_request`
  - [src/pages/Demo.tsx](src/pages/Demo.tsx) (after successful form insert)
- `view_pricing`
  - [src/pages/Pricing.tsx](src/pages/Pricing.tsx) (`useEffect` on mount)
- `roi_calculator_used`
  - [src/components/ROICalculator.tsx](src/components/ROICalculator.tsx) (first interaction per page session)
- GA4 global snippet + debug mode
  - [index.html](index.html)

## Launch Sign-off

Mark complete when all are true:

- [ ] No duplicate initial `page_view`
- [ ] `page_view` on route changes is consistent
- [ ] `view_pricing` verified
- [ ] `demo_request` verified
- [ ] `roi_calculator_used` verified
- [ ] `sign_up` verified for email + OAuth
- [ ] `trial_start` verified for email + OAuth
- [ ] All events include `product`, `page_path`, `page_location`
