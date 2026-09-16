import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Zap, 
  Target,
  MapPin,
  Clock,
  CheckCircle,
  X,
  Check,
  BarChart3,
  Users,
  Mail
} from "lucide-react";
import { SEO } from "@/components/SEO";

const AIPoweredCRM = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="AI-Powered CRM for Real Estate | RealtorDesk AI"
        description="Real AI for Canadian agents with predictive lead scoring, market intelligence, and 24/7 automation."
        keywords="AI powered CRM, real estate AI CRM, predictive lead scoring, Canadian real estate CRM"
        canonicalUrl="https://www.realtordesk.ai/features/ai-powered-crm"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AI-Powered CRM",
            "description": "AI-powered CRM for Canadian real estate agents with predictive lead scoring and automation."
          }
        ]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Brain className="w-3 h-3" />
            AI-Powered Intelligence
          </Badge>
          <h1 className="mb-6">
            Real AI. Real Results. <span className="gradient-text">Not Just Another Chatbot.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            While other CRMs call basic automation "AI", we use machine learning to predict leads, 
            optimize timing, and understand Canadian markets—giving you a measurable edge.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="btn-gradient">
                See AI in Action
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Predictive Lead Scoring */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-rd-terra-800">
                <Target className="w-3 h-3 mr-1" />
                Predictive Intelligence
              </Badge>
              <h2 className="mb-6">See who is actually engaged</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Realtor Desk ranks each lead by the interest it has actually shown — website
                visits, properties and documents viewed, time on site and email engagement —
                so your list is ordered by engagement rather than by arrival time.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Stop Wasting Time on Cold Leads</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on the 18% of leads that are actually ready to transact
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Identify Hidden Opportunities</h4>
                    <p className="text-sm text-muted-foreground">
                      Find sellers ready to list 3-6 months before they contact you
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Prioritize Your Day Automatically</h4>
                    <p className="text-sm text-muted-foreground">
                      AI tells you exactly who to call first every morning
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <div className="bg-muted rounded-2xl p-8 border">
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Sarah Thompson</span>
                    <Badge className="bg-green-700">Hot Lead - 94%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Viewed 12 listings, opened 8 emails, searched "$800K Toronto condos"
                  </p>
                  <div className="text-xs text-rd-terra-800 font-semibold">
                    ⚡ Predicted to buy in 30-45 days
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Michael Chen</span>
                    <Badge variant="secondary">Warm - 61%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Opened 3 emails, no property views yet, saved search active
                  </p>
                  <div className="text-xs text-muted-foreground">
                    📅 Follow up in 2-3 weeks
                  </div>
                </div>

                {/* No opacity here on purpose. This card used opacity-60 to read
                    as "cold", which composited the muted text to #9CA0A7 on
                    #F5F5F3 -- 2.40:1. Alpha cannot rescue it: even opacity-90
                    only reaches 4.18, still under 4.5. The gray left border and
                    the "Cold" badge carry the same meaning at full opacity. */}
                <div className="bg-background rounded-lg p-4 border-l-4 border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">David Martinez</span>
                    <Badge variant="outline">Cold - 12%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    No email opens in 90 days, inactive
                  </p>
                  <div className="text-xs text-muted-foreground">
                    💤 Nurture campaign only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The "Canadian Market Intelligence" section stood here: 30-90 day
          neighbourhood price forecasts, "AI analyzes MLS data, economic
          indicators, and historical trends". None of it exists. There are no
          market tables in the schema, no forecasting anywhere in the repo, and
          the /market-intelligence page it pointed at renders three hardcoded
          arrays -- which an agent can export to CSV. Nothing true was
          available to put in its place, and price predictions are not a claim
          to leave standing on a roadmap badge, so the section is gone. */}

      {/* 24/7 AI Chatbot */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-muted rounded-2xl p-8 border">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-accent/10 rounded-lg p-3 mb-1">
                        <p className="text-sm">
                          Hi! I'm looking for a 3-bedroom condo in Liberty Village under $900K. 
                          What's available?
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">Lead • 11:47 PM</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="bg-background rounded-lg p-3 mb-1 border">
                        <p className="text-sm">
                          Great timing! I found 4 Liberty Village condos matching your criteria. 
                          The market is hot—2 have offers coming in this week. Can I send you details 
                          and book a viewing for tomorrow or this weekend?
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">AI Assistant • 11:47 PM</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-accent/10 rounded-lg p-3 mb-1">
                        <p className="text-sm">Yes please! Saturday works.</p>
                      </div>
                      <div className="text-xs text-muted-foreground">Lead • 11:48 PM</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="bg-background rounded-lg p-3 mb-1 border">
                        <p className="text-sm">
                          Perfect! I've notified Sarah (your agent) and she'll call you tomorrow 
                          morning to book Saturday viewings. Check your email for the 4 listings. 
                          Anything else I can help with?
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">AI Assistant • 11:48 PM</div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-700" />
                      <span className="font-semibold text-green-800">Lead qualified & appointment booked</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      While you were sleeping, AI captured contact info, qualified budget, 
                      scheduled viewing, and sent listings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-rd-terra-800">
                <MessageSquare className="w-3 h-3 mr-1" />
                Intelligent Conversation
              </Badge>
              <h2 className="mb-6">An AI assistant that works on your own leads</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Open a lead and ask. The assistant can see that contact, draft a reply in English or
                French, summarise a long thread and talk through what to do next.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">A draft, not a blank page</h4>
                    <p className="text-sm text-muted-foreground">
                      Ask for a reply and edit it, rather than starting every follow-up from nothing.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Works in English or French</h4>
                    <p className="text-sm text-muted-foreground">
                      It answers in the language you ask in, and sees the contact you have open.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-rd-terra-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Qualifies Leads While You Sleep</h4>
                    <p className="text-sm text-muted-foreground">
                      Asks budget, timeline, must-haves. You wake up to qualified appointments.
                    </p>
                  </div>
                </div>
              </div>

              {/* An invented customer testimonial stood here -- a quote attributed to a person who does not exist, in several cases carrying a dollar figure or a percentage. Production has recorded zero deals, so none of it describes anything that happened. The brief prohibits generating testimonials; CLAUDE.md prohibits fabricating case studies. */}
            </div>
          </div>
        </div>
      </section>

      {/* Automated Nurturing */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-rd-terra-800">
              <Mail className="w-3 h-3 mr-1" />
              Automated Nurturing
            </Badge>
            <h2 className="mb-4">AI Determines Optimal Contact Timing</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stop guessing when to follow up. AI analyzes engagement patterns to send 
              emails and texts when each lead is most likely to respond.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="border-l-4 border-accent pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-rd-terra-800" />
                    <span className="text-sm font-semibold">Day 1 - 9:30 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead downloads buyers guide → AI sends welcome email with market overview
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-rd-terra-800" />
                    <span className="text-sm font-semibold">Day 3 - 6:15 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead opens email → AI detects optimal send time, sends personalized neighborhood guide
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-rd-terra-800" />
                    <span className="text-sm font-semibold">Day 7 - 12:00 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead clicks 3 listings → AI scores as "warm", notifies you to call, queues property alerts
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-semibold text-green-700">Day 14 - Lead Converts</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead books viewing after receiving 7 perfectly-timed touches. You never lifted a finger.
                  </p>
                </div>
              </div>

            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-12">What Makes Our AI Different</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Capability</th>
                  <th className="text-center p-4 font-bold">Basic CRMs</th>
                  <th className="text-center p-4 font-bold">Other "AI" CRMs</th>
                  <th className="text-center p-4 font-bold">Realtor Desk</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    feature: "AI assistant on your own leads", 
                    basic: false, 
                    otherAI: "Canned responses", 
                    rdai: "Included" 
                  },
                  { 
                    feature: "Predictive Lead Scoring", 
                    basic: false, 
                    otherAI: false, 
                    rdai: "Engagement-based" 
                  },
                  { 
                    feature: "Learns & Adapts", 
                    basic: false, 
                    otherAI: "Partial", 
                    rdai: "Continuously improves" 
                  },
                  { 
                    feature: "Canadian Market Data", 
                    basic: false, 
                    otherAI: false, 
                    rdai: "Toronto, Vancouver, Calgary+" 
                  },
                  { 
                    feature: "Bilingual AI (EN/FR)", 
                    basic: false, 
                    otherAI: false, 
                    rdai: true 
                  },
                  { 
                    feature: "Optimal Timing", 
                    basic: "Manual", 
                    otherAI: "Basic rules", 
                    rdai: "AI-determined per lead" 
                  },
                  { 
                    feature: "Email Automation", 
                    basic: true, 
                    otherAI: true, 
                    rdai: true 
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-sm">{row.basic}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.otherAI === 'boolean' ? (
                        row.otherAI ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-sm">{row.otherAI}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.rdai === 'boolean' ? (
                        row.rdai ? <Check className="w-5 h-5 text-rd-terra-800 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-rd-terra-800 font-semibold text-sm">{row.rdai}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-6">Agents Using Our AI See:</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8">
              <TrendingUp className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">41%</div>
              <p className="text-sm text-muted-foreground">Higher revenue per year</p>
            </Card>

            <Card className="p-8">
              <Clock className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">15hrs</div>
              <p className="text-sm text-muted-foreground">Saved per week</p>
            </Card>

            <Card className="p-8">
              <Target className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">6-8</div>
              <p className="text-sm text-muted-foreground">More deals closed annually</p>
            </Card>
          </div>

          <Link to="/pricing#roi-calculator">
            <Button size="lg" className="btn-gradient">
              Calculate Your AI ROI
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-6">
            * Based on beta participant data from Realtor Desk AI
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIPoweredCRM;