import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Share2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import blogImage from "@/assets/blog-compliance.jpg";
import blogImageAvif from "@/assets/blog-compliance.avif";
import blogImageWebp from "@/assets/blog-compliance.webp";
import { Picture } from "@/components/Picture";
import { SEO } from "@/components/SEO";

const Compliance = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Provincial Compliance Checklist for Agents"
        description="An overview of what RECO, BCFSA, RECA and OACIQ expect of Canadian real estate agents, plus the federal rules, with links to each regulator."
        keywords="real estate compliance canada, RECO requirements, BCFSA compliance, RECA rules, OACIQ, PIPEDA"
        image={blogImage}
        article
        publishedTime="2025-01-05"
        modifiedTime="2026-10-11"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/compliance"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Provincial Compliance Checklist for Agents",
            "description": "An overview of what RECO, BCFSA, RECA and OACIQ expect of Canadian real estate agents, plus the federal rules, with links to each regulator.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-05",
            "dateModified": "2026-10-11"
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
                <span>January 5, 2025 · revised October 11, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>10 min read</span>
              </div>
            </div>
            
            <h1 className="mb-6">
              Provincial Compliance Checklist for Agents
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              An overview of what the provincial regulators expect, with a link to each one. It is a starting point, not a substitute for the regulator&rsquo;s own rules.
            </p>
          </header>

          <Picture
            src={blogImage}
            avif={blogImageAvif}
            webp={blogImageWebp}
            width={1280}
            height={720}
            alt="Provincial compliance documentation"
            className="w-full rounded-lg mb-8 shadow-lg"
            priority
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
              <li><strong>FINTRAC:</strong> Federal anti-money-laundering rules on client identification and record keeping apply to real estate transactions</li>
              <li><strong>Data Privacy:</strong> Must comply with PIPEDA for personal information handling</li>
              <li><strong>Continuing Education:</strong> Maintain your registration through ongoing education requirements</li>
            </ul>

            <h2><Shield className="w-6 h-6 inline mr-2" />British Columbia - BCFSA</h2>
            <p>
              The BC Financial Services Authority (BCFSA) regulates real estate in BC, with strict rules around disclosure and client protection.
            </p>
            
            <h3>Key Requirements:</h3>
            <ul>
              <li><strong>Disclosure of Representation:</strong> Disclose who you represent, using BCFSA&rsquo;s disclosure form, before providing trading services</li>
              <li><strong>Contract Deposits:</strong> Strict rules for handling deposit funds</li>
              <li><strong>Disclosure of Interest:</strong> Must disclose any personal interest in properties</li>
              <li><strong>Marketing Standards:</strong> Cannot make misleading statements about property values or features</li>
              <li><strong>Digital Signatures:</strong> Electronic signatures must meet specific standards</li>
            </ul>

            <h2><Shield className="w-6 h-6 inline mr-2" />Alberta - RECA</h2>
            <p>
              The Real Estate Council of Alberta (RECA) sets standards for ethical practice and professional conduct in Alberta.
            </p>
            
            <h3>Key Requirements:</h3>
            <ul>
              <li><strong>Service Agreements:</strong> Written service agreements required before providing brokerage services</li>
              <li><strong>Advertising Rules:</strong> Must include brokerage name in all advertising</li>
              <li><strong>Record Retention:</strong> Keep transaction records for the period RECA&rsquo;s rules set</li>
              <li><strong>Trust Accounting:</strong> Strict rules for handling client funds</li>
              <li><strong>Mandatory Education:</strong> Annual continuing education requirements</li>
            </ul>

            <h2><Shield className="w-6 h-6 inline mr-2" />Quebec - OACIQ</h2>
            <p>
              The Organisme d'autoréglementation du courtage immobilier du Québec (OACIQ) regulates real estate brokerage in Quebec, where French-language rules also apply.
            </p>
            
            <h3>Key Requirements:</h3>
            <ul>
              <li><strong>French:</strong> Contracts and commercial communications must be available in French</li>
              <li><strong>Mandatory Forms:</strong> Must use OACIQ-approved forms for all transactions</li>
              <li><strong>Disclosure Obligations:</strong> Extensive disclosure requirements for conflicts of interest</li>
              <li><strong>Professional Liability Insurance:</strong> Specific coverage requirements</li>
              <li><strong>Charter of the French Language:</strong> Compliance with Bill 96 for commercial communications</li>
            </ul>

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

            {/* Four "How RealtorDesk AI Helps" paragraphs stood under the provinces,
                and a "Stay Compliant Automatically" box stood here. They promised
                disclosure-form distribution, document signing with audit trails,
                10-year storage, OACIQ form integration and automatic language
                detection. The product has none of those. What follows is read from
                the code (useRecordConsent, csvImport, per-contact language). */}
            <h2>What Realtor Desk does, and what it does not</h2>
            <p>
              Realtor Desk is a CRM. It records the date and source of a contact&rsquo;s
              consent, lets you set French or English per contact, and keeps its
              database in Canada. It does not provide regulator forms, electronic
              signatures, document storage for transaction records, trust accounting or
              FINTRAC reporting, and it does not make you compliant with any of the
              rules above.
            </p>

            <h2>Check the source</h2>
            <p>
              Rules change, and this page is a summary. Read the requirements at the
              regulator:{" "}
              <a href="https://www.reco.on.ca" rel="noopener noreferrer" target="_blank">RECO</a>,{" "}
              <a href="https://www.bcfsa.ca" rel="noopener noreferrer" target="_blank">BCFSA</a>,{" "}
              <a href="https://www.reca.ca" rel="noopener noreferrer" target="_blank">RECA</a>,{" "}
              <a href="https://www.oaciq.com" rel="noopener noreferrer" target="_blank">OACIQ</a> and{" "}
              <a href="https://fintrac-canafe.canada.ca" rel="noopener noreferrer" target="_blank">FINTRAC</a>.
              This is general information, not legal advice.
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg my-8">
              <h3 className="text-2xl font-bold mb-4">See the CRM on your own contacts</h3>
              <p className="mb-6">
                A consent record on every contact, French per contact, and a database in Canada.
              </p>
              <Link to="/demo">
                <Button size="lg" className="btn-gradient">
                  Book a demo
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
