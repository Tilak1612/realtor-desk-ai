import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Percent,
  Clock,
  DollarSign,
  ArrowRight,
  Users,
  Building2,
  Briefcase,
  Megaphone,
} from "lucide-react";

// /partners — public landing page for the Realtor Desk Partner Program.
// This is intentionally content-only: apply form lives at /partners/apply,
// program terms at /partners/terms. No claims that can't be substantiated
// (no partner counts, no earnings averages). All numbers mirror
// src/lib/affiliate/constants.ts + the v1 migration.

const Partners = () => {
  const { t } = useTranslation();

  const faqs = [
    ["partnersPage.faqAttributionQ", "partnersPage.faqAttributionA"],
    ["partnersPage.faqClawbackQ", "partnersPage.faqClawbackA"],
    ["partnersPage.faqPayoutQ", "partnersPage.faqPayoutA"],
    ["partnersPage.faqCurrencyQ", "partnersPage.faqCurrencyA"],
    ["partnersPage.faqDisallowedQ", "partnersPage.faqDisallowedA"],
    ["partnersPage.faqStatusQ", "partnersPage.faqStatusA"],
  ] as const;

  return (
    <div className="min-h-screen">
      <SEO
        title={t("pageSeo.partnersTitle")}
        description={t("pageSeo.partnersDesc")}
        canonicalUrl="https://www.realtordesk.ai/partners"
        keywords="real estate affiliate program, Canadian CRM referral, realtor partner program, recurring commission real estate software"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center max-w-4xl">
          <div className="inline-block text-xs font-bold uppercase tracking-[0.12em] text-primary mb-4">
            {t("partnersPage.heroEyebrow")}
          </div>
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            {t("partnersPage.heroHeadline1")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            {t("partnersPage.heroSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/partners/apply">
              <Button size="lg" className="btn-gradient min-h-[48px]">
                {t("partnersPage.heroCtaPrimary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/partners/terms">
              <Button size="lg" variant="outline" className="min-h-[48px]">
                {t("partnersPage.heroCtaSecondary")}
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {t("partnersPage.heroTrustAttribution")}
            </span>
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              {t("partnersPage.heroTrustPayout")}
            </span>
            <span className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              {t("partnersPage.heroTrustReview")}
            </span>
          </div>
        </div>
      </section>

      {/* Commission tiers */}
      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-3">
              {t("partnersPage.commissionsEyebrow")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("partnersPage.commissionsHeading")}
            </h2>
            <p className="text-muted-foreground">{t("partnersPage.commissionsBody")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TierCard
              name={t("partnersPage.tierStarterName")}
              rate={t("partnersPage.tierStarterRate")}
              rule={t("partnersPage.tierStarterRule")}
              body={t("partnersPage.tierStarterBody")}
            />
            <TierCard
              name={t("partnersPage.tierGrowthName")}
              rate={t("partnersPage.tierGrowthRate")}
              rule={t("partnersPage.tierGrowthRule")}
              body={t("partnersPage.tierGrowthBody")}
            />
            <TierCard
              name={t("partnersPage.tierEliteName")}
              rate={t("partnersPage.tierEliteRate")}
              rule={t("partnersPage.tierEliteRule")}
              body={t("partnersPage.tierEliteBody")}
              featured
            />
            <TierCard
              name={t("partnersPage.tierAmbassadorName")}
              rate={t("partnersPage.tierAmbassadorRate")}
              rule={t("partnersPage.tierAmbassadorRule")}
              body={t("partnersPage.tierAmbassadorBody")}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-3">
              {t("partnersPage.howItWorksEyebrow")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("partnersPage.howItWorksHeading")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {([1, 2, 3] as const).map((n) => (
              <Card key={n} className="p-8">
                <div className="text-5xl font-serif italic text-primary mb-4">
                  {t(`partnersPage.step${n}Number`)}
                </div>
                <h3 className="text-xl font-bold mb-3">{t(`partnersPage.step${n}Title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`partnersPage.step${n}Body`)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who's a fit */}
      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-3">
              {t("partnersPage.whoEyebrow")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">{t("partnersPage.whoHeading")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FitCard
              icon={<Megaphone className="w-6 h-6" />}
              title={t("partnersPage.whoCreatorTitle")}
              body={t("partnersPage.whoCreatorBody")}
            />
            <FitCard
              icon={<Building2 className="w-6 h-6" />}
              title={t("partnersPage.whoBrokerageTitle")}
              body={t("partnersPage.whoBrokerageBody")}
            />
            <FitCard
              icon={<Briefcase className="w-6 h-6" />}
              title={t("partnersPage.whoConsultantTitle")}
              body={t("partnersPage.whoConsultantBody")}
            />
            <FitCard
              icon={<Users className="w-6 h-6" />}
              title={t("partnersPage.whoAgencyTitle")}
              body={t("partnersPage.whoAgencyBody")}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-3">
              {t("partnersPage.faqEyebrow")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">{t("partnersPage.faqHeading")}</h2>
          </div>

          <div className="space-y-4">
            {faqs.map(([qKey, aKey]) => (
              <Card key={qKey} className="p-6">
                <h3 className="font-bold mb-2">{t(qKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(aKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl text-center">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("partnersPage.ctaFinalHeading")}
            </h2>
            <p className="text-muted-foreground mb-6">{t("partnersPage.ctaFinalBody")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/partners/apply">
                <Button size="lg" className="btn-gradient min-h-[48px]">
                  {t("partnersPage.ctaFinalPrimary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/partners/terms">
                <Button size="lg" variant="outline" className="min-h-[48px]">
                  {t("partnersPage.ctaFinalSecondary")}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function TierCard({
  name,
  rate,
  rule,
  body,
  featured,
}: {
  name: string;
  rate: string;
  rule: string;
  body: string;
  featured?: boolean;
}) {
  return (
    <Card
      className={`p-6 flex flex-col ${
        featured ? "border-2 border-primary shadow-lg" : ""
      }`}
    >
      <div className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">
        {name}
      </div>
      <div className="text-4xl font-bold text-primary mb-1">{rate}</div>
      <div className="text-xs text-muted-foreground mb-4">{rule}</div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </Card>
  );
}

function FitCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="p-6">
      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </Card>
  );
}

export default Partners;
