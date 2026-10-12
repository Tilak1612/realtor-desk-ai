// Rewritten 2026-10-11 to follow the Realtor Desk fact sheet of that date.
//
// Removed: every Calgary statistic that had no source on the page (buyer
// percentages, average prices, "40% slower", "63% after 6 PM", "60% fewer
// showings", "67% first responder"), two invented case studies, the "Mark S."
// success story, the "Expected ROI" card, and every passage that credited
// Realtor Desk with things it does not have: generated neighbourhood content,
// MLS or market data, a chatbot, automatic replies, automated nurturing, video
// scripts and voiceover, a live CREA DDF connection.
//
// What is left is advice the reader can carry out with any tools, plus a short
// section on what Realtor Desk does.
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, TrendingUp, MapPin, Snowflake, Users, Building2, Video, Zap, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ProductScopeNote } from "@/components/marketing/ProductScopeNote";

const CalgaryMarketingGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Calgary Real Estate Marketing Strategies"
        description="Seven marketing ideas for Calgary real estate agents: neighbourhood content, winter follow-up, relocation buyers, video and a routine for replying to leads."
        keywords="Calgary real estate marketing, Alberta real estate agents, Calgary lead generation, real estate marketing ideas Calgary"
        article
        publishedTime="2026-01-01"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/resources/calgary-real-estate-marketing-strategies"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Calgary Real Estate Marketing Strategies",
            "description": "Seven marketing ideas for Calgary real estate agents: neighbourhood content, winter follow-up, relocation buyers, video and a routine for replying to leads.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2026-01-01",
            "dateModified": "2026-10-11"
          }
        ]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Calgary, Alberta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Calgary Real Estate Marketing Strategies
            </h1>
            <ProductScopeNote className="mb-6" />
            <p className="text-xl text-gray-600 mb-8">
              Seven marketing ideas for Calgary real estate agents, written as steps you can carry out with whatever tools you already use.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
              <span>Updated: October 2026</span>
              <span>8 min read</span>
              <span>Local Strategy Guide</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Calgary's real estate market does not behave like Toronto's or Vancouver's. Energy prices, suburban communities like Mahogany and Auburn Bay, and -30°C winters all shape how people buy and sell here.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Marketing advice written for other cities needs adjusting before it fits. The ideas below are organised around the things that are particular to Calgary: its communities, its seasons and the people who move here.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This guide quotes no market statistics. We do not hold Calgary market data, so where a number matters, take it from the Calgary Real Estate Board's published statistics and say where it came from.
            </p>
          </div>

          {/* Understanding Calgary Market */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Understanding Calgary's Real Estate Market</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Economic Factors</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Oil & gas influence:</strong> many buyers and sellers work in or around the energy sector</li>
                  <li>• <strong>Boom and bust cycles:</strong> confidence follows energy prices, so plan for both</li>
                  <li>• <strong>Technology sector:</strong> a second source of relocating buyers</li>
                  <li>• <strong>Prices:</strong> quote current figures from the Calgary Real Estate Board, with the date</li>
                  <li>• <strong>Affordability:</strong> a common reason buyers from other provinces look here</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Geographic Considerations</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Suburban sprawl:</strong> Mahogany, Cranston, Walden, Auburn Bay</li>
                  <li>• <strong>Inner city:</strong> Kensington, Bridgeland, Inglewood</li>
                  <li>• <strong>Quadrant dynamics:</strong> NE (affordable), NW (established), SE (new), SW (premium)</li>
                  <li>• <strong>Commute matters:</strong> C-Train access is premium feature</li>
                  <li>• <strong>School districts:</strong> CBE vs CSSD drives decisions</li>
                </ul>
              </Card>
            </div>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Buyer Groups to Plan For</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">Young Families</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">Energy Professionals</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">Tech Sector</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">Retirees</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                We give no percentages for these groups because we have no sourced figures. Look at your own last two years of clients to see which you serve most.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Snowflake className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Seasonal Challenges</h3>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-bold mb-2">Nov-Feb (Winter)</p>
                  <p className="text-sm text-gray-700">Slower market</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-bold mb-2">Mar-May (Spring)</p>
                  <p className="text-sm text-gray-700">Usually the busiest season</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="font-bold mb-2">Jun-Aug (Summer)</p>
                  <p className="text-sm text-gray-700">Active, with holidays in the way</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="font-bold mb-2">Sep-Oct (Fall)</p>
                  <p className="text-sm text-gray-700">A second, shorter busy period</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                This is the general seasonal pattern, not a measurement. Check the Calgary Real Estate Board's monthly statistics for the current year.
              </p>
            </Card>
          </section>

          {/* Strategy 1: Hyperlocal Content */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategy #1: Hyperlocal Neighborhood Content</h2>

            <Card className="p-6 mb-6 border-2 border-primary">
              <p className="text-lg font-semibold text-primary mb-4">
                Why this suits Calgary: the city is made up of many distinct communities, and buyers tend to research the specific ones they are considering.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Content to Create</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm mb-2">Neighborhood Profiles:</p>
                    <ul className="space-y-1 text-sm text-gray-700 ml-4">
                      <li>• "Mahogany: Lakefront Living in SE Calgary"</li>
                      <li>• "Auburn Bay: Family Paradise with Beach"</li>
                      <li>• "Cranston: Master-Planned Community"</li>
                      <li>• "Bridgeland: Inner City Near Downtown"</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-sm mb-2">School District Guides:</p>
                    <ul className="space-y-1 text-sm text-gray-700 ml-4">
                      <li>• "Top 10 Elementary Schools in Calgary SW"</li>
                      <li>• "Calgary Catholic School Rankings"</li>
                      <li>• "French Immersion Options"</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Commute Analysis:</p>
                    <ul className="space-y-1 text-sm text-gray-700 ml-4">
                      <li>• "Best Neighborhoods for Downtown Commuters"</li>
                      <li>• "C-Train Access Communities"</li>
                      <li>• "Work-From-Home Friendly Areas"</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Where to Get the Facts</h3>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Neighbourhood content is only useful if it is accurate. Draw on:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Calgary Real Estate Board statistics for pricing trends</li>
                  <li>✓ School board websites for catchments and programs</li>
                  <li>✓ Statistics Canada census profiles for demographics</li>
                  <li>✓ A mapping app for commute times at rush hour</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">Realtor Desk does not do this for you.</p>
                  <p className="text-sm text-gray-700">It does not generate neighbourhood content and does not supply MLS or market data. You write these pages yourself, or with a general writing tool whose output you check.</p>
                </div>
              </Card>
            </div>
          </section>

          {/* Strategy 2: Winter Market */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategy #2: Winter Market Tactics</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="font-bold mb-3 text-red-900">The Challenge</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Sales slow from November to February</li>
                  <li>• Buyers hesitate in cold weather</li>
                  <li>• Showings are literally freezing</li>
                  <li>• It is tempting to ease off until spring</li>
                </ul>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="font-bold mb-3 text-green-900">A Practical Response</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Use winter to build your spring pipeline</li>
                  <li>• Keep in touch with winter enquiries on a set schedule</li>
                  <li>• Offer virtual tours so weather is less of a barrier</li>
                  <li>• Go into March with a list of people to call</li>
                </ul>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Tactic #1: Virtual Tours</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 3D tours (no one wants to visit 10 homes in -25°C)</li>
                  <li>• Narrated video walkthroughs</li>
                  <li>• A "See Before You Freeze" campaign</li>
                  <li>• Let buyers rule homes out before booking an in-person showing</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Tactic #2: Keep in Touch With Winter Browsers</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Reply personally to each winter website enquiry</li>
                  <li>• Offer a reason to start now: "Start your search now, see properties in spring"</li>
                  <li>• Set a date for the next contact every time you speak to someone</li>
                  <li>• Only email people who have agreed to hear from you, and include a way to unsubscribe</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Tactic #3: Off-Season Seller Prep</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Publish "Prepare Your Home to Sell in Spring" content</li>
                  <li>• Many spring sellers start thinking about it in winter</li>
                  <li>• Offer a pre-listing walkthrough in January or February</li>
                  <li>• Note each seller's intended timing so you call at the right moment</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Strategy 3: Oil & Gas Marketing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategy #3: Oil & Gas Sector Marketing</h2>

            <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
              <p className="text-lg font-semibold text-blue-900">
                Why this matters: the energy sector is a major employer in Calgary, and its staff relocate in and out of the city.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold mb-3">Marketing Tactics</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold mb-1">Corporate Relocation Contacts:</p>
                    <p>Introduce yourself to the people who handle relocation at large energy employers and at relocation firms</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">LinkedIn Presence:</p>
                    <p>Post market updates, tag energy companies</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Proximity Marketing:</p>
                    <p>"Just listed: 10 min from Suncor offices"</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5">
                <h3 className="font-bold mb-3">Boom/Bust Adaptation</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="p-3 bg-white rounded">
                    <p className="font-semibold mb-1">When oil prices are UP:</p>
                    <p>Market luxury and move-up homes</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-semibold mb-1">When oil prices are DOWN:</p>
                    <p>Market investment properties and rentals</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Strategy 4: Family Focus */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategy #4: Suburban Family Focus</h2>
            
            <Card className="p-6 mb-6">
              <p className="text-lg mb-4">
                <strong>Many Calgary buyers are young families</strong> looking for:
              </p>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Good Schools</p>
                </div>
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Parks & Rec</p>
                </div>
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Safe Areas</p>
                </div>
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Affordability</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-3">Family-Focused Content Ideas</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• "Best Family Neighborhoods in Calgary 2026"</li>
                  <li>• "Top 10 Parks in Calgary SE"</li>
                  <li>• "Swimming Lessons Near Mahogany"</li>
                  <li>• "After-School Programs in Auburn Bay"</li>
                  <li>• "Schools with Best Playgrounds in Calgary"</li>
                </ul>
              </Card>

              <Card className="p-6 bg-green-50">
                <h3 className="font-bold mb-3">Writing for Families</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Describe what is nearby: schools, parks, pathways, recreation centres</li>
                  <li>✓ Be specific: "3-bedroom backing onto a park" says more than "family home"</li>
                  <li>✓ Ask buyers what they want close to home, and let them tell you</li>
                  <li>✓ Suggest communities from what they said, not from assumptions about them</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Strategy 5: Interprovincial Migration */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategy #5: Interprovincial Migration Marketing</h2>

            <Card className="p-6 mb-6 border-2 border-primary">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">The Opportunity</h3>
              </div>
              <p className="text-lg">
                Buyers from Ontario and British Columbia move to Calgary in part for <strong>affordability</strong>. If you quote a price difference, take it from published board statistics and give the date.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="font-bold mb-3">The Challenge</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Don't know Calgary neighborhoods</li>
                  <li>• Unfamiliar with the local market</li>
                  <li>• Closing costs and process differ between provinces</li>
                  <li>• Can't visit many times before moving</li>
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5">
                <h3 className="font-bold mb-3">Your Solution</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ "Toronto to Calgary" landing pages</li>
                  <li>✓ Virtual "Buy Before You Move" packages</li>
                  <li>✓ Neighborhood equivalents guide</li>
                  <li>✓ Cost comparison calculators</li>
                </ul>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Relocation Content to Create</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold mb-2">Landing Pages:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• "Moving from Toronto to Calgary"</li>
                    <li>• "Vancouver to Calgary Guide"</li>
                    <li>• Cost comparison tool</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold mb-2">Neighborhood Guides:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• "Toronto's Yorkville = Calgary's Inglewood"</li>
                    <li>• "Like Kitsilano? Try Kensington"</li>
                    <li>• Area comparisons</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold mb-2">Relocation Checklist:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Driver's license transfer</li>
                    <li>• Healthcare registration</li>
                    <li>• School enrollment</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-green-700" />
                <h3 className="font-bold text-green-900">Handling a Relocation Enquiry</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Ask where they are moving from and when</li>
                <li>• Send your relocation guide yourself, with a short personal note</li>
                <li>• Record their timeline and budget on the contact so you can pick it up later</li>
                <li>• Follow up with a comparison written for the city they are leaving</li>
              </ul>
            </Card>
          </section>

          {/* Strategy 6: Video Marketing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategy #6: Video Marketing at Scale</h2>
            
            <Card className="p-6 mb-6">
              <h3 className="font-bold mb-3">Why Video Works in Calgary</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="font-semibold mb-1">Large Geographic Area</p>
                  <p className="text-gray-700">Home showings take all day to reach suburbs</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="font-semibold mb-1">Winter Weather</p>
                  <p className="text-gray-700">Buyers want to "see" before committing to drive in -25°C</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="font-semibold mb-1">Remote Buyers</p>
                  <p className="text-gray-700">Interprovincial buyers can't visit multiple times</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-3">Video Types to Create</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                    <div>
                      <p className="font-semibold text-sm">Property Video Tours</p>
                      <p className="text-sm text-gray-700">60-90 second walkthroughs with a voiceover</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                    <div>
                      <p className="font-semibold text-sm">Neighborhood Videos</p>
                      <p className="text-sm text-gray-700">Drive-through videos of Mahogany, Auburn Bay, Cranston</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                    <div>
                      <p className="font-semibold text-sm">Market Update Videos</p>
                      <p className="text-sm text-gray-700">A monthly summary of the Calgary Real Estate Board's published statistics, with the source named</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                    <div>
                      <p className="font-semibold text-sm">YouTube SEO</p>
                      <p className="text-sm text-gray-700">Optimize for "Calgary real estate", "Mahogany homes"</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="font-bold">Keeping Video Manageable</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Write one short script outline and reuse it for every property</li>
                  <li>✓ Film on your phone first; upgrade equipment once the habit sticks</li>
                  <li>✓ Set a number of videos a month that you can keep up</li>
                  <li>✓ Check every fact in the script against the listing before you publish</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded">
                  <p className="text-sm font-semibold text-gray-900">Realtor Desk does not do this for you.</p>
                  <p className="text-sm text-gray-700">It does not generate video scripts or voiceovers. General writing and video tools from other vendors can help; review what they produce.</p>
                </div>
              </Card>
            </div>
          </section>

          {/* Strategy 7: Lead Response */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Strategy #7: A Routine for Replying to Leads</h2>

            <Card className="p-6 mb-6 border-2 border-primary">
              <h3 className="text-xl font-bold mb-3">Why It Matters</h3>
              <p className="text-lg">
                Someone who sends an enquiry often sends it to more than one agent. A prompt, useful reply gives you a better chance of being the one they talk to. We have no measured Calgary figures on this, so none are quoted here.
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="font-bold mb-3">A Saved First Reply</h3>
                <p className="text-sm text-gray-700 mb-3">Keep a short opening message ready to personalise and send:</p>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <p className="italic">"Hi! Looking at properties in Calgary? Which neighborhoods interest you?"</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-3">Evenings</h3>
                <p className="text-sm text-gray-700 mb-3">Many people browse listings after work.</p>
                <p className="text-sm text-gray-700">Pick one time each evening to check and answer new enquiries, and stick to it.</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-3">Weekends</h3>
                <p className="text-sm text-gray-700 mb-3">Weekends are showing days, so replies slip.</p>
                <p className="text-sm text-gray-700">Check between appointments, or arrange cover with a colleague you trust.</p>
              </Card>
            </div>

            <Card className="p-6 bg-gray-50">
              <h3 className="text-xl font-bold mb-3">About Chatbots and Automatic Replies</h3>
              <p className="text-sm text-gray-700 mb-3">
                Some agents add a website chat or auto-reply tool from another vendor so that an enquiry is acknowledged the moment it arrives. That is a separate category of product. If you look at one, ask the vendor what it says to leads, who reviews it, and how it records consent.
              </p>
              <p className="text-sm text-gray-700">
                Realtor Desk does not offer a chatbot, a voice agent or automatic replies. It scores each lead, suggests a next action and drafts a reply for you to review and send.
              </p>
            </Card>
          </section>

          {/* Marketing Budget */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Planning a Calgary Marketing Budget</h2>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Lines to Put in a Solo Agent's Budget</h3>
              <p className="text-sm text-gray-700 mb-4">
                Fill in each line with a quote you have obtained yourself. The only price we can state is our own.
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-semibold">Realtor Desk CRM (single agent)</span>
                  <span className="text-sm font-bold">CAD $149 a month</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-semibold">Search ads (Calgary targeting)</span>
                  <span className="text-sm font-bold">Your figure</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-semibold">Social media ads (local)</span>
                  <span className="text-sm font-bold">Your figure</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-semibold">Video production</span>
                  <span className="text-sm font-bold">Your figure</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-semibold">Content creation</span>
                  <span className="text-sm font-bold">Your figure</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-semibold">Local media advertising</span>
                  <span className="text-sm font-bold">Your figure</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-xl font-bold mb-4 text-green-900">Work Out Your Own Return</h3>
              <p className="text-sm text-gray-700 mb-3">
                We publish no expected return, because we have no measured results to base one on. Track these each month instead:
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Total spend, by line</li>
                <li>• Enquiries received, by source</li>
                <li>• Appointments that came from those enquiries</li>
                <li>• Deals closed and the commission from each</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3">
                After three months you will know what a lead and a client cost you from each source, and which lines to cut.
              </p>
            </Card>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ: Calgary Real Estate Marketing</h2>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Do I need AI tools to market in Calgary?</h3>
                <p className="text-gray-700">
                  No. Everything in this guide can be done without them. General writing tools can help you draft neighbourhood pages or video scripts faster, as long as you check the facts. Realtor Desk's assistant drafts a reply or summarises a conversation on the contact you have open; it does not reply to anyone on its own.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Should I focus on inner city or suburbs?</h3>
                <p className="text-gray-700">
                  It depends on your niche. Suburban communities such as Mahogany, Cranston and Auburn Bay and inner-city areas such as Bridgeland, Kensington and Inglewood attract different buyers. Pick the area you know best and can cover consistently.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">How do I compete with Calgary's established agents?</h3>
                <p className="text-gray-700">
                  Be specific and be consistent. Choose a narrow area, publish accurate content about it, reply to enquiries promptly, and follow up on the date you said you would.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">When should I start talking to spring sellers?</h3>
                <p className="text-gray-700">
                  In winter. Publish seller-preparation content in January and February, note each seller's intended timing, and stay in touch until they are ready to list.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Is video worth the effort in Calgary?</h3>
                <p className="text-gray-700">
                  It suits the city: distances are long, winters are cold, and buyers from other provinces cannot visit often. A video tour lets a buyer rule a home in or out before anyone drives across town.
                </p>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <Card className="p-8 bg-gradient-to-r from-gray-50 to-blue-50">
              <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  Calgary has its own conditions: an energy-driven economy, spread-out communities, hard winters and steady arrivals from other provinces. Marketing that takes those into account will fit better than advice written for another city.
                </p>
                <div className="bg-white p-6 rounded-lg">
                  <p className="font-bold mb-3">Key Takeaways:</p>
                  <ul className="space-y-2">
                    <li>✓ Write accurate content about specific communities</li>
                    <li>✓ Use winter to stay in touch with people who will act in spring</li>
                    <li>✓ Decide in advance how evening and weekend enquiries get answered</li>
                    <li>✓ Offer video tours so buyers can narrow their list from home</li>
                    <li>✓ Prepare a relocation guide for buyers arriving from other provinces</li>
                    <li>✓ Build contacts with the people who handle energy-sector relocation</li>
                    <li>✓ Describe what families look for: schools, parks and recreation nearby</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          {/* Where Realtor Desk fits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Where Realtor Desk Fits</h2>
            <Card className="p-6">
              <p className="text-gray-700 mb-4">
                Realtor Desk is a CRM for a single Canadian real estate agent. It does not generate leads, create marketing content or supply Calgary market data. It helps you keep track of the people your marketing brings in:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• One list of leads, with one conversation timeline per client</li>
                <li>• A rule-based lead score from 0 to 100, with the breakdown shown</li>
                <li>• A suggested next action and a time to take it</li>
                <li>• An in-app assistant that drafts a reply for you to review. Nothing is sent to a client without you</li>
                <li>• The date and source of consent recorded on each contact</li>
                <li>• French or English set per contact</li>
              </ul>
              <p className="text-sm text-gray-700 mt-4">
                A single listing can be imported from a Realtor.ca address or an MLS number. Native CREA DDF® sync is on the roadmap and is not live yet.
              </p>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <Card className="p-8 bg-gradient-to-r from-primary to-blue-600 text-white">
              <h2 className="text-3xl font-bold mb-4">Keep Your Calgary Leads in One Place</h2>
              <p className="text-xl mb-6">
                Realtor Desk is a CRM for Canadian real estate agents. CAD $149 a month for a single agent.
              </p>
              <p className="mb-8 text-lg">
                14-day trial. A card is collected up front and nothing is charged before day 14.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/signup">
                    Start Free 14-Day Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-primary hover:bg-gray-100">
                  <Link to="/pricing">See Pricing</Link>
                </Button>
              </div>
            </Card>
          </section>

          {/* Related Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Resources for Calgary Agents</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/blog/ai-chatbot-real-estate-websites-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Website Chatbots: A Category Guide</h3>
                  <p className="text-sm text-gray-600">A general guide. Realtor Desk does not offer a chatbot</p>
                </Card>
              </Link>
              <Link to="/resources/voice-ai-real-estate-lead-follow-up-canada">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Voice AI: A Category Guide</h3>
                  <p className="text-sm text-gray-600">A general guide. Realtor Desk does not offer voice AI</p>
                </Card>
              </Link>
              <Link to="/features/listing-import">
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold mb-2">Listing Import</h3>
                  <p className="text-sm text-gray-600">Import a single listing from a Realtor.ca address or an MLS number</p>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CalgaryMarketingGuide;
