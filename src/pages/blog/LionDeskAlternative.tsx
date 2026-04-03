import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";

const LionDeskAlternative = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const alternatives = [
    {
      rank: 1,
      name: "RealtorDesk AI",
      tag: "Best for Canadian Agents",
      price: "$149 CAD/month",
      verdict: "Best overall LionDesk alternative for Canadian realtors",
      pros: [
        "Purpose-built for Canadian agents — CAD pricing, bilingual EN/FR",
        "Claude-powered AI chatbot included (no expensive add-ons)",
        "Canadian MLS data integration",
        "PIPEDA-aware design and FINTRAC record-keeping support",
        "Free migration from LionDesk",
        "AI lead scoring, deal pipeline, task management all in one",
      ],
      cons: [
        "Newer platform — smaller user community than legacy CRMs",
        "Fewer third-party integrations than Follow Up Boss (growing rapidly)",
      ],
      bestFor: "Canadian agents who want AI-powered automation, bilingual support, and Canadian compliance features without a US-platform premium."
    },
    {
      rank: 2,
      name: "Lone Wolf Relationships",
      tag: "Official LionDesk Successor",
      price: "Contact for pricing",
      verdict: "The official LionDesk migration path — but not AI-first",
      pros: [
        "Official successor product from Lone Wolf Technologies (Canadian company)",
        "Deep Canadian MLS integration via Lone Wolf ecosystem",
        "Familiar workflow for LionDesk users",
        "Used by major Canadian brokerages",
      ],
      cons: [
        "No standalone AI chatbot or lead scoring",
        "Pricing not transparent — requires sales call",
        "Part of a larger software bundle; complexity may not suit solo agents",
        "Transition may still disrupt existing workflows",
      ],
      bestFor: "Agents already using other Lone Wolf products (Authentisign, Back Office) who want to stay in the same ecosystem."
    },
    {
      rank: 3,
      name: "Wise Agent CRM",
      tag: "Best Budget Alternative",
      price: "$49 USD/month",
      verdict: "The most affordable replacement with solid core features",
      pros: [
        "Very affordable at $49 USD/month all-inclusive",
        "Strong email/SMS drip campaigns",
        "24/7 live customer support — rare in the industry",
        "Forbes Advisor Best Real Estate CRM 3 years running",
        "AI writing assistant included",
      ],
      cons: [
        "Built for US market — limited Canadian MLS support",
        "Priced in USD (adds ~35% for Canadian agents)",
        "No bilingual French support",
        "No PIPEDA or FINTRAC awareness",
        "AI chatbot is basic compared to newer platforms",
      ],
      bestFor: "Solo agents on a tight budget who primarily need contact management and email drips, and whose client base doesn't require French-language support."
    },
    {
      rank: 4,
      name: "Follow Up Boss",
      tag: "Best for Teams",
      price: "$69–$1,000 USD/month",
      verdict: "Industry-leading team CRM — expensive and US-focused",
      pros: [
        "200+ integrations — widest ecosystem in real estate CRM",
        "Excellent team workflow and lead routing",
        "Gold standard for accountability and reporting",
        "Owned by Zillow — strong Zillow/Realtor.com lead ingestion",
      ],
      cons: [
        "Pricing in USD — significant premium for Canadian agents",
        "AI chatbot requires expensive add-ons ($499+/month for Structurely)",
        "No bilingual support, no Canadian MLS native integration",
        "No PIPEDA or FINTRAC awareness",
        "Team plans start at $499 USD/month",
      ],
      bestFor: "Large Canadian teams with US clients or agents who need the deepest integration ecosystem and are willing to pay the USD premium."
    },
    {
      rank: 5,
      name: "AgentLocator",
      tag: "Best Canadian Alternative (Non-AI)",
      price: "$249 CAD/month",
      verdict: "Strong Canadian MLS coverage but weak AI",
      pros: [
        "CAD pricing — no currency conversion",
        "Native multi-board Canadian MLS integration",
        "PPC campaign management integrated",
        "Built specifically for Canadian realtors",
      ],
      cons: [
        "No advanced AI chatbot or lead scoring",
        "More expensive than Wise Agent or RealtorDesk AI entry plans",
        "Limited French/bilingual support",
        "Smaller feature set compared to AI-first platforms",
      ],
      bestFor: "Canadian agents who prioritize native MLS integration above AI automation and prefer to use human follow-up over AI-assisted nurturing."
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Best LionDesk Alternative for Canadian Realtors in 2026"
        description="LionDesk is shutting down in 2025. Here are the best LionDesk alternatives for Canadian real estate agents — with honest pros, cons, and pricing. RealtorDesk AI, Lone Wolf, Wise Agent, Follow Up Boss, and AgentLocator compared."
        keywords="liondesk alternative, liondesk shutting down, liondesk migration Canada, best CRM replace liondesk, liondesk replacement Canadian realtors, switch from liondesk 2025"
        article
        publishedTime="2026-04-02"
        modifiedTime="2026-04-02"
        author="RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/blog/best-liondesk-alternative-canadian-realtors"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Best LionDesk Alternative for Canadian Realtors in 2026",
            "description": "LionDesk is shutting down. The best alternatives for Canadian real estate agents — RealtorDesk AI, Lone Wolf, Wise Agent, Follow Up Boss, and AgentLocator compared.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2026-04-02",
            "dateModified": "2026-04-02"
          }
        ]}
      />
      <Navbar />

      <article className="pt-32 pb-20">
        <div className="container-custom max-w-4xl">

          {/* Breadcrumb */}
          <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <Badge variant="destructive" className="mb-4">
            <AlertTriangle className="w-3 h-3 mr-1" />
            LionDesk Shutting Down — September 2025
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Best LionDesk Alternative for Canadian Realtors in 2026
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> April 2, 2026</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
          </div>

          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              LionDesk — the beloved $39/month real estate CRM used by tens of thousands of agents across North America — is being discontinued. Lone Wolf Technologies, which acquired LionDesk in 2021, is migrating all LionDesk users to its new platform, Lone Wolf Relationships, by <strong>September 2025</strong>.
            </p>
            <p className="text-muted-foreground mb-6">
              If you're a Canadian realtor on LionDesk, you have a decision to make: migrate to Lone Wolf Relationships, or take this opportunity to find a better-fit platform. For Canadian agents in particular, this is actually a great opportunity — because no US-based CRM was ever truly built for your market.
            </p>
            <p className="text-muted-foreground mb-6">
              We compared the top alternatives across pricing, AI capabilities, Canadian market features, and ease of migration. Here's what we found.
            </p>

            <Card className="p-6 bg-primary/5 border-primary/20 mb-8">
              <h3 className="font-bold text-lg mb-2">TL;DR — Quick Recommendation</h3>
              <p className="text-muted-foreground">
                For most Canadian agents, <strong>RealtorDesk AI</strong> is the best LionDesk replacement. It's purpose-built for Canada, includes a Claude-powered AI chatbot (something LionDesk never had), offers Canadian MLS integration, bilingual support, CAD pricing, and free migration. <Link to="/switch-from-liondesk" className="text-primary underline">Start your free 14-day trial here.</Link>
              </p>
            </Card>
          </div>

          {/* Why LionDesk is Shutting Down */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Is LionDesk Shutting Down?</h2>
            <p className="text-muted-foreground mb-4">
              LionDesk was acquired by Lone Wolf Technologies in 2021. Lone Wolf has been consolidating its product portfolio, and LionDesk is being replaced by their newer platform, <strong>Lone Wolf Relationships</strong>.
            </p>
            <p className="text-muted-foreground mb-4">
              The timeline: LionDesk will be fully migrated to Lone Wolf Relationships by September 2025. After that, the LionDesk brand and platform will cease to operate as a standalone product.
            </p>
            <p className="text-muted-foreground">
              This affects agents in Canada, the US, and internationally. The migration is not optional — if you're on LionDesk, you need to act now.
            </p>
          </section>

          {/* What Canadian Agents Should Look For */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">What Canadian Agents Should Look For in a LionDesk Replacement</h2>
            <p className="text-muted-foreground mb-6">
              LionDesk worked fine for basic CRM tasks. But it was never designed for Canada. When you switch, look for a platform that actually addresses Canadian real estate needs:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "CAD Pricing", desc: "Pay in Canadian dollars. USD-priced tools cost 30–40% more after conversion." },
                { title: "Canadian MLS Integration", desc: "Import and sync property data from Canadian MLS boards natively." },
                { title: "Bilingual EN/FR", desc: "Serve Quebec clients and francophone leads in their first language." },
                { title: "PIPEDA-Aware Design", desc: "Canadian privacy law must be baked in — not bolted on after the fact." },
                { title: "FINTRAC Support", desc: "Record-keeping infrastructure for your AML compliance obligations." },
                { title: "Real AI Features", desc: "Not just email templates — genuine AI lead scoring and 24/7 chatbot." },
              ].map((item, i) => (
                <Card key={i} className="p-4 border-primary/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{item.title}:</span>{" "}
                      <span className="text-muted-foreground text-sm">{item.desc}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* The Alternatives */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Top 5 LionDesk Alternatives for Canadian Realtors</h2>
            <div className="space-y-8">
              {alternatives.map((alt) => (
                <Card key={alt.rank} className={`p-8 ${alt.rank === 1 ? "border-2 border-primary/40 bg-primary/5" : ""}`}>
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl font-bold text-primary">#{alt.rank}</span>
                        <h3 className="text-2xl font-bold">{alt.name}</h3>
                        {alt.rank === 1 && <Badge className="bg-primary text-white">Editor's Pick</Badge>}
                      </div>
                      <Badge variant="secondary">{alt.tag}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{alt.price}</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 italic">{alt.verdict}</p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Pros</h4>
                      <ul className="space-y-2">
                        {alt.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-destructive">Cons</h4>
                      <ul className="space-y-2">
                        {alt.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <span className="font-semibold">Best for: </span>
                    <span className="text-muted-foreground text-sm">{alt.bestFor}</span>
                  </div>

                  {alt.rank === 1 && (
                    <div className="mt-4">
                      <Link to="/switch-from-liondesk">
                        <Button className="btn-gradient">
                          Switch to RealtorDesk AI — Free Migration
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The Bottom Line</h2>
            <p className="text-muted-foreground mb-4">
              LionDesk served a lot of agents well for years. But its shutdown is an opportunity — not just a disruption. The real estate CRM space has changed dramatically with AI, and the platforms available today are far more capable than what LionDesk offered.
            </p>
            <p className="text-muted-foreground mb-4">
              For Canadian agents specifically, the right choice depends on your priorities:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>If you want the best AI + Canadian features:</strong> RealtorDesk AI at $149 CAD/month</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>If you're already in the Lone Wolf ecosystem:</strong> Lone Wolf Relationships is the natural path</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>If budget is the primary concern:</strong> Wise Agent at $49 USD/month</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>If you're part of a large team:</strong> Follow Up Boss (with significant USD budget)</span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              Whatever you choose, don't wait until September. Migrating your contacts, automations, and workflows takes time — and you don't want to be scrambling when LionDesk goes offline.
            </p>
          </section>

          {/* CTA */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Migrate from LionDesk — Free, Today</h3>
            <p className="text-muted-foreground mb-6">
              Start your 14-day free trial of RealtorDesk AI. We'll migrate your LionDesk contacts, deals, and notes for free. Most migrations complete in under 24 hours.
            </p>
            <Link to="/switch-from-liondesk">
              <Button size="lg" className="btn-gradient text-lg px-10">
                Start Free Migration <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">No credit card required · Free migration · 14-day free trial</p>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default LionDeskAlternative;
