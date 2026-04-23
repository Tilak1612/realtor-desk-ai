import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Source of truth: docs/ROADMAP_COMMITMENTS_2026-04-20.md
// Update the doc and this file together — the public roadmap must never
// drift from the internal commitments file.

type Status = "shipping" | "building" | "designing" | "roadmapped" | "considering" | "shipped";
type SectionId = "now" | "q2" | "q3" | "q1_2027" | "not_on";
type QuarterKey = "apr_2026" | "q2_2026" | "q3_2026" | "q1_2027" | "tbd";
type ItemId =
  | "casl_footer"
  | "pricing_parity"
  | "lead_score_explainer"
  | "onboarding_checklist"
  | "ai_scoring"
  | "trigger_campaigns"
  | "idx_sites"
  | "teams_tier"
  | "social_promotion"
  | "native_mobile"
  | "commissions"
  | "recruiting";

interface RoadmapItem {
  id: ItemId;
  quarterKey: QuarterKey;
  status: Status;
}

const SECTIONS: { id: SectionId; items: RoadmapItem[] }[] = [
  {
    id: "now",
    items: [
      { id: "casl_footer", quarterKey: "apr_2026", status: "shipping" },
      { id: "pricing_parity", quarterKey: "apr_2026", status: "shipping" },
      { id: "lead_score_explainer", quarterKey: "apr_2026", status: "shipping" },
      { id: "onboarding_checklist", quarterKey: "apr_2026", status: "shipping" },
    ],
  },
  {
    id: "q2",
    items: [
      { id: "ai_scoring", quarterKey: "q2_2026", status: "designing" },
      { id: "trigger_campaigns", quarterKey: "q2_2026", status: "designing" },
    ],
  },
  {
    id: "q3",
    items: [{ id: "idx_sites", quarterKey: "q3_2026", status: "building" }],
  },
  {
    id: "q1_2027",
    items: [
      { id: "teams_tier", quarterKey: "q1_2027", status: "roadmapped" },
      { id: "social_promotion", quarterKey: "q1_2027", status: "considering" },
    ],
  },
  {
    id: "not_on",
    items: [
      { id: "native_mobile", quarterKey: "tbd", status: "considering" },
      { id: "commissions", quarterKey: "tbd", status: "considering" },
      { id: "recruiting", quarterKey: "tbd", status: "considering" },
    ],
  },
];

const STATUS_VARIANT: Record<Status, "default" | "secondary" | "outline"> = {
  shipping: "default",
  shipped: "default",
  building: "secondary",
  designing: "secondary",
  roadmapped: "outline",
  considering: "outline",
};

const Roadmap = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title={t('pageSeo.roadmapTitle')}
        description={t('pageSeo.roadmapDesc')}
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">{t("roadmap.badge")}</Badge>
          <h1 className="mb-4">{t("roadmap.title")}</h1>
          <p className="text-lg text-muted-foreground">{t("roadmap.subtitle")}</p>
          <p className="text-sm text-muted-foreground mt-4">{t("roadmap.lastUpdated")}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.id}>
              <h2 className="text-2xl font-bold mb-6">
                {t(`roadmap.section.${section.id}.heading`)}
              </h2>
              <div className="grid gap-4">
                {section.items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <CardTitle className="text-lg">
                          {t(`roadmap.item.${item.id}.title`)}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline">{t(`roadmap.quarter.${item.quarterKey}`)}</Badge>
                          <Badge variant={STATUS_VARIANT[item.status]}>
                            {t(`roadmap.status.${item.status}`)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(`roadmap.item.${item.id}.desc`)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">{t("roadmap.footer.title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>{t("roadmap.footer.body")}</p>
              <p>
                <Link to="/pricing" className="text-primary underline">
                  {t("roadmap.footer.viewPricing")}
                </Link>
                {" · "}
                <Link to="/features" className="text-primary underline">
                  {t("roadmap.footer.viewFeatures")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Roadmap;
