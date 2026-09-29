import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 12 of the keyword plan: "CASL compliant real estate CRM". The plan
// found the query space empty and notes that consent records and working
// unsubscribe mechanics are concrete, quotable proof.
//
// Everything stated here is verifiable in the repo: an email_suppressions
// table whose comment reads "A row = never send", an sms_consent table that
// "fails CLOSED" (no row means no send), and the request-unsubscribe-link /
// process-unsubscribe edge functions that the CASL guardrail in CLAUDE.md
// forbids bypassing.
//
// What this page must never say is that using Realtor Desk makes an agent
// CASL compliant. Compliance is a property of how you operate.

const FAQS = [
  {
    q: "Does using a CASL-compliant CRM make me CASL compliant?",
    a: "No, and be wary of any vendor that says otherwise. CASL applies to you, the sender. Software can record consent, refuse a send when consent is missing, and carry a working unsubscribe — that is what Realtor Desk does. Whether your consent was validly obtained in the first place, and how you handle a withdrawal, remains your responsibility.",
  },
  {
    q: "What happens if a contact has no consent recorded?",
    a: "The send is refused. Realtor Desk fails closed on consent: no record means no marketing message, rather than sending and logging a warning. That is deliberate, and it is not a setting you can switch off.",
  },
  {
    q: "What is the difference between express and implied consent?",
    a: "Express consent is someone actively agreeing to hear from you and does not expire until withdrawn. Implied consent arises from an existing business relationship — typically time-limited under CASL. Recording which one you hold, and when it was obtained, is the part most spreadsheets get wrong, which is why the fields exist on the contact record.",
  },
  {
    q: "How does unsubscribe work?",
    a: "Every marketing email carries an unsubscribe path. A withdrawal writes to a suppression list, and a row on that list means never send — it is enforced at send time rather than being a flag someone could override in the interface.",
  },
  {
    q: "Does this cover SMS too?",
    a: "Yes. SMS consent is recorded separately from email consent, because they are separate permissions, and the send path fails closed the same way: no consent row, no text.",
  },
];

const CaslCompliantEmail = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="CASL-Compliant Email for Canadian Realtors"
        description="How Realtor Desk records consent per contact, refuses a send when it is missing, and enforces unsubscribe at send time — and where your CASL duty starts."
        keywords="casl compliant real estate crm, casl email realtors, canada anti-spam real estate, casl consent crm"
        canonicalUrl="https://www.realtordesk.ai/features/casl-compliant-email"
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
            <h1 className="mb-6">CASL-compliant email for Canadian realtors</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk records consent against each contact, refuses a
              marketing send when no consent is on file, and enforces unsubscribe
              at send time rather than as a flag in the interface. That supports
              your obligations under Canada&rsquo;s anti-spam legislation. It does
              not discharge them, and no software can.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">What the product does, and what stays yours</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-semibold">Obligation</th>
                      <th className="text-left py-2 pr-4 font-semibold">Realtor Desk</th>
                      <th className="text-left py-2 font-semibold">You</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Hold consent before sending", "Records it per contact, with a date", "Obtain it validly"],
                      ["Not send without it", "Refuses the send — fails closed", "Do not work around it"],
                      ["Identify the sender", "Carries your details on every send", "Keep them accurate"],
                      ["Provide unsubscribe", "On every marketing email", "Honour offline requests too"],
                      ["Act on withdrawal", "Suppression list enforced at send", "Stop other channels as well"],
                      ["Keep records", "Consent and suppression are stored", "Produce them if asked"],
                    ].map(([o, us, you]) => (
                      <tr key={o} className="border-b last:border-0">
                        <td className="py-3 pr-4">{o}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{us}</td>
                        <td className="py-3 text-muted-foreground">{you}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">Why &ldquo;fails closed&rdquo; matters</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most tools treat consent as a field you can filter on. That puts the
                burden on whoever builds the campaign to remember the filter. Realtor
                Desk checks at the point of sending: if there is no consent record
                for that contact, the message does not go, regardless of which list
                they ended up on. It is a smaller feature than it sounds and it
                removes a whole category of accident.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Express versus implied, and why the date matters</h2>
              <p className="text-muted-foreground leading-relaxed">
                CASL distinguishes express consent, which lasts until someone
                withdraws it, from implied consent arising out of an existing
                business relationship, which is generally time-limited. The
                practical consequence is that a contact list is not a permanent
                asset: part of it expires. Recording which kind of consent you hold
                and when you obtained it is what lets you tell the difference later,
                and it is the field a spreadsheet almost always lacks. Our{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">
                  CASL guide
                </Link>{" "}
                goes through the categories in detail.
              </p>
            </div>

            <div>
              <h2 className="mb-4">This is not legal advice</h2>
              <p className="text-muted-foreground leading-relaxed">
                We describe how the product behaves. We do not assess your
                compliance, and nothing here is a legal opinion. If you are unsure
                whether a particular list can be mailed, ask a lawyer rather than a
                CRM vendor — including this one.
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
              <h2 className="mb-3">Consent handled at send time</h2>
              <p className="text-muted-foreground mb-6">
                Bilingual EN/FR, data hosted in Canada, priced in CAD.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/features">See all features</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pipeda-compliance">PIPEDA and your client data</Link>
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

export default CaslCompliantEmail;
