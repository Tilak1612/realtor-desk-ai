import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Shield, CheckCircle, FileText, AlertTriangle, Users, Clock, ArrowRight, BookOpen } from "lucide-react";
import { SEO } from "@/components/SEO";

const FintracCompliance = () => {
  const obligations = [
    {
      icon: Users,
      title: "Client Identification",
      description: "FINTRAC requires realtors to verify the identity of every client before entering into a business relationship — including buyers, sellers, and landlords.",
      how: "RealtorDesk AI stores client identity records directly on the contact profile. Document upload and identity verification notes are captured and timestamped for audit purposes."
    },
    {
      icon: FileText,
      title: "Business Relationship Records",
      description: "You must keep records of business relationships including client information forms, source of funds declarations, and politically exposed person (PEP) checks.",
      how: "RealtorDesk AI contact profiles include fields for source of funds, PEP status, and relationship type. All records are retained with creation timestamps."
    },
    {
      icon: Clock,
      title: "Record Retention (5+ Years)",
      description: "FINTRAC requires realtors to retain client and transaction records for at least 5 years after the last business activity.",
      how: "All contact data, deal records, notes, and compliance-related fields in RealtorDesk AI are retained with full history. Data export is available at any time for your compliance files."
    },
    {
      icon: AlertTriangle,
      title: "Suspicious Transaction Reporting",
      description: "Realtors must report suspicious transactions or attempted suspicious transactions to FINTRAC within 30 days.",
      how: "RealtorDesk AI lets you flag contacts and deals with compliance notes and internal tags to track suspicious activity and document your reporting obligations."
    },
    {
      icon: Shield,
      title: "Compliance Program",
      description: "Every realtor subject to FINTRAC must have a written compliance program — policies, procedures, risk assessment, and training records.",
      how: "RealtorDesk AI provides the record-keeping infrastructure for your compliance program. Combined with your brokerage's written policies, you have a complete audit trail."
    },
    {
      icon: BookOpen,
      title: "Ongoing Training Documentation",
      description: "Your compliance program must include documented training for you and any employees or contractors who conduct real estate transactions.",
      how: "RealtorDesk AI provides in-app compliance reminders and resources. Training records can be stored in the Notes section of your compliance contacts."
    },
  ];

  const faqs = [
    {
      q: "Are Canadian realtors subject to FINTRAC?",
      a: "Yes. Under Canada's Proceeds of Crime (Money Laundering) and Terrorist Financing Act, all real estate brokers and agents in Canada are Reporting Entities under FINTRAC. This means you are legally required to identify clients, keep records, and report certain transactions."
    },
    {
      q: "What happens if I don't comply with FINTRAC?",
      a: "FINTRAC can impose administrative monetary penalties (AMPs) of up to $1 million for individuals and $2 million for entities for compliance failures. FINTRAC conducts examinations of real estate businesses regularly. Non-compliance is not a minor risk."
    },
    {
      q: "Does RealtorDesk AI replace my brokerage's compliance program?",
      a: "No. RealtorDesk AI provides the record-keeping infrastructure and tools to support your compliance program — but your brokerage must have a formal written compliance program. We help you store, track, and retrieve the records your program requires."
    },
    {
      q: "Do I need to verify client identity before or after receiving an offer?",
      a: "You must verify client identity as soon as reasonably practicable after the first business relationship — which FINTRAC defines as when you agree to provide real estate services. This is typically at or before signing a buyer or seller representation agreement."
    },
    {
      q: "What documents do I need to keep for FINTRAC compliance?",
      a: "At minimum: Client identification records (government-issued ID), receipt of funds records, business relationship records, and suspicious transaction records if applicable. Retain all records for a minimum of 5 years."
    },
    {
      q: "Does the FINTRAC requirement apply to rental transactions?",
      a: "Yes. FINTRAC applies to the purchase and sale of real property, AND the management, brokering, or leasing of real property when rent exceeds $10,000/month. Always confirm the current thresholds with FINTRAC or your legal advisor."
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="FINTRAC Compliance for Canadian Realtors | RealtorDesk AI"
        description="FINTRAC compliance guide for Canadian real estate agents. Understand your obligations — client ID, record keeping, suspicious transaction reporting — and how RealtorDesk AI helps you stay compliant."
        keywords="FINTRAC compliance real estate, FINTRAC obligations realtors Canada, real estate compliance Canada, FINTRAC record keeping, Canadian realtor compliance, AML real estate Canada"
        canonicalUrl="https://www.realtordesk.ai/fintrac-compliance"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a }
            }))
          }
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Shield className="w-4 h-4 mr-2 inline" />
            Canadian Regulatory Compliance
          </Badge>
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            FINTRAC Compliance<br />
            <span className="gradient-text">for Canadian Realtors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Every Canadian realtor is a FINTRAC Reporting Entity. Understand your legal obligations and how RealtorDesk AI helps you build an audit-ready record-keeping system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pipeda-compliance">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View PIPEDA Guide
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This page is for informational purposes only and does not constitute legal advice. Consult FINTRAC's official guidelines and a qualified legal advisor for compliance obligations specific to your situation.
          </p>
        </div>
      </section>

      {/* What is FINTRAC */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">What Is FINTRAC and Why Does It Apply to You?</h2>
              <p className="text-muted-foreground mb-4">
                FINTRAC (Financial Transactions and Reports Analysis Centre of Canada) is Canada's financial intelligence unit. Under the <em>Proceeds of Crime (Money Laundering) and Terrorist Financing Act</em>, real estate brokers and agents are designated <strong>Reporting Entities</strong>.
              </p>
              <p className="text-muted-foreground mb-4">
                This means you have legally binding obligations every time you work with a buyer, seller, or landlord. These are not optional — FINTRAC conducts regular examinations and can impose significant penalties for non-compliance.
              </p>
              <p className="text-muted-foreground">
                No other real estate CRM in Canada has been purpose-built to support FINTRAC record-keeping. RealtorDesk AI is changing that.
              </p>
            </div>
            <div className="space-y-4">
              <Card className="p-4 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-semibold">Applies to all Canadian real estate agents</span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">Whether you're a solo agent or part of a large brokerage, FINTRAC obligations apply to you.</p>
              </Card>
              <Card className="p-4 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-semibold">Penalties up to $1M for individuals</span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">FINTRAC administrative monetary penalties are significant. Compliance is not optional.</p>
              </Card>
              <Card className="p-4 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-semibold">FINTRAC conducts regular examinations</span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">Your records may be reviewed. Having organized, accessible records is essential.</p>
              </Card>
              <Card className="p-4 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-semibold">Records must be kept for 5+ years</span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">All client identification and transaction records must be retained for a minimum of five years.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Obligations + How RealtorDesk helps */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <h2 className="text-center mb-4">Your FINTRAC Obligations — and How RealtorDesk AI Supports Them</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            RealtorDesk AI is the only Canadian real estate CRM designed to support your FINTRAC record-keeping obligations.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {obligations.map((item, i) => (
              <Card key={i} className="p-6 border-primary/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <p className="text-sm font-medium text-primary mb-1">How RealtorDesk AI helps:</p>
                  <p className="text-sm text-muted-foreground">{item.how}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiation callout */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <Card className="p-8 border-2 border-primary/30 text-center">
            <Badge className="mb-4">Canada-Exclusive Feature</Badge>
            <h2 className="mb-4">No Other CRM Does This for Canadian Agents</h2>
            <p className="text-muted-foreground mb-6">
              Follow Up Boss, Lofty, kvCORE, and Wise Agent are all US platforms with zero FINTRAC awareness. AgentLocator and IXACT Contact are Canadian-built but have no compliance record-keeping features. RealtorDesk AI is the only CRM designed to support Canadian real estate compliance obligations — FINTRAC, PIPEDA, and CASL — in a single platform.
            </p>
            <Link to="/signup">
              <Button size="lg" className="btn-gradient">
                Start Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-12">FINTRAC FAQ for Canadian Realtors</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-bold text-lg mb-3">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border text-sm text-muted-foreground">
            <strong>Official Resources:</strong><br />
            For official FINTRAC guidance, visit{" "}
            <a href="https://www.fintrac-canafe.gc.ca/re-oi/sect1-eng" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              fintrac-canafe.gc.ca
            </a>
            . Always consult the current FINTRAC guidelines and a qualified legal advisor for advice specific to your compliance obligations.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="mb-6">Build Your Compliance Records in RealtorDesk AI</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your 14-day free trial and experience the only Canadian real estate CRM designed to support FINTRAC, PIPEDA, and CASL compliance in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="btn-gradient text-lg px-10">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pipeda-compliance">
              <Button size="lg" variant="outline" className="text-lg px-10">
                PIPEDA Compliance Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FintracCompliance;
