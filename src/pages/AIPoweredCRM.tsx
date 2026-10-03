import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /features/ai-powered-crm — rewritten 2026-10-02.
//
// The site's navigation describes this page as "the specific places AI does
// work, and where it stops". The previous page did the opposite. It said
// Realtor Desk "uses machine learning to predict leads" (the score is a
// rule-based weighting), showed example leads at "Hot Lead - 94%" and a
// scripted 24/7 chatbot conversation that books a viewing, promised "AI
// determines optimal contact timing" and "7 perfectly-timed touches, you never
// lifted a finger", compared itself on a "Canadian Market Data" row, and closed
// with an "Agents Using Our AI See: 41% ..." block of outcome statistics.
// None of those capabilities or numbers exist. A code comment on the old page
// already recorded that a "Canadian Market Intelligence" section had been
// removed for the same reason; the rest of the page had not caught up.
//
// WHAT IS TRUE, AND WHERE IT COMES FROM (public/knowledge-base.json, checked
// against the code on 2026-10-02):
//   lead score        0-100, a weighted combination of factors, with the factors
//                     and a suggested next action shown on the lead. Rule-based.
//                     Accuracy has never been measured.
//   AI assistant      inside the app, requires sign-in, sees the contact you
//                     have open, drafts a reply, summarises a thread, talks
//                     through a next step, in English or French.
//   nothing is sent   without you. There is no lead-facing chatbot, no voice
//                     agent, no automated sequences (the builder exists;
//                     scheduled sending is not switched on).

const DOES: { title: string; body: string }[] = [
  {
    title: "A lead score with its working shown",
    body: "Each lead gets a 0 to 100 score built from factors such as engagement, behaviour, budget match, timeline and qualification. The factors are listed beside the score, so you can see why a lead is ranked where it is and overrule it. It is a rule-based weighting, not a trained model.",
  },
  {
    title: "A suggested next action",
    body: "Beside the score the product suggests what to do next and when. It is a prompt for your attention: you decide, and you send.",
  },
  {
    title: "An assistant on the contact you have open",
    body: "Inside the app, the assistant can see the contact in front of you and draft a reply, summarise the thread, or talk through a next step, in English or French. It needs you signed in, and it works on one contact at a time.",
  },
];

const DOES_NOT: string[] = [
  "Contact a lead on its own. Nothing is sent without you.",
  "Run a chatbot on your website or answer leads out of hours.",
  "Make or take calls. There is no voice agent.",
  "Send scheduled email sequences. The builder exists, but scheduled sending is not switched on.",
  "Predict prices, forecast the market or value a property.",
  "Choose the best time to contact someone. It suggests; it does not optimise.",
  "Measure its own accuracy. How well the score predicts outcomes has not been studied.",
];

const FAQS = [
  {
    q: "Is the lead score machine learning?",
    a: "No. It is a rule-based weighting of factors such as engagement, behaviour, budget match, timeline and qualification, with the factors shown on the lead. That makes it explainable, and it also means nobody has tested how well it predicts a sale.",
  },
  {
    q: "Does the AI reply to my leads for me?",
    a: "No. The assistant drafts and summarises inside the app for the contact you have open. Nothing is sent to a lead until you send it, which also keeps you on the right side of CASL consent.",
  },
  {
    q: "Is there an AI chatbot for my website?",
    a: "Not today. The assistant is internal to the CRM and needs a signed-in user. It does not answer leads unattended.",
  },
  {
    q: "Does the assistant work in French?",
    a: "Yes. It can draft and summarise in English or French, and the language of a client's messages is recorded per contact.",
  },
  {
    q: "Where does the AI process my data?",
    a: "AI-assisted features send the content they work on to an outside AI provider, which may process it outside Canada. The database itself runs in Canada. Our PIPEDA page explains the difference between where records are stored and where each processing step happens.",
  },
];

const AIPoweredCRM = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="AI-Powered CRM for Real Estate | Realtor Desk"
        description="Where AI helps in Realtor Desk: a lead score with its factors shown, an in-app assistant that drafts replies, and a plain list of what it does not do."
        keywords="AI CRM real estate, AI powered CRM Canada, real estate lead scoring, AI assistant for realtors, explainable lead scoring"
        canonicalUrl="https://www.realtordesk.ai/features/ai-powered-crm"
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
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/features" className="hover:underline">
                Platform
              </Link>
              <span aria-hidden="true"> / </span>
              <span>AI in the CRM</span>
            </nav>
            <h1 className="mb-6">AI in a real estate CRM: where it helps, and where it stops</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk uses AI in three specific places. It does not contact your
              leads, run a chatbot or forecast the market, and this page lists both
              sides so you can judge it.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">Short answer</h2>
              <p className="text-base mb-0">
                The AI ranks your leads, suggests a next step and drafts text for you
                to review. You stay the sender of every message. That is a smaller
                claim than most &ldquo;AI CRM&rdquo; pages make, and it is the one the
                product can back.
              </p>
            </Card>

            <div>
              <h2 className="mb-6">What the AI does</h2>
              <ul className="space-y-6 list-none p-0">
                {DOES.map((d) => (
                  <li key={d.title} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{d.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-0">{d.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4">What it does not do</h2>
              <ul className="space-y-3 list-none p-0">
                {DOES_NOT.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-muted-foreground">
                    <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Why it is built this way</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under CASL the burden of proving consent is on the sender, so a system
                that messages leads on its own creates risk in your name. Keeping the
                human as the sender is a deliberate constraint, and it is why the
                assistant drafts rather than sends.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Showing the factors behind a score is the same instinct. A number you
                cannot inspect is a number you cannot argue with, and you know your
                leads better than a weighting does.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <div>
              <h2 className="mb-4">Related</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <Link to="/features/ai-lead-scoring" className="underline">
                    How the lead score works
                  </Link>
                </li>
                <li>
                  <Link to="/features/ai-lead-follow-up" className="underline">
                    Follow-up: a suggested next action, not an auto-reply
                  </Link>
                </li>
                <li>
                  <Link to="/pipeda-compliance" className="underline">
                    What the product does about privacy
                  </Link>
                </li>
                <li>
                  <Link to="/ai-crm-canadian-real-estate-agents-guide" className="underline">
                    A guide to AI CRMs for Canadian agents
                  </Link>
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">See it on your own leads</h2>
              <p className="text-muted-foreground mb-6">
                14 days, then CAD $149 a month. A card is collected up front and
                nothing is charged before day 14.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Start free trial</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/features">See the platform</Link>
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

export default AIPoweredCRM;
