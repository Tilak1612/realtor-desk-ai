// Fact-checked 2026-10-12 against the Realtor Desk fact sheet of that date.
//
// Kept, each checked against the body that sets it and named in the text:
// minimum down payment tiers (FCAC), CMHC premium rates and the 1.5% to 4%
// closing-cost guidance (CMHC), CMHC's 600 credit score minimum, the Home
// Buyers' Plan limit and home buyers' amount (CRA), the GST new housing rebate
// (CRA guide RC4028), the Ontario and Toronto land transfer tax rebates, the
// B.C. first time home buyers' exemption, and Alberta's land titles fees.
//
// Removed (no source on the page): mortgage rate ranges, itemised closing-cost
// dollar ranges, the "$500 inspection saves $50,000" line, credit score tiers
// above 600, the "60-90 days" timeline, the self-employed down payment range,
// the market and interest rate outlook, the Quebec "$50,000" loan figure, and
// the call to action implying an agent tool that replies instantly.
//
// Corrected because the rule changed: the 20% tier starts at $1.5 million, the
// Home Buyers' Plan limit is $60,000, and the First-Time Home Buyer Incentive
// is closed.
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, Home, DollarSign, FileText, CheckCircle2, AlertTriangle, Lightbulb, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import blogImage from "@/assets/blog-first-time-buyer.jpg";
import blogImageAvif from "@/assets/blog-first-time-buyer.avif";
import blogImageWebp from "@/assets/blog-first-time-buyer.webp";
import { Picture } from "@/components/Picture";
import { ContentVintage } from "@/components/marketing/ContentVintage";

const FirstTimeBuyerGuide = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="First-Time Home Buyer Guide for Canada 2025"
        description="Complete first-time home buyer guide for Canada 2025. Learn about down payments, mortgage pre-approval, closing costs, and CMHC insurance."
        keywords="first time home buyer Canada, down payment requirements Canada, CMHC insurance, home buying process Canada, first time buyer programs"
        image={blogImage}
        article
        publishedTime="2025-01-01"
        modifiedTime="2026-10-12"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/first-time-home-buyer-guide-canada-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "First-Time Home Buyer Guide for Canada 2025: Everything You Need to Know",
            "description": "Complete first-time home buyer guide for Canada 2025. Learn about down payments, mortgage pre-approval, closing costs, and CMHC insurance.",
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
                18 min read
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                January 2025 · Updated October 12, 2026
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              First-Time Home Buyer Guide for Canada 2025: Everything You Need to Know
            </h1>

            <ContentVintage
              published="2026-01-09"
              className="mb-6"
              note="One exception: on October 12, 2026 the government rules and program limits on this page were checked against the official sources named beside them, and figures without a source were removed. Nothing else was refreshed."
            />
            <p className="text-xl text-muted-foreground">
              Buying your first home in Canada is one of the most significant financial decisions you'll ever make. This guide walks through each step and names the official source for every government rule it quotes.
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
            alt="First-time home buyers with keys to new home"
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
                  How much you need for a down payment in Canada
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  Step-by-step home buying process from pre-approval to closing
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  First-time buyer programs and incentives by province
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
                  Common first-time buyer mistakes and how to avoid them
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-700 flex-shrink-0 mt-0.5" />
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
              The federal government sets the minimum down payment by purchase price. These are the tiers published by the Financial Consumer Agency of Canada, as of October 2026:
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 text-center">
                <h4 className="font-bold text-primary mb-2">$500,000 or less</h4>
                <p className="text-2xl font-bold">5%</p>
                <p className="text-sm text-muted-foreground">Minimum down</p>
                <p className="text-xs text-muted-foreground mt-2">Example: $25,000 on $500,000</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-bold text-primary mb-2">$500,000 to $1.5 million</h4>
                <p className="text-2xl font-bold">5% + 10%</p>
                <p className="text-sm text-muted-foreground">5% of the first $500,000, 10% of the rest</p>
                <p className="text-xs text-muted-foreground mt-2">Example: $45,000 on $700,000</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-bold text-primary mb-2">$1.5 million or more</h4>
                <p className="text-2xl font-bold">20%</p>
                <p className="text-sm text-muted-foreground">Minimum required</p>
                <p className="text-xs text-muted-foreground mt-2">Example: $300,000 on $1.5 million</p>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Source: <a className="underline" href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html" rel="noopener noreferrer" target="_blank">Financial Consumer Agency of Canada, "Down payment"</a>. These tiers have changed before, so check that page before you rely on them.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">CMHC Mortgage Default Insurance</h3>
            <p className="text-muted-foreground mb-4">
              If your down payment is less than 20%, you'll need to purchase mortgage default insurance through CMHC (Canada Mortgage and Housing Corporation), Sagen, or Canada Guaranty.
            </p>

            <Card className="p-6 mb-8">
              <h4 className="font-bold mb-4">CMHC Insurance Premium Rates (as of October 2026)</h4>
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
                Example: on a $500,000 home with 5% down ($25,000), the loan is $475,000 and the CMHC premium at 4.00% is $19,000, which can be added to your mortgage.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Source: <a className="underline" href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/cmhc-mortgage-loan-insurance-cost" rel="noopener noreferrer" target="_blank">CMHC, "CMHC Mortgage Loan Insurance Cost"</a>. The premium is a percentage of the loan. CMHC notes that premiums in Quebec, Ontario and Saskatchewan are subject to provincial sales tax, which cannot be added to the loan. Sagen and Canada Guaranty publish their own rates.
              </p>
            </Card>

            <h3 className="text-2xl font-bold mt-8 mb-4">Closing Costs to Budget For</h3>
            <p className="text-muted-foreground mb-4">
              Beyond your down payment, CMHC advises budgeting for closing costs (for example, legal and land transfer fees) equal to 1.5% to 4% of the purchase price. The items below are the usual ones. We quote no dollar range for each, because they vary by province, property and provider.
            </p>

            <Card className="p-6 mb-8">
              <h4 className="font-bold mb-4">Typical Closing Costs</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Land Transfer Tax</span>
                    <span>Set by your province or city</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Home Inspection</span>
                    <span>Quote from an inspector</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Appraisal Fee</span>
                    <span>Ask your lender</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Legal Fees</span>
                    <span>Quote from a lawyer or notary</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Title Insurance</span>
                    <span>Ask your lawyer</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Property Insurance</span>
                    <span>Quote from an insurer</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Property Tax Adjustment</span>
                    <span>Pro-rated</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Utility Connections</span>
                    <span>Ask each provider</span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold mt-4 text-primary">
                At CMHC's 1.5% to 4%, that is $7,500 to $20,000 on a $500,000 home.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Source: <a className="underline" href="https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/what-are-the-general-requirements-to-qualify-for-homeowner-mortgage-loan-insurance" rel="noopener noreferrer" target="_blank">CMHC, general requirements for homeowner mortgage loan insurance</a>.
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
                { step: 2, title: "Find the Right Real Estate Agent", desc: "Ask any agent you interview how they are paid and what agreement you would sign, since this varies by province and brokerage. A good agent will understand your budget and needs." },
                { step: 3, title: "Start House Hunting", desc: "Create your must-have list including location, home type, bedrooms/bathrooms, outdoor space, and parking requirements." },
                { step: 4, title: "Make an Offer", desc: "When you find 'the one,' your agent will help you craft a competitive offer including purchase price, deposit, conditions, and closing date." },
                { step: 5, title: "Home Inspection", desc: "An inspection can find problems that are expensive to repair before you are committed to the purchase. Talk to your agent before you waive an inspection condition." },
                { step: 6, title: "Finalize Your Mortgage", desc: "Once conditions are removed, finalize your mortgage and choose between a fixed and a variable rate. Rates change often, so compare current quotes from several lenders or a mortgage broker." },
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
                <p className="text-sm text-muted-foreground">Closed. CMHC states that the program is no longer accepting applications. The deadline for new submissions was March 21, 2024.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">Home Buyers' Plan (HBP)</h4>
                <p className="text-sm text-muted-foreground">Withdraw up to $60,000 from your RRSP to buy or build a qualifying home (Canada Revenue Agency limit, as of October 2026). You repay it to your RRSP over 15 years. The CRA sets out when repayments start.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">First-Time Home Buyers' Tax Credit</h4>
                <p className="text-sm text-muted-foreground">The home buyers' amount: a non-refundable federal credit claimed on up to $10,000 for a qualifying home bought in 2025 (Canada Revenue Agency, line 31270). Check the CRA page for the year you buy.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-primary mb-2">GST/HST New Housing Rebate</h4>
                <p className="text-sm text-muted-foreground">A partial GST rebate on a new or substantially renovated home, up to $6,300, reduced above $350,000 and not available at $450,000 or more (CRA guide RC4028). The CRA also lists a separate first-time home buyers' GST/HST rebate that has received Royal Assent. See canada.ca for its terms.</p>
              </Card>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              Program limits change. Each figure in this section names the body that sets it, checked in October 2026. Confirm on that body's own site before you rely on it.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Provincial Programs</h3>
            
            <div className="space-y-4 mb-8">
              <Card className="p-4">
                <h4 className="font-bold mb-2">🍁 Ontario</h4>
                <p className="text-sm text-muted-foreground">Land transfer tax refund for first-time homebuyers of up to $4,000 (Ontario Ministry of Finance). Toronto's municipal land transfer tax has its own first-time purchaser rebate of up to $4,475 (City of Toronto). Both as of October 2026.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold mb-2">🏔️ British Columbia</h4>
                <p className="text-sm text-muted-foreground">First time home buyers' program: a property transfer tax exemption on the first $500,000 of a home with a fair market value of $835,000 or less, and a partial exemption below $860,000, for purchases from April 1, 2024 (Government of British Columbia, as of October 2026).</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold mb-2">🛢️ Alberta</h4>
                <p className="text-sm text-muted-foreground">No land transfer tax of the kind Ontario and B.C. charge. Alberta charges land titles registration fees instead: $50 plus $5 per $5,000 of the property's value on the transfer, and the same on the mortgage principal (Government of Alberta, Land Titles fee schedule effective October 1, 2026).</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold mb-2">⚜️ Quebec</h4>
                <p className="text-sm text-muted-foreground">Some municipalities run their own programs, such as the City of Québec's Accès Famille. Amounts and eligibility differ, so check your municipality's site and Revenu Québec.</p>
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
                { mistake: "Maxing Out Your Budget", risk: "No financial cushion for repairs or rate increases", fix: "Buy below your maximum approval and keep a cushion" },
                { mistake: "Ignoring Hidden Costs", risk: "Underestimating taxes, fees, and maintenance", fix: "Set aside money every month for repairs and maintenance" },
                { mistake: "Waiving Home Inspection", risk: "Discovering expensive repairs after closing", fix: "Only waive in extreme situations with agent guidance" },
                { mistake: "Not Shopping Around for Mortgages", risk: "Accepting higher rates than necessary", fix: "Compare rates from several lenders or use a mortgage broker" },
              ].map((item, idx) => (
                <Card key={idx} className="p-4 border-l-4 border-orange-500">
                  <h4 className="font-bold text-orange-700 mb-2">❌ {item.mistake}</h4>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Risk:</strong> {item.risk}</p>
                  <p className="text-sm text-green-700"><strong>✓ Fix:</strong> {item.fix}</p>
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
                { q: "How much credit score do I need to buy a home in Canada?", a: "For an insured mortgage, CMHC requires at least one borrower or guarantor to have a credit score of 600 or higher (as of October 2026). Lenders set their own requirements on top of that, so ask a lender or mortgage broker what applies to you." },
                { q: "Can I buy a home with less than 5% down?", a: "No. 5% is the federal minimum, and it applies to a purchase price of $500,000 or less. Above that the minimum rises, as set out in the tiers above (Financial Consumer Agency of Canada, as of October 2026)." },
                { q: "How long does the home buying process take?", a: "It varies with the market, your financing and the closing date you negotiate. Your agent and lender can tell you what is usual where you are buying." },
                { q: "Should I buy or rent in 2025?", a: "It depends on how long you expect to stay, your savings and your local market. Buying builds equity over time. Renting keeps you flexible if your location or career is uncertain." },
                { q: "What if I'm self-employed?", a: "Expect to show more documents than a salaried buyer, such as tax returns and notices of assessment. Requirements differ by lender, so work with a mortgage broker experienced in self-employed applications." },
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
              <strong>This guide makes no market or interest rate forecast.</strong> For current conditions, see the Bank of Canada for the policy rate, CMHC for its Housing Market Outlook and the Canadian Real Estate Association for national sales and price statistics.
            </p>

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-r from-rd-navy-800 to-rd-navy-600 text-white text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Start Your Home Buying Journey?</h3>
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
