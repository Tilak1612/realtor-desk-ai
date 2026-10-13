import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// /account-deletion: how to delete a Realtor Desk account and its data.
//
// WHY THIS PAGE EXISTS. Google Play requires every app that lets people create
// an account to publish a web address where deletion can be requested without
// installing the app, naming the app and the developer, the steps, and what is
// deleted and kept. Apple's review asks where deletion lives. This is the URL
// that goes in both store listings.
//
// EVERY STATEMENT BELOW IS READ FROM THE CODE, 2026-10-13:
//   steps, confirmation word          src/components/settings/DeleteAccountDialog.tsx
//   immediate, subscription first     supabase/functions/delete-account/deletion.ts
//   what is deleted, table by table   docs/MOBILE_ACCOUNT_DELETION.md (the inventory)
//   do-not-email list is kept         email_suppressions: user_id / contact_id are
//                                     ON DELETE SET NULL in the schema baseline
//   billing records stay with Stripe  the function cancels subscriptions and does
//                                     not delete the Stripe customer or invoices
//   30-day backups, privacy address   src/pages/PrivacyPolicy.tsx, sections 3 and 8
// It does NOT claim: a confirmation email (none is sent), a refund (none is
// issued by deletion), a retention period for billing records in years (nothing
// in the product sets one), or that deleting the account disconnects Realtor
// Desk inside the person's Google account (it does not call Google).
//
// English only, like the Privacy Policy and Terms it sits beside. The in-app
// flow it describes is in English and French.

// The address the Privacy Policy already publishes for privacy requests.
const PRIVACY_EMAIL = "privacy@realtordesk.ai";

const DELETED: { what: string; detail: string }[] = [
  {
    what: "Your sign-in and profile",
    detail:
      "Email address, password, any linked Google or Microsoft sign-in, two-factor settings, name, phone, brokerage, licence number, province, city, language and profile photo.",
  },
  {
    what: "Your contacts and everything attached to them",
    detail:
      "Contact details, notes, activity history, conversations, lead scores, property interests, uploaded documents, and the email and SMS consent records stored with each contact.",
  },
  {
    what: "Your work in the CRM",
    detail:
      "Deals, tasks, listings you added, automations and sequences, import history, and your calendar and assistant settings.",
  },
  {
    what: "Connections to other services",
    detail:
      "The encrypted access tokens saved for Google Calendar and other integrations, and the events those integrations sent us.",
  },
  {
    what: "Records about your use of the product",
    detail:
      "Usage events, onboarding progress, feedback you submitted, and any AI responses you reported.",
  },
];

const KEPT: { what: string; why: string; howLong: string }[] = [
  {
    what: "Email addresses on the do-not-email list",
    why: "When someone unsubscribes from email sent through Realtor Desk, their address is kept so that the request keeps being honoured, as Canada's anti-spam law (CASL) expects. The entry keeps the address, where the unsubscribe came from and the date. Its link to your account and to the contact record is removed.",
    howLong: "No end date.",
  },
  {
    what: "Billing records",
    why: "Invoices, payment history and the billing details you entered at checkout are held by our payment processor, Stripe. Deleting your account cancels the subscription and does not erase these records, which a business has to keep for tax and accounting purposes.",
    howLong: "For as long as tax and accounting rules require.",
  },
  {
    what: "Backups",
    why: "A deleted account can still be present in an encrypted database backup taken before the deletion. Backups are not edited; they expire.",
    howLong: "Up to 30 days, the backup period stated in our Privacy Policy.",
  },
  {
    what: "Service-provider logs",
    why: "Delivery records for email already sent, and error logs, held by the providers we use for email delivery and error monitoring. Deleting your account does not reach into those systems.",
    howLong: "Each provider's own log retention period.",
  },
];

const AccountDeletion = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Delete Your Realtor Desk Account"
        description="How to delete your Realtor Desk account and data, in the app or on the website: the steps, what is deleted, what is kept and for how long."
        keywords="delete Realtor Desk account, account deletion, data deletion request, Realtor Desk privacy"
        canonicalUrl="https://www.realtordesk.ai/account-deletion"
      />
      <Navbar />

      <main>
        <section className="pt-32 md:pt-40 pb-10">
          <div className="container-custom max-w-3xl">
            <h1 className="mb-6">Delete your Realtor Desk account</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk is published by Brainfy AI Inc. This page explains how to delete
              your Realtor Desk account and the data in it, what is deleted, and what is
              kept. The steps are the same on the website and in the Realtor Desk app.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">Short answer</h2>
              <p className="text-base mb-0">
                Sign in, open Settings, choose Delete my account, and type the confirmation
                word. The account is deleted straight away, any subscription is cancelled
                first so you are not billed again, and it cannot be undone. If you cannot
                sign in, email{" "}
                <a className="underline" href={"mailto:" + PRIVACY_EMAIL}>
                  {PRIVACY_EMAIL}
                </a>
                .
              </p>
            </Card>

            <div>
              <h2 className="mb-4">Delete your account yourself</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">Sign in</strong> to Realtor Desk, in
                  the app or at{" "}
                  <Link className="underline" to="/login">
                    realtordesk.ai/login
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-foreground">Open Settings.</strong>
                </li>
                <li>
                  <strong className="text-foreground">Find Delete my account</strong> and
                  choose Delete. If you want a copy of your profile, contacts and deals
                  first, use Export my data, which is offered in the same place.
                </li>
                <li>
                  <strong className="text-foreground">Read what will be deleted</strong>,
                  type the confirmation word shown (DELETE in English, SUPPRIMER in French),
                  and choose Delete my account.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The account is deleted as soon as you confirm. You are signed out and the
                sign-in stops working. There is no waiting period and no way to restore the
                account afterwards.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Ask us to delete it</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you cannot sign in, or you no longer have the app, email{" "}
                <a className="underline" href={"mailto:" + PRIVACY_EMAIL}>
                  {PRIVACY_EMAIL}
                </a>{" "}
                from the email address on the account and ask for the account to be deleted.
                We check that the request comes from the account holder before deleting
                anything, and we act on it within the time set out in our{" "}
                <Link className="underline" to="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You can use the same address to ask for part of your data to be removed
                without closing the account. Individual contacts, deals, tasks, listings and
                documents can also be deleted one at a time inside Realtor Desk.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What is deleted</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Deleting your account removes all of the following from our database and
                file storage immediately:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
                {DELETED.map((d) => (
                  <li key={d.what}>
                    <strong className="text-foreground">{d.what}.</strong> {d.detail}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Your subscription</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have a subscription or a trial, it is cancelled immediately, before
                anything is deleted, and you are not billed again. Access ends at once,
                including any time left in the current billing period. If the subscription
                cannot be cancelled, the deletion stops and the account is left as it was,
                so that an account is never removed while it is still being charged.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What is kept, and for how long</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">
                    Data kept after an account is deleted, the reason, and the retention period.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Kept</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Why</th>
                      <th scope="col" className="py-2 font-semibold">How long</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KEPT.map((k) => (
                      <tr key={k.what} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{k.what}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{k.why}</td>
                        <td className="py-3 text-muted-foreground">{k.howLong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">What deleting your account does not cover</h2>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <strong className="text-foreground">Website forms.</strong> A demo
                  request, a contact-form message or a guide sign-up sent through this
                  website is not part of an account. To have one removed, email{" "}
                  <a className="underline" href={"mailto:" + PRIVACY_EMAIL}>
                    {PRIVACY_EMAIL}
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-foreground">Your Google account.</strong> We
                  delete the access tokens we stored, so Realtor Desk can no longer reach
                  your calendar. Realtor Desk may still be listed among the connected apps
                  in your Google account until you remove it there.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Brainfy AI Inc., Edmonton, Alberta, Canada. Privacy requests:{" "}
                <a className="underline" href={"mailto:" + PRIVACY_EMAIL}>
                  {PRIVACY_EMAIL}
                </a>
                . How we handle personal information in general is in the{" "}
                <Link className="underline" to="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AccountDeletion;
