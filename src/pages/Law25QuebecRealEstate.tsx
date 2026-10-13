import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /law-25-quebec-real-estate — written 2026-10-12. French twin:
// /fr/loi-25-courtier-immobilier (src/pages/fr/Loi25CourtierImmobilier.tsx). The
// two are paired in src/config/hreflangPairs.ts, so keep them saying the same
// thing: a change here needs the same change there.
//
// WHY THIS PAGE EXISTS. "loi 25" is the largest compliance query in the Canadian
// keyword set (about 6,600 searches a month) and "law 25 quebec" is low
// difficulty. The site mentioned Law 25 in passing on four pages and explained it
// on none. A Quebec broker choosing a CRM has to answer Law 25 questions about
// it (where the data sits, whether it leaves Quebec, whether it can be exported),
// and that is the angle no general explainer covers.
//
// WHERE EVERY LEGAL STATEMENT COMES FROM. The Commission d'accès à l'information
// du Québec, "Principaux changements apportés par la Loi 25", read 12 October
// 2026 (SOURCE below). Dates are given only where that page gives them. The
// "In practice" column is our reading for a brokerage and is worded as a prompt,
// not a ruling. This is general information and says so on the page.
//
// PRODUCT STATEMENTS: database region and outside processors as on
// /pipeda-compliance; consent date and source per contact; data export in
// Settings; rule-based lead score. It claims no certification and does not say
// the product makes anyone compliant.

const SOURCE =
  "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25";
const CHECKED = "12 October 2026";

type Duty = { duty: string; rule: string; practice: string };

const DUTIES: Duty[] = [
  {
    duty: "A person in charge",
    rule: "The person with the highest authority in the business is responsible for protecting personal information and can delegate the role in writing. The title and contact details must be published on the business's website.",
    practice: "If you work under an agency, ask who holds the role. If you run your own, it is you until you delegate it.",
  },
  {
    duty: "Governance policies",
    rule: "A business must set and apply policies and practices covering retention and destruction, staff roles and responsibilities, and a process for complaints, and publish detailed information about them.",
    practice: "Write down how long you keep client files, who can open them and how a client complains.",
  },
  {
    duty: "A privacy policy",
    rule: "A business that collects personal information by technological means must publish a privacy policy in clear and simple terms and give notice when it changes.",
    practice: "A lead form on your website is collection by technological means.",
  },
  {
    duty: "Transparency at collection",
    rule: "Since September 2023, when collecting, a business must state the purposes, the means, the rights of access and rectification, the right to withdraw consent, the third parties involved, and whether the information may be communicated outside Quebec.",
    practice: "Check that your forms and your first conversation with a client cover each point.",
  },
  {
    duty: "Consent",
    rule: "Since September 2023, consent must be requested for each purpose in clear and simple terms. A written request has to be presented separately from other information. Information cannot be used for another purpose without consent, subject to exceptions.",
    practice: "Agreeing to be contacted about one listing is not agreeing to a newsletter. Ask for each.",
  },
  {
    duty: "Privacy impact assessment",
    rule: "An assessment is required before communicating personal information outside Quebec (since September 2023) and for any project to acquire, develop or overhaul an information system that involves personal information. It is proportionate to the sensitivity and quantity of the information.",
    practice: "Choosing a new CRM is the kind of project the rule describes. Ask where the vendor stores and processes data.",
  },
  {
    duty: "Confidentiality incidents",
    rule: "A business must notify the Commission and the people concerned of an incident that presents a risk of serious injury, and keep a register of incidents.",
    practice: "A lost laptop or an email sent to the wrong client goes in the register, even when no notice is needed.",
  },
  {
    duty: "Profiling and identification",
    rule: "A business that collects information using technology able to identify, locate or profile a person must say so beforehand and explain how those functions are activated. They cannot be on by default.",
    practice: "Ask your vendors whether any tool scores or tracks contacts, and what you need to tell clients about it.",
  },
  {
    duty: "Automated decisions",
    rule: "A person must be told when a decision about them is based exclusively on automated processing, and be given the chance to present observations to a member of staff who can review it.",
    practice: "Keep a person in every decision that affects a client.",
  },
  {
    duty: "Portability",
    rule: "Since 22 September 2024, on request, a business must give a person the computerised personal information collected from them in a structured, commonly used technological format.",
    practice: "Check that you can export one client's record from your CRM.",
  },
];

const VENDOR_QUESTIONS = [
  "In which country and region is the database hosted?",
  "Which outside providers receive client data, for what, and where do they process it?",
  "Can I export one person's record in a structured format, and all my data if I leave?",
  "Can I delete a contact, and what happens to backups?",
  "How and how fast will you tell me about a confidentiality incident?",
  "Does the product score, track or profile contacts, and can I see how?",
  "Is anything sent to a contact without a person approving it?",
];

const FAQS = [
  {
    q: "What is Law 25 in Quebec?",
    a: "Law 25 is the common name for the Quebec statute, adopted in 2021, that modernised the province's privacy laws, including the Act respecting the protection of personal information in the private sector. Its changes came into force in stages in September 2022, September 2023 and September 2024.",
  },
  {
    q: "Does Law 25 apply to real estate brokers?",
    a: "The private-sector Act makes any person who carries on an enterprise responsible for the personal information they hold. A broker or agency that keeps client names, contact details and financial information holds personal information. How the duties are shared between a broker and an agency is a question for your agency or a privacy lawyer.",
  },
  {
    q: "Is Law 25 the same as PIPEDA?",
    a: "No. PIPEDA is the federal private-sector privacy law. Law 25 amended Quebec's own Act, which generally governs how a business handles personal information inside Quebec. A Quebec broker who also works across provincial borders may need to consider both.",
  },
  {
    q: "Can I keep client data in a CRM hosted outside Quebec?",
    a: "The law does not forbid it, but an assessment comes first. Since September 2023 a privacy impact assessment is required before personal information is communicated outside Quebec. The transfer can go ahead if the assessment shows the information would be adequately protected, and it must be covered by a written agreement.",
  },
  {
    q: "What are the penalties under Law 25?",
    a: "The Commission d'accès à l'information can impose administrative monetary penalties on businesses that contravene the private-sector Act. The Commission's own summary gives the example that these could reach 2% of worldwide turnover or 10 million dollars. Those are ceilings, not typical amounts.",
  },
  {
    q: "Does using Realtor Desk make me compliant with Law 25?",
    a: "No. Software cannot make a business compliant. Realtor Desk hosts its database in Canada, records the date and source of consent for each contact and lets you export your data. The assessment, the policies, the person in charge and the incident register remain yours.",
  },
];

const Law25QuebecRealEstate = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Law 25 for Quebec Real Estate Brokers"
        description="What Quebec's Law 25 asks of a real estate broker, taken from the privacy regulator's own summary, and the questions it raises about your CRM."
        keywords="law 25 quebec, law 25 real estate, quebec law 25 compliance, loi 25, quebec privacy law real estate broker, law 25 crm"
        canonicalUrl="https://www.realtordesk.ai/law-25-quebec-real-estate"
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
              <Link to="/canadian-market" className="hover:underline">
                Canada
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Law 25</span>
            </nav>
            <h1 className="mb-6">Law 25 for Quebec real estate brokers</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              What Quebec&rsquo;s privacy law asks of a business that holds client information,
              what that looks like in a brokerage, and the questions it should make you ask
              about your CRM. General information, not legal advice.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              <Link to="/fr/loi-25-courtier-immobilier" className="underline" hrefLang="fr-CA">
                Lire cette page en français
              </Link>
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">Short answer</h2>
              <p className="text-base mb-0">
                Law 25 updated Quebec&rsquo;s private-sector privacy Act in three stages, in
                September 2022, 2023 and 2024. A business that holds personal information must
                name a person in charge, publish its privacy practices, ask for consent purpose
                by purpose, assess the privacy impact before sending information outside Quebec
                or adopting a new system, keep a register of incidents, and hand a person their
                data in a usable format on request.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">What the law requires</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The middle column summarises the Commission d&rsquo;accès à l&rsquo;information
                du Québec&rsquo;s own overview, read on {CHECKED}. The right-hand column is our
                suggestion for a brokerage, not a ruling.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">
                    Law 25 obligations, what the regulator says, and what to do in a brokerage.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Obligation</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">What the regulator says</th>
                      <th scope="col" className="py-2 font-semibold">In practice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUTIES.map((d) => (
                      <tr key={d.duty} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{d.duty}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{d.rule}</td>
                        <td className="py-3 text-muted-foreground">{d.practice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Source:{" "}
                <a className="underline" href={SOURCE} rel="noopener noreferrer" target="_blank">
                  Commission d&rsquo;accès à l&rsquo;information du Québec, main changes made by
                  Law 25
                </a>{" "}
                (in French). The Commission notes that its summaries do not have the force of
                law; the statute prevails.
              </p>
            </div>

            <div>
              <h2 className="mb-4">The penalties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Commission can impose administrative monetary penalties on businesses that
                contravene the private-sector Act. Its summary gives the example that these
                could reach 2% of worldwide turnover or 10 million dollars. Those are ceilings.
                A business that has contravened the Act can also give the Commission an
                undertaking to remedy it.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Seven questions to ask any CRM vendor</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A CRM holds most of the personal information a broker collects, so it sits in
                the middle of the assessment. These are worth asking in writing:
              </p>
              <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5">
                {VENDOR_QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="mb-4">How Realtor Desk answers them</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>The production database and file storage run in Canada, in the ca-central-1 region.</li>
                <li>
                  Some features send content to outside providers, such as SMS delivery, email
                  delivery and the drafting assistant, and those providers may process it
                  outside Canada. Your assessment should cover that.
                </li>
                <li>
                  The date and source of consent are recorded for each contact, and a message is
                  refused when no consent is on record.
                </li>
                <li>You can export your data from Settings, and delete a contact.</li>
                <li>
                  The lead score is rule-based and the record shows how each part contributed. A
                  score built from a contact&rsquo;s engagement may fall within what the Act
                  calls profiling, so decide with your advisor what you tell clients.
                </li>
                <li>Nothing is sent to a contact without you.</li>
                <li>The interface and client email work in French, set per contact.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                What it does not do: carry out your assessment, write your privacy policy, name
                your person in charge or keep your incident register. We hold no security
                certification and do not claim one. More detail is on the{" "}
                <Link to="/pipeda-compliance" className="underline">
                  privacy page
                </Link>
                .
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
                  <Link to="/resources/casl-compliance-real-estate-email-marketing-canada" className="underline">
                    CASL for real estate email
                  </Link>
                  , the federal anti-spam law, which applies in Quebec as well.
                </li>
                <li>
                  <Link to="/resources/casl-implied-consent-calculator" className="underline">
                    The implied consent calculator
                  </Link>
                  , for working out when you can no longer rely on an inquiry.
                </li>
                <li>
                  <Link to="/features/bilingual-crm" className="underline">
                    Bilingual workflows
                  </Link>{" "}
                  in Realtor Desk.
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">A CRM hosted in Canada, in French and English</h2>
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

export default Law25QuebecRealEstate;
