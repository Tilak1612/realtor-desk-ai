import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /resources/open-house-sign-in-sheet-template — written 2026-10-12.
//
// WHY THIS PAGE EXISTS. "open house sign in sheet" is searched about 4,400 times
// a month in the United States and 320 in Canada at a keyword difficulty of 0,
// and "open house sign in sheet template" adds more. The searcher wants a sheet
// to print tonight. The existing blog post
// (/blog/open-house-digital-sign-in-sheets-vs-paper-2025) compares paper with
// digital and holds no sheet; this page is the sheet. The two link to each other
// and do not repeat each other.
//
// THE FILES ARE REAL. public/downloads/open-house-sign-in-sheet.pdf (two pages:
// the sheet, and a how-to for the agent) is rendered from
// scripts/assets/open-house-sign-in-sheet.html; public/downloads/
// open-house-sign-in-sheet.csv has the same columns. COLUMNS below is the sheet.
// If the PDF changes, change this page; the test in
// src/test/content/openHouseSheet.test.ts checks the files exist and the CSV
// header matches.
//
// CONSENT WORDING. What a request for express consent must contain comes from
// section 4 of the Electronic Commerce Protection Regulations (CRTC),
// SOR/2012-36, read on the Justice Laws website on 12 October 2026: the name of
// the person seeking consent, a mailing address and one of a phone number, an
// email address or a web address, and a statement that consent can be withdrawn.
// The onus of proof is section 13 of the Act. The sheet is a starting point and
// the page says it is not legal advice.
//
// IMPORT STATEMENTS are read from src/lib/csvImport.ts: first name, last name,
// email, phone, source and tags are imported, notes are kept in metadata, and
// the three other columns are not imported. Consent is never imported.

const PDF_HREF = "/downloads/open-house-sign-in-sheet.pdf";
const CSV_HREF = "/downloads/open-house-sign-in-sheet.csv";

const COLUMNS: { column: string; why: string }[] = [
  { column: "Name", why: "So you know who visited, and so the seller can be told how many people came through." },
  { column: "Email", why: "Optional for the visitor. You may only write to it on a basis the law allows." },
  { column: "Phone", why: "Optional. Useful when a visitor asks you to call about the property." },
  { column: "Working with an agent? (Y / N)", why: "Tells you whose client this is before you follow up." },
  { column: "Yes, email me (tick box)", why: "The visitor's express consent to marketing email. Empty unless they tick it." },
];

const HEADER: { field: string; why: string }[] = [
  { field: "Property address and date", why: "Ties each signature to one open house." },
  { field: "Agent and brokerage", why: "A request for consent has to name who is asking." },
  { field: "Mailing address", why: "Required in a request for consent." },
  { field: "Phone or email", why: "A request for consent has to give a phone number, an email address or a web address." },
];

const FAQS = [
  {
    q: "What should an open house sign-in sheet include?",
    a: "The property address and date at the top, then a row per visitor with name, email, phone and whether they are already working with an agent. If you plan to email visitors afterwards, add a box they tick to agree, with a sentence above it saying who will write, about what, and that they can withdraw.",
  },
  {
    q: "Is this open house sign-in sheet free?",
    a: "Yes. The PDF and the CSV download directly from this page. There is no form to fill in and no email address to give. Print as many copies as you need and change the wording to suit your brokerage.",
  },
  {
    q: "Can I email everyone who signs the sheet?",
    a: "Not on the strength of the signature alone. In Canada you need consent to send a commercial email. A ticked box that meets the requirements is express consent. A visitor who asked you about the property has made an inquiry, which supports implied consent for six months. A bare name and address is neither.",
  },
  {
    q: "Do visitors have to sign in at an open house?",
    a: "Nothing in the anti-spam law requires it. Whether signing in is a condition of entry is a matter for the seller, the brokerage and local rules. The sheet on this page says signing in is optional, and you can change that line.",
  },
  {
    q: "How do I get the sheet into my CRM?",
    a: "Type the rows into the CSV and import it. Realtor Desk reads first name, last name, email, phone, source and tags, and keeps notes in the contact's metadata. It does not import the consent columns, so record the consent date and source on each contact who ticked the box.",
  },
  {
    q: "Does the sheet work in the United States?",
    a: "The layout does. The consent sentence follows Canadian law. The United States has its own rules for marketing email and stricter ones for texts and calls, so check those and adjust the wording before you rely on it there.",
  },
];

const OpenHouseSignInSheetTemplate = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Open House Sign-In Sheet Template (PDF)"
        description="A free printable open house sign-in sheet: PDF and CSV, no signup. Name, email, phone, agent status and a consent tick box, with the wording explained."
        keywords="open house sign in sheet, open house sign in sheet template, open house sign in sheet pdf, printable open house sign in sheet, free open house sign in sheet"
        canonicalUrl="https://www.realtordesk.ai/resources/open-house-sign-in-sheet-template"
        structuredData={[
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
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/resources" className="hover:underline">
                Resources
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Open house sign-in sheet</span>
            </nav>
            <h1 className="mb-6">Open house sign-in sheet template</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A one-page sheet you can print tonight, with twelve rows and a tick box for
              visitors who want to hear from you. Free, no signup. A matching CSV is there for
              typing the names in afterwards.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild size="lg">
                <a href={PDF_HREF} download>
                  Download the sheet (PDF)
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={CSV_HREF} download>
                  Download the CSV
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Letter size, two pages: the sheet, and a page of notes for you. Print page one
              for visitors.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What is on the sheet</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Five columns, kept to what you will use afterwards.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">Columns on the open house sign-in sheet and why each is there.</caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Column</th>
                      <th scope="col" className="py-2 font-semibold">Why it is there</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COLUMNS.map((c) => (
                      <tr key={c.column} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{c.column}</th>
                        <td className="py-3 text-muted-foreground">{c.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">The lines at the top</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fill these in before the first visitor arrives. They are what makes the tick box
                a proper request for consent.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">Header fields on the sheet and why each is needed.</caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Line</th>
                      <th scope="col" className="py-2 font-semibold">Why it is there</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEADER.map((h) => (
                      <tr key={h.field} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{h.field}</th>
                        <td className="py-3 text-muted-foreground">{h.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">The consent sentence</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the wording printed above the rows:
              </p>
              <Card className="p-6">
                <p className="text-base mb-0">
                  Would you like to hear from us by email? Tick Yes in the last column to agree
                  to receive emails about this property and similar homes from the agent and
                  brokerage named above. You can withdraw your consent at any time by replying
                  to any email or by contacting us at the details above. Leaving the box empty
                  is fine.
                </p>
              </Card>
              <p className="text-muted-foreground leading-relaxed mt-4">
                In Canada, the regulations under the anti-spam law say a request for consent
                must name the person asking, give a mailing address and a phone number, email
                address or web address, and state that consent can be withdrawn. The sentence
                and the lines at the top cover those points together. The sender has the onus of
                proving consent, so keep the paper. This is a starting point and not legal
                advice; your brokerage may have its own wording.
              </p>
            </div>

            <div>
              <h2 className="mb-4">After the open house</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">Type the rows in the same day.</strong>{" "}
                  Handwriting is easier to read while you still remember the faces.
                </li>
                <li>
                  <strong className="text-foreground">Import the CSV.</strong> In Realtor Desk,
                  first name, last name, email, phone, source and tags are imported and notes
                  are kept in the contact&rsquo;s metadata. The agent and consent columns are
                  not imported. See{" "}
                  <Link to="/features/import-contacts" className="underline">
                    importing contacts
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-foreground">Record consent by hand.</strong> For each
                  person who ticked Yes, set the consent date and the source on the contact.
                </li>
                <li>
                  <strong className="text-foreground">Leave the others off your list.</strong>{" "}
                  If someone asked you about the property, that inquiry supports implied consent
                  for six months. The{" "}
                  <Link to="/resources/casl-implied-consent-calculator" className="underline">
                    implied consent calculator
                  </Link>{" "}
                  gives you the date.
                </li>
                <li>
                  <strong className="text-foreground">File the sheet.</strong> It is your record.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="mb-4">Paper or a tablet</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paper needs no setup and no battery, and has to be typed in afterwards. A form on
                a tablet gives you clean data straight away and is one more thing to set up. Our{" "}
                <Link to="/blog/open-house-digital-sign-in-sheets-vs-paper-2025" className="underline">
                  comparison of digital and paper sign-in
                </Link>{" "}
                goes through the trade-offs. Realtor Desk has no sign-in kiosk of its own:
                contacts arrive by manual entry, by CSV import or by a webhook from a form tool.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <div>
              <h2 className="mb-4">Related</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <Link to="/blog/real-estate-drip-campaign-templates-canada-2025" className="underline">
                    Email templates for following up
                  </Link>
                  , including an open house sequence.
                </li>
                <li>
                  <Link to="/resources/real-estate-crm-template" className="underline">
                    A free CRM spreadsheet template
                  </Link>{" "}
                  for tracking the leads afterwards.
                </li>
                <li>
                  <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">
                    CASL for real estate email
                  </Link>
                  .
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Somewhere to put the names</h2>
              <p className="text-muted-foreground mb-6">
                Realtor Desk keeps each contact with its consent date and its next follow-up.
                14-day trial; a card is collected up front and nothing is charged before day 14.
                Then CAD $149 a month.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Start free trial</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/demo">Book a demo</Link>
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

export default OpenHouseSignInSheetTemplate;
