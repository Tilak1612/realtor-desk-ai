import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Languages, ListChecks, DollarSign, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: "The
// $20/Month Upgrade That Pays for Itself" with its "6-8 deals / extra closes
// per year" and "$60K+ additional revenue" cards (invented outcomes; the price
// gap is not $20 either), "AI-powered lead conversion", "CASL-aware email",
// "engagement-based lead ranking" and the IXACT price, which this page quoted
// with no source (the sourced figure is on /vs/ixact). Added the list of what
// Realtor Desk does not have.
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so every migration offer was removed. Gone:
// the migration offer in the description, in the closing heading and in the
// sentence under it that said Realtor Desk staff would move the IXACT data
// (the trial and money-back sentences around it are unchanged). Replaced with
// the true process, read from
// src/lib/csvImport.ts and the import modal: the agent exports a CSV and
// imports it themselves; it creates contacts only, with no consent and no
// duplicate merging.

const SwitchFromIxact = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from IXACT to Realtor Desk"
        description="Moving from IXACT to Realtor Desk by a CSV you import yourself: French per contact, a consent record and a rule-based lead score. Solo plan $149/mo CAD."
        keywords="switch from IXACT, IXACT migration, IXACT alternative, CRM for Canadian realtors"
        canonicalUrl="https://www.realtordesk.ai/switch-from-ixact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from IXACT to Realtor Desk",
            "description": "Moving from IXACT to Realtor Desk by a CSV you import yourself: French per contact, a consent record and a rule-based lead score. Solo plan $149/mo CAD."
          }
        ]}
      />
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">Switching from IXACT</Badge>
          <h1 className="mb-6">Moving from IXACT <span className="gradient-text">to Realtor Desk</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Realtor Desk is $149/mo CAD for a single agent, with a 14-day free trial. On the
            list price we read on ixactcontact.com on 9 September 2026, Realtor Desk costs more.
            Check IXACT&rsquo;s own pricing page for what you pay today.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            We build one of the products compared here, so weigh this accordingly. The{" "}
            <Link to="/vs/ixact" className="underline">comparison page</Link>{" "}
            has the IXACT figure we read, its source and the date.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-8">What the higher price buys</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8"><DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">$149/mo</div><p className="text-sm text-muted-foreground">Solo plan, CAD, billed monthly</p></Card>
            <Card className="p-8"><Languages className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">French per contact</div><p className="text-sm text-muted-foreground">The interface and client email both work in French</p></Card>
            <Card className="p-8"><ListChecks className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">A lead score</div><p className="text-sm text-muted-foreground">Rule-based, from 0 to 100, with a visible breakdown</p></Card>
          </div>

          <div className="text-left max-w-3xl mx-auto mt-12">
            <h3 className="text-lg font-semibold mb-2">What you give up</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Check this list against what you use in IXACT today.
            </p>
            <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
              <li>No automated email sequences. A sequence builder exists, but scheduled sending is not switched on.</li>
              <li>No transaction management, e-signature or document storage.</li>
              <li>No lead-facing chatbot, automatic replies or voice agent.</li>
              <li>No native mobile app. It is a responsive web app.</li>
              <li>Consent records are not carried in by the CSV import, and duplicates are not merged.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 text-rd-terra-800 mx-auto mb-6" />
          <h2 className="mb-6">14 Days Free Trial</h2>
          <p className="text-lg text-muted-foreground mb-8">Try free for 14 days. You bring your IXACT contacts in yourself, by CSV. A 30-day money-back guarantee applies after that.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
            <Link to="/vs/ixact"><Button size="lg" variant="outline">See Comparison</Button></Link>
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
            from IXACT Contact as a CSV file, then upload that file in Realtor
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
            documents and anything specific to IXACT Contact&rsquo;s own data
            model. The import creates contacts only. Keep your IXACT Contact
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
            <li>Export your contacts from IXACT Contact and keep an untouched copy of that file.</li>
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

export default SwitchFromIxact;