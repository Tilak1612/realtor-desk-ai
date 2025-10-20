import { UserPlus, Link as LinkIcon, Brain, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";

const HowItWorksSection = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: t('howItWorks.step1.title'),
      time: t('howItWorks.step1.time'),
      description: t('howItWorks.step1.description')
    },
    {
      number: 2,
      icon: LinkIcon,
      title: t('howItWorks.step2.title'),
      time: t('howItWorks.step2.time'),
      description: t('howItWorks.step2.description')
    },
    {
      number: 3,
      icon: Brain,
      title: t('howItWorks.step3.title'),
      time: t('howItWorks.step3.time'),
      description: t('howItWorks.step3.description')
    },
    {
      number: 4,
      icon: Rocket,
      title: t('howItWorks.step4.title'),
      time: t('howItWorks.step4.time'),
      description: t('howItWorks.step4.description')
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <h2 className="mb-3 sm:mb-4">{t('howItWorks.title')}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center animate-fade-in-up">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                {step.number}
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-accent font-semibold mb-2">⏱️ {step.time}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
