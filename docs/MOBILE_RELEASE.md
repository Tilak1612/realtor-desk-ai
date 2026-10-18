# Realtor Desk for iOS and Android: release readiness

Prepared 13 October 2026 on branch `feat/mobile-capacitor`. Nothing here has been deployed, submitted or pushed, and no production data was changed.

App id (both stores): `com.brainfyai.realtordesk`. Display name: Realtor Desk. Publisher: Brainfy AI Inc. Version 1.0.0 (build 1).

Related: [MOBILE_ACCOUNT_DELETION.md](MOBILE_ACCOUNT_DELETION.md) (data inventory and the deletion function's contract).

## 1. What was built

The app is the existing web product bundled with Capacitor 8. One codebase; every native difference sits behind `isNativeApp()` in `src/lib/native/platform.ts`, so the website's behaviour is unchanged except for one deliberate change noted in section 6.

| Area | What exists now | Where |
|---|---|---|
| Projects | iOS (Swift Package Manager, iOS 15+, iPhone) and Android (min SDK 24, compile and target SDK 36) | `ios/`, `android/`, `capacitor.config.ts` |
| Build | `npm run build:mobile` builds the bundle into `dist-mobile` without the marketing prerender, Google Analytics, JSON-LD or website-only files; `npm run cap:sync` builds and syncs | `vite.config.ts`, `package.json` |
| Start and routes | The app opens on sign-in or the dashboard. Marketing pages, sign-up, pricing, billing and the unfinished legacy screens are unreachable | `src/lib/native/routes.ts`, `NativeRouteGuard` |
| Layout | Edge-to-edge with safe-area insets on every screen, dynamic viewport height, nav drawer inset, offline banner, a retry screen if the app fails to load, Android back button | `src/index.css` (native block), `src/lib/native/bootstrap.ts` |
| Sign-in | Email and password with the existing two-factor step. Session tokens are stored in the iOS Keychain / Android Keystore-backed storage, never in web storage. Session refresh pauses in the background and resumes on return | `src/lib/native/auth/` |
| Password reset | Requested in the app, completed on the website in the phone's browser (see section 6) | `passwordRecovery.ts`, `ResetPassword.tsx` |
| Provider sign-in | Written (system browser, deep link, code exchange) and switched off. See section 5 | `oauth.ts`, `deepLinks.ts` |
| Payments | None in the app. An account without a subscription sees a neutral screen with no price, plan or link out | `NoAccessScreen.tsx`, `RequireBilling.tsx` |
| Account deletion | Real deletion from Settings: cancels the Stripe subscription, deletes files, data and the login. Refuses demo accounts. Public page at `/account-deletion` | `supabase/functions/delete-account/`, `DeleteAccountDialog.tsx`, `AccountDeletion.tsx` |
| AI | "Report this response" on every assistant message, and a line saying responses are AI-generated and can be wrong | `ReportAIResponse.tsx` |
| Languages | English and French throughout the new screens; the app follows the existing language switch | `src/i18n/native*.ts`, `accountDeletion.ts`, `aiResponseReport.ts` |
| Icons and splash | Generated from the brand mark for every size both platforms need | `scripts/generate-mobile-assets.mjs`, `resources/` |
| Android privacy posture | Permissions: INTERNET and ACCESS_NETWORK_STATE only. Backups and device transfer excluded. Cleartext traffic off | `AndroidManifest.xml`, `data_extraction_rules.xml` |

Hidden in the app only, because they are unfinished on the web: Calendar, Campaigns, Market, Integration Hub, the Google Calendar card, the "Coming Soon" notification settings, the Pipeline forecast tab, and the buttons in Inbox and Lead detail that have no action (Call, Book showing, Take over, Draft with AI, Attach listing, Template).

Not included, on purpose: push notifications (there is no backend for them, so the app asks for no notification permission), in-app purchase, sign-up.

## 2. Test results

| Check | Result |
|---|---|
| Type-check, unit and component tests | Pass: 94 files, 960 tests |
| Lint | Unchanged from the baseline (74 errors, 8 warnings, none new) |
| Web build | Unchanged apart from content hashes |
| Android release bundle | Builds; see section 3 |
| 16 KB memory pages | The bundle contains no native libraries (`.so` files), so there is nothing to align |
| iOS simulator (iPhone 18 Pro Max, iOS 27) | App launches to sign-in, respects the Dynamic Island and home indicator, switches English/French, shows no sign-up, price or provider button |
| iOS release archive | See section 3 |

Not tested, and why:

- **Anything after sign-in on a device or simulator.** No test credentials were entered; the app talks to production. Leads, pipeline, inbox, the assistant, export, sign-out and deletion are covered by unit and component tests and by a browser simulation of the native shell, not by a run on a phone.
- **Physical iPhone and Android devices.** None available. Keyboard behaviour, the Android back button, the file picker and camera, and the share sheet used by data export need a real device.
- **The deletion function.** It has never run. It was type-checked against the real client types and its sequencing is tested against fakes; it was not checked with Deno and has not touched Stripe or Supabase.
- **Android emulator.** Not run.

## 3. Build artefacts

| Artefact | Location | Status |
|---|---|---|
| Android App Bundle | `android/app/build/outputs/bundle/release/app-release.aab` | Signed with the upload key below. Rebuilt 13 October after the audit fixes |
| Android debug APK | `android/app/build/outputs/apk/debug/app-debug.apk` | For sideloading on a test phone |
| iOS archive | `/tmp/rd-ios-archive/RealtorDesk.xcarchive` | Unsigned. Proves the release configuration compiles; it cannot be uploaded |

**Android upload key.** Created for this app at `~/keystores/realtordesk-upload.jks` (outside the repository), alias `realtordesk-upload`, RSA 4096, valid to 2056. Its password is in the macOS Keychain under "RealtorDesk Android upload keystore" and in `android/keystore.properties`, which is gitignored. SHA-256: `45:C3:A5:26:D0:5A:1D:73:17:A2:B4:8A:88:02:91:AC:2B:09:82:96:A5:5E:AB:A6:59:C6:E5:DE:BD:7C:79:C0`. Back this file up: with Play App Signing a lost upload key can be reset by Google, but only through a support request. If you would rather use a different key, replace the file and the properties.

**iOS signing.** Only an "Apple Development" certificate is on this Mac. A signed archive needs the bundle id registered and a distribution certificate and profile on the Brainfy AI Inc. Apple Developer account, which are account-owner actions (section 5).

## 4. Store listing

### Text

| Field | English | French |
|---|---|---|
| Name (30) | Realtor Desk | Realtor Desk |
| Subtitle (30, Apple) | CRM for Canadian agents | CRM pour courtiers canadiens |
| Short description (80, Google) | The CRM for Canadian real estate agents, in English and French. | Le CRM des courtiers immobiliers canadiens, en français et en anglais. |
| Keywords (100, Apple) | real estate,crm,realtor,leads,pipeline,follow-up,agent,broker,casl,canada,immobilier,courtier | immobilier,crm,courtier,prospects,pipeline,suivi,agent,lcap,canada,clients,inscriptions |
| Category | Business (secondary: Productivity) | |
| Support URL | https://www.realtordesk.ai/contact | |
| Privacy policy URL | https://www.realtordesk.ai/privacy-policy | |
| Account deletion URL (Google) | https://www.realtordesk.ai/account-deletion (live only after the website is deployed from this branch) | |

Description, English:

> Realtor Desk is a CRM for Canadian real estate agents, in English and French. This app is the mobile companion to your Realtor Desk account.
>
> - See your leads with a 0 to 100 score and the reasons behind it
> - Move deals through your pipeline
> - Keep one conversation thread per client
> - Manage tasks and follow-up dates
> - Keep property records
> - Ask the assistant to draft a message for you to review
> - Work in English or French
>
> Built for how Canadian agents work: the date and source of consent are recorded for each contact, the database is hosted in Canada, and nothing is sent to a client without you.
>
> A Realtor Desk account is required to sign in.

Description, French:

> Realtor Desk est un CRM pour les courtiers immobiliers canadiens, en français et en anglais. Cette application est le compagnon mobile de votre compte Realtor Desk.
>
> - Consultez vos clients potentiels avec un pointage de 0 à 100 et ses raisons
> - Faites avancer vos transactions dans votre pipeline
> - Gardez un seul fil de conversation par client
> - Gérez vos tâches et vos dates de suivi
> - Conservez vos fiches de propriétés
> - Demandez à l'assistant de rédiger un message que vous révisez
> - Travaillez en français ou en anglais
>
> Conçu pour la pratique des courtiers canadiens : la date et la source du consentement sont consignées pour chaque contact, la base de données est hébergée au Canada, et rien n'est envoyé à un client sans vous.
>
> Un compte Realtor Desk est requis pour se connecter.

The listing mentions no price, trial or website purchase, and must stay that way (Apple 3.1.3(f), Google Play payments policy). The French has not had a native review.

### Privacy answers

Tracking: none. No advertising SDK, no analytics in the app.

| Data | Collected | Linked to the user | Purpose |
|---|---|---|---|
| Name, email address, phone number (account profile) | Yes | Yes | App functionality |
| User ID | Yes | Yes | App functionality |
| Other user content: the CRM records the agent enters (their clients' names and contact details, notes, tasks, deals, uploaded documents) and messages typed to the assistant | Yes | Yes | App functionality |
| Customer support: feedback and AI response reports | Yes | Yes | App functionality |
| Crash and performance data | Only if a Sentry DSN is added to the mobile build (it is not set today) | Yes (user id and email are attached) | App functionality |
| Payment info, location, device contacts, photos library, browsing history, advertising data | No | | |

Processors to name where the form asks: Supabase (database and files, hosted in Canada), the AI providers behind the assistant (prompts are sent to them), Sentry if enabled. The app also requests fonts from Google at launch.

Google Play Data safety: data is encrypted in transit; users can request deletion in the app and at the URL above.

Age rating: complete the questionnaires yourself. The app has no user-to-user content; it does contain an AI assistant that produces free text, which both questionnaires now ask about.

### Notes for the reviewer (paste into App Store Connect and Play Console)

> Realtor Desk is a companion app for an existing business service. Accounts are created on our website; the app has no sign-up and no purchase.
>
> Sign in with: [reviewer email] / [reviewer password]. This is a demonstration account with sample data. It needs no subscription.
>
> Account deletion: Settings, then "Delete my account". Deletion is disabled for this shared demonstration account so that it stays available; we can supply a disposable account on request to exercise it.
>
> AI content: the Assistant screen generates draft text. Each response has a "Report this response" control.
>
> The app requests no notification, location, contacts or tracking permission. The camera and microphone are requested only if you choose to take a photo or video when attaching a file.

### Screenshots

Not produced. Store screenshots have to show the signed-in product with data, which needs the reviewer account (section 5). Sizes needed: iPhone 6.9" (1320 x 2868) for Apple; phone screenshots for Google plus a 1024 x 500 feature graphic and a 512 x 512 icon (`resources/icon-only.png` is the source).

## 5. Waiting on the account owner

Approvals (nothing below has been done):

1. **Deploy the website from this branch.** Carries the reset-password change, the `/account-deletion` page and real deletion in Settings.
2. **Deploy the `delete-account` edge function** (`supabase functions deploy delete-account`), then test it once with a throwaway subscribed account. If the Stripe key is restricted it needs Customers read and Subscriptions write.
3. **Reviewer account in production.** Four accounts are already flagged `is_demo` (they bypass the subscription check) but hold contacts only, no deals or tasks. Recommended: create `appreview@realtordesk.ai` through the normal sign-up, set `is_demo`, and run `scripts/seed-demo-account.sql` for it. This writes to production, so it was not done.
4. **Confirm the payment model.** The app ships as a sign-in companion with no purchase. The alternative is Apple and Google in-app purchase, which is a separate project.

Account access only you have:

5. **Apple Developer:** register `com.brainfyai.realtordesk`, create the App Store Connect record, and either sign in to Xcode with the team so automatic signing can create the distribution certificate and profile, or tell me the Team ID and approve that step.
6. **Google Play Console:** create the app, enrol in Play App Signing, upload the bundle to internal testing.
7. **Sentry DSN** for `.env.mobile` if you want crash reporting in the app. Without it the app reports no crashes.
8. **Physical devices:** one iPhone and one Android phone for the checks in section 2.

Only if you want provider sign-in in the app later: add `com.brainfyai.realtordesk://auth/callback` to the Supabase redirect allow-list, and for iOS configure Sign in with Apple (Apple requires it wherever Google sign-in is offered). Note that a first-time provider sign-in creates an account, which the companion model does not allow for.

## 6. Things to know before merging

- **One website behaviour change.** `ResetPassword.tsx` now accepts a recovery link that carries its tokens in the URL fragment. The app has to request that kind of link, because a link tied to the requesting device (the default) cannot be completed in the phone's browser. Resets started on the website are unchanged and a test pins that.
- **Public copy still says no app is planned.** `llms.txt`, the knowledge base, the roadmap FAQ and several comparison pages say a native app is not planned for 2026, and a test bans any claim that one is available. That is still true until the listing is live. Change the copy and the test on the day the app is approved, not before.
- **Inbox "Send" records a message; it does not deliver one.** This is how the website behaves today. A reviewer or a customer will expect a sent message to reach the client. Decide whether to relabel it or wire delivery before submission.
- **Consent records are deleted with the account.** `sms_consent` and the consent fields on contacts cascade. Keeping proof of consent after deletion would need an archive table; that is a retention decision.
- **No password re-prompt before deletion.** A signed-in session plus the typed word is enough.
- **Known gaps:** iPhone only (iPad not targeted); the two iOS permission prompts are in English only; fonts load from Google at launch; the bundle is about 15 MB because unreachable marketing media is included; universal links and app links are not configured; the data export covers profile, contacts and deals only.

## 7. After the signed-in simulator audit (13 October 2026)

Fixed and committed:

- **AI Assistant.** `claude-chat` now calls the Anthropic Messages API with `ANTHROPIC_API_KEY`, the secret the landing-page bot already uses; the Lovable gateway key it used before is rejected in production. Its system prompt no longer says it creates tasks, schedules follow-ups or has market data. Three bugs fixed (contact count capped at 5, pipeline value including closed deals, writes to a table that does not exist). The page shows a lasting error with a retry when a request fails. **The function is NOT deployed:** run `supabase functions deploy claude-chat --project-ref vxkqwkeqincbxrgglmca`, then ask it a question.
- **Model and cost.** The function defaults to `claude-opus-5-5` at low effort; the landing-page bot uses `claude-haiku-4-5`. Set the `CLAUDE_CHAT_MODEL` secret (for example `claude-haiku-5-5`) to change it without a deploy.
- **Launch screen.** iOS was rejecting the launch storyboard because the splash image decoded to 29.9 MB against a 25 MB limit, so launch showed black. The launch screen is now the paper colour with a small mark, the app is fixed to light appearance, and Android's dark-mode splash variants are removed.
- **Dashboard.** The new dashboard is the default in the app; its "Live" badge and "Desk AI replied to" wording are gone.
- **Wording.** Privacy Policy section 9 now matches the PIPEDA page (database in Canada, some providers may process content outside Canada). The Settings data card no longer says "PIPEDA & CASL Compliant".

Still open for the owner:

- Review the Privacy Policy change and bump `PRIVACY_VERSION` in `src/config/legal.ts` when it ships. Lines 62-63 of the same policy still say data is stored "exclusively" in "Toronto and Vancouver regions"; the database is in ca-central-1.
- Other compliance claims still on the site: `SignupAside.tsx:112`, "Conforme PIPEDA par Conception" in the i18n file, and several "CASL-compliant" feature strings.
- `ai-chatbot` still uses the rejected Lovable key (nothing calls it). `docs/OWNERS-MANUAL.md:34` still lists that key as required.
- Nobody is notified of AI response reports, and the legacy feedback form saves nothing.

## 8. Store records (17 October 2026)

- **Apple:** App ID "Realtor Desk iOS" (`com.brainfyai.realtordesk`) registered under team Brainfy AI Inc (Team ID `73GZ9A6C7V`), no extra capabilities. App Store Connect app "Realtor Desk" created: app ID `6824152247`, primary language English (Canada), SKU `realtordesk-ios`, full user access. The Xcode project now carries `DEVELOPMENT_TEAM = 73GZ9A6C7V`, so automatic signing can create the distribution profile when you archive from Xcode.
- **iOS archive** now lives at `ios/App/build/RealtorDesk.xcarchive` (unsigned, gitignored); the `/tmp` copy in section 3 was cleared by the system.
- **Google Play:** app "Realtor Desk" created (app ID `4974788177170265893`, developer account Brainfy AI Inc).
  - App content saved as drafts, nothing sent for review: privacy policy URL; ads: none; advertising ID: not used; government app: no; financial features: none; health features: none; target audience 18 and over; Sign in details "Reviewer demo account" with access instructions but **no username or password yet**; Data safety (below).
  - Data safety: collected, not shared, encrypted in transit. The app does not create accounts; users sign in with accounts created outside the app (service subscription). Types: name, email, user IDs, phone number, other info, other in-app messages, photos, files and docs, other user-generated content. All are for app functionality, none are processed ephemerally, and name, email and user IDs are required. Name, email, user IDs and phone are also for account management, and email for developer communications (the lifecycle emails). Deletion URL `https://www.realtordesk.ai/account-deletion` (Play warned it returns 404 until the website deploy). Play labels that URL as deleting data "without deleting your entire account", but the page deletes the whole account; review this wording.
  - Store settings: category Business, contact email support@realtordesk.ai, website www.realtordesk.ai. Default store listing (en-US): short and full description from section 4, saved as a draft. Icon, feature graphic and screenshots are not uploaded.
  - Content ratings applied on 18 October 2026, after the owner accepted the IARC Terms of Use: All Other App Types; the only Yes is online content (AI-generated); no user-to-user interaction; no location sharing; no digital purchases. Ratings: ESRB Everyone, PEGI 3, IARC 3+.
  - Still open: reviewer username and password, graphics, AAB upload to a testing track.
- **App Store Connect, filled and saved (not submitted):**
  - App Information: subtitle "CRM for Canadian agents", categories Business / Productivity.
  - App Privacy: privacy policy URL. Data types: name, email, phone, customer support, other user content, user ID; all used for app functionality, linked to the user, not used for tracking. Published on 18 October 2026 with the owner's approval.
  - Pricing: base country Canada, $0.00. Availability: Canada only.
  - Age rating: calculated 4+ (every feature and content answer is no or none; no override, because the Terms set no minimum age).
  - Version 1.0: description, keywords, support URL `/contact`, marketing URL, copyright "2026 Brainfy AI Inc.", App Review notes from section 4 (no credentials), manual release.
  - 18 October 2026: version string changed from 1.0 to 1.0.0 to match `MARKETING_VERSION`; promotional text added; French (Canada) localization added (subtitle, description, keywords, promotional text, support and marketing URLs, privacy policy URL) from the section 4 copy, which has not had a native French review.
  - Signed build 1.0.0 (1) archived and exported with the App Store profile for team 73GZ9A6C7V: `ios/App/build/RealtorDesk-1.0.0-1.xcarchive`, IPA in `ios/App/build/export/` (both gitignored). **Not uploaded**; the owner runs the upload.
  - App Review contact saved: Tilak Raj, +1 780 394 2451, info@realtordesk.ai. Reviewer username `appreview@realtordesk.ai` entered in both App Store Connect and Play Console; the password is left for the owner.
  - Reviewer account `appreview@realtordesk.ai` (id `53193b96-…`) signed up by the owner, then set up with the owner's approval: `is_demo`, Jordan Tremblay / Realtor Desk Demo Realty, the seed data (40 contacts with `@example.com` emails, 10 deals, 11 tasks, 3 listings), buyer budgets, 13 chat messages, real lead sources and stages. Its rows carry `metadata.seed = 'demo'` (contacts), `metadata.seed` (deals), `[demo_seed]` (tasks) and `data_source = 'demo_seed'` (listings); its messages are every `conversation_messages` row with its `user_id`.
  - Store screenshots, 18 October 2026 (gitignored `store-assets/`): App Store 6.9" at 1320 × 2868: EN dashboard, leads, conversation, AI assistant; FR dashboard and conversation. Google Play copies at 1320 × 2640 (status bar trimmed for Play's 2:1 limit) and a 512 px icon. No feature graphic yet.
  - Fixes found while taking them, all on this branch: the greeting used the sign-up name instead of the profile name; Pipeline "List" was a placeholder panel; the Tasks page read due dates as UTC, so every task showed the previous day and tasks due today were listed as overdue.
  - Known, not fixed: some French screens still show English strings (lead counts "40 total · 6 hot", source tags, relative times "2d ago", "Hot", "You", "Flagged for you"); Tasks, Properties and the AI assistant use the older layout with a different menu; the conversation list is not sorted by latest message.
  - Signed build 1.0.0 (1) re-archived after these fixes: `ios/App/build/RealtorDesk-1.0.0-1.xcarchive`.
  - Still open: enter the reviewer password in both consoles, content rights, upload screenshots, build upload.
