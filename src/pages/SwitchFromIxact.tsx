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
// Realtor Desk does not have. The migration and money-back sentence is
// untouched.

const SwitchFromIxact = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from IXACT to Realtor Desk"
        description="Moving from IXACT to Realtor Desk: free migration, French per contact, a consent record on each contact and a rule-based lead score. Solo plan $149/mo CAD."
        keywords="switch from IXACT, IXACT migration, IXACT alternative, CRM for Canadian realtors"
        canonicalUrl="https://www.realtordesk.ai/switch-from-ixact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from IXACT to Realtor Desk",
            "description": "Moving from IXACT to Realtor Desk: free migration, French per contact, a consent record on each contact and a rule-based lead score. Solo plan $149/mo CAD."
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
          <h2 className="mb-6">14 Days Free Trial + Free Migration</h2>
          <p className="text-lg text-muted-foreground mb-8">Try free for 14 days. We move your IXACT data for free. A 30-day money-back guarantee applies after that.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
            <Link to="/vs/ixact"><Button size="lg" variant="outline">See Comparison</Button></Link>
          </div>
        </div>
      </section>
      {/* The SEO report keeps the switch-from pages only where they carry real
          migration substance — supported fields, what does not come across,
          and how to test — rather than boilerplate. This is that, verified
          against src/lib/csvImport.ts rather than described from memory. */}
      <section className="section-padding border-t">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6">What actually moves across</h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Migration is a CSV import. Export your contacts from IXACT Contact, then
            upload the file — the importer reads the header row and matches
            common column names, so in most cases you do not have to rename
            anything first.
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
              <strong>Company, job title, notes</strong> — kept on the contact even
              though they have no dedicated column, so nothing in the file is
              discarded
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">What does not come across</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Email and call history, attachments, saved searches, automation
            sequences and anything specific to IXACT Contact&rsquo;s own data model. A
            CSV of contacts is a CSV of contacts. If the history matters, keep
            your IXACT Contact export file — it is the record, and we are not going to
            pretend we can reconstruct a timeline we never had.
          </p>

          <h3 className="text-lg font-semibold mb-2">Test it before you commit</h3>
          <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5 mb-6">
            <li>Export everything from IXACT Contact and keep that file somewhere safe.</li>
            <li>Cut the first twenty rows into a separate CSV and import those.</li>
            <li>
              Open three of them and check the name split, the phone format and
              whether the tags landed where you expected.
            </li>
            <li>Only then import the rest.</li>
          </ol>

          <h3 className="text-lg font-semibold mb-2">Getting back out</h3>
          <p className="text-muted-foreground leading-relaxed">
            Your contacts export to CSV from settings at any time, including
            after you cancel. That is worth checking on any CRM you are
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