# Realtor Desk for iOS and Android: release readiness audit (20 October 2026)

Branch `fix/store-readiness-2026-10-20`, cut from `feat/mobile-capacitor` at `0adc3fe` (PR #280, still open against `main`). This report records checks and their evidence. It is not a certification and makes no compliance claim. Nothing was submitted, merged, deployed or changed in production.

Companion documents, both on `feat/mobile-capacitor`:

- [MOBILE_RELEASE.md](MOBILE_RELEASE.md): what was built, the store listing copy, privacy answers, store records and the owner's open items.
- [MOBILE_ACCOUNT_DELETION.md](MOBILE_ACCOUNT_DELETION.md): the deletion function's contract, the table-by-table inventory and the retention decisions.

App id `com.brainfyai.realtordesk`, name "Realtor Desk", publisher Brainfy AI Inc. iOS: version 1.0.0, build 3, team `73GZ9A6C7V`. Android: versionName 1.0.0, versionCode 1.

## 1. Verified

Each line names the check, what was looked at, and the result. "Live" means the production website on 20 October 2026.

### Auth

| Check | Evidence | Result |
|---|---|---|
| Sign-in flow in the shell | `src/pages/Login.tsx` (email + password + existing TOTP step); `src/integrations/supabase/client.ts` uses `flowType: 'pkce'`, `detectSessionInUrl: !isNativeApp()` | Email/password only in the app. No sign-up route (`/signup` is outside the native allow-list in `src/lib/native/routes.ts`) |
| Session persistence | `src/lib/native/auth/secureSessionStorage.ts`: iOS Keychain / Android Keystore via `@aparajita/capacitor-secure-storage` 8.0.1, `afterFirstUnlockThisDeviceOnly`, iCloud sync off, no localStorage fallback, first-install cleanup; `lifecycle.ts` drives `startAutoRefresh` / `stopAutoRefresh` from `appStateChange` and calls `getSession()` on resume | Pass. Unit tests in `src/lib/native/auth/__tests__/` |
| Deep links | `deepLinks.ts`: custom scheme `com.brainfyai.realtordesk://auth/callback` only (allow-listed, PKCE code exchange, replay guard); https links only for `www.realtordesk.ai` / `realtordesk.ai` and only `/reset-password`, `/verify-email` and allow-listed `/app` paths | Pass. Universal Links / App Links are not configured (section 3) and the app does not depend on them |
| Apple guideline 4.8 (third-party login) | The website offers Google and Microsoft sign-in (`src/components/auth/OAuthButtons.tsx`). `src/lib/native/auth/oauth.ts` `resolveOAuthOffer()`: in the app nothing is offered unless `VITE_NATIVE_OAUTH=true`, and on iOS also `VITE_NATIVE_APPLE_SIGNIN=true`. Neither flag is set in `.env.mobile`; the built bundle was checked for the flag values | Pass by hiding the providers on iOS. Sign in with Apple is written but off; turning on Google in the app later requires turning on Apple too, which the matrix enforces |
| Account deletion in-app (Apple 5.1.1(v), Play policy) | `src/pages/Settings.tsx` renders `DeleteAccountDialog`; `/app/settings` is outside `RequireBilling` (App.tsx line 455 comment) so an unsubscribed account can still reach it, and `NoAccessScreen` links to it. `src/lib/account/deleteAccount.ts` calls `supabase.functions.invoke("delete-account")` with the session, then `signOut({ scope: "local" })`; the dialog signs out with `signOutIntentionally()` and lands on `/login` | Pass. Tests: `DeleteAccountDialog.test.tsx`, `deleteAccount.test.ts`, `deleteAccountFunction.test.ts` |
| Deletion cancels billing | `supabase/functions/delete-account/index.ts`: finds every Stripe customer by the account email, lists subscriptions with `status: "all"`, cancels each, and a Stripe failure stops the run before anything is deleted; demo accounts are refused with 403 | Pass by reading the code and its tests. Not exercised against Stripe or production (section 3) |
| Deletion function deployed | Supabase project `vxkqwkeqincbxrgglmca`, read-only list of edge functions: `delete-account` ACTIVE, version 1, created 18 October 2026, `verify_jwt: false` (the function verifies the token itself, as `supabase/config.toml` says). `claude-chat` is at version 20, updated the same day | Deployed. `MOBILE_RELEASE.md` sections 5 and 7 said otherwise and are corrected on this branch |
| Public deletion URL for Google Play | `/account-deletion` is routed in `src/App.tsx` and rewritten in `vercel.json`; recorded in `MOBILE_RELEASE.md` sections 4 and 8 as `https://www.realtordesk.ai/account-deletion`. Live: `curl -sI` returns **404** | Correct in the repo; **not live** until the website is deployed from `feat/mobile-capacitor` (section 3) |

### Privacy

| Check | Evidence | Result |
|---|---|---|
| iOS privacy manifest | `ios/App/App/PrivacyInfo.xcprivacy`: tracking false, no tracking domains, collected types name / email / phone / user ID / other user content / customer support / photos or videos, all linked, none for tracking; required-reason API `NSPrivacyAccessedAPICategoryFileTimestamp` reason `C617.1`. `@capacitor/filesystem` 8.1.4 README asks for exactly that entry. Capacitor and Cordova ship their own manifests inside their frameworks (`node_modules/@capacitor/ios/.../PrivacyInfo.xcprivacy`) | Pass. Matches the App Store Connect answers recorded in `MOBILE_RELEASE.md` section 8 |
| Info.plist usage strings | `NSCameraUsageDescription` and `NSMicrophoneUsageDescription` present. Real behaviour: `<input type="file" accept="image/*">` for the profile picture (`Settings.tsx`, `DashboardNavbar.tsx`) and an unrestricted `<input type="file">` for contact documents (`DocumentsTab.tsx`); WKWebView offers "Take Photo or Video" for those, which is the only path to the camera or microphone. No `getUserMedia`, geolocation, contacts, calendar, push, local-notification or tracking API in `src/` (grep) | Pass. French strings added on this branch (section 2) |
| Android permissions | `android/app/src/main/AndroidManifest.xml`: `INTERNET`, `ACCESS_NETWORK_STATE` only; `allowBackup=false`, `usesCleartextTraffic=false`, `dataExtractionRules`. Merged release manifest from the last signed build (`android/app/build/intermediates/merged_manifests/release/.../AndroidManifest.xml`): the same two plus the auto-generated `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`; no `AD_ID`, no `SYSTEM_ALERT_WINDOW`, no camera, storage or location. None of the eight plugins' Android manifests adds a permission | Pass |
| Analytics, ads, crash SDKs | `src/utils/analytics.ts` returns before any `gtag` call when `isNativeApp()`; `vite.config.ts` `mobileShell()` strips GA, JSON-LD and website-only files from `dist-mobile`; Sentry is `enabled` only with `VITE_SENTRY_DSN`, which `.env.mobile` does not set (checked: it holds only the three `VITE_SUPABASE_*` values). Built bundle grep: no Sentry ingest host, no GTM script, no `sk_live` / `service_role` patterns | Pass. Tracking: none. Crash reporting: none, as the privacy answers say |
| Privacy policy URL live | `curl -sI https://www.realtordesk.ai/privacy-policy` → 200; `/terms-of-service` 200; `/contact` 200 | Pass |

### Payments (Apple 3.1.1 / 3.1.3(f), Google Play payments policy)

No in-app purchase was added. The app is a sign-in companion to a subscription bought on the website, and every surface that sells, prices or links to checkout is removed when `Capacitor.isNativePlatform()`:

| Surface | Where | What the app shows |
|---|---|---|
| Unsubscribed account | `RequireBilling.tsx` → `NoAccessScreen.tsx` | A statement of fact, "Check again", "Account settings", "Sign out". No price, plan, link out or instruction to pay |
| `/billing`, `/pricing`, `/signup` and all marketing routes | `NativeRouteGuard` + `routes.ts` allow-list; `Billing.tsx` has a second lock that redirects to `/app` | Unreachable |
| Trial countdown + "Upgrade now" | `DashboardSidebar.tsx` line 237, `TopNav.tsx` line 155, `Sidebar.tsx` tier label | Not rendered |
| Trial-expired modal with Stripe checkout buttons | `TrialExpiredModal.tsx` line 59 | Not rendered |
| Settings: "Manage Billing" / "Upgrade Now" button and "Subscribe now" line | `Settings.tsx` `!native` | Not rendered |
| Settings: "Subscription status" card for an unsubscribed account ("Trial active, N days left" / "Trial expired") | `Settings.tsx` | **Fixed on this branch**: rendered only for a subscribed account (section 2) |
| Onboarding hand-off | `rd/Onboarding.tsx` line 98 | Goes to `/app` instead of `/billing?required=1` |
| Marketing header / footer on the in-app Privacy and Terms pages | `Navbar.tsx` → `NativeBackBar`, `Footer.tsx` → null | A back bar only |

Trade-off, unchanged from PR #280: without StoreKit / Play Billing a new user cannot buy inside the app, and the app may not tell them where to. The store listing copy says "A Realtor Desk account is required to sign in" and names no price or trial. Adding in-app purchase is a separate project; prices, the 14-day trial and the Stripe configuration were not touched.

### API and configuration

| Check | Evidence | Result |
|---|---|---|
| Production origin | `.env.mobile` → `VITE_SUPABASE_URL` is the `vxkqwkeqincbxrgglmca` project; the built bundle contains that host and no other Supabase host. `PUBLIC_WEB_ORIGIN` is `https://www.realtordesk.ai` | Pass |
| No dev / staging hosts | `capacitor.config.ts` has no `server.url`, `androidScheme: 'https'`, `allowMixedContent: false`; bundle grep for `localhost:`, `ngrok`, `lovable` finds only the gotrue-js library default constant `http://localhost:9999`, which is dead code when a URL is supplied | Pass |
| iOS build settings | `project.pbxproj`: `PRODUCT_BUNDLE_IDENTIFIER = com.brainfyai.realtordesk`, `DEVELOPMENT_TEAM = 73GZ9A6C7V`, `MARKETING_VERSION = 1.0.0`, `CURRENT_PROJECT_VERSION = 3`, `TARGETED_DEVICE_FAMILY = 1` (iPhone), deployment target 15.0, Release `SWIFT_OPTIMIZATION_LEVEL = -O`; `ITSAppUsesNonExemptEncryption = false` | Pass |
| Android build settings | `variables.gradle`: minSdk 24, compile/target 36. Release signing reads the gitignored `android/keystore.properties`; `git ls-files` shows no keystore, `.jks`, `.p12`, provisioning profile or `.env*` tracked | Pass |
| Custom URL scheme | `Info.plist` `CFBundleURLSchemes` and Android `strings.xml` `custom_url_scheme` both `com.brainfyai.realtordesk`; the Android intent filter accepts host `auth` only | Pass |

### Build and quality (run on this branch, 20 October 2026)

| Command | Result |
|---|---|
| `npm run typecheck` | Exit 0 |
| `npx eslint .` | 82 problems (74 errors, 8 warnings): the baseline PR #280 records, none in the files changed here (the two in `Settings.tsx` are pre-existing `no-explicit-any` at lines 266 and 317) |
| `npx vitest run` | 1053 passed, 17 skipped, 0 failed (see the end of section 2 for the run conditions) |
| `npm run build:mobile` | Built in about 2 minutes; `dist-mobile` is 15 MB (the known marketing-media weight) |
| `npx cap sync` | 8 plugins on both platforms, no errors. Note: on a worktree it rewrites `android/capacitor.settings.gradle` and `ios/App/CapApp-SPM/Package.swift` with absolute `node_modules` paths; those were reverted and are not part of this branch |
| iOS simulator compile (`xcodebuild -scheme App -sdk iphonesimulator`, unsigned) | Exit 0; only upstream Swift warnings in Capacitor plugins. Details in section 2, item 2 |
| Existing artefacts in the main checkout (not rebuilt here) | `android/app/build/outputs/bundle/release/app-release.aab` (18 October, 14.6 MB); `ios/App/build/RealtorDesk-1.0.0-{1,2,3}.xcarchive` and an export folder. They predate the changes on this branch |

### Store assets (repo inventory)

| Asset | Status |
|---|---|
| App icons | `resources/icon-only.png`, `icon-foreground.png`, `icon-background.png`; generated sets in `ios/App/App/Assets.xcassets/AppIcon.appiconset` and `android/app/src/main/res/mipmap-*` (adaptive icon XML included) |
| Screenshots | Gitignored `store-assets/` in the main checkout: App Store 6.9" EN and FR, four each (1320 × 2868); Google Play phone EN and FR, four each (1320 × 2640) |
| Play feature graphic | `store-assets/play/feature-graphic-1024x500-en.png` and `-fr.png` |
| Play icon | `store-assets/play/icon-512.png` |
| Not generated here | Nothing new; screenshots were not retaken |

### Copy

The native-only strings (`src/i18n/nativeAuth.ts`, `accountDeletion.ts`, `aiResponseReport.ts`, `NoAccessScreen`, `AccountDeletion` page, the deletion dialog) carry no certification, "compliant", "guarantee" or security superlatives (grep). The store description's factual claims were checked against the code: consent date and source are recorded per contact (`contacts` consent columns, `sms_consent`), the database is in Supabase `ca-central-1`. Two website strings outside the app still make compliance claims and are listed in `MOBILE_RELEASE.md` section 7 ("Still open for the owner").

## 2. Fixed on this branch

1. **Settings no longer shows a trial countdown or "Trial expired" inside the app.** `src/pages/Settings.tsx` renders the "Subscription status" card only when `!native || subscribed`. Before, an account without a Stripe subscription saw `NoAccessScreen` ("No active subscription on this account") on every product screen and, on Settings, "Trial active, N days left" or "Trial expired" from the database's 14-day trial, which grants no access. The reviewer demo account (`is_demo`, signed up 18 October) would have shown "Trial expired" from 1 November. A countdown is also a nudge to buy. Web behaviour is unchanged (the Billing link and countdown stay there). Test: `src/pages/__tests__/settingsSubscriptionCard.test.tsx` (4 cases: unpaid and expired trial hidden in the app, subscribed account still sees its plan with no billing link, web unchanged).
2. **French permission prompts on iOS.** `ios/App/App/fr.lproj/InfoPlist.strings` (and an `en.lproj` copy matching `Info.plist`) carry `NSCameraUsageDescription` and `NSMicrophoneUsageDescription`; `project.pbxproj` gains the `InfoPlist.strings` variant group, its Resources entry and `fr` in `knownRegions`. `Info.plist` already declared `CFBundleLocalizations` en + fr, so a French phone was getting English prompts. Both `.strings` files and the project file pass `plutil -lint`. Compile verification: `xcodebuild -scheme App -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' build CODE_SIGNING_ALLOWED=NO` exit 0 (Xcode 27.0, Debug, unsigned); the built `App.app` contains `fr.lproj/InfoPlist.strings` and `en.lproj/InfoPlist.strings` with the expected keys (`plutil -p`). The prompts themselves were not shown on a French device (section 3, item 5).
3. **`docs/MOBILE_RELEASE.md` brought up to date.** Build number (iOS build 3), `delete-account` and `claude-chat` marked as deployed on 18 October 2026 with the test step that remains, the reviewer note about camera and microphone now distinguishes iOS from Android (Android declares neither permission), and the "English-only permission prompts" gap removed.

Not changed: prices, trial length, Stripe products, Supabase production, any test or lint rule, any security setting.

Full test suite after the changes: `npx vitest run --testTimeout=30000` → 101 files passed, 4 skipped; 1053 tests passed, 17 skipped (the 1049 at the branch head plus the 4 new cases). The longer per-test timeout was a command-line flag for that run only, because an unrelated build job on the same Mac held the load average above 20 and the repo's default 5 s limit timed out six unrelated native-flow tests, each of which passes in isolation. No test or timeout in the repository was changed.

## 3. Needs manual verification or the owner

Blocking before submission:

1. **Deploy the website from `feat/mobile-capacitor`** (after merging PR #280 and this PR). Until then `https://www.realtordesk.ai/account-deletion` returns 404, and Google Play's Data safety form points at it. Also carries the `ResetPassword.tsx` change the app relies on. Production deploy: owner approval.
2. **Exercise `delete-account` once** with a throwaway subscribed account (steps in `MOBILE_ACCOUNT_DELETION.md`, "Owner steps" 3). The function is deployed but has never run against Stripe or production. If `STRIPE_SECRET_KEY` is a restricted key it needs Customers: read and Subscriptions: write.
3. **Rebuild and re-upload the binaries** after this branch merges: the existing AAB and build-3 archive do not contain the Settings change or the French strings. iOS: archive from Xcode with automatic signing (team `73GZ9A6C7V`), bump `CURRENT_PROJECT_VERSION` to 4. Android: `cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ANDROID_HOME=/opt/homebrew/share/android-commandlinetools ./gradlew bundleRelease -PversionCode=2 -PversionName=1.0.0` (versionCode must rise with every upload), then upload to an internal testing track. Store uploads: owner action.
4. **Reviewer password** in App Store Connect (App Review Information) and Play Console (App content → App access) for `appreview@realtordesk.ai`. Never commit or paste it.
5. **Physical devices.** Keyboard behaviour, the Android back button, the file picker and camera path on iOS, the share sheet used by data export, and the French permission prompts have not been exercised on a phone. `MOBILE_RELEASE.md` section 2 lists what the simulator did and did not cover.
6. **Inbox "Send"** records a message and does not deliver one (website behaviour). Decide whether to relabel or wire delivery before a reviewer tries it.

Store-console answers to confirm (the repo cannot verify them):

7. **App Privacy (Apple)** and **Data safety (Play)** answers must keep matching `PrivacyInfo.xcprivacy` and `MOBILE_RELEASE.md` section 4. If a Sentry DSN is ever added to `.env.mobile`, add crash and performance data in all three places first.
8. **Play "Delete account URL" wording.** Play describes that field as deleting data without deleting the account; the page deletes the whole account. Review the Data safety answer against the page.
9. **Age rating, content rights, export compliance** questionnaires: owner answers. `ITSAppUsesNonExemptEncryption` is false because the app uses only HTTPS.
10. **Screenshots** in `store-assets/` were taken on 18 October from the build before the Settings change; the screens shown (dashboard, leads, conversation, assistant) are unaffected, so they still match the product.

Not configured, documented as a decision rather than a defect:

11. **Universal Links / App Links.** `https://www.realtordesk.ai/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json` return 404 on both hosts. The app uses only its custom URL scheme, has no Associated Domains entitlement and no `autoVerify` https intent filter, so nothing depends on these files. If they are wanted later: AASA needs `applinks` for `73GZ9A6C7V.com.brainfyai.realtordesk` plus the entitlement in Xcode, and must be served as `application/json` (add a `vercel.json` header rule); `assetlinks.json` needs the **Play App Signing** certificate fingerprint from the Play Console, not the upload-key fingerprint (`45:C3:…:C0`) recorded in `MOBILE_RELEASE.md`. Both change the password-reset flow (links would open the app), so treat it as a feature, not a fix.
12. **Provider sign-in in the app** stays off. Turning it on needs the Supabase redirect allow-list entry for `com.brainfyai.realtordesk://auth/callback`, Sign in with Apple configured on the Apple Developer account, and a decision about first-time provider sign-ins creating accounts (the companion model does not allow sign-up).
13. **AI response reports** land in `user_feedback` and nobody is notified (`MOBILE_ACCOUNT_DELETION.md`, "AI-response reports"). Decide who reads them.
14. **Lint baseline.** 74 pre-existing errors across the repo (mostly `no-explicit-any` in edge functions). Not a store matter; worth a separate clean-up PR.

## 4. Commands the owner runs next

```bash
# review and merge this PR into feat/mobile-capacitor, then PR #280 into main
gh pr view <this PR> --web

# website deploy from main after the merges (Vercel), then confirm:
curl -sI https://www.realtordesk.ai/account-deletion | head -1      # expect 200

# test the deletion once with a throwaway subscribed account, then the SQL in
# docs/MOBILE_ACCOUNT_DELETION.md "Owner steps" 3

# rebuild the shells from the merged code
npm ci && npm run cap:sync
cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
  ./gradlew bundleRelease -PversionCode=2 -PversionName=1.0.0
# iOS: set CURRENT_PROJECT_VERSION to 4, archive in Xcode, upload with the owner's Apple ID
```
