import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import agentSuccess from "@/assets/agent-success.jpg";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";
import { resolveSources } from "@/lib/images/resolveSources";

// /canadian-market — rewritten 2026-10-02.
//
// This is the page that owns "real estate CRM Canada", so what it says matters
// more than most. The previous version advertised, as product features:
//
//   - "TRREB data sync" and "Foreign buyer tax (NRST) calculator integration"
//   - "Luxury property pricing models" and a "foreign buyer tracking (20%
//     additional tax calculator)" for BC
//   - "Notary integration requirements" for Quebec
//   - a "Canadian Market Intelligence Dashboard" badged "Live Market Data",
//     "real-time insights powered by CREA, CMHC, and regional MLS data",
//     "$865K +4.2%", and the footer "Updated hourly from live MLS feeds"
//   - a "65%" figure beside the DDF section
//   - a hero reading "CREA DDF®, bilingual AI, and provincial compliance ... the
//     foundation"
//
// None of it exists. /ca/toronto-realtor-crm says in plain words that there is
// no TRREB integration and none is scheduled, so two pages on one site
// contradicted each other. There is no market dashboard, no MLS feed, and no
// province-specific functionality: the same product runs everywhere.
//
// WHERE EACH FACT BELOW COMES FROM
//   regulators and statutes   checked 2026-10-02 against the Office of the
//                             Privacy Commissioner of Canada ("provincial laws
//                             that may apply instead of PIPEDA") and the BC
//                             Financial Services Authority, which took over BC
//                             real estate regulation from the Real Estate
//                             Council of BC on 2021-08-01. The old page, and
//                             llms.txt, still named RECBC.
//   product facts             docs/REDESIGN-PHASE-0-AUDIT.md section 3, and
//                             public/knowledge-base.json.
//
// The page deliberately does not describe what each regulator requires. It names
// the regulator and the statute, links the primary source, and says what the
// product does. Rules change, and a CRM vendor is not where to read them.

function ResolvedImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const { avif, webp, src: fallback } = resolveSources(src);
  return (
    <picture>
      {avif && <source srcSet={avif} type="image/avif" />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}

const TODAY: { title: string; body: string }[] = [
  {
    title: "Canadian dollars, with tax handled at checkout",
    body: "Prices are in CAD and shown before tax. GST/HST, plus QST in Quebec or PST where it applies, is calculated at checkout from your billing province.",
  },
  {
    title: "French set per contact",
    body: "The language rides on the contact, so an English-speaking agent can work a francophone client in French, in the interface and in the email the client receives.",
  },
  {
    title: "A consent record for CASL",
    body: "The date and source of consent are stored on every contact, and a text message to a number with no recorded consent is refused rather than sent. It gives you proof to produce; it does not decide whether your consent was valid.",
  },
  {
    title: "A database that runs in Canada",
    body: "The production database and file storage run in the ca-central-1 region. Features that call outside services, such as SMS, email delivery and AI drafting, send the relevant content to those providers, which may process it outside Canada.",
  },
  {
    title: "Listings from Realtor.ca",
    body: "Paste a Realtor.ca address or an MLS number and the property comes into the CRM. This is an importer, not a CREA DDF® feed.",
  },
];

const NOT_YET: string[] = [
  "CREA DDF® sync. The function is a scaffold awaiting CREA credentials and is not live.",
  "Any board or MLS data feed, including TRREB. There is none, and none is scheduled.",
  "Centris for Quebec. It is on the roadmap, not built.",
  "A market data or intelligence dashboard. Realtor Desk does not show market statistics.",
  "Province-specific features. The same product runs in every province.",
  "Calendar sync. The Google Calendar and Outlook connections exist, but nothing reads or writes events yet.",
  "A native mobile app. Realtor Desk is a responsive web app.",
  "Seats, lead assignment or a shared pipeline. It is a single-agent product.",
];

interface Province {
  province: string;
  regulator: string;
  regulatorHref: string;
  privacy: string;
  privacyHref: string;
}

const PROVINCES: Province[] = [
  {
    province: "Ontario",
    regulator: "RECO",
    regulatorHref: "https://www.reco.on.ca",
    privacy: "PIPEDA, the federal law",
    privacyHref: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
  },
  {
    province: "British Columbia",
    regulator: "BC Financial Services Authority (BCFSA)",
    regulatorHref: "https://www.bcfsa.ca",
    privacy: "BC's Personal Information Protection Act",
    privacyHref: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/",
  },
  {
    province: "Alberta",
    regulator: "RECA",
    regulatorHref: "https://www.reca.ca",
    privacy: "Alberta's Personal Information Protection Act",
    privacyHref: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/",
  },
  {
    province: "Quebec",
    regulator: "OACIQ",
    regulatorHref: "https://www.oaciq.com",
    privacy: "Quebec's private-sector privacy Act, as amended by Law 25",
    privacyHref: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/",
  },
];

const FAQS = [
  {
    q: "Is Realtor Desk built in Canada?",
    a: "Yes. It is built by Brainfy AI Inc., a Canadian company based in Edmonton, Alberta, and priced in Canadian dollars. It is an independent product, not affiliated with or endorsed by CREA, any real estate board or any provincial regulator.",
  },
  {
    q: "Does Realtor Desk integrate with CREA DDF or my board's MLS?",
    a: "No. Native CREA DDF® sync is a scaffold that is not live, and there is no board or MLS feed, including TRREB. What works today is importing a single listing from a Realtor.ca address or an MLS number. The roadmap page carries the current status.",
  },
  {
    q: "Where is my client data stored?",
    a: "The production database and file storage run in Canada, in the ca-central-1 region. Features that call outside services, such as SMS, email delivery and AI-assisted drafting, send the relevant content to those providers, which may process it outside Canada. Storage location is not the same as where every processing step happens.",
  },
  {
    q: "Does it work in French?",
    a: "Yes. The interface and the email your client receives both work in French, set per contact, so a Montreal client can be worked entirely in French while you work in English.",
  },
  {
    q: "Are the prices in Canadian dollars, and do they include tax?",
    a: "Prices are in Canadian dollars and shown before tax. GST/HST, plus QST in Quebec or PST where it applies, is calculated at checkout from your billing province.",
  },
  {
    q: "Does it make me compliant with CASL, PIPEDA or my provincial rules?",
    a: "No, and no software can. Realtor Desk records consent and lets you export or delete a contact, which are inputs to meeting your obligations. How you collect consent and handle requests stays with you and your brokerage.",
  },
];

const CanadianMarket = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO
        canonicalUrl="https://www.realtordesk.ai/canadian-market"
        title="Canadian Real Estate CRM, Built for Canada"
        description="Realtor Desk for Canadian agents: French per contact, data stored in Canada, CAD pricing and CASL consent records. CREA DDF sync is not live; Realtor.ca import is."
        keywords="canadian real estate crm, real estate crm canada, bilingual real estate crm, CASL consent crm, crm for canadian realtors"
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

      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="mb-6">
                {t("canadianMarket.hero.title")}{" "}
                <span className="gradient-text">{t("canadianMarket.hero.titleGradient")}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("canadianMarket.hero.subtitle")}
              </p>
            </div>
            <div className="relative animate-fade-in animation-delay-200">
              {/* Generic illustrative imagery, not a photograph of customers. The
                  people are AI-generated and do not exist, so the alt text must not
                  imply customer usage. */}
              <ResolvedImage
                src={agentSuccess}
                alt="Illustration of a team meeting in an office overlooking a Canadian city skyline"
                width={1280}
                height={720}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card className="p-6 mb-12">
            <h2 className="text-lg font-bold mb-3">Short answer</h2>
            <p className="text-base mb-0">
              Realtor Desk is a single-agent CRM for Canadian real estate. What makes
              it Canadian is practical: French per contact, a database in Canada,
              Canadian-dollar pricing with tax handled at checkout, and a record of
              consent for CASL. It has no market data, no board feeds and no
              province-specific features, and the list below says what else it does
              not do.
            </p>
          </Card>

          <h2 className="mb-6">What &ldquo;built for Canada&rdquo; means here</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {TODAY.map((item) => (
              <Card key={item.title} className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-0">{item.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <h2 className="mb-4">What it does not do</h2>
          <p className="text-muted-foreground mb-6">
            Said plainly, because other pages in this market blur it.
          </p>
          <ul className="space-y-3 mb-16 list-none p-0">
            {NOT_YET.map((line) => (
              <li key={line} className="flex items-start gap-3 text-muted-foreground">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <h2 className="mb-4">Regulators and privacy laws by province</h2>
          <p className="text-muted-foreground mb-6">
            This is a map of who to ask, not advice on what they require. Rules change,
            so read each source directly. Realtor Desk has no province-specific
            behaviour: the same product runs in every province.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm">
              <caption className="text-left text-muted-foreground pb-3">
                Checked October 2, 2026. Alberta, British Columbia and Quebec each have a
                private-sector privacy law the federal Privacy Commissioner treats as
                substantially similar to PIPEDA.
              </caption>
              <thead>
                <tr className="border-b-2 text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold">Province</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Real estate regulator</th>
                  <th scope="col" className="py-2 font-semibold">Private-sector privacy law</th>
                </tr>
              </thead>
              <tbody>
                {PROVINCES.map((p) => (
                  <tr key={p.province} className="border-b align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold">{p.province}</th>
                    <td className="py-3 pr-4">
                      <a className="underline" href={p.regulatorHref} rel="noopener noreferrer" target="_blank">
                        {p.regulator}
                      </a>
                    </td>
                    <td className="py-3">
                      <a className="underline" href={p.privacyHref} rel="noopener noreferrer" target="_blank">
                        {p.privacy}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mb-16">
            Other provinces and territories: check your own regulator and the Office of
            the Privacy Commissioner of Canada. In Quebec, French-language rules can
            also reach client communications, so read OACIQ&rsquo;s guidance. For how
            CASL consent windows work, see our{" "}
            <Link className="underline" to="/resources/casl-compliance-real-estate-email-marketing-canada">
              CASL guide for real estate email
            </Link>
            , and for what the product does about privacy,{" "}
            <Link className="underline" to="/pipeda-compliance">
              the PIPEDA page
            </Link>
            .
          </p>

          <h2 className="mb-6">Questions</h2>
          <FAQAccordion items={FAQS} className="mb-16" />

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Try it on your own contacts</h2>
            <p className="text-muted-foreground mb-6">
              14 days, then CAD $149 a month. A card is collected up front and nothing is
              charged before day 14.
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

      <Footer />
    </div>
  );
};

export default CanadianMarket;
