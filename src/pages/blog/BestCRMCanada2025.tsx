import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /blog/best-crm-canada-2025 — rewritten 2026-10-02.
//
// The slug keeps its "2025" because it is an indexed address with inbound links;
// the page itself no longer carries a year in its title.
//
// WHAT THE PREVIOUS VERSION DID, AND WHY IT WAS REPLACED. It ranked Realtor
// Desk "#1 of 10" against a rubric with invented weights, printed a Follow Up
// Boss first-year cost of "$6,480 CAD" (the vendor's own page shows $69 per user
// per month), claimed "fastest lead response tested (2.7 seconds)" for a product
// that does not respond to leads, said the Team plan covers "up to 5", and told
// budget buyers to "try LionDesk", which Lone Wolf discontinued in September
// 2025. It was dated January 2025 with "next update April 2025".
//
// EVERYTHING ABOUT ANOTHER VENDOR BELOW WAS READ FROM THAT VENDOR'S OWN PAGE ON
// 2026-10-02, with the URL shown. Where a page did not state something (a
// currency, a trial length, a hosting location) this page says "not stated"
// rather than filling the gap. Lofty and BoldTrail were checked 2026-09-28: both
// ask you to request a quote.

const CHECKED = "October 2, 2026";

interface Row {
  crm: string;
  price: string;
  note: string;
  source?: { label: string; href: string };
}

const ROWS: Row[] = [
  {
    crm: "Realtor Desk",
    price: "CAD $149 a month (Solo), CAD $299 a month (Team)",
    note: "14-day trial, card collected up front, nothing charged before day 14. EN/FR set per contact, database in Canada. Team is a price tier: there are no seats, assignment or shared pipeline today.",
    source: { label: "Pricing page", href: "/pricing" },
  },
  {
    crm: "CloseFlow",
    price: "CA$49, CA$99 or CA$179 a month",
    note: "14-day trial. Prices are marked as a founder rate locked for the first 100 agents. States CASL consent tracking. The pricing page does not mention data location or French. The top plan lists CREA / TRREB data as pending approval.",
    source: { label: "closeflow.ca/pricing", href: "https://www.closeflow.ca/pricing" },
  },
  {
    crm: "Follow Up Boss",
    price: "$69 per user a month (Grow); $499 a month for 10 users (Pro); $1,000 a month for 30 users (Platform)",
    note: "Annual billing lowers these to $58, $416 and $833. 14-day free trial. The page does not state a currency. Calling on the Grow plan is an add-on.",
    source: { label: "followupboss.com/pricing", href: "https://followupboss.com/pricing" },
  },
  {
    crm: "IXACT Contact",
    price: "$46.75 a month billed annually, or $55 a month",
    note: "Team members are $28.90 or $34 a month. Includes the CRM, email marketing, agent websites and a mobile app. No trial length or currency is stated on the page.",
    source: { label: "ixactcontact.com pricing", href: "https://www.ixactcontact.com/real-estate-crm-pricing/" },
  },
  {
    crm: "Wise Agent",
    price: "US$49 a month, or US$42 billed annually (CRM); US$69 or US$59 with WiseSocial",
    note: "Priced in US dollars. 14-day trial. Enterprise pricing is custom. The CRM plan allows up to 5 team members on a shared login.",
    source: { label: "wiseagent.com/pricing", href: "https://www.wiseagent.com/pricing.asp" },
  },
  {
    crm: "Top Producer",
    price: "$179 per user a month (Pro); team plans from $399 a month for up to 5 users",
    note: "No currency or trial length is stated. The page says to request pricing for Canadians.",
    source: { label: "topproducer.com/pricing", href: "https://www.topproducer.com/pricing" },
  },
  {
    crm: "Lofty (formerly Chime)",
    price: "Not published: request a quote",
    note: "Checked September 28, 2026.",
  },
  {
    crm: "BoldTrail (formerly kvCORE)",
    price: "Not published: request a quote",
    note: "Checked September 28, 2026.",
  },
  {
    crm: "LionDesk",
    price: "Discontinued",
    note: "Lone Wolf Technologies announced the wind-down in May 2025, kept the software available through September 2025, and offered customers Lone Wolf Relationships.",
    source: { label: "Inman report", href: "https://www.inman.com/2025/05/16/lone-wolf-technologies-to-wind-down-popular-liondesk-crm/" },
  },
];

const FAQS = [
  {
    q: "What is the best CRM for a Canadian real estate agent?",
    a: "There is no single best one. It depends on what you need to be true: published pricing in Canadian dollars, French for some clients, consent records for CASL, where the data is stored, and whether you work alone or on a team. The table above lists what each vendor states publicly so you can compare on those points.",
  },
  {
    q: "Do I need a CRM built in Canada?",
    a: "Not necessarily, but ask each vendor four things: which currency it bills in, whether it records consent date and source for CASL, where it stores your data, and whether the interface and client email work in French. If a page does not say, treat that as a question to put to the vendor in writing.",
  },
  {
    q: "How much does a real estate CRM cost?",
    a: "Among the vendors that publish a price, a single agent pays from about $42 a month (Wise Agent, billed annually, in US dollars) up to $179 a month (Top Producer Pro), in whichever currency each page uses, and several do not state one. Lofty and BoldTrail ask you to request a quote. Realtor Desk is CAD $149 a month, which is not the cheapest on this list.",
  },
  {
    q: "Is LionDesk still available?",
    a: "No. Lone Wolf Technologies announced in May 2025 that it was winding LionDesk down, kept it available through September 2025, and offered customers Lone Wolf Relationships. Any page still recommending LionDesk is out of date.",
  },
  {
    q: "Does Realtor Desk work for a team or a brokerage?",
    a: "Not yet. The Team plan is a price tier, not a set of collaboration features: there are no seats, lead assignment or shared pipeline. A team that needs those should choose another product today. Our team and brokerage pages explain what to look for.",
  },
];

const BestCRMCanada2025 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Best CRM for Canadian Real Estate Agents"
        description="How to choose a real estate CRM in Canada: what nine vendors publish on price, currency and trial, plus CASL, French and data location. Checked October 2026."
        keywords="best CRM for real estate Canada, real estate CRM Canada, CRM for Canadian realtors, real estate CRM pricing Canada, CASL real estate CRM"
        article
        publishedTime="2025-01-16"
        modifiedTime="2026-10-02"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/best-crm-canada-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Best CRM for Canadian Real Estate Agents: how to choose",
            description:
              "How to choose a real estate CRM in Canada, with what nine vendors state publicly about price, currency and trial.",
            author: { "@type": "Organization", name: "Realtor Desk" },
            publisher: { "@type": "Organization", name: "Realtor Desk" },
            datePublished: "2025-01-16",
            dateModified: "2026-10-02",
          },
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

      <article className="pt-32 md:pt-40 pb-20">
        <div className="container-custom max-w-4xl">
          <Link to="/resources">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground flex-wrap">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                Buyer guide
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {CHECKED}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7 min read</span>
              </div>
            </div>

            <h1 className="mb-6">Best CRM for Canadian Real Estate Agents: how to choose</h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              No single CRM suits every Canadian agent. This guide lists what nine
              vendors say publicly about price, currency and trial, then the
              questions that matter in Canada: CASL consent, French, and where your
              data is stored.
            </p>
          </header>

          <Card className="p-6 mb-8">
            <h2 className="text-lg font-bold mb-3">Short answer</h2>
            <p className="text-base mb-3">
              Pick on the constraints you cannot give up, then compare price. For a
              Canadian agent those are usually a bill in Canadian dollars, a record
              of when and how each contact consented, French for some clients, and
              a known data location. Most vendors below state some of these on their
              pricing page and leave the rest unsaid.
            </p>
            <p className="text-sm text-muted-foreground mb-0">
              We build one of the products compared here, Realtor Desk, so read its
              row with that in mind. It is not the cheapest here, and it is the wrong
              choice for a team that needs seats or shared pipelines.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What each vendor publishes</h2>

            <p>
              Every figure in this table was read from the vendor&rsquo;s own page on{" "}
              {CHECKED}, unless a row says otherwise. Where a page did not state a
              currency, a trial length or a hosting location, the table says so
              rather than guessing.
            </p>

            <div className="overflow-x-auto not-prose my-6">
              <table className="min-w-full text-sm">
                <caption className="text-left text-muted-foreground pb-3">
                  Published pricing for a single agent, as stated by each vendor.
                  Prices change, so confirm on the vendor&rsquo;s page.
                </caption>
                <thead>
                  <tr className="border-b-2 text-left">
                    <th scope="col" className="py-2 pr-4 font-semibold">CRM</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Published price</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">What the page also says</th>
                    <th scope="col" className="py-2 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.crm} className="border-b align-top">
                      <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.crm}</th>
                      <td className="py-3 pr-4">{r.price}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{r.note}</td>
                      <td className="py-3">
                        {r.source ? (
                          r.source.href.startsWith("/") ? (
                            <Link className="underline" to={r.source.href}>{r.source.label}</Link>
                          ) : (
                            <a className="underline" href={r.source.href} rel="noopener noreferrer" target="_blank">
                              {r.source.label}
                            </a>
                          )
                        ) : (
                          <span className="text-muted-foreground">Vendor site</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>Five questions that matter more in Canada</h2>

            <h3>1. Which currency does it bill in?</h3>
            <p>
              Wise Agent states US dollars. Follow Up Boss, IXACT Contact and Top
              Producer show prices without naming a currency, and Top Producer tells
              Canadians to request pricing. A bill in a currency you do not earn in
              adds exchange rate and card fees you will not see on the pricing page.
            </p>

            <h3>2. Does it record consent for CASL?</h3>
            <p>
              Canada&rsquo;s anti-spam law puts the burden of proving consent on the
              sender. A CRM can store the date and source of consent against each
              contact, which makes that proof easy to produce. It cannot decide
              whether your consent was valid. We explain the consent windows in our{" "}
              <Link className="underline" to="/resources/casl-compliance-real-estate-email-marketing-canada">
                CASL guide for real estate email
              </Link>
              .
            </p>

            <h3>3. Does it work in French?</h3>
            <p>
              &ldquo;Supports French&rdquo; can mean a translated website, a French
              interface, or French client email. Ask which. In Realtor Desk the
              language is set per contact, so an English-speaking agent can write
              to a francophone client in French. See{" "}
              <Link className="underline" to="/features/bilingual-crm">
                how bilingual workflows work
              </Link>
              .
            </p>

            <h3>4. Where is the data stored?</h3>
            <p>
              Most pricing pages do not say. Realtor Desk&rsquo;s production
              database runs in Canada (ca-central-1); features that call outside
              services, such as SMS and AI drafting, may send content to those
              providers. Ask every vendor for both answers: where records are stored
              and which third parties see them.
            </p>

            <h3>5. Which listing source does it use?</h3>
            <p>
              Importing a listing from a public Realtor.ca page is not the same as a
              licensed CREA DDF&reg; feed. Realtor Desk imports from Realtor.ca
              today; native DDF sync is on the roadmap and not live. Our{" "}
              <Link className="underline" to="/features/listing-import">
                listing import page
              </Link>{" "}
              explains the difference between an importer, a feed and an IDX website.
            </p>

            <h2>Who each option tends to suit</h2>

            <ul>
              <li>
                <strong>A solo agent watching the budget:</strong> IXACT Contact,
                Wise Agent and CloseFlow all publish lower monthly prices than
                Realtor Desk. Compare what each includes, and confirm the currency.
              </li>
              <li>
                <strong>A solo agent who works in French or needs Canadian data
                location:</strong> Realtor Desk is built around those two points.
                See the{" "}
                <Link className="underline" to="/use-cases/solo-agent">
                  solo agent guide
                </Link>
                .
              </li>
              <li>
                <strong>A team with an inside sales role:</strong> Follow Up Boss
                prices per user and by team size, which suits that shape. Realtor
                Desk does not support teams today.
              </li>
              <li>
                <strong>A large team or brokerage:</strong> Lofty and BoldTrail
                quote on request, and Top Producer publishes team plans. Ask for a
                written quote covering setup, seats and anything billed separately.
              </li>
              <li>
                <strong>Anyone moving off LionDesk:</strong> it is discontinued.
                Lone Wolf Relationships is the vendor&rsquo;s own offer; the others
                above are alternatives to compare against it.
              </li>
            </ul>

            <h2>How this was put together</h2>

            <p>
              This is desk research from each vendor&rsquo;s own public pages, not a
              lab test. We did not run these products against each other, and we do
              not publish conversion or response-time figures we cannot show you the
              working for. Prices and features change often, so use this as a
              shortlist and confirm on the vendor&rsquo;s page before you decide. If
              a figure here is out of date,{" "}
              <Link className="underline" to="/contact">
                tell us
              </Link>{" "}
              and we will correct it.
            </p>

            <p>
              For a head-to-head on a single product, see the{" "}
              <Link className="underline" to="/compare">
                comparison hub
              </Link>
              . To price Realtor Desk on its own, see{" "}
              <Link className="underline" to="/resources/real-estate-crm-pricing">
                what a real estate CRM costs
              </Link>
              .
            </p>

            <h2>Questions</h2>
          </div>

          <FAQAccordion items={FAQS} className="mb-12" />

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Try it on your own contacts</h2>
            <p className="text-muted-foreground mb-6">
              14 days, then CAD $149 a month. A card is collected up front and
              nothing is charged before day 14.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BestCRMCanada2025;
