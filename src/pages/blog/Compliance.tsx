import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Share2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import blogImage from "@/assets/blog-compliance.jpg";
import { SEO } from "@/components/SEO";

const Compliance = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Provincial Compliance Checklist: ON, BC, AB, QC"
        description="Stay compliant with Canadian real estate regulations. A practical checklist for RECO, BCFSA, RECA, and AMF requirements."
        keywords="real estate compliance canada, RECO requirements, BCFSA compliance, RECA rules, AMF real estate, PIPEDA"
        image={blogImage}
        article
        publishedTime="2025-01-05"
        modifiedTime="2025-01-05"
        author="RealtorDesk AI"
        canonicalUrl="https://realtordesk.ai/blog/compliance"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Provincial Compliance Checklist: ON, BC, AB, QC",
            "description": "Stay compliant with Canadian real estate regulations. A practical checklist for RECO, BCFSA, RECA, and AMF requirements.",
            "author": { "@type": "Organization", "name": "RealtorDesk AI" },
            "publisher": { "@type": "Organization", "name": "RealtorDesk AI" },
            "datePublished": "2025-01-05",
            "dateModified": "2025-01-05"
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
                Compliance
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 5, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>10 min read</span>
              </div>
            </div>
            
            <h1 className="mb-6">
              Provincial Compliance Checklist: ON, BC, AB, QC
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Stay compliant with regulations across Canada. A comprehensive guide to RECO, BCFSA, RECA, and AMF requirements.
            </p>
          </header>

          <img 
            src={blogImage} 
            alt="Provincial compliance documentation"
            className="w-full rounded-lg mb-8 shadow-lg"
          />

          <div className="prose prose-lg max-w-none">
            <h2>Why Provincial Compliance Matters</h2>
            <p>
              Operating as a real estate professional in Canada means navigating a complex landscape of provincial regulations. Each province has its own regulatory body with specific requirements for advertising, client communications, data handling, and transaction management. Non-compliance can result in fines, license suspension, or worse.
            </p>

            <h2><Shield className="w-6 h-6 inline mr-2" />Ontario - RECO</h2>
            <p>
              The Real Estate Council of Ontario (RECO) oversees real estate professionals in Canada's most populous province.
            </p>
            
            <h3>Key Requirements:</h3>
            <ul>
              <li><strong>Advertising Standards:</strong> All ads must include your brokerage name and be truthful and not misleading</li>
              <li><strong>Client Disclosure:</strong> Working relationships must be disclosed in writing before showing properties</li>
              <li><strong>FINTRAC Compliance:</strong> Record keeping for transactions over $10,000 as per federal anti-money laundering rules</li>
              <li><strong>Data Privacy:</strong> Must comply with PIPEDA for personal information handling</li>
              <li><strong>Continuing Education:</strong> Maintain your registration through ongoing education requirements</li>
            </ul>

            <h3>How RealtorDesk AI Helps:</h3>
            <p>
              Our platform automatically includes brokerage information in all generated marketing materials, maintains audit trails for client communications, and provides PIPEDA-compliant data handling with encryption and consent management.
            </p>

            <h2><Shield className="w-6 h-6 inline mr-2" />British Columbia - BCFSA</h2>
            <p>
              The BC Financial Services Authority (BCFSA) regulates real estate in BC, with strict rules around disclosure and client protection.
            </p>
            
            <h3>Key Requirements:</h3>
            <ul>
              <li><strong>Disclosure of Representation:</strong> Must provide Form 320 before showing properties</li>
              <li><strong>Contract Deposits:</strong> Strict rules for handling deposit funds</li>
              <li><strong>Disclosure of Interest:</strong> Must disclose any personal interest in properties</li>
              <li><strong>Marketing Standards:</strong> Cannot make misleading statements about property values or features</li>
              <li><strong>Digital Signatures:</strong> Electronic signatures must meet specific standards</li>
            </ul>

            <h3>How RealtorDesk AI Helps:</h3>
            <p>
              Automated disclosure form distribution, secure document signing with audit trails, and automated reminders for required disclosures ensure you never miss a compliance step.
            </p>

            <h2><Shield className="w-6 h-6 inline mr-2" />Alberta - RECA</h2>
            <p>
              The Real Estate Council of Alberta (RECA) sets standards for ethical practice and professional conduct in Alberta.
            </p>
            
            <h3>Key Requirements:</h3>
            <ul>
              <li><strong>Service Agreements:</strong> Written service agreements required before providing brokerage services</li>
              <li><strong>Advertising Rules:</strong> Must include brokerage name in all advertising</li>
              <li><strong>Record Retention:</strong> Must maintain transaction records for 6 years</li>
              <li><strong>Trust Accounting:</strong> Strict rules for handling client funds</li>
              <li><strong>Mandatory Education:</strong> Annual continuing education requirements</li>
            </ul>

            <h3>How RealtorDesk AI Helps:</h3>
            <p>
              Digital service agreement templates, automatic brokerage branding on all materials, and secure cloud storage with 10-year retention ensure compliance with all RECA requirements.
            </p>

            <h2><Shield className="w-6 h-6 inline mr-2" />Quebec - OACIQ/AMF</h2>
            <p>
              Quebec's Organisme d'autoréglementation du courtage immobilier du Québec (OACIQ) and Autorité des marchés financiers (AMF) have unique bilingual requirements.
            </p>
            
            <h3>Key Requirements:</h3>
            <ul>
              <li><strong>Bilingual Communication:</strong> All documents must be available in French; English available upon request</li>
              <li><strong>Mandatory Forms:</strong> Must use OACIQ-approved forms for all transactions</li>
              <li><strong>Disclosure Obligations:</strong> Extensive disclosure requirements for conflicts of interest</li>
              <li><strong>Professional Liability Insurance:</strong> Specific coverage requirements</li>
              <li><strong>Charter of the French Language:</strong> Compliance with Bill 96 for commercial communications</li>
            </ul>

            <h3>How RealtorDesk AI Helps:</h3>
            <p>
              Built-in bilingual support with professionally translated French documents, OACIQ form integration, and automatic language detection for client communications ensure Quebec compliance.
            </p>

            <h2>Federal Requirements (All Provinces)</h2>
            <p>
              In addition to provincial regulations, all Canadian real estate professionals must comply with:
            </p>
            <ul>
              <li><strong>PIPEDA:</strong> Personal Information Protection and Electronic Documents Act</li>
              <li><strong>FINTRAC:</strong> Financial Transaction Reporting for money laundering prevention</li>
              <li><strong>CASL:</strong> Canadian Anti-Spam Legislation for electronic communications</li>
              <li><strong>CREA Rules:</strong> If using MLS® data through CREA DDF®</li>
            </ul>

            <h2>Compliance Checklist</h2>
            <p>
              Use this checklist to ensure you're meeting all regulatory requirements:
            </p>
            <ul>
              <li>☐ All marketing materials include brokerage name and contact info</li>
              <li>☐ Client disclosure forms provided before property viewings</li>
              <li>☐ Written service agreements in place</li>
              <li>☐ PIPEDA consent obtained for all client data collection</li>
              <li>☐ Email marketing includes proper unsubscribe mechanisms (CASL)</li>
              <li>☐ Transaction records stored securely with proper retention</li>
              <li>☐ FINTRAC reporting procedures in place</li>
              <li>☐ Continuing education requirements up to date</li>
              <li>☐ Professional liability insurance current</li>
              <li>☐ Quebec-specific: French documents available</li>
            </ul>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg my-8">
              <h3 className="text-2xl font-bold mb-4">Stay Compliant Automatically</h3>
              <p className="mb-6">
                RealtorDesk AI builds compliance into every feature, so you can focus on closing deals instead of worrying about regulations.
              </p>
              <Link to="/demo">
                <Button size="lg" className="btn-gradient">
                  See How It Works
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

export default Compliance;
