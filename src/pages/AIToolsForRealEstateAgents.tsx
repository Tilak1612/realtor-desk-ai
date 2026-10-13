import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /ai-tools-for-real-estate-agents — written 2026-10-12.
//
// WHY THIS PAGE EXISTS. "ai for real estate agents", "ai tools for real estate
// agents" and "ai assistant for real estate agents" are searched in both
// countries at low difficulty. The site's AI pages are all about AI inside a
// CRM. This one is the wider category question a buyer asks first: what kinds of
// AI tool exist, and what should I check before using one with client data.
//
// WHAT IT DOES NOT DO. It does not rank products. We build one of them and have
// not tested the others side by side, so a "best of" list would be an invented
// ranking. It names four general assistants only as examples of a category. It
// states two things about competitors, each read from the vendor's own site on
// 12 October 2026 and worded as "lists" or "describes", not as our assessment:
//   Follow Up Boss lists smart summaries, suggested tasks, smart messages and
//     predictive lead prioritisation        followupboss.com/pricing
//   Lofty describes its "Sales Agent" as a virtual ISA working 24/7
//                                           lofty.com/price-packages (site nav)
// It carries no statistics about adoption, time saved or results.
//
// PRODUCT STATEMENTS: drafting assistant, rule-based score with the breakdown
// shown, suggested next action, nothing sent without the agent, no chatbot, no
// voice, no automatic replies. Same as /features/ai-powered-crm.

const CHECKED = "12 October 2026";

const KINDS: { kind: string; does: string; check: string }[] = [
  {
    kind: "General assistants",
    does: "Draft and rewrite text, summarise a long document, turn notes into an email. ChatGPT, Claude, Gemini and Copilot are examples.",
    check: "What happens to what you paste in. Leave client names and financial details out unless you know how the tool stores and uses them.",
  },
  {
    kind: "CRM assistants",
    does: "Work inside your contact records: draft a reply, summarise a conversation, suggest a task, rank leads.",
    check: "Whether you can see why a lead ranks where it does, and whether anything is sent without your approval.",
  },
  {
    kind: "Automated responders",
    does: "Answer new leads by text, chat or voice without a person, and try to book an appointment.",
    check: "Consent for the messages it sends, whether it says it is automated, and who answers for a wrong reply.",
  },
  {
    kind: "Listing and marketing writers",
    does: "Produce a listing description, a social post or an ad from a few facts about the property.",
    check: "Every fact in the output. You are responsible for the accuracy of your advertising, whoever drafted it.",
  },
  {
    kind: "Image tools",
    does: "Virtual staging, photo clean-up, and rendering a room in a different finish.",
    check: "Your regulator's and board's rules on altered images, and whether the picture still represents the property fairly.",
  },
  {
    kind: "Transcription and notes",
    does: "Record a call or a meeting and return a transcript, a summary and a list of follow-ups.",
    check: "Consent to record, where the audio is kept, and the summary against what was actually said.",
  },
  {
    kind: "Valuation and market tools",
    does: "Estimate a price or describe a market from listing and sales data.",
    check: "Where the data comes from and how old it is. An estimate is not an appraisal.",
  },
];

const QUESTIONS = [
  "What does it do with the information I give it, and in which country is that processed?",
  "Does it send anything to a client without me reading it first?",
  "Can I see why it produced a score, a ranking or a recommendation?",
  "What does it cost once the trial ends, and is that price published?",
  "If it gets something wrong in front of a client, how would I find out?",
];

const FAQS = [
  {
    q: "What are the best AI tools for real estate agents?",
    a: "It depends on the job. For drafting and summarising, a general assistant is enough. For prioritising leads and follow-up, look at the assistant inside a CRM. For answering leads automatically, look at automated responders, with care about consent. We do not rank products: we build one and have not tested the others side by side.",
  },
  {
    q: "Can I use ChatGPT for real estate?",
    a: "Yes, for drafting. A general assistant is useful for a first version of a listing description, an email or a summary of a long document. Check every fact it gives you, because it can state things that are wrong, and do not paste client personal information into it unless you know how that information is stored and used.",
  },
  {
    q: "Is it safe to put client information into an AI tool?",
    a: "Only if you know where it goes. In Canada you remain responsible for personal information you pass to a service provider. Read what the tool does with inputs, where it processes them and whether they are used for training, and tell clients where the law asks you to. When unsure, leave identifying details out.",
  },
  {
    q: "Will AI replace real estate agents?",
    a: "Nothing in what these tools do today suggests it. They draft, summarise, sort and remind. Advising a client, negotiating and being accountable to a regulator are the licensed parts of the work, and they stay with the agent. The likelier change is in how much of the routine an agent does by hand.",
  },
  {
    q: "Do I have to tell clients I used AI?",
    a: "There is no single rule. It depends on your province, your regulator and what the tool did. An altered listing photo or an automated reply raises different questions from a drafted email you read and sent yourself. Ask your brokerage, and check your regulator's guidance before you rely on a tool in front of clients.",
  },
  {
    q: "What AI does Realtor Desk use?",
    a: "An assistant that drafts messages for you to review, and a suggested next action for each lead. The lead score is rule-based, not machine learning, and the record shows how each part contributed. Realtor Desk has no chatbot, no voice agent and no automatic replies: nothing is sent without you.",
  },
];

const AIToolsForRealEstateAgents = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="AI Tools for Real Estate Agents: A Guide"
        description="The seven kinds of AI tool a real estate agent will meet, what each one does, and what to check before using it with client information. No rankings."
        keywords="ai tools for real estate agents, ai for real estate agents, ai assistant for real estate agents, ai real estate assistant, ai for realtors, will ai replace real estate agents"
        canonicalUrl="https://www.realtordesk.ai/ai-tools-for-real-estate-agents"
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
              <Link to="/resources" className="hover:underline">
                Resources
              </Link>
              <span aria-hidden="true"> / </span>
              <span>AI tools for real estate agents</span>
            </nav>
            <h1 className="mb-6">AI tools for real estate agents</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A plain guide to the kinds of AI tool on offer, what each is good for, and what to
              check before you let one near client information. It does not rank products.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">Short answer</h2>
              <p className="text-base mb-0">
                AI tools for real estate agents fall into seven groups: general assistants, CRM
                assistants, automated responders, listing and marketing writers, image tools,
                transcription tools and valuation tools. Most are useful for drafting,
                summarising and sorting. The ones that message clients by themselves need the
                most care, because consent and accuracy remain your responsibility.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">The seven kinds</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">
                    Kinds of AI tool for real estate agents, what each does and what to check.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Kind</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">What it does</th>
                      <th scope="col" className="py-2 font-semibold">What to check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KINDS.map((k) => (
                      <tr key={k.kind} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{k.kind}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{k.does}</td>
                        <td className="py-3 text-muted-foreground">{k.check}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">How CRM vendors describe their AI</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vendors use the word for very different things, so read the feature list and not
                the label. Two examples, each taken from the vendor&rsquo;s own site on {CHECKED}:
              </p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  Follow Up Boss lists smart summaries, suggested tasks, smart messages and
                  predictive lead prioritisation, and notes that several of them rely on data
                  from its calling feature.
                </li>
                <li>
                  Lofty describes its Sales Agent as a virtual ISA that works around the clock to
                  turn leads into appointments.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The first is assistance for the agent. The second acts for the agent. That
                difference matters more than which product has more features, because it decides
                who is writing to your clients.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Five questions before you pay for one</h2>
              <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5">
                {QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="mb-4">In Canada: consent and privacy still apply</h2>
              <p className="text-muted-foreground leading-relaxed">
                An automated message is still a commercial electronic message. Under the
                anti-spam law it needs consent, has to identify you and has to carry an
                unsubscribe, whoever or whatever wrote it. Passing client information to an AI
                service is a transfer to a service provider, and you remain responsible for it.
                Our pages on{" "}
                <Link to="/pipeda-compliance-real-estate-ai-tools-canada" className="underline">
                  PIPEDA and AI tools
                </Link>
                ,{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">
                  CASL for real estate email
                </Link>{" "}
                and{" "}
                <Link to="/law-25-quebec-real-estate" className="underline">
                  Quebec&rsquo;s Law 25
                </Link>{" "}
                go further. This is general information, not legal advice.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Where Realtor Desk sits</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Realtor Desk is a CRM assistant, in the second group, and a deliberately narrow
                one:
              </p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>An assistant drafts a message. You read it and send it.</li>
                <li>Each lead gets a suggested next action and a time to take it.</li>
                <li>
                  The lead score runs from 0 to 100 on fixed rules, and the record shows how each
                  part contributed. It is not a prediction.
                </li>
                <li>
                  There is no chatbot, no voice agent and no automatic reply. Nothing is sent
                  without you.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                More on{" "}
                <Link to="/features/ai-powered-crm" className="underline">
                  where AI helps in the CRM
                </Link>{" "}
                and in the{" "}
                <Link to="/ai-crm-canadian-real-estate-agents-guide" className="underline">
                  guide to AI CRMs for Canadian agents
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">See the drafting assistant on your own leads</h2>
              <p className="text-muted-foreground mb-6">
                14-day trial; a card is collected up front and nothing is charged before day 14.
                Then CAD $149 a month for one agent.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Start free trial</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/demo">Book a demo</Link>
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

export default AIToolsForRealEstateAgents;
