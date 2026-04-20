import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, X, AlertTriangle, ArrowRight, Users, Brain, Globe, Shield, Zap, MessageSquare } from "lucide-react";
import { SEO } from "@/components/SEO";

const SwitchFromLionDesk = () => {
  const faqs = [
    {
      q: "When is LionDesk shutting down?",
      a: "LionDesk is being fully migrated to Lone Wolf Relationships by September 2025. After that date, LionDesk will no longer be available as a standalone product. If you're on LionDesk, now is the time to migrate."
    },
    {
      q: "Can you import my LionDesk contacts and data?",
      a: "Yes. We offer free data migration from LionDesk including contacts, deal history, notes, and tags. Our team handles the migration for you — no tech skills required. Most migrations complete within 24 hours."
    },
    {
      q: "How does RealtorDesk AI compare to LionDesk on price?",
      a: "LionDesk was $39/month USD. RealtorDesk AI starts at $149 CAD/month — which includes far more AI capability, bilingual support, and a platform purpose-built for Canadian agents. CREA DDF® (Canadian MLS) integration is on the Q3 2026 roadmap."
    },
    {
      q: "Will I lose my automation sequences when I switch?",
      a: "No. We'll help you recreate your LionDesk drip campaigns and action plans in RealtorDesk AI. Our AI can even improve them based on your client types and Canadian market context."
    },
    {
      q: "Is RealtorDesk AI suitable for Canadian agents?",
      a: "Yes — it's built exclusively for Canadian agents. Bilingual EN/FR support, PIPEDA-aware data handling, and Canadian market intelligence are core features today; CREA DDF® (Canadian MLS) integration is planned for Q3 2026."
    },
    {
      q: "How long does onboarding take?",
      a: "Most agents are fully set up and productive within 24-48 hours. We provide free onboarding, video tutorials, and a dedicated support contact during your first 30 days."
    },
  ];

  const comparisonRows = [
    { feature: "Pricing (CAD)", rdai: "$149/mo CAD", liondesk: "$53/mo CAD (USD)" },
    { feature: "Still Available After Sept 2025", rdai: "✓ Yes", liondesk: "✗ No — shutting down" },
    { feature: "Built for Canadian Agents", rdai: "✓ Purpose-built", liondesk: "✗ US-focused" },
    { feature: "Bilingual EN/FR", rdai: "✓ Full support", liondesk: "✗ English only" },
    { feature: "Canadian MLS Integration (CREA DDF)", rdai: "Coming Q3 2026", liondesk: "✗ None" },
    { feature: "PIPEDA-Aware Design", rdai: "✓ Built-in", liondesk: "✗ US compliance" },
    { feature: "AI Lead Scoring", rdai: "✓ Advanced", liondesk: "✓ Basic" },
    { feature: "24/7 AI Chatbot", rdai: "✓ Claude-powered", liondesk: "✓ Basic bot" },
    { feature: "Email & SMS Automation", rdai: "✓ Yes", liondesk: "✓ Yes" },
    { feature: "Free Migration", rdai: "✓ Yes", liondesk: "N/A" },
    { feature: "Free Onboarding", rdai: "✓ Yes", liondesk: "✗ No" },
    { feature: "Mobile App", rdai: "✓ iOS & Android", liondesk: "✓ Yes" },
    { feature: "Deal Pipeline", rdai: "✓ Yes", liondesk: "✓ Yes" },
    { feature: "CAD Billing", rdai: "✓ Pay in CAD", liondesk: "✗ USD only" },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="LionDesk Shutting Down? Switch to RealtorDesk AI | Best LionDesk Alternative Canada"
        description="LionDesk is shutting down in September 2025. Switch to RealtorDesk AI — Canada's AI-powered real estate CRM with free migration, bilingual support, and CREA DDF® integration on the Q3 2026 roadmap. Start your 14-day free trial today."
        keywords="LionDesk shutting down, LionDesk alternative Canada, switch from LionDesk, LionDesk migration, best CRM for Canadian realtors, LionDesk replacement"
        canonicalUrl="https://www.realtordesk.ai/switch-from-liondesk"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from LionDesk to RealtorDesk AI",
            "description": "LionDesk is shutting down September 2025. Migrate to RealtorDesk AI — Canada's AI-first real estate CRM with free migration and bilingual support.",
            "url": "https://www.realtordesk.ai/switch-from-liondesk"
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-destructive/5 to-primary/5">
        <div className="container-custom text-center">
          <Badge variant="destructive" className="mb-6 text-sm px-4 py-2">
            <AlertTriangle className="w-4 h-4 mr-2 inline" />
            LionDesk Shutting Down — September 2025
          </Badge>
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            LionDesk Is Shutting Down.<br />
            <span className="gradient-text">Your CRM Shouldn't.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Switch to RealtorDesk AI — Canada's #1 AI-powered real estate CRM. Import your contacts, deals, and automations in minutes. Free migration. No disruption to your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient text-lg px-8">
                Start Your Free 14-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Book a Migration Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">No credit card required · Free data migration · Setup in under 24 hours</p>
        </div>
      </section>

      {/* Urgency Banner */}
      <section className="bg-destructive/10 border-y border-destructive/20 py-6">
        <div className="container-custom text-center">
          <p className="text-lg font-semibold text-destructive">
            ⚠️ LionDesk is migrating all users to Lone Wolf Relationships by September 2025. Don't wait until the last minute — migrate now and get 30 days of free hands-on support.
          </p>
        </div>
      </section>

      {/* Why Switch */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-4">Why Canadian Agents Are Switching to RealtorDesk AI</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">LionDesk was built for the US market. RealtorDesk AI is built for you.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center border-primary/20">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Built for Canada</h3>
              <p className="text-muted-foreground">Bilingual EN/FR, PIPEDA-aware design, and CAD pricing. Not a US platform retrofitted for Canada. CREA DDF® (Canadian MLS) integration coming Q3 2026.</p>
            </Card>
            <Card className="p-6 text-center border-primary/20">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">More Powerful AI</h3>
              <p className="text-muted-foreground">Claude-powered AI chatbot, predictive lead scoring, and automated follow-ups that LionDesk's basic bot never matched.</p>
            </Card>
            <Card className="p-6 text-center border-primary/20">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Migrate in Minutes</h3>
              <p className="text-muted-foreground">Free white-glove migration from LionDesk. Contacts, notes, deals, and automations — all moved for you within 24 hours.</p>
            </Card>
            <Card className="p-6 text-center border-primary/20">
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 AI Chatbot</h3>
              <p className="text-muted-foreground">Never miss a lead again. Our AI chatbot qualifies leads, answers questions, and books showings in both English and French, around the clock.</p>
            </Card>
            <Card className="p-6 text-center border-primary/20">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">PIPEDA-Aware</h3>
              <p className="text-muted-foreground">Canadian privacy law built into the platform — consent tracking, breach notification protocols, and data handling designed for Canadian compliance obligations.</p>
            </Card>
            <Card className="p-6 text-center border-primary/20">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Canadian Support</h3>
              <p className="text-muted-foreground">Real support from people who understand the Canadian real estate market. No overseas call centres. No generic scripts.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <h2 className="text-center mb-4">LionDesk vs RealtorDesk AI</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">See why Canadian agents are making the switch before LionDesk disappears</p>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">RealtorDesk AI</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">LionDesk</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-t ${i % 2 === 0 ? "" : "bg-muted/30"}`}>
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-3 px-4 text-green-600 font-medium">{row.rdai}</td>
                    <td className={`text-center py-3 px-4 ${row.liondesk.startsWith("✗") ? "text-destructive" : "text-muted-foreground"}`}>{row.liondesk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Migration Steps */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-4">How to Switch in 3 Easy Steps</h2>
          <p className="text-center text-muted-foreground mb-12">Your business keeps running — we handle the technical work</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-bold mb-2">Start Your Free Trial</h3>
              <p className="text-muted-foreground text-sm">Sign up in 2 minutes. No credit card required. Your 14-day free trial starts immediately.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-bold mb-2">We Migrate Your Data</h3>
              <p className="text-muted-foreground text-sm">Export your LionDesk data and send it to us. We import everything — contacts, notes, deals, tags — within 24 hours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-bold mb-2">Start Closing More Deals</h3>
              <p className="text-muted-foreground text-sm">Get a personal onboarding session. Your AI chatbot, lead scoring, and automation are live within 48 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-bold text-lg mb-3">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="container-custom max-w-3xl text-center">
          <Badge className="mb-4">⏰ LionDesk Shuts Down September 2025</Badge>
          <h2 className="mb-6">Don't Wait. Switch Today.</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of Canadian agents who have already made the switch. Start your 14-day free trial and experience a CRM that was actually built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient text-lg px-10">
                Start Free Trial — No Credit Card
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg px-10">
                Book a Live Migration Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Free data migration · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SwitchFromLionDesk;
