import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Upload, Download, ListChecks, ClipboardCheck, CheckCircle, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: the title
// and headings that called Lofty's AI fake, the five unsourced crosses against
// Lofty, and for Realtor Desk "real conversations", "learns from every
// interaction", "Canadian market predictions (TO, VAN, CAL)", "predictive
// intelligence", "All features included", "No call/text charges", "No overage
// charges", "responsive Canadian support" and the empty "Why Canadian agents
// choose us over Lofty" section. Replaced with what the product does, what it
// does not, and the published price.
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so every migration offer was removed. Gone:
// both buttons that booked a migration call and the five-step "Simple, Fast
// Migration Process" (a 15-minute call, staff exporting the Lofty contacts
// and deals, "Everything moved", "30-minute personalized onboarding" and a
// promised turnaround time). Replaced with the steps the agent takes
// themselves, read from src/lib/csvImport.ts and the import modal: a CSV
// import that creates contacts only, with no consent and no duplicate merging.
// The money-back sentence is unchanged.

const SwitchFromLofty = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from Lofty to Realtor Desk"
        description="Moving from Lofty to Realtor Desk: what you would give up, how a CSV move works, and CAD pricing. Lofty quotes pricing on request."
        keywords="switch from Lofty, Lofty CRM migration, Lofty alternative Canada, Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/switch-from-lofty"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from Lofty to Realtor Desk",
            "description": "Moving from Lofty to Realtor Desk: what you would give up, how a CSV move works, and CAD pricing. Lofty quotes pricing on request."
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Switching from Lofty
          </Badge>
          <h1 className="mb-6">
            Moving from Lofty <span className="gradient-text">to Realtor Desk</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Realtor Desk is a CRM for a single Canadian agent at a published price of $149 CAD a month.
            It does less than a full platform, so this page covers what you would give up as well as how the move works.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            We build one of the products compared here, so weigh this accordingly.
          </p>
          
          <Link to="/demo">
            <Button size="lg" className="btn-gradient">
              Book a demo
            </Button>
          </Link>
        </div>
      </section>

      {/* What you give up and what you get. This was "Real AI vs. Lofty's AI":
          five crosses against Lofty with no source, beside five ticks for
          things Realtor Desk does not do. */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What you would give up, and what you would get</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <Badge variant="outline" className="mb-4">Not in Realtor Desk</Badge>
              <h3 className="text-xl font-bold mb-4">What you would give up</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">–</span>
                  <span>No IDX website, lead generation or ads</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">–</span>
                  <span>No lead-facing chatbot, automatic replies or voice agent</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">–</span>
                  <span>No seats, lead routing, shared pipeline or team inbox</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">–</span>
                  <span>No transaction management, e-signature or document storage</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">–</span>
                  <span>No automated email sequences switched on</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">–</span>
                  <span>No native mobile app; it is a responsive web app</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <Badge className="mb-4 bg-rd-terra-800">Realtor Desk</Badge>
              <h3 className="text-xl font-bold mb-4">What you would get</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>Contacts with one conversation timeline per client</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>A drag-and-drop deal pipeline with totals in CAD</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>A rule-based lead score from 0 to 100, with a visible breakdown</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>An in-app assistant that drafts a reply; you send every message</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>French or English set per contact</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>Date and source of consent recorded on each contact</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* An invented customer testimonial stood here -- a quote attributed to a person who does not exist, in several cases carrying a dollar figure or a percentage. Production has recorded zero deals, so none of it describes anything that happened. The brief prohibits generating testimonials; CLAUDE.md prohibits fabricating case studies. */}
        </div>
      </section>

      {/* How the move works. This was a five-step "migration process" in which
          Realtor Desk staff exported and imported the data and ran a training
          session. There is no such service: the agent does every step. */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-4">How the move works</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            You do each step yourself, with a CSV file. Nobody at Realtor Desk exports, maps or imports your data for you, and there is no migration call or onboarding session. The{" "}
            <Link to="/features/import-contacts" className="underline">import documentation</Link>{" "}
            lists the columns the importer reads.
          </p>

          <div className="grid md:grid-cols-5 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 1</div>
              <h3 className="font-semibold mb-2">Export a CSV</h3>
              <p className="text-sm text-muted-foreground">
                Export your contacts from Lofty as a CSV file. Check Lofty&rsquo;s own help for the steps.
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
        </div>
      </section>

      {/* Transparent Pricing */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Transparent Pricing (Unlike Lofty)</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-destructive/20">
              <Badge variant="outline" className="mb-4">Lofty</Badge>
              {/* Was "$99-300+/mo" with an invented tier breakdown. Lofty
                  publishes no prices (verified 2026-09-28), so the figures and
                  the "unpredictable budget" conclusion drawn from them were
                  both ours, not theirs. */}
              <div className="text-3xl font-bold text-muted-foreground mb-4">Quoted on request</div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-muted-foreground">• No published price list</li>
                <li className="text-sm text-muted-foreground">• Sales conversation before a number</li>
                <li className="text-sm text-muted-foreground">• Ask for setup and add-ons in writing</li>
                <li className="text-sm text-muted-foreground font-semibold">= You will not know until you ask</li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <Badge className="mb-4 bg-rd-terra-800">Realtor Desk</Badge>
              <div className="text-3xl font-bold gradient-text mb-4">$149/mo CAD</div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm">✓ For a single agent</li>
                <li className="text-sm">✓ Published on the pricing page</li>
                <li className="text-sm">✓ 14-day trial</li>
                <li className="text-sm">✓ Card collected up front; nothing charged before day 14</li>
                <li className="text-sm text-rd-terra-800 font-semibold">✓ A number you can read before you ask</li>
              </ul>
            </Card>
          </div>

          <Card className="mt-8 p-6 bg-accent/10 border-accent/20 text-center">
            <DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
            <p className="font-semibold mb-2">What You Actually Pay:</p>
            <p className="text-sm text-muted-foreground">
              Lofty: pricing quoted on request, not published<br/>
              Realtor Desk: <span className="text-rd-terra-800 font-semibold">$149/mo CAD.</span>
            </p>
          </Card>
        </div>
      </section>

      {/* A "Why Canadian agents choose RealtorDesk AI over Lofty" section stood
          here with a heading and nothing under it. Removed 2026-10-11: there
          are no customer stories to put in it. */}

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 text-rd-terra-800 mx-auto mb-6" />
          <h2 className="mb-6">Try it before you move anything</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            30-day money-back guarantee. Not satisfied for any reason, full refund. No questions asked.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Book a demo
              </Button>
            </Link>
            <Link to="/vs/lofty">
              <Button size="lg" variant="outline">
                See Full Comparison
              </Button>
            </Link>
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
            from Lofty as a CSV file, then upload that file in Realtor Desk. The
            importer reads the header row and matches English column names such
            as &ldquo;first name&rdquo;, &ldquo;email&rdquo; and
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
            documents and anything specific to Lofty&rsquo;s own data model. The
            import creates contacts only. Keep your Lofty exports for your
            records and rebuild any live deals in the pipeline by hand.
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
            <li>Export your contacts from Lofty and keep an untouched copy of that file.</li>
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

export default SwitchFromLofty;