import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /features/conversations — the second of the brief's three unbuilt feature
// pages whose capability already ships.
//
// VERIFIED 2026-09-28 against production:
//   public.conversation_messages — channel, author, author_name, body,
//     language, sent_at, system_note, lead_id
//   public.contact_activities   — activity_type, title, description,
//     metadata, activity_date
//   activity_type enum          — email_sent, email_received, call_made,
//     call_received, sms_sent, sms_received, meeting_held, note_added,
//     status_changed, tag_added, tag_removed, property_viewed, deal_created,
//     deal_updated
//   public.sms_consent          — consent is recorded, not assumed
//
// The `language` column per message is the detail worth building the page
// around: it is what makes "bilingual" a product fact rather than a marketing
// one. Not claimed: WhatsApp, a shared team inbox, call recording, or
// transcription of anything we do not generate ourselves.

const FAQS = [
  {
    q: "What lands in the timeline?",
    a: "Emails sent and received, calls made and received, SMS both directions, meetings held, notes, and the structural things that are easy to forget — a status change, a tag, a property viewed, a deal created. Each one is stamped and attached to the contact.",
  },
  {
    q: "Why does a message record a language?",
    a: "Because language is a property of the client, not of your account. Each message stores the language it was written in, so a Montreal client can be worked entirely in French while your own interface stays in English. That is the difference between a bilingual product and a translated marketing site.",
  },
  {
    q: "Can I send from here?",
    a: "Email and SMS, yes. SMS goes through Twilio and is refused outright when there is no consent record for that contact — consent is a row in the database, not a checkbox someone remembers to tick. Nothing is ever sent automatically on your behalf.",
  },
  {
    q: "Is this a shared team inbox?",
    a: "No. Conversations belong to the agent who owns the contact, and there is no seat or assignment model in the product to share them with. If you need a team inbox, this is not it yet.",
  },
  {
    q: "Do you record or transcribe calls?",
    a: "We do not record calls. A call gets an entry with whatever you note against it, and where we generate a summary from something we already hold, it is labelled as generated. We do not claim to transcribe a conversation we were never part of.",
  },
];

const Conversations = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="One client conversation, not five threads"
        description="Calls, emails, SMS and notes attached to the contact in one timeline — each message recording the language the client is actually worked in."
        keywords="crm conversation history, client communication timeline, real estate crm messaging, bilingual client email"
        canonicalUrl="https://www.realtordesk.ai/features/conversations"
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
              <span>Conversations</span>
            </nav>
            <h1 className="mb-6">One conversation per client, not five</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Calls, emails, texts, notes and appointments attach to the
              contact. Before you pick up the phone,{" "}
              <em>what did I last tell this person?</em> has one answer in one
              place.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">The problem is not storage, it is retrieval</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every one of those messages already exists somewhere. It is in
                your sent folder, your phone, a sticky note, or a colleague&rsquo;s
                memory. The cost is not that the history is lost; it is the
                ninety seconds of searching before every call, and the one time
                in ten you skip the search and open with something you already
                said.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A single timeline per contact removes the search. That is the
                whole feature, and it is worth more than it sounds.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What the timeline holds</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>Email, in and out.</li>
                <li>Calls, in and out, with your notes against them.</li>
                <li>SMS, in and out, gated on a recorded consent.</li>
                <li>Meetings held, and notes added.</li>
                <li>
                  The quiet events that explain the gaps — a status change, a
                  tag, a property viewed, a deal created.
                </li>
                <li>
                  The language each message was written in, stored per message.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Language is a property of the client</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most CRMs treat language as an account setting: you pick one and
                everything you send is in it. That breaks the moment you have
                one francophone client and an English-speaking practice. Here
                the language rides on the contact and is recorded on each
                message, so the timeline shows you what the client actually
                received rather than what your interface happened to be set to.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Consent is a row, not a habit</h2>
              <p className="text-muted-foreground leading-relaxed">
                Under CASL the burden of proving consent is yours. Consent is
                stored against the contact, and an SMS send without one is
                refused rather than attempted. It is a constraint we chose:
                software that sends generously on your behalf creates liability
                in your name, not ours.
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
                  <Link to="/features/casl-compliant-email" className="underline">
                    CASL-aware email
                  </Link>{" "}
                  — how consent is recorded and enforced.
                </li>
                <li>
                  <Link to="/features/bilingual-crm" className="underline">
                    Bilingual workflows
                  </Link>{" "}
                  — the rest of what per-contact language changes.
                </li>
                <li>
                  <Link to="/features/pipeline" className="underline">
                    The pipeline
                  </Link>{" "}
                  — where these conversations end up.
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Put a week of your own follow-ups in it</h2>
              <p className="text-muted-foreground mb-6">
                14 days, $149 CAD a month after. Nothing charged before day 14.
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

export default Conversations;
