import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Targets "real estate crm excel template" and "real estate crm google
// sheets" (10/mo each in Canada). Small volume, but it is the one new page the
// SEO report sanctions, and only on the condition that a real downloadable
// asset exists — a thin article wrapped around a signup form would be the
// failure mode it warns about.
//
// The file is public/downloads/real-estate-crm-template.csv: 13 columns, three
// synthetic sample rows and 40 blank rows, UTF-8 with a BOM so Excel on
// Windows reads the accented characters. No email gate.

const TEMPLATE_HREF = "/downloads/real-estate-crm-template.csv";

const COLUMNS: [string, string][] = [
  ["Contact name", "One row per person, not per property."],
  ["Email / Phone", "However they actually reply to you."],
  ["Lead source", "Open house, referral, website form, portal. This is the column that tells you where to spend next season."],
  ["Stage", "New, Contacted, Viewing booked, Offer, Closed, Lost. Keep the list short enough that you never hesitate."],
  ["Property interest", "Neighbourhood and type, not a listing ID."],
  ["Budget (CAD)", "A number, so the column sorts."],
  ["Last contact", "YYYY-MM-DD, so it sorts correctly in every spreadsheet."],
  ["Next action", "A verb. “Send three comparables”, not “follow up”."],
  ["Next action date", "The single most useful column in the file. Sort by it every morning."],
  ["Consent to email + date", "Under CASL you need to know whether you may email someone and when they agreed. A blank here means do not add them to a campaign."],
  ["Notes", "Context you would otherwise keep in your head."],
];

const RealEstateCrmTemplate = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate CRM Spreadsheet Template"
        description="A free CSV lead tracker for real estate agents: contacts, stages, next actions and CASL consent. Opens in Excel, Numbers and Google Sheets. No signup."
        keywords="real estate crm excel template, real estate crm google sheets, lead follow-up spreadsheet, real estate lead tracker"
        canonicalUrl="https://www.realtordesk.ai/resources/real-estate-crm-template"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "Real estate CRM spreadsheet template",
            description:
              "A CSV lead tracker for real estate agents covering contacts, lead source, pipeline stage, next action and CASL consent.",
            encodingFormat: "text/csv",
            url: "https://www.realtordesk.ai/resources/real-estate-crm-template",
            isAccessibleForFree: true,
            inLanguage: "en-CA",
            license: "https://www.realtordesk.ai/terms-of-service",
          },
        ]}
      />
      <Navbar />

      <main>
        <section className="pt-32 md:pt-40 pb-10">
          <div className="container-custom max-w-3xl">
            <h1 className="mb-6">Real estate CRM spreadsheet template</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              A single-sheet lead tracker with the columns that actually change what
              you do tomorrow: where the lead came from, what stage it is at, what the
              next action is and when it is due. It opens in Excel, Numbers and Google
              Sheets. No email required.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={TEMPLATE_HREF} download>
                  Download the template (CSV)
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/what-is-a-real-estate-crm">What a CRM adds on top</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What is in the file</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Thirteen columns, three sample rows so you can see the shape, and forty
                blank rows underneath. The samples are invented — delete them.
              </p>
              <dl className="space-y-4">
                {COLUMNS.map(([name, why]) => (
                  <div key={name} className="border-l-2 border-muted pl-4">
                    <dt className="font-semibold text-sm">{name}</dt>
                    <dd className="text-sm text-muted-foreground leading-relaxed">{why}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="mb-4">How to use it in Google Sheets</h2>
              <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>Download the CSV, then in Google Sheets choose File &rarr; Import &rarr; Upload.</li>
                <li>Pick &ldquo;Replace spreadsheet&rdquo; and set the separator to comma.</li>
                <li>Freeze the first row (View &rarr; Freeze &rarr; 1 row).</li>
                <li>
                  Sort by <strong>Next action date</strong>, oldest first. That sort is
                  the whole point of the file.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="mb-4">A note on consent</h2>
              <p className="text-muted-foreground leading-relaxed">
                The consent columns are there because Canada&rsquo;s anti-spam
                legislation applies to a spreadsheet exactly as it applies to software.
                If you cannot point to when someone agreed to hear from you, do not add
                them to a mailing list. Our{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">
                  guide to CASL for real estate email
                </Link>{" "}
                covers what counts as consent.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Where a spreadsheet stops working</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A tracker like this is genuinely fine for a while. It tends to break in
                four specific places:
              </p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>Nothing reminds you. The file only helps on days you open it.</li>
                <li>Email and call history live somewhere else, so context is split.</li>
                <li>Two devices means two versions.</li>
                <li>
                  Consent is a cell you have to remember to fill in, rather than
                  something recorded when it happens.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you hit those, a CRM is the next step —{" "}
                <Link to="/blog/real-estate-crm-buying-guide" className="underline">
                  how to choose one
                </Link>{" "}
                walks through it, and{" "}
                <Link to="/blog/best-crm-canada-2025" className="underline">
                  the Canadian comparison
                </Link>{" "}
                covers the main options.
              </p>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Outgrown the spreadsheet?</h2>
              <p className="text-muted-foreground mb-6">
                Realtor Desk keeps the same columns, adds the reminders, and records
                consent when it happens. Bilingual, hosted in Canada, priced in CAD.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/features">See the features</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pricing">View pricing</Link>
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

export default RealEstateCrmTemplate;
