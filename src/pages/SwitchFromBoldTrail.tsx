import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Upload, Download, ListChecks, ClipboardCheck, CheckCircle } from "lucide-react";
import { SEO } from "@/components/SEO";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: "Switch &
// Save" and the downward-trend arrow (a saving cannot be computed against a
// price BoldTrail does not publish), "Frustrated with BoldTrail? You're Not
// Alone.", "Canadian agents are choosing Realtor Desk over BoldTrail", "better
// AI, faster support, and Canadian features BoldTrail lacks", "CASL-aware
// email" and "Canadian support and AI automation". Added what the product does
// not have.
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so every migration offer was removed. Gone:
// the two buttons that booked a migration call (one of them through
// t('comparison.schedule')), the five-step process in which "our team"
// exported and imported the data and a named manager ran a training session,
// the card that promised the migration at no cost with a dollar value, no
// downtime and no effort, and "help you migrate back" in the guarantee
// paragraph (the refund sentence itself is unchanged). Replaced with the steps
// the agent takes themselves, read from src/lib/csvImport.ts and the import
// modal: a CSV import that creates contacts only, with no consent and no
// duplicate merging.

const SwitchFromBoldTrail = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from BoldTrail to Realtor Desk"
        description="Moving from BoldTrail to Realtor Desk: export your contacts as a CSV and import them yourself. What comes across, what does not, and the CAD price."
        keywords="switch from BoldTrail, BoldTrail migration, BoldTrail alternative Canada, Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/switch-from-boldtrail"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from BoldTrail",
            "description": "Moving from BoldTrail to Realtor Desk: export your contacts as a CSV and import them yourself. What comes across, what does not, and the CAD price."
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Switching from BoldTrail
          </Badge>
          <h1 className="mb-6">
            Moving from <span className="gradient-text">BoldTrail</span> to Realtor Desk
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Realtor Desk is a CRM for a single Canadian agent at $149/mo CAD with no setup fee.
            BoldTrail publishes no prices and quotes on request, so compare against the total you are quoted.
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
            It has no seats, lead routing, shared pipeline, IDX website, lead generation or transaction
            management. Check that list against what you use in BoldTrail today.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            We build one of the products compared here, so weigh this accordingly.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">BoldTrail</div>
              <div className="text-2xl font-bold text-muted-foreground">Quoted</div>
              <div className="text-xs text-muted-foreground">BoldTrail does not publish pricing</div>
            </Card>
            
            <div className="text-lg font-semibold text-muted-foreground">vs</div>
            
            <Card className="p-4 border-accent">
              <div className="text-sm text-muted-foreground mb-1">Realtor Desk</div>
              <div className="text-2xl font-bold gradient-text">$149/mo CAD</div>
              <div className="text-xs text-rd-terra-800 font-semibold">$149/mo CAD · no setup fee</div>
            </Card>
          </div>

          <Link to="/demo">
            <Button size="lg" className="btn-gradient">
              Book a demo
            </Button>
          </Link>
        </div>
      </section>

      {/* How the move works. This was a five-step "migration process" in which
          Realtor Desk staff exported and imported the data. There is no such
          service: the agent does every step. */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-4">How the move works</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            You do each step yourself, with a CSV file. Nobody at Realtor Desk exports, maps or imports your data for you.
          </p>

          <div className="grid md:grid-cols-5 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 1</div>
              <h3 className="font-semibold mb-2">Export a CSV</h3>
              <p className="text-sm text-muted-foreground">
                Export your contacts from BoldTrail as a CSV file. Check BoldTrail&rsquo;s own help for the steps.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <ListChecks className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 2</div>
              <h3 className="font-semibold mb-2">Try twenty rows</h3>
              <p className="text-sm text-muted-foreground">
                Cut the first twenty rows into a separate file and import those first.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 3</div>
              <h3 className="font-semibold mb-2">Import the rest</h3>
              <p className="text-sm text-muted-foreground">
                De-duplicate the file, then upload it. Duplicates are not merged for you.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 4</div>
              <h3 className="font-semibold mb-2">Check what landed</h3>
              <p className="text-sm text-muted-foreground">
                Names, email, phone, source and tags come in. Deals and history do not.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 5</div>
              <h3 className="font-semibold mb-2">Record consent</h3>
              <p className="text-sm text-muted-foreground">
                The import carries no consent. Record its date and source before you email anyone.
              </p>
            </Card>
          </div>

          <Card className="mt-12 p-8 bg-accent/10 border-accent text-center">
            <h3 className="text-2xl font-bold mb-3">You run the import yourself</h3>
            <p className="text-lg text-muted-foreground mb-4">
              There is no migration call, no migration team and no onboarding session. The{" "}
              <Link to="/features/import-contacts" className="underline">import documentation</Link>{" "}
              lists the columns the importer reads.
            </p>
            <Badge className="bg-rd-terra-800">
              Contacts only: no deals, history or consent
            </Badge>
          </Card>
        </div>
      </section>

      {/* Risk-Free Guarantee */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">Risk-Free 30-Day Guarantee</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Try Realtor Desk for 30 days. Not satisfied for any reason, we'll refund 100%.
            No questions asked.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Book a demo
              </Button>
            </Link>
            <Link to="/vs/boldtrail">
              <Button size="lg" variant="outline">
                See Full Comparison
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Switch from BoldTrail today. $149/mo CAD with no setup fee — compare it against the total you are quoted.
          </p>
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
            from BoldTrail as a CSV file, then upload that file in Realtor Desk.
            The importer reads the header row and matches English column names
            such as &ldquo;first name&rdquo;, &ldquo;email&rdquo; and
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
            documents and anything specific to BoldTrail&rsquo;s own data model.
            The import creates contacts only. Keep your BoldTrail exports for
            your records and rebuild any live deals in the pipeline by hand.
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
            <li>Export your contacts from BoldTrail and keep an untouched copy of that file.</li>
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

export default SwitchFromBoldTrail;