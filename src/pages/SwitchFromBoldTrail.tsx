import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, Upload, Download, GraduationCap, CheckCircle, DollarSign, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

const SwitchFromBoldTrail = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from BoldTrail to Realtor Desk"
        description="Free migration and CSV import if you're moving from BoldTrail to Realtor Desk — CASL-aware email, bilingual EN/FR, $149/mo CAD."
        keywords="switch from BoldTrail, BoldTrail migration, BoldTrail alternative Canada, RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/switch-from-boldtrail"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from BoldTrail",
            "description": "Free migration from BoldTrail to RealtorDesk AI with Canadian support and AI automation."
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Switch & Save
          </Badge>
          <h1 className="mb-6">
            Frustrated with <span className="gradient-text">BoldTrail?</span> You're Not Alone.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Canadian agents are choosing Realtor Desk over BoldTrail — $149/mo CAD, no setup fee,
            while getting better AI, faster support, and Canadian features BoldTrail lacks.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Card className="p-4 border-destructive/20">
              <div className="text-sm text-muted-foreground mb-1">You're Paying</div>
              <div className="text-2xl font-bold text-destructive">Quoted</div>
              <div className="text-xs text-muted-foreground">BoldTrail first year cost</div>
            </Card>
            
            <TrendingDown className="w-8 h-8 text-rd-terra-800" />
            
            <Card className="p-4 border-accent">
              <div className="text-sm text-muted-foreground mb-1">Switch to</div>
              <div className="text-2xl font-bold gradient-text">$149/mo CAD</div>
              <div className="text-xs text-rd-terra-800 font-semibold">$149/mo CAD · no setup fee</div>
            </Card>
          </div>

          <Link to="/demo">
            <Button size="lg" className="btn-gradient">
              {t('comparison.schedule')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Migration Process */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">We Make Switching Easy (And Free)</h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 1</div>
              <h3 className="font-semibold mb-2">15-Min Call</h3>
              <p className="text-sm text-muted-foreground">
                Schedule migration call to review your BoldTrail setup
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 2</div>
              <h3 className="font-semibold mb-2">We Export</h3>
              <p className="text-sm text-muted-foreground">
                Our team exports your contacts, deals, and data from BoldTrail
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 3</div>
              <h3 className="font-semibold mb-2">We Import</h3>
              <p className="text-sm text-muted-foreground">
                Everything moved to your new Realtor Desk account
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 4</div>
              <h3 className="font-semibold mb-2">30-Min Training</h3>
              <p className="text-sm text-muted-foreground">
                Personalized onboarding session with your success manager
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 5</div>
              <h3 className="font-semibold mb-2">You're Live!</h3>
              <p className="text-sm text-muted-foreground">
                Up and running quickly, at $149/mo CAD with no setup fee
              </p>
            </Card>
          </div>

          <Card className="mt-12 p-8 bg-accent/10 border-accent text-center">
            <DollarSign className="w-16 h-16 text-rd-terra-800 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">100% Free Migration</h3>
            <p className="text-lg text-muted-foreground mb-4">
              $499 value included at no cost. We handle everything.
            </p>
            <Badge className="bg-rd-terra-800">
              Zero downtime • Zero effort on your part
            </Badge>
          </Card>
        </div>
      </section>

      {/* Risk-Free Guarantee */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">Risk-Free 30-Day Guarantee</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Try Realtor Desk for 30 days. Not satisfied for any reason, we'll refund 100%
            and help you migrate back. No questions asked.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Schedule Free Migration Call
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
          migration substance — supported fields, what does not come across,
          and how to test — rather than boilerplate. This is that, verified
          against src/lib/csvImport.ts rather than described from memory. */}
      <section className="section-padding border-t">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6">What actually moves across</h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Migration is a CSV import. Export your contacts from BoldTrail, then
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
            sequences and anything specific to BoldTrail&rsquo;s own data model. A
            CSV of contacts is a CSV of contacts. If the history matters, keep
            your BoldTrail export file — it is the record, and we are not going to
            pretend we can reconstruct a timeline we never had.
          </p>

          <h3 className="text-lg font-semibold mb-2">Test it before you commit</h3>
          <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5 mb-6">
            <li>Export everything from BoldTrail and keep that file somewhere safe.</li>
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

export default SwitchFromBoldTrail;