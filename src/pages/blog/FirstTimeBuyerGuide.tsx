import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, Home, DollarSign, FileText, CheckCircle2, AlertTriangle, Lightbulb, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import blogImage from "@/assets/blog-first-time-buyer.jpg";

const FirstTimeBuyerGuide = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>First-Time Home Buyer Guide for Canada 2025 | RealtorDesk AI</title>
        <meta name="description" content="Complete first-time home buyer guide for Canada 2025. Learn about down payments, mortgage pre-approval, closing costs, and CMHC insurance. Expert tips for Canadian buyers." />
        <meta name="keywords" content="first time home buyer Canada, down payment requirements Canada, CMHC insurance, home buying process Canada, first time buyer programs" />
        <link rel="canonical" href="https://realtordesk.ai/first-time-home-buyer-guide-canada-2025" />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <Link to="/resources" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Canadian Market
              </span>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1" />
                18 min read
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                January 2025
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              First-Time Home Buyer Guide for Canada 2025: Everything You Need to Know
            </h1>

            <p className="text-xl text-muted-foreground">
              Buying your first home in Canada is one of the most significant financial decisions you'll ever make. This comprehensive guide walks you through every step with province-specific insights and expert advice.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container-custom -mt-8 mb-12">
        <img 
          src={blogImage} 
          alt="First-time home buyers with keys to new home"
          className="w-full max-w-4xl rounded-2xl shadow-xl"
        />
      </section>

      {/* Article Content */}
      <article className="container-custom pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            
            {/* What You'll Learn */}
            <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                What You'll Learn
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  How much you need for a down payment in Canada
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Step-by-step home buying process from pre-approval to closing
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  First-time buyer programs and incentives by province
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  How to avoid common mistakes that cost first-time buyers thousands
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  What to expect for closing costs and hidden expenses
                </li>
              </ul>
            </Card>

            {/* Down Payment Section */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <DollarSign className="w-8 h-8 mr-3 text-primary" />
              How Much Do You Need to Buy Your First Home in Canada?
            </h2>

            <h3 className="text-2xl font-bold mt-8 mb-4">Down Payment Requirements</h3>
            <p className="text-muted-foreground mb-6">
              In Canada, your down payment amount depends on the purchase price:
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 text-center">
                <h4 className="font-bold text-primary mb-2">Under $500,000</h4>
                <p className="text-2xl font-bold">5%</p>
                <p className="text-sm text-muted-foreground">Minimum down</p>
                <p className="text-xs text-muted-foreground mt-2">Example: $25,000 on $500k</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-bold text-primary mb-2">$500k - $999,999</h4>
                <p className="text-2xl font-bold">5% + 10%</p>
                <p className="text-sm text-muted-foreground">Split calculation</p>
                <p className="text-xs text-muted-foreground mt-2">Example: $45,000 on $700k</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-bold text-primary mb-2">$1 Million+</h4>
                <p className="text-2xl font-bold">20%</p>
                <p className="text-sm text-muted-foreground">Minimum required</p>
                <p className="text-xs text-muted-foreground mt-2">Example: $200,000 on $1M</p>
              </Card>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">CMHC Mortgage Default Insurance</h3>
            <p className="text-muted-foreground mb-4">
              If your down payment is less than 20%, you'll need to purchase mortgage default insurance through CMHC (Canada Mortgage and Housing Corporation), Sagen, or Canada Guaranty.
            </p>

            <Card className="p-6 mb-8">
              <h4 className="font-bold mb-4">CMHC Insurance Premium Rates (2025)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>5-9.99% down:</span>
                  <span className="font-bold">4.00% premium</span>
                </div>
                <div className="flex justify-between">
                  <span>10-14.99% down:</span>
                  <span className="font-bold">3.10% premium</span>
                </div>
                <div className="flex justify-between">
                  <span>15-19.99% down:</span>
                  <span className="font-bold">2.80% premium</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Example: On a $500,000 home with 5% down ($25,000), your CMHC premium would be $19,000, which is added to your mortgage.
              </p>
            </Card>

            <h3 className="text-2xl font-bold mt-8 mb-4">Closing Costs to Budget For</h3>
            <p className="text-muted-foreground mb-4">
              Beyond your down payment, expect to pay 1.5% - 4% of the purchase price in closing costs:
            </p>

            <Card className="p-6 mb-8">
              <h4 className="font-bold mb-4">Typical Closing Costs</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Land Transfer Tax</span>
                    <span>0.5% - 4%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Home Inspection</span>
                    <span>$400 - $700</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Appraisal Fee</span>
                    <span>$300 - $500</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Legal Fees</span>
                    <span>$1,000 - $2,000</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Title Insurance</span>
                    <span>$200 - $400</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Property Insurance</span>
                    <span>~$1,500/year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Property Tax Adjustment</span>
                    <span>Pro-rated</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Utility Connections</span>
                    <span>$100 - $300</span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold mt-4 text-primary">
                Total Example on $500,000 home: $10,000 - $20,000
              </p>
            </Card>

            {/* 8 Step Process */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-primary" />
              The Complete First-Time Home Buying Process (8 Steps)
            </h2>

            <div className="space-y-6">
              {[
                { step: 1, title: "Get Mortgage Pre-Approval", desc: "Before you start house hunting, get pre-approved for a mortgage. This tells you how much you can afford and what interest rate you qualify for." },
                { step: 2, title: "Find the Right Real Estate Agent", desc: "Working with a buyer's agent costs you nothing—the seller pays the commission. A good agent will understand your budget and needs." },
                { step: 3, title: "Start House Hunting", desc: "Create your must-have list including location, home type, bedrooms/bathrooms, outdoor space, and parking requirements." },
                { step: 4, title: "Make an Offer", desc: "When you find 'the one,' your agent will help you craft a competitive offer including purchase price, deposit, conditions, and closing date." },
                { step: 5, title: "Home Inspection", desc: "A $500 inspection can save you from $50,000+ in repairs. Never waive inspection condition without strong advice from your agent." },
                { step: 6, title: "Finalize Your Mortgage", desc: "Once conditions are removed, finalize your mortgage. Choose between fixed (5.5-6.2%) or variable rates (5.0-5.8%)." },
                { step: 7, title: "Hire a Real Estate Lawyer", desc: "Your lawyer handles title search, title insurance, reviewing purchase agreement, and registering property in your name." },
                { step: 8, title: "Closing Day & Moving In", desc: "Final walk-through, lawyer finalizes paperwork, you receive keys, and you're officially a homeowner!" },
              ].map((item) => (
                <Card key={item.step} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Programs Section */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <Home className="w-8 h-8 mr-3 text-primary" />
              First-Time Home Buyer Programs & Incentives
            </h2>

            <h3 className="text-2xl font-bold mt-8 mb-4">Federal Programs</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">First-Time Home Buyer Incentive (FTHBI)</h4>
                <p className="text-sm text-muted-foreground">5-10% shared-equity mortgage from government. Income cap: $120,000</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">Home Buyers' Plan (HBP)</h4>
                <p className="text-sm text-muted-foreground">Withdraw up to $35,000 from RRSP tax-free. Repay over 15 years.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">First-Time Home Buyers' Tax Credit</h4>
                <p className="text-sm text-muted-foreground">$10,000 non-refundable tax credit (~$1,500 refund)</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">GST/HST New Housing Rebate</h4>
                <p className="text-sm text-muted-foreground">Rebate on new construction purchases up to $6,300</p>
              </Card>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Provincial Programs</h3>
            
            <div className="space-y-4 mb-8">
              <Card className="p-4">
                <h4 className="font-bold mb-2">🍁 Ontario</h4>
                <p className="text-sm text-muted-foreground">Land Transfer Tax Refund up to $4,000. Toronto offers additional $4,475 rebate.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold mb-2">🏔️ British Columbia</h4>
                <p className="text-sm text-muted-foreground">Property Transfer Tax Exemption on homes up to $500,000 (partial up to $835k)</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold mb-2">🛢️ Alberta</h4>
                <p className="text-sm text-muted-foreground">No provincial land transfer tax (major savings vs. ON/BC)</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold mb-2">⚜️ Quebec</h4>
                <p className="text-sm text-muted-foreground">Accès Famille Program: Interest-free loan up to $50,000 for down payment</p>
              </Card>
            </div>

            {/* Common Mistakes */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3 text-orange-500" />
              Common First-Time Buyer Mistakes (And How to Avoid Them)
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { mistake: "Skipping Pre-Approval", risk: "Falling in love with homes you can't afford", fix: "Get pre-approved before attending open houses" },
                { mistake: "Maxing Out Your Budget", risk: "No financial cushion for repairs or rate increases", fix: "Buy 10-15% below your maximum approval" },
                { mistake: "Ignoring Hidden Costs", risk: "Underestimating taxes, fees, and maintenance", fix: "Budget $300-500/month for unexpected repairs" },
                { mistake: "Waiving Home Inspection", risk: "Discovering $50,000+ in repairs after closing", fix: "Only waive in extreme situations with agent guidance" },
                { mistake: "Not Shopping Around for Mortgages", risk: "Accepting higher rates than necessary", fix: "Compare rates from 3+ lenders" },
              ].map((item, idx) => (
                <Card key={idx} className="p-4 border-l-4 border-orange-500">
                  <h4 className="font-bold text-orange-600 mb-2">❌ {item.mistake}</h4>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Risk:</strong> {item.risk}</p>
                  <p className="text-sm text-green-600"><strong>✓ Fix:</strong> {item.fix}</p>
                </Card>
              ))}
            </div>

            {/* FAQs */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <HelpCircle className="w-8 h-8 mr-3 text-primary" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { q: "How much credit score do I need to buy a home in Canada?", a: "Minimum 600 for insured mortgages (CMHC), but 680+ gets you better rates. Above 750 qualifies for the best rates." },
                { q: "Can I buy a home with less than 5% down?", a: "No. 5% is the legal minimum in Canada for homes under $500k." },
                { q: "How long does the home buying process take?", a: "60-90 days on average from pre-approval to closing. Competitive markets may move faster (30-45 days)." },
                { q: "Should I buy or rent in 2025?", a: "If you plan to stay 5+ years, buying builds equity. If uncertain about location or career, renting offers flexibility." },
                { q: "What if I'm self-employed?", a: "You'll need 2 years of tax returns and may require a larger down payment (10-20%). Work with a mortgage broker experienced in self-employed applications." },
              ].map((item, idx) => (
                <Card key={idx} className="p-4">
                  <h4 className="font-bold mb-2">{item.q}</h4>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </Card>
              ))}
            </div>

            {/* Conclusion */}
            <h2 className="text-3xl font-bold mt-12 mb-6">Conclusion</h2>
            <p className="text-muted-foreground mb-6">
              Buying your first home in Canada in 2025 is an achievable goal with proper planning, expert guidance, and financial discipline. By understanding down payment requirements, leveraging first-time buyer incentives, and working with knowledgeable real estate professionals, you can navigate the process with confidence.
            </p>
            <p className="text-muted-foreground mb-8">
              <strong>The Canadian market is showing signs of stabilization</strong>, making this an opportune time for first-time buyers to enter—especially with interest rates expected to moderate through 2025-2026.
            </p>

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-r from-primary to-secondary text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Home Buying Journey?</h3>
              <p className="mb-6 text-white/90">
                Connect with a real estate agent who uses modern AI-powered tools to respond to your questions instantly and keep you updated every step of the way.
              </p>
              <Link to="/demo">
                <Button size="lg" variant="secondary">
                  Book a Free Demo
                </Button>
              </Link>
            </Card>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/canada-housing-market-forecast-2025-2026" className="block">
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-primary">Canada Housing Market Forecast 2025-2026</h4>
                    <p className="text-sm text-muted-foreground">What Realtors need to know about market trends</p>
                  </Card>
                </Link>
                <Link to="/toronto-vs-vancouver-real-estate-market-2025" className="block">
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-primary">Toronto vs Vancouver Real Estate 2025</h4>
                    <p className="text-sm text-muted-foreground">Compare Canada's two biggest markets</p>
                  </Card>
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

export default FirstTimeBuyerGuide;
