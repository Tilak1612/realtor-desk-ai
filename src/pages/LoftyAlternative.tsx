import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, DollarSign, Upload, Shield, Zap } from "lucide-react";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: the "#1"
// badge, the "AI Voice Agent" and "WhatsApp Integration" rows and card (neither
// exists and neither is "coming soon"), "Predictive Lead Scoring", "Custom AI
// Training", "PIPEDA Compliance", "Quebec Market Ready", the dated CREA DDF
// promise, the invented Lofty figures ($700 USD in the JSON-LD, "$99/mo
// add-on") and every Lofty tick, cross and "US-focused" verdict that had no
// source. Lofty cells with no source now say "Ask the vendor".
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so every migration offer was removed. Gone:
// the data-migration tick under the hero buttons, the data-migration row in
// the table, the "Migration & Setup" card (staff migrating the Lofty data and
// setting up the account) and the third FAQ answer (staff transferring
// contacts, deals and automation workflows at no cost).
// Replaced with the true process, read from src/lib/csvImport.ts and the
// import modal: the agent exports a CSV and imports it themselves; contacts
// only, no consent, no duplicate merging.
//
// The FAQ lives in one array so the FAQPage JSON-LD and the visible list
// cannot drift apart.
const FAQS = [
  {
    q: "How much cheaper is Realtor Desk than Lofty?",
    a: "We cannot tell you, and neither can anyone else. Realtor Desk is $149 CAD a month with no setup fee. Lofty does not publish prices — its pricing page asks you to request a quote — so there is no public figure to compare against. Ask them for a written quote and put it next to ours.",
  },
  {
    q: "Does Realtor Desk sync with CREA DDF®?",
    a: "Not yet. Native CREA DDF® sync is on the roadmap and is not live yet. Today a single listing can be brought in from a Realtor.ca address or an MLS number. Ask Lofty directly what it supports for Canadian boards.",
  },
  {
    q: "Can I migrate from Lofty to Realtor Desk?",
    a: "Yes, by a CSV file that you export from Lofty and import into Realtor Desk yourself. Nobody at Realtor Desk moves the data for you. The import creates contacts only: it reads name, email, phone, source and tags, and it does not bring deals, conversations, automations, tasks or documents. It does not import consent either, so under CASL you must record the date and source of consent for each contact before you email them.",
  },
  {
    q: "Does Realtor Desk have the same features as Lofty?",
    a: "No. Realtor Desk is a CRM for a single agent: contacts, a deal pipeline, SMS and one conversation timeline per client, with French per contact. It does not include an IDX website, lead generation, a voice agent, a lead-facing chatbot or seats for a team. If you rely on any of those, check Lofty's own feature pages and choose on what you actually use.",
  },
  {
    q: "What does the trial commit me to?",
    a: "The trial runs 14 days. A card is collected up front and nothing is charged before day 14, so you can cancel before you pay anything. Lofty's terms are set in its quote, so ask for the contract length in writing.",
  },
];

const LoftyAlternative = () => {
  const comparisonFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  const comparisonTableSchema = {
    "@context": "https://schema.org",
    // ComparisonTable is not a schema.org type — the block validated as JSON
    // but search engines ignore an unknown @type, so it did nothing. ItemList
    // is the valid equivalent for a two-product comparison.
    //
    // The Lofty entry used to be a Product with an Offer of 700.00 USD. Lofty
    // publishes no price, so that figure was invented; both entries are now
    // plain list items and only our own price is stated.
    "@type": "ItemList",
    "name": "Lofty vs Realtor Desk feature comparison",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Realtor Desk", "description": "$149 CAD a month for a single agent" },
      { "@type": "ListItem", "position": 2, "name": "Lofty", "description": "Pricing quoted on request; not published" }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Lofty Alternative for Canadian Agents"
        description="A Lofty alternative for a single Canadian agent: $149 CAD a month, French per contact, database hosted in Canada. Lofty quotes its prices on request."
        keywords="Lofty alternative, Lofty CRM alternative Canada, Lofty vs Realtor Desk, switch from Lofty, real estate CRM Canada"
        canonicalUrl="https://www.realtordesk.ai/lofty-alternative"
        structuredData={[comparisonFAQSchema, comparisonTableSchema]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Lofty Alternative for Canadian Agents
            </Badge>
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
              A Canadian alternative to Lofty<br />
              <span className="gradient-text">with a price you can read</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Realtor Desk is a CRM for a single Canadian agent: French or English set per contact and the production database hosted in Canada, at <strong>$149 CAD/month</strong> with no setup fee. Lofty quotes its pricing on request rather than publishing it.
            </p>
            <p className="text-muted-foreground mb-4">
              Native CREA DDF® sync is on the roadmap and is not live yet.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              We build one of the products compared here, so weigh this accordingly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link to="/signup">
                  Start Free 14-Day Trial
                  <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">Book a Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✓ Cancel anytime before you're charged &nbsp;•&nbsp; ✓ CSV contact import you run yourself &nbsp;•&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* What a price comparison can honestly say.
          This was three cards — "$10,188 First Year with Lofty" built from
          $700/mo + a $1,499 setup fee + $399 migration, against "$1,788" for
          us, concluding "$8,400 You Save". Verified 2026-09-28: lofty.com
          publishes no prices at all. Every one of those competitor figures was
          invented, the page said so itself two sections later ("Not
          published"), and the saving derived from them was quoted as 85% in
          the H1 and 83% on the card. A comparison that makes up the other
          side's number is not a comparison. */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">What a price comparison can honestly say</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Realtor Desk is <strong>$149 CAD a month</strong> for a single
              agent and <strong>$299</strong> for the Team plan, with no setup
              fee. Those numbers are on our pricing page and on the checkout.
            </p>
            <p className="text-muted-foreground mb-6">
              Lofty does not publish prices. Its pricing page asks you to
              request a quote, so anyone telling you what Lofty costs — us
              included — is guessing. We are not going to invent a figure and
              then calculate your savings from it.
            </p>
            <p className="text-muted-foreground">
              What you can compare today is what each vendor is willing to tell
              you before you talk to sales. Ask Lofty for a written quote
              including setup and migration, then put it next to ours.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-4">Feature-by-Feature Comparison</h2>
            <p className="text-center text-muted-foreground mb-12">
              What Realtor Desk has and does not have. Where we have no source for Lofty, the cell says so.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-primary">Realtor Desk</th>
                    <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Lofty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>Pricing & Value</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Starting Price (Monthly)</td>
                    <td className="text-center py-3 px-4 font-bold text-rd-terra-800">$149 CAD</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not published</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Setup Fee</td>
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="bg-green-500/10 text-green-800 border-green-500">$0</Badge></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not published</td>
                  </tr>
                  <tr className="border-b">
                    {/* Was a data-migration row with a tick for Realtor Desk.
                        There is no migration service. The Lofty cell was a red
                        X, then "Not published"; we have no source for how
                        Lofty handles it. */}
                    <td className="py-3 px-4">Moving your contacts</td>
                    <td className="text-center py-3 px-4 font-medium">CSV import you run yourself</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Free Trial</td>
                    <td className="text-center py-3 px-4 font-medium">14 days</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>Canadian Specifics</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Native CREA DDF® sync (roadmap)</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available yet</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Production database hosted in Canada</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">French or English set per contact</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Consent date and source on each contact</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>AI Features</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">In-app assistant that drafts a reply or summarises a thread</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Rule-based lead score, 0 to 100, with a visible breakdown</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Voice agent (inbound or outbound)</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Lead-facing chatbot or automatic replies</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-semibold" colSpan={3}>Core CRM Features</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Contacts with one conversation timeline per client</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Drag-and-drop deal pipeline with totals in CAD</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">SMS through Twilio, email through your own SMTP server</td>
                    <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Automated email sequences</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">WhatsApp</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">IDX website and lead generation</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Seats, lead routing and a shared pipeline</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="py-3 px-4">Native mobile app</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Not available (responsive web app)</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">Ask the vendor</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-primary/5">
                    <td className="py-4 px-4 font-bold">Total First Year Cost</td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl font-bold text-rd-terra-800">$1,788 CAD</div>
                      <div className="text-xs text-muted-foreground">$149/mo × 12, no setup fee</div>
                    </td>
                    {/* Was "$10,188+ USD / ~$13,850 CAD". Both invented. */}
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl font-bold text-muted-foreground">Quote only</div>
                      <div className="text-xs text-muted-foreground">No public price to total</div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Canadian Agents Switch */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">What You Get, and What You Do Not</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <Shield className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Canadian specifics</h3>
                <p className="text-muted-foreground">
                  French or English is set per contact, and the interface and client email both work in French. Each contact carries the date and source of consent. The production database is hosted in Canada; some outside services (SMS, email delivery, AI drafting) may process data outside Canada. Ask Lofty how it handles each of these.
                </p>
              </Card>
              <Card className="p-6">
                <DollarSign className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">A price you can check</h3>
                <p className="text-muted-foreground">
                  $149 CAD a month, no setup fee, no add-on tiers, and the number is published rather than quoted. You can see what you will pay before you speak to anyone.
                </p>
              </Card>
              <Card className="p-6">
                <X className="w-10 h-10 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">What it does not do</h3>
                <p className="text-muted-foreground">
                  No voice agent, no lead-facing chatbot, no WhatsApp, no IDX website and no lead generation. It is a single-agent product, so there are no seats or lead routing. The in-app assistant drafts a reply or summarises the thread on the contact you have open, and nothing is sent to a client without you.
                </p>
              </Card>
              <Card className="p-6">
                <Upload className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Moving your contacts</h3>
                <p className="text-muted-foreground">
                  You export your contacts from Lofty as a CSV file and import that file yourself. Nobody at Realtor Desk moves your data or sets up your account for you. The import creates contacts only, with no deals, history or consent, so try twenty rows first. The{" "}
                  <Link to="/features/import-contacts" className="underline">import documentation</Link>{" "}
                  lists the columns it reads, and the{" "}
                  <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">CASL guide</Link>{" "}
                  covers the consent to record before you email a contact. There is no setup fee.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-12">Frequently Asked Questions</h2>
            {/* Rendered from FAQS, the same array the FAQPage JSON-LD is built
                from, so the markup and the visible text are the same words. */}
            <div className="space-y-6">
              {FAQS.map((f) => (
                <Card key={f.q} className="p-6">
                  <h3 className="text-lg font-bold mb-2">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">See it before you decide</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start a free 14-day trial and work a week of your own leads in it. A card is collected up front and nothing is charged before day 14, so you can cancel before you pay anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link to="/signup">
                  Start Free Trial
                  <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">Book a Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Questions? Email us at <a href="mailto:support@realtordesk.ai" className="text-primary hover:underline">support@realtordesk.ai</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoftyAlternative;
