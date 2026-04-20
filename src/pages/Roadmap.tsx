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

interface RoadmapItem {
  title: string;
  description: string;
  quarter: string;
  status: Status;
}

const SECTIONS: { heading: string; items: RoadmapItem[] }[] = [
  {
    heading: "Shipping This Sprint (April 2026)",
    items: [
      {
        title: "CASL-compliant email footer + functional unsubscribe",
        description:
          "Every system email we send carries sender ID, physical address, consent basis, and a one-click unsubscribe that actually writes to an opt-out list.",
        quarter: "Apr 2026",
        status: "shipping",
      },
      {
        title: "Pricing page = Stripe checkout parity",
        description:
          "Every amount on /pricing is derived from the same constant that create-checkout forwards to Stripe, with a CAD label and GST/HST disclaimer.",
        quarter: "Apr 2026",
        status: "shipping",
      },
      {
        title: "Lead score explainer",
        description:
          "Contact detail page surfaces the 3 behavioural signals behind the score instead of showing a number-only.",
        quarter: "Apr 2026",
        status: "shipping",
      },
      {
        title: "Onboarding checklist on /today",
        description:
          "New accounts see a 5-step guided setup (profile, contact, property, website widget link, calendar connect). Persisted to the database, not localStorage.",
        quarter: "Apr 2026",
        status: "shipping",
      },
    ],
  },
  {
    heading: "Q2 2026",
    items: [
      {
        title: "AI-derived lead scoring",
        description:
          "Replace the current manual/formula-based score with a model trained on per-agent conversion history. Web push when a lead heats up (no native app required).",
        quarter: "Q2 2026",
        status: "designing",
      },
      {
        title: "Trigger-based email sequences",
        description:
          "Wire /campaigns and /automations to a real sequence runner. New-lead, went-cold, birthday, listing-anniversary triggers. Pause-on-reply detection. All templates ship bilingual with the CASL footer.",
        quarter: "Q2 2026",
        status: "designing",
      },
    ],
  },
  {
    heading: "Q3 2026",
    items: [
      {
        title: "Public agent websites + behavioural lead capture (CREA DDF)",
        description:
          "realtordesk.ai-hosted agent sites backed by the CREA DDF feed. Behavioural widgets feed lead scores in real time. Free with all paid tiers.",
        quarter: "Q3 2026",
        status: "building",
      },
    ],
  },
  {
    heading: "Q1 2027 — Teams tier",
    items: [
      {
        title: "Teams tier launch",
        description:
          "Multi-agent accountability dashboard, manager views, and daily-vitals rollups. Until this ships, RealtorDesk AI is built for solo agents and boutique teams (≤5).",
        quarter: "Q1 2027",
        status: "roadmapped",
      },
      {
        title: "One-click social promotion",
        description:
          "Reconsidered for Q1 2027 at the earliest. Today, you can share the public listing page to socials manually.",
        quarter: "Q1 2027",
        status: "considering",
      },
    ],
  },
  {
    heading: "Not on the 2026 Roadmap",
    items: [
      {
        title: "Native mobile app",
        description:
          "We support mobile via web push + a Capacitor-wrapped PWA. A native iOS/Android app is not planned for 2026.",
        quarter: "—",
        status: "considering",
      },
      {
        title: "Commissions / BackOffice module",
        description:
          "Out of scope. This would be a separate product surface, not an add-on to the CRM.",
        quarter: "—",
        status: "considering",
      },
      {
        title: "Agent recruitment tooling",
        description:
          "Out of scope. We are building for working agents, not brokerages recruiting agents.",
        quarter: "—",
        status: "considering",
      },
    ],
  },
];

const STATUS_LABEL: Record<Status, string> = {
  shipping: "Shipping",
  building: "Building",
  designing: "Designing",
  roadmapped: "Roadmapped",
  considering: "Considering",
  shipped: "Shipped",
};

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
        title="Product Roadmap | RealtorDesk AI"
        description="Honest, dated commitments for what RealtorDesk AI ships and when. IDX, AI scoring, campaigns, teams tier, and what is explicitly not on the roadmap."
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">{t("roadmap.badge", "Public roadmap")}</Badge>
          <h1 className="mb-4">
            {t("roadmap.title", "What we are shipping — and what we are not.")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t(
              "roadmap.subtitle",
              "Honesty is a feature. This page lists dated commitments for the capabilities our customers and competitors ask about most. If a date slips, we move it — we don't silently drop it."
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {t("roadmap.lastUpdated", "Last updated: 2026-04-20")}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-bold mb-6">{section.heading}</h2>
              <div className="grid gap-4">
                {section.items.map((item) => (
                  <Card key={item.title}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline">{item.quarter}</Badge>
                          <Badge variant={STATUS_VARIANT[item.status]}>
                            {STATUS_LABEL[item.status]}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("roadmap.footer.title", "See something missing or want to vote on priority?")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                {t(
                  "roadmap.footer.body",
                  "Email product@realtordesk.ai or open an item in the in-app feedback panel. Items with customer signal get prioritized before internal asks."
                )}
              </p>
              <p>
                <Link to="/pricing" className="text-primary underline">
                  {t("roadmap.footer.viewPricing", "View pricing")}
                </Link>
                {" · "}
                <Link to="/features" className="text-primary underline">
                  {t("roadmap.footer.viewFeatures", "What ships today")}
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
