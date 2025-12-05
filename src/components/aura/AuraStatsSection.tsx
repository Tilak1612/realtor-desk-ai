import { useTranslation } from "react-i18next";
import { TrendingUp, Clock, Users, Shield } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const AuraStatsSection = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: TrendingUp,
      value: "12%",
      label: t('indexPage.problemStatement.stat1', 'Average lead conversion rate in real estate'),
    },
    {
      icon: Clock,
      value: "48%",
      label: t('indexPage.problemStatement.stat2', 'Leads lost due to slow response'),
    },
    {
      icon: Users,
      value: "15+",
      label: t('indexPage.problemStatement.stat3', 'Tools agents juggle daily'),
    },
    {
      icon: Shield,
      value: "2-5%",
      label: t('indexPage.problemStatement.stat4', 'Typical email open rates'),
    },
  ];

  return (
    <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto mt-4">
      <div className="bg-card rounded-[40px] py-12 sm:py-16 px-6 sm:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default AuraStatsSection;
