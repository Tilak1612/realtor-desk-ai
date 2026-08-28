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
