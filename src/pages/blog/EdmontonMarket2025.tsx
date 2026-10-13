// Fact-checked 2026-10-12 against the Realtor Desk fact sheet of that date.
//
// The price and activity figures that were here ($407,800 overall, 1,156
// sales, 54 days on market and so on) had no source and did not match the
// REALTORS Association of Edmonton's own release for the same month. They are
// replaced with the association's December 2024 figures (media release of
// January 3, 2025), attributed in the text.
//
// Removed (no source): the city-by-city price table, every neighbourhood
// average price, rental yield and cash-on-cash figures, the worked investment
// example and its 20.2% return, the three price scenarios for 2025-2026, the
// "30-40% lower cost of living" and "saves $5k-10k" lines, and the FAQ answers
// built on those numbers.
//
// Kept and sourced: no provincial sales tax (CRA), Alberta land titles fees
// (fee schedule effective October 1, 2026), the federal minimum down payment
// (FCAC) and CMHC's closing-cost guidance.
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, MapPin, TrendingUp, Home, DollarSign, Building, Users, Lightbulb, HelpCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import blogImage from "@/assets/blog-edmonton-market.jpg";
import blogImageAvif from "@/assets/blog-edmonton-market.avif";
import blogImageWebp from "@/assets/blog-edmonton-market.webp";
import { Picture } from "@/components/Picture";
import { ContentVintage } from "@/components/marketing/ContentVintage";

const EdmontonMarket2025 = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Edmonton Real Estate Market 2025"
        description="Edmonton real estate market 2025: housing prices, neighbourhoods and what the data means for Alberta buyers, sellers and investors."
        keywords="Edmonton real estate market 2025, best neighborhoods Edmonton, Edmonton housing prices, invest in Edmonton real estate, Edmonton vs Calgary real estate"
        image={blogImage}
        article
        publishedTime="2025-01-01"
        modifiedTime="2026-10-12"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/edmonton-real-estate-market-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Edmonton Real Estate Market 2025",
            "description": "Edmonton real estate market 2025: housing prices, neighbourhoods and what the data means for Alberta buyers, sellers and investors.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-01",
            "dateModified": "2026-10-12"
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
                January 2025 · Updated October 12, 2026
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Edmonton Real Estate Market 2025
            </h1>

            <ContentVintage
              published="2026-01-09"
              className="mb-6"
              note="One exception: on October 12, 2026 figures without a named source were removed, and the December 2024 statistics were replaced with those published by the REALTORS Association of Edmonton. The market commentary was not refreshed."
            />
            <p className="text-xl text-muted-foreground">
              Edmonton is often compared with Toronto and Vancouver on price. This page gives the December 2024 figures published by the REALTORS Association of Edmonton and points to the bodies that publish current ones.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container-custom -mt-8 mb-12">
        <Picture
            src={blogImage}
            avif={blogImageAvif}
            webp={blogImageWebp}
            width={1024}
            height={576}
            alt="Edmonton Alberta skyline with river valley"
            className="w-full max-w-4xl rounded-2xl shadow-xl"
            priority
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
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  Edmonton housing statistics for December 2024, with the source named
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  Neighbourhoods to look at for families, young professionals and investors
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  Tax and fee differences between Alberta and other provinces
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  Where to find published forecasts for 2025-2026
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  How to compare Edmonton with other Canadian cities on published data
                </li>
              </ul>
            </Card>

            {/* Market Overview */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-primary" />
              Edmonton Real Estate Market Overview: January 2025
            </h2>

            <p className="text-muted-foreground mb-6">
              The figures below are for the Greater Edmonton Area in December 2024, as published by the REALTORS Association of Edmonton in its media release of January 3, 2025. The percentage beside each figure is the change from December 2023.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Average Selling Prices (December 2024)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Detached</span>
                    <span className="font-bold">$540,232 <span className="text-green-700 text-sm">↑10.6%</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Semi-Detached</span>
                    <span className="font-bold">$408,823 <span className="text-green-700 text-sm">↑12.3%</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Row/Townhouse</span>
                    <span className="font-bold">$292,640 <span className="text-green-700 text-sm">↑12.3%</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Apartment Condominium</span>
                    <span className="font-bold">$203,920 <span className="text-green-700 text-sm">↑19.8%</span></span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold">All-Residential Average</span>
                    <span className="font-bold text-primary text-xl">$435,549 <span className="text-green-700 text-sm">↑12.2%</span></span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Market Activity (December 2024)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>New Residential Listings</span>
                    <span className="font-bold">1,367 <span className="text-muted-foreground text-sm">↓7.3%</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Residential Sales</span>
                    <span className="font-bold">1,428 <span className="text-green-700 text-sm">↑17.2%</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory at Month End</span>
                    <span className="font-bold">3,491 <span className="text-muted-foreground text-sm">↓24.6%</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span>MLS HPI Composite Benchmark</span>
                    <span className="font-bold">$403,900 <span className="text-green-700 text-sm">↑7.8%</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Days on Market</span>
                    <span className="font-bold">44 days <span className="text-green-700 text-sm">↓8 days</span></span>
                  </div>
                </div>
              </Card>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              Source: <a className="underline" href="https://realtorsofedmonton.com/wp-content/uploads/2025/01/DECEMBER_2024_YEGMediastats.pdf" rel="noopener noreferrer" target="_blank">REALTORS Association of Edmonton, media release of January 3, 2025</a>. The association notes that average prices indicate market trends only and do not show the change in value of any particular property. For the latest month, see realtorsofedmonton.com.
            </p>

            {/* Price Comparison */}
            <h2 className="text-3xl font-bold mt-12 mb-6">How Edmonton Compares With Other Canadian Cities</h2>

            <Card className="p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Comparing Prices Across Cities</h3>
              <p className="text-muted-foreground mb-4">
                This page gives no city-by-city price table. A fair comparison needs figures from one source, for the same month, measured the same way, and we have none we can stand behind for Vancouver, Toronto, Victoria, Ottawa or Calgary.
              </p>
              <p className="text-muted-foreground mb-0">
                The Canadian Real Estate Association publishes average prices and MLS Home Price Index benchmarks for each local board at crea.ca. Use the same month and the same measure for each city. For reference, the Greater Edmonton Area all-residential average was $435,549 in December 2024 (REALTORS Association of Edmonton).
              </p>
            </Card>

            {/* What is different about Alberta */}
            <Card className="p-6 mb-8 bg-green-50 border-green-200">
              <h3 className="font-bold text-lg mb-4 text-green-800">What Is Different About Buying in Alberta</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700" /> No provincial sales tax: 5% GST only (Canada Revenue Agency)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700" /> Employers in energy, technology and health care</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700" /> The Rocky Mountains are within driving distance</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-700" /> Land titles registration fees instead of a land transfer tax</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-4 mb-0">
                Alberta's Land Titles fee schedule, effective October 1, 2026, sets the fee to register a transfer at $50 plus $5 per $5,000 of the property's value, and the same on the principal of a mortgage. We quote no cost-of-living comparison because we have none we can source.
              </p>
            </Card>

            {/* Best Neighborhoods */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <MapPin className="w-8 h-8 mr-3 text-primary" />
              Edmonton Neighbourhoods to Look At in 2025
            </h2>

            <p className="text-muted-foreground mb-6">
              The association's monthly release does not break prices out by neighbourhood, so this section quotes none. Ask a local REALTOR for recent comparable sales in any area you are considering.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">For Families</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <h4 className="font-bold text-primary">Terwillegar (Southwest)</h4>
                <p className="text-sm text-muted-foreground">Schools in the area, Terwillegar Park, access to Whitemud Drive</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Summerside (Southeast)</h4>
                <p className="text-sm text-muted-foreground">Community built around Lake Summerside, south of Ellerslie Road</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Laurier Heights (West-Central)</h4>
                <p className="text-sm text-muted-foreground">Mature trees, close to University of Alberta, character homes</p>
              </Card>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">For Young Professionals & First-Time Buyers</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <h4 className="font-bold text-primary">Wîhkwêntôwin, formerly Oliver (Central)</h4>
                <p className="text-sm text-muted-foreground">Walking distance to downtown, trendy 124 Street, vibrant nightlife</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Ritchie (South-Central)</h4>
                <p className="text-sm text-muted-foreground">Character homes, walkable to Whyte Avenue</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Bonnie Doon (East-Central)</h4>
                <p className="text-sm text-muted-foreground">Valley Line LRT stop, river valley access</p>
              </Card>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">For Investors</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4 border-2 border-green-500">
                <h4 className="font-bold text-green-700">Mill Woods (Southeast)</h4>
                <p className="text-sm text-muted-foreground">Valley Line Southeast LRT stop at Mill Woods, in service since November 2023</p>
              </Card>
              <Card className="p-4 border-2 border-green-500">
                <h4 className="font-bold text-green-700">Abbottsfield (Northeast)</h4>
                <p className="text-sm text-muted-foreground">Northeast neighbourhood. Check recent sale prices and current rents before you assume any return</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary">Strathcona (University Area)</h4>
                <p className="text-sm text-muted-foreground">Close to the University of Alberta and Whyte Avenue</p>
              </Card>
            </div>

            {/* Investment ROI */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <DollarSign className="w-8 h-8 mr-3 text-primary" />
              Edmonton Real Estate Investment Analysis
            </h2>

            <p className="text-muted-foreground mb-6">
              This page gives no example return and no rental yield, because we have no sourced figures for purchase price, rent or appreciation in any one neighbourhood. The outline below shows what to gather. For rents and vacancy, CMHC publishes a Rental Market Report that covers Edmonton.
            </p>

            <Card className="p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Work It Out With Your Own Figures</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Purchase Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Purchase Price:</span><span>from comparable sales</span></div>
                    <div className="flex justify-between"><span>Down Payment:</span><span>ask your lender</span></div>
                    <div className="flex justify-between"><span>Mortgage:</span><span>price less down payment</span></div>
                    <div className="flex justify-between"><span>Closing Costs:</span><span>quote from your lawyer</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Monthly Costs</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Mortgage Payment:</span><span>from your lender</span></div>
                    <div className="flex justify-between"><span>Property Taxes:</span><span>from the tax notice</span></div>
                    <div className="flex justify-between"><span>Insurance:</span><span>quote from an insurer</span></div>
                    <div className="flex justify-between"><span>Maintenance and Vacancy:</span><span>your allowance</span></div>
                    <div className="flex justify-between font-bold pt-2 border-t"><span>Total Expenses:</span><span>the sum of the above</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Annual Return</h4>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Rental Income</p>
                    <p className="font-bold">from current listings</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Less Annual Expenses</p>
                    <p className="font-bold">from the list above</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Divided By</p>
                    <p className="font-bold">the cash you put in</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 mb-0">
                  Appreciation is not known in advance, so leave it out of the return you plan on. Speak to an accountant about tax before you buy.
                </p>
              </div>
            </Card>

            {/* Market Predictions */}
            <h2 className="text-3xl font-bold mt-12 mb-6">Market Forecasts for 2025-2026: Where to Look</h2>

            <p className="text-muted-foreground mb-4">
              This page makes no price prediction for Edmonton. A forecast is only as good as the body behind it and the date it was made.
            </p>
            <p className="text-muted-foreground mb-8">
              Published forecasts come from CMHC, in its Housing Market Outlook, and from the Canadian Real Estate Association, in its quarterly forecast. The REALTORS Association of Edmonton reports what actually happened each month. Read the date on any forecast before you use it with a client.
            </p>

            {/* FAQs */}
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center">
              <HelpCircle className="w-8 h-8 mr-3 text-primary" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { q: "Is Edmonton real estate a good investment in 2025?", a: "That depends on the property, the price you pay, the rent it earns and your costs, and this page cannot answer it for you. Work through the outline in the investment section with current figures, and speak to a licensed REALTOR and an accountant before you buy." },
                { q: "What neighborhoods should first-time buyers target?", a: "Summerside, Ritchie, Bonnie Doon and Mill Woods are among the areas covered above. Ask a local REALTOR for recent sale prices in each, because the association's monthly release does not break prices out by neighbourhood." },
                { q: "Are condos or houses better investments in Edmonton?", a: "In December 2024, detached homes in the Greater Edmonton Area averaged $540,232, up 10.6% from a year earlier, and apartment condominiums averaged $203,920, up 19.8% (REALTORS Association of Edmonton). One month of averages does not predict returns. A house costs more to buy and maintain. A condo comes with condo fees and less upkeep." },
                { q: "How much do I need for a down payment in Edmonton?", a: "The federal minimum is 5% of a purchase price of $500,000 or less, so $20,000 on a $400,000 home (Financial Consumer Agency of Canada, as of October 2026). CMHC advises budgeting a further 1.5% to 4% of the price for closing costs, which is $6,000 to $16,000 on $400,000." },
                { q: "Should I buy in Edmonton or Calgary?", a: "Compare the two using the Canadian Real Estate Association's figures for each board, for the same month and the same measure, then weigh where your work is. This page quotes no Calgary figure because it has none from the same source and period." },
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
              Edmonton's real estate market in 2025 is best judged from <strong>published figures with a named source and a date</strong>, not from a single headline number.
            </p>
            <p className="text-muted-foreground mb-8">
              In December 2024 the all-residential average selling price in the Greater Edmonton Area was <strong>$435,549</strong>, up <strong>12.2%</strong> from December 2023 (REALTORS Association of Edmonton). For the current month, and for any forecast, go to the association, the Canadian Real Estate Association or CMHC directly.
            </p>

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-r from-rd-navy-800 to-rd-navy-600 text-white text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Explore Edmonton Real Estate?</h3>
              <p className="mb-6 text-white/90">
                Realtor Desk is a CRM for Canadian real estate agents. If you are an agent, see how it keeps your leads and follow-ups in one place.
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
