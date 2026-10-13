import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";
import { consentWindow, type ConsentBasis } from "@/lib/caslConsent";

// /resources/casl-implied-consent-calculator — written 2026-10-12.
//
// WHY THIS PAGE EXISTS. "casl implied consent", "casl consent" and "casl
// compliance" are searched in Canada and the results are government pages and
// law-firm articles. None of them lets an agent type a date and see when the
// window closes, which is the question an agent actually has about a lead from
// an open house in the spring. The CASL guide explains the categories; this page
// does the arithmetic.
//
// WHERE THE RULES COME FROM. Canada's anti-spam legislation, S.C. 2010, c. 23,
// read on the Justice Laws website on 12 October 2026:
//   two years / six months        subsection 10(10)
//   ongoing relationships         subsection 10(14)
//   a request for consent sent
//   electronically is itself a
//   commercial message            subsection 1(3)
//   onus of proving consent       section 13
//   unsubscribe within 10
//   business days                 subsection 11(3)
// The calculator adds a period to a date (src/lib/caslConsent.ts). It does not
// decide whether a relationship exists, and the page says so.
//
// PRODUCT STATEMENT: Realtor Desk records a consent date and source per contact
// and refuses a send without one. It does NOT calculate this expiry, so the page
// does not say it does.

const ACT_URL = "https://laws-lois.justice.gc.ca/eng/acts/E-1.6/page-2.html";

const BASES: { value: ConsentBasis; label: string; dateLabel: string; period: string }[] = [
  {
    value: "inquiry",
    label: "They made an inquiry or application",
    dateLabel: "Date of the inquiry",
    period: "six months",
  },
  {
    value: "purchase",
    label: "They bought or leased from you, including your services",
    dateLabel: "Date of the purchase or lease",
    period: "two years",
  },
  {
    value: "contract",
    label: "A written contract with you has ended",
    dateLabel: "Date the contract ended",
    period: "two years",
  },
];

const RULES: { basis: string; period: string; example: string }[] = [
  {
    basis: "An inquiry or application",
    period: "Six months before the message is sent",
    example: "A buyer asks you about a listing, or a visitor asks for details at an open house.",
  },
  {
    basis: "A purchase or lease, including of a service",
    period: "Two years before the message is sent",
    example: "A client completed a transaction with you.",
  },
  {
    basis: "A written contract",
    period: "While it is in force, and two years after it ends",
    example: "A listing agreement or a buyer representation agreement.",
  },
];

const FAQS = [
  {
    q: "How long does implied consent last under CASL?",
    a: "It depends on what created the relationship. Under subsection 10(10) of the Act, an inquiry or application supports implied consent for six months. A purchase, a lease or a written contract supports it for two years, counted from the purchase or from the day the contract ended.",
  },
  {
    q: "When does the six-month period start?",
    a: "On the day of the inquiry or application. The Act looks back six months from the day you send the message, so what matters is whether an inquiry falls inside that window. A later inquiry from the same person is a new inquiry, and the six months are counted from the most recent one.",
  },
  {
    q: "Does express consent expire?",
    a: "The Act sets no time limit on express consent. It lasts until the person withdraws it, and a withdrawal has to be given effect within 10 business days. That is why it is worth asking for express consent while implied consent still allows you to write.",
  },
  {
    q: "Can I email someone to ask for consent after implied consent has run out?",
    a: "Not by email or text. Under subsection 1(3) of the Act, an electronic message that asks for consent is itself a commercial electronic message, so it needs consent too. Ask in person, by phone or on paper, or ask before the window closes.",
  },
  {
    q: "Who has to prove consent?",
    a: "The sender. Section 13 of the Act puts the onus of proving consent on the person who claims to have it. Keep the date, the source and whatever shows it: the inquiry email, the signed sheet or the form record.",
  },
  {
    q: "Does Realtor Desk calculate this for me?",
    a: "No. Realtor Desk records the date and source of consent for each contact and refuses to send when none is on record. It does not work out when implied consent runs out. Use this calculator, then set a task for a date before the window closes.",
  },
];

const todayIso = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
};

const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
};

const CaslImpliedConsentCalculator = () => {
  const [basis, setBasis] = useState<ConsentBasis>("inquiry");
  const [date, setDate] = useState("");

  const chosen = BASES.find((b) => b.value === basis) ?? BASES[0];
  const result = date ? consentWindow(basis, date, todayIso()) : null;

  return (
    <div className="min-h-screen">
      <SEO
        title="CASL Implied Consent Expiry Calculator"
        description="Enter the date of an inquiry, a purchase or the end of a contract and see when CASL implied consent runs out: six months or two years, from the Act."
        keywords="casl implied consent, casl consent, casl implied consent expiry, casl 6 months 2 years, casl compliance real estate, implied consent calculator"
        canonicalUrl="https://www.realtordesk.ai/resources/casl-implied-consent-calculator"
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
              <span>CASL implied consent calculator</span>
            </nav>
            <h1 className="mb-6">CASL implied consent calculator</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Under Canada&rsquo;s anti-spam law, implied consent from an inquiry lasts six
              months, and from a purchase or a written contract two years. Enter a date to see
              when the window closes. General information, not legal advice.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Work out a date</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="casl-basis" className="block text-sm font-medium mb-2">
                    What happened
                  </label>
                  <select
                    id="casl-basis"
                    value={basis}
                    onChange={(e) => setBasis(e.target.value as ConsentBasis)}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {BASES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="casl-date" className="block text-sm font-medium mb-2">
                    {chosen.dateLabel}
                  </label>
                  <input
                    id="casl-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-6" aria-live="polite">
                {result ? (
                  <div className="rounded-md border p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      {chosen.period.charAt(0).toUpperCase() + chosen.period.slice(1)} from that date
                    </p>
                    <p className="text-2xl font-bold mb-2">{longDate(result.until)}</p>
                    <p className="text-base mb-0">
                      {result.status === "expired" &&
                        "That window has closed. Do not rely on implied consent from this event, and do not ask for consent by email or text."}
                      {result.status === "ending" &&
                        (result.daysLeft === 0
                          ? "The window closes today. If you want to keep writing, you need express consent."
                          : "The window closes in " +
                            result.daysLeft +
                            (result.daysLeft === 1 ? " day" : " days") +
                            ". Ask for express consent now, while you can still write.")}
                      {result.status === "active" &&
                        result.daysLeft +
                          " days left. Set a reminder before then to ask for express consent."}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-0">
                    Choose what happened and enter its date. Nothing you type leaves your browser.
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4 mb-0">
                The result adds the period to your date. Leave a margin: do not plan a send for
                the last day.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">The periods, from the Act</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="text-left text-muted-foreground pb-3">
                    What creates an existing business relationship under subsection 10(10), and
                    for how long.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">What happened</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">How long it counts</th>
                      <th scope="col" className="py-2 font-semibold">In real estate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RULES.map((r) => (
                      <tr key={r.basis} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.basis}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{r.period}</td>
                        <td className="py-3 text-muted-foreground">{r.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Source:{" "}
                <a className="underline" href={ACT_URL} rel="noopener noreferrer" target="_blank">
                  S.C. 2010, c. 23, section 10
                </a>
                , on the Justice Laws website. The examples are ours. Whether a particular
                contact fits one of these is a question of fact, and sometimes one for a lawyer.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What the calculator does not decide</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <strong className="text-foreground">Whether there was a relationship.</strong>{" "}
                  A name on a list is not an inquiry. The Act asks for an inquiry, a purchase or
                  a contract.
                </li>
                <li>
                  <strong className="text-foreground">Ongoing relationships.</strong> Under
                  subsection 10(14), where a purchase involves an ongoing subscription, account
                  or similar relationship, the period starts when that relationship ends.
                </li>
                <li>
                  <strong className="text-foreground">Other kinds of implied consent.</strong>{" "}
                  The Act also covers a business address that was published or given to you,
                  under conditions. Those have no fixed period and are not calculated here.
                </li>
                <li>
                  <strong className="text-foreground">Whether your message is otherwise in order.</strong>{" "}
                  Every commercial message still has to identify you, give your contact
                  information and carry a working unsubscribe.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Before the window closes</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">Ask for express consent.</strong> Say who
                  you are, what you will send and that they can withdraw at any time.
                </li>
                <li>
                  <strong className="text-foreground">Record it.</strong> Keep the date, the
                  source and the evidence. The onus of proving consent is on the sender.
                </li>
                <li>
                  <strong className="text-foreground">Set a reminder for the rest.</strong> For
                  contacts who have not answered, stop before the date above.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">
                  CASL guide for real estate email
                </Link>{" "}
                covers the rest of the Act, and{" "}
                <Link to="/features/casl-compliant-email" className="underline">
                  CASL-aware email in Realtor Desk
                </Link>{" "}
                shows where consent is recorded and checked in the product.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Keep the consent date on the contact</h2>
              <p className="text-muted-foreground mb-6">
                Realtor Desk records the date and source of consent for each contact and refuses
                a send without it. 14-day trial; a card is collected up front and nothing is
                charged before day 14. Then CAD $149 a month.
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

export default CaslImpliedConsentCalculator;
