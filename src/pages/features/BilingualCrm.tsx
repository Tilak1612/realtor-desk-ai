import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 11 of the keyword plan: "bilingual real estate CRM". The plan found no
// category owner for this or for "French CRM for realtors", which makes it the
// cleanest opening in the set.
//
// Scope is kept to what actually ships: the interface and client-facing email
// both work in EN and FR. The marketing site's own French coverage is NOT
// claimed as complete here, because the FR variant is still client-rendered and
// invisible to non-JS crawlers — see SEO-AUDIT.md.

const FAQS = [
  {
    q: "What makes a CRM bilingual rather than translated?",
    a: "Two different things get called bilingual. One is a translated marketing site with an English product behind it. The other is an interface your team works in and email your client receives, both available in French. Realtor Desk is the second: the app and client-facing email work in English and French.",
  },
  {
    q: "Can my client receive email in French while I work in English?",
    a: "Yes. The language your team works in and the language a given client is written to are separate. A Montreal client can be corresponded with in French by an agent whose own interface is English.",
  },
  {
    q: "Does this matter outside Quebec?",
    a: "It matters anywhere you have francophone clients — parts of New Brunswick, Ontario and Manitoba included. It also matters for staff: an assistant who is more comfortable in French should not have to work in their second language to use your CRM.",
  },
  {
    q: "What about Quebec's privacy law?",
    a: "Realtor Desk hosts client data in Canada, which is the question Quebec clients most often ask. We describe how the product supports your obligations; we do not tell you that using it makes you compliant, because compliance is a property of how you operate, not of software you bought.",
  },
  {
    q: "Is the French machine-translated?",
    a: "The interface and email copy are maintained as a French translation set in the product, not generated per request. Where a string has no French translation it falls back to English rather than producing an approximation.",
  },
];

const BilingualCrm = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Bilingual Real Estate CRM (English + French)"
        description="A real estate CRM where the interface and the client-facing email both work in English and French — not a translated site with an English product behind it."
        keywords="bilingual real estate crm, french real estate crm, crm immobilier bilingue, quebec real estate crm"
        canonicalUrl="https://www.realtordesk.ai/features/bilingual-crm"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <Navbar />

      <main>
        <section className="pt-32 md:pt-40 pb-10">
          <div className="container-custom max-w-3xl">
            <h1 className="mb-6">The bilingual real estate CRM</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk works in English and French — both the interface your
              team uses and the email your client receives. That is a different
              thing from a translated marketing site with an English product behind
              it, and the difference shows up the first time a client replies in
              French.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">Two things get called &ldquo;bilingual&rdquo;</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-semibold">What is translated</th>
                      <th className="text-left py-2 pr-4 font-semibold">Marketing-site bilingual</th>
                      <th className="text-left py-2 font-semibold">Realtor Desk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["The website you bought from", "Yes", "Yes"],
                      ["The interface your team works in", "No", "Yes"],
                      ["Email your client receives", "No", "Yes"],
                      ["Client language set per contact", "No", "Yes"],
                    ].map(([row, a, b]) => (
                      <tr key={row} className="border-b last:border-0">
                        <td className="py-3 pr-4">{row}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{a}</td>
                        <td className="py-3 font-semibold">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">Why it is usually missing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most real estate CRMs are built for the United States, where
                bilingual operation is an edge case rather than a requirement.
                Retrofitting it is expensive: it is not only translating strings but
                carrying a language preference through every template, every
                notification and every client-facing message. Vendors that localise
                usually start with the marketing site, because that is the cheap
                half. It is worth checking which half you are being sold.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What we are not claiming</h2>
              <p className="text-muted-foreground leading-relaxed">
                Support in the product is not the same as legal compliance. Hosting
                data in Canada and writing to a client in their language helps you
                meet obligations under PIPEDA, CASL and Quebec's privacy rules — it
                does not discharge them. How you collect consent and handle requests
                remains yours. Our{" "}
                <Link to="/pipeda-compliance" className="underline">
                  PIPEDA page
                </Link>{" "}
                and{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">
                  CASL guide
                </Link>{" "}
                set out what the product does and where your responsibility starts.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Common questions</h2>
              <div className="space-y-6">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <h3 className="text-base font-semibold mb-2">{f.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Work in both languages</h2>
              <p className="text-muted-foreground mb-6">
                Interface and client email in EN and FR, data hosted in Canada,
                priced in CAD.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/features">See all features</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/canadian-market">Built for Canada</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Related:{" "}
                <Link to="/features/ai-lead-follow-up" className="underline">
                  AI follow-up
                </Link>{" "}
                ·{" "}
                <Link to="/blog/bilingual-marketing" className="underline">
                  bilingual real estate marketing
                </Link>
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BilingualCrm;
