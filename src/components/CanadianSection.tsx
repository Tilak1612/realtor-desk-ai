import { Card } from "@/components/ui/card";
import { MapPin, Globe, Shield, Map, FileCheck, DollarSign } from "lucide-react";

const CanadianSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4">Built for the Canadian Market 🇨🇦</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Not just another US tool adapted for Canada. Purpose-built for Canadian realtors from day one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Bilingual Support (EN/FR)</h3>
            <p className="text-sm text-muted-foreground">
              AI that truly understands both English and French, not just translation
            </p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">CREA DDF® Integration</h3>
            <p className="text-sm text-muted-foreground">
              Native integration with Canadian MLS systems across all provinces
            </p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">PIPEDA & CASL Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Built-in compliance with Canadian privacy and anti-spam laws
            </p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Map className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">All 6 Canadian Time Zones</h3>
            <p className="text-sm text-muted-foreground">
              From Newfoundland to Pacific, we cover every Canadian time zone
            </p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">CREA Code of Ethics</h3>
            <p className="text-sm text-muted-foreground">
              Aligned with Canadian Real Estate Association standards
            </p>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Pricing in CAD</h3>
            <p className="text-sm text-muted-foreground">
              Transparent Canadian dollar pricing, no currency conversion surprises
            </p>
          </Card>
        </div>

        {/* Provincial Compliance */}
        <div className="mt-12 p-6 bg-muted rounded-xl max-w-4xl mx-auto">
          <h3 className="text-center font-bold mb-4">Provincial Compliance Built-In</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['RECO (ON)', 'BCFSA (BC)', 'RECA (AB)', 'MRAC (MB)', 'NSREC (NS)', 'OACIQ (QC)', 'RECNB (NB)'].map((org, idx) => (
              <div key={idx} className="px-4 py-2 bg-background rounded-full text-sm font-medium">
                {org}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanadianSection;
