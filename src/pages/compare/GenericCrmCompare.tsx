import { useEffect, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

// Shared layout for "Realtor Desk vs <generic horizontal CRM>" pages.
// The angle is honest: generic CRMs are powerful but built for B2B sales,
// not real estate. Content (comparison rows, intro, FAQ) is unique per
// competitor — no thin duplication, no fabricated claims about the competitor.

export interface GenericCompareData {
  slug: string;
  competitor: string;
  title: string;
  description: string;
  keywords: string;
  intro: ReactNode;
  rows: { capability: string; realtorDesk: string; competitor: string; competitorHas: boolean }[];
  faqs: { q: string; a: string }[];
}

export const GenericCrmCompare = ({ data }: { data: GenericCompareData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const url = `https://www.realtordesk.ai/${data.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Realtor Desk vs ${data.competitor}`,
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
        <div className="container-custom text-center max-w-3xl">
          <Badge variant="secondary" className="mb-4">Comparison</Badge>
          <h1 className="mb-6">
            Realtor Desk vs <span className="gradient-text">{data.competitor}</span>
          </h1>
          <div className="text-xl text-muted-foreground space-y-4 text-left">{data.intro}</div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-10">Feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Capability</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary">Realtor Desk</th>
                  <th className="text-center py-3 px-4 font-semibold">{data.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.capability} className="border-b">
                    <td className="py-3 px-4 font-medium">{r.capability}</td>
                    <td className="py-3 px-4 text-center">
                      <Check className="w-4 h-4 text-accent inline mr-1" />
                      <span className="text-muted-foreground">{r.realtorDesk}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.competitorHas ? (
                        <Check className="w-4 h-4 text-muted-foreground inline mr-1" />
                      ) : (
                        <X className="w-4 h-4 text-destructive inline mr-1" />
                      )}
                      <span className="text-muted-foreground">{r.competitor}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Comparison reflects Realtor Desk's positioning for Canadian real estate agents.
            {" "}{data.competitor} is a capable general-purpose platform; verify its current
            features and pricing on its own site.
          </p>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-10">Common questions</h2>
          <div className="space-y-4">
            {data.faqs.map((f) => (
              <Card key={f.q} className="p-6">
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="mb-4">Purpose-built beats general-purpose for real estate</h2>
          <p className="text-muted-foreground mb-8">
            AI-native CRM for Canadian REALTORS® — bilingual, PIPEDA-native, CASL-aware, CAD
            pricing from $149/month. 14-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start free trial</Button></Link>
            <Link to="/features"><Button size="lg" variant="outline">See features</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
