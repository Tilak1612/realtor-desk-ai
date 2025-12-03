import { Card } from "@/components/ui/card";
import { MapPin, Globe, Shield, Map, FileCheck, DollarSign, Database, Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CanadianSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            🇨🇦 Canada-First Platform
          </span>
          <h2 className="mb-4">{t('canadian.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Not a US platform with Canadian features bolted on. Built from the ground up for Canadian real estate professionals.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 card-hover border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.mls')}</h3>
            <p className="text-sm text-muted-foreground">
              Direct connection to REALTOR.ca DDF Web API. National coverage of all CREA member boards via a single integration.
            </p>
          </Card>

          <Card className="p-6 card-hover border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.bilingual')}</h3>
            <p className="text-sm text-muted-foreground">
              AI chatbot, voice agent, and all communications work seamlessly in English and French. Perfect for Quebec and bilingual markets.
            </p>
          </Card>

          <Card className="p-6 card-hover border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Database className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.dataResidency')}</h3>
            <p className="text-sm text-muted-foreground">
              All data hosted and processed exclusively in Canadian data centers. Full compliance with Canadian privacy requirements.
            </p>
          </Card>

          <Card className="p-6 card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.compliant')}</h3>
            <p className="text-sm text-muted-foreground">
              Built-in FINTRAC KYC/AML fields, CASL consent tracking, and PIPEDA-compliant data handling with audit trails.
            </p>
          </Card>

          <Card className="p-6 card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <DollarSign className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.pricing')}</h3>
            <p className="text-sm text-muted-foreground">
              Transparent CAD pricing via Stripe Canada. Interac-compatible payment options. PCI DSS 4.0 compliant.
            </p>
          </Card>

          <Card className="p-6 card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Map className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.timezones')}</h3>
            <p className="text-sm text-muted-foreground">
              AI respects Canadian time zones for communications, showings, and notifications. Coast-to-coast coverage.
            </p>
          </Card>
        </div>

        {/* User Segments */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center bg-background">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <h4 className="font-bold mb-2">Solo Agents</h4>
            <p className="text-sm text-muted-foreground">
              Single pipeline, one website, basic automations, simple reporting. Everything you need to compete.
            </p>
          </Card>
          <Card className="p-6 text-center bg-background border-2 border-primary">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <h4 className="font-bold mb-2">Teams (2-5 Agents)</h4>
            <p className="text-sm text-muted-foreground">
              Shared pipeline, lead distribution, round-robin, team templates, and performance reporting.
            </p>
          </Card>
          <Card className="p-6 text-center bg-background">
            <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
            <h4 className="font-bold mb-2">Brokerages</h4>
            <p className="text-sm text-muted-foreground">
              Multi-agent hierarchy, office structures, role-based permissions, compliance dashboards.
            </p>
          </Card>
        </div>

        {/* Provincial Compliance */}
        <div className="p-8 bg-background rounded-xl max-w-5xl mx-auto border">
          <h3 className="text-center font-bold mb-2">Provincial Compliance Built-In</h3>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Rules engine per board: display rules, branding, disclaimers, attribution, and province-specific forms
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { code: 'RECO', province: 'Ontario' },
              { code: 'BCFSA', province: 'British Columbia' },
              { code: 'RECA', province: 'Alberta' },
              { code: 'OACIQ', province: 'Quebec' },
              { code: 'MRAC', province: 'Manitoba' },
              { code: 'NSREC', province: 'Nova Scotia' },
              { code: 'RECNB', province: 'New Brunswick' },
              { code: 'SREC', province: 'Saskatchewan' }
            ].map((org, idx) => (
              <div key={idx} className="px-4 py-2 bg-muted rounded-full text-sm font-medium">
                <span className="text-primary font-semibold">{org.code}</span>
                <span className="text-muted-foreground ml-1">({org.province})</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/canadian-market">
            <Button size="lg" variant="outline" className="mr-4">
              Learn More About Canadian Features
            </Button>
          </Link>
          <Link to="/demo">
            <Button size="lg" className="btn-gradient">
              Book a Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CanadianSection;