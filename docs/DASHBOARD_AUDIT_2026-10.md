# RealtorDesk AI — Dashboard Upgrade: Phase 1 Audit
**Date:** 2026-10-09 · **Commit:** `3cdf337` · **Follows:** `docs/DASHBOARD_AUDIT_2026-08.md`
**Scope:** `/app` dashboard, its shell and nav, the data behind it, and what the redesign can build on.
**Constraint honoured:** no feature code written, nothing deployed, no DDL or writes to `realtordesk-prod`.

Classification used throughout: **SHIPPED-LIVE** (real data, works) · **SHIPPED-HOLLOW** (UI or schema exists, nothing real behind it) · **MISSING**.

---

## 0. What changed since the August audit

The five August P0s are closed in code: CASL suppression table + fail-closed check (#137, #144), fabricated KPI/compliance/activity data removed (#144, #153), billing guards on `/properties` etc. (#137), legacy routes redirected to `/app` (#141), mock fallbacks removed from list hooks (#144). The dashboard is now **honest but thin**: every number on it is real, and there are only three numbers.

---

## 1. Current dashboard — layout, nav, widgets

**Route:** `/app` → `src/pages/rd/app/Dashboard.tsx` (645 lines), inside `AppShell` (`src/components/rd/layout/AppShell.tsx`).

| Zone | Component | Data | State |
|---|---|---|---|
| Greeting + "New lead" | `Greeting` `:100-144` | auth profile | SHIPPED-LIVE |
| "Sample data" banner | `:55-62` | `liveLeads.length === 0` | **Wrong copy** — says "showing sample data" but no sample data renders any more (removed #144). Should be a first-run checklist. |
| KPI row (3 tiles) | `KPIRow` `:146-236` → `RDStatCard` | `useLeads()` client-side | SHIPPED-LIVE, but see §2.4 (250-row cap) |
| Desk AI activity | `AIActivityCard` `:268-354` | `contact_activities` + `conversation_messages` (`useDashboardFeed.ts:24`) | SHIPPED-LIVE (18 messages, 0 activities in prod) |
| Follow-ups due | `TodayCard` `:451-495` | `contacts.next_followup_date` | SHIPPED-LIVE — ignores the `tasks` table entirely |
| Pipeline snapshot | `PipelineSnapshotCard` `:513-576` | `contacts.stage` + `metadata.budgetCad` | SHIPPED-LIVE |
| Lead sources | `LeadSourcesCard` `:586-633` | `contacts.source` (normalised) | SHIPPED-LIVE but **mis-bucketed** (§2.3) |

**Layout defects (visible today):**
- KPI grid is `lg:grid-cols-4` with **3 tiles** (`:215`) → empty 4th column on desktop.
- Bottom row is `lg:grid-cols-3` with **2 cards** (`:76`) → empty 3rd column.
- Page padding is a fixed `p-7` (`:49`) at every width — 28px gutters on a 390px phone.
- Activity rows use a fixed `grid-cols-[60px_24px_1fr_auto]` (`:373`); the 4th column is an empty `<div />` (`:395`).
- No date window anywhere: all KPIs are all-time, with no comparison period, so no tile can say whether things are getting better.
- `RDStatCard` is explicitly non-interactive (`StatCard.tsx:41-45`) — **no drill-down from any number**.

**Navigation** (`src/components/rd/layout/Sidebar.tsx:62-80`): 14 flat items, no grouping. Seven of them (Tasks, Calendar, Properties, Campaigns, Market, AI Assistant, Integrations) open **legacy `AppLayout` chrome**, so the user changes shells mid-session. Icons are reused for different destinations (`IconCalendar` for both Automation and Calendar; `IconHome` for both Dashboard and Properties). No badges/counts are wired (the `count` prop exists, nothing passes it).

---

## 2. Data — tables, metrics, and what the dashboard can actually show

### 2.1 Production row counts (`realtordesk-prod`, read-only, 2026-10-09)
| Table | Rows | Read by `/app` dashboard? | Read anywhere reachable? |
|---|---|---|---|
| `contacts` | 55 (7 owners) | yes | yes |
| `conversation_messages` | 18 | yes | yes |
| `contact_activities` | 0 | yes | yes |
| `tasks` | 0 | **no** | `/tasks` (legacy chrome) |
| `deals` | 0 | **no** | **no** — see 2.2 |
| `property_listings` | 0 | **no** | `/properties` (legacy chrome) |
| `ai_lead_scores` | 0 | no | Lead detail explainer |
| `email_events` / `email_log` | 0 / 0 | no | no |
| `google_calendar_connections` | 0 | no | Settings card only |
| `user_roles` | 0 (enum `admin,user`) | no | no UI reads it |

### 2.2 Structural gaps that block four of the eight requested design areas
1. **Two pipeline models.** `/app` pipeline = `contacts.stage` + `contacts.metadata.budgetCad` (buyer budget). The `deals` table (value, probability, `expected_close_date`, `closing_date`, `commission_percentage`, `listing_price`) is **orphaned**: `/deals` redirects to `/app/pipeline` (`App.tsx:442`) and `AddDealModal`/`DealHistory` are only mounted from the redirected legacy pages. There is no reachable way to create a deal. → *Transactions* and *Commission* are **SHIPPED-HOLLOW** (schema, no surface).
2. **No appointments model.** No `appointments`/`showings` table. "Showings booked" counts leads whose stage = `showing` (`Dashboard.tsx:178`) — it is a stage count, not appointments. Google Calendar connection exists (`api/integrations/google/[action].ts`) but nothing syncs or reads events (confirmed in `docs/REDESIGN-PHASE-0-AUDIT.md`). → *Appointments/calendar* is **MISSING**.
3. **No transaction-deadline model.** `deals` has close dates only; no conditions (financing/inspection), deposit due, FINTRAC ID record, or document checklist columns. → *Closing deadlines* is **MISSING**.
4. **No team model.** No seat/assignment/brokerage column (`docs/REDESIGN-PHASE-0-AUDIT.md`); `user_roles` is unused; RLS is `user_id = auth.uid()`. "Role-based access" today means owner-only. → Team views/leaderboards are **MISSING** and must not be designed as if they exist.
5. **Listings** exist (`property_listings`, legacy `/properties`) but are 0 rows and not on `/app`. DDF is not live (`ddf_properties` 0). → *Listings* is **SHIPPED-HOLLOW** on the dashboard.

### 2.3 Data-quality bugs that distort the current cards
- **`normalizeSource` mis-buckets** (`src/lib/rd/mapContact.ts:66-72`): "Open house" (11 rows) and "Realtor.ca import" (8 rows) fall through to **Other** — 35% of all prod leads. And `v.includes("ad")` matches any source containing "lead" (e.g. "Lead magnet") as **Ads**.
- Source vocabulary is unconstrained free text in prod: `Referral`/`referral`, `Website form`/`website_form`, `Ads`/`google_ads`/`facebook`, `crea_ddf`. Needs a check constraint or lookup.
- `preferred_language` holds `English`, `en`, `fr` (`normalizeLanguage` only matches exact `fr`, so `French`/`Français` would read as EN).
- Stage `new_lead` (3 rows) silently maps to `new` — fine, but undocumented.

### 2.4 Correctness: KPIs are computed from a capped list
`useLeads` fetches the newest **250** contacts (`src/hooks/rd/useLeads.ts:26`) and every KPI, the pipeline snapshot and lead sources are computed client-side from that list. **Above 250 contacts, Active leads, Pipeline value and source shares silently undercount.** An agent importing a 1,500-contact sphere (the import page now exists, #275) gets wrong headline numbers. Fix: aggregate in Postgres (an RPC or view, RLS-scoped), not in the browser.

### 2.5 Metrics available today without new tables
From `contacts`: new leads per day/week, stage counts and stage-to-stage conversion, open buyer-budget pipeline, source mix (once normalised), follow-ups due/overdue (`next_followup_date`), **leads gone quiet** (`last_contact_date` > 14d), **never contacted** (`last_contact_date IS NULL`), consent coverage (`casl_consent`, `consent_date`, `unsubscribed`), FR share. From `conversation_messages`: **speed-to-lead** (first `ai`/`agent` message minus first `lead` message per `lead_id`) and **awaiting reply** (last message author = `lead`). From `tasks`: due/overdue. From `ai_lead_scores`: `recommended_actions`, `optimal_contact_time`.

Speed-to-lead and an "awaiting reply" queue — the two August P0 parity gaps — are computable **today** from `conversation_messages`; no migration required.

---

## 3. Design system

- **Tokens:** `src/styles/rd-tokens.css` — navy `#0B2540` (brand), terracotta `#D7714E` (accent), paper `#FAFAF7`, semantic success/warning/danger/info, score ramp (hot/warm/cool/cold), radii 4–20px, 3 shadows. Mirrored in `tailwind.config.ts:128-232` as `rd-*`.
- **Type:** Inter (UI), Instrument Serif (italic accents, greeting), JetBrains Mono.
- **Components** (`src/components/rd/`): `RDStatCard`, `RDCard`, `Spark`, `RDBadge`, `Score`, `Skeleton*`, `DataState`, `Tabs`, `Table`, `FilterBar`, `Avatar`, `PipelineCard`, `SectionHeader`, custom icon set (`icons.tsx`). Good base — the redesign should extend these, not add a UI kit.
- **Stale brand doc:** `docs/brand-context-pack.md:57-59,82` still specifies orange `#ea580c` and "$79 CAD/month"; the shipped tokens are navy/terracotta and the price of record is $149. Treat the tokens as source of truth; update the pack.
- **Legacy widgets with real queries, reusable as logic:** `components/dashboard/TasksWidget.tsx` (tasks), `DealsWidget.tsx` (deals), `RevenueBreakdownWidget.tsx` (deals → commission), `HotLeadsWidget.tsx`. Their styling is shadcn/legacy; their data logic is worth porting into `rd` cards.
- **No dark mode** in the app shell. Not proposed for phase 1.

---

## 4. Responsive (code-read; visual capture deferred to Phase 4)

- Shell: drawer below `lg` with proper dialog semantics (`useDrawerA11y`) — good.
- `npm run verify:parity` (from #244) already checks control/data parity at 1440/1024/820/390. **Reuse it for Phase 4**, plus screenshots.
- Defects: fixed `p-7` gutters; empty grid columns at `lg`; at 768–1023px everything stacks single-column (no tablet layout — the KPI row is 2-up, every card full width, so the tablet view is a long phone view); no sticky "next action" on phone.

## 5. Performance & loading

- Build passes. **Entry chunk `index-*.js` = 1,071 KB (334 KB gzip)** — every authenticated session downloads it before the dashboard chunk (15 KB). `src/i18n/config.ts` is 6,734 lines of inline EN+FR resources (mostly marketing copy) and is a likely large share. Split app vs marketing namespaces and lazy-load.
- `recharts` (372 KB) is only pulled by legacy `/market` and `/reports` — keep it out of the new dashboard; `Spark` (inline SVG) is the right pattern.
- Dashboard makes 4 queries; `useLeads` pulls 14 columns × 250 rows to compute 3 numbers. An RLS-scoped summary RPC cuts this to one small payload.
- Skeletons exist for KPIs and cards (#164) — keep.

## 6. Accessibility

- Heading order: `h1` greeting → `h3` card titles (`:293, :464, :530, :608`), no `h2`.
- Activity filter pills (`:303-317`) are toggle buttons with no `aria-pressed`, and their labels are English set via CSS `capitalize`.
- "Live" status relies on a green badge only.
- Time formatting hardcodes `en-CA` (`:419, :421`); `toLocaleDateString()` with no locale at `:487`.
- Positive: `aria-current` on nav (#183), focus rings (#160), announced loading states (#232), axe in CI (#174).

## 7. Localisation (EN/FR)

Dashboard has 18 `t()` calls, but these are still hardcoded English: "New lead" `:138`, "Desk AI activity" `:293`, "Live" `:298`, filter labels `:315`, "Loading activity…" `:322`, both empty states `:334, :339`, footer `:346`, every `ACTION_VERB` `:400-409` (and its English word order), "Follow-ups due" `:464`, "Due …" `:487`, all `STAGE_META` labels `:504-510`, "Pipeline snapshot" `:530`, "Lead sources" `:608`, all `CardEmpty` copy. Key `rd.common.sampleDashboard` has **no entry** in `i18n/config.ts`. `formatCadShort` emits `$1.2M`; fr-CA convention is `1,2 M$`.

## 8. AI features — what exists vs what the dashboard shows

| Capability | Where | State |
|---|---|---|
| Lead scoring | `calculate-lead-score`, `LeadScoreExplainer` | SHIPPED-LIVE on lead detail; `ai_lead_scores` 0 rows in prod |
| Recommended actions / best time | `ai_lead_scores.recommended_actions`, `optimal_contact_time` | **written by the function, never read by `/app`** |
| "AI next step" / "AI handling" | `contacts.metadata.aiNextBest/aiHandling` (`mapContact.ts:47-48`) | **SHIPPED-HOLLOW — nothing writes these keys** |
| Website chat replies | `ai-chatbot`, `conversation_messages` (author `ai`) | SHIPPED-LIVE (9 AI msgs) |
| Call summaries | `generate-call-summary` | exists; no dashboard surface |
| AI Assistant chat | `/ai-assistant` (legacy chrome), `claude-chat` | SHIPPED-LIVE, off-shell |

**Opportunity:** the dashboard's AI card is a passive log. The category leaders put AI on the home screen as *the next thing to do* (Lofty sign-in recommendation card; Real Geeks behaviour buckets). RealtorDesk already has the ingredients — scores, recommended actions, message history, consent flags — but no ranked queue joins them.

## 9. Competitor dashboard patterns (sourced)

| Pattern | Who ships it |
|---|---|
| Tasks due / overdue on home | FUB, Lofty, BoldTrail, Real Geeks, IXACT, Wise Agent, Brivity, Top Producer, Cloze |
| New / unactioned leads | FUB, Lofty, Real Geeks, Top Producer, Brivity, Wise Agent |
| Prioritised follow-up queue | Real Geeks (Awaiting Response / High Priority / New / Slipping Away @14d), Lofty Opportunities, BoldTrail daily calls, Top Producer Follow Up Coach, FUB Smart Lists |
| Today's appointments | Lofty, IXACT, Wise Agent, Brivity, Cloze; FUB (count) |
| Transaction deadlines on home | **only** Lofty, Wise Agent (Transaction Hotlist), Brivity |
| GCI / goals | Brivity (goals + GCI), Top Producer & Wise Agent (commission) |
| AI on home | Lofty (recommendation card, Copilots), FUB (suggested replies), Cloze (actions from email) |
| Configurable widgets | IXACT, Lofty, Wise Agent |
| French UI | **none** found; IXACT app listed English-only |
| Canadian conditions / FINTRAC on home | **none** found |

Sources: help.followupboss.com/hc/en-us/articles/4402128249367 · help.lofty.com/hc/en-us/articles/8472031391131 · support.realgeeks.com/crm-dashboard-lead-feed · services.ixactcontact.com/apphelpv2/Welcome_to_IXACT/Customizing_Your_Dashboard.htm · wise-agent-crm.instantdocsbase.com/help/homepage-welcome-dashboard-c20826b9 · brivity.com/crm · support.topproducer.com/x/top-producer-x-crm-dashboard · help.cloze.com/article/1839-cloze-agenda-overview · help.insiderealestate.com/en/articles/10561800 · apps.apple.com/us/app/id1097626923

## 10. Test & build baseline (before)

- `vite build`: passes.
- `vitest run`: **482 passed / 3 failed / 3 skipped** (68 files). The 3 failures are SEO tests unrelated to the dashboard: `seo/metaLength.test.ts` (homepage description 166 chars > 160) and `seo/internalLinkDepth.test.ts`. Pre-existing on `3cdf337`.
- Screenshots: not captured in Phase 1 (needs a signed-in demo session; `verify:parity` harness is the path).

---

## 11. Proposed improvements, ranked by business impact

Impact = effect on trial→paid conversion and retention for a solo Canadian agent. Effort: S ≤1 day, M 2–4 days, L 1–2 weeks.

| # | Improvement | Why it matters | Data | Effort | Bucket |
|---|---|---|---|---|---|
| 1 | **"Next up" priority queue** — one ranked list: awaiting reply, new & never contacted, follow-ups due/overdue, gone quiet 14d+, hot score. Each row: reason in one line, consent status, one-tap call/text/email, AI draft in the lead's language | The single most valuable home-screen element in the category; absent today. Turns the dashboard into the daily work surface | `contacts` + `conversation_messages` + `tasks` — **no migration** | M | **Ship now** |
| 2 | **Speed-to-lead + awaiting-reply KPIs** with period comparison and drill-down | August P0 parity gap; proves the "fast follow-up" promise honestly | `conversation_messages` — no migration | S–M | **Ship now** |
| 3 | **Server-side summary RPC** (RLS-scoped) for all dashboard figures | Fixes the 250-row undercount (§2.4); one payload instead of 4 queries | SQL function, `SECURITY INVOKER` | S | **Ship now** |
| 4 | **Finish FR + layout fixes** — strings in §7, fr-CA money/date format, grid columns, gutters, tablet 2-col, heading order, `aria-pressed` | Flagship differentiator; first screen a Quebec agent sees | none | S | **Ship now** |
| 5 | **Fix source normalisation** + constrain `contacts.source` | 35% of leads mis-attributed; any ROI view built on it is wrong | small migration + mapper fix | S | **Ship now** |
| 6 | **KPI drill-down** — every tile opens the filtered lead list | FUB parity; makes numbers actionable | URL filters on `/app/leads` | S | **Ship now** |
| 7 | **Transactions & conditions card** — closings in 30 days, condition-removal / deposit / FINTRAC-ID deadlines with days-left | Only 3 of 10 competitors put deadlines on home, **none** Canadian — a real wedge | **needs** `deals` surfaced in `/app` + `deal_milestones` table | L | Next |
| 8 | **Commission & goal pace** — closed vs projected GCI vs annual goal, "on pace" line | Brivity-level motivation for solos; uses `deals.commission_percentage` | `deals` + `profiles.business_preferences.gci_goal` | M (after #7) | Next |
| 9 | **Today's appointments** | Expected on every competitor home | **needs** `appointments` table or Google Calendar read sync | M–L | Next |
| 10 | **Compliance strip (backed)** — consent coverage %, suppressed count, unconsented-in-automation count; FINTRAC later | Re-earns the compliance story with real numbers | consent columns exist; FINTRAC needs table | S (consent) / L (FINTRAC) | Consent now, FINTRAC later |
| 11 | **Listings card** — active, DOM, inquiries per listing | Useful for listing agents; low value while 0 listings and DDF not live | `property_listings` | M | Later |
| 12 | **Notifications center** — bell already wired to due tasks (#169); extend to awaiting-reply, deadlines, sync failures | Reduces missed leads; reuses existing bell | derived | M | Later |
| 13 | **Nav consolidation** — group 14 items into Work / Pipeline / Grow / Settings; port Tasks + Properties + Calendar into `rd` chrome | Removes the shell switch | none | M | Later |
| 14 | **Configurable cards** | IXACT/Lofty/Wise Agent ship it; low value for solos | `profiles.business_preferences` | L | Nice later |
| 15 | **Entry bundle split** (i18n namespaces, marketing vs app) | 334 KB gzip before first paint of the app | none | M | Later |

## 12. Open decisions for Tilak

1. **Pipeline model.** Keep `contacts.stage` as the lead pipeline and use `deals` only from *offer accepted* onward (recommended — leads ≠ transactions), or merge into one model?
2. **Appointments.** Build a native `appointments` table first (simple, works without Google), or wire Google Calendar read sync first?
3. **Commission goal storage.** `profiles.business_preferences.gci_goal` (no migration) vs a `goals` table (needed later for teams).
4. **Team plan.** The $299 Team tier has no team model. The redesign should not show team views until that exists — confirm.

## 13. Phase 3 plan once a design is approved (no code until then)

- **Sprint A (ship-now, no new tables):** #1–#6, #10 (consent part). Files: `pages/rd/app/Dashboard.tsx` (split into `components/rd/dashboard/*`), `hooks/rd/useDashboardSummary.ts`, `lib/rd/mapContact.ts`, `i18n/config.ts`, one migration (summary RPC + source constraint). Feature-flagged route `/app?v=2` behind `profiles.business_preferences.dashboard_v2` so production `/app` is untouched until approval.
- **Sprint B:** `deals` back into `/app` (offer→close), `deal_milestones` (conditions, deposit, FINTRAC ID, closing) with RLS + `WITH CHECK`, Transactions + Commission cards.
- **Sprint C:** appointments, notifications, nav consolidation, bundle split.
- **Validation each sprint:** `npm run lint && npm run typecheck && npm run test && npm run build:seo`, `verify:parity`, `verify:a11y`, cross-tenant RLS test (foreign read 0 rows, forged insert 403), before/after screenshots at 1440 / 820 / 390.

---

## 14. Sprint A — implementation status (2026-10-09, branch `feat/dashboard-v2-sprint-a`)

**Behind a flag; v1 unchanged as the default.** `/app?v=2` turns v2 on for that browser (`?v=1` off); `profiles.business_preferences.dashboard_v2 = true` turns it on per account. No migration: the summary RPC proposed in §11 #3 was replaced by paged RLS reads, because production schema changes must go through the generated baseline (`PRODUCTION_RUNBOOK.md` §12).

| §11 item | State | Where |
|---|---|---|
| #1 Next up queue (awaiting · new · overdue · task · due · quiet · hot), consent-gated actions | done | `lib/rd/dashboard.ts` `buildNextUp`, `components/rd/dashboard/NextUpCard.tsx` |
| #2 First-response median (≥5 replies or "—") + awaiting reply | done | `computeSummary` |
| #3 No 250-row cap | done (paging, not RPC) | `hooks/rd/useDashboardData.ts`; `useLeads` now pages too so drill-downs match |
| #4 FR + layout | done for v2 (all strings in `i18n/rdDashboard.ts`; fr-CA money/percent/time) | v1 left as is |
| #5 Source normalisation | done (affects v1 and Reports too) | `lib/rd/mapContact.ts` |
| #6 Drill-down | done | `/app/leads?view=open|due|overdue|new7d`, `?stage=`; `/app/inbox?filter=awaiting`, `?lead=` |
| #10 Consent strip | done (consent_date counts; unsubscribed or a suppressed address wins) | `ConsentCard`, `consentOf` |
| AI drafts in the queue | **not done** — needs a decision on model cost and a prompt; queue offers Reply/Call/Email | — |

Independent review findings fixed before PR: drill-down lists capped at 250 while tiles counted all; awaiting-reply rule differed from Inbox; email offered to a suppressed address; consent read from booleans that `/app` add-lead never sets; spring-forward day counted tomorrow as due; KPI aria-label hid the detail line; Inbox ignored URL changes; stage normalisation differed between dashboard and Leads.

Known limits: Inbox's thread list still reads the latest 500 messages (`useInboxThreads`), so for very high message volume the awaiting list can lag the tile; Lead sources counts all contacts (won highlighted) — GCI by source waits on `deals` (Sprint B).
