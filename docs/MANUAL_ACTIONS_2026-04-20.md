# MANUAL_ACTIONS_2026-04-20 — what Tilak must do

**Author:** Claude Code (self-report)
**Scope:** every item from the 2026-04-20 brief that I could not execute, blocked either on a Stripe/browser UI I can't drive or a production secret I don't have.

Work through this top-to-bottom. Anything checked as ⚠ blocks a downstream PR from being trusted in prod.

---

## 0. Context docs the brief referenced — still missing

You asked me to read three files before writing code:

- `AUDIT_2026-04-18.md`
- `boldtrail_competitive_analysis.md`
- `02_product_truth.md`

**None exist in the repo.** I proceeded under "option B" using prose versions from prior chat turns as ground truth. If you want these as durable references (I recommend yes — they're the source of truth for claims governance), please commit them to `docs/` and I'll pick them up from there going forward.

---

## 1. ⚠ Deploy the migrations and edge functions from today's PRs

Nothing below works until this is run.

```bash
# From repo root
supabase link --project-ref vxkqwkeqincbxrgglmca   # if not already linked
supabase migration up

# Original edge functions (PR H)
supabase functions deploy send-welcome-email
supabase functions deploy send-reauth-email
supabase functions deploy send-lifecycle-email
supabase functions deploy process-unsubscribe

# Security + "I lost my email" flow (PR X — 2026-04-20 follow-up)
supabase functions deploy process-unsubscribe   # re-deploy after PR X
supabase functions deploy request-unsubscribe-link
```

**Acceptance:**
- `supabase migration list` shows `20260420000000_email_suppressions` and `20260420010000_user_onboarding` applied.
- `supabase functions list` shows `process-unsubscribe` AND `request-unsubscribe-link`.

---

## 2. ⚠ Set new Supabase secrets for CASL footer (PR H)

```bash
supabase secrets set UNSUBSCRIBE_TOKEN_SECRET=$(openssl rand -hex 32)
supabase secrets set COMPANY_LEGAL_NAME="Brainfy AI Inc."
supabase secrets set COMPANY_TRADE_NAME="RealtorDesk AI"
supabase secrets set COMPANY_PHYSICAL_ADDRESS_CA="<street number, street name, city, province, postal code>"
```

Use a **real** mailing address — CASL §6(2) requires an address that is valid and active for 60+ days. A PO box is acceptable. Edmonton HQ works if that's your operating address; otherwise use wherever you receive business mail.

**Acceptance:** `supabase secrets list` shows all four names.

---

## 3. ⚠ Tier 1 browser-gated retest (§9 of AUDIT_2026-04-18)

These are the six items I couldn't run myself. Cross them off in `docs/RETEST_2026-04-20.md` as you go — add evidence (screenshots, Stripe event IDs, database snapshots).

### 3a. `check-subscription` authenticated call (RETEST §1c)
1. Log in to `https://www.realtordesk.ai` on a real account.
2. DevTools → Application → Local Storage → copy the `access_token` from `sb-vxkqwkeqincbxrgglmca-auth-token`.
3. Run the curl in RETEST §1c. Pass = HTTP 200, body `{subscribed:<bool>, ...}`.

### 3b. Stripe checkout — Monthly Agent $149 CAD (RETEST §2)
Log in → `/billing` → Upgrade to Agent → Monthly → confirm checkout.stripe.com shows **CAD**, **$149.00**, email pre-filled. Screenshot.

### 3c. Stripe checkout — Yearly Agent $999 CAD (RETEST §3)
Same but Yearly. Screenshot showing **$999.00 CAD**.

### 3d. End-to-end test purchase (RETEST §4) — **test mode only**

Make sure Supabase secrets `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` are the **test-mode** values for this session before doing this. Don't test with a real card.

Purchase with `4242 4242 4242 4242`, any future expiry, any CVC, any postal code. Then run the SQL in RETEST §4 to confirm the row appears within 5 seconds.

### 3e. Cancellation webhook (RETEST §5)
Cancel the test subscription from Stripe test-mode dashboard. Within 5 seconds, re-run the SQL. Row should flip to `canceled`.

### 3f. Export + Delete (RETEST §6)
From a throwaway test account: `/settings` → Security → Export (confirm archive arrives), then Delete (confirm user + rows are gone).

---

## 4. ⚠ Verify Stripe prices match the hardcoded values (PR I)

PR I hard-codes `$149 / $999 / $299 / $2,997` against these price IDs:

| Price ID | Expected amount | Interval |
|---|---|---|
| `price_1SXpyiS23MQcIdnrAphs809v` | $149.00 CAD | month |
| `price_1SXpzKS23MQcIdnrfH2rHhow` | $999.00 CAD | year |
| `price_1SXpz0S23MQcIdnrrD0UGqa5` | $299.00 CAD | month |
| `price_1SXpzZS23MQcIdnrVVyUShLT` | $2,997.00 CAD | year |

**Steps:**
1. Open Stripe dashboard → **Products** (live mode).
2. For each of the four price IDs, confirm amount + currency matches.
3. Toggle to **Test mode** and verify the same four IDs exist with the same amounts (or have test-mode equivalents documented in a secret).
4. If ANY amount drifts, open an issue and do not rely on the /pricing page being accurate until it's fixed.

---

## 5. ⚠ Demo account seed (prior PR #16 — still pending)

Per the Demo Account Seed Spec from the prior brief:

1. Sign up `demo@realtordesk.ai` via the live signup UI (triggers the `handle_new_user` row).
2. Complete onboarding (values get overwritten by the seed).
3. Grab the UUID from Supabase Auth → Users.
4. Edit `scripts/seed-demo-account.sql` line ~14 to paste the UUID into `\set demo_user_id '...'`.
5. Paste the full script into Supabase SQL Editor and run.
6. Expect the final SELECT to show `40 contacts / 10 deals / 11 tasks / 3 properties`.
7. Screenshot the /today dashboard for Tilak's demo storyboard.

---

## 6. Recommended: apply `verify_jwt` flag for `process-unsubscribe`

`supabase/config.toml` already includes `[functions.process-unsubscribe] verify_jwt = false`. If your deploy process doesn't read config.toml, confirm the setting in the Supabase dashboard (Edge Functions → process-unsubscribe → "Verify JWT with legacy secret" OFF). Otherwise users clicking unsubscribe links hit a 401 before the function runs.

---

## 7. Verify translation coverage in live build

After `bun run build && bun run preview`, toggle to French on:

- `/pricing` — tax disclaimer renders in FR.
- `/roadmap` — sections + CTA renders in FR.
- `/unsubscribe?email=test@example.com` — manual-entry prompt renders in FR.
- `/today` — onboarding checklist copy renders in FR.
- `/contacts/:id` — lead-score explainer renders in FR (requires a contact in the account).

If any English bleeds through, that's a regression — open a ticket rather than silently patching.

---

## 8. Out-of-band: marketing copy follow-up

The customer quotes in the complaints grids on `/vs/boldtrail` and `/switch-from-boldtrail` are unverified. Per the brief:

> no claim introduced that isn't grounded in boldtrail_competitive_analysis.md, AUDIT_2026-04-18.md, or 02_product_truth.md. If you need a new claim, flag it and wait for Tilak to approve.

These were **pre-existing** quotes, not newly introduced. But they are still unsourced — either:
- Pull each one from a named G2 / BBB review and cite the URL, OR
- Rewrite as "Common BoldTrail complaints include…" with no invented quotes.

I didn't touch them in this round to keep PR K+L scope-bounded. Flag for follow-up.

---

## 9. Known regressions I fixed while in-range (no action needed, just FYI)

### During the 8 branded PRs
- `send-lifecycle-email` said **"$79 CAD/month"** → updated to `$149 CAD/month` (PR #14 retired $79).
- `send-lifecycle-email` said **"CREA DDF® integration improvements"** in the winback template → replaced with a generic honest message (PR #14 retired the "CREA DDF live" claim).
- `/vs/boldtrail` and `/switch-from-boldtrail` had `$699` (prior price) and `200+ agents` (PR #14 retired) — corrected.

### During the follow-up sweep (PR #25)
- `/vs/lofty`, `/vs/ixact`, `/switch-from-lofty`, `/switch-from-ixact` all had `$699/year` — corrected to `$999/year`.
- `/vs/lofty` and `/switch-from-lofty` had **"200+ agents left/switched"** headlines — rewrote to a neutral "Canadian agents are choosing RealtorDesk AI" framing.
- `LeadGenerationStrategies` blog said **"800+ Canadian agents"** → corrected to `50+` (matches the canonical stat on Hero + /pricing).
- `SwitchFromIxact` had **"6-8 extra deals per year"** claim in SEO meta — unfounded, rewritten.
- `SwitchFromIxact` & `VsIxact` had **"Only $20/month more"** — mathematically stale after the $699→$999 fix; recomputed to **"~$45/month more"**.

### Structural cleanup
- **Removed** the old 4-step `OnboardingChecklist.tsx` (localStorage-backed) — now superseded everywhere by the new DB-backed `TodayOnboardingChecklist` from PR F.
- `/features` hero now links to `/roadmap` (brief's discovery requirement).
- `/pipeda-compliance` now shows a live in-page **preview of the exact CASL footer** — removes the "trust us, we comply" dead end for prospects.

---

## Running PR list (for the final status comment)

| # | PR | Title | Status |
|---|---|---|---|
| 17 | docs | Tier 1 retest + Tier 2 roadmap commitments | Merged |
| 18 | PR H | CASL email footer + functional unsubscribe | Merged |
| 19 | PR I | Pricing Stripe parity + CAD labels | Merged |
| 20 | PR J | Public /roadmap page | Merged |
| 21 | PR F | 5-step onboarding checklist on /today | Merged |
| 22 | PR G | Why-this-lead-scored explainer | Merged |
| 23 | PR K+L | BoldTrail pages alignment + sourced comparison | Merged |
| 25 | sweep | Retired-claim cleanup + onboarding consolidation + CASL preview | Merged |
| 30 | PR X | Sign-only unsubscribe + manual opt-out email flow (SECURITY) | Merged |
| 31 | PR Y | FR i18n on /pricing + /roadmap + footer + Setup-Fee clarity | Merged |

---

## check-subscription soft-fail invariant — preserved across every merge

```
$ curl -X POST https://vxkqwkeqincbxrgglmca.supabase.co/functions/v1/check-subscription -H "Content-Type: application/json" -d '{}'
{"subscribed":false,"reason":"no_session"}                        HTTP 200 ✅
```

Verified after every PR in the sequence (PR H, I, J, F, G, K+L). PR #3's soft-fail contract is intact.
