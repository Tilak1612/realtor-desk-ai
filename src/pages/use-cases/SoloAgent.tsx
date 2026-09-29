import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 13 of the keyword plan: "best CRM for solo real estate agent". The
// plan found only BoldTrail with a dedicated vendor page and no Canada-specific
// result owning the angle.
//
// This is the one use-case brief we can write honestly. Realtor Desk is a
// single-user product — production has no seat, team or organization model at
// all — so "built for one agent" is a description rather than a positioning
// exercise. Briefs 14 (teams) and 15 (brokerage) are NOT built for the same
// reason, and this page says so rather than leaving a buyer to find out.

const FAQS = [
  {
    q: "Do solo agents actually need a CRM?",
    a: "Once you have more leads than you can hold in your head, yes — but not for the reason vendors usually give. It is not about closing more; it is about not losing the ones you already have to a follow-up that was never scheduled.",
  },
  {
    q: "What should a solo agent pay for a CRM?",
    a: "Published prices for a single agent run from about USD $47 to $69 a month among vendors that publish at all; Realtor Desk is CAD $149. Several major platforms quote on enquiry instead. Our pricing page compares who publishes and who does not.",
  },
  {
    q: "Is a spreadsheet enough to start?",
    a: "For a while, genuinely. A spreadsheet fails in four specific places: nothing reminds you, email history lives elsewhere, two devices means two versions, and consent becomes a cell you have to remember. We publish a free template if you want to start there.",
  },
  {
    q: "What happens when I grow into a team?",
    a: "Realtor Desk does not support teams today — no seats, no assignment, no shared pipeline. Your contacts export to CSV at any time, so moving is possible, but plan for it rather than assuming we will have shipped it.",
  },
  {
    q: "Does it work in French?",
    a: "Yes. The interface and client-facing email both work in English and French, so a francophone client can be worked entirely in French.",
  },
];

const SoloAgent = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Best CRM for Solo Realtors in Canada"
        description="What a solo agent actually needs from a CRM, what to ignore, and an honest account of where a single-agent product fits — and where it does not."
        keywords="best crm for solo real estate agent, solo realtor crm, crm for independent real estate agent canada"
        canonicalUrl="https://www.realtordesk.ai/use-cases/solo-agent"
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
            <h1 className="mb-6">The best CRM for a solo real estate agent in Canada</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A solo agent needs three things from a CRM: every lead in one list, a next action with a date on it, and email that will not get them in trouble. Most of what CRMs sell beyond that is built for teams, and you will pay for it whether or not you use it.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What actually matters when you work alone</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nobody else is going to catch the follow-up you missed. That single fact should drive the whole decision. A CRM earns its place for a solo agent if it puts the next action on the client record with a date, and surfaces that list in the order the work should be done — not the order the leads arrived.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The second thing is consent. Working alone means you are also the compliance department, and CASL applies the same to one agent as to forty. A system that records consent and refuses a send without it removes a category of risk you would otherwise carry in your head.
              </p>
            </div>
            <div>
              <h2 className="mb-4">What you can safely ignore</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Round-robin lead routing, team leaderboards, agent performance dashboards, seat management and brokerage back-office. These are real features that real businesses need — but they are the reason platform pricing starts where it does, and none of them does anything for one person.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Be cautious of bundled lead generation too. It can be good value, but it makes the CRM cost impossible to compare, and it is usually the part of the contract that is hardest to leave.
              </p>
            </div>
            <div>
              <h2 className="mb-4">Where Realtor Desk fits, and where it does not</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                It fits if you are one agent who wants leads in one place, follow-up that does not depend on memory, bilingual client email and pricing in Canadian dollars you can read off a page — $149 CAD a month, no setup fee.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                It does not fit if you need a team. Realtor Desk has no seat model, no lead assignment and no shared pipeline today, so a growing team should look at a platform built for that from the start. We would rather say that here than have you discover it in month three.
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
              <h2 className="mb-3">Built for one agent</h2>
              <p className="text-muted-foreground mb-6">$149 CAD a month, no setup fee, 14-day trial. Bilingual EN/FR, data hosted in Canada.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/pricing">See pricing</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/features">See the features</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SoloAgent;
