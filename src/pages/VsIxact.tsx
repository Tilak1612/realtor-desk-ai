import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Brain, Zap, TrendingUp, DollarSign, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

// 2026-10-11: rewritten against the 2026-10-11 fact sheet. Removed: "USD" on
// IXACT's price (the page's own source note says the currency is not stated),
// "Predictive lead scoring, intelligent chatbot, automated nurturing IXACT
// doesn't have", the transaction management, email marketing and "ROI
// Tracking" ticks for Realtor Desk, "Sending on the roadmap", "CASL-aware
// email", and the unsourced crosses, "Manual", "Basic", "Native app" and "Not
// stated" verdicts on IXACT. The IXACT price stays because the hero attributes
// it to ixactcontact.com with a date.
//
// 2026-10-11, later the same day, by the owner's decision: Realtor Desk does
// NOT offer a migration service, so every migration offer was removed. Gone:
// the migration row in the table and the two migration cards, which said
// Realtor Desk staff would bring the IXACT contacts, notes and tags across
// with no effort on the customer's part. Replaced with the true
// process, read from src/lib/csvImport.ts and the import modal: the agent
// exports a CSV and imports it themselves; contacts only, no consent, no
// duplicate merging. The money-back guarantee wording is unchanged.

const VsIxact = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="IXACT Contact vs Realtor Desk for Canadian Agents"
        description="IXACT Contact lists $46.75/mo billed annually; Realtor Desk is $149/mo CAD. Compare price, French per contact, consent records and the lead score."
        keywords="IXACT Contact vs Realtor Desk, IXACT alternative, Canadian real estate CRM comparison"
        canonicalUrl="https://www.realtordesk.ai/vs/ixact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "IXACT Contact vs Realtor Desk",
            "description": "IXACT Contact lists $46.75/mo billed annually; Realtor Desk is $149/mo CAD. Compare price, French per contact, consent records and the lead score."
          }
        ]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            Comparison Guide
          </Badge>
          <h1 className="mb-6">
            More than IXACT. <span className="gradient-text">Here is what the difference buys.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            IXACT is the cheaper contact manager. We cost about three times as much — so this page is the honest case for paying it.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            We build one of the products compared here, so weigh this accordingly.
          </p>
          
          {/* Price Comparison */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <Card className="p-6 flex-1">
              <div className="text-sm text-muted-foreground mb-2">IXACT Contact</div>
              <div className="text-3xl font-bold mb-1">$46.75/mo</div>
              <div className="text-xs text-muted-foreground">Billed annually · currency not stated · ixactcontact.com, 9 Sep 2026</div>
            </Card>
            
            <div className="text-2xl font-bold">→</div>
            
            <Card className="p-6 flex-1 border-accent">
              <div className="text-sm text-muted-foreground mb-2">Realtor Desk</div>
              <div className="text-3xl font-bold gradient-text mb-1">$149/mo CAD</div>
              <div className="text-xs text-muted-foreground">Solo plan · billed monthly · 14-day free trial</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">What the difference buys</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <Brain className="w-12 h-12 text-rd-terra-800 mx-auto mb-4" />
              <h3 className="font-bold mb-2">An assistant that drafts</h3>
              <p className="text-sm text-muted-foreground">
                The in-app assistant drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you
              </p>
            </Card>

            <Card className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-rd-terra-800 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Know who to call first</h3>
              <p className="text-sm text-muted-foreground">
                Every lead carries a rule-based 0-100 score with the breakdown behind it, and a suggested next action
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Zap className="w-12 h-12 text-rd-terra-800 mx-auto mb-4" />
              <h3 className="font-bold mb-2">One thread per client</h3>
              <p className="text-sm text-muted-foreground">
                Messages, notes and tasks sit on a single timeline beside the contact, in English or French
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-accent/10 border-accent/20 text-center">
            <p className="text-lg mb-4">
              Realtor Desk costs more than IXACT. What you get for the difference is
              <span className="gradient-text font-bold"> French or English per contact, a consent record on each contact and a rule-based lead score</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              Compare both on your own numbers — seats, billing term and taxes differ by vendor.
            </p>
          </Card>
        </div>
      </section>

      {/* Where we differ.
          This was "What IXACT Doesn't Have", six cards of which three rested on
          capabilities we do not have either -- a 24/7 lead-facing chatbot,
          market prediction, and engagement-timed nurturing. A gap only counts
          as a reason to switch if the thing is on our side of the line. The
          "Dated Interface / looks like it's from 2010" card went with them:
          that is an aesthetic opinion about a named competitor, not a fact we
          can stand behind. */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-4">Where the two differ</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            IXACT&rsquo;s list price is about a third of ours. These are the specific
            things you get here; check IXACT&rsquo;s own feature pages for what it offers on each.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Leads arrive ranked</h3>
              <p className="text-sm text-muted-foreground">
                Engagement, behaviour, budget match, timeline and qualification roll up
                to a rule-based 0-100 score, with the breakdown visible and a suggested
                next action on the lead.
              </p>
            </Card>

            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">French per contact</h3>
              <p className="text-sm text-muted-foreground">
                The interface and client email both work in French. Set French or
                English per contact and it stays there.
              </p>
            </Card>

            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">Canadian specifics</h3>
              <p className="text-sm text-muted-foreground">
                The production database is hosted in Canada, pricing is in CAD, and every
                contact carries the date and source of consent. Automated email stops for a
                contact who has withdrawn. Some outside services (SMS, email delivery, AI
                drafting) may process data outside Canada.
              </p>
            </Card>

            <Card className="p-6">
              <Check className="w-8 h-8 text-rd-terra-800 mb-3" />
              <h3 className="font-bold mb-2">A drag-and-drop pipeline</h3>
              <p className="text-sm text-muted-foreground">
                Drag a deal between stages and it sticks. The pipeline carries totals in
                CAD, so you can see where the money sits.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">Side by Side</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Realtor Desk</th>
                  <th className="text-center p-4 font-bold">IXACT Contact</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "List price", rdai: "$149/mo CAD", ixact: "$46.75/mo, billed annually" },
                  { feature: "Rule-based lead score (0-100, with breakdown)", rdai: true, ixact: "Ask the vendor" },
                  { feature: "Drag-and-drop pipeline with CAD totals", rdai: true, ixact: "Ask the vendor" },
                  { feature: "In-app assistant that drafts a reply", rdai: true, ixact: "Ask the vendor" },
                  { feature: "French or English per contact", rdai: true, ixact: "Ask the vendor" },
                  { feature: "Consent date and source on each contact", rdai: true, ixact: "Ask the vendor" },
                  { feature: "Production database hosted in Canada", rdai: true, ixact: "Ask the vendor" },
                  { feature: "Automated email sequences", rdai: "Not available (a builder exists; scheduled sending is not on)", ixact: "Ask the vendor" },
                  { feature: "Lead-facing chatbot or automatic replies", rdai: "Not available", ixact: "Ask the vendor" },
                  { feature: "Transaction Management", rdai: "Not available", ixact: "Ask the vendor" },
                  { feature: "Native mobile app", rdai: "Not available (responsive web app)", ixact: "Ask the vendor" },
                  { feature: "Moving your contacts", rdai: "CSV import you run yourself", ixact: "Ask the vendor" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.rdai === 'boolean' ? (
                        row.rdai ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-rd-terra-800 font-semibold">{row.rdai}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.ixact === 'boolean' ? (
                        row.ixact ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.ixact}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">What the extra costs, and what it buys</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The three-times price gap is real. These are the things it pays for.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <DollarSign className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">A premium price</h3>
              <p className="text-sm text-muted-foreground">
                $149/mo CAD versus IXACT's $46.75/mo billed annually (currency not stated on its site). You pay
                more, for French or English per contact, a consent record on each contact and a rule-based lead score.
              </p>
            </Card>

            {/* These two cards both offered a migration done by Realtor Desk
                staff. There is no migration service: the agent moves their
                own contacts by CSV. */}
            <Card className="p-6">
              <Upload className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">A CSV import you run yourself</h3>
              <p className="text-sm text-muted-foreground">
                Export your IXACT contacts as a CSV file and import that file yourself. Nobody at Realtor Desk moves your data for you. Try twenty rows first. The{" "}
                <Link to="/features/import-contacts" className="underline">import documentation</Link>{" "}
                lists the columns it reads.
              </p>
            </Card>

            <Card className="p-6">
              <Check className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Contacts only, then a guarantee</h3>
              <p className="text-sm text-muted-foreground">
                The import creates contacts only: no deals, history or consent. Record the date and source of consent before you email a contact; the{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">CASL guide</Link>{" "}
                explains the consent windows. A 30-day money-back
                guarantee applies if it isn't right for you.
              </p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                Book a Demo
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                See Pricing Details
              </Button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VsIxact;