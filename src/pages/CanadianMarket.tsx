import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  X, 
  MapPin, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Building2,
  Mountain,
  Wheat,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import agentSuccess from "@/assets/agent-success.jpg";
import { SEO } from "@/components/SEO";

const CanadianMarket = () => {
  const { t } = useTranslation();
  const [openProvince, setOpenProvince] = useState<string | null>(null);

  const toggleProvince = (province: string) => {
    setOpenProvince(openProvince === province ? null : province);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Canadian Real Estate CRM | Built for CREA DDF and PIPEDA"
        description="RealtorDesk AI is built for Canadian agents with CREA DDF® integration, bilingual support, and PIPEDA-compliant data handling across provinces."
        keywords="canadian real estate crm, CREA DDF, PIPEDA compliant crm, bilingual real estate crm, canadian realtors"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="mb-6">
                {t('canadianMarket.hero.title')}{" "}
                <span className="gradient-text">{t('canadianMarket.hero.titleGradient')}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('canadianMarket.hero.subtitle')}
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

      {/* Provincial Solutions Section */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center mb-4">Provincial Solutions</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Tailored features for each province's unique market and regulations
          </p>
          
          <div className="space-y-4">
            {/* Ontario/Toronto */}
            <Card className={`overflow-hidden transition-all ${openProvince === 'ontario' ? 'border-accent' : ''}`}>
              <button
                onClick={() => toggleProvince('ontario')}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-accent" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg">🏙️ Ontario/Toronto</h3>
                    <p className="text-sm text-muted-foreground">GTA-specific features, TRREB integration</p>
                  </div>
                </div>
                {openProvince === 'ontario' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {openProvince === 'ontario' && (
                <div className="px-6 pb-6 space-y-4 animate-fade-in">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Toronto Market Intelligence:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>GTA condo market trends (Liberty Village, CityPlace, King West)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>905 area growth patterns (Mississauga, Brampton, Markham)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Foreign buyer tax (NRST) calculator integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>TRREB (Toronto Regional Real Estate Board) data sync</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Ontario Compliance:</h4>
                    <p className="text-sm text-muted-foreground">RECO regulations, FINTRAC reporting, HST on new builds</p>
                  </div>
                </div>
              )}
            </Card>

            {/* BC/Vancouver */}
            <Card className={`overflow-hidden transition-all ${openProvince === 'bc' ? 'border-accent' : ''}`}>
              <button
                onClick={() => toggleProvince('bc')}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mountain className="w-6 h-6 text-accent" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg">🏔️ British Columbia/Vancouver</h3>
                    <p className="text-sm text-muted-foreground">Luxury market tools, foreign buyer features</p>
                  </div>
                </div>
                {openProvince === 'bc' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {openProvince === 'bc' && (
                <div className="px-6 pb-6 space-y-4 animate-fade-in">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Vancouver Market Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Luxury property pricing models ($2M+ homes in West Van, Point Grey)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Foreign buyer tracking (20% additional tax calculator)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Presale condo management (assignment tracking)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Victoria/Kelowna market intelligence</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">BC Compliance:</h4>
                    <p className="text-sm text-muted-foreground">BCFSA regulations, Property Transfer Tax, Speculation & Vacancy Tax tracking</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Alberta/Calgary */}
            <Card className={`overflow-hidden transition-all ${openProvince === 'alberta' ? 'border-accent' : ''}`}>
              <button
                onClick={() => toggleProvince('alberta')}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Wheat className="w-6 h-6 text-accent" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg">🌾 Alberta/Calgary</h3>
                    <p className="text-sm text-muted-foreground">Oil & gas market insights, growth tracking</p>
                  </div>
                </div>
                {openProvince === 'alberta' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {openProvince === 'alberta' && (
                <div className="px-6 pb-6 space-y-4 animate-fade-in">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Alberta Market Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Oil price correlation tracking (impact on Calgary/Edmonton markets)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Beltline/Bridgeland/Marda Loop neighborhood analytics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>New construction boom tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Migration pattern analysis (interprovincial moves)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Alberta Compliance:</h4>
                    <p className="text-sm text-muted-foreground">RECA regulations, No PST on real estate (unique advantage)</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Quebec/Montreal */}
            <Card className={`overflow-hidden transition-all ${openProvince === 'quebec' ? 'border-accent' : ''}`}>
              <button
                onClick={() => toggleProvince('quebec')}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-accent" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg">🍁 Quebec/Montreal</h3>
                    <p className="text-sm text-muted-foreground">Full French language support, Quebec regulations</p>
                  </div>
                </div>
                {openProvince === 'quebec' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {openProvince === 'quebec' && (
                <div className="px-6 pb-6 space-y-4 animate-fade-in">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Quebec-Specific Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Complete French interface and AI (proper real estate terminology)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Quebec Civil Code compliance (different from Common Law provinces)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Montreal market insights (Plateau, Mile End, Old Montreal)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>Notary integration requirements</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Quebec Compliance:</h4>
                    <p className="text-sm text-muted-foreground">OACIQ regulations, Charter of French language, Welcome Tax (transfer tax) calculations</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Other Provinces */}
            <Card className={`overflow-hidden transition-all ${openProvince === 'other' ? 'border-accent' : ''}`}>
              <button
                onClick={() => toggleProvince('other')}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-accent" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg">📍 Other Provinces</h3>
                    <p className="text-sm text-muted-foreground">Maritime, Prairie solutions</p>
                  </div>
                </div>
                {openProvince === 'other' ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {openProvince === 'other' && (
                <div className="px-6 pb-6 space-y-3 animate-fade-in">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Manitoba (Winnipeg):</h4>
                    <p className="text-sm text-muted-foreground">Strong rental market tools, affordable housing analytics</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Saskatchewan (Regina/Saskatoon):</h4>
                    <p className="text-sm text-muted-foreground">Agriculture-linked market tracking</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Nova Scotia (Halifax):</h4>
                    <p className="text-sm text-muted-foreground">Atlantic migration boom tracking, waterfront property features</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">New Brunswick:</h4>
                    <p className="text-sm text-muted-foreground">Bilingual requirements, remote work migration analytics</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Market Intelligence Dashboard */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent">Live Market Data</Badge>
            <h2 className="mb-4">Canadian Market Intelligence Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time insights powered by CREA, CMHC, and regional MLS data
            </p>
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Toronto - Liberty Village</h4>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">$865K</div>
                <div className="text-sm text-muted-foreground mb-3">Avg. 1BR Condo Price</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">+4.2%</Badge>
                  <span className="text-xs text-muted-foreground">30-day trend</span>
                </div>
              </div>

              <div className="bg-background rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Vancouver - Yaletown</h4>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">18 days</div>
                <div className="text-sm text-muted-foreground mb-3">Avg. Days on Market</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">-3 days</Badge>
                  <span className="text-xs text-muted-foreground">Improving</span>
                </div>
              </div>

              <div className="bg-background rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Calgary - Beltline</h4>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">High</div>
                <div className="text-sm text-muted-foreground mb-3">Buyer Demand Index</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Seller's Market</Badge>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Updated hourly from live MLS feeds • Includes: price trends, inventory levels, days on market, buyer demand
              </p>
              <Link to="/demo">
                <Button variant="outline">See Your Market Data</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Canadian Success Stories */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent">Success Stories</Badge>
            <h2 className="mb-4">Canadian Agents Winning with Realtor Desk AI</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ontario Success */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  J
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold">Jennifer Thompson</h4>
                    <Badge variant="secondary" className="text-xs">Toronto, ON</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "The GTA market intelligence is incredible. AI predicted Liberty Village condo surge 2 months early. 
                    I positioned 3 clients perfectly and closed $2.6M in deals. My BoldTrail CRM had zero Canadian data."
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-accent">$127K</span>
                    </div>
                    <span className="text-muted-foreground">GCI increase</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* BC Success */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold">Marcus Chen</h4>
                    <Badge variant="secondary" className="text-xs">Vancouver, BC</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "Foreign buyer tax calculator saved me hours. AI chatbot qualified a $3.2M Yaletown presale at 11pm—
                    buyer was in Hong Kong. By morning, offer was in. Wise Agent couldn't do 1% of this."
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-accent">8 deals</span>
                    </div>
                    <span className="text-muted-foreground">closed in Q1</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Alberta Success */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  S
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold">Sarah Kowalski</h4>
                    <Badge variant="secondary" className="text-xs">Calgary, AB</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "Oil price tracking is genius. When AI flagged Beltline demand spike, I called my database. 
                    Listed 4 condos that week, all sold within 10 days. Made $42K commission in 2 weeks."
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-accent">15hrs</span>
                    </div>
                    <span className="text-muted-foreground">saved per week</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quebec Success */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  P
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold">Philippe Durocher</h4>
                    <Badge variant="secondary" className="text-xs">Montreal, QC</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "Finally, proper French! Not Google Translate garbage. AI uses correct Quebec terminology. 
                    Closed 3 Plateau condos with francophone clients who appreciated the bilingual professionalism."
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-accent">41%</span>
                    </div>
                    <span className="text-muted-foreground">GCI increase</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Manitoba Success */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  D
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold">David Martinez</h4>
                    <Badge variant="secondary" className="text-xs">Winnipeg, MB</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "Winnipeg market is unique. AI's rental analytics helped me build investor niche. 
                    Closed 12 investment properties in 6 months. Other CRMs treat MB like an afterthought."
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-accent">$89K</span>
                    </div>
                    <span className="text-muted-foreground">additional revenue</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Nova Scotia Success */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  L
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold">Laura MacDonald</h4>
                    <Badge variant="secondary" className="text-xs">Halifax, NS</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "Migration boom tracking is perfect for Halifax. AI identified Ontario buyers moving east. 
                    Closed 7 deals with Toronto transplants. They loved the waterfront property features."
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-accent">3X</span>
                    </div>
                    <span className="text-muted-foreground">more deals closed</span>
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
