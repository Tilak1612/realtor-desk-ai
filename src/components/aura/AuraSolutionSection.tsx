import { useTranslation } from "react-i18next";
import { Bot, Phone, Mail, CheckCircle, Zap } from "lucide-react";
import AuraSection from "./AuraSection";
import AuraCard from "./AuraCard";

const AuraSolutionSection = () => {
  const { t } = useTranslation();

  const solutions = [
    {
      icon: Bot,
      title: t('solution.chatbot.title'),
      description: t('solution.chatbot.description'),
      benefits: [
        t('solution.chatbot.benefit1'),
        t('solution.chatbot.benefit2'),
        t('solution.chatbot.benefit3'),
      ],
      color: "primary",
    },
    {
      icon: Phone,
      title: t('solution.voice.title'),
      description: t('solution.voice.description'),
      benefits: [
        t('solution.voice.benefit1'),
        t('solution.voice.benefit2'),
        t('solution.voice.benefit3'),
      ],
      color: "blue",
    },
    {
      icon: Mail,
      title: t('solution.email.title'),
      description: t('solution.email.description'),
      benefits: [
        t('solution.email.benefit1'),
        t('solution.email.benefit2'),
        t('solution.email.benefit3'),
      ],
      color: "green",
    },
  ];

  return (
    <AuraSection
      sectionNumber="03"
      badge={t('solution.badge', 'The Solution')}
      badgeIcon={<Zap className="w-4 h-4" />}
      title={t('solution.title', 'AI-Powered Tools')}
      titleHighlight={t('solution.titleHighlight', 'Built for Canadian Realtors')}
      subtitle={t('solution.subtitle', '24/7 automation that speaks English and French, integrates with CREA DDF®, and respects PIPEDA compliance.')}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {solutions.map((solution, index) => (
          <AuraCard key={index} className="min-h-[320px] group/card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
              solution.color === "primary" ? "bg-primary/10 text-primary group-hover/card:bg-primary/20" :
              solution.color === "blue" ? "bg-blue-500/10 text-blue-400 group-hover/card:bg-blue-500/20" :
              "bg-green-500/10 text-green-400 group-hover/card:bg-green-500/20"
            }`}>
              <solution.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-white tracking-tight mb-3">
              {solution.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed font-light mb-6">
              {solution.description}
            </p>
            <ul className="space-y-3 mt-auto">
              {solution.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    solution.color === "primary" ? "text-primary" :
                    solution.color === "blue" ? "text-blue-400" :
                    "text-green-400"
                  }`} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </AuraCard>
        ))}
      </div>
    </AuraSection>
  );
};

export default AuraSolutionSection;
