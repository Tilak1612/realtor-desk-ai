import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";
import blogImage from "@/assets/blog-drip-campaign-templates.jpg";
import blogImageAvif from "@/assets/blog-drip-campaign-templates.avif";
import blogImageWebp from "@/assets/blog-drip-campaign-templates.webp";
import { Picture } from "@/components/Picture";

// /blog/real-estate-drip-campaign-templates-canada-2025, rewritten 2026-10-12.
//
// The slug keeps its "2025" because it is an indexed address. The page itself no
// longer carries a year.
//
// WHAT THE PREVIOUS VERSION DID, AND WHY IT WAS REPLACED. It was headed "15
// proven templates" but only three emails had any text; the other twelve
// "templates" were one-line outlines. It opened with a "Performance Data" card
// ("generated over $12M in commissions", "Average open rate: 42% (vs. 18%
// industry average)", "click-through rate: 8.3% (vs. 2.1%)"), said "Only 2-3% of
// leads are ready" and "Increase conversion rates by 3-5x", and carried a whole
// "Performance Benchmarks" section of open, click and conversion ranges. It also
// printed "73% of emails are opened on mobile", "Questions perform 10-20%
// better", an 80/20 content rule, and an expired-listing email that told the
// reader to claim "89% of our listings sold within 30 days". There is no sample
// or named source behind any of those numbers. Related-article cards repeated
// figures from other pages ("78% better", "$12,000+", "$10,000+ fines").
//
// Also removed:
//   the expired-listing and FSBO sequences   they are cold email to people who
//                                            have not inquired, and this page has
//                                            no consent basis to offer for them
//   CASL penalty amounts, "one-click"        not on the fact sheet for this page;
//   unsubscribe                              the CASL guide is the place for them
//   Mailchimp and Follow Up Boss cards       nothing here was checked against
//                                            those vendors' own pages
//   "listing alert" and "price reduction"    described as automated emails the
//   sequences                                product would send; it does not
//
// WHAT THIS PAGE CLAIMS, AND FROM WHERE
//   the template count and sequence count    computed from SEQUENCES below, so the
//                                            number on the page is the number of
//                                            templates on the page
//   CASL windows, message contents, the      the Act, S.C. 2010, c. 23, stated as
//   10 business days, onus of proof,         general information and hedged
//   contents of an express consent request
//   the assistant drafts, the agent sends,   the same statements
//   consent is checked at send time, an      /features/ai-lead-follow-up and
//   unsubscribe link on marketing email,     /features/casl-compliant-email make
//   French or English per contact
//   price and trial wording                  CAD $149 a month, 14 days, card up
//                                            front, nothing charged before day 14
// It makes no claim about open rates, replies, conversion or deals closed. The
// send times are a suggested starting point and are labelled that way.
//
// If SEQUENCES changes, update the description ("four drip sequences") to match.
// The title and description are literals because scripts/prerender-pages.js
// reads them from this file as text.

// FAQS is declared before SEQUENCES on purpose. scripts/prerender-pages.js lifts
// copy from these arrays in declaration order and stops after a fixed number of
// strings; with the twelve templates first, the FAQ answers fell past the cut
// and the FAQPage markup described text the static HTML did not contain.
const FAQS = [
  {
    q: "What is a drip campaign in real estate?",
    a: "A drip campaign is a series of emails sent to one lead on a set schedule, each with one purpose, such as a welcome, a short guide or a check-in. Agents use them to stay in touch with people who are not ready to buy or sell yet, without writing every message from scratch.",
  },
  {
    q: "How many emails should a drip sequence have?",
    a: "There is no correct number. The sequences on this page have three emails each, because that is enough to introduce yourself, send something useful and check in. Add more only if you have something worth sending, and stop the sequence as soon as the person replies, so the conversation carries on by hand.",
  },
  {
    q: "How often should I email a real estate lead?",
    a: "The schedule on this page puts emails closer together at the start and further apart later: day 1, day 3 and week 2. Treat that as a starting point, not a rule. Tell people in the first email what you plan to send, and slow down or stop if they ask you to.",
  },
  {
    q: "Do I need consent to send a drip campaign in Canada?",
    a: "In most cases, yes. Under CASL you need express or implied consent before you send a commercial email. Implied consent from an inquiry lasts six months, and from a purchase or written contract, two years. The onus of proving consent is on you, so record the date and source for each contact. This is general information, not legal advice.",
  },
  {
    q: "Can I use these templates in any CRM or email tool?",
    a: "Yes. They are plain text, so you can paste them into any CRM or email tool that lets you save a template, or keep them in a document you copy from. Replace the placeholders in square brackets, add your own footer with your contact details and an unsubscribe link, and check that consent is on record before you send.",
  },
];

interface Template {
  when: string;
  purpose: string;
  subject: string;
  body: string[];
  note?: string;
}

interface Sequence {
  id: string;
  name: string;
  who: string;
  emails: Template[];
}

const SIGN_OFF = ["[YourName]", "[Brokerage] | [Phone]"];

const SEQUENCES: Sequence[] = [
  {
    id: "new-buyer-lead",
    name: "New buyer lead",
    who: "Someone who asked about a listing or filled in a form on your site.",
    emails: [
      {
        when: "Day 1",
        purpose: "Welcome, and what to expect",
        subject: "Thanks for your interest in [Address or Neighbourhood]",
        body: [
          "Hi [FirstName],",
          "Thanks for getting in touch about homes in [City]. I'm [YourName] with [Brokerage], and I work with buyers in [Neighbourhood].",
          "Here is what I plan to send you over the next couple of weeks:",
          "- Listings that match what you have told me you are looking for",
          "- A short guide to the buying process in [Province]",
          "- A check-in to see whether your plans have changed",
          "One question, so I send you the right things: what is your timeline? Just looking, a few months out, or ready now?",
          "You can reply to this email any time.",
        ],
      },
      {
        when: "Day 3",
        purpose: "The buying process",
        subject: "The 7 steps to buying a home in [Province]",
        body: [
          "Hi [FirstName],",
          "Buying a home has a lot of moving parts, so here is the short version:",
          "1. Get a mortgage pre-approval so you know your budget",
          "2. Sort your must-haves from your nice-to-haves",
          "3. Tour homes (I arrange the showings)",
          "4. Make an offer (I help you with the price and the conditions)",
          "5. Complete the home inspection and finalize your financing",
          "6. Legal review (your lawyer or notary handles this)",
          "7. Close and get your keys",
          "How long this takes depends on the home and on the conditions in your offer. I can walk you through what I am seeing in [City] right now.",
          "If you have not started on step 1, I can suggest a mortgage broker to talk to.",
        ],
      },
      {
        when: "Week 2",
        purpose: "Check-in",
        subject: "Has anything changed in what you are looking for?",
        body: [
          "Hi [FirstName],",
          "I wanted to check in. Has anything changed in your budget, the area you prefer or your timing?",
          "Here are a few homes that fit what you described:",
          "[Listing 1]",
          "[Listing 2]",
          "[Listing 3]",
          "If you would like to see any of them, reply with a day that suits you and I will set it up.",
          "If now is not the time, tell me and I will check back when you say.",
        ],
      },
    ],
  },
  {
    id: "seller-lead",
    name: "Seller lead",
    who: "A homeowner who asked you what their home is worth, or about selling.",
    emails: [
      {
        when: "Day 1",
        purpose: "Reply to the inquiry",
        subject: "Your question about selling [Address]",
        body: [
          "Hi [FirstName],",
          "Thanks for asking about selling your home at [Address]. I'm [YourName] with [Brokerage].",
          "An online estimate can only go so far. To give you a realistic price range I would like to see the home and compare it with recent sales nearby. It is a short visit and there is no obligation.",
          "Would [Day 1] or [Day 2] work for you?",
        ],
      },
      {
        when: "Day 3",
        purpose: "Getting the home ready",
        subject: "Getting [Address] ready to sell: a short checklist",
        body: [
          "Hi [FirstName],",
          "Whether you sell this season or next year, these jobs are worth starting early:",
          "- Fix the small things: dripping taps, sticking doors, burnt-out bulbs",
          "- Clear the counters, the closets and the front entry",
          "- Deep clean, including the windows",
          "- Gather your paperwork: property tax bill, utility costs and records of renovations",
          "- Write down anything a buyer should know about, such as past repairs",
          "I am happy to walk through the home with you and point out what is worth doing and what is not.",
        ],
      },
      {
        when: "Week 2",
        purpose: "Recent sales nearby",
        subject: "Recent sales near [Address]",
        body: [
          "Hi [FirstName],",
          "Here are a few recent sales near you:",
          "[Address 1], [sold price], [date]",
          "[Address 2], [sold price], [date]",
          "[Address 3], [sold price], [date]",
          "Every home is different, so these are a starting point and not a valuation of yours. If you would like a price range for [Address], I can prepare one after a short visit.",
          "There is no rush on your side. Reply whenever you are ready to talk.",
        ],
        note: "Check the rules of your board and your brokerage before you share sold prices.",
      },
    ],
  },
  {
    id: "open-house-follow-up",
    name: "Open house follow-up",
    who: "A visitor who gave you their email at an open house and agreed to hear from you.",
    emails: [
      {
        when: "Day 1",
        purpose: "Thank you",
        subject: "Thanks for visiting [Address]",
        body: [
          "Hi [FirstName],",
          "Thanks for coming through [Address] on [Day]. It was good to meet you.",
          "If you have questions about the home, the street or the asking price, reply here and I will get you answers.",
          "Are you already working with an agent? If you are, I am glad to pass information along through them.",
        ],
      },
      {
        when: "Day 3",
        purpose: "Similar homes",
        subject: "A few homes like [Address]",
        body: [
          "Hi [FirstName],",
          "You mentioned you liked [Feature] at [Address]. These homes nearby have something similar:",
          "[Listing 1]",
          "[Listing 2]",
          "[Listing 3]",
          "If one stands out, tell me and I will arrange a showing.",
        ],
      },
      {
        when: "Week 2",
        purpose: "Check-in",
        subject: "Still looking in [Neighbourhood]?",
        body: [
          "Hi [FirstName],",
          "A quick note to ask how your search is going. If you are still looking in [Neighbourhood], I can send you new listings as they come up. Tell me your price range and your must-haves and I will keep it to homes that fit.",
          "If you have found a place or decided to wait, tell me and I will stop writing.",
        ],
      },
    ],
  },
  {
    id: "past-client",
    name: "Past client",
    who: "A client whose purchase or sale you handled.",
    emails: [
      {
        when: "Week 1 after closing",
        purpose: "Congratulations",
        subject: "Congratulations on [Address]",
        body: [
          "Hi [FirstName],",
          "Congratulations on closing. It was a pleasure working with you.",
          "A few things that are easy to forget in the first month:",
          "- Update your address with your bank, your employer and government services",
          "- Keep your closing documents together in one place",
          "- Find the main water shut-off and the electrical panel",
          "If anything comes up with the house, call me. I am glad to help you find the right person.",
        ],
      },
      {
        when: "Month 6",
        purpose: "How is the house?",
        subject: "How is the house?",
        body: [
          "Hi [FirstName],",
          "It has been about six months since you moved into [Address]. How are you settling in?",
          "If you need a recommendation for a trade, such as a plumber, an electrician or a roofer, ask me and I will share some names.",
          "No need to reply if all is well.",
        ],
      },
      {
        when: "Year 1",
        purpose: "Anniversary, and a request to stay in touch",
        subject: "One year at [Address]",
        body: [
          "Hi [FirstName],",
          "It has been a year since you got the keys to [Address]. I hope the first year has been a good one.",
          "If you are curious about what has sold on your street since then, I can put together a short summary for you.",
          "I would like to keep sending you a note like this once or twice a year. If that is fine with you, reply YES to this email. You can withdraw your consent at any time by replying or by using the unsubscribe link below.",
        ],
        note: "The last paragraph asks for express consent. Implied consent from a purchase or written contract lasts two years under CASL, so ask before it runs out.",
      },
    ],
  },
];

const TEMPLATE_COUNT = SEQUENCES.reduce((n, s) => n + s.emails.length, 0);

const FOOTER_LINES = [
  "[YourName], [Brokerage]",
  "[Mailing address]",
  "[Phone] | [Email or website]",
  "Unsubscribe: [link]",
];

const DripCampaignTemplates = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate Drip Campaign Email Templates"
        description="Real estate email templates in four drip sequences: new buyer lead, seller lead, open house follow-up and past client. Plain text, with CASL notes."
        keywords="real estate drip campaign, real estate drip campaign templates, real estate email templates, realtor email sequences, CASL email real estate"
        image={blogImage}
        article
        publishedTime="2025-01-29"
        modifiedTime="2026-10-12"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/real-estate-drip-campaign-templates-canada-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Real Estate Drip Campaign Email Templates",
            "description": "Real estate email templates in four drip sequences: new buyer lead, seller lead, open house follow-up and past client. Plain text, with CASL notes.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-29",
            "dateModified": "2026-10-12"
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
                Email marketing
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Rewritten October 12, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>9 min read</span>
              </div>
            </div>

            <h1 className="mb-6">Real Estate Drip Campaign Email Templates</h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              A real estate drip campaign is a short series of emails sent to one lead on a set schedule, each with a single purpose, such as a welcome, a useful guide or a check-in. It keeps you in touch with someone who is not ready to buy or sell yet, without writing every message from scratch.
            </p>
          </header>

          <div className="mb-12">
            <Picture
              src={blogImage}
              avif={blogImageAvif}
              webp={blogImageWebp}
              width={1200}
              height={630}
              alt="Email templates open on a laptop"
              className="w-full rounded-2xl shadow-xl"
              priority
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>What is on this page</h2>
            <p>
              {TEMPLATE_COUNT} email templates for Canadian agents, in {SEQUENCES.length} sequences of three. Each one is plain text with a subject line, ready to copy and rewrite in your own voice. Words in [square brackets] are placeholders for you to fill in.
            </p>
            <p>
              We do not publish open rates or conversion figures for these templates, because we do not have a sample that would stand behind one. How a sequence performs depends on your list, your market and what you do when someone replies.
            </p>

            <h2>When to send each one</h2>
            <p>
              The timing below is a starting point, not a benchmark. Count from the day the person first got in touch, or from closing day for a past client. Stop the sequence as soon as someone replies and carry on by hand.
            </p>
          </div>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm">
              <caption className="text-left text-muted-foreground pb-3">
                A suggested schedule for each sequence. Adjust it to your own clients.
              </caption>
              <thead>
                <tr className="border-b-2 text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold">Sequence</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Who it is for</th>
                  <th scope="col" className="py-2 font-semibold">Suggested timing</th>
                </tr>
              </thead>
              <tbody>
                {SEQUENCES.map((s) => (
                  <tr key={s.id} className="border-b align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold">
                      <a href={"#" + s.id} className="underline">{s.name}</a>
                    </th>
                    <td className="py-3 pr-4 text-muted-foreground">{s.who}</td>
                    <td className="py-3 text-muted-foreground">{s.emails.map((e) => e.when).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>The templates</h2>
            <p>
              Add your own footer to every email. A sample footer is in the CASL section below.
            </p>
          </div>

          {SEQUENCES.map((s) => (
            <section key={s.id} aria-labelledby={s.id} className="mt-10">
              <h3 id={s.id} className="text-2xl font-bold mb-2 scroll-mt-28">{s.name}</h3>
              <p className="text-muted-foreground mb-6">{s.who}</p>

              <div className="space-y-6">
                {s.emails.map((e, i) => (
                  <Card key={e.subject} className="p-6">
                    <h4 className="font-semibold mb-3">
                      Email {i + 1} ({e.when}): {e.purpose}
                    </h4>
                    <div className="text-sm font-mono bg-muted p-4 rounded">
                      <p className="mb-3"><strong>Subject:</strong> {e.subject}</p>
                      {e.body.map((line) => (
                        <p key={line} className="mb-2">{line}</p>
                      ))}
                      <p className="mt-4 mb-0">
                        {SIGN_OFF[0]}
                        <br />
                        {SIGN_OFF[1]}
                      </p>
                    </div>
                    {e.note && (
                      <p className="text-sm text-muted-foreground mt-3 mb-0">Note: {e.note}</p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          ))}

          <div className="prose prose-lg max-w-none mt-12">
            <h2>Before you send</h2>
            <ul>
              <li><strong>Make it specific.</strong> Mention the listing they asked about, the area they named or the conversation you had. A first name on its own is not personal.</li>
              <li><strong>Ask for one thing.</strong> A reply, a showing or a call. Not all three in the same email.</li>
              <li><strong>Write the way you talk.</strong> Short paragraphs and plain words. Read it aloud before you save it.</li>
              <li><strong>Keep the subject line honest.</strong> It should say what the email is about.</li>
              <li><strong>Keep sequences separate.</strong> A buyer and a seller need different emails, and so do a new lead and a past client.</li>
            </ul>

            <h2>CASL: consent, identification and unsubscribe</h2>
            <p>
              A drip campaign is commercial email, so Canada's Anti-Spam Legislation (S.C. 2010, c. 23) applies. What follows is general information, not legal advice. If you are unsure how the Act applies to your list, ask your brokerage or a lawyer.
            </p>
            <ul>
              <li><strong>Consent comes first.</strong> Implied consent from an inquiry lasts six months. Implied consent from a purchase or a written contract lasts two years. Once implied consent has run out, plan on needing express consent to keep emailing.</li>
              <li><strong>Plan the sequence inside the window.</strong> A sequence for a lead who inquired should finish, or ask for express consent, before the six months are up.</li>
              <li><strong>Identify yourself in every message.</strong> A commercial message must identify the sender, give contact information and include an unsubscribe mechanism.</li>
              <li><strong>Act on an unsubscribe.</strong> It must be given effect within 10 business days. Take the person out of every sequence, not only the one they replied to.</li>
              <li><strong>Keep the proof.</strong> The onus of proving consent is on the sender. Record the date and the source of consent for each contact.</li>
              <li><strong>Ask for express consent properly.</strong> A request must name who is asking, give a mailing address plus a phone number, email or web address, and say that consent can be withdrawn.</li>
            </ul>
            <p>A footer along these lines covers the identification and unsubscribe points:</p>
          </div>

          <div className="text-sm font-mono bg-muted p-4 rounded my-6">
            {FOOTER_LINES.map((line) => (
              <p key={line} className="mb-1 last:mb-0">{line}</p>
            ))}
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              Our{" "}
              <Link to="/resources/casl-compliance-real-estate-email-marketing-canada">CASL guide for real estate email</Link>{" "}
              goes through consent in more detail, and the{" "}
              <Link to="/features/casl-compliant-email">CASL email page</Link>{" "}
              shows how Realtor Desk records it.
            </p>

            <h2>How this works in Realtor Desk</h2>
            <p>
              Realtor Desk is a CRM for a single Canadian agent. It does not run email sequences on its own, and the templates on this page are text for you to copy, not something the product sends for you. Here is what it does do:
            </p>
            <ul>
              <li><strong>It suggests the next step.</strong> Each lead gets a suggested next action and a time to take it.</li>
              <li><strong>The assistant drafts.</strong> The in-app assistant writes a draft for you to review and edit.</li>
              <li><strong>You send.</strong> Nothing goes out unattended. There are no automatic replies and no outreach without you.</li>
              <li><strong>Consent is checked when you send.</strong> A consent date and source are recorded for each contact, and the inbox and SMS refuse to send without consent.</li>
              <li><strong>Unsubscribe is built in.</strong> Every marketing email carries an unsubscribe link.</li>
              <li><strong>French or English.</strong> The language is set per contact.</li>
            </ul>
            <p>
              More detail is on the{" "}
              <Link to="/features/ai-lead-follow-up">lead follow-up page</Link>.
            </p>

            <h2>Questions</h2>
          </div>

          <FAQAccordion items={FAQS} className="mb-12" />

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Draft your next follow-up, then send it yourself</h2>
            <p className="text-muted-foreground mb-6">
              14 days, then CAD $149 a month. A card is collected up front and nothing is charged before day 14.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link to="/demo">Book a demo</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/signup">Start free trial</Link>
              </Button>
            </div>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default DripCampaignTemplates;
