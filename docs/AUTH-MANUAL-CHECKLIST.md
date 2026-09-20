# Authentication — what still needs a human

Everything in this file is a console setting, a DNS record, or a third-party
app registration. None of it can be changed from the repository, which is why
it is here rather than in code.

State as of 2026-09-20, read from the live project (`vxkqwkeqincbxrgglmca`,
`ca-central-1`): 15 users, all with confirmed emails, providers in use are
`email` and `google`, one TOTP factor enrolled but never verified, no linked
identities.

---

## 1. Turn on leaked-password protection — 2 minutes, do this first

**Supabase → Authentication → Policies (Passwords) → enable "Check against
HaveIBeenPwned".**

Currently **off**; it is the only WARN the Supabase security advisor raises
about auth. The signup form already refuses weak passwords (8+ characters,
upper, lower, number, symbol, plus a common-password blocklist) but that runs
in the browser and anyone calling the API directly skips it. This check runs
server-side and cannot be bypassed.

## 2. Raise the server-side minimum password length to 8

**Supabase → Authentication → Policies (Passwords) → Minimum password length.**

The signup form asks for 8. Supabase's default is 6, so a password set through
any other path — the API, a reset link — can still be shorter than what the UI
promises.

## 3. Confirm identities link instead of duplicating

**Supabase → Authentication → Providers → "Allow linking identities with the
same email".**

Without it, someone who signed up with email and later clicks "Continue with
Google" gets a SECOND account and an empty workspace, with their real data
sitting under the first one. There are currently 0 linked identities, so this
has never happened in production and is untested. Worth confirming before
Microsoft goes live and doubles the number of ways in.

## 4. Check the redirect allowlist

**Supabase → Authentication → URL Configuration.**

The app builds redirects from `window.location.origin`, so every origin it may
run on has to be listed:

- `https://www.realtordesk.ai/**`
- the Vercel preview domain pattern, if OAuth is ever used from a preview

Paths in use: `/today` (after OAuth), `/reset-password` (password reset),
`/dashboard` (email confirmation).

## 5. Microsoft sign-in — the button is built and waiting

Three steps, in order:

1. **Microsoft Entra ID → App registrations → New registration.** Redirect URI
   (type Web): `https://vxkqwkeqincbxrgglmca.supabase.co/auth/v1/callback`.
   Under *Authentication*, allow accounts in any organizational directory if
   you want Microsoft 365 work accounts from other tenants; personal Microsoft
   accounts are a separate choice on the same screen.
2. **Supabase → Authentication → Providers → Azure**: enable, paste the
   Application (client) ID and a client secret. If you restricted the app to
   one tenant, set the Azure Tenant URL too.
3. **Vercel → Settings → Environment Variables**: `VITE_ENABLE_MICROSOFT_OAUTH`
   = `true`, then redeploy.

The button only renders when that variable is `true`. It is deliberately
hidden until steps 1 and 2 are done, because `signInWithOAuth({ provider:
"azure" })` against a disabled provider sends the visitor to a Supabase error
page. The code already requests `offline_access`, without which Entra issues
no refresh token and the session cannot be renewed.

Verify after enabling: sign in with a Microsoft 365 work account, confirm one
user appears rather than two, and confirm the session survives past the access
token's first expiry.

## 6. Google consent screen should say Realtor Desk

**Google Cloud Console → APIs & Services → OAuth consent screen.**

Today the consent screen shows the Supabase project reference, which looks
like a phishing page to a careful user. Set the app name, logo, and support
email, then submit for brand verification.

The project ref also appears in the URL during the redirect. Removing that
needs a custom auth domain:

**Supabase → Settings → Custom Domains**, e.g. `auth.realtordesk.ai`, which
needs a CNAME in DNS and is a paid add-on. After it is live, update the
redirect URI in both Google and Entra to point at the new domain.

## 7. Auth email templates are English-only

**Supabase → Authentication → Email Templates.**

Confirm-signup, reset-password and magic-link emails are sent by Supabase from
these templates, and they do not follow the user's language the way the app and
the lifecycle emails do. A Quebec user gets an English reset email. Supabase
templates have no per-locale variant, so the options are bilingual template
text or moving these sends into an edge function.

---

## Worth a manual pass, not a setting

These could not be exercised from CI and need a real browser and a real
account:

- A full Google sign-in end to end, and the same on a phone.
- Two-step verification: enrol from Settings, sign out, sign back in, confirm
  the code is demanded. **This path is new** — the gate previously did not
  exist, so nobody has been through it in production.
- Password reset: request the email, follow the link, set a new password.
- Safari, Edge, and real iOS/Android hardware. Everything tested so far ran on
  Chrome's engine at phone, tablet and desktop widths.

## Known and deliberate

- **`ddf_sync_log` and `oauth_state_store` have RLS on and no policies.** The
  advisor lists this as INFO. It is correct: no policy means deny-all to
  browser clients, and only edge functions using the service role touch these
  tables. Verified that nothing in `src/` reads them.
- **`check_apify_rate_limit` and `check_concurrent_import`** are flagged as
  SECURITY DEFINER and callable by signed-in users. Both ignore the
  `checking_user_id` argument they accept and use `auth.uid()` internally, so
  there is no cross-tenant read. The argument is misleading and should be
  dropped, which means changing the signature and the two call sites in
  `src/lib/apify.ts` — deliberately not done as part of a security pass.
- **`auth-rate-limiter` is deployed and nothing calls it.** Its own docblock
  says the frontend should call it before `supabase.auth`. It was not wired up:
  credential stuffing talks to the Supabase auth endpoint directly and never
  touches our page, so a browser-side check would add latency and a failure
  point on the login path while stopping almost nothing. Supabase's own
  server-side rate limits are the real control. Either delete the function or
  reimplement it somewhere requests cannot go around it.
