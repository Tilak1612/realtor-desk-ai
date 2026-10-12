// 2026-10-11: rewritten to follow the 2026-10-11 Realtor Desk fact sheet.
// Removed: the "Top Pick" ranking, 24/7 and sub-3-second AI response, the
// chatbot and voice AI, "PIPEDA/CASL compliance built-in", predictive lead
// scoring, automatic appointment booking, the Q3 2026 DDF date, the ROI,
// hours-saved, conversion and learning-time figures, the unsourced criticism
// of IXACT, the unsourced prices and feature lists for other vendors, and the
// "what modern CRMs offer" list. Other vendors are now named with a neutral
// line and a pointer to their own sites.
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";

const IxactAlternatives = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="IXACT Contact Alternatives for Canada"
        description="IXACT Contact alternatives for Canadian agents: what each vendor publishes on price and currency, and what to check before you switch."
        keywords="IXACT Contact alternatives, IXACT alternative, Canadian real estate CRM, CRM for Canadian realtors"
        article
        publishedTime="2025-01-16"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/ixact-alternatives"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "IXACT Contact Alternatives for Canada",
            "description": "IXACT Contact alternatives for Canadian agents: what each vendor publishes on price and currency, and what to check before you switch.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-16",
            "dateModified": "2026-10-11"
          }
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
                CRM Alternatives
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 16, 2025 · Updated October 11, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
            
            <h1 className="mb-6">
              IXACT Contact Alternatives for Canada
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Thinking about leaving IXACT Contact? This page covers what IXACT lists on price, what Realtor Desk does and does not do, and what to check with any vendor before you switch.
            </p>
          </header>

          <Card className="p-6 mb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
            <h3 className="text-lg font-bold mb-3">Disclosure</h3>
            <p className="text-base mb-0">
              We build one of the products compared here, so weigh this accordingly. For every other vendor on this page, check the vendor's own site for current pricing and features.
            </p>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>Two Things to Check Before You Look Elsewhere</h2>

            <p>
              IXACT Contact may be doing the job for you. If you are looking around anyway, these are two things worth checking first.
            </p>

            <h3>You want AI help</h3>
            <p>
              IXACT's pricing page lists a CRM, email marketing, an automated monthly e-newsletter, agent websites and a mobile app, and it does not list AI features. If AI drafting or lead scoring matters to you, ask IXACT directly what it offers.
            </p>
            <p>
              Speed of follow-up matters, but no tool replaces a person choosing what to send. The useful question is which product makes it easiest for you to follow up quickly and consistently.
            </p>

            <h3>You want pricing in Canadian dollars</h3>
            <p>
              IXACT lists $46.75 USD/month billed annually, or $55 USD/month billed monthly. A price in US dollars moves with the exchange rate, so look at what lands on your card statement. Confirm the current figures on IXACT's own pricing page.
            </p>

            <h2>IXACT Contact Alternatives to Look At</h2>

            <p>
              Our own product is listed first. That is not a ranking.
            </p>

            {/* Realtor Desk */}
            <Card className="p-6 mb-6 border-2 border-primary">
              <h3 className="text-2xl font-bold mb-3">Realtor Desk</h3>

              <h4 className="text-lg font-semibold mt-4 mb-2">What It Is</h4>
              <p>
                A CRM for Canadian real estate agents. It is a single-agent product: there are no seats, no lead assignment or routing, no shared pipeline and no team inbox. It runs as a responsive web app, and there is no native iOS or Android app.
              </p>

              <h4 className="text-lg font-semibold mt-4 mb-2">What It Does</h4>
              <ul>
                <li>Contacts, one conversation timeline per client, and basic reports</li>
                <li>A drag-and-drop deal pipeline with totals in CAD</li>
                <li>A rule-based lead score from 0 to 100 with a visible breakdown (engagement, behaviour, budget match, timeline, qualification)</li>
                <li>A suggested next action and a time to take it</li>
                <li>An in-app assistant that drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you</li>
                <li>French or English set per contact. The interface and client email both work in French</li>
                <li>The date and source of consent recorded on each contact. It refuses to send from the inbox or by SMS when no consent is on file, and it stops automated email to a contact who has withdrawn</li>
                <li>Leads pushed in through Zapier, Make or n8n, SMS through Twilio, and email through your own SMTP server</li>
                <li>Contact import from a CSV file, and single-listing import from a Realtor.ca address or an MLS number</li>
              </ul>

              <h4 className="text-lg font-semibold mt-4 mb-2">What It Does Not Do</h4>
              <ul>
                <li>No automatic replies to leads, no lead-facing chatbot or website chat widget, and no voice AI</li>
                <li>No automated email sequences. A sequence builder exists, but scheduled sending is not switched on</li>
                <li>No automatic appointment or showing booking. Google Calendar and Outlook connect, but appointment sync is not live</li>
                <li>Native CREA DDF® sync is on the roadmap and is not live yet</li>
                <li>No IDX website, lead generation, ads or market data</li>
                <li>No transaction management, e-signature or document storage</li>
                <li>The CSV import does not bring in consent records, deals or history, and it does not merge duplicates</li>
              </ul>

              <h4 className="text-lg font-semibold mt-4 mb-2">Data and Consent</h4>
              <p>
                The production database is hosted in Canada. Some outside services (SMS, email delivery, AI drafting) may process data outside Canada. Software does not make anyone compliant. The consent record is there to help you keep track.
              </p>

              <h4 className="text-lg font-semibold mt-4 mb-2">Pricing</h4>
              <p>
                <strong>$149-299 CAD/month</strong> (transparent, no hidden fees)
              </p>
              <p>
                CAD $149 a month for a single agent. There is a 14-day trial. A card is collected up front and nothing is charged before day 14.
              </p>

              <h4 className="text-lg font-semibold mt-4 mb-2">Who It Suits</h4>
              <p>
                A single agent in Canada who wants a small CRM priced in Canadian dollars, with consent recorded per contact and French set per contact.
              </p>

              <h4 className="text-lg font-semibold mt-4 mb-2">Worth Comparing With IXACT</h4>
              <ul>
                <li><strong>An in-app assistant:</strong> drafts a reply and summarises a thread for you to review and send</li>
                <li><strong>French and CAD:</strong> French set per contact, and pricing in Canadian dollars</li>
              </ul>

              <div className="mt-6">
                <Link to="/demo">
                  <Button size="lg" className="btn-gradient w-full">
                    Try Realtor Desk for 14 Days
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Other vendors: names only, with a pointer to their own sites */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-3">Other Vendors</h3>
              <p>
                We do not print prices or feature lists for these vendors, because we have no dated source for them on this page.
              </p>
              <ul>
                <li><strong>Wise Agent:</strong> a real estate CRM. Check the vendor's own site for current pricing and features.</li>
                <li><strong>Top Producer:</strong> a real estate CRM. Check the vendor's own site for current pricing and features.</li>
                <li><strong>Real Geeks:</strong> a real estate website and CRM product. Check the vendor's own site for current pricing and features.</li>
                <li><strong>LionDesk:</strong> discontinued in September 2025 (Lone Wolf Technologies), so it is no longer an option.</li>
              </ul>
            </Card>

            <h2>Pricing Comparison</h2>

            <ul>
              <li><strong>IXACT Contact:</strong> the figures quoted above, which you should confirm on IXACT's own pricing page</li>
              <li><strong>Agent Plan:</strong> $149 CAD/month</li>
              <li><strong>Difference:</strong> IXACT lists $561 USD/year on its annual plan; the gap depends on the exchange rate on the day you pay</li>
            </ul>
            <p>
              IXACT is the cheaper line item. Whether the difference is worth paying depends on whether the things Realtor Desk does matter to you. We have no results figures to offer.
            </p>

            <h2>Moving Off IXACT Contact</h2>

            <ol>
              <li><strong>Ask IXACT what you can export</strong> and in what format, before you cancel anything.</li>
              <li><strong>Clean the file.</strong> Remove duplicates and check the columns. Realtor Desk's CSV import does not merge duplicates.</li>
              <li><strong>Import your contacts.</strong> Realtor Desk imports contacts from a CSV file. It does not import consent records, deals or history.</li>
              <li><strong>Record consent again.</strong> Consent is not imported, so add the date and source of consent to each contact you plan to message. Realtor Desk refuses to send from the inbox or by SMS when no consent is on file.</li>
              <li><strong>Spot-check</strong> a sample of contacts against IXACT before you rely on the new system.</li>
            </ol>

            <h3>Run Both for a While</h3>
            <p>
              Keep IXACT active while you test the new CRM on a few contacts. Cancel only once you have checked that what you need has come across.
            </p>

            <h2>Which Option Fits?</h2>

            <h3>Consider Realtor Desk If:</h3>
            <ul>
              <li>✅ You are a single agent in Canada</li>
              <li>✅ You want the date and source of consent recorded on each contact</li>
              <li>✅ You work with French-speaking clients and want French set per contact</li>
              <li>✅ Budget: $149-299 CAD/month</li>
            </ul>

            <h3>Realtor Desk Is Not a Fit If:</h3>
            <ul>
              <li>You need team seats, lead routing or a shared pipeline</li>
              <li>You need a native iOS or Android app</li>
              <li>You need automated email sequences, an automated newsletter or automatic replies to leads</li>
              <li>You need an agent website, IDX or lead generation from your CRM vendor</li>
            </ul>

            <h3>Stay With IXACT If:</h3>
            <ul>
              <li>It is working for you and the price suits you</li>
              <li>You rely on things its pricing page lists that Realtor Desk does not have: the automated monthly e-newsletter, agent websites and a mobile app</li>
            </ul>

            <h3>Looking at Wise Agent, Top Producer or Real Geeks?</h3>
            <p>
              Check each vendor's own site for current pricing and features, and put the questions below to them.
            </p>

            <h2>Questions to Ask Any CRM Vendor</h2>

            <ul>
              <li>What is the price, in which currency, and what is charged during the trial?</li>
              <li>Where is client data stored, and which outside services process it?</li>
              <li>How does the product record consent, and what happens when a contact withdraws it?</li>
              <li>Does anything get sent to a client automatically, and can you turn that off?</li>
              <li>Can you set a client's language, and do the interface and client email work in French?</li>
              <li>What can you export if you leave, and in what format?</li>
            </ul>

            <h2>Frequently Asked Questions</h2>

            <h3>Will I lose my contact data if I switch from IXACT?</h3>
            <p>
              Ask IXACT what its export includes before you cancel. Realtor Desk imports contacts from a CSV file. The import does not bring in consent records, deals or history, and it does not merge duplicates, so plan to re-enter what you need.
            </p>

            <h3>Can I try a new CRM while still using IXACT?</h3>
            <p>
              Yes. Realtor Desk has a 14-day trial. A card is collected up front and nothing is charged before day 14. Check each other vendor's site for its trial terms.
            </p>

            <h3>What if I don't like my new CRM—can I go back to IXACT?</h3>
            <p>
              Keep your IXACT account active until you have decided, and ask IXACT what happens to your data if you cancel and return later.
            </p>

            <h3>Do I need to cancel IXACT before starting a trial?</h3>
            <p>
              No. Test drive alternatives during your trial period. Only cancel IXACT once you've fully migrated and verified everything works in your new CRM.
            </p>

            <h3>Which alternative is closest to IXACT's layout?</h3>
            <p>
              We can't judge that for you. Realtor Desk is a small, single-purpose CRM. Try the trial on a few contacts to judge the learning curve yourself.
            </p>

            <h3>Does Realtor Desk reply to leads for me?</h3>
            <p>
              No. It suggests a next action and a time to take it, and an in-app assistant drafts a reply or summarises the thread on the contact you have open. Nothing is sent to a client without you.
            </p>

            <h2>The Bottom Line</h2>

            <p>
              IXACT is the cheaper line item, and its pricing page lists things Realtor Desk does not have. Realtor Desk is a smaller, single-agent CRM priced in Canadian dollars, with a rule-based lead score, an in-app drafting assistant, consent recorded per contact and French set per contact. Try both on a few real contacts before you decide.
            </p>

            <div className="cta-section">
              <h2>Try Realtor Desk for 14 Days</h2>
              <p>
                A card is collected up front and nothing is charged before day 14.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link to="/signup">
                  <Button size="lg" className="btn-gradient">
                    Start the 14-Day Trial
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">
                    See Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default IxactAlternatives;
