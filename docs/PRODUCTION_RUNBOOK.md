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

## 13. Recovering a locked-out user (no email required)

**Correction (2026-09-03):** the premise this section was written under no
longer holds. `/forgot-password` **does** send — custom SMTP is configured and
accepting mail, verified in §17. Keep this manual path anyway: it is the normal
way to help someone whose mail is bouncing, filtered, or going to an address
they can no longer reach.

```bash
SUPABASE_SERVICE_ROLE_KEY=<key> ./scripts/recovery-link.sh user@example.com
```

Send the link to the user over a channel you trust — the phone number on their
account, not a shared channel or a ticket. It logs them straight in and lands
them on `/reset-password`.

`signup` generates a confirmation link instead; `magiclink` a one-time sign-in.

**Verified end to end (2026-08-28)** on a throwaway account, then removed:

| Step | Result |
|---|---|
| Generate link for a user with a forgotten password | link issued |
| Follow it | redirects to `/reset-password` with a live session |
| Set a new password | accepted |
| Old password | rejected |
| New password | signs in |

**Treat the link like a password.** It is single-use and time-limited, but
anyone holding it can take over the account until it is used or expires. The
service role key bypasses RLS entirely — never commit it.

### The permanent fix
Verify `realtordesk.ai` in Resend. All three DNS records are already correct
(DKIM at `resend._domainkey`, SPF on `send.`, return-path MX on `send.`), so
it is the dashboard's Verify button, not a DNS change. Confirmed on the exact
SMTP path Supabase auth uses:

```
SMTP AUTH: ok
SEND REJECTED: The associated domain with your API key is not verified.
```

**Diagnosis, precisely.** The rejection is about the API key's own scope, not
the sender address. A `from` of a domain that does not exist at all returns the
identical message, so the error says nothing about which domains are in the
account:

```
from: totally-made-up-domain-xyz.example  -> not verified
from: realtordesk.ai                      -> not verified   (same message)
```

The current `RESEND_API_KEY` is a **sending-only key scoped to a single
domain**, and that domain is not verified. It also cannot list domains
(`GET /domains` returns `restricted_api_key`), so the account state cannot be
inspected from the API.

Two ways out, either is sufficient:
1. Verify the domain the key is bound to, in the Resend dashboard. The DNS is
   already correct, so this is the Verify button.
2. Issue a **full-access** Resend API key (or one bound to a domain that is
   already verified) and set it as the `RESEND_API_KEY` secret in Supabase and
   the `RESEND_API_KEY` env var in Vercel.

Once mail flows, self-service password reset and signup verification work with
no code change — every path up to the send is already built and tested.

### Alternatives that were checked and ruled out

So you do not retrace this:

| Option | Result |
|---|---|
| **Resend, another domain on the account** | Untestable. The key returns the same "domain not verified" error for a `from` on a domain that does not exist, so the message says nothing about which domains exist or their state. |
| **Brevo** | Dead end. A `BREVO_API_KEY` is set in Vercel and the key is valid, but (a) the account IP-allowlists API calls so it cannot be used from anywhere not on that list, and (b) the domain is only *ownership*-verified — `brevo-code` TXT is present but `mail._domainkey` and `brevo._domainkey` are **empty**, so Brevo cannot authenticate mail from this domain. Setting it up would mean adding DKIM from scratch. |
| **Supabase built-in sender** | Works without any domain verification and would restore self-service reset immediately, but sends from a `supabase.io` address with weaker deliverability, and Supabase documents it as development-grade with a low hourly cap. Deliberately not adopted. |
| **Apex SPF** | There is **no SPF record on `realtordesk.ai` itself** — only on `send.realtordesk.ai`. Fine while all mail goes through the Resend subdomain; worth adding if you ever send from the apex. |

**Resend is the closest to working by a wide margin** — it is the only provider
with DKIM, SPF and a return-path MX all correctly in place. Nothing else needs
building; the send is refused purely on key scope / domain verification state.

### Switching sender, either direction

`scripts/auth-email-mode.sh` makes the choice cheap and reversible:

```bash
SUPABASE_ACCESS_TOKEN=<token> ./scripts/auth-email-mode.sh status
SUPABASE_ACCESS_TOKEN=<token> ./scripts/auth-email-mode.sh supabase   # stopgap
SUPABASE_ACCESS_TOKEN=<token> SMTP_USER=resend SMTP_PASS=<key> \
  ./scripts/auth-email-mode.sh resend                                 # once verified
```

`supabase` drops the custom SMTP so Supabase's own mailer sends, and turns
`mailer_autoconfirm` off in the same call — **self-service password reset and
signup verification start working immediately, with no domain verification.**
The cost is a `supabase.io` sender, weaker deliverability, and a sender
Supabase documents as development-grade. Sensible as a stopgap at current
volume; not a permanent answer.

`resend` restores Resend SMTP once the domain is verified or a full-access key
is installed.

**Never turn `mailer_autoconfirm` off while sends are failing** — that strands
every new signup at an unconfirmed account they cannot clear, which is worse
than no email. Both paths above set it together with a working sender, and
`status` shows which state you are in.

## 14. Sales tax at checkout

`create-checkout` now sets `automatic_tax: { enabled: true }` with
`billing_address_collection: "required"`, so Stripe Tax computes the correct
provincial mix — GST only in AB, HST in ON/NB/NL/NS/PE, GST + QST in QC,
GST + PST in BC/SK/MB.

**Why this was a real problem.** `/pricing` stated *"GST/HST is applied at
checkout based on your billing province"* while `automatic_tax` was never
enabled. Stripe therefore calculated **no tax at all**: every sale was
effectively tax-inclusive against a liability the company still owes the CRA
and Revenu Québec, and the on-page statement was untrue.

**Verified before enabling**, so live checkout was never at risk: a throwaway
`taxprobe` function — identical to `create-checkout` but with tax on — was
deployed, used to confirm Stripe Tax is registered on the account, then
deleted. Only then was the real function changed. All four live price IDs were
re-tested afterwards and still create sessions.

`customer_update: { address: "auto" }` is set whenever an existing Stripe
customer is passed; Stripe refuses an `automatic_tax` session without it.

If a session ever starts failing with a tax error, check that the Stripe Tax
registration is still active — do not simply remove `automatic_tax`, or the
under-collection returns silently.

## 15. Demo accounts (one per plan tier)

Password for all three: `RealtorDeskDemo2026!`

| Login | Plan chip | Agent | Brokerage | Leads |
|---|---|---|---|---|
| `demo.solo@realtordesk.ai` | Solo plan | Alex Morgan | Morgan & Co. Realty (AB) | 9 |
| `demo.team@realtordesk.ai` | Team plan | Priya Raman | Raman Group Realty (ON) | 14 |
| `demo.brokerage@realtordesk.ai` | Brokerage plan | Daniel Okafor | Northline Brokerage (BC) | 18 |

The original `demo@realtordesk.ai` / `RealtorDeskDemo2026` still works and is
unchanged.

**How they bypass billing.** Each has `profiles.is_demo = true`, which
`RequireBilling` honours without a Stripe subscription. That column is
protected by `trg_guard_profile_privileged_columns` and can only be set with
the **service_role key through PostgREST** — the management API SQL editor runs
as `postgres`, where `auth.role()` is null, so the trigger reverts the write.
That is the correct behaviour and the reason a plain SQL update appears to
silently do nothing.

**What actually differs between the three.** Be straight with clients about
this: today the tier changes the workspace plan chip and the Billing page
card, and nothing else. There is no per-tier feature gating in the product —
no team model, no seat limits, no locked features. The Billing page derives
its tier from the Stripe product id, not from `profiles.subscription_tier`, so
on a demo account (no Stripe subscription) it will read as trial regardless of
the chip.

**Seeded data.** 9/14/18 contacts with mixed stages, sources, scores, consent
state and follow-up dates, plus three seeded conversations each so the Inbox
and activity feed are populated. All seeded contacts use `@example.com`, which
is IANA-reserved and can never reach a real inbox, and carry
`metadata.demo = true`.

Remove a demo account with:
```sql
delete from auth.users where email = 'demo.solo@realtordesk.ai';
```
The contacts, messages and profile cascade with it.

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


## 17. Account lifecycle — verified state as of 2026-09-03

Re-tested end to end against production rather than assumed. An earlier note in
this repo said the signup/verify/login/reset journey was blocked by email. That
is **no longer accurate** and should not be relied on.

| Step | State | How it was verified |
|---|---|---|
| Signup | **Works, no email required** | `mailer_autoconfirm` is on: signup returns an `access_token` and stamps `email_confirmed_at` immediately |
| Login after signup | **Works** | A brand-new account signed in on the next request |
| Password reset — mechanism | **Works end to end** | Recovery token issued, redeemed at `/verify`, new password set, new password logs in, old password correctly rejected |
| Password reset — send path | **Live** | Four rapid `/recover` calls returned `over_email_send_rate_limit`. That limiter only engages when mail is actually being dispatched; a dead sender errors instead |

So the account lifecycle is **not** blocked. What remains is a deliverability
risk, not a functional one.

### Outstanding: two registrar records (Namecheap)

DNS for `realtordesk.ai` is served by `dns1/dns2.registrar-servers.com` —
Namecheap BasicDNS, not Vercel — so these cannot be applied from the codebase
or from the Vercel project. They need the Namecheap account.

**1. The apex domain does not resolve at all.**

```
dig +short A realtordesk.ai      -> (nothing)
curl https://realtordesk.ai      -> no response
curl https://www.realtordesk.ai  -> 200
```

Only `www` has a record (`CNAME -> …vercel-dns-017.com`). Anyone who types the
bare domain, or follows a link written without `www`, reaches nothing. No code
in this repo emits a bare-domain URL — every link, canonical and email template
already uses `www` — so this is purely a DNS gap, but it costs any traffic that
arrives by word of mouth, business card or citation.

Fix at Namecheap: add an `ALIAS`/`A` record on `@` pointing at Vercel per the
target shown in the Vercel dashboard for this project, or a URL-redirect record
sending `@` to `https://www.realtordesk.ai`.

**2. SPF is missing; DMARC points at the wrong provider.**

| Record | State |
|---|---|
| `resend._domainkey` (DKIM) | Published — Resend signing is set up for the domain |
| SPF (`TXT` on `@`) | **Missing entirely** |
| DMARC | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` — reports going to Brevo, which is not in the sending path |
| MX | None — the domain cannot receive replies or bounces |

**Custom SMTP is configured and accepting mail.** Determined empirically on
2026-09-03 rather than read from config (the management token was not
recoverable this session):

- Four password-reset requests to four **distinct** addresses went out in ~8
  seconds, all `200`. Supabase's built-in sender caps at roughly 2/hour and
  would have rejected the third and fourth.
- All four auth-log entries record `level: info` with an **empty `error`
  field** and durations of 357–523 ms — real SMTP round-trips that were
  accepted.
- That log stream does surface failures when they happen: the deliberate
  rate-limit probes appear as `level: warning` with
  `error_code: over_email_send_rate_limit`, and a bad login appears as
  `400: Invalid login credentials`. Silence on the sends is therefore
  meaningful, not an absence of logging.

So password-reset mail **is being dispatched successfully**. The remaining
risk is **inbox placement, not delivery** — with DKIM but no SPF, and DMARC
`p=none`, messages are more likely to be spam-foldered. That is worth fixing
but it does not block account recovery.

One caveat on the limit of this evidence: it proves Supabase handed the
message to the SMTP relay without error. It does not prove the message landed
in a human inbox — only sending a reset to a mailbox you control will prove
that, and it is worth doing once as a final check.

Records to add once confirmed:

```
TXT   @         v=spf1 include:amazonses.com ~all
TXT   _dmarc    v=DMARC1; p=none; rua=mailto:dmarc@realtordesk.ai; fo=1
```

Confirm the SPF `include:` against Resend's dashboard for your sending region
before publishing — Resend documents the exact value, and a wrong SPF record is
worse than none. Move DMARC to `p=quarantine` only after a few weeks of clean
aggregate reports.

Verify with:

```bash
dig +short A realtordesk.ai            # should return a record
dig +short TXT realtordesk.ai | grep spf
```

## 18. SECURITY DEFINER hardening (2026-09-05)

Supabase's security advisor flagged every `SECURITY DEFINER` function in
`public` as callable over `/rest/v1/rpc/`. Verified against the codebase:
only `check_apify_rate_limit` and `check_concurrent_import` have a call site
(both in `src/lib/apify.ts`). The rest are trigger bodies and RLS helpers that
should never be reachable over REST.

**Revoked from `anon` and `authenticated`:** `handle_new_user`,
`guard_profile_privileged_columns`, `handle_updated_at`, `has_role`,
`is_admin`. Revoking EXECUTE does not affect RLS — Postgres evaluates policies
as the table owner, so the policies that call `has_role`/`is_admin` still work.
What it stops is a signed-in user asking `has_role(<someone else's uuid>,
'admin')` over REST and learning who the admins are.

**`handle_updated_at`** now pins `search_path = public, pg_temp`. A mutable
search_path on a SECURITY DEFINER function lets a caller who can create
objects shadow an unqualified reference and have it run as the definer.

**The two RPCs I wrote earlier took the user id as a parameter.** That was
wrong: any signed-in user could pass someone else's uuid and read back their
daily import count, or whether they had an import running. Identity now comes
from `auth.uid()` and the argument is ignored. The signature is unchanged so
`src/lib/apify.ts` keeps working without an edit.

Verified live: authenticated call returns `true` even when handed a foreign
uuid, `anon` gets 401, and the five helper functions return 403/404.

Advisor count went 13 → 5. The five that remain are expected:

| Finding | Why it stays |
|---|---|
| `ddf_sync_log`, `oauth_state_store` RLS-no-policy | INFO. Deliberate service-role-only tables; no policy means no client access, which is the intent. |
| `check_apify_rate_limit`, `check_concurrent_import` callable by `authenticated` | Intentional — the client calls them, and they now answer only about the caller. |
| Leaked password protection disabled | Dashboard setting: Authentication → Policies → enable "Leaked password protection" (checks HaveIBeenPwned). Worth turning on; it needs the dashboard, not SQL. |

## 19. Password strength — what code enforces and what it cannot

**Enforced in code** (`src/lib/auth/commonPasswords.ts`, applied by
`validatePassword`, used by both Signup and ResetPassword):

- 8+ characters, upper, lower, digit, symbol — the pre-existing rules
- **not a known-weak password**, matched on the root after stripping
  composition decoration and reversing leetspeak, so `password` also covers
  `Password1!`, `P@ssw0rd2024` and `password!!`
- on Signup only: **not derived from the user's own email address**

The five composition rules alone were satisfied by `Password1!`,
`Welcome1!` and `Summer2024!`. Composition does not merely fail to catch
those — it steers users toward them.

### Still to do in the Supabase dashboard — ACTION REQUIRED

**Authentication → Policies → Leaked password protection: currently OFF.**

Turn it on. It checks candidate passwords against Have I Been Pwned
server-side, which the client-side denylist above cannot replace:

| | code denylist | Supabase HIBP toggle |
|---|---|---|
| coverage | head of the distribution | full corpus |
| bypassable by calling the API directly | yes | no |
| depends on an external service at signup | no | yes (handled by Supabase) |

They are complementary, not alternatives. The denylist helps a real user
pick a better password and gives immediate inline feedback; the toggle is
what actually enforces it against someone bypassing the form.

A browser-side HIBP call was considered and rejected: failing closed would
let someone else's outage block all registrations, and failing open is
security theatre with a network round-trip on every keystroke.

### If a legitimate password is rejected

Over-blocking is the denylist's real risk and is invisible from our side —
the user just sees a rule they believe they satisfied marked red. The root
list is in `COMMON_ROOTS`; the tests in
`src/lib/auth/__tests__/commonPasswords.test.ts` pin six passwords that
must continue to be accepted. Add to that list before touching the roots.

## 20. Capturing product screenshots for the marketing site

The marketing compositions must show the running application, never a
rendering of what it might look like. `scripts/capture-screenshots.mjs`
takes them from production, signed in as a demo tenant, at 2x with browser
chrome excluded.

**Run it yourself — it needs a password, and this is deliberate.** The
script reads credentials from the environment and defaults nothing: a
password written into a committed script is a password in every clone,
every fork, and every CI log that echoes its environment.

```bash
RD_DEMO_EMAIL='demo.brokerage@realtordesk.ai' \
RD_DEMO_PASSWORD='<from section 15>' \
node scripts/capture-screenshots.mjs
```

Writes six PNGs to `src/assets/product/`:

| File | Route | Viewport |
|---|---|---|
| shot-dashboard-desktop.png | /app | 1440x900 @2x |
| shot-leads-desktop.png | /app/leads | 1440x900 @2x |
| shot-pipeline-desktop.png | /app/pipeline | 1440x900 @2x |
| shot-inbox-desktop.png | /app/inbox | 1440x900 @2x |
| shot-dashboard-mobile.png | /app | 390x844 @2x |
| shot-inbox-mobile.png | /app/inbox | 390x844 @2x |

Then generate the AVIF and WebP siblings and commit all three formats:

```bash
node scripts/optimize-images.mjs
```

**Options deliberately set.** `deviceScaleFactor: 2` because anything less
looks soft beside the vector UI around it. `reducedMotion: "reduce"` and
`animations: "disabled"` so no frame is captured mid-transition. The script
waits for a loading string to disappear rather than sleeping a fixed
interval, so a slow query cannot be photographed as an empty state and
shipped as a product screenshot.

**What cannot be captured, and why.** Reports and any task view render
empty: `deals` and `tasks` have never held a row in production. Those two
screens are excluded from the marketing compositions rather than seeded to
look busy. Revisit once there is real activity.

Drives the system Chrome via playwright-core, so there is no browser
download. Override with `CHROME_PATH` if Chrome is installed elsewhere.
