import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /switch-from-follow-up-boss — rewritten 2026-10-02.
//
// The previous version said Follow Up Boss "requires expensive add-ons for AI
// chatbots (Structurely ~$499/mo)", that Realtor Desk's "24/7 bilingual AI
// chatbot is built in and powered by Claude", that "no Structurely, no Ylopo, no
// extra monthly bill" applies, and that Realtor Desk "gives you everything
// Follow Up Boss doesn't". There is no lead-facing chatbot, the Structurely
// price was never sourced, and Follow Up Boss lists lead routing, a team inbox,
// calling and 250+ integrations, none of which Realtor Desk has.
//
// WHAT THIS PAGE CLAIMS, AND FROM WHERE
//   Follow Up Boss features / pricing   followupboss.com and /pricing, read
//                                       2026-10-02 (linked in the body).
//   what a CSV import accepts           src/lib/csvImport.ts, read 2026-10-02.
//   imports carry no consent            the import payload has no consent fields.
//   Realtor Desk price and trial        /pricing, unchanged.
//
// INTENT. /blog/vs-follow-up-boss is the side-by-side. This page is how to move.

const GIVE_UP: { feature: string; fub: string; rd: string }[] = [
  { feature: "Lead routing and a team inbox", fub: "Listed", rd: "Not available: no seats, assignment or shared pipeline" },
  { feature: "Calling", fub: "Listed (add-on on the Grow plan)", rd: "Not available" },
  { feature: "Texting", fub: "Listed", rd: "Available through Twilio, only to numbers with a recorded consent" },
  { feature: "Automations", fub: "Listed", rd: "A sequence builder exists; scheduled sending is not switched on" },
  { feature: "Integrations", fub: "250+ listed", rd: "Zapier, Make, n8n, Twilio and SMTP" },
  { feature: "Mobile apps", fub: "Listed", rd: "A responsive web app, no native app" },
];

const FAQS = [
  {
    q: "Can I move my Follow Up Boss contacts into Realtor Desk?",
    a: "Yes, by CSV, if your plan lets you export them. Import the file into Realtor Desk. It reads first and last name or a single full name, email, phone, source and tags, keeps company, job title and notes in the contact's metadata, and skips rows that have neither a name nor an email.",
  },
  {
    q: "Are imported contacts ready to email?",
    a: "No. The import creates contacts but does not record consent, and under CASL the burden of proving consent is on you. Record the date and source of consent for each contact before you email them.",
  },
  {
    q: "Is Realtor Desk cheaper than Follow Up Boss?",
    a: "Not for one agent, at face value. Follow Up Boss shows its Grow plan at $69 per user a month, in a currency its pricing page does not name, and Realtor Desk is CAD $149. Calling on Grow is an extra $39 per user a month.",
  },
  {
    q: "Does Realtor Desk have lead routing or a team inbox?",
    a: "No. It is a single-agent product with no seats, lead assignment or shared pipeline. If your work depends on those, stay on Follow Up Boss.",
  },
  {
    q: "Do I lose my deals and message history?",
    a: "A CSV import creates contacts only. It does not recreate deals, conversations or automations, so keep your Follow Up Boss exports for your records and rebuild any live deals in the pipeline.",
  },
];

const SwitchFromFollowUpBoss = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from Follow Up Boss to Realtor Desk"
        description="Moving from Follow Up Boss to Realtor Desk: what you give up, how a CSV import works, and what to record before you email an imported contact."
        keywords="Follow Up Boss alternative Canada, switch from Follow Up Boss, Follow Up Boss CSV export, move from Follow Up Boss, Canadian real estate CRM"
        canonicalUrl="https://www.realtordesk.ai/switch-from-follow-up-boss"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Switch from Follow Up Boss to Realtor Desk",
            description:
              "What you give up, how a CSV import works, and what to record before emailing an imported contact.",
            url: "https://www.realtordesk.ai/switch-from-follow-up-boss",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <Navbar />

      <main>
        <section className="pt-32 md:pt-40 pb-10">
          <div className="container-custom max-w-3xl">
            <h1 className="mb-6">Moving from Follow Up Boss to Realtor Desk</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk suits a solo agent who wants French per contact, a consent
              record for CASL and a database in Canada. It does not replace Follow Up
              Boss for a team. This page covers what you would give up and how the
              move works.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What you would give up</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                From Follow Up Boss&rsquo;s own{" "}
                <a className="underline" href="https://www.followupboss.com" rel="noopener noreferrer" target="_blank">
                  homepage
                </a>
                , read October 2, 2026. If your work leans on any of these, stop here.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">
                    Follow Up Boss features against what Realtor Desk offers.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Feature</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Follow Up Boss</th>
                      <th scope="col" className="py-2 font-semibold">Realtor Desk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GIVE_UP.map((r) => (
                      <tr key={r.feature} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.feature}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{r.fub}</td>
                        <td className="py-3 text-muted-foreground">{r.rd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">How a CSV move works</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">Export your contacts</strong> from
                  Follow Up Boss as a CSV, if your plan allows it. Check Follow Up
                  Boss&rsquo;s own help for the steps.
                </li>
                <li>
                  <strong className="text-foreground">Import the file.</strong> The
                  importer copes with quoted fields, the byte-order mark Excel adds,
                  mixed line endings and header variants such as &ldquo;First
                  name&rdquo; against <code>first_name</code>. A file with only a full
                  name is split into first and last.
                </li>
                <li>
                  <strong className="text-foreground">Check what landed.</strong> Company, job title and notes are kept in the contact's metadata, other columns are not imported, tags
                  separated by semicolons become tags, the source defaults to an
                  import label, and rows with neither a name nor an email are
                  skipped.
                </li>
                <li>
                  <strong className="text-foreground">Record consent before you email.</strong>{" "}
                  The import does not capture it, and under CASL proving consent is
                  your responsibility. Our{" "}
                  <Link
                    className="underline"
                    to="/resources/casl-compliance-real-estate-email-marketing-canada"
                  >
                    CASL guide for real estate email
                  </Link>{" "}
                  explains the consent windows.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="mb-4">Price, at face value</h2>
              <p className="text-muted-foreground leading-relaxed">
                Follow Up Boss shows its Grow plan at $69 per user a month, or $58 on
                annual billing, with a 14-day free trial, per its{" "}
                <a className="underline" href="https://followupboss.com/pricing" rel="noopener noreferrer" target="_blank">
                  pricing page
                </a>
                . The page does not name a currency. Realtor Desk is CAD $149 a month
                for a single agent. For one seat Follow Up Boss is the lower figure, so
                the reasons to move are French, consent handling and data location, not
                price. See the{" "}
                <Link className="underline" to="/blog/vs-follow-up-boss">
                  side-by-side comparison
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Try it with a small file first</h2>
              <p className="text-muted-foreground mb-6">
                Import twenty contacts and see how they land. The trial is 14 days, a
                card is collected up front, and nothing is charged before day 14.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Start free trial</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pricing">See pricing</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SwitchFromFollowUpBoss;
