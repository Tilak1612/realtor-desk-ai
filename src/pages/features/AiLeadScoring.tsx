import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 09 of the keyword plan: "AI lead scoring real estate". The plan found
// no dedicated vendor page for it, and asks that the score be explained as a
// prompt rather than presented as a verdict.
//
// Every number below is read out of supabase/functions/calculate-lead-score,
// not described from memory: five components summing to 100, capped there, and
// a confidence value derived from how much of the input was actually present.

const BANDS: [string, string, string][] = [
  ["30", "Engagement", "Email open rate, click rate and reply rate, plus a bonus for recent contact."],
  ["30", "Behaviour", "Site visits, property views and document activity."],
  ["20", "Budget match", "How many listings are actually available in their stated range."],
  ["15", "Timeline", "What they told you about when they intend to move."],
  ["5", "Qualification", "Whether the basics — budget, timeline, financing — are on the record."],
];

const FAQS = [
  {
    q: "What is AI lead scoring in real estate?",
    a: "It is a number between 0 and 100 that ranks how engaged a lead is, calculated from how they have behaved rather than how they felt on the phone. In Realtor Desk it combines five inputs: engagement, behaviour, budget match, timeline and qualification. It tells you who to call first on a busy morning; it does not tell you who will buy.",
  },
  {
    q: "How is the score calculated?",
    a: "Engagement contributes up to 30 points, behaviour up to 30, budget match up to 20, stated timeline up to 15, and qualification completeness up to 5. The total is capped at 100. Each component is shown as its own percentage so you can see which one moved the number.",
  },
  {
    q: "Can I see why a lead scored what it did?",
    a: "Yes — that is the point of showing five components rather than one number. A lead sitting at 62 because of strong engagement is a different call from a lead at 62 because there is a lot of inventory in their price range.",
  },
  {
    q: "What if the score is wrong?",
    a: "Treat it as a prompt, not a verdict. The model only sees recorded activity, so a client who phones you directly and never opens an email will score lower than they deserve. Realtor Desk also reports a confidence value based on how complete the underlying data is — a high score on thin data is flagged rather than hidden.",
  },
  {
    q: "Does the score do anything on its own?",
    a: "No. Nothing is sent, moved or actioned because of a score. It orders your list and suggests a next action and a sensible time to make contact. You decide what happens.",
  },
];

const AiLeadScoring = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="AI Lead Scoring for Real Estate: How It Works"
        description="How Realtor Desk scores leads 0-100 from engagement, behaviour, budget match, timeline and qualification — and why the score is a prompt, not a verdict."
        keywords="ai lead scoring real estate, real estate lead scoring, lead scoring crm, predictive lead scoring realtors"
        canonicalUrl="https://www.realtordesk.ai/features/ai-lead-scoring"
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
            <h1 className="mb-6">AI lead scoring for real estate</h1>
            {/* Direct answer first, per the plan's citation-ready recipe. */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              AI lead scoring ranks each lead from 0 to 100 on how they have
              actually behaved — what they opened, what they viewed, what they told
              you and whether anything is available in their price range. It decides
              the order you work your list in on a busy morning. It does not predict
              who will buy, and in Realtor Desk it never acts on its own.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What the number is made of</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Five components, weighted as below, summed and capped at 100. Each
                is shown separately in the app, so the score is auditable rather
                than a black box.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-semibold">Max points</th>
                      <th className="text-left py-2 pr-4 font-semibold">Component</th>
                      <th className="text-left py-2 font-semibold">What feeds it</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BANDS.map(([pts, name, feeds]) => (
                      <tr key={name} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-semibold tabular-nums">{pts}</td>
                        <td className="py-3 pr-4">{name}</td>
                        <td className="py-3 text-muted-foreground">{feeds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">A worked example</h2>
              <p className="text-muted-foreground leading-relaxed">
                Two leads both sit at 62. The first got there on engagement — every
                email opened, two replies, contact last week — with a vague
                timeline. The second got there on budget match and timeline: there
                are twelve listings in their range and they said ninety days, but
                they have not opened anything in a fortnight. Those are different
                calls. The first is a conversation you continue; the second is one
                you restart, probably by phone. A single number would have hidden
                that, which is why the components are shown.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What it does not do</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  It does not send anything. No email, no text, no task is triggered
                  by a score changing.
                </li>
                <li>
                  It does not see what it was not told. A client who only ever calls
                  you will score low, and that is a limitation of the input, not a
                  judgement about them.
                </li>
                <li>
                  It is not a valuation or a probability of sale, and we will not
                  present it as one.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Realtor Desk reports a confidence value alongside the score, derived
                from how much of the underlying data was actually present. A
                confident 40 is more useful than an unreliable 85.
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
              <h2 className="mb-3">See it on your own leads</h2>
              <p className="text-muted-foreground mb-6">
                Scoring is included on every plan. Bilingual EN/FR, data hosted in
                Canada, priced in CAD.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/features">See all features</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pricing">View pricing</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Related:{" "}
                <Link to="/features/ai-lead-follow-up" className="underline">
                  how AI helps with follow-up
                </Link>{" "}
                ·{" "}
                <Link to="/what-is-a-real-estate-crm" className="underline">
                  what a real estate CRM is
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

export default AiLeadScoring;
