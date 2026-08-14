import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MapPin, Clock, Shield, Globe, Zap, CheckCircle2 } from "lucide-react";

// Ontario province landing page. Intentionally Ontario-specific (TRESA/RECO,
// TRREB, GTA market) rather than a templated location page — thin, near-
// duplicate location pages get demoted by Google's Helpful Content system.
// No fabricated stats: regulatory/market facts only.

const CrmOntario = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: "Is Realtor Desk compliant with Ontario real estate rules (TRESA/RECO)?",
      a: "Realtor Desk is built around Canadian privacy and anti-spam law (PIPEDA and CASL) that applies to Ontario REALTORS®, with consent tracking and data-export tools. It supports your record-keeping under the Trust in Real Estate Services Act, 2002 (TRESA), which replaced REBBA in December 2023 and is administered by the Real Estate Council of Ontario (RECO). It does not replace your brokerage's own compliance program — it gives you the records infrastructure to support it. This is general information, not legal advice.",
    },
    {
      q: "Does it work for TRREB and other Ontario boards?",
      a: "Yes. Realtor Desk is board-agnostic and works for agents across the Toronto Regional Real Estate Board (TRREB) and every other Ontario board. Native CREA DDF® integration (Canadian MLS data) is on the Q3 2026 roadmap.",
    },
    {
      q: "Why does lead response speed matter so much in the GTA?",
      a: "Greater Toronto Area markets are among the most competitive in Canada — multiple agents often contact the same online lead within minutes. Realtor Desk's 24/7 AI follow-up responds to inbound leads in seconds, so you engage first even when you're in a showing or offer night.",
    },
    {
      q: "Does it support French for Ontario's francophone clients?",
      a: "Yes. Realtor Desk is fully bilingual (EN/FR), which helps agents serving Ontario's francophone communities in Ottawa, the northeast, and beyond communicate in each client's preferred language.",
    },
    {
      q: "How much does it cost in Canadian dollars?",
      a: "Pricing is in CAD, starting at $149/month — no US-dollar exchange exposure. There's a 14-day free trial with no credit card required to start.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Real Estate CRM for Ontario REALTORS®",
      description:
        "AI-powered, bilingual CRM built for Ontario real estate agents — TRESA/RECO-aware, PIPEDA-native, CASL-compliant, CAD pricing.",
      url: "https://www.realtordesk.ai/real-estate-crm-ontario",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const reasons = [
    {
      icon: Clock,
      title: "Win the GTA speed-to-lead race",
      body: "In Toronto, Mississauga, Ottawa, and Hamilton, the first agent to respond usually wins the lead. 24/7 AI follow-up replies in seconds — during showings, offer nights, and long weekends.",
    },
    {
      icon: Shield,
      title: "Built for TRESA & RECO record-keeping",
      body: "Consent tracking (CASL), data export (PIPEDA), and a full activity history give you the audit-ready records that support your obligations under Ontario's Trust in Real Estate Services Act.",
    },
    {
      icon: Globe,
      title: "Bilingual for Ontario's clients",
      body: "Serve francophone clients in Ottawa and Northern Ontario in French, and everyone else in English — the same CRM, both languages, no bolt-on.",
    },
    {
      icon: Zap,
      title: "AI lead scoring & qualification",
      body: "Every inbound lead is scored and qualified before your first call, so you spend your limited hours on the buyers and sellers most likely to transact this cycle.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate CRM for Ontario REALTORS® | Realtor Desk"
        description="AI CRM built for Ontario real estate agents — TRESA/RECO-aware, PIPEDA-native, CASL-compliant, bilingual EN/FR, CAD pricing. 14-day free trial."
        keywords="real estate CRM Ontario, CRM for Ontario REALTORS, Ontario real estate software, TRESA CRM, RECO CRM, TRREB CRM, bilingual real estate CRM Ontario, AI CRM Ontario"
        canonicalUrl="https://www.realtordesk.ai/real-estate-crm-ontario"
        structuredData={structuredData}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1" /> Built for Ontario
          </Badge>
          <h1 className="mb-6">
            The <span className="gradient-text">Ontario</span> real estate CRM, powered by AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From the GTA to Ottawa to the North — Realtor Desk helps Ontario REALTORS® respond to
            leads first, stay onside with TRESA and CASL, and serve clients in English or French.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient">Start your 14-day free trial</Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">Book a 15-min demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Ontario agents choose it */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-4">Why Ontario agents choose Realtor Desk</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            US-built CRMs weren't made for Ontario's rules, its bilingual clients, or its
            hyper-competitive urban markets. This one was.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {reasons.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="p-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ontario compliance context */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-6">Ontario compliance, without the guesswork</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              In December 2023, the <strong>Trust in Real Estate Services Act, 2002 (TRESA)</strong>{" "}
              fully replaced REBBA as the law governing Ontario real estate, administered by the{" "}
              <strong>Real Estate Council of Ontario (RECO)</strong>. On top of that, every Ontario
              REALTOR® is subject to federal <Link to="/pipeda-compliance-real-estate-ai-tools-canada">PIPEDA</Link>{" "}
              privacy law and{" "}
              <Link to="/resources/casl-compliance-real-estate-email-marketing-canada">CASL</Link>{" "}
              anti-spam rules for client email and SMS.
            </p>
            <p>
              Realtor Desk gives you the infrastructure to support all three: timestamped consent
              records for CASL, one-click data export for PIPEDA access requests, and a complete,
              retained activity history per contact. It doesn't replace your brokerage's compliance
              program — it makes the records it depends on effortless. For the deeper how-to, see our{" "}
              <Link to="/ai-crm-canadian-real-estate-agents-guide">AI CRM guide for Canadian agents</Link>.
            </p>
            <p className="text-sm italic">
              This page is general information for Ontario REALTORS®, not legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-12">Ontario REALTOR® questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <Card key={f.q} className="p-6">
                <h3 className="font-semibold mb-2 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  {f.q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="mb-4">Ready to out-respond every other agent in your market?</h2>
          <p className="text-muted-foreground mb-8">
            Bilingual, TRESA-aware, PIPEDA-native, CAD pricing from $149/month. 14-day free trial —
            no credit card to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient">Start free trial</Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">See pricing</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CrmOntario;
