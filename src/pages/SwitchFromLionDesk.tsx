import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /switch-from-liondesk — rewritten 2026-10-02.
//
// The previous version was written while LionDesk was still running and was
// never updated: "LionDesk Shutting Down — September 2025", "migrate before the
// deadline", "don't wait until the last minute", a countdown badge, and a
// feature table scoring a product that no longer exists. That is more than a
// year stale, and it also promised "free data migration done by our team within
// 24 hours" and "30 days of free hands-on support", neither of which the product
// or the repo supports.
//
// WHAT THIS PAGE CLAIMS, AND WHERE EACH CLAIM COMES FROM
//   LionDesk's end                 Inman, 2025-05-16 (linked). The vendor
//                                  announced the wind-down, kept the software
//                                  up through September 2025, and offered
//                                  Lone Wolf Relationships.
//   what a CSV import accepts      src/lib/csvImport.ts, read 2026-10-02:
//                                  quoted fields, BOM, CRLF, header variants,
//                                  full_name-only files, unrecognised columns
//                                  kept as metadata, source defaulting to
//                                  "csv_import", semicolon-separated tags, rows
//                                  with no name and no email skipped.
//   imports carry no consent       the import payload has no consent fields.
//   price                          /pricing, unchanged.
//
// There is deliberately no feature-by-feature table. LionDesk cannot be
// evaluated any more, and a column of unsourced ticks against a discontinued
// product helps nobody.

const FAQS = [
  {
    q: "Is LionDesk still available?",
    a: "No. Lone Wolf Technologies announced in May 2025 that it was winding LionDesk down, kept the software available through September 2025, and offered customers Lone Wolf Relationships. If a page still says LionDesk is about to shut down, it was written before then.",
  },
  {
    q: "Can I move my LionDesk contacts into Realtor Desk?",
    a: "Yes, by CSV. Export your contacts from wherever they now live and import the file. The importer reads first and last name or a single full name, email, phone, source and tags, keeps any extra columns as notes on the record, and skips rows that have neither a name nor an email.",
  },
  {
    q: "Are imported contacts ready to email?",
    a: "No. The import creates contacts but does not record consent, and under CASL the burden of proving consent is on you. Record the date and source of consent for each contact before you email them, and only for contacts you actually have a basis to message.",
  },
  {
    q: "Does the import bring my deals and message history?",
    a: "No. A CSV import creates contacts. It does not recreate deals, conversations or automations, so keep your old exports for your records and rebuild any live deals in the pipeline.",
  },
  {
    q: "Is Realtor Desk a like-for-like replacement?",
    a: "Not necessarily. Compare it with what you actually used. Realtor Desk is a single-agent CRM with no seats, no native mobile app (it is a responsive web app), and no automated email sequences. If you relied on any of those, check before you move.",
  },
];

const SwitchFromLionDesk = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from LionDesk to Realtor Desk"
        description="LionDesk was discontinued in September 2025. How to move your contacts into Realtor Desk by CSV, what does not come across, and what to check first."
        keywords="LionDesk alternative Canada, LionDesk discontinued, switch from LionDesk, LionDesk replacement, LionDesk migration, Lone Wolf Relationships alternative"
        canonicalUrl="https://www.realtordesk.ai/switch-from-liondesk"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Switch from LionDesk to Realtor Desk",
            description:
              "LionDesk was discontinued in September 2025. How to move contacts into Realtor Desk by CSV and what to check first.",
            url: "https://www.realtordesk.ai/switch-from-liondesk",
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
            <h1 className="mb-6">Moving from LionDesk to Realtor Desk</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              LionDesk was discontinued in September 2025. If your contacts are
              still waiting for a new home, this page covers what happened, your
              options, and exactly how a CSV move into Realtor Desk works.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What happened to LionDesk</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Lone Wolf Technologies, which bought LionDesk in 2021, announced in
                May 2025 that it was winding the product down. The software stayed
                available through September 2025 and customers were offered{" "}
                <strong>Lone Wolf Relationships</strong>, the company&rsquo;s own
                CRM. The announcement was reported by{" "}
                <a
                  className="underline"
                  href="https://www.inman.com/2025/05/16/lone-wolf-technologies-to-wind-down-popular-liondesk-crm/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Inman
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-4">Your options</h2>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <strong className="text-foreground">Lone Wolf Relationships.</strong>{" "}
                  The vendor&rsquo;s own offer, and the path of least resistance
                  if you were happy with LionDesk.
                </li>
                <li>
                  <strong className="text-foreground">Another CRM.</strong> Our{" "}
                  <Link className="underline" to="/blog/best-crm-canada-2025">
                    guide to choosing a CRM in Canada
                  </Link>{" "}
                  lists what several vendors publish on price and trial, and our{" "}
                  <Link className="underline" to="/compare">
                    comparison hub
                  </Link>{" "}
                  covers them one at a time.
                </li>
                <li>
                  <strong className="text-foreground">Realtor Desk.</strong> CAD
                  $149 a month for a single agent, French set per contact, and a
                  database that runs in Canada. It suits a solo agent who wants
                  those things. It is not the cheapest option, and it is the wrong
                  choice for a team that needs seats.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">How a CSV move works</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">Export your contacts</strong>{" "}
                  from wherever they are now, as a CSV.
                </li>
                <li>
                  <strong className="text-foreground">Import the file.</strong> The
                  importer copes with quoted fields, the byte-order mark Excel adds,
                  mixed line endings, and header variants such as &ldquo;First
                  name&rdquo; against <code>first_name</code>. A file with only a
                  full name is split into first and last.
                </li>
                <li>
                  <strong className="text-foreground">Check what landed.</strong>{" "}
                  Columns it does not recognise are kept as notes on the record,
                  tags separated by semicolons become tags, the source defaults to
                  an import label, and rows with neither a name nor an email are
                  skipped.
                </li>
                <li>
                  <strong className="text-foreground">Record consent before you email.</strong>{" "}
                  The import does not capture it, and under CASL proving consent
                  is your responsibility. Our{" "}
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
              <h2 className="mb-4">What does not come across</h2>
              <p className="text-muted-foreground leading-relaxed">
                A CSV import creates contacts. It does not recreate deals,
                conversations or automations, and Realtor Desk has no native mobile
                app and no automated email sequences today. If you depended on any
                of those, check before you move. The{" "}
                <Link className="underline" to="/roadmap">
                  roadmap
                </Link>{" "}
                marks what is live and what is not.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Try it with a small file first</h2>
              <p className="text-muted-foreground mb-6">
                Import twenty contacts and see how they land. The trial is 14 days,
                a card is collected up front, and nothing is charged before day 14.
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

export default SwitchFromLionDesk;
