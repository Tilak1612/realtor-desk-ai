# RealtorDesk AI — Dashboard & Product Surface Audit
**Date:** 2026-08-14 · **Commit:** `5eb3e0f` · **Auditor:** Claude Code
**Scope:** authenticated product surface, both shells, backing hooks/functions/tables/RLS.
**Constraint honoured:** no feature code was written during this audit.

---

## 0. Coverage and honesty about this audit

**Fully evidenced:** route/IA map, mock-data audit of `/app/*`, compliance-tile backing, CASL suppression path, consent-gating of outreach functions, DDF data state, lead-score data state, Supabase region, parity-feature presence, FR coverage counts on `/app/*`.

**Partially evidenced (flagged inline):** legacy-shell widget-by-widget mock audit (I audited the shell that ships as primary; the legacy shell is recommended for deletion, so exhaustive tile-level auditing there would be wasted work). Performance/bundle numbers, keyboard-nav and 375px behaviour are **NOT** re-measured here — they are carried forward from the 2026-08-01 design audit and marked as such.

**Not audited:** `webhook-receiver`, `test-integration`, `oauth-integration-*` internals; Apify data path; `auth-rate-limiter` coverage. Marked `NEEDS VERIFICATION`.

### Factual correction to the brief
The brief states **"Entry price $79/month CAD"**. The code says otherwise:
- `src/contexts/SubscriptionContext.tsx:30` — Solo `monthlyPrice: 149`
- `src/pages/rd/Pricing.tsx:36` — Solo `priceMonthly: 149`, `:55` Team `priceMonthly: 299`

There is no `$79` tier anywhere in the codebase. Every competitive-position conclusion below uses **$149 CAD**, which changes the comparison materially: at $149 you are above IXACT ($46.75) and Wise Agent ($49 USD), roughly at Follow Up Boss ($69 USD/user), and well below Sierra ($299.95) and Real Geeks ($399).

---

## 1. Executive summary — the five worst findings

### F1 — CASL unsubscribe is completely non-functional, and fails **open** · P0 · LEGAL
`supabase/functions/_shared/email-suppression.ts:17` queries `email_suppressions`. **That table does not exist.** Proven live against production:
```
GET /rest/v1/email_suppressions → {"code":"PGRST205",
  "message":"Could not find the table 'public.email_suppressions' in the schema cache"}
```
The helper catches the error and **returns `false`** (`email-suppression.ts:22` — `return false; // fail-open`). Consequence chain:
1. `isEmailSuppressed()` → error → `false` → "not suppressed"
2. `send-lifecycle-email/index.ts:206` proceeds to send
3. **Every unsubscribed contact continues to receive email**

And the write path is equally broken: `process-unsubscribe/index.ts:117` calls `suppressEmail()`, which upserts into the same missing table. **Every unsubscribe request is silently discarded while reporting success.**

CASL requires unsubscribe honoured within 10 business days and places the onus of proof on the sender. Penalties reach **$1M per violation (individual) / $10M (business)**. This is the single most serious finding in the audit.

### F2 — Compliance tiles are decorative; **zero** tables back them · P0 · CREDIBILITY
`src/pages/rd/app/Dashboard.tsx:595-597` renders hardcoded literals:
```ts
{ label: "PIPEDA data requests", done: 2, total: 2 },
{ label: "FINTRAC verifications", done: 9,  total: 9 },
{ label: "RECO disclosures",      done: 12, total: 14, warning: true },
```
A schema sweep for `%fintrac%|%disclosure%|%consent%|%dsar%|%data_request%|%audit%` returned **`[]`**. There is no FINTRAC record table (no document type/number/issuing jurisdiction, no entity 30-day deadline, no 5-year retention), no disclosure log, no DSAR workflow, no consent ledger, no immutable audit trail.

For a product whose entire differentiation is Canadian compliance, three fabricated compliance counters shown to paying users is the highest-credibility-risk item on this list.

### F3 — Response-time KPI is fabricated **even when live data exists** · P0 · HONESTY
`src/pages/rd/app/Dashboard.tsx:184` returns `MOCK_DASHBOARD_METRICS[1]` unconditionally inside the *live* branch. From `src/data/rd/reports.ts:17-22`, that tile renders:
> **Avg response — "38s", delta "−14%"**

The zero-state banner (`Dashboard.tsx:54`) only fires when `liveLeads.length === 0`. **The moment a user adds one lead the banner disappears and the fabricated 38s remains, now framed as their own performance.** Sparklines on "Showings booked" (`:189`) and "Pipeline value" (`:196`) are likewise mock beside real values.

This is the mixed-state case the brief calls worse than fully-mock — and it is worse still because **38s is the number that appears to corroborate the public "replies within 15 minutes" claim**.

### F4 — The entire parity queue layer is MISSING · P0 · COMPETITIVE
Grep across `src/pages/rd/app/` and `src/hooks/rd/` returns **0 hits** for each of:

| Capability | Hits | Shipped by |
|---|---|---|
| Unactioned / awaiting-response queue | **0** | FUB, Lofty, Real Geeks, Sierra |
| Speed to lead / time to first contact | **0** | FUB, Lofty, Sierra |
| Average contact attempts | **0** | FUB, Sierra |
| Unassigned lead pond | **0** | Real Geeks, Brivity |
| Metric → contact-list drill-down | **0** (`StatCard` has no click handler) | FUB |

The brief calls the unactioned queue "the most valuable tile in the category" and it is present in *every* leader. Its absence is disqualifying at $149/mo against FUB at $69 USD.

### F5 — Bilingual EN/FR, the flagship differentiator, is broken on the main dashboard · P0 · DIFFERENTIATION
`src/pages/rd/app/Dashboard.tsx` has only **5** `t()` calls and 6 bare English text nodes. The KPI labels are hardcoded English string literals: `"Active leads"` (`:174`), `"Showings booked"` (`:187`), `"Pipeline value"` (`:194`), plus `"Compliance"` (`:602`) and all three compliance labels.

No researched competitor ships French at all (three ship Spanish). This is the cleanest differentiator in the category and the **first screen a Quebec agent sees is partly untranslated**. Leads/Pipeline/Inbox/Reports are well covered (21/10/19/29 `t()` calls); the dashboard is the hole.

---

## 2. Route & IA audit (Part 1)

### 2.1 Two shells, both live

| Route | Shell | Guarded by | In-app nav? | Duplicate of | Recommendation |
|---|---|---|---|---|---|
| `/app` | new | Protected + **RequireBilling** | rd Sidebar:62 | `/today`, `/dashboard` | **canonical** |
| `/app/leads`, `/app/leads/:id` | new | Protected + RequireBilling | Sidebar:63 | `/contacts`, `/contacts/:id` | **canonical** |
| `/app/pipeline` | new | Protected + RequireBilling | Sidebar:65 | `/deals` | **canonical** |
| `/app/inbox` | new | Protected + RequireBilling | Sidebar:64 | — | **canonical** |
| `/app/automation` | new | Protected + RequireBilling | Sidebar:66 | `/automations`, `/campaigns` | **canonical** |
| `/app/reports` | new | Protected + RequireBilling | Sidebar:67 | `/reports` | **canonical** |
| `/app/settings` | new | Protected only | Sidebar:68 | `/settings`, `/profile` | canonical; see §2.3 |
| `/today` | legacy | Protected + RequireBilling | legacy Sidebar:68 | `/app` | **redirect → `/app`** |
| `/dashboard` | legacy | Protected + RequireBilling | — | `/app` | **redirect → `/app`** |
| `/contacts` | legacy | Protected + RequireBilling | legacy Sidebar:69 | `/app/leads` | **redirect → `/app/leads`** |
| `/contacts/:id` | legacy | **Protected ONLY** (`App.tsx:358`) | via /contacts | `/app/leads/:id` | **redirect; fix guard first** |
| `/deals` | legacy | Protected + RequireBilling | legacy Sidebar:70 | `/app/pipeline` | **redirect → `/app/pipeline`** |
| `/properties` | legacy | **Protected ONLY** (`App.tsx:359`) | legacy Sidebar:80 | none in new shell | **keep; add RequireBilling; port to `/app`** |
| `/tasks`, `/calendar`, `/campaigns`, `/reports`, `/market`, `/automations`, `/ai-assistant` | legacy | Protected + RequireBilling | legacy Sidebar | partial | merge or delete per §2.2 |
| `/call-workflow/:contactId` | legacy | **Protected ONLY** | orphan — no nav link | — | **orphan; guard or delete** |
| `/dashboard/integrations` | legacy | Protected + RequireBilling | legacy Sidebar:82 | none | port to `/app` |
| `/billing`, `/profile`, `/onboarding` | mixed | Protected only *(correct)* | — | — | keep ungated |

### 2.2 Duplicate concepts — canonical surface and migration

| Concept | Surfaces | Canonical | Migration |
|---|---|---|---|
| Contacts vs Leads | `/contacts`, `/app/leads` | **`/app/leads`** | 301 `/contacts` → `/app/leads`; `/contacts/:id` → `/app/leads/:id` |
| Deals vs Pipeline | `/deals`, `/app/pipeline` | **`/app/pipeline`** | redirect |
| Campaigns vs Automations vs Automation | `/campaigns`, `/automations`, `/app/automation` | **`/app/automation`** | fold both legacy routes in |
| Reports | `/reports`, `/app/reports` | **`/app/reports`** | redirect |
| Today vs Dashboard | `/today`, `/dashboard`, `/app` | **`/app`** | redirect both |
| Settings | `/settings`, `/profile`, `/app/settings` | **`/app/settings`** | `/settings` already redirects; add `/profile` |

### 2.3 Guard defects — P1

Three paid surfaces are reachable **without a subscription** by typing the URL:
- `App.tsx:358` — `/contacts/:id` → full contact detail, unguarded
- `App.tsx:359` — `/properties` → property list, unguarded
- `/call-workflow/:contactId` — unguarded **and** orphaned (no nav path in either shell)

An expired-trial user retains read access to their contact records and properties. `/app/settings` and `/billing` being ungated is correct and deliberate (users must be able to manage the account and pay).

**Deliverable IA:** one shell (`/app/*`), one nav (rd `Sidebar`), six canonical surfaces plus Settings; every legacy route becomes a permanent redirect. Public/marketing routes are untouched, so there is no SEO exposure — every route above is `noindex` authenticated.

---

## 3. Mock-data & honesty audit (Part 2)

### 3.1 Elements rendering fabricated numbers to a paying account — P0

| Surface | Element | Source (file:line) | State | User told? | Fix |
|---|---|---|---|---|---|
| `/app` | **Avg response "38s"** | `Dashboard.tsx:184` → `data/rd/reports.ts:17` | **mock in live branch** | **No** | Delete tile until a conversations timeseries exists |
| `/app` | Showings sparkline | `Dashboard.tsx:189` | mock beside live value | **No** | Omit spark until real |
| `/app` | Pipeline sparkline | `Dashboard.tsx:196` | mock beside live value | **No** | Omit spark until real |
| `/app` | New-leads sparkline | `Dashboard.tsx:180-182` | live if `useLeadsPerDay` returns, else mock | **No** | Never fall back |
| `/app` | PIPEDA 2/2, FINTRAC 9/9, RECO 12/14 | `Dashboard.tsx:595-597` | **hardcoded literals** | **No** | Remove or build backing tables |
| `/app/reports` | Source ROI (DDF 134 / Form 61 / Ads 32 / Referral 20) | `data/rd/reports.ts:43-48` | mock | check | Real query or zero-state |
| `/app` | AI activity, Today, Pipeline snapshot cards | `Dashboard.tsx:35` (comment: "static") | **static** | **No** | Wire or remove |

**Zero-state banner exists but is scoped wrong.** `Dashboard.tsx:54` fires only at `liveLeads.length === 0`. `Leads.tsx` uses the same pattern. The result is that *partial* fabrication — the dangerous kind — is never disclosed.

### 3.2 Empty states
Leads and Inbox banner their fixtures (good). The dashboard now banners at true-zero (added 2026-08-13) but not in mixed state (above). No surface teaches a next action beyond "Add lead".

### 3.3 Replacement pattern (proposed, not implemented)
1. **Never** fall back to a fabricated value. Zero is a legitimate answer; invented is not.
2. Tiles with no backing timeseries are **removed**, not filled with fixtures.
3. Required for the missing tiles: a `conversation_events` (or reuse `conversation_messages`) timeseries view keyed `(user_id, day, direction, first_response_seconds)` to support speed-to-lead and response-time trend; a `lead_daily_counts` view for sparklines.
4. `MOCK_*` fixtures should be excluded from the production bundle entirely once the shells merge — they are currently shipped to every client.

---

## 4. Feature audit — parity layer (3a)

| # | Capability | State | Evidence | Benchmark | Verdict | Effort | Pri |
|---|---|---|---|---|---|---|---|
| 1 | New leads today/period | SHIPPED-LIVE | `Dashboard.tsx:167`, `useLeads` | FUB, Lofty, Sierra | PARITY | — | — |
| 2 | **Unactioned queue** | **MISSING** | 0 hits | **all leaders** | **ABSENT** | M | **P0** |
| 3 | **Speed to lead** | **MISSING** | 0 hits | FUB/Lofty/Sierra | **ABSENT** | M | **P0** |
| 4 | Contact attempts | **MISSING** | 0 hits | FUB, Sierra | ABSENT | M | P1 |
| 5 | Tasks due today | SHIPPED-HOLLOW | `tasks` RLS restored 2026-08-12; no dashboard tile | FUB, Lofty | BEHIND | S | P1 |
| 6 | Appointments / no-show | MISSING | — | FUB, Lofty | ABSENT | M | P2 |
| 7 | Pipeline value + 30-day | PARTIAL | `Dashboard.tsx:169` sums `budgetCad`; no date window | FUB "Deals next 30 days" | BEHIND | S | P1 |
| 8 | Stage funnel + conversion | SHIPPED-HOLLOW | `/app/reports` funnel renders "0 0%" | Lofty | BEHIND | M | P1 |
| 9 | Lead-source ROI incl. closed | SHIPPED-HOLLOW | mock (`reports.ts:43`) | FUB (closed deals by source) | BEHIND | M | P1 |
| 10 | Comms by channel | MISSING | — | Sierra, Lofty | ABSENT | M | P2 |
| 11 | Recent-activity feed | SHIPPED-LIVE | `useActivityFeed`, `Dashboard.tsx:43` | FUB | PARITY | — | — |
| 12 | Unassigned pond | MISSING | 0 hits | Real Geeks, Brivity | ABSENT | M | P2 |
| 13 | Leaderboard + goals | SHIPPED-HOLLOW | Reports leaderboard exists; single-user data | FUB, Lofty, Sierra | BEHIND | M | P2 |
| 14 | **Metric drill-down** | **MISSING** | `StatCard` has no click handler | FUB ships it | **ABSENT** | S | **P1** |
| 15 | Export | PARTIAL | CSV only on `/app/reports` | Lofty CSV+PDF+Excel | BEHIND | S | P2 |
| 16 | Personal vs team toggle | MISSING | — | Lofty | ABSENT | M | P3 |
| 17 | Configurable KPI cards | MISSING | — | Lofty (10) | ABSENT | L | P3 |
| 18 | Saved / smart lists | MISSING | tab filters only, no persistence | FUB, Lofty, BoldTrail | ABSENT | M | P2 |
| 19 | Duplicate detect / merge | MISSING | — | IXACT criticised — cheap win | ABSENT | M | P2 |
| 20 | Mobile 375px | PARTIAL | drawer shipped 2026-08-03 (#125); tables unaudited at 375px | — | NEEDS VERIFICATION | — | P1 |

**Behavioural buckets (Real Geeks pattern).** RealtorDesk ships *sorted tabs* (All / Hot / Warm / Cold / AI-handled) in `Leads.tsx`, keyed on score thresholds only. There are **no named, thresholded behavioural buckets** — no "Slipping Away" (14 days inactive), no "Awaiting Response", no visit/property-view triggers. The "priority pipeline, not an inbox" promise is currently **a sorted list**, not a prioritised queue.

---

## 5. Feature audit — differentiation layer (3b)

| # | Capability | State | Evidence | Verdict | Pri |
|---|---|---|---|---|---|
| 21 | **Bilingual EN/FR** | SHIPPED-HOLLOW | Dashboard 5 `t()` + hardcoded labels `:174,:187,:194,:602`; Leads/Inbox/Reports well covered | **BEHIND own claim** | **P0** |
| 22 | **CASL consent ledger** | **MISSING** | no `email_suppressions`, no `sms_consent`, no consent table; only `contacts.consent_date` | **ABSENT** | **P0** |
| 23 | **Consent-aware AI outreach** | **MISSING** | `run-automation` **0** consent refs, `email-automation` **0**, `lifecycle-cron` **0**, `ai-chatbot` **0** | **ABSENT — legal exposure** | **P0** |
| 24 | FINTRAC | **MISSING** | tile hardcoded `Dashboard.tsx:596`; no table | ABSENT | P1 |
| 25 | Provincial disclosures | **MISSING** | tile hardcoded `:597`; no table | ABSENT | P1 |
| 26 | PIPEDA / Law 25 ops | PARTIAL | **region `ca-central-1` ✅ VERIFIED**; no DSAR/export/deletion flow, no breach register | PARTIAL | P1 |
| 27 | CREA DDF | SHIPPED-HOLLOW | functions exist; `ddf_properties` **0 rows**, `ddf_sync_log` **0 rows** | ABSENT in practice | P2 |
| 28 | Lead scoring credibility | SHIPPED-HOLLOW | `ai_lead_scores` **0 rows**; no explainer UI | BEHIND (Lofty/FUB/BoldTrail ship scoring) | P1 |
| 29 | AI vs agent attribution | SHIPPED-HOLLOW | Reports section exists; legend admits "manual timing (not yet tracked)" | opportunity | P2 |
| 30 | Real-time freshness | PARTIAL | react-query `staleTime` only; no staleness indicator | Sierra refreshes **once daily** — easy win | P2 |
| 31 | AI included, CAD, unmetered | SHIPPED-LIVE | prices derive from one constant; CAD labelled; GST/HST disclaimed on `/pricing` | **AHEAD** | — |

**§23 detail — the sharpest unclaimed feature, and it is unguarded.** Four of five outreach paths contain **zero** consent or suppression references. Only `send-lifecycle-email` checks, and that check is inert (F1). So today a suppressed, expired-consent or never-consented contact **can** receive automated and AI-originated outreach. This is simultaneously the largest legal exposure and the loss of the best differentiator in the category. No quiet-hours handling exists in any path (Real Geeks enforces TCPA quiet hours by local timezone; no Canadian provincial equivalent is implemented).

---

## 6. Feature audit — trust layer (3c)

| # | Item | Finding | Pri |
|---|---|---|---|
| 32 | Sync-health surfacing | `sync-health-check` runs every 15 min and is now token-gated; **no dashboard surface shows integration failure** — a broken integration is silent to the user | P1 |
| 33 | Deliverability visibility | `email_events` **0 rows**; no UI anywhere shows sent/bounced/suppressed | P1 |
| 34 | **Lead-loss paths** | `useLeads` previously selected two non-existent columns and silently fell back to fixtures (fixed #117). Pattern remains: **every list hook falls back to mock on error**, so a future RLS or schema fault renders plausible fake leads instead of an error. **A lead can be accepted and never appear.** | **P0** |
| 35 | Onboarding | `user_onboarding` table created 2026-07-31 (was missing entirely); wizard persists; completion flag fixed (#118) | resolved |
| 36 | Trial/billing edges | `RequireBilling` gates 19 routes; `check-subscription` crashed for **every entitled customer** on Basil until #136 (2026-08-14) | resolved, monitor |
| 37 | Performance | Bundle ≈976 KB; `MOCK_*` fixtures ship to every client; not re-measured this pass | P2 |
| 38 | A11y / contrast | Carried from 2026-08-01 audit: token contrast fixed; `/app` keyboard nav **NEEDS VERIFICATION** | P2 |
| 39 | Security spot-check | RLS restored on 8 tables + `WITH CHECK` on all writes (2026-08-12); cross-tenant isolation **proven live** (foreign read 0 rows, forged insert 403). `ddf_sync_log` / `oauth_state_store` intentionally service-role-only. | good |

---

## 7. Gap closure plan (Part 4)

### 7.1 P0 list
1. **Create `email_suppressions`** + make `isEmailSuppressed` **fail closed**. (F1)
2. **Gate all four outreach functions on consent/suppression** before dispatch. (§23)
3. **Delete the three compliance tiles** until tables exist. (F2)
4. **Delete the response-time tile and all mock sparklines.** (F3)
5. **Remove mock fallback from every list hook**; render zero-state or error. (§34)
6. **Translate the dashboard.** (F5)
7. Add `RequireBilling` to `/contacts/:id`, `/properties`, `/call-workflow/:contactId`. (§2.3)

### 7.2 Four-sprint sequence

**Sprint 1 — Trust.** Items 1–7 above. Files: `_shared/email-suppression.ts`, `run-automation`, `email-automation`, `lifecycle-cron`, `ai-chatbot`, `Dashboard.tsx`, all `hooks/rd/*`, `App.tsx`. Migration: `email_suppressions`, `sms_consent`. Verify: send to a suppressed address must be refused; unsubscribe must persist; no fabricated number on any surface.

**Sprint 2 — Parity queue.** Unactioned queue, speed-to-lead, contact attempts, drill-down, unassigned pond, behavioural buckets with Real Geeks thresholds. Migration: `conversation_events` timeseries view, `contact_attempts`. Verify: every tile clicks through to its contact list.

**Sprint 3 — Compliance depth as marketing proof.** CASL ledger (express vs implied, source, timestamp, 2-year/6-month expiry timers, exportable proof), FINTRAC records (ID type/number/jurisdiction, entity 30-day, 5-year retention), disclosure log (RECO/OACIQ/BCFSA), DSAR + deletion/export, breach register. Then the tiles come back — backed.

**Sprint 4 — DDF + explainable scoring.** National Shared Pool path (member.realtor.ca → Access DDF → third-party designation; active brokerage licence required), sync health surfaced. Lead-score explainer showing the 3 signals actually used.

---

## 8. Claims-integrity table

| Public claim | Status | Evidence |
|---|---|---|
| Canadian data stays in Canadian data centres | **SUPPORTED** (database) | Supabase region `ca-central-1`, verified via Management API. Third parties (Resend, Stripe, Anthropic) not verified — cross-border transfer remains subject to PIPEDA |
| AI included, not metered, CAD pricing | **SUPPORTED** | one price constant; CAD + GST/HST on `/pricing` |
| 14-day trial, card required, no charge today | **SUPPORTED** | `create-checkout` `trial_period_days: 14`, `payment_method_collection: "always"` |
| Bilingual EN/FR AI | **PARTIALLY SUPPORTED** | marketing + Leads/Inbox/Reports good; **dashboard partly untranslated** |
| CASL-compliant | **UNSUPPORTED** | suppression table missing; unsubscribe silently discarded; 4 outreach paths unguarded |
| PIPEDA-native | **PARTIALLY SUPPORTED** | residency real; **no DSAR, deletion, export, breach register, retention policy** |
| FINTRAC verifications tracked per deal | **UNSUPPORTED** | hardcoded tile, no table |
| Quebec / RECO disclosures tracked | **UNSUPPORTED** | hardcoded tile, no table |
| Replies within 15 minutes | **UNSUPPORTED** | nothing measures response time; the "38s" shown is fixture data |
| 72% lead-scoring accuracy | **UNSUPPORTED** | `ai_lead_scores` 0 rows; not measurable from any table |
| Native CREA DDF | **UNSUPPORTED** (roadmap Q3 2026) | `ddf_properties` 0 rows |
| ~20-minute setup | **NEEDS VERIFICATION** | wizard persists; not timed |
| 30-minute support response | **NEEDS VERIFICATION** | no evidence in repo |

**Marketing-liability note.** "CASL-compliant" is asserted while the unsubscribe mechanism is inoperative. CASL penalties reach $1M per violation for an individual and $10M for a business, and the sender bears the onus of proving consent. This claim should be withdrawn from public copy until Sprint 1 lands.

---

## 9. Competitive scorecard

| Capability | Best-in-class | RealtorDesk now | After 4 sprints |
|---|---|---|---|
| Unactioned queue | FUB / Lofty / Real Geeks | **ABSENT** | PARITY |
| Speed to lead | Sierra (5-min target) | **ABSENT** | **AHEAD** (measured + proven) |
| Behavioural buckets | Real Geeks | **ABSENT** | PARITY |
| Drill-down | FUB | **ABSENT** | PARITY |
| Lead scoring | Lofty / FUB / BoldTrail | HOLLOW | PARITY→AHEAD w/ explainer |
| Export | Lofty (CSV+PDF+Excel) | CSV | PARITY |
| **Bilingual EN/FR** | **nobody** (3 ship Spanish) | PARTIAL | **AHEAD — uncontested** |
| **CASL ledger** | IXACT (guidance only, no product) | **ABSENT** | **AHEAD — uncontested** |
| **Consent-aware AI** | **nobody** | **ABSENT** | **AHEAD — uncontested** |
| **FINTRAC / provincial** | **nobody** | **ABSENT** | **AHEAD — uncontested** |
| PIPEDA residency | HubSpot (Montreal, doesn't claim PIPEDA) | PARTIAL | **AHEAD** |
| Native DDF | **nobody** (Sierra +$25/feed, RG $10/board) | ABSENT | **AHEAD** |
| AI unmetered in CAD | Sierra +$199, Ylopo +$150-250 | **AHEAD** | **AHEAD** |

**Reading:** every uncontested differentiator is currently `ABSENT` or `HOLLOW`. The moat is real and unclaimed — but nothing is built behind it yet, and three of those positions are asserted publicly today.

---

## 10. Appendix — file-by-file
- `src/App.tsx:349,358,359,374` — guard gaps
- `src/pages/rd/app/Dashboard.tsx:35,54,164,180-198,595-597` — mock/static tiles, hardcoded compliance + labels
- `src/data/rd/reports.ts:7-48` — fixture values incl. "38s" and source ROI
- `supabase/functions/_shared/email-suppression.ts:17,22` — missing table, fail-open
- `supabase/functions/process-unsubscribe/index.ts:117` — writes to missing table
- `supabase/functions/{run-automation,email-automation,lifecycle-cron,ai-chatbot}/index.ts` — zero consent refs
- `src/components/rd/layout/Sidebar.tsx:62-68` vs `src/components/dashboard/DashboardSidebar.tsx:68-84` — two navs
- `src/contexts/SubscriptionContext.tsx:29-39`, `src/pages/rd/Pricing.tsx:36,55` — price of record ($149/$299, not $79)
