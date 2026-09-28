import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 10 of the keyword plan: "AI lead follow-up real estate".
//
// The plan notes Lofty owns most of the US conversation here. The honest
// Canadian angle is NOT "our AI replies to your leads" — capabilityClaims.test.ts
// already pins the fact that nothing invokes run-automation, so no automated
// first response exists. What does exist is decision support: a score with
// visible components, a recommended next action, a suggested contact time, and
// a confidence value. The page is built on that, and says plainly where the
// automation stops.

const FAQS = [
  {
    q: "Does Realtor Desk reply to leads automatically?",
    a: "No. Nothing is sent on your behalf without you. Realtor Desk tells you who to contact next, suggests an action and a sensible time, and drafts are yours to review — but the send is a decision you make. Any CRM claiming an instant autonomous reply is describing something different from this.",
  },
  {
    q: "Then what does the AI actually do for follow-up?",
    a: "Three things. It ranks the list so the lead worth calling is at the top rather than buried. It proposes a next action for each contact based on what has already happened. And it suggests when to make contact, rather than leaving that to whenever you happen to open the app.",
  },
  {
    q: "How is that different from a reminder?",
    a: "A reminder fires because you set it. These suggestions change as the lead's behaviour changes — someone who starts opening emails again moves up, and the recommended action changes with them. You still decide; the ordering just stops being first-in-first-out.",
  },
  {
    q: "Does it work in French?",
    a: "Yes. The interface and client-facing email both work in English and French, so a Quebec client can be worked entirely in French rather than through a translated marketing page.",
  },
  {
    q: "What about CASL?",
    a: "Consent is recorded per contact, and a marketing send is refused when there is no consent on file rather than attempted and logged. Every marketing email carries a working unsubscribe path. That is a constraint on the product by design, not a setting you can switch off.",
  },
];

const AiLeadFollowUp = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="AI Follow-Up for Real Estate Leads"
        description="What AI can and cannot do for real estate follow-up: it orders your list and suggests the next action and time. The send stays your decision."
        keywords="ai lead follow up real estate, real estate follow up software, automated follow up realtors, crm follow up canada"
        canonicalUrl="https://www.realtordesk.ai/features/ai-lead-follow-up"
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
            <h1 className="mb-6">AI follow-up for real estate leads</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk uses AI to decide the order you work your leads in, what
              the next action should be, and roughly when to make it. It does not
              send messages on your behalf. That is a deliberate line, and it is
              worth knowing where a product draws it before you buy one.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">The problem this actually solves</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most leads are not lost to a bad conversation. They are lost to a
                follow-up that was never scheduled, on a week when forty other
                things were. By the time you come back to the list it is sorted by
                arrival date, which is the least useful order there is — the lead
                who has opened your last four emails sits underneath one who gave a
                fake number in March.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What the AI contributes</h2>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <strong className="text-foreground">Ordering.</strong> A 0–100
                  score built from engagement, behaviour, budget match, timeline and
                  qualification, with each component shown separately so you can see
                  what moved it. Detailed on the{" "}
                  <Link to="/features/ai-lead-scoring" className="underline">
                    lead scoring page
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-foreground">A suggested next action.</strong>{" "}
                  Derived from what has already happened on the record, not a generic
                  template applied to everyone.
                </li>
                <li>
                  <strong className="text-foreground">A suggested time.</strong> When
                  contact is most likely to land, rather than whenever you next open
                  the app.
                </li>
                <li>
                  <strong className="text-foreground">A confidence value.</strong>{" "}
                  How much data the suggestion rests on. Thin input is flagged rather
                  than dressed up as certainty.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Where it stops, on purpose</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Realtor Desk does not send a message to a lead without you. There is
                no autonomous first reply, no AI answering on your behalf at 2am, and
                we are not going to imply otherwise to match a competitor's claim.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Part of that is product judgement — an unreviewed automated reply to
                a client is a real risk to your relationship and your reputation.
                Part of it is Canadian law: under CASL a marketing message needs
                recorded consent and a working unsubscribe, and a system that sends
                enthusiastically on your behalf is a system that can create exposure
                on your behalf. Consent is recorded per contact here, and a send is
                refused when it is missing.
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
              <h2 className="mb-3">Work the list in the right order</h2>
              <p className="text-muted-foreground mb-6">
                Bilingual EN/FR, CASL consent recorded per contact, data hosted in
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
                <Link to="/features/ai-lead-scoring" className="underline">
                  how the score is calculated
                </Link>{" "}
                ·{" "}
                <Link to="/features/bilingual-crm" className="underline">
                  working in French
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

export default AiLeadFollowUp;
