import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Share2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import blogImage from "@/assets/blog-crea-ddf.jpg";
import { SEO } from "@/components/SEO";

const CreaDDF = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="The Complete Guide to CREA DDF Integration"
        description="Everything you need to know about accessing national MLS data and integrating CREA DDF into your real estate workflow."
        keywords="CREA DDF integration, Canadian MLS data, real estate CRM Canada, CREA DDF guide, MLS integration"
        image={blogImage}
        article
        publishedTime="2025-01-10"
        modifiedTime="2025-01-10"
        author="RealtorDesk AI"
        canonicalUrl="https://realtordesk.ai/blog/crea-ddf"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The Complete Guide to CREA DDF Integration",
            "description": "Everything you need to know about accessing national MLS data and integrating CREA DDF into your real estate workflow.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2025-01-10",
            "dateModified": "2025-01-10"
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
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                Canadian Market
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>12 min read</span>
              </div>
            </div>
            
            <h1 className="mb-6">
              The Complete Guide to CREA DDF® Integration
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Everything you need to know about accessing national MLS data and integrating CREA DDF® into your real estate workflow.
            </p>
          </header>

          <img 
            src={blogImage} 
            alt="CREA DDF integration visualization"
            className="w-full rounded-lg mb-8 shadow-lg"
          />

          <div className="prose prose-lg max-w-none">
            <h2>What is CREA DDF®?</h2>
            <p>
              The Canadian Real Estate Association (CREA) Data Distribution Facility (DDF®) is a centralized system that aggregates MLS® listing data from real estate boards across Canada. It provides authorized users with standardized access to property listings, including detailed information, photos, and status updates.
            </p>

            <h2>Why CREA DDF® Matters for Your Business</h2>
            <p>
              Access to CREA DDF® transforms how you work with property data:
            </p>
            <ul>
              <li><CheckCircle className="w-5 h-5 inline mr-2 text-primary" />Real-time access to national MLS® listings</li>
              <li><CheckCircle className="w-5 h-5 inline mr-2 text-primary" />Standardized data format across all provinces</li>
              <li><CheckCircle className="w-5 h-5 inline mr-2 text-primary" />Automatic updates when listings change</li>
              <li><CheckCircle className="w-5 h-5 inline mr-2 text-primary" />Integration with your CRM and marketing tools</li>
              <li><CheckCircle className="w-5 h-5 inline mr-2 text-primary" />Compliance with CREA rules and regulations</li>
            </ul>

            <h2>How DDF® Integration Works</h2>
            <p>
              Modern platforms like RealtorDesk AI connect directly to the CREA DDF® feed, pulling listing data in real-time. This means:
            </p>
            <ol>
              <li><strong>Automatic Sync:</strong> New listings appear in your system within minutes of being posted to MLS®</li>
              <li><strong>Status Updates:</strong> Price changes, status changes, and sold information update automatically</li>
              <li><strong>Photo Management:</strong> All listing photos sync automatically with proper attribution</li>
              <li><strong>Compliance Built-In:</strong> All data display follows CREA rules and local board requirements</li>
            </ol>

            <h2>Key Features to Look For</h2>
            <p>
              When choosing a platform with DDF® integration, ensure it includes:
            </p>
            
            <h3>1. Search and Filter Capabilities</h3>
            <p>
              Advanced search across all Canadian listings with filters for location, price, property type, features, and more.
            </p>

            <h3>2. Client Matching</h3>
            <p>
              Automatically match new listings to client preferences and send instant notifications when perfect properties become available.
            </p>

            <h3>3. Market Analytics</h3>
            <p>
              Generate comprehensive market reports using live MLS® data, including pricing trends, days on market, and neighborhood statistics.
            </p>

            <h3>4. IDX Website Integration</h3>
            <p>
              Display MLS® listings on your website with full CREA compliance and proper attribution.
            </p>

            <h2>Provincial Coverage</h2>
            <p>
              CREA DDF® provides coverage across all major Canadian markets:
            </p>
            <ul>
              <li>Ontario (TRREB, Ottawa, London, and more)</li>
              <li>British Columbia (REBGV, VREB, Fraser Valley)</li>
              <li>Alberta (Calgary, Edmonton)</li>
              <li>Quebec (Greater Montreal, Quebec City)</li>
              <li>And all other provinces and territories</li>
            </ul>

            <h2>Compliance and Data Usage</h2>
            <p>
              Using DDF® data comes with important responsibilities:
            </p>
            <ul>
              <li>Display rules must be followed exactly as specified by CREA</li>
              <li>Listing attribution must be shown clearly</li>
              <li>Data cannot be scraped or redistributed</li>
              <li>Local board rules must be respected</li>
              <li>VOW (Virtual Office Website) compliance is required for client portals</li>
            </ul>

            <h2>Getting Started</h2>
            <p>
              To access CREA DDF® through RealtorDesk AI:
            </p>
            <ol>
              <li>Verify your CREA membership and local board standing</li>
              <li>Complete the DDF® authorization process</li>
              <li>Connect your account through our secure integration</li>
              <li>Configure your preferences and filters</li>
              <li>Start accessing national MLS® data immediately</li>
            </ol>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg my-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Access National MLS® Data?</h3>
              <p className="mb-6">
                Connect your CREA membership and start leveraging the power of centralized Canadian real estate data.
              </p>
              <Link to="/signup">
                <Button size="lg" className="btn-gradient">
                  Start 14-Day Free Trial
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

export default CreaDDF;
