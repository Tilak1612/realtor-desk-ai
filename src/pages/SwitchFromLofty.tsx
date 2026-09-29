import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, Upload, Download, GraduationCap, CheckCircle, Brain, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

const SwitchFromLofty = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from Lofty | Upgrade to Real AI"
        description="Move from Lofty to RealtorDesk AI for true predictive intelligence, transparent pricing, and Canadian support."
        keywords="switch from Lofty, Lofty CRM migration, Lofty alternative Canada, RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/switch-from-lofty"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from Lofty",
            "description": "Upgrade from Lofty to RealtorDesk AI with real AI features and Canadian market support."
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Upgrade to Real AI
          </Badge>
          <h1 className="mb-6">
            Tired of Lofty's <span className="gradient-text">"AI" That Doesn't Actually Work?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get true predictive intelligence, transparent pricing, and responsive Canadian support. 
            Join the agents who upgraded from basic automation to AI that actually closes deals.
          </p>
          
          <Link to="/demo">
            <Button size="lg" className="btn-gradient">
              Schedule Free Migration Call
            </Button>
          </Link>
        </div>
      </section>

      {/* Real AI vs Fake AI */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Real AI vs. Lofty's "AI"</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-destructive/20">
              <Badge variant="outline" className="mb-4">Lofty's "AI"</Badge>
              <h3 className="text-xl font-bold mb-4">Basic Automation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>Pre-programmed chatbot with canned responses</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>No engagement-based lead ranking</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>Doesn't learn from your interactions</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>Generic email templates for everyone</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-destructive">❌</span>
                  <span>No market intelligence or predictions</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-accent">
              <Badge className="mb-4 bg-rd-terra-800">Realtor Desk</Badge>
              <h3 className="text-xl font-bold mb-4">True Intelligence</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>Understands context, has real conversations</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>Ranks leads by observed engagement</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>Learns and improves from every interaction</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>Personalized content based on behavior</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-rd-terra-800">✓</span>
                  <span>Canadian market predictions (TO, VAN, CAL)</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* An invented customer testimonial stood here -- a quote attributed to a person who does not exist, in several cases carrying a dollar figure or a percentage. Production has recorded zero deals, so none of it describes anything that happened. The brief prohibits generating testimonials; CLAUDE.md prohibits fabricating case studies. */}
        </div>
      </section>

      {/* Migration Process */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">Simple, Fast Migration Process</h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 1</div>
              <h3 className="font-semibold mb-2">15-Min Call</h3>
              <p className="text-sm text-muted-foreground">
                Quick call to understand your Lofty setup
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 2</div>
              <h3 className="font-semibold mb-2">Data Export</h3>
              <p className="text-sm text-muted-foreground">
                We export all your Lofty contacts and deals
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 3</div>
              <h3 className="font-semibold mb-2">Import</h3>
              <p className="text-sm text-muted-foreground">
                Everything moved to Realtor Desk
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 4</div>
              <h3 className="font-semibold mb-2">Training</h3>
              <p className="text-sm text-muted-foreground">
                30-minute personalized onboarding
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-rd-terra-800" />
              </div>
              <div className="text-lg font-bold mb-2">Step 5</div>
              <h3 className="font-semibold mb-2">Go Live</h3>
              <p className="text-sm text-muted-foreground">
                Productive in 48 hours
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
                <li className="text-sm">✓ All features included</li>
                <li className="text-sm">✓ No call/text charges</li>
                <li className="text-sm">✓ No surprise fees</li>
                <li className="text-sm">✓ No overage charges</li>
                <li className="text-sm text-rd-terra-800 font-semibold">✓ Budget you can plan</li>
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

      {/* Success Stories */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why Canadian agents choose RealtorDesk AI over Lofty</h2>
          
          <div className="space-y-6">

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <Brain className="w-16 h-16 text-rd-terra-800 mx-auto mb-6" />
          <h2 className="mb-6">Upgrade to Real AI Today</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            30-day money-back guarantee. Not satisfied for any reason, full refund. No questions asked.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Schedule Free Migration Call
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
          migration substance — supported fields, what does not come across,
          and how to test — rather than boilerplate. This is that, verified
          against src/lib/csvImport.ts rather than described from memory. */}
      <section className="section-padding border-t">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6">What actually moves across</h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Migration is a CSV import. Export your contacts from Lofty, then
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
            sequences and anything specific to Lofty&rsquo;s own data model. A
            CSV of contacts is a CSV of contacts. If the history matters, keep
            your Lofty export file — it is the record, and we are not going to
            pretend we can reconstruct a timeline we never had.
          </p>

          <h3 className="text-lg font-semibold mb-2">Test it before you commit</h3>
          <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5 mb-6">
            <li>Export everything from Lofty and keep that file somewhere safe.</li>
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

export default SwitchFromLofty;