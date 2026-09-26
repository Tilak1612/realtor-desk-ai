import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Targets "what is real estate crm" (50/mo in Canada, keyword difficulty 5 —
// the lowest-difficulty term with real volume in the whole cluster) plus
// "what is real estate crm software". The Canadian SERP for this query is an
// AI Overview over Salesforce, HubSpot, Capterra and Colibri, so the page is
// written for extraction: the definition is answered in the first two
// sentences, every section leads with its answer, and the People Also Ask
// questions are mirrored in FAQPage schema.
//
// Distinct intent from the commercial head term ("real estate crm", served by
// the homepage) and from "real estate crm canada" (served by /canadian-market),
// so the three do not compete.

const FAQS = [
  {
    q: "What is a real estate CRM?",
    a: "A real estate CRM is software that stores every lead and client in one database, tracks the conversations you have with them, and tells you who to follow up with next. It replaces the mix of spreadsheets, phone notes and inbox searches most agents use to keep track of their pipeline.",
  },
  {
    q: "What does CRM stand for in real estate?",
    a: "CRM stands for customer relationship management. In real estate it means managing relationships with buyers, sellers and past clients over a sales cycle that often runs for months or years before a transaction closes.",
  },
  {
    q: "How is a real estate CRM different from a general CRM?",
    a: "A general CRM is built around a short B2B sales cycle. A real estate CRM is built around long nurture periods, property and listing context attached to each contact, and follow-up that has to survive months of no activity. The record types differ too: a real estate CRM tracks properties and showings, not deals in a quarter.",
  },
  {
    q: "Do I need a CRM as a solo real estate agent?",
    a: "A CRM earns its place as soon as you have more leads than you can remember. The common failure for solo agents is not losing a lead outright but letting a warm one go cold because the follow-up was never scheduled. That is the specific problem a CRM solves.",
  },
  {
    q: "What should a Canadian agent look for in a real estate CRM?",
    a: "Three things a US-built CRM usually does not cover: where the client data is stored and whether that satisfies PIPEDA, whether consent and unsubscribe handling fits CASL, and whether the interface and client-facing email work in French as well as English.",
  },
];

const WhatIsARealEstateCRM = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="What Is a Real Estate CRM?"
        description="A real estate CRM keeps every lead, client and conversation in one place and tells you who to follow up next — and how to choose one in Canada."
        keywords="what is real estate crm, what is real estate crm software, what does crm stand for in real estate, crm in real estate industry"
        canonicalUrl="https://www.realtordesk.ai/what-is-a-real-estate-crm"
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
        <section className="pt-32 md:pt-40 pb-12">
          <div className="container-custom max-w-3xl">
            <h1 className="mb-6">What is a real estate CRM?</h1>

            {/* The answer, in the first two sentences, for AI Overview and
                featured-snippet extraction. */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              A real estate CRM is software that keeps every lead and client in one
              database, records the conversations you have with them, and tells you who
              to follow up with next. It replaces the mix of spreadsheets, phone notes
              and inbox searches most agents use to track their pipeline.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What CRM stands for</h2>
              <p className="text-muted-foreground leading-relaxed">
                CRM stands for <strong>customer relationship management</strong>. The
                term comes from B2B sales software, where a deal closes in a quarter. In
                real estate the same idea has to stretch over a much longer cycle — a
                buyer who enquires today may not transact for eighteen months, and a past
                client is a referral source for years after closing.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What a real estate CRM actually does</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most real estate CRMs cover four jobs. The details differ between
                products, but the shape is consistent:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    h: "Captures leads in one place",
                    p: "Enquiries from your website, portals, open houses and referrals land in a single list instead of several inboxes.",
                  },
                  {
                    h: "Keeps the history of each relationship",
                    p: "Calls, emails, notes and appointments attach to the contact, so you can see the whole thread before you pick up the phone.",
                  },
                  {
                    h: "Shows where each opportunity stands",
                    p: "A pipeline view groups contacts by stage — new, contacted, viewing, offer — so nothing sits untouched.",
                  },
                  {
                    h: "Schedules the next follow-up",
                    p: "Tasks and reminders are attached to the client record, which is what stops a warm lead going cold.",
                  },
                ].map((item) => (
                  <Card key={item.h} className="p-5">
                    <h3 className="text-base font-semibold mb-2">{item.h}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.p}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4">
                How it differs from a general-purpose CRM
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You can run a real estate business on a general CRM, and plenty of agents
                start that way. The friction shows up in three places: a general CRM has
                no concept of a property or a showing, its reporting assumes deals close
                within a quarter, and its automation is built for a sales team rather than
                one agent working a database of past clients. A real estate CRM models
                those things directly.
              </p>
            </div>

            <div>
              <h2 className="mb-4">
                What Canadian agents should check before choosing one
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most of the best-known real estate CRMs are built for the US market. Three
                questions are worth asking before you commit:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <strong>Where does client data live?</strong> Personal information you
                  hold about Canadian clients is subject to PIPEDA, and where it is stored
                  and who can access it matters.
                </li>
                <li>
                  <strong>Does the email handling fit CASL?</strong> Canada&rsquo;s
                  anti-spam law sets rules for consent and unsubscribe that differ from
                  the US CAN-SPAM regime.
                </li>
                <li>
                  <strong>Does it work in French?</strong> If you serve Quebec or any
                  bilingual market, both the interface and the client-facing email need to
                  work in French, not just a translated marketing site.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We wrote more about the Canadian side of this on our{" "}
                <Link to="/canadian-market" className="underline">
                  built for Canada
                </Link>{" "}
                page, and compared the main options in our{" "}
                <Link to="/blog/best-crm-canada-2025" className="underline">
                  guide to choosing a CRM in Canada
                </Link>
                .
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
              <h2 className="mb-3">See what one looks like</h2>
              <p className="text-muted-foreground mb-6">
                Realtor Desk is a real estate CRM built for Canadian agents — bilingual,
                with data hosted in Canada and priced in CAD.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/features">Explore the features</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pricing">View pricing</Link>
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

export default WhatIsARealEstateCRM;
