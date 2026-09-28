import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Globe, Brain, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

const SwitchFromWiseAgent = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from Wise Agent | Canadian CRM Upgrade"
        description="Switch from Wise Agent to RealtorDesk AI for bilingual support and Canadian market intelligence. CREA DDF® integration coming Q3 2026."
        keywords="switch from Wise Agent, Wise Agent alternative Canada, Canadian real estate CRM, RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/switch-from-wise-agent"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from Wise Agent",
            "description": "Upgrade from Wise Agent to RealtorDesk AI with Canadian compliance and AI automation."
          }
        ]}
      />
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <div className="text-4xl mb-4">🇨🇦</div>
          <h1 className="mb-6">Wise Agent Is Fine for US. <span className="gradient-text">Canadian Agents Need Canadian Solutions.</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Get bilingual support, Toronto/Vancouver/Calgary market intelligence Wise Agent can't provide, and CREA DDF® integration coming Q3 2026.</p>
          <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why Canadian Agents Need Canadian CRM</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center"><Globe className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><h3 className="font-bold mb-2">Canadian Markets</h3><p className="text-sm text-muted-foreground">Toronto, Vancouver, Calgary intelligence</p></Card>
            <Card className="p-6 text-center"><div className="text-4xl mb-3">🇫🇷</div><h3 className="font-bold mb-2">Bilingual</h3><p className="text-sm text-muted-foreground">Full French/English support</p></Card>
            <Card className="p-6 text-center"><Brain className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><h3 className="font-bold mb-2">AI-Powered</h3><p className="text-sm text-muted-foreground">Predictive intelligence</p></Card>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 text-rd-terra-800 mx-auto mb-6" />
          <h2 className="mb-6">Switch to Canadian CRM Today</h2>
          <p className="text-lg text-muted-foreground mb-8">14 Days Free Trial • Free migration • Canadian support team</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
            <Link to="/vs/wise-agent"><Button size="lg" variant="outline">See Comparison</Button></Link>
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
            Migration is a CSV import. Export your contacts from Wise Agent, then
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
            sequences and anything specific to Wise Agent&rsquo;s own data model. A
            CSV of contacts is a CSV of contacts. If the history matters, keep
            your Wise Agent export file — it is the record, and we are not going to
            pretend we can reconstruct a timeline we never had.
          </p>

          <h3 className="text-lg font-semibold mb-2">Test it before you commit</h3>
          <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5 mb-6">
            <li>Export everything from Wise Agent and keep that file somewhere safe.</li>
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

export default SwitchFromWiseAgent;