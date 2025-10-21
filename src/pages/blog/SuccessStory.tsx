import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Share2, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import blogImage from "@/assets/blog-success-story.jpg";

const SuccessStory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
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
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                Success Stories
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>December 15, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>6 min read</span>
              </div>
            </div>
            
            <h1 className="mb-6">
              How Sarah Chen Closed 14 Extra Deals in Q1 with AI
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              A Toronto agent's journey from traditional CRM to AI-powered success. Real numbers, real results, real transformation.
            </p>
          </header>

          <img 
            src={blogImage} 
            alt="Toronto skyline success story"
            className="w-full rounded-lg mb-8 shadow-lg"
          />

          <div className="prose prose-lg max-w-none">
            <div className="bg-primary/5 p-8 rounded-lg my-8 border-l-4 border-primary">
              <Quote className="w-8 h-8 text-primary mb-4" />
              <p className="text-lg italic mb-4">
                "I was skeptical about AI. I thought it would make real estate feel impersonal. But RealtorDesk AI didn't replace my personal touch—it amplified it. Now I can give every client the attention they deserve because the system handles everything else."
              </p>
              <p className="font-semibold">— Sarah Chen, RE/MAX Toronto</p>
            </div>

            <h2>The Challenge</h2>
            <p>
              Sarah Chen had been a successful Toronto real estate agent for 8 years, consistently closing 35-40 deals annually. But by late 2024, she was burning out. Her days started at 6 AM and ended at 10 PM. She was constantly behind on follow-ups, her inbox had 247 unread emails, and she knew she was leaving money on the table.
            </p>
            <p>
              "I was working 70-hour weeks and still felt like I was drowning," Sarah recalls. "I knew I was missing opportunities because I simply didn't have enough hours in the day."
            </p>

            <h2>The Numbers Before AI</h2>
            <ul>
              <li><strong>Deals Closed (2024):</strong> 38 transactions</li>
              <li><strong>Lead Conversion Rate:</strong> 4.2%</li>
              <li><strong>Average Response Time:</strong> 6.5 hours</li>
              <li><strong>Weekly Hours Worked:</strong> 68 hours</li>
              <li><strong>Leads Lost to Competitors:</strong> Estimated 12-15 per quarter</li>
              <li><strong>Client Satisfaction Score:</strong> 4.2/5</li>
            </ul>

            <h2>The Turning Point</h2>
            <p>
              In December 2024, after missing a hot lead that went to a competitor (who responded in 15 minutes while Sarah was in a showing), she decided something had to change. A colleague recommended RealtorDesk AI.
            </p>
            <p>
              "I was skeptical," Sarah admits. "I'd tried CRMs before. They just added more work. But the demo convinced me—this was different. The AI actually understood real estate."
            </p>

            <h2>The Implementation</h2>
            <p>
              Sarah started with RealtorDesk AI on January 2, 2025. The onboarding took less than 2 hours:
            </p>
            <ol>
              <li>Imported her 842 contacts from her old CRM</li>
              <li>Connected her email and phone</li>
              <li>Set up her CREA DDF® integration</li>
              <li>Configured her AI chatbot and voice agent</li>
              <li>Customized automated email sequences</li>
            </ol>
            <p>
              "By January 3rd, I was fully operational. The system immediately started scoring my leads and sending automated follow-ups to prospects I hadn't contacted in months."
            </p>

            <h2>Week 1: The Quick Wins</h2>
            <p>
              Within the first week, Sarah noticed immediate changes:
            </p>
            <ul>
              <li><strong>Instant Response:</strong> Her AI chatbot responded to website inquiries in under 60 seconds, 24/7</li>
              <li><strong>Reactivated Leads:</strong> Automated re-engagement campaigns reconnected with 23 cold leads</li>
              <li><strong>Time Saved:</strong> No more manual follow-up emails—the system handled it all</li>
              <li><strong>Lead Insights:</strong> AI scoring showed her exactly which leads to prioritize</li>
            </ul>
            <p>
              "The first week, I closed a deal with a client who had been in my database for 6 months. The AI sent him a perfectly timed email with three properties matching his exact criteria. He called me within an hour."
            </p>

            <h2>Month 1: Building Momentum</h2>
            <p>
              By the end of January, the transformation was undeniable:
            </p>
            <ul>
              <li>Closed 7 deals (vs. her usual 3-4 in January)</li>
              <li>Response time dropped to 8 minutes average (AI handled initial responses)</li>
              <li>Working 52 hours per week (down from 68)</li>
              <li>Lead conversion rate increased to 11.3%</li>
              <li>Generated 47 new qualified leads through automated marketing</li>
            </ul>

            <h2>Q1 Results: The Transformation</h2>
            <p>
              By the end of March 2025, Sarah's business had completely transformed:
            </p>

            <h3>The Numbers After AI</h3>
            <ul>
              <li><strong>Deals Closed (Q1 2025):</strong> 23 transactions (vs. 9 in Q1 2024)</li>
              <li><strong>Lead Conversion Rate:</strong> 14.8% (up from 4.2%)</li>
              <li><strong>Average Response Time:</strong> 8 minutes (down from 6.5 hours)</li>
              <li><strong>Weekly Hours Worked:</strong> 48 hours (down from 68)</li>
              <li><strong>Leads Lost to Competitors:</strong> Only 2 in the entire quarter</li>
              <li><strong>Client Satisfaction Score:</strong> 4.9/5</li>
              <li><strong>Revenue Increase:</strong> +156% compared to Q1 2024</li>
            </ul>

            <h2>What Made the Difference?</h2>

            <h3>1. AI Lead Scoring</h3>
            <p>
              "Instead of treating every lead equally, I now focus on the ones most likely to close. The AI was right 89% of the time about which leads would convert."
            </p>

            <h3>2. Automated Follow-Up</h3>
            <p>
              "The system sends perfectly timed emails and texts based on each client's behavior. I'm nurturing leads in my sleep."
            </p>

            <h3>3. 24/7 Availability</h3>
            <p>
              "My AI voice agent handled 167 calls in Q1. It scheduled showings, answered questions, and qualified leads—all without me lifting a finger."
            </p>

            <h3>4. Property Matching</h3>
            <p>
              "When a new listing hits MLS that matches a client's criteria, they get an alert within 2 minutes. I'm always first to show properties."
            </p>

            <h3>5. Time Management</h3>
            <p>
              "I saved 15+ hours per week on admin work. Those hours went straight into high-value activities: showings, negotiations, and building relationships."
            </p>

            <h2>The Human Touch</h2>
            <p>
              Despite heavy automation, Sarah's clients say she's more attentive than ever:
            </p>
            <div className="bg-primary/5 p-6 rounded-lg my-6">
              <Quote className="w-6 h-6 text-primary mb-3" />
              <p className="italic">
                "Sarah always seems to know exactly what we need before we ask. She's incredibly responsive and clearly doing her homework on every property. Best agent we've ever worked with."
              </p>
              <p className="text-sm mt-2">— Michael & Jennifer T., Toronto Buyers</p>
            </div>

            <h2>Looking Forward</h2>
            <p>
              Sarah is on track to close 80+ deals in 2025—more than double her previous best year—while working fewer hours and enjoying better work-life balance.
            </p>
            <p>
              "I finally have my evenings and weekends back. Last Saturday, I went hiking with my family instead of doing admin work. The AI handled 14 inquiries while I was offline. That never would have been possible before."
            </p>

            <h2>Her Advice to Other Agents</h2>
            <p>
              "Stop thinking of AI as a threat or a replacement. Think of it as the world's best assistant who never sleeps, never complains, and always follows through. Your job is to be the human—to build relationships and close deals. Let AI handle everything else."
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg my-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Write Your Own Success Story?</h3>
              <p className="mb-6">
                Join Sarah and 2,000+ other Canadian agents transforming their businesses with AI. Book a personalized demo and see what's possible.
              </p>
              <Link to="/demo">
                <Button size="lg" className="btn-gradient">
                  Book Your Free Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Share this article:
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default SuccessStory;
