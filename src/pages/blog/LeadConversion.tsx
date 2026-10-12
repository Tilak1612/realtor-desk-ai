import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// SVG on the page; .jpg twin for og:image -- social does not render SVG.
import blogImage from "@/assets/brand/blog-lead-conversion.svg";
import blogImageSocial from "@/assets/brand/blog-lead-conversion.jpg";
import { Picture } from "@/components/Picture";
import { SEO } from "@/components/SEO";

// /blog/lead-conversion — rewritten 2026-10-11.
//
// The previous version was invented from top to bottom: "conversion rate from 5%
// to 18%", "AI analyzes hundreds of data points", "increasing response rates by up
// to 40%", a "Real Results" list (3.6x conversion, 60% less wasted time, $15,000
// saved, 14 extra deals a year, 50% faster sales cycles), and a closing "Ready to
// 3x Your Conversion Rate?" with a "Free Analysis". There is no sample behind any
// of those numbers, the score is rule-based rather than predictive, and nothing
// in the product schedules outreach or runs nurture sequences.
//
// WHAT THIS PAGE CLAIMS, AND FROM WHERE
//   the five score inputs and their weights   supabase/functions/calculate-lead-score
//                                             (30 / 30 / 20 / 15 / 5, capped at 100),
//                                             the same figures /features/ai-lead-scoring uses
//   the breakdown is visible                  components/contact-detail/LeadScoreExplainer
//   nothing is sent without the agent         the inbox composer posts agent-authored rows only
// It makes no claim about conversion, time saved or deals closed.

const PARTS: { points: string; name: string; what: string }[] = [
  { points: "30", name: "Engagement", what: "Email opens, clicks and replies, with a bonus for recent contact." },
  { points: "30", name: "Behaviour", what: "Site visits, property views and document activity." },
  { points: "20", name: "Budget match", what: "The budget range the lead has given you." },
  { points: "15", name: "Timeline", what: "How soon the lead says they want to move." },
  { points: "5", name: "Qualification", what: "How complete the lead's details are." },
];

const LeadConversion = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Increase Lead Conversion with Lead Scoring"
        description="What a lead score is, how to use one to decide who to call first, and what it cannot tell you. With the five inputs Realtor Desk scores on."
        keywords="real estate lead scoring, lead conversion real estate, how to prioritise leads, lead score CRM, realtor follow-up"
        image={blogImageSocial}
        article
        publishedTime="2024-12-28"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/lead-conversion"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Increase Lead Conversion with Lead Scoring",
            "description": "What a lead score is, how to use one to decide who to call first, and what it cannot tell you. With the five inputs Realtor Desk scores on.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2024-12-28",
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
                Lead handling
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Rewritten October 11, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>4 min read</span>
              </div>
            </div>

            <h1 className="mb-6">
              Increase Lead Conversion with Lead Scoring
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              A lead score does not convert anyone. It helps you decide who to call first, so the warm lead does not go quiet while you work through the list in the order it arrived.
            </p>
          </header>

          <Picture
            src={blogImage}
            width={1024}
            height={576}
            alt="Illustration of a ranked list of leads"
            className="w-full rounded-lg mb-8 shadow-lg"
            priority
          />

          <div className="prose prose-lg max-w-none">
            <h2>What a lead score is</h2>
            <p>
              A lead score is a number that ranks your leads by how engaged they look. It is built from things a lead has done, such as opening an email or viewing a listing, and things they have told you, such as their budget and timeline. A higher number means more signs of interest, not a promise that the lead will buy.
            </p>

            <h2>How to use one</h2>
            <ol>
              <li><strong>Start the day at the top.</strong> Call or write to the highest-scoring leads first, while their interest is recent.</li>
              <li><strong>Read the reason, not only the number.</strong> A score built on recent replies means something different from one built on an old burst of listing views.</li>
              <li><strong>Overrule it when you know better.</strong> A referral from a past client can score low and still be your best lead.</li>
              <li><strong>Keep low scores on a schedule.</strong> A low score means little activity so far. Set a follow-up date instead of dropping the lead.</li>
              <li><strong>Check consent before you write.</strong> A high score does not give you permission to email or text someone. Under CASL you still need consent.</li>
            </ol>

            <h2>What a score cannot tell you</h2>
            <ul>
              <li>Whether the lead will buy or sell. It measures activity, not intent.</li>
              <li>Anything about a lead who has given you no data yet. A new contact with no history scores low by default.</li>
              <li>How good your follow-up is. Two agents with the same scores can get very different results.</li>
            </ul>

            <h2>How Realtor Desk scores a lead</h2>
            <p>
              Realtor Desk gives each lead a score from 0 to 100. It is rule-based, not a prediction, and the lead record shows how each part contributed, so you can see why a lead ranks where it does.
            </p>
          </div>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm">
              <caption className="text-left text-muted-foreground pb-3">
                The five parts of the Realtor Desk lead score. The total is capped at 100.
              </caption>
              <thead>
                <tr className="border-b-2 text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold">Part</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Up to</th>
                  <th scope="col" className="py-2 font-semibold">Based on</th>
                </tr>
              </thead>
              <tbody>
                {PARTS.map((p) => (
                  <tr key={p.name} className="border-b align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold">{p.name}</th>
                    <td className="py-3 pr-4 text-muted-foreground">{p.points} points</td>
                    <td className="py-3 text-muted-foreground">{p.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              The product also suggests a next action and a time to take it. It does not contact the lead for you: nothing is sent without you. We do not publish conversion figures, because we do not have a sample that would stand behind one. More detail is on the{" "}
              <Link to="/features/ai-lead-scoring">lead scoring page</Link>.
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg my-8">
              <h3 className="text-2xl font-bold mb-4">See the score on your own leads</h3>
              <p className="mb-6">
                Book a demo, or start the 14-day trial and import a few contacts to see how they rank.
              </p>
              <Link to="/demo">
                <Button size="lg" className="btn-gradient">
                  Book a demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default LeadConversion;
