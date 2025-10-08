import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, X, MapPin, MessageSquare, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import agentSuccess from "@/assets/agent-success.jpg";

const CanadianMarket = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="mb-6">
                The Only AI Platform Built Specifically for{" "}
                <span className="gradient-text">Canadian Real Estate</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                CREA DDF®, bilingual AI, and provincial compliance - not an afterthought, but the foundation
              </p>
            </div>
            <div className="relative animate-fade-in animation-delay-200">
              <img
                src={agentSuccess}
                alt="Canadian real estate professionals using Realtor Desk AI"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-12">Why Generic Real Estate CRMs Fail Canadian Agents</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 border-destructive/20">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-3">Missing Canadian Data</h3>
              <p className="text-muted-foreground">
                Most CRMs don't integrate with CREA DDF® or regional MLS systems, leaving you with manual data entry and outdated information.
              </p>
            </Card>

            <Card className="p-8 border-destructive/20">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-3">Translation ≠ Bilingual</h3>
              <p className="text-muted-foreground">
                Google Translate doesn't understand real estate terminology or Quebec's unique market language. "Listing" is not "Liste."
              </p>
            </Card>

            <Card className="p-8 border-destructive/20">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-3">Provincial Blind Spots</h3>
              <p className="text-muted-foreground">
                Forms and compliance for BC don't work in Ontario. Generic tools miss critical regional requirements and regulations.
              </p>
            </Card>

            <Card className="p-8 border-destructive/20">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-3">US-Centric Features</h3>
              <p className="text-muted-foreground">
                Features built for NAR and US markets don't address CMHC policies, foreign buyer taxes, or Canadian mortgage rules.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Showcase */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <h2 className="text-center mb-12">How Realtor Desk AI Solves Canadian Real Estate Challenges</h2>

          <div className="space-y-12 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Card className="p-8 card-hover">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold">Native CREA DDF® Integration</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Access 65% of Canadian listings nationally, plus seamless integration with regional systems (ITSO, Pillar 9, TREB) for complete coverage.
                  </p>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    No more manual MLS searches or data re-entry
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">65%</div>
                  <div className="text-sm text-muted-foreground">of Canadian listings accessible</div>
                </div>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 card-hover">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                  <h4 className="font-bold mb-3">Translation Examples:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      "Listing" → "Inscription" (not "Liste")
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      "Offer to Purchase" → "Promesse d'achat"
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Formal vs. informal French (Quebec style)
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold">True Bilingual Intelligence</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Our AI doesn't just translate - it understands context, real estate terminology, and cultural communication styles in both languages.
                  </p>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Serve English and French clients with equal expertise
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 card-hover">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold">Provincial Compliance Engine</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Automatic compliance with RECO (Ontario), BCFSA (BC), RECA (Alberta), AMF (Quebec) and all other provincial regulations.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Automatic form selection by province</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Required disclosure tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Cooling-off period management</span>
                    </li>
                  </ul>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Never worry about compliance violations again
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                  <h4 className="font-bold mb-3 text-center">Supported Provinces:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {["Ontario (RECO)", "BC (BCFSA)", "Alberta (RECA)", "Quebec (AMF)", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick"].map((province) => (
                      <div key={province} className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-accent" />
                        <span>{province}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="p-8 card-hover">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                  <h4 className="font-bold mb-3">Data Sources:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Bank of Canada interest rates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      CMHC housing market data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Provincial foreign buyer taxes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Immigration patterns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Regional economic indicators
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold">Canadian Market Intelligence</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Real-time integration with Canadian economic indicators, government policies, and market-specific factors that matter to your clients.
                  </p>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Position yourself as the Canadian market expert
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="mb-6 text-white">Experience the Canadian Advantage</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join 2,000+ Canadian agents who chose the platform built for their market
          </p>
          <Link to="/demo">
            <Button size="lg" variant="secondary" className="text-lg">
              Schedule a Demo
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CanadianMarket;
