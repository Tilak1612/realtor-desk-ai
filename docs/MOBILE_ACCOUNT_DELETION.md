# Account deletion and AI-response reporting

Written 2026-10-13 for the iOS / Android submission. Apple (guideline 5.1.1(v)) requires that
account deletion can be started inside the app and really deletes the account. Google Play
requires the same plus a public web address where deletion can be requested. Google Play's
AI-generated content policy also requires an in-app way to report offensive AI output.

Nothing described here is deployed. See [Owner steps](#owner-steps).

## What changed

| Piece | File |
|---|---|
| Edge function (HTTP, auth, wiring to Supabase and Stripe) | `supabase/functions/delete-account/index.ts` |
| Edge function (the sequence, no imports, unit-tested) | `supabase/functions/delete-account/deletion.ts` |
| Client call and result mapping | `src/lib/account/deleteAccount.ts` |
| Dialog used by Settings on web and in the app | `src/components/settings/DeleteAccountDialog.tsx` |
| Export file helper (browser download, or share sheet in the app) | `src/lib/account/exportFile.ts` |
| Strings, EN + FR | `src/i18n/accountDeletion.ts`, `src/i18n/aiResponseReport.ts` |
| Public page for the store listings | `src/pages/AccountDeletion.tsx` (route not wired, see below) |
| "Report this response" control | `src/components/feedback/ReportAIResponse.tsx` |
| Pages edited | `src/pages/Settings.tsx`, `src/pages/AIAssistant.tsx` |

## What "the account" is

Sources: `supabase/migrations/00000000000000_baseline_production_schema.sql`, and the live
schema of `realtordesk-prod` read on 2026-10-13 with read-only queries against `pg_constraint`,
`information_schema`, `storage.buckets` and `pg_policies`. The two agree on every foreign key
below. Nothing was written to production.

How each table goes when the auth user is deleted:

- **cascade** = removed by Postgres through an `ON DELETE CASCADE` foreign key. Nothing in the
  function names the table.
- **explicit** = no foreign key reaches it, so the function deletes it by name before deleting
  the auth user.
- **kept** = survives on purpose.

### Tables holding a user's data

| Table | Tied to the user by | FK / ON DELETE | Goes by |
|---|---|---|---|
| `profiles` | `id` | `auth.users` CASCADE | cascade |
| `contacts` | `user_id` | `profiles` CASCADE | cascade |
| `ai_lead_scores` | `contact_id` | `contacts` CASCADE | cascade |
| `engagement_stats` | `contact_id` | `contacts` CASCADE | cascade |
| `conversation_messages` | `user_id`, `lead_id` | `auth.users` CASCADE, `contacts` CASCADE | cascade |
| `sms_consent` | `user_id`, `contact_id` | `auth.users` CASCADE, `contacts` CASCADE | cascade |
| `automation_enrollments` | `user_id`, `contact_id`, `sequence_id` | all CASCADE | cascade |
| `automation_sequences` | `user_id` | `auth.users` CASCADE | cascade |
| `automation_sequence_steps` | `sequence_id` | `automation_sequences` CASCADE | cascade |
| `email_automations` | `user_id` | `auth.users` CASCADE | cascade |
| `automation_steps` | `automation_id` | `email_automations` CASCADE | cascade |
| `deals` | `user_id` | `profiles` CASCADE (`contact_id` SET NULL) | cascade |
| `tasks` | `user_id` | `profiles` CASCADE (`contact_id`, `deal_id` SET NULL) | cascade |
| `calendar_settings` | `user_id` | `profiles` CASCADE | cascade |
| `chatbot_settings` | `user_id` | `profiles` CASCADE | cascade |
| `integrations` | `user_id` | `profiles` CASCADE | cascade |
| `integration_connections` | `user_id` | `profiles` CASCADE | cascade |
| `integration_interest` | `user_id` | `profiles` CASCADE | cascade |
| `integration_requests` | `user_id` | `profiles` CASCADE | cascade |
| `google_calendar_connections` | `user_id` | `auth.users` CASCADE | cascade |
| `user_analytics` | `user_id` | `profiles` CASCADE | cascade |
| `user_onboarding` | `user_id` | `auth.users` CASCADE | cascade |
| `user_roles` | `user_id` | `auth.users` CASCADE | cascade |
| `user_feedback` (includes AI-response reports) | `user_id` | `auth.users` CASCADE | cascade |
| `adoption_events` | `user_id` | `auth.users` CASCADE | cascade |
| `apify_usage` | `user_id` | `auth.users` CASCADE | cascade |
| `import_history` | `user_id` | `auth.users` CASCADE | cascade |
| `email_events` | `user_id` | `auth.users` CASCADE | cascade |
| `property_listings` | `user_id` | **no foreign key** | explicit, by `user_id` |
| `oauth_state_store` | `user_id` | **no foreign key** | explicit, by `user_id` |
| `webhook_events` | `user_id` | none on `user_id` (`connection_id` CASCADE, nullable) | explicit, by `user_id` |
| `contact_activities` | `contact_id`, `user_id` | `contacts` CASCADE; none on `user_id` | cascade, and explicit by `user_id` |
| `contact_documents` | `contact_id`, `user_id` | `contacts` CASCADE; none on `user_id` | cascade, and explicit by `user_id` |
| `contact_notes` | `contact_id`, `user_id` | `contacts` CASCADE; none on `user_id` | cascade, and explicit by `user_id` |
| `property_interests` | `contact_id`, `user_id` | `contacts` CASCADE; none on `user_id` | cascade, and explicit by `user_id` |
| `email_log` | `contact_id` | **no foreign key** | explicit, by the user's contact ids |
| `scheduled_emails` | `contact_id` | **no foreign key** | explicit, by the user's contact ids |
| `email_suppressions` | `user_id`, `contact_id` | both **SET NULL** | **kept**, de-identified |

In the `auth` schema, `identities`, `sessions`, `mfa_factors`, `one_time_tokens` and the other
per-user tables all reference `auth.users` with CASCADE, so linked Google sign-ins, sessions and
two-factor enrolments go with the user.

The four `contact_*` / `property_interests` rows are listed as explicit as well as cascade so
that "no row carrying this user id survives" does not depend on every row's `contact_id` and
`user_id` agreeing.

All five explicit-only tables (`property_listings`, `oauth_state_store`, `webhook_events`,
`email_log`, `scheduled_emails`) were empty in production on 2026-10-13.

### Storage

| Bucket | Public | Path | Goes by |
|---|---|---|---|
| `avatars` | yes | `{user_id}/{timestamp}.{ext}` | Storage API: everything under `{user_id}/` |
| `contact-documents` | no | `{user_id}/{contact_id}/{timestamp}.{ext}` | Storage API: everything under `{user_id}/`, recursively |
| `career-resumes` | no | `applications/...` | not account data (public careers form); untouched |

The first path segment is the owner in both account buckets; the storage RLS policies are written
against it. Files are removed through the Storage API, not SQL, because a SQL delete leaves the
underlying object behind. The live `storage.objects` table has no foreign key to `auth.users`.

### Not tied to an account (untouched)

| Table | What it is |
|---|---|
| `contact_submissions`, `demo_requests`, `email_captures`, `lead_magnet_requests` | Forms on the public website, keyed by an email address typed into the form. No link to an auth user. Removal is by request to privacy@realtordesk.ai. |
| `ddf_properties`, `ddf_sync_log` | Licensed listing feed and its sync log. No user data. |

Code also references `ai_conversations`, `sms_messages` and `sms_templates` (`claude-chat`,
`send-sms`). Those tables do not exist in production, so nothing is stored there and there is
nothing to delete. If they are ever created, give `user_id` an `ON DELETE CASCADE` foreign key;
the coverage test below fails until a new user table is accounted for.

## What the function does

`POST /functions/v1/delete-account`, body `{ "confirm": "DELETE" }`, bearer token of the signed-in
user. The user id is taken from the verified token (`auth.getUser(token)`) and from nowhere else.

| # | Step | What happens | If it fails |
|---|---|---|---|
| 1 | `demo_check` | Reads `profiles.is_demo`. `true` is refused with 403 `demo_account`. | Unreadable profile: 500, nothing touched. |
| 2 | `cancel_subscriptions` | Finds every Stripe customer with the account's email, lists their subscriptions, and cancels each one that is not already `canceled` / `incomplete_expired`. Immediate cancel, Stripe defaults: no final invoice, no proration, no refund. No customer: continue. | **502 `stripe_cancel_failed`, run stops, nothing deleted.** |
| 3 | `delete_storage` | Removes every object under `{user_id}/` in `avatars` and `contact-documents`. | 500, account intact, subscription already cancelled. |
| 4 | `delete_rows` | Deletes the explicit tables above. | 500, account intact. |
| 5 | `delete_auth_user` | `auth.admin.deleteUser(id)`, hard delete. Everything marked cascade goes here, in one transaction. | 500, account intact. |

Every response has the same shape:

```json
{
  "success": false,
  "deleted": false,
  "code": "stripe_cancel_failed",
  "error": "The subscription could not be cancelled, so the account was not deleted.",
  "failed_step": "cancel_subscriptions",
  "completed_steps": ["demo_check"],
  "subscriptions_cancelled": 0,
  "storage_objects_removed": 0
}
```

Codes: `unauthorized` (401), `confirmation_required` (400), `method_not_allowed` (405),
`demo_account` (403), `invalid_user` (400), `profile_check_failed`, `stripe_cancel_failed` (502),
`storage_delete_failed`, `row_delete_failed`, `auth_delete_failed`, `internal_error` (500).

Idempotent: each step is safe to repeat, so after a failure the client calls again and the run
resumes. After a success the token no longer resolves to a user and a repeat call gets 401.

Logging: step names, counts and the user id. Never the email address or the token.

### What is retained, and why

| Retained | Where | Why | How long |
|---|---|---|---|
| Unsubscribed email addresses: `email`, `source`, `created_at`. `user_id` and `contact_id` become NULL. | `email_suppressions` | It is the do-not-email list every send checks (`_shared/email-suppression.ts`). Deleting a row would let an address that opted out be emailed again. CASL puts the burden of honouring an unsubscribe on the sender. | No end date. Nothing in the product expires these rows. |
| Stripe customer, invoices, payment history, billing address | Stripe | The function cancels subscriptions and deliberately does not delete the customer: invoices are the company's tax and accounting records. | Not set by the product. **Owner to decide and state a figure** (see open questions). |
| Database backups | Supabase | Backups are not edited. | The Privacy Policy states 30 days. **Owner to confirm that matches the Supabase plan.** |
| Email delivery logs, error logs | Resend, Sentry | Outside the database; the function does not call those services. | Each provider's retention. |

Not retained, and worth knowing: **`sms_consent` rows are deleted** with the account (both of their
foreign keys cascade), and so are the consent fields on `contacts`. Once the account and its
contacts are gone, no SMS or email can be sent from it, so there is no opt-out left to honour.
What is lost is the agent's own evidence that consent existed. The dialog and the public page say
that consent records are deleted, and the dialog offers the export first. See open questions.

### Side effects to know about

- Cancelling in Stripe fires `customer.subscription.deleted`, which `stripe-webhook-email` turns
  into a "subscription cancelled" lifecycle email. Whether it goes out depends on a race: that
  handler needs the `profiles` row, which this function is deleting at the same moment. So a
  cancellation email may or may not arrive. For that reason nothing in the UI promises an email.
- The Google Calendar tokens are deleted with `google_calendar_connections`. The function does not
  call Google to revoke the grant (the tokens are encrypted by the Vercel function and this function
  never decrypts them). The app can no
  longer use the tokens; the entry in the person's Google account stays until they remove it. The
  public page says so.
- Stripe customers are matched by email, as `create-checkout`, `customer-portal` and
  `check-subscription` do, because the product stores no Stripe customer id. If a Stripe customer's
  email no longer equals the account's sign-in email, its subscription will not be found. Nothing in
  the app lets a user change their sign-in email today, so this needs someone to have edited one
  side by hand. A `stripe_customer_id` column on `profiles`, or `subscription_data.metadata.user_id`
  in `create-checkout`, would close it.

## No migration

None is needed, and none was written. The three tables with no foreign key on `user_id` and the two
with none on `contact_id` are handled by explicit deletes in the function. Adding the missing
foreign keys with `ON DELETE CASCADE` would make a deletion from the Supabase dashboard clean up as
well, and is worth doing separately; note that the schema drift check allows exactly one migration
file in `supabase/migrations/`, so it has to go through the baseline regeneration.

The `user_feedback` table already has every column the AI-response report needs (`feedback_type`,
`was_helpful`, `comment`, `metadata`) and an insert-own RLS policy, so that needs no migration
either.

## Client

`DeleteAccountDialog` replaces the old dialog, whose confirm button showed a toast asking the person
to email support. It explains what is deleted and kept, offers the export, requires the confirmation
word (DELETE, or SUPPRIMER in French; the phrase sent to the server is always `DELETE`), shows
progress, and on success signs out with `signOutIntentionally` and goes to `/login` with a toast.
Failures are shown in the dialog with a retry and support@realtordesk.ai. The demo account's button
is disabled with an explanation.

The strings `app.settings.dataRights.deleteDesc` and `.confirmBody` in `src/i18n/config.ts` are left
in place but no longer rendered: they promise an email confirmation and a 30-day process, neither of
which exists.

In the app only (`isNativeApp()`), Settings hides the Google Calendar card, the Notifications card
(both rows are "Coming Soon"), the Billing button and the "Subscribe now" line. The web is unchanged.

### Data export in the app

A Blob behind `<a download>` does nothing in a WKWebView or Android WebView. In the app the export is
written to the cache directory with `@capacitor/filesystem` and offered through the system share
sheet with `@capacitor/share`. The cache directory needs no storage permission and is the one
location the share plugin can share from on Android without editing `file_paths.xml`. An old export
is removed before a new one is written and after an account is deleted.

This was verified against mocks only. There is no `ios/` or `android/` project in the repo yet, so it
has not run on a device.

Two things about the export itself, unchanged here: it contains the profile, contacts and deals only
(its description says "everything we store"), and the contacts and deals queries have no pagination,
so PostgREST's row cap applies to a large account.

## AI-response reports

Each assistant message on `/ai-assistant` has "Report this response". It opens a short form (reason:
inaccurate / offensive or harmful / other, optional comment) and inserts one `user_feedback` row:

| Column | Value |
|---|---|
| `feedback_type` | `ai_response_report` |
| `was_helpful` | `false` |
| `comment` | the comment, trimmed, or NULL |
| `page_url` | the path (`/ai-assistant`) |
| `metadata` | `{ reason, reported_text, reported_text_truncated, platform }` |

`reported_text` is the one reported answer, cut to 2,000 characters. The rest of the conversation is
not stored. To read reports:

```sql
select created_at, user_id, metadata->>'reason' as reason, comment, metadata->>'reported_text' as text
from public.user_feedback
where feedback_type = 'ai_response_report'
order by created_at desc;
```

Nothing notifies anyone when a report arrives, and there is no admin screen for them. Someone has to
look. Under the input there is now one line saying responses are AI-generated and can be wrong.

## Tests

| File | Covers |
|---|---|
| `src/lib/account/__tests__/deleteAccountFunction.test.ts` | The function's sequence against fakes: Stripe before any deletion, a Stripe failure deletes nothing, demo refusal, storage paging and scoping, partial-failure reporting, retry, no email in logs. Also reads the schema baseline and fails if a table holding a user's rows is neither cascaded nor listed. |
| `src/lib/account/__tests__/deleteAccount.test.ts` | Client mapping of every response, including non-2xx bodies and dropped connections. |
| `src/lib/account/__tests__/exportFile.test.ts` | Browser path unchanged; app path writes to cache and shares; cancel is not an error. |
| `src/components/settings/__tests__/DeleteAccountDialog.test.tsx` | Confirmation gating (EN + FR), demo disabled, success signs out and lands on /login, failure shown inline with retry. |
| `src/components/feedback/__tests__/ReportAIResponse.test.tsx` | Row written with reason and truncated text, toast, failure shown, only the reported answer stored, disclaimer on the page. |
| `src/pages/__tests__/accountDeletionPage.test.tsx` | Public page names app and developer, uses the Privacy Policy's address, matches its backup period. |

`index.ts` was type-checked with `tsc --strict` against the real `@supabase/supabase-js` types and
hand-written shims for the Deno global, `std/http` and Stripe. It was **not** checked with
`deno check` (Deno is not installed on this machine) and has **not** been run.

## Wiring the public page

Not done here: `src/App.tsx`, `vercel.json` and `public/sitemap.xml` belong to other work.

`src/App.tsx`, next to the `PrivacyPolicy` lines:

```tsx
const AccountDeletion = lazyWithRetry(() => import("./pages/AccountDeletion"));
```
```tsx
<Route path="/account-deletion" element={<AccountDeletion />} />
```

`vercel.json` rewrite, which `node scripts/sync-vercel-rewrites.mjs` generates from App.tsx
(`src/test/seo/spaFallback.test.ts` fails until it is there):

```json
{
  "source": "/account-deletion",
  "destination": "/index.html"
},
```

`public/sitemap.xml`, optional. The store listings only need the URL to load:

```xml
  <url>
    <loc>https://www.realtordesk.ai/account-deletion</loc>
    <lastmod>2026-10-13</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
```

A sitemap entry brings two build-time requirements with it: the prerenderer builds the page, and
`src/test/seo/internalLinkDepth.test.ts` then requires at least three distinct pages to link to it.
A footer link satisfies that; otherwise add `/account-deletion` to that test's `EXEMPT` set, or
leave the page out of the sitemap.

The page says "in the Realtor Desk app". Wire the route when the app is submitted, not before, so
the site does not mention an app that is not available yet.

`supabase/config.toml`, so the gateway does not reject the call before the function runs (the same
setting, for the same reason, as `customer-portal`):

```toml
[functions.delete-account]
# Function validates the JWT itself via auth.getUser(token), and takes the
# user id from that token only.
verify_jwt = false
```

## Owner steps

1. Add the `config.toml` block above, then `supabase functions deploy delete-account`.
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are the secrets the other
   billing functions already use; no new secret.
2. If `STRIPE_SECRET_KEY` is a restricted key, it needs Customers: read and Subscriptions: write.
   Without the second, every deletion by a subscriber stops at step 2.
3. Test with a throwaway account before submission: sign up, subscribe with a Stripe test card,
   upload an avatar and a contact document, delete from Settings. Then confirm in Stripe that the
   subscription is `canceled`, and in SQL that nothing is left:
   ```sql
   -- replace with the deleted user's id
   select 'profiles' t, count(*) from public.profiles where id = '<uuid>'
   union all select 'contacts', count(*) from public.contacts where user_id = '<uuid>'
   union all select 'property_listings', count(*) from public.property_listings where user_id = '<uuid>'
   union all select 'storage', count(*) from storage.objects where name like '<uuid>/%';
   ```
4. Confirm the reviewer account has `profiles.is_demo = true` (four profiles do today).
5. Wire the public page (above) and put `https://www.realtordesk.ai/account-deletion` in the Google
   Play Data safety form ("Delete account URL") and the App Store review notes.
6. Run `npx cap sync` after pulling: `@capacitor/filesystem` and `@capacitor/share` were added.
   When the iOS project exists, check the Filesystem plugin's README for the privacy-manifest entry
   it asks for.
7. Decide who reads AI-response reports, and how often.

## Open questions for the owner

- **SMS / email consent records after closure.** They are deleted with the account. If counsel wants
  proof of consent kept after an agent leaves, that needs a small archive table written to before
  step 5. Not built, because it is a retention decision, not an engineering one.
- **Billing-record retention period.** The public page says "for as long as tax and accounting rules
  require". Google Play's Data safety form may want a number.
- **Backups.** The page repeats the Privacy Policy's 30 days. Confirm it against the Supabase plan.
- **Email requests.** The page says requests to privacy@realtordesk.ai are checked against the
  account holder and handled within the Privacy Policy's time limit. That is a process someone has to
  run.
- **Step-up for deletion.** The function accepts any valid session plus the confirmation phrase. It
  does not ask for the password or a second factor again.
