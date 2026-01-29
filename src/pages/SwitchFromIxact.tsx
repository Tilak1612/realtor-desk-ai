import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const SwitchFromIxact = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">{t('switchFrom.ixact.badge')}</Badge>
          <h1 className="mb-6">{t('switchFrom.ixact.title')} <span className="gradient-text">{t('switchFrom.ixact.titleGradient')}</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('switchFrom.ixact.subtitle')}
          </p>
          <Link to="/signup"><Button size="lg" className="btn-gradient">{t('switchFrom.ixact.startTrial')}</Button></Link>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-8">{t('switchFrom.ixact.upgradeTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8"><DollarSign className="w-12 h-12 text-accent mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">{t('switchFrom.ixact.investment')}</div><p className="text-sm text-muted-foreground">{t('switchFrom.ixact.investmentDesc')}</p></Card>
            <Card className="p-8"><TrendingUp className="w-12 h-12 text-accent mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">{t('switchFrom.ixact.extraDeals')}</div><p className="text-sm text-muted-foreground">{t('switchFrom.ixact.extraDealsDesc')}</p></Card>
            <Card className="p-8"><Brain className="w-12 h-12 text-accent mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">{t('switchFrom.ixact.additionalRevenue')}</div><p className="text-sm text-muted-foreground">{t('switchFrom.ixact.additionalRevenueDesc')}</p></Card>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="mb-6">{t('switchFrom.ixact.trialTitle')}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t('switchFrom.ixact.trialDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">{t('switchFrom.ixact.startTrial')}</Button></Link>
            <Link to="/vs/ixact"><Button size="lg" variant="outline">{t('switchFrom.ixact.seeComparison')}</Button></Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SwitchFromIxact;