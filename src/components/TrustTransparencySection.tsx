import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, TrendingUp, ShieldCheck, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const TrustTransparencySection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold">{t('trustTransparency.title')}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Beta Program */}
          <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Beaker className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">{t('trustTransparency.beta.title')}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                {t('trustTransparency.beta.description')}
              </p>
              <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                {t('trustTransparency.beta.badge')}
              </Badge>
            </div>
          </Card>

          {/* Card 2: Real Results */}
          <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">{t('trustTransparency.results.title')}</h3>
              <p className="text-sm text-muted-foreground mb-2 flex-grow">
                {t('trustTransparency.results.description')}
              </p>
              <p className="text-xs text-muted-foreground/70 italic">
                {t('trustTransparency.results.disclaimer')}
              </p>
            </div>
          </Card>

          {/* Card 3: Security First */}
          <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">{t('trustTransparency.security.title')}</h3>
              <p className="text-sm text-muted-foreground flex-grow">
                {t('trustTransparency.security.description')}
              </p>
            </div>
          </Card>

          {/* Card 4: Canadian Built */}
          <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">{t('trustTransparency.canadian.title')}</h3>
              <p className="text-sm text-muted-foreground flex-grow">
                {t('trustTransparency.canadian.description')}
              </p>
            </div>
          </Card>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-muted border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t('trustTransparency.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustTransparencySection;
