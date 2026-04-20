import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, X, ArrowRight, Globe, Brain, Shield, DollarSign, MessageSquare, Zap } from "lucide-react";
import { SEO } from "@/components/SEO";

const SwitchFromFollowUpBoss = () => {
  const comparisonRows = [
    { feature: "Monthly Price", rdai: "$149 CAD/month", fub: "$69–$1,000 USD/month" },
    { feature: "Pricing Currency", rdai: "CAD — no surprises", fub: "USD — 35%+ premium for Canadians" },
    { feature: "Built for Canadian Agents", rdai: "✓ Purpose-built", fub: "✗ US-focused" },
    { feature: "Bilingual EN/FR", rdai: "✓ Full support", fub: "✗ English only" },
    { feature: "Canadian MLS Integration (CREA DDF)", rdai: "Coming Q3 2026", fub: "✗ Requires 3rd-party IDX" },
    { feature: "PIPEDA-Aware Design", rdai: "✓ Built-in", fub: "✗ US compliance" },
    { feature: "AI Chatbot", rdai: "✓ Claude-powered, 24/7", fub: "✗ Requires Structurely ($499/mo)" },
    { feature: "AI Lead Scoring", rdai: "✓ Included", fub: "✗ Basic tagging only" },
    { feature: "Email & SMS Automation", rdai: "✓ Yes", fub: "✓ Yes" },
    { feature: "Free Onboarding & Migration", rdai: "✓ Yes", fub: "✗ No" },
    { feature: "Mobile App", rdai: "✓ iOS & Android", fub: "✓ Yes" },
    { feature: "CAD Billing", rdai: "✓ Pay in CAD", fub: "✗ USD only" },
    { feature: "Setup Fee", rdai: "✓ None", fub: "✗ None (but USD pricing)" },
  ];

  const faqs = [
    {
      q: "How does RealtorDesk AI compare to Follow Up Boss for Canadian agents?",
      a: "Follow Up Boss is a strong CRM but built for the US market. It charges USD, requires expensive add-ons for AI chatbots (Structurely ~$499/mo), and lacks PIPEDA-aware data handling. RealtorDesk AI includes the AI chatbot and PIPEDA-aware design at $149 CAD/month, with CREA DDF® (Canadian MLS) integration planned for Q3 2026."
    },
    {
      q: "Can I import my Follow Up Boss data?",
      a: "Yes. We offer free migration from Follow Up Boss including all contacts, tags, notes, and deal history. Our team handles the migration — most complete within 24 hours."
    },
    {
      q: "I have 200+ integrations set up in Follow Up Boss. Will I lose those?",
      a: "Follow Up Boss's 200+ integrations are its biggest strength. RealtorDesk AI focuses on deep native integrations for Canadian agents rather than breadth. We cover the integrations that matter most today — Twilio, Google Calendar, email automation — and CREA DDF® (Canadian MLS) is planned for Q3 2026. We're adding more every quarter."
    },
    {
      q: "Does RealtorDesk AI work for teams?",
      a: "Yes. Our Team plan at $299 CAD/month includes lead distribution, team performance dashboards, shared pipelines, and dedicated account management — all in CAD."
    },
    {
      q: "Is the AI chatbot really included, or is it an add-on?",
      a: "It's fully included. No Structurely, no Ylopo, no extra monthly bill. RealtorDesk AI's 24/7 bilingual AI chatbot is built in and powered by Claude — one of the most advanced AI models available."
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from Follow Up Boss | Canadian Real Estate CRM Alternative"
        description="Switch from Follow Up Boss to RealtorDesk AI. Save on USD pricing, get a built-in AI chatbot and PIPEDA-aware design — at $149 CAD/month. CREA DDF® integration coming Q3 2026. Free migration."
        keywords="Follow Up Boss alternative Canada, switch from Follow Up Boss, Follow Up Boss vs RealtorDesk AI, Canadian real estate CRM, best CRM for Canadian realtors"
        canonicalUrl="https://www.realtordesk.ai/switch-from-follow-up-boss"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from Follow Up Boss to RealtorDesk AI",
            "description": "Canadian real estate agents switching from Follow Up Boss to RealtorDesk AI save on USD pricing and gain built-in AI chatbot and bilingual support. CREA DDF® (Canadian MLS) integration is on the Q3 2026 roadmap.",
            "url": "https://www.realtordesk.ai/switch-from-follow-up-boss"
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            🇨🇦 Built for Canadian Realtors
          </Badge>
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            Follow Up Boss Is Great for the US.<br />
            <span className="gradient-text">Canadian Agents Deserve Better.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stop paying USD, adding expensive AI chatbot add-ons, and working around a platform not built for Canadian compliance. RealtorDesk AI gives you everything Follow Up Boss doesn't — at $149 CAD/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient text-lg px-8">
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Book a Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Free migration · No credit card · Setup in 24 hours</p>
        </div>
      </section>

      {/* Key Differences */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-4">What You Get That Follow Up Boss Doesn't Offer</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">RealtorDesk AI is not a Follow Up Boss clone. It's what Canadian agents actually need.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 border-primary/20">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold mb-2">CAD Pricing — No Surprises</h3>
              <p className="text-sm text-muted-foreground">Pay in Canadian dollars. No currency conversion, no 35% USD premium. $149 CAD is $149 CAD.</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold mb-2">AI Chatbot Included</h3>
              <p className="text-sm text-muted-foreground">No Structurely add-on at $499/month. RealtorDesk AI's Claude-powered 24/7 bilingual chatbot is built in and included in every plan.</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold mb-2">Canadian MLS Integration (Q3 2026)</h3>
              <p className="text-sm text-muted-foreground">CREA DDF® integration is on the Q3 2026 roadmap. In the meantime, import listings from Realtor.ca via the built-in importer.</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold mb-2">PIPEDA-Aware Design</h3>
              <p className="text-sm text-muted-foreground">Canadian privacy law built in. Consent management, breach notification protocols, and data practices designed for Canadian agents.</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold mb-2">Full Bilingual Support</h3>
              <p className="text-sm text-muted-foreground">Full English and French interface and AI chatbot. Serve Quebec clients and francophone leads natively.</p>
            </Card>
            <Card className="p-6 border-primary/20">
              <DollarSign className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold mb-2">Free Migration Included</h3>
              <p className="text-sm text-muted-foreground">We handle your entire migration from Follow Up Boss. Contacts, tags, notes, deals — all moved for you at no cost.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <h2 className="text-center mb-12">Follow Up Boss vs RealtorDesk AI</h2>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">RealtorDesk AI</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Follow Up Boss</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-t ${i % 2 === 0 ? "" : "bg-muted/30"}`}>
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-3 px-4 text-green-600 font-medium">{row.rdai}</td>
                    <td className={`text-center py-3 px-4 ${row.fub.startsWith("✗") ? "text-destructive" : "text-muted-foreground"}`}>{row.fub}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-12">Common Questions from Follow Up Boss Users</h2>
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
          <h2 className="mb-6">Ready to Switch?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Canadian agents who've made the switch. Start your free trial — we handle the migration so you never skip a beat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient text-lg px-10">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg px-10">
                Book a Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">14-day free trial · Free migration · Cancel anytime · $149 CAD/mo</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SwitchFromFollowUpBoss;
