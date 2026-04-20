# ROADMAP_COMMITMENTS_2026-04-20 — BoldTrail parity, dated and defensible

**Author:** Tilak / RealtorDesk AI (drafted by Claude Code)
**Date:** 2026-04-20
**Status:** Draft — requires Tilak sign-off before /roadmap page goes public.

This doc answers the five BoldTrail table-stakes capabilities with a single, defensible sentence each. It is the source of truth for the public `/roadmap` page (PR J) and for every marketing claim the product makes about what ships when.

**Working rule:** every date below is either (a) a sprint we have capacity for, (b) a quarter we are committed to and can deliver in, or (c) explicitly out of scope. No "soon." No "planned." No hand-waving.

---

## 1. IDX-integrated website with behavioral lead capture

**Commitment:** **Roadmap — Q3 2026.**

**What's in scope:** public realtordesk.ai-hosted agent sites with a CREA DDF-backed listings feed and a behavioral lead widget (contact form, saved-search signup, and "agents watching this listing" signal that writes to the lead record).

**What's NOT in scope this quarter:** AVM ("value my home") widgets, open-house scheduling, blog builder.

**Status:** design. Pre-work on the DDF sync edge function (`crea-ddf-sync`) is already in the repo but not wired to a public surface.

**Why Q3:** CREA DDF API onboarding is a multi-week paperwork + test-feed process (OAuth, IDX display rules, watermarking). Sprint capacity is booked on Tier 1–3 through Q2.

**Public wording (for /roadmap and /pricing):**
> Agent websites with live listings (CREA DDF) and behavioral lead capture — shipping Q3 2026. Free with all paid tiers.

---

## 2. AI lead prioritization + real-time behavioral push to mobile

**Commitment:** **Ships this sprint (web push on score threshold crossing), with AI derivation in Q2 2026.**

**What ships now (end of this sprint):**
- Web push notification when any contact's `lead_score` crosses a user-configurable threshold (default 85).
- A "why this lead scored X" panel on the contact detail page surfacing up to 3 signal rows pulled from existing tables (email opens, property views, days-since-last-contact). When a signal table isn't populated, the row is hidden rather than zero-padded.

**What ships Q2 2026:**
- AI-derived scoring that replaces the current manual/formula-based score with a model trained on per-agent conversion history.
- Signal expansion: text-open receipts (Twilio), website-widget page views (depends on #1), email-link clicks.

**What is NOT shipping:** native mobile app. Our answer to BoldTrail's mobile-first pitch is **web push in the browser** plus a Capacitor-wrapped PWA. Public copy is explicit about this — we don't claim native.

**Public wording:**
> Lead prioritization: manual + formula-based scoring today, AI-derived scoring ships Q2 2026. Real-time web push when a lead heats up — no native app required.

---

## 3. Marketing automation / drip campaigns (trigger-based)

**Commitment:** **Roadmap — Q2 2026.**

**What ships Q2 2026:**
- Trigger-based sequences: new lead, contact went cold (>30d no activity), birthday, listing anniversary.
- Canned CASL-compliant templates, bilingual (EN/FR).
- Pause-on-reply (Gmail/Outlook thread detection).

**What is NOT shipping in Q2:** A/B testing, SMS drip, behavioral branching beyond "opened/did-not-open."

**Why Q2:** the `/campaigns` shell exists; the `/automations` shell exists. Wiring them to a real sequence runner (edge function cron + template engine + CASL footer from Tier 3 PR H) is ~2 sprints of engineering.

**Public wording:**
> Email drip + trigger-based automations — Q2 2026. All sequences ship with CASL-compliant footers and bilingual templates.

---

## 4. Team accountability dashboard (agent vitals)

**Commitment:** **Out of scope for 2026. Teams tier targets Q1 2027.**

**Why out of scope:** our ICP per `02_product_truth` §2 is the solo Canadian agent or 2–3 person boutique team. Enterprise team dashboards (call/text/email per-agent daily rollups, leaderboards, manager oversight) are a different product surface and would delay Tier 1–3 work on the solo-agent flow.

**What exists today:** every agent's own KPIs are already on `/today` and `/reports` for their own records. Multi-agent aggregation is what's out.

**Public wording:**
> RealtorDesk AI is built for solo agents and boutique teams (up to 5). Larger-team accountability dashboards arrive with the Teams tier, targeting Q1 2027.

---

## 5. Listing marketing automation (one-click social promotion)

**Commitment:** **Cut from 2026 roadmap. Revisit Q1 2027.**

**Why cut:** social-post generation that's actually good needs bilingual caption tuning, image templating, and platform-specific scheduling (Meta, Instagram, TikTok). None of those are in reach this year without crowding out #1 and #2. A half-shipped version is worse than no version — it will be compared directly to BoldTrail's version and lose.

**Interim workaround:** `/properties` exposes a shareable public listing page (existing). Agents copy/paste to socials manually.

**Public wording:**
> One-click listing promotion to social is not on our 2026 roadmap. Share links from the public listing page today; full automation revisited Q1 2027.

---

## Summary table — for the public /roadmap page

| Capability | Ships | Public status |
|---|---|---|
| IDX agent websites w/ behavioral capture | Q3 2026 | Building |
| Web push on lead heat-up | This sprint (Apr 2026) | Shipping |
| Lead score explainer (3 signals) | This sprint (Apr 2026) | Shipping |
| AI-derived lead scoring | Q2 2026 | Designing |
| Trigger-based email campaigns | Q2 2026 | Designing |
| CASL-compliant system emails | This sprint (Apr 2026) | Shipping |
| Public pricing = Stripe parity | This sprint (Apr 2026) | Shipping |
| Team vitals dashboard | Q1 2027 (Teams tier) | Roadmapped |
| One-click social promotion | Q1 2027 (earliest) | Considering |

---

## Out-of-scope (to block scope creep from the brief)

Per the 2026-04-20 brief's "OUT OF SCOPE" block, these explicitly do NOT appear on `/roadmap`:
- Native mobile app (web push + PWA answers the mobile pitch).
- CRE BackOffice / commissions module.
- Agent recruitment tooling.
- Redesign of `/settings`, `/deals`, `/tasks`.
- Second product.

---

## Sign-off checklist before publishing to `/roadmap`

- [ ] Tilak reviews each dated commitment and says yes or pushes it out.
- [ ] If Q3 2026 for IDX slips, we cut from roadmap and move to "Considering" — we don't silently push it.
- [ ] Product Truth doc (`02_product_truth.md`) is updated in the same commit so it can't drift.
- [ ] Footer link to `/roadmap` exists on every page.
