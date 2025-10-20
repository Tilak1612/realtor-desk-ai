import { Card } from "@/components/ui/card";
import { Clock, Monitor, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProblemSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4">{t('problem.title')}</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <Card className="p-6 sm:p-8 text-center card-hover">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3">{t('problem.lostOpportunities.title')}</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('problem.lostOpportunities.text')}
            </p>
          </Card>

          <Card className="p-6 sm:p-8 text-center card-hover">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3">{t('problem.toolOverload.title')}</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('problem.toolOverload.text')}
            </p>
          </Card>

          <Card className="p-6 sm:p-8 text-center card-hover sm:col-span-2 md:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3">{t('problem.wastedSpend.title')}</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('problem.wastedSpend.text')}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
