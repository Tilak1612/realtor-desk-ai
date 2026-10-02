import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /features/import-contacts — the strategist's top-ranked gap.
//
// WHY THIS PAGE EXISTS. Switching cost is the biggest objection for anyone moving
// from a spreadsheet or another CRM, and nothing owned the query. The only
// coverage was a paragraph buried inside the per-vendor "moving from X" pages.
// Those pages are about a vendor; this one is about the feature, which is a
// different intent ("import contacts into a CRM from Excel or CSV").
//
// EVERY STATEMENT BELOW IS READ FROM THE CODE, 2026-10-02:
//   accepted headers, name splitting, tag separator, source default, extras kept
//     as metadata, rows dropped          src/lib/csvImport.ts (mapRowToContact)
//   CSV only, one-pass insert, result count, skipped rows counted as errors
//                                         src/components/contacts/ImportContactsModal.tsx
//   no consent in the payload            ContactImportPayload has no consent fields
//   no merging of duplicates             rows are inserted as they are
// It does NOT claim: Google or Microsoft contact import (coming_soon in the
// integration hub), a column-mapping step (there is none), de-duplication,
// import of deals, notes history or conversations, or any "free migration
// service". Those are the things a buyer would otherwise assume.

const FIELDS: { field: string; headers: string }[] = [
  { field: "First name", headers: "first name, firstname, given name" },
  { field: "Last name", headers: "last name, lastname, family name, surname" },
  { field: "Full name", headers: "full name, name, contact name, display name. Split on the first space when there is no first or last name" },
  { field: "Email", headers: "email, email address, e-mail, emailaddress" },
  { field: "Phone", headers: "phone, mobile, phone number, mobile phone, cell, cell phone, telephone" },
  { field: "Source", headers: "source, lead source. Defaults to an import label when blank" },
  { field: "Tags", headers: "tags, labels. Separate several tags with semicolons" },
];

const KEPT_AS_NOTES = [
  "Company name (company, organization, employer)",
  "Company website (domain, website)",
  "Job title (title, position, role)",
  "Notes (notes, comments, description)",
  "The original full name, when it was split into first and last",
];

const NOT_DONE = [
  "Record consent. Imported contacts carry no consent date or source.",
  "Merge duplicates. Rows are inserted as they are, so clean the file first.",
  "Bring over deals, conversations or automations. A CSV creates contacts only.",
  "Read Google or Microsoft contacts directly. Those connections are not live.",
  "Offer a column-mapping screen. Headers are matched by name, so rename a column if it is not recognised.",
];

const FAQS = [
  {
    q: "What file formats can I import?",
    a: "CSV only. Export your spreadsheet or your old CRM's contacts as a CSV and upload that. The importer copes with quoted fields that contain commas, the byte-order mark Excel adds, and Windows or mixed line endings.",
  },
  {
    q: "Do my column names have to match exactly?",
    a: "No, but they have to be close. Headers are matched by name after lower-casing and replacing spaces and punctuation, so \"First Name\", \"first_name\" and \"FIRSTNAME\" all work. There is no mapping screen, so if a column is not recognised, rename it in the file before you import.",
  },
  {
    q: "What happens to columns it does not recognise?",
    a: "Company, website, job title and notes are kept in the contact's metadata rather than dropped. Any other column is not imported.",
  },
  {
    q: "Are imported contacts ready to email?",
    a: "No. The import does not capture consent, and under CASL the burden of proving consent is on you. Record the date and source of consent for each contact before you email it, and only for contacts you have a basis to message.",
  },
  {
    q: "Does it remove duplicates?",
    a: "No. It inserts rows as they are and does not merge them, so a contact that appears twice in your file will be created twice. De-duplicate in your spreadsheet first, and import a file once.",
  },
  {
    q: "How will I know what went in?",
    a: "When the import finishes it reports how many rows were imported and how many were not. Rows with neither a name nor an email are skipped, and skipped rows are counted among the errors.",
  },
];

const ImportContacts = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Import Contacts From a CSV or Another CRM"
        description="Import contacts into Realtor Desk from any CSV: the columns it recognises, what is kept in metadata, what is skipped, and why consent is not imported."
        keywords="import contacts into CRM, CSV import real estate CRM, move contacts from spreadsheet to CRM, import contacts from Excel, switch real estate CRM"
        canonicalUrl="https://www.realtordesk.ai/features/import-contacts"
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
              <Link to="/features" className="hover:underline">
                Platform
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Import contacts</span>
            </nav>
            <h1 className="mb-6">Import your contacts from a spreadsheet or another CRM</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Export a CSV, upload it, and your contacts are in. This page lists exactly
              which columns the importer reads, what it keeps, and what it does not do, so you can prepare the file before you start.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">Short answer</h2>
              <p className="text-base mb-0">
                Realtor Desk imports contacts from a CSV file. It reads names, email,
                phone, source and tags, keeps company, job title and notes in the contact's metadata,
                and skips rows with no name and no email. It does not import consent,
                merge duplicates or bring over deals, so clean the file first and record
                consent afterwards.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">The columns it reads</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Headers are matched by name, ignoring case, spaces and punctuation, so
                &ldquo;First Name&rdquo; and <code>first_name</code> are the same column.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">Contact fields and the CSV headers recognised for each.</caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Field</th>
                      <th scope="col" className="py-2 font-semibold">Headers it recognises</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIELDS.map((f) => (
                      <tr key={f.field} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{f.field}</th>
                        <td className="py-3 text-muted-foreground">{f.headers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">What is kept in the contact's metadata</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These have no dedicated field, so the importer stores them in the contact's metadata rather than dropping them:
              </p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                {KEPT_AS_NOTES.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                A column that matches none of the above is not imported.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What it does not do</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                {NOT_DONE.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Before you import</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">De-duplicate the file.</strong> Sort
                  by email and remove repeats, because the importer will not.
                </li>
                <li>
                  <strong className="text-foreground">Check the headers.</strong> Rename
                  any column that does not match the table above.
                </li>
                <li>
                  <strong className="text-foreground">Try twenty rows first.</strong> See how
                  they land, then import the rest.
                </li>
                <li>
                  <strong className="text-foreground">Record consent afterwards.</strong>{" "}
                  Our{" "}
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
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <div>
              <h2 className="mb-4">Related</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <Link to="/resources/real-estate-crm-template" className="underline">
                    A free CRM spreadsheet template
                  </Link>{" "}
                  to start from.
                </li>
                <li>
                  <Link to="/switch-from-follow-up-boss" className="underline">
                    Moving from Follow Up Boss
                  </Link>{" "}
                  and{" "}
                  <Link to="/switch-from-liondesk" className="underline">
                    from LionDesk
                  </Link>
                  .
                </li>
                <li>
                  <Link to="/features/listing-import" className="underline">
                    Importing listings from Realtor.ca
                  </Link>
                  , which is a separate importer.
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Try it with twenty contacts</h2>
              <p className="text-muted-foreground mb-6">
                14 days, then CAD $149 a month. A card is collected up front and nothing is
                charged before day 14.
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

export default ImportContacts;
