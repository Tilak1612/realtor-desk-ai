import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Check, Lock, Database, FileCheck, AlertCircle, MapPin, Clock } from "lucide-react";

const PIPEDACompliance = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is RealtorDesk AI PIPEDA compliant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RealtorDesk AI is designed with PIPEDA's 10 fair information principles in mind. All client data is encrypted at rest and in transit, hosted on Canadian-optimized infrastructure, and processed with consent-first workflows."
        }
      },
      {
        "@type": "Question",
        "name": "Where is my data stored?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RealtorDesk AI data is hosted on Canadian-optimized infrastructure to support PIPEDA data residency best practices and protect Canadian real estate client information."
        }
      },
      {
        "@type": "Question",
        "name": "Can I export client data for PIPEDA compliance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, RealtorDesk AI provides one-click data export functionality so you can fulfill client access requests under PIPEDA within the required 30-day timeframe."
        }
      },
      {
        "@type": "Question",
        "name": "How does RealtorDesk AI handle data deletion requests?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RealtorDesk AI provides tools to permanently delete client data upon request, in compliance with PIPEDA's withdrawal of consent provisions. All deletions are logged for audit purposes."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="PIPEDA Compliance | Canadian Data Privacy for Real Estate Agents"
        description="RealtorDesk AI is fully PIPEDA compliant with Canadian data residency, encryption, and automated compliance logging. Built for Canadian real estate agents who need to protect client data."
        keywords="PIPEDA compliance, real estate data privacy Canada, PIPEDA CRM, Canadian data residency, real estate data protection, PIPEDA requirements real estate"
        canonicalUrl="https://www.realtordesk.ai/pipeda-compliance"
        structuredData={[faqSchema]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Shield className="w-4 h-4 mr-2" />
              PIPEDA-Aware Design
            </Badge>
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="gradient-text">Built with PIPEDA</span><br />
              Principles for Canadian Agents
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              RealtorDesk AI is designed with PIPEDA principles at its core — encryption, consent management, automated compliance logging, and Canadian-optimized infrastructure — so you can focus on clients, not compliance headaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">Start Free 14-Day Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">See Compliance Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is PIPEDA? */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-6">What is PIPEDA?</h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              The Personal Information Protection and Electronic Documents Act (PIPEDA) is Canada's federal privacy law that governs how private-sector organizations collect, use, and disclose personal information. Real estate agents must comply with PIPEDA when handling client data.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <FileCheck className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">10 Fair Information Principles</h3>
                <p className="text-muted-foreground mb-4">
                  PIPEDA is based on 10 principles including accountability, consent, limiting collection, safeguards, and individual access.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Accountability for data protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Identifying purposes for collection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Obtaining meaningful consent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Limiting collection to necessary data</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <AlertCircle className="w-10 h-10 mb-4 text-accent" />
                <h3 className="text-xl font-bold mb-2">Penalties for Non-Compliance</h3>
                <p className="text-muted-foreground mb-4">
                  Failing to comply with PIPEDA can result in significant fines and reputational damage.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Fines up to $100,000 per violation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Reputational harm to your brokerage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Client lawsuits for data breaches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>RECO/CREA disciplinary action</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How RealtorDesk AI Ensures PIPEDA Compliance */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-4">How RealtorDesk AI Ensures PIPEDA Compliance</h2>
            <p className="text-center text-muted-foreground mb-12">
              We've built PIPEDA compliance into every feature so you never have to worry about data privacy violations.
            </p>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">1. Canadian Data Residency</h3>
                    <p className="text-muted-foreground mb-3">
                      Client data is hosted on Canadian-optimized infrastructure. We are working to ensure data remains within Canadian borders as our infrastructure scales.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">✅ What this means for you:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Meets PIPEDA's data residency requirements</li>
                        <li>• Client data protected under Canadian privacy laws</li>
                        <li>• No foreign government access to your data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">2. End-to-End Encryption</h3>
                    <p className="text-muted-foreground mb-3">
                      All personal information is encrypted at rest (AES-256) and in transit (TLS 1.3). Even database administrators cannot access unencrypted client data.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">✅ What this means for you:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Protects against data breaches</li>
                        <li>• Meets PIPEDA's "safeguards" principle</li>
                        <li>• Bank-level security for client information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">3. Consent Management</h3>
                    <p className="text-muted-foreground mb-3">
                      Built-in consent tracking for each contact. Record when and how consent was obtained, what it covers, and allow clients to withdraw consent at any time.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">✅ What this means for you:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Automatic consent logging for all communications</li>
                        <li>• One-click unsubscribe for clients</li>
                        <li>• Audit trail for PIPEDA compliance reviews</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">4. Data Access & Portability</h3>
                    <p className="text-muted-foreground mb-3">
                      Clients can request their data through you, and you can export it in CSV/JSON format within minutes. Supports PIPEDA's "individual access" principle.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">✅ What this means for you:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Fulfill access requests in under 30 days (PIPEDA requirement)</li>
                        <li>• Export client data for portability</li>
                        <li>• Searchable audit logs for all data access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">5. Data Retention & Deletion</h3>
                    <p className="text-muted-foreground mb-3">
                      Automatic data retention policies (e.g., delete inactive contacts after 7 years) and manual deletion tools to comply with "limiting retention" requirements.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">✅ What this means for you:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Automated deletion of old data</li>
                        <li>• Permanent deletion upon client request</li>
                        <li>• Configurable retention policies per data type</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">6. Security Audits & Certifications</h3>
                    <p className="text-muted-foreground mb-3">
                      RealtorDesk AI undergoes annual third-party security audits and maintains SOC 2 Type II certification to verify our PIPEDA compliance measures.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">✅ What this means for you:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Independent verification of security practices</li>
                        <li>• Detailed compliance reports available on request</li>
                        <li>• Broker-friendly for due diligence reviews</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* PIPEDA Compliance Checklist */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">PIPEDA Compliance Checklist for Real Estate Agents</h2>
            
            <Card className="p-8">
              <p className="text-muted-foreground mb-6">
                Use this checklist to ensure you're meeting PIPEDA requirements when using RealtorDesk AI:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Accountability</h4>
                    <p className="text-sm text-muted-foreground">Your brokerage has designated a privacy officer and documented your privacy policy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Identifying Purposes</h4>
                    <p className="text-sm text-muted-foreground">You clearly explain why you're collecting client information (e.g., "to send you property alerts").</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Consent</h4>
                    <p className="text-sm text-muted-foreground">You obtain explicit consent before collecting personal information (checkboxes on web forms, signed agreements).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Limiting Collection</h4>
                    <p className="text-sm text-muted-foreground">You only collect information necessary for your stated purposes (no collecting unnecessary data).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Limiting Use, Disclosure & Retention</h4>
                    <p className="text-sm text-muted-foreground">You only use client data for its intended purpose and delete it when no longer needed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Accuracy</h4>
                    <p className="text-sm text-muted-foreground">You keep client information up-to-date and accurate (regular data cleansing).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Safeguards</h4>
                    <p className="text-sm text-muted-foreground">You use secure tools like RealtorDesk AI with encryption and Canadian data hosting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Openness</h4>
                    <p className="text-sm text-muted-foreground">Your privacy policy is publicly accessible on your website.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Individual Access</h4>
                    <p className="text-sm text-muted-foreground">You respond to client data access requests within 30 days.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Challenging Compliance</h4>
                    <p className="text-sm text-muted-foreground">You have a process for clients to challenge your compliance (complaints procedure).</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-center">
                  <strong>Need help?</strong> RealtorDesk AI automates most of these requirements. <Link to="/demo" className="text-primary hover:underline">Book a demo</Link> to see how.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-12">PIPEDA Compliance FAQs</h2>
            
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Is RealtorDesk AI PIPEDA compliant?</h3>
                <p className="text-muted-foreground">
                  RealtorDesk AI is designed with PIPEDA's 10 fair information principles in mind. All client data is encrypted at rest and in transit, hosted on Canadian-optimized infrastructure, and processed with consent-first workflows.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Where is my data stored?</h3>
                <p className="text-muted-foreground">
                  RealtorDesk AI data is hosted on Canadian-optimized infrastructure to support PIPEDA data residency best practices and protect Canadian real estate client information.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Can I export client data for PIPEDA compliance?</h3>
                <p className="text-muted-foreground">
                  Yes, RealtorDesk AI provides one-click data export functionality so you can fulfill client access requests under PIPEDA within the required 30-day timeframe.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">How does RealtorDesk AI handle data deletion requests?</h3>
                <p className="text-muted-foreground">
                  RealtorDesk AI provides tools to permanently delete client data upon request, in compliance with PIPEDA's withdrawal of consent provisions. All deletions are logged for audit purposes.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Do I need a separate privacy policy if I use RealtorDesk AI?</h3>
                <p className="text-muted-foreground">
                  Yes, your brokerage still needs its own privacy policy that describes how you collect and use client information. RealtorDesk AI provides a template you can customize.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">What if I'm also subject to provincial privacy laws (PIPA)?</h3>
                <p className="text-muted-foreground">
                  RealtorDesk AI is compliant with both PIPEDA and provincial privacy laws in Alberta, British Columbia, and Quebec. Our Canadian data residency and consent management features meet all requirements.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="mb-6">Protect Your Clients. Protect Your Business.</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of Canadian real estate agents using RealtorDesk AI for PIPEDA-compliant client data management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">Start Free 14-Day Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">Book Compliance Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Questions about compliance? Email <a href="mailto:privacy@realtordesk.ai" className="text-primary hover:underline">privacy@realtordesk.ai</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PIPEDACompliance;
