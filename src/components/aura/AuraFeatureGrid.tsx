import { useTranslation } from "react-i18next";
import { Shield, CheckCircle, FileText, Brain, MapPin, Globe } from "lucide-react";
import AuraSection from "./AuraSection";
import AuraCard from "./AuraCard";

const AuraFeatureGrid = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: 'Security-First Architecture',
      description: 'Enterprise-grade encryption and security practices protecting your client data',
    },
    {
      icon: CheckCircle,
      title: 'PIPEDA-Aware Design',
      description: 'Built with Canadian privacy principles — consent management, right to erasure, breach notifications',
    },
    {
      icon: FileText,
      title: 'Canadian MLS Integration',
      description: 'Import and sync Canadian property data directly into your CRM',
    },
    {
      icon: Globe,
      title: t('canadian.bilingual', 'Bilingual Support'),
      description: t('canadian.bilingualDesc', 'Seamless English & French communication'),
    },
    {
      icon: MapPin,
      title: 'Canadian-Optimized Infrastructure',
      description: 'Hosted on infrastructure designed to keep your data within Canadian borders',
    },
    {
      icon: Brain,
      title: t('indexPage.solutionOverview.feature1Title', 'AI Lead Scoring'),
      description: t('indexPage.solutionOverview.feature1Desc', 'Prioritize hot leads automatically'),
    },
  ];

  return (
    <AuraSection
      sectionNumber="04"
      badge={t('home.credibility.badge', 'Trust & Security')}
      badgeIcon={<Shield className="w-4 h-4" />}
      title={t('home.credibility.title')}
      subtitle={t('home.credibility.subtitle', 'Built with enterprise-grade security and full Canadian compliance')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <AuraCard key={index} className="group/card">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover/card:bg-primary/20 transition-colors">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-white tracking-tight mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </AuraCard>
        ))}
      </div>
    </AuraSection>
  );
};

export default AuraFeatureGrid;
