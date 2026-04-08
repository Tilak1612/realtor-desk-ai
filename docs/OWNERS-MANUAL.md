# Owner's Manual — RealtorDesk AI

> Last updated: 2026-04-08
> Status: Production / Post-Audit Hardening Complete

---

## 1. Manual Workarounds (Things You Must Do)

### Daily / Recurring

| Task | How | Notes |
|------|-----|-------|
| **Run lifecycle cron** | Invoke `lifecycle-cron` edge function daily at 10 AM EST | Use pg_cron, Vercel cron, or GitHub Actions. Handles Day 3/7/12/14 emails automatically. |
| **Clean auth rate limits** | Call `cleanup_auth_rate_limits()` SQL function daily | Or set up pg_cron: `SELECT cron.schedule('cleanup-rate-limits', '0 */6 * * *', 'SELECT cleanup_auth_rate_limits()');` |

### As-Needed

| Task | How | Notes |
|------|-----|-------|
| **Refresh Apify scraper tokens** | Renew at [apify.com](https://apify.com) when scraper returns "actor-is-not-rented" | Rate limit: 10 imports/day per user. Check `apify_usage` table for consumption. |
| **Approve Team seats** | Manual — no self-serve team invites yet | Users on Team plan ($299/mo) need you to add members via Supabase dashboard. |
| **DDF property data** | Manual insert into `ddf_properties` table via Supabase dashboard | Temporary RLS policy allows authenticated inserts. Remove policy when CREA API is live. |
| **Stripe price changes** | Update price IDs in both `SubscriptionContext.tsx` AND `create-checkout/index.ts` whitelist | Never change prices without updating both locations. Current: Agent $149/mo, Team $299/mo. |
| **Deploy edge functions** | `supabase functions deploy <function-name>` | Never deploy to production without testing. New functions added: `lifecycle-cron`, `auth-rate-limiter`, `crea-ddf-sync`. |
| **Apply migrations** | `supabase migration up` | New migrations: `20260408000000` (rate limits), `20260408000001` (DDF schema), `20260408100000` (lifecycle tracking), `20260408100001` (DDF insert policy). |

### Supabase Secrets Required

| Secret | Purpose | Status |
|--------|---------|--------|
| `RESEND_API_KEY` | Transactional emails | Required — lifecycle cron won't work without it |
| `OPENAI_API_KEY` | LLM-assisted lead scoring | Optional — falls back to rule-based if missing |
| `LOVABLE_API_KEY` | AI chatbot (Gemini) | Required for chatbot functionality |
| `STRIPE_SECRET_KEY` | Billing | Required |
| `STRIPE_WEBHOOK_SECRET` | Payment events | Required |
| `CREA_DDF_API_KEY` | DDF sync | Not yet — scaffold returns roadmap |
| `CREA_DDF_API_SECRET` | DDF sync | Not yet — scaffold returns roadmap |
| `TWILIO_ACCOUNT_SID` | SMS | Required for SMS features |
| `TWILIO_AUTH_TOKEN` | SMS | Required for SMS features |
| `APIFY_TOKEN` | Listing scraper | Required for Realtor.ca imports |

---

## 2. The Redline List (UI vs. Reality)

### Features That Are Real and Working

| Feature | Status | Notes |
|---------|--------|-------|
| AI Lead Scoring | **PRODUCTION** | Rule-based + LLM-assisted (if OPENAI_API_KEY set) |
| AI Chatbot (24/7) | **PRODUCTION** | Gemini via Lovable gateway |
| Stripe Billing | **PRODUCTION** | 4 SKUs, CAD, 14-day trial |
| Deal Pipeline (Kanban) | **PRODUCTION** | 8 stages, drag-drop |
| Contact Management | **PRODUCTION** | Full CRUD, tags, scoring |
| Apify Listing Scraper | **PRODUCTION** | Realtor.ca import, rate limited |
| Twilio SMS | **PRODUCTION** | Consent-verified, template vars |
| Resend Email | **PRODUCTION** | Welcome, lifecycle, campaigns |
| Lifecycle Emails | **PRODUCTION** | Day 0/3/7/12/14 bilingual sequences |
| ROI Calculator | **PRODUCTION** | Fully bilingual EN/FR |
| GA4 Analytics | **PRODUCTION** | Full event tracking |
| PIPEDA Compliance | **PRODUCTION** | Cookie banner, privacy policy, data export |
| 2FA (TOTP) | **PRODUCTION** | Supabase MFA in Settings |
| Auth Rate Limiting | **PRODUCTION** | 10 login / 5 signup per 15min per IP |

### Features Labeled "Coming Soon" (Honest)

| Feature | Current UI Label | Reality | ETA |
|---------|-----------------|---------|-----|
| CREA DDF Sync | "Coming Q3 2026" | Scaffold built, needs API credentials from CREA | Q3 2026 |
| Salesforce Integration | "Coming Soon" | UI card only, no connector | TBD |
| Zoho CRM | "Coming Soon" | UI card only | TBD |
| Pipedrive | "Coming Soon" | UI card only | TBD |
| Freshsales | "Coming Soon" | UI card only | TBD |
| Microsoft Dynamics | "Coming Soon" | UI card only | TBD |
| LinkedIn Lead Gen | "Coming Soon" | UI card only | TBD |
| Facebook Lead Ads | "Coming Soon" | UI card only | TBD |
| Centris (Quebec MLS) | "Coming Soon" | UI card only | TBD |
| WhatsApp Cloud API | "Coming Soon" | UI card only | TBD |
| Follow Up Boss | Not on Integrations page | Comparison/migration pages exist, no connector | TBD |
| HubSpot | Not on Integrations page | Not referenced in Integrations.tsx | TBD |

### Features That Exist But Need Improvement

| Feature | Issue | Priority |
|---------|-------|----------|
| Email templates | English-only in `send-lifecycle-email` and `send-welcome-email` | Medium — lifecycle-cron handles bilingual, but existing templates don't |
| Notifications Settings | Placeholder card in Settings page ("Loading...") | Low |
| Team seat management | No self-serve invite flow | Medium — manual via Supabase dashboard |
| Email campaign templates | Basic/generic, not customizable per user | Low |

---

## 3. Deployment Checklist

Before pushing to production, verify:

- [ ] `supabase migration up` — apply all 4 new migrations
- [ ] `supabase functions deploy auth-rate-limiter`
- [ ] `supabase functions deploy lifecycle-cron`
- [ ] `supabase functions deploy crea-ddf-sync`
- [ ] `supabase functions deploy calculate-lead-score` (updated with LLM)
- [ ] `supabase functions deploy ai-chatbot` (updated with timeout)
- [ ] `supabase functions deploy claude-chat` (updated with timeout)
- [ ] Set `OPENAI_API_KEY` secret if not already set
- [ ] Set up cron for `lifecycle-cron` (daily 10 AM EST)
- [ ] Set up cron for `cleanup_auth_rate_limits()` (every 6 hours)
- [ ] Verify cookie banner appears on all pages (not just home)
- [ ] Verify 2FA enrollment works in Settings > Security
- [ ] Test lifecycle emails by creating a test user

---

## 4. Architecture Summary (Post-Hardening)

```
Edge Functions (20 total):
├── Auth: auth-rate-limiter
├── AI: ai-chatbot, claude-chat, calculate-lead-score, generate-call-summary
├── Billing: create-checkout, check-subscription, customer-portal, stripe-webhook-email
├── Email: send-welcome-email, send-lifecycle-email, send-lead-magnet-email, email-automation
├── Lifecycle: lifecycle-cron (NEW — Day 3/7/12/14 bilingual sequences)
├── Data: apify-runner, crea-ddf-sync (scaffold)
├── SMS: send-sms, send-phone-verification
├── Scoring: lead-score-calculator (legacy), run-automation
└── Security: encrypt-integration-token

Key Tables:
├── profiles (lifecycle_stage, preferred_language, trial_ends_at)
├── contacts, deals, tasks, properties
├── ai_lead_scores (LLM-enhanced)
├── ddf_properties (ready for CREA sync)
├── ddf_sync_log (monitoring)
├── auth_rate_limits (brute-force protection)
├── email_events (lifecycle dedup)
└── adoption_events (usage tracking)
```

---

## 5. What's NOT Your Problem

These are handled automatically:

- **Session refresh** — Supabase `autoRefreshToken: true`
- **Stripe PCI compliance** — Stripe handles all card data
- **Security headers** — Configured in `vercel.json`, deployed automatically
- **Code splitting** — Vite handles chunk optimization on build
- **Cookie consent persistence** — `localStorage`, user can reset via footer link
