import { Card } from "@/components/ui/card";
import { MapPin, Globe, Shield, Map, FileCheck, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

const CanadianSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="mb-4">{t('canadian.title')} 🇨🇦</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.bilingual')}</h3>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.mls')}</h3>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.compliant')}</h3>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Map className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.timezones')}</h3>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.crea')}</h3>
          </Card>

          <Card className="p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{t('canadian.pricing')}</h3>
          </Card>
        </div>

        {/* Provincial Compliance */}
        <div className="mt-16 p-8 bg-muted rounded-xl max-w-4xl mx-auto">
          <h3 className="text-center font-bold mb-6">Provincial Compliance Built-In</h3>
          <div className="flex flex-wrap justify-center gap-4">
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
