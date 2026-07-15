import { useEffect, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MapPin, CheckCircle2, type LucideIcon } from "lucide-react";

// Shared presentational layout for province landing pages. Layout is DRY;
// the CONTENT (regulator, privacy law, boards, market, FAQ) is unique per
// province and passed in via `data` — this keeps each page genuinely
// differentiated (not thin/near-duplicate) while staying maintainable.

export interface ProvinceData {
  slug: string; // e.g. "real-estate-crm-british-columbia"
  province: string; // "British Columbia"
  demonym: string; // "BC"
  title: string; // <60 chars incl brand handled by SEO
  description: string; // <155
  keywords: string;
  heroLede: string;
  reasons: { icon: LucideIcon; title: string; body: string }[];
  complianceHeading: string;
  complianceBody: ReactNode;
  faqs: { q: string; a: string }[];
}

export const ProvinceLanding = ({ data }: { data: ProvinceData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const url = `https://www.realtordesk.ai/${data.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Real Estate CRM for ${data.province} REALTORS®`,
      description: data.description,
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={data.title}
        description={data.description}
        keywords={data.keywords}
        canonicalUrl={url}
        structuredData={structuredData}
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1" /> Built for {data.province}
          </Badge>
          <h1 className="mb-6">
            The <span className="gradient-text">{data.province}</span> real estate CRM, powered by AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">{data.heroLede}</p>
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

      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-4">Why {data.demonym} agents choose Realtor Desk</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            US-built CRMs weren't made for {data.province}'s rules, its clients, or its markets.
            This one was.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {data.reasons.map(({ icon: Icon, title, body }) => (
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

      <section className="section-padding bg-muted">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-6">{data.complianceHeading}</h2>
          <div className="space-y-4 text-muted-foreground">{data.complianceBody}</div>
          <p className="text-sm italic text-muted-foreground mt-4">
            This page is general information for {data.province} REALTORS®, not legal advice.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-12">{data.demonym} REALTOR® questions</h2>
          <div className="space-y-4">
            {data.faqs.map((f) => (
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

      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="mb-4">Ready to out-respond every other agent in your market?</h2>
          <p className="text-muted-foreground mb-8">
            Bilingual, Canadian-compliant, CAD pricing from $149/month. 14-day free trial — no
            credit card to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start free trial</Button></Link>
            <Link to="/pricing"><Button size="lg" variant="outline">See pricing</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
