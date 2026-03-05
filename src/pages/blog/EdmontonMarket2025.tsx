import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, MapPin, TrendingUp, Home, DollarSign, Building, Users, Lightbulb, HelpCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import blogImage from "@/assets/blog-edmonton-market.jpg";

const EdmontonMarket2025 = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Edmonton Real Estate Market 2025: Complete Buyer's & Investor's Guide"
        description="Edmonton real estate market 2025 analysis: housing prices, best neighborhoods, investment opportunities, and market predictions for Alberta buyers and investors."
        keywords="Edmonton real estate market 2025, best neighborhoods Edmonton, Edmonton housing prices, invest in Edmonton real estate, Edmonton vs Calgary real estate"
        image={blogImage}
        article
        publishedTime="2025-01-01"
        modifiedTime="2025-01-01"
        author="RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/edmonton-real-estate-market-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Edmonton Real Estate Market 2025: Complete Buyer's & Investor's Guide",
            "description": "Edmonton real estate market 2025 analysis: housing prices, best neighborhoods, investment opportunities, and market predictions for Alberta buyers and investors.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01"
          }
        ]}
      />

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
                17 min read
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                January 2025
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Edmonton Real Estate Market 2025: Complete Buyer's & Investor's Guide
            </h1>

            <p className="text-xl text-muted-foreground">
              With average home prices at $407,800, Edmonton offers exceptional value compared to Toronto and Vancouver—yet provides comparable quality of life and economic opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container-custom -mt-8 mb-12">
        <img 
          src={blogImage} 
          alt="Edmonton Alberta skyline with river valley"
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
                  Current Edmonton housing market statistics and trends
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Best neighborhoods for families, young professionals, and investors
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Economic factors driving Edmonton's real estate outlook
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Price predictions and market forecast for 2025-2026
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Why Edmonton is outperforming other Canadian markets
                </li>
              </ul>
            </Card>

            {/* Market Overview */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-primary" />
              Edmonton Real Estate Market Overview: January 2025
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Average Home Prices</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Single-Family Detached</span>
                    <span className="font-bold">$525,600 <span className="text-green-600 text-sm">↑3.2%</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Semi-Detached</span>
                    <span className="font-bold">$415,300 <span className="text-green-600 text-sm">↑2.8%</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Townhouse</span>
                    <span className="font-bold">$312,400 <span className="text-green-600 text-sm">↑4.1%</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Condo</span>
                    <span className="font-bold">$246,900 <span className="text-green-600 text-sm">↑1.9%</span></span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold">Overall Average</span>
                    <span className="font-bold text-primary text-xl">$407,800</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Market Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>New Listings (Dec 2024)</span>
                    <span className="font-bold">1,842</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales (Dec 2024)</span>
                    <span className="font-bold">1,156 <span className="text-green-600 text-sm">↑5.3%</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Inventory</span>
                    <span className="font-bold">4,234 listings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Months of Supply</span>
                    <span className="font-bold">3.7 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Days on Market</span>
                    <span className="font-bold">54 days <span className="text-green-600 text-sm">↓8 days</span></span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Price Comparison */}
            <h2 className="text-3xl font-bold mt-12 mb-6">Why Edmonton Is Attracting National Attention</h2>

            <Card className="p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Affordability Comparison: Edmonton vs Other Canadian Cities</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span>Vancouver</span>
                  <span className="font-bold">$1,234,000 <span className="text-red-600">(3.0x more)</span></span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span>Toronto</span>
                  <span className="font-bold">$1,102,000 <span className="text-red-600">(2.7x more)</span></span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span>Victoria</span>
                  <span className="font-bold">$924,000 <span className="text-orange-600">(2.3x more)</span></span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span>Ottawa</span>
                  <span className="font-bold">$612,000 <span className="text-yellow-600">(1.5x more)</span></span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span>Calgary</span>
                  <span className="font-bold">$568,000 <span className="text-yellow-600">(1.4x more)</span></span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-100 rounded">
                  <span className="font-bold">Edmonton</span>
                  <span className="font-bold text-green-700">$407,800 (Baseline)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                💡 For the price of a 600 sq ft condo in Toronto, you can buy a <strong>2,000 sq ft single-family home with a yard</strong> in Edmonton.
              </p>
            </Card>

            {/* Why People Move to Edmonton */}
            <Card className="p-6 mb-8 bg-green-50 border-green-200">
              <h3 className="font-bold text-lg mb-4 text-green-800">Why People Are Moving to Edmonton</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Affordable housing vs Toronto/Vancouver</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> No provincial sales tax (5% GST only)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 30-40% lower cost of living</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Strong job market in energy, tech, healthcare</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Rocky Mountains 3 hours away</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> No land transfer tax (saves $5k-10k)</li>
                </ul>
              </div>
            </Card>

            {/* Best Neighborhoods */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <MapPin className="w-8 h-8 mr-3 text-primary" />
              Best Neighborhoods in Edmonton for 2025
            </h2>

            <h3 className="text-2xl font-bold mt-8 mb-4">For Families</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <h4 className="font-bold text-primary">Terwillegar (Southwest)</h4>
                <p className="text-lg font-bold mb-2">$625,000 avg</p>
                <p className="text-sm text-muted-foreground">Top-rated schools, Terwillegar Park (300 acres), quick access to Whitemud Drive</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Summerside (West)</h4>
                <p className="text-lg font-bold mb-2">$495,000 avg</p>
                <p className="text-sm text-muted-foreground">Strong community, Lewis Farms Recreation Centre, affordable for families</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Laurier Heights (West-Central)</h4>
                <p className="text-lg font-bold mb-2">$545,000 avg</p>
                <p className="text-sm text-muted-foreground">Mature trees, close to University of Alberta, character homes</p>
              </Card>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">For Young Professionals & First-Time Buyers</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <h4 className="font-bold text-primary">Oliver (Central)</h4>
                <p className="text-lg font-bold mb-2">$265,000 condo | $485,000 home</p>
                <p className="text-sm text-muted-foreground">Walking distance to downtown, trendy 124 Street, vibrant nightlife</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Ritchie (South-Central)</h4>
                <p className="text-lg font-bold mb-2">$425,000 avg</p>
                <p className="text-sm text-muted-foreground">Character homes, walkable to Whyte Avenue, appreciation potential</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Bonnie Doon (East-Central)</h4>
                <p className="text-lg font-bold mb-2">$238,000 condo | $410,000 home</p>
                <p className="text-sm text-muted-foreground">Valley Line LRT station, affordable, river valley access</p>
              </Card>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">For Investors</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4 border-2 border-green-500">
                <h4 className="font-bold text-green-700">Mill Woods (Southeast)</h4>
                <p className="text-lg font-bold mb-2">$365,000 avg</p>
                <p className="text-sm text-muted-foreground">Highest rental demand, 10-12% rental yields, LRT access coming</p>
              </Card>
              <Card className="p-4 border-2 border-green-500">
                <h4 className="font-bold text-green-700">Abbottsfield (Northeast)</h4>
                <p className="text-lg font-bold mb-2">$298,000 avg</p>
                <p className="text-sm text-muted-foreground">Lowest entry point, 8-10% cash-on-cash returns, gentrification potential</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Strathcona (University Area)</h4>
                <p className="text-lg font-bold mb-2">$295,000 condo | $525,000 home</p>
                <p className="text-sm text-muted-foreground">U of A student rental market, steady demand, 5-7% yields</p>
              </Card>
            </div>

            {/* Investment ROI */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <DollarSign className="w-8 h-8 mr-3 text-primary" />
              Edmonton Real Estate Investment Analysis
            </h2>

            <Card className="p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Example: Mill Woods Investment Property</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Purchase Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Purchase Price:</span><span>$365,000</span></div>
                    <div className="flex justify-between"><span>Down Payment (20%):</span><span>$73,000</span></div>
                    <div className="flex justify-between"><span>Mortgage:</span><span>$292,000</span></div>
                    <div className="flex justify-between"><span>Closing Costs:</span><span>$7,500</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Monthly Costs</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Mortgage Payment:</span><span>$1,885</span></div>
                    <div className="flex justify-between"><span>Property Taxes:</span><span>$275</span></div>
                    <div className="flex justify-between"><span>Insurance:</span><span>$125</span></div>
                    <div className="flex justify-between"><span>Maintenance Reserve:</span><span>$150</span></div>
                    <div className="flex justify-between font-bold pt-2 border-t"><span>Total Expenses:</span><span>$2,435</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Annual Returns</h4>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Rental Income</p>
                    <p className="font-bold">$2,100/mo</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Equity Gain</p>
                    <p className="font-bold text-green-600">$7,800/yr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Appreciation (3%)</p>
                    <p className="font-bold text-green-600">$10,950/yr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total ROI</p>
                    <p className="font-bold text-primary text-xl">20.2%</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Market Predictions */}
            <h2 className="text-3xl font-bold mt-12 mb-6">Market Predictions: 2025-2026</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Best Case</h4>
                <p className="text-2xl font-bold text-green-700 mb-2">$440,000-450,000</p>
                <p className="text-sm text-muted-foreground">If rates drop to 3-4%, oil stabilizes at $75+</p>
                <p className="text-sm font-bold text-green-600 mt-2">+8-10% growth</p>
              </Card>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Most Likely</h4>
                <p className="text-2xl font-bold text-blue-700 mb-2">$420,000-430,000</p>
                <p className="text-sm text-muted-foreground">Moderate growth with balanced conditions</p>
                <p className="text-sm font-bold text-blue-600 mt-2">+3-5% growth</p>
              </Card>
              <Card className="p-4 bg-orange-50 border-orange-200">
                <h4 className="font-bold text-orange-800 mb-2">Pessimistic</h4>
                <p className="text-2xl font-bold text-orange-700 mb-2">$395,000-400,000</p>
                <p className="text-sm text-muted-foreground">If oil crashes, rates stay high</p>
                <p className="text-sm font-bold text-orange-600 mt-2">-2-3% correction</p>
              </Card>
            </div>

            {/* FAQs */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <HelpCircle className="w-8 h-8 mr-3 text-primary" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { q: "Is Edmonton real estate a good investment in 2025?", a: "Yes. With 3-5% annual appreciation, 7-9% rental yields, and strong economic fundamentals, Edmonton offers better risk-adjusted returns than Toronto/Vancouver." },
                { q: "What neighborhoods should first-time buyers target?", a: "Summerside, Ritchie, Bonnie Doon, and Mill Woods offer affordability ($300k-450k) with good schools and amenities." },
                { q: "Are condos or houses better investments in Edmonton?", a: "Houses appreciate faster (3.2% vs 1.9%) and offer basement suite income potential. Condos better for hands-off investors." },
                { q: "How much do I need for a down payment in Edmonton?", a: "Minimum 5% on homes under $500k. On $400k home = $20k down + $10k closing costs = $30k total." },
                { q: "Should I buy in Edmonton or Calgary?", a: "Edmonton is more affordable ($407k vs $568k average). Calgary has stronger job market but less affordability. Choose based on job location." },
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
              Edmonton's real estate market in 2025 presents a <strong>rare combination of affordability, economic stability, and growth potential</strong> that's increasingly hard to find in Canada's major cities.
            </p>
            <p className="text-muted-foreground mb-8">
              With average home prices at <strong>$407,800</strong>, steady appreciation of <strong>3-5% annually</strong>, and strong fundamentals driven by energy sector diversification, tech growth, and interprovincial migration, Edmonton offers compelling opportunities for buyers and investors alike.
            </p>

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-r from-primary to-secondary text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Explore Edmonton Real Estate?</h3>
              <p className="mb-6 text-white/90">
                Connect with an agent who uses AI-powered tools to respond instantly and provide data-driven neighborhood insights.
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
                    <p className="text-sm text-muted-foreground">National trends and predictions</p>
                  </Card>
                </Link>
                <Link to="/first-time-home-buyer-guide-canada-2025" className="block">
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-primary">First-Time Home Buyer Guide Canada 2025</h4>
                    <p className="text-sm text-muted-foreground">Everything you need to know</p>
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

export default EdmontonMarket2025;
