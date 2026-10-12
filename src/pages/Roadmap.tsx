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
type SectionId = "now" | "planned" | "q1_2027" | "not_on";
type QuarterKey = "apr_2026" | "none" | "q1_2027" | "tbd";
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
      { id: "casl_footer", quarterKey: "apr_2026", status: "shipped" },
      { id: "pricing_parity", quarterKey: "apr_2026", status: "shipped" },
      { id: "lead_score_explainer", quarterKey: "apr_2026", status: "shipped" },
      { id: "onboarding_checklist", quarterKey: "apr_2026", status: "shipped" },
    ],
  },
  // Revised 2026-10-11. These three sat under "Q2 2026" and "Q3 2026". Both
  // quarters have passed and none of the three is live: the score is still a
  // fixed formula, scheduled sending is not switched on, and CREA DDF sync is not
  // running. By the owner's decision they carry no date until one can be kept.
  {
    id: "planned",
    items: [
      { id: "ai_scoring", quarterKey: "none", status: "designing" },
      { id: "trigger_campaigns", quarterKey: "none", status: "designing" },
      { id: "idx_sites", quarterKey: "none", status: "building" },
    ],
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
        canonicalUrl="https://www.realtordesk.ai/roadmap"
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

      <section className="section-padding border-t">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-6">How to read this roadmap</h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Dates here are intentions, not commitments, and we would rather say
            that than have you plan a season around a quarter that slips. What is
            marked shipped is running in production today; everything else is
            still being built, and the honest answer to &ldquo;can I rely on this
            in March?&rdquo; is no until it moves.
          </p>

          <h3 className="text-lg font-semibold mb-2">What is live today</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Lead capture and scoring, a drag-and-drop pipeline with totals in CAD,
            one conversation timeline per client, Realtor.ca listing import,
            CASL-aware email with per-contact consent, SMS through Twilio, and
            inbound automation from Zapier, Make and n8n. Bilingual EN/FR
            throughout, with data hosted in Canada.
          </p>

          <h3 className="text-lg font-semibold mb-2">The two people ask about most</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Native CREA DDF® listing sync is not live yet. Until it lands,
            listings come in through the Realtor.ca importer, and we say so
            everywhere rather than implying the integration already exists.
            Calendar sync is the other one: Google Calendar and Outlook connect
            today and hold the connection, but pushing your appointments to them
            automatically is still in build.
          </p>

          <h3 className="text-lg font-semibold mb-2">What we are deliberately not promising</h3>
          <p className="text-muted-foreground leading-relaxed">
            Outbound sync into other systems, and automatic replies sent to leads
            without you in the loop. Both come up often; neither is built, and
            neither has a date. See{" "}
            <Link to="/features" className="underline">what the product does today</Link>{" "}
            or <Link to="/integrations" className="underline">the integration status list</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Roadmap;
