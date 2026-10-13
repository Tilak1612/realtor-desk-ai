import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /follow-up-boss-pricing — written 2026-10-12.
//
// WHY THIS PAGE EXISTS. "follow up boss pricing" is searched about 1,000 times a
// month in the United States and 170 in Canada, at low difficulty. The two
// existing Follow Up Boss pages answer "should I switch" and "how do they
// compare"; neither answers "what does it cost", which is a different question
// asked earlier in the decision.
//
// EVERY FOLLOW UP BOSS FIGURE BELOW was read from followupboss.com/pricing on
// 12 October 2026. Nothing is estimated. Two things the page does NOT state,
// and this page says so instead of guessing: the currency and any setup fee. The worked examples are
// arithmetic on the published figures, shown so the reader can redo them.
//
// Do not "refresh" a number here without re-reading the vendor's page and
// changing CHECKED. An undated or guessed competitor price is the mistake this
// site has already had to remove twice.

const CHECKED = "12 October 2026";

type Plan = {
  plan: string;
  monthly: string;
  annual: string;
  users: string;
  calling: string;
};

const PLANS: Plan[] = [
  {
    plan: "Grow",
    monthly: "$69 per user",
    annual: "$58 per user",
    users: "Priced per user",
    calling: "Add-on: $39 per user monthly, $33 on annual billing",
  },
  {
    plan: "Pro",
    monthly: "$499",
    annual: "$416",
    users: "10 users included. Extra users $49 each monthly, $41 on annual billing",
    calling: "Calling and texting included for all users",
  },
  {
    plan: "Platform",
    monthly: "$1,000",
    annual: "$833",
    users: "30 users included. Extra users $20 each monthly, $17 on annual billing",
    calling: "Calling and texting included for all users",
  },
];

const EXAMPLES: { who: string; sum: string; total: string }[] = [
  { who: "One agent, Grow, monthly billing", sum: "1 × $69", total: "$69 a month" },
  { who: "One agent, Grow with calling, monthly billing", sum: "1 × ($69 + $39)", total: "$108 a month" },
  { who: "One agent, Grow, annual billing", sum: "12 × $58", total: "$696 a year" },
  { who: "Five agents, Grow, monthly billing", sum: "5 × $69", total: "$345 a month" },
  { who: "Five agents, Grow with calling, monthly billing", sum: "5 × ($69 + $39)", total: "$540 a month" },
  { who: "Up to ten agents, Pro, monthly billing", sum: "Flat", total: "$499 a month" },
  { who: "Twelve agents, Pro, monthly billing", sum: "$499 + 2 × $49", total: "$597 a month" },
];

const FAQS = [
  {
    q: "How much does Follow Up Boss cost per month?",
    a: "On 12 October 2026 the Follow Up Boss pricing page listed Grow at $69 per user per month, Pro at $499 per month including 10 users, and Platform at $1,000 per month including 30 users. Annual billing lowers these to $58, $416 and $833. Tax is added where it applies.",
  },
  {
    q: "Is Follow Up Boss priced in US or Canadian dollars?",
    a: "The pricing page does not state a currency. Follow Up Boss is a United States company, so a Canadian buyer should confirm the billing currency before comparing it with a price quoted in Canadian dollars, and should expect the cost in CAD to move with the exchange rate if it is billed in USD.",
  },
  {
    q: "Is calling included in Follow Up Boss?",
    a: "On the Pro and Platform plans, yes: the page lists unlimited calling and texting for all users. On Grow it is an add-on at $39 per user per month, or $33 on annual billing. The page also notes that several AI features rely on data from calling, so Grow without calling gets less from them.",
  },
  {
    q: "Does Follow Up Boss have a free trial or a contract?",
    a: "The pricing page advertises a 14-day free trial, no contract and cancel any time, and offers two months free on annual billing. It does not list a setup fee, so ask whether one applies to your plan.",
  },
  {
    q: "When is Pro cheaper than Grow?",
    a: "On the published monthly prices, Grow costs more than Pro from eight users without calling (8 × $69 is $552 against $499) and from five users with calling (5 × $108 is $540 against $499). Below that, Grow is the cheaper plan.",
  },
  {
    q: "How does Follow Up Boss pricing compare with Realtor Desk?",
    a: "Follow Up Boss Grow has the lower headline price: $69 per user against CAD $149 a month for Realtor Desk. They are built for different buyers. Follow Up Boss is a team platform with lead routing, calling and a large integration list. Realtor Desk is a single-agent CRM priced in Canadian dollars that records consent per contact and works in French.",
  },
];

const FollowUpBossPricing = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Follow Up Boss Pricing, Explained"
        description="Follow Up Boss pricing read from its own page on 12 October 2026: Grow, Pro and Platform, the calling add-on, worked totals, and what the page leaves out."
        keywords="follow up boss pricing, follow up boss cost, follow up boss price per user, follow up boss canada pricing, fub pricing"
        canonicalUrl="https://www.realtordesk.ai/follow-up-boss-pricing"
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
              <Link to="/compare" className="hover:underline">
                Compare
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Follow Up Boss pricing</span>
            </nav>
            <h1 className="mb-6">Follow Up Boss pricing, explained</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              What Follow Up Boss charges, taken from its own pricing page on {CHECKED}, with
              the totals worked out for a solo agent and a small team. We build a different
              CRM, so this page reports the published figures and says where they stop.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">Short answer</h2>
              <p className="text-base mb-0">
                Follow Up Boss has three plans. Grow is $69 per user per month. Pro is $499 per
                month and includes 10 users. Platform is $1,000 per month and includes 30 users.
                Annual billing takes two months off. Calling costs extra on Grow and is included
                on Pro and Platform. The page does not state a currency or a setup fee.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">The three plans</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="text-left text-muted-foreground pb-3">
                    Follow Up Boss plans as published on followupboss.com/pricing, {CHECKED}. Tax
                    is added where applicable.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Plan</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Monthly billing</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Annual billing, per month</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Users</th>
                      <th scope="col" className="py-2 font-semibold">Calling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLANS.map((p) => (
                      <tr key={p.plan} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{p.plan}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{p.monthly}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{p.annual}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{p.users}</td>
                        <td className="py-3 text-muted-foreground">{p.calling}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Source:{" "}
                <a
                  className="underline"
                  href="https://www.followupboss.com/pricing"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  followupboss.com/pricing
                </a>
                . Prices change, so confirm there before you decide.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What every plan includes</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The pricing page lists these for all three plans:
              </p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>Phone and email support seven days a week.</li>
                <li>Unlimited contacts, lead sources and integrations.</li>
                <li>A 14-day free trial, no contract, and cancel any time.</li>
                <li>
                  AI features at no extra charge. The page adds that many of them rely on data
                  from the calling feature, which is a paid add-on on Grow.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Pro adds team inboxes, call reporting and personalised onboarding. Platform adds
                teams within teams and priority support.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What it comes to</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These totals are arithmetic on the published prices, before tax, so you can redo
                them for your own numbers.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">Worked Follow Up Boss totals for common team sizes.</caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Who</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Sum</th>
                      <th scope="col" className="py-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXAMPLES.map((e) => (
                      <tr key={e.who} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-medium">{e.who}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{e.sum}</td>
                        <td className="py-3 text-muted-foreground">{e.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">What the pricing page does not tell you</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <strong className="text-foreground">The currency.</strong> None is stated. If
                  you are in Canada, ask whether you will be billed in US dollars.
                </li>
                <li>
                  <strong className="text-foreground">Tax.</strong> Prices are shown plus tax
                  where applicable.
                </li>
                <li>
                  <strong className="text-foreground">A setup or onboarding fee.</strong> None
                  is listed. Ask, and get the answer in writing.
                </li>
                <li>
                  <strong className="text-foreground">Lead costs.</strong> A CRM subscription
                  does not include the leads you feed into it.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Follow Up Boss or Realtor Desk</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                On headline price for one agent, Follow Up Boss Grow is lower. The two products
                are aimed at different people, and price is rarely the deciding line.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="text-base font-semibold mb-3">Follow Up Boss suits you if</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    <li>You run a team and need lead routing and a shared inbox.</li>
                    <li>You want calling and texting inside the CRM.</li>
                    <li>You rely on a long list of lead-source integrations.</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="text-base font-semibold mb-3">Realtor Desk suits you if</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    <li>You work alone and want one price in Canadian dollars: $149 a month.</li>
                    <li>You want consent recorded per contact, and a send refused without it.</li>
                    <li>You serve clients in French as well as English.</li>
                  </ul>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Realtor Desk has no lead routing, no built-in calling and no team features today.
                The full comparison is on{" "}
                <Link to="/blog/vs-follow-up-boss" className="underline">
                  Realtor Desk vs Follow Up Boss
                </Link>
                , and{" "}
                <Link to="/switch-from-follow-up-boss" className="underline">
                  moving from Follow Up Boss
                </Link>{" "}
                covers what you would give up.
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
                  <Link to="/resources/real-estate-crm-pricing" className="underline">
                    What real estate CRMs cost
                  </Link>
                  , vendor by vendor, including the ones that publish nothing.
                </li>
                <li>
                  <Link to="/blog/real-estate-crm-buying-guide" className="underline">
                    A buyer guide to real estate CRMs
                  </Link>
                  .
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Our price is one line</h2>
              <p className="text-muted-foreground mb-6">
                CAD $149 a month for one agent. 14-day trial; a card is collected up front and
                nothing is charged before day 14.
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

export default FollowUpBossPricing;
