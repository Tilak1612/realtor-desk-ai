import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DollarSign, Languages, ListChecks, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: the claim
// that Wise Agent prices in US dollars and "can't provide" Canadian features
// (no source on the page), "Toronto/Vancouver/Calgary market intelligence",
// "Predictive intelligence", "Canadian compliance and AI automation", the
// "Canadian support team" and the dated CREA DDF promise. Added the list of
// what Realtor Desk does not have, since the description promises it.
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so the migration offer under the closing
// heading was removed. The CSV section now says the agent runs the
// import themselves and states its limits as read from src/lib/csvImport.ts
// and the import modal: contacts only, no consent, no duplicate merging.

const SwitchFromWiseAgent = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from Wise Agent to Realtor Desk"
        description="Moving from Wise Agent to Realtor Desk: CAD pricing, French per contact and a consent record on each contact. What moves in a CSV, and what you give up."
        keywords="switch from Wise Agent, Wise Agent alternative Canada, Canadian real estate CRM, Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/switch-from-wise-agent"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from Wise Agent to Realtor Desk",
            "description": "Moving from Wise Agent to Realtor Desk: CAD pricing, French per contact and a consent record on each contact. What moves in a CSV, and what you give up."
          }
        ]}
      />
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <div className="text-4xl mb-4">🇨🇦</div>
          <h1 className="mb-6">Moving from Wise Agent <span className="gradient-text">to Realtor Desk</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">Realtor Desk is a CRM for a single Canadian agent: CAD $149 a month, French or English set per contact, and the date and source of consent recorded on each contact.</p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">We build one of the products compared here, so weigh this accordingly. This page does not state Wise Agent&rsquo;s features or prices; check its own site for those.</p>
          <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What you would be moving to</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center"><DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><h3 className="font-bold mb-2">Priced in CAD</h3><p className="text-sm text-muted-foreground">CAD $149 a month for a single agent</p></Card>
            <Card className="p-6 text-center"><Languages className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><h3 className="font-bold mb-2">French per contact</h3><p className="text-sm text-muted-foreground">The interface and client email both work in French</p></Card>
            <Card className="p-6 text-center"><ListChecks className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><h3 className="font-bold mb-2">A rule-based lead score</h3><p className="text-sm text-muted-foreground">From 0 to 100, with a visible breakdown</p></Card>
          </div>

          <h3 className="text-lg font-semibold mt-12 mb-2">What you give up</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Realtor Desk is a smaller product than a full real estate platform. Check this list against what you use in Wise Agent today.
          </p>
          <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
            <li>No transaction management, e-signature or document storage.</li>
            <li>No automated email sequences. A sequence builder exists, but scheduled sending is not switched on.</li>
            <li>No lead-facing chatbot, automatic replies or voice agent.</li>
            <li>No seats, lead routing or shared pipeline. It is built for one agent.</li>
            <li>No native mobile app. It is a responsive web app.</li>
            <li>Native CREA DDF® sync is on the roadmap and is not live yet.</li>
          </ul>
        </div>
      </section>
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 text-rd-terra-800 mx-auto mb-6" />
          <h2 className="mb-6">Try it before you move anything</h2>
          <p className="text-lg text-muted-foreground mb-8">14 Days Free Trial • You import your own contacts by CSV</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
            <Link to="/vs/wise-agent"><Button size="lg" variant="outline">See Comparison</Button></Link>
          </div>
        </div>
      </section>
      {/* The SEO report keeps the switch-from pages only where they carry real
          substance about the move — supported fields, what does not come
          across, and how to test — rather than boilerplate. This is that,
          verified against src/lib/csvImport.ts rather than described from
          memory. The agent runs the import; Realtor Desk has no migration
          service. */}
      <section className="section-padding border-t">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6">What actually moves across</h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            The move is a CSV import that you run yourself. Export your contacts
            from Wise Agent as a CSV file, then upload that file in Realtor
            Desk. The importer reads the header row and matches English column
            names such as &ldquo;first name&rdquo;, &ldquo;email&rdquo; and
            &ldquo;phone&rdquo;. There is no column-mapping screen, so rename a
            column in the file if it is not recognised. The{" "}
            <Link to="/features/import-contacts" className="underline">import documentation</Link>{" "}
            lists every header it accepts.
          </p>

          <h3 className="text-lg font-semibold mb-2">Columns it recognises</h3>
          <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5 mb-6">
            <li>
              <strong>Email</strong> — <code>email</code>, <code>email_address</code>,
              <code>e_mail</code> or <code>emailaddress</code>
            </li>
            <li>
              <strong>Phone</strong> — <code>phone</code>, <code>mobile</code>,
              <code>cell</code>, <code>telephone</code> and the usual variants
            </li>
            <li>
              <strong>Name</strong> — <code>first_name</code> and <code>last_name</code>,
              or a single <code>full_name</code> / <code>name</code> column, which is
              split on the first space
            </li>
            <li>
              <strong>Source</strong> — <code>source</code> or <code>lead_source</code>;
              rows with neither are tagged <code>csv_import</code>
            </li>
            <li>
              <strong>Tags</strong> — <code>tags</code> or <code>labels</code>, separated
              by semicolons
            </li>
            <li>
              <strong>Company, website, job title, notes</strong> — kept in the
              contact&rsquo;s metadata. Any other column is not imported
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Rows with neither a name nor an email are skipped.
          </p>

          <h3 className="text-lg font-semibold mb-2">What does not come across</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Deals, conversations, message and call history, automations, tasks,
            documents and anything specific to Wise Agent&rsquo;s own data
            model. The import creates contacts only. Keep your Wise Agent
            exports for your records and rebuild any live deals in the pipeline
            by hand.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Duplicates are not merged. A contact that appears twice in the file
            is created twice, so de-duplicate the file in a spreadsheet before
            you import it, and import it once.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Consent is not imported. Under CASL you must record the date and
            source of consent for each contact before you email them. Our{" "}
            <Link
              to="/resources/casl-compliance-real-estate-email-marketing-canada"
              className="underline"
            >
              CASL guide for real estate email
            </Link>{" "}
            explains the consent windows.
          </p>

          <h3 className="text-lg font-semibold mb-2">Test it before you commit</h3>
          <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5 mb-6">
            <li>Export your contacts from Wise Agent and keep an untouched copy of that file.</li>
            <li>De-duplicate the file in a spreadsheet.</li>
            <li>Cut the first twenty rows into a separate CSV and import those.</li>
            <li>
              Open three of them and check the name split, the phone format and
              whether the tags landed where you expected.
            </li>
            <li>Only then import the rest.</li>
            <li>Record the date and source of consent on each contact before you email them.</li>
          </ol>

          <h3 className="text-lg font-semibold mb-2">Getting back out</h3>
          <p className="text-muted-foreground leading-relaxed">
            You can export your contacts to a CSV yourself from the Contacts
            page. That is worth checking on any CRM you are
            considering, including this one — a product that makes leaving hard
            is telling you something. See{" "}
            <Link to="/pricing" className="underline">pricing and trial terms</Link>{" "}
            or <Link to="/features" className="underline">what the CRM does</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SwitchFromWiseAgent;