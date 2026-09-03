# RealtorDesk AI — Production Runbook

Everything an operator needs to run this without a developer. Written 2026-08-14.

---

## 1. What is live and verified

| Area | State | How it was verified |
|---|---|---|
| Database region | `ca-central-1` | Supabase Management API |
| Signup → session | working | live probe: HTTP 200, session issued |
| Billing gate | working | new user gets `subscribed:false`, redirected to `/billing` |
| Live Stripe checkout | working | `cs_live_…` session created end to end |
| Trial terms | 14 days, card required, $0 today | `create-checkout`: `trial_period_days: 14`, `payment_method_collection: "always"` |
| Webhook signature | enforced | 6 signed live deliveries → 200; unsigned rejected |
| Tenant isolation | enforced | foreign reads 0 rows; forged inserts → 403 |
| CASL suppression | working, fails closed | insert persists; unknown state refuses to send |
| Public intake forms | working | anonymous insert 201; anonymous read `[]` |

---

## 2. Secrets and where they live

**Supabase → Project Settings → Edge Functions → Secrets**

| Secret | Purpose | Consequence if wrong |
|---|---|---|
| `STRIPE_SECRET_KEY` | all billing calls | checkout fails; **must match the mode of the price IDs** |
| `STRIPE_WEBHOOK_SECRET` | signature verification | webhooks rejected; subscriptions never sync |
| `STRIPE_PRICE_SOLO_MONTHLY` / `_YEARLY` | checkout allowlist | `400 Invalid price ID` on every checkout |
| `STRIPE_PRICE_TEAM_MONTHLY` / `_YEARLY` | as above | as above |
| `STRIPE_PRODUCT_SOLO` / `_TEAM` | tier mapping | tier shows as null |
| `RESEND_API_KEY` | all outbound email | **must be able to send as the `EMAIL_FROM` domain** |
| `EMAIL_FROM` | sender address | optional; defaults to `RealtorDesk AI <support@realtordesk.ai>` |
| `CRON_SECRET` | authenticates the two cron jobs | jobs 401 and stop running |

**Vercel → Settings → Environment Variables** (Production scope)

`VITE_STRIPE_PRICE_SOLO_MONTHLY`, `_SOLO_YEARLY`, `_TEAM_MONTHLY`, `_TEAM_YEARLY`,
`VITE_STRIPE_PRODUCT_SOLO`, `VITE_STRIPE_PRODUCT_TEAM`.

> These are **public identifiers**, visible in the client bundle by design.
> The frontend price IDs and the Supabase `STRIPE_PRICE_*` secrets **must match**,
> or `create-checkout` rejects the request. They drifted once and every real
> checkout returned 400.

---

## 3. Switching Stripe test → live

1. Build the catalogue in Stripe **Live** mode: Solo and Team, monthly + yearly.
2. Put the four live `price_` IDs and two `prod_` IDs in **both** places above.
3. Replace `STRIPE_SECRET_KEY` in Supabase with the live key.
4. Point the live webhook endpoint at
   `https://vxkqwkeqincbxrgglmca.supabase.co/functions/v1/stripe-webhook-email`
   and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Subscribe these events: `checkout.session.completed`,
   `customer.subscription.created/updated/deleted`,
   `invoice.payment_succeeded`, `invoice.payment_failed`,
   **`customer.subscription.trial_will_end`**.
6. Redeploy the Vercel production build so the new `VITE_*` values are baked in.

**Do not skip step 6.** `VITE_*` values are compiled into the bundle at build
time; changing them in the dashboard does nothing until a rebuild.

---

## 4. Email

Auth email (confirmation, password reset) goes through **Supabase SMTP**,
configured to Resend. Product email (lifecycle, automations) goes through the
**Resend API** from edge functions.

Both need a key that can send as your verified domain. To verify the setup:

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" -H "Content-Type: application/json" \
  -d '{"from":"RealtorDesk AI <support@realtordesk.ai>","to":["delivered@resend.dev"],"subject":"probe","text":"probe"}'
```

An `id` in the response means the key can send as that domain.
`"The associated domain with your API key is not verified"` means it cannot —
verify the domain in Resend → Domains, or issue a key with full access.

### Email confirmation on signup
Currently **auto-confirm is ON** (`mailer_autoconfirm: true`) as a temporary
measure taken while auth mail could not send. Once the Resend key is in place:

```bash
# re-enable email verification
PATCH /v1/projects/vxkqwkeqincbxrgglmca/config/auth  {"mailer_autoconfirm": false}
```

Leaving it on indefinitely means unverified addresses can hold accounts.

---

## 5. Scheduled jobs

Two `pg_cron` jobs call edge functions with a bearer token:

| Job | Schedule | Function |
|---|---|---|
| `daily-lifecycle-emails` | `0 14 * * *` | `lifecycle-cron` |
| `integration-sync-health-check` | `*/15 * * * *` | `sync-health-check` |

Both functions **fail closed** on a missing or wrong `CRON_SECRET` (401). If you
rotate the secret you must update **both** the Supabase secret and the two
`cron.job` command strings, or the jobs stop silently.

---

## 6. Demo account

`demo@realtordesk.ai` / `RealtorDeskDemo2026` — Alex Morgan, Morgan & Co. Realty,
11 bilingual leads across all 7 pipeline stages. Bypasses billing via
`profiles.is_demo`, which is settable **only by the service role** (a trigger
reverts it for anyone else). Rotate the password before sharing widely.

To make another demo account:
```sql
-- 1) create the user via the Admin API with email_confirm: true
-- 2) then, as the SERVICE ROLE only:
PATCH /rest/v1/profiles?id=eq.<uuid>   {"is_demo": true}
```

---

## 7. Verification commands

```bash
bun install
bun run typecheck   # tsc -p tsconfig.app.json --noEmit
bun run build
bunx vitest run
```

> `tsc --noEmit` against the **root** `tsconfig.json` checks nothing — that file
> is `{"files": [], "references": [...]}`, so it compiles zero files and exits 0.
> Always use `bun run typecheck`.

---

## 7a. Deploys do not always reach production automatically

**Observed 2026-08-14.** After merging to `main`, a production deployment
appeared and was aliased to `www.realtordesk.ai`, but it served a bundle built
from *older* source — its build step showed `0ms`, i.e. cached output was
re-promoted rather than rebuilt from the new commit. The merged fix was live in
git and absent from the site.

**Always verify the served bundle after a merge**, don't trust "Ready":

```bash
# what the site actually serves
B=$(curl -s "https://www.realtordesk.ai/?cb=$(date +%s)" -H 'Cache-Control: no-cache' \
     | grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' | head -1)
curl -s "https://www.realtordesk.ai$B" | grep -c "<a string your change introduced>"
```

If the change is missing, force a build from the current checkout:

```bash
vercel deploy --prod --yes     # note: `vercel --prod` alone prints help, it does not deploy
```

---

## 8. Known limitations

- **16 pre-existing typecheck errors** remain, concentrated in `src/lib/apify.ts`,
  legacy contact components, and 4 duplicate-key warnings in `src/i18n/config.ts`
  (later key wins; the earlier `tasks`/`properties` blocks are unreachable).
- **Two app shells** still ship: legacy top-level routes and `/app/*`. `/app/*` is
  canonical; the legacy routes should be redirected. See `DASHBOARD_AUDIT_2026-08.md`.
- **No compliance tables yet** — FINTRAC records, provincial disclosure logs and
  DSAR workflows do not exist. The dashboard tiles that claimed them were removed
  rather than left fabricating counts.
- **DDF is not connected** — `ddf_properties` is empty; the sync functions exist
  but have no credentials.
- **Lead scoring produces nothing** — `ai_lead_scores` is empty.
- **`sms_consent` does not exist**, so SMS has no consent ledger. CASL treats SMS
  as a commercial electronic message; do not send marketing SMS until it does.

---

## 9. Inbound webhook (Zapier / Make / n8n)

`webhook-receiver` turns an inbound payload into a contact. It previously
parsed the payload, logged its byte length, discarded it, and returned 200 —
so the sending platform recorded success and never retried.

**URL**: `POST /functions/v1/webhook-receiver?user_id=<uid>&tool=<slug>&token=<webhook_token>`
The token comes from `integration_connections.webhook_token` for that user+tool.

Field mapping is case- and separator-insensitive and walks up to 3 levels of
nesting, so `First Name`, `first_name` and `firstName` all match:

| Contact field | Accepted keys |
|---|---|
| email | email, emailAddress, email1, contactEmail, from |
| phone | phone, phoneNumber, mobile, telephone, cell |
| name  | name, fullName, contactName, or firstName + lastName |

Behaviour:
- Raw payload is written to `webhook_events` **before** any parsing, so a
  payload we fail to interpret is still recoverable.
- Deduped on email — a Zap that fires twice updates rather than duplicating,
  and only fills blank fields so curated data is never overwritten.
- No email **and** no phone → recorded as `ignored` (this is what an empty
  "test" ping from the Zap editor looks like).
- Malformed email → 400. Persistence failure → 503/500 so the sender retries.
- **No CASL consent is implied.** Inbound leads land with `consent_given =
  false`; the agent must record consent on the lead before messaging.

Check what arrived:
```sql
select received_at, processing_status, processing_error, payload
from webhook_events where user_id = '<uid>' order by received_at desc limit 20;
```

## 10. Integration health

`sync-health-check` now performs a real authenticated call to the provider
(Google Calendar/People, Microsoft Graph) and reports three states:

| Result | Meaning | Effect |
|---|---|---|
| healthy | provider returned 2xx | stamps `last_sync_at` + `success` |
| unhealthy | provider returned 401/403 | stamps `error`, triggers re-auth email (24h dedup) |
| unknown | no key, undecryptable blob, no token, 5xx, timeout | **leaves status untouched** |

"unknown" deliberately asserts nothing — the previous stub returned `true`
unconditionally, which is why the error branch was unreachable and
`send-reauth-email` had never fired. Because "unknown" does not refresh
`last_sync_at`, the badge ages from green to yellow on its own rather than
holding a stale green.

Two callers: pg_cron (sends `CRON_SECRET`, sweeps everything) and the
"Sync Now" button (user JWT, scoped to that user's own connections).
`ENCRYPTION_KEY` must be set for tokens to be decryptable; without it every
result is "unknown" rather than a false "healthy".

## 11. Verified end-to-end (2026-08-28)

Run against production, all probe data removed afterwards:

| Journey | Result |
|---|---|
| Signup → profile row auto-created → login | pass |
| Billing gate returns `subscribed:false` for a new account | pass |
| Lead creation | pass |
| Record CASL consent + source | pass |
| Send message → read thread back | pass |
| Cross-tenant read of another user's contacts | 0 rows |
| Forged insert as another user | 403 |
| Stripe checkout, all 4 price IDs | live `cs_live_` sessions |
| Lead scoring | 17/100, confidence 0.12 |
| Webhook: lead created / deduped / empty ping / bad token / bad email | pass / pass / ignored / 401 / 400 |
| Health check: invalid token / undecryptable blob | error / unknown, **0 healthy** |

**Known limitation:** signup currently auto-confirms
(`mailer_autoconfirm: true`) because no verified Resend sending domain is
installed. Verify the domain, add the key, then set it back to `false` so
new users get a real verification email.

## 12. Database schema

The migration set is **one generated baseline**,
`supabase/migrations/00000000000000_baseline_production_schema.sql`, produced
from the live database by `scripts/generate-schema-baseline.sh`.

```bash
SUPABASE_ACCESS_TOKEN=<token> ./scripts/generate-schema-baseline.sh
```

It is read-only against production and rewrites the baseline in place. Commit
the diff. Do not hand-write migrations — CI fails if more than one `.sql` file
appears in `supabase/migrations/`.

**Why it was rebuilt (2026-08-28).** The previous 52 files created 64 tables
against production's 43; two of them could not replay on a clean database
(`automation_steps` and `contact_activities` are each created twice with
incompatible shapes, and the follow-on index references columns that do not
exist); and replaying the set would have *introduced* two RLS holes production
did not have — an `email_log` INSERT policy and a `scheduled_emails` FOR ALL
policy, both named for the service role but with no `TO` clause, so both
applied to `PUBLIC`. The `scheduled_emails` one used `USING (true)`, which
would have let any authenticated user read and delete other tenants' rows.
Meanwhile production carried objects in no migration at all, notably
`profiles.is_demo` and `trg_guard_profile_privileged_columns`.

Verified: the baseline builds from an empty schema to **43 tables, 97 policies,
106 indexes, 7 functions** — exact parity with production.

### CI guards
- exactly one applied migration
- every `CREATE POLICY` names its roles (no `TO` clause ⇒ applies to `PUBLIC`)
- every table a constraint references is created in the same file
- `npm run typecheck` — the previous `npx tsc --noEmit` was a **no-op**, because
  the root `tsconfig.json` is `{"files": [], "references": [...]}`, so CI had
  never actually typechecked anything

## 16. Trial backfill — a recorded decision

On 2026-08-28 `profiles.trial_ends_at` had no column default and all 15 rows
were NULL, so every account read "0 days left in your trial". The default was
restored and the NULL rows backfilled to `now() + 14 days`.

**Why from `now()` and not `created_at`.** These accounts were never given a
working trial clock, so dating from signup would have silently expired people
who had not yet had a trial at all. Six of them signed up between April and
July and are dormant.

**What it does and does not do.** `trial_ends_at` does **not** gate access —
`RequireBilling` gates on `subscribed` (a real Stripe subscription) or
`is_demo`. The column only drives the countdown display and `trialExpired`.
So the backfill granted nobody access they did not already have.

**The consequence that did matter.** Before the backfill `trialEndsAt` was
NULL, so `trialExpired` was permanently false and `TrialExpiredModal` had
never fired for anyone. After it, every non-subscribed profile flips to
expired on **2026-09-11**, all at once. That modal had its close button
hidden and both Escape and outside-click prevented, with no data-export path —
so it would have trapped users with their own contacts behind it. It is now
escapable and carries "Export my data" and "Sign out" links; under PIPEDA a
lapsed user keeps the right to their personal information.

If you would rather those six dormant accounts stay expired instead of
holding a fresh trial, this reverses it (the guard trigger protects the
column, so it needs the same disable/enable dance):

```sql
BEGIN;
ALTER TABLE public.profiles DISABLE TRIGGER trg_guard_profile_privileged_columns;
UPDATE public.profiles SET trial_ends_at = created_at + interval '14 days'
WHERE created_at < '2026-08-01' AND NOT is_demo;
ALTER TABLE public.profiles ENABLE TRIGGER trg_guard_profile_privileged_columns;
COMMIT;
```
