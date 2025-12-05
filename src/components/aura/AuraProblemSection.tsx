import { useTranslation } from "react-i18next";
import { AlertCircle, Clock, DollarSign, Monitor } from "lucide-react";
import AuraSection from "./AuraSection";
import AuraCard from "./AuraCard";

const AuraProblemSection = () => {
  const { t } = useTranslation();

  const problems = [
    {
      icon: Clock,
      title: t('problem.lostOpportunities'),
      description: t('problem.lostOpportunitiesDesc'),
      stat: "78%",
      statLabel: t('problem.leadsLost', 'of leads lost'),
    },
    {
      icon: Monitor,
      title: t('problem.toolOverload'),
      description: t('problem.toolOverloadDesc'),
      stat: "15+",
      statLabel: t('problem.toolsUsed', 'tools used daily'),
    },
    {
      icon: DollarSign,
      title: t('problem.wastedSpend'),
      description: t('problem.wastedSpendDesc'),
      stat: "$2.5K",
      statLabel: t('problem.monthlyWaste', 'wasted monthly'),
    },
  ];

  return (
    <AuraSection
      sectionNumber="02"
      badge={t('problem.badge', 'The Bottleneck')}
      badgeIcon={<AlertCircle className="w-4 h-4" />}
      title={t('problem.title', 'Struggling with slow,')}
      titleHighlight={t('problem.titleHighlight', 'expensive lead management?')}
      subtitle={t('problem.subtitle', 'Stop relying on fragmented tools and manual follow-ups. 48% of leads are lost to slow response times.')}
      dark
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {problems.map((problem, index) => (
          <AuraCard key={index} className="min-h-[280px] justify-between group/card">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover/card:bg-primary/20 transition-colors">
                <problem.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white tracking-tight mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                {problem.description}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="text-3xl font-bold text-primary">{problem.stat}</div>
              <div className="text-sm text-muted-foreground">{problem.statLabel}</div>
            </div>
          </AuraCard>
        ))}
      </div>
    </AuraSection>
  );
};

export default AuraProblemSection;
