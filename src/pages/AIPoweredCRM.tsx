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
        canonicalUrl="https://realtordesk.ai/features/ai-powered-crm"
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
              <Badge className="mb-4 bg-accent">
                <Target className="w-3 h-3 mr-1" />
                Predictive Intelligence
              </Badge>
              <h2 className="mb-6">Know Who Will Buy Before They Do</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI analyzes 50+ data points—web activity, email engagement, past behavior, 
                market timing—to score every lead with 72% accuracy on who will convert in 6-12 months.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Stop Wasting Time on Cold Leads</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on the 18% of leads that are actually ready to transact
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Identify Hidden Opportunities</h4>
                    <p className="text-sm text-muted-foreground">
                      Find sellers ready to list 3-6 months before they contact you
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Prioritize Your Day Automatically</h4>
                    <p className="text-sm text-muted-foreground">
                      AI tells you exactly who to call first every morning
                    </p>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-accent/10 border-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-8 h-8 text-accent" />
                  <div>
                    <div className="text-2xl font-bold gradient-text">72%</div>
                    <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Validated across 500+ Canadian agents and 50,000+ transactions
                </p>
              </Card>
            </div>

            <div className="bg-muted rounded-2xl p-8 border">
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Sarah Thompson</span>
                    <Badge className="bg-green-500">Hot Lead - 94%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Viewed 12 listings, opened 8 emails, searched "$800K Toronto condos"
                  </p>
                  <div className="text-xs text-accent font-semibold">
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

                <div className="bg-background rounded-lg p-4 border-l-4 border-gray-300 opacity-60">
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

      {/* Market Intelligence */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent">
              <MapPin className="w-3 h-3 mr-1" />
              Canadian Market Intelligence
            </Badge>
            <h2 className="mb-4">Hyperlocal Insights for Toronto, Vancouver, Calgary & Beyond</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AI analyzes MLS data, economic indicators, and historical trends to predict 
              neighborhood-level price movements, inventory shifts, and buyer demand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Price Predictions</h3>
              <p className="text-sm text-muted-foreground">
                30-90 day price forecasts by neighborhood
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Clock className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Days on Market</h3>
              <p className="text-sm text-muted-foreground">
                Trend analysis to time listings perfectly
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Users className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Buyer Demand</h3>
              <p className="text-sm text-muted-foreground">
                Track search volume by area and price range
              </p>
            </Card>

            <Card className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">Inventory Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Supply trends to position clients strategically
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Real-Time Dashboard Example</h3>
              <p className="text-muted-foreground">See what your market intelligence looks like</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Toronto - Liberty Village</div>
                <div className="text-2xl font-bold gradient-text mb-1">+4.2%</div>
                <div className="text-xs text-muted-foreground">30-day price trend (condos)</div>
              </div>

              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Vancouver - Yaletown</div>
                <div className="text-2xl font-bold gradient-text mb-1">18 days</div>
                <div className="text-xs text-muted-foreground">Avg. days on market (improving)</div>
              </div>

              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Calgary - Beltline</div>
                <div className="text-2xl font-bold gradient-text mb-1">High</div>
                <div className="text-xs text-muted-foreground">Buyer demand (seller's market)</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

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
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">Lead qualified & appointment booked</span>
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
              <Badge className="mb-4 bg-accent">
                <MessageSquare className="w-3 h-3 mr-1" />
                Intelligent Conversation
              </Badge>
              <h2 className="mb-6">24/7 AI Chatbot That Actually Works</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Most CRMs have auto-responders that send generic replies. Our AI understands context, 
                qualifies leads, answers property questions, and books appointments—all while you sleep.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Instant Response = More Conversions</h4>
                    <p className="text-sm text-muted-foreground">
                      78% of buyers go with the first agent who responds. Be that agent, 24/7.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Understands Canadian Real Estate</h4>
                    <p className="text-sm text-muted-foreground">
                      Trained on CREA data, Toronto/Vancouver/Calgary markets, bilingual (EN/FR)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Qualifies Leads While You Sleep</h4>
                    <p className="text-sm text-muted-foreground">
                      Asks budget, timeline, must-haves. You wake up to qualified appointments.
                    </p>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-accent/10 border-accent/20">
                <p className="text-sm italic mb-2">
                  "I closed a $1.2M deal because AI chatted with the buyer at 2am when they found 
                  my listing. By morning, viewing was booked. Other agents never responded."
                </p>
                <p className="text-sm font-semibold">- Jennifer T., Toronto</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Automated Nurturing */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent">
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
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold">Day 1 - 9:30 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead downloads buyers guide → AI sends welcome email with market overview
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold">Day 3 - 6:15 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead opens email → AI detects optimal send time, sends personalized neighborhood guide
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold">Day 7 - 12:00 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead clicks 3 listings → AI scores as "warm", notifies you to call, queues property alerts
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Day 14 - Lead Converts</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lead books viewing after receiving 7 perfectly-timed touches. You never lifted a finger.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm font-semibold mb-1">Real Example:</p>
                <p className="text-sm text-muted-foreground">
                  "Sarah in Toronto received 7 personalized touches over 90 days, all timed by AI. 
                  She closed a $450K condo without me manually sending a single email." - Marc D., Toronto
                </p>
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
                    feature: "24/7 Chatbot", 
                    basic: false, 
                    otherAI: "Canned responses", 
                    rdai: "Intelligent conversation" 
                  },
                  { 
                    feature: "Predictive Lead Scoring", 
                    basic: false, 
                    otherAI: false, 
                    rdai: "72% accuracy" 
                  },
                  { 
                    feature: "Market Intelligence", 
                    basic: false, 
                    otherAI: false, 
                    rdai: "Hyperlocal Canadian data" 
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
                        row.basic ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-sm">{row.basic}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.otherAI === 'boolean' ? (
                        row.otherAI ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-sm">{row.otherAI}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.rdai === 'boolean' ? (
                        row.rdai ? <Check className="w-5 h-5 text-accent mx-auto" /> : <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-accent font-semibold text-sm">{row.rdai}</span>
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
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">41%</div>
              <p className="text-sm text-muted-foreground">Higher revenue per year</p>
            </Card>

            <Card className="p-8">
              <Clock className="w-12 h-12 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">15hrs</div>
              <p className="text-sm text-muted-foreground">Saved per week</p>
            </Card>

            <Card className="p-8">
              <Target className="w-12 h-12 text-accent mx-auto mb-3" />
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
            * Based on data from 500+ Canadian agents using Realtor Desk AI
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIPoweredCRM;