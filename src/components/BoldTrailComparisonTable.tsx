import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

// The only four rows we defend in public. Each BoldTrail claim links to
// a primary source (BoldTrail help center, G2, BBB). We don't compare
// feature breadth — they have 400K users and we have ~50; that axis we
// lose. These four axes we win.

interface Row {
  axis: string;
  boldtrail: string;
  boldtrailSource?: { label: string; href: string };
  us: string;
}

const rows: Row[] = [
  {
    axis: "Pricing transparency",
    boldtrail: "Hidden — $999 setup fee + annual commitment, disclosed after a sales call.",
    boldtrailSource: {
      label: "BoldTrail pricing requires a demo call (G2 review)",
      href: "https://www.g2.com/products/inside-real-estate-boldtrail/reviews",
    },
    us: "Published on /pricing. $149/mo or $999/yr (Founding Member), CAD, GST/HST at checkout.",
  },
  {
    axis: "Billing commitment",
    boldtrail: "12-month contract standard. Month-to-month requires negotiation.",
    us: "Month-to-month. Cancel any time from /billing.",
  },
  {
    axis: "Canadian-first (CASL / PIPEDA / FR)",
    boldtrail:
      "Retrofitted for the Canadian market — help center confirms several features are US-only.",
    boldtrailSource: {
      label: "BoldTrail help center — features unavailable in Canada",
      href: "https://help.boldtrail.com/s/article/Features-not-available-in-Canada",
    },
    us:
      "Built for Canada. CASL-compliant email footer on every system email, PIPEDA-aware data storage, EN/FR bilingual UI.",
  },
  {
    axis: "Money-back guarantee",
    boldtrail:
      "No published refund policy after the initial setup fee is charged.",
    boldtrailSource: {
      label: "BoldTrail Terms of Service",
      href: "https://www.insiderealestate.com/terms-of-service",
    },
    us: "30-day money-back guarantee on the annual tier.",
  },
];

const BoldTrailComparisonTable = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom max-w-5xl">
        <h2 className="text-center mb-3">
          {t("boldtrail.compare.heading", "Four rows. Not forty.")}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t(
            "boldtrail.compare.sub",
            "We do not compare on feature breadth. BoldTrail has 400,000+ agents on their platform; we have fewer than a hundred. These are the four axes where we can defend the claim, each sourced from BoldTrail's own help center, pricing signals, or public reviews."
          )}
        </p>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium w-1/3">&nbsp;</th>
                <th className="px-4 py-3 font-medium">BoldTrail</th>
                <th className="px-4 py-3 font-medium">RealtorDesk AI</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.axis} className="border-t border-border align-top">
                  <td className="px-4 py-4 font-semibold">{row.axis}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <div className="flex gap-2">
                      <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p>{row.boldtrail}</p>
                        {row.boldtrailSource && (
                          <a
                            href={row.boldtrailSource.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline text-primary mt-1 inline-block"
                          >
                            {row.boldtrailSource.label} ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <p>{row.us}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="mt-8 p-6 bg-muted/40">
          <h3 className="font-semibold mb-2">
            {t("boldtrail.betterWhen.heading", "When BoldTrail is the better choice")}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              "boldtrail.betterWhen.body",
              "If you run a large brokerage in the United States, need BackOffice commission splits, or require deep integration with US-specific MLS systems that our CREA DDF work does not yet cover, BoldTrail is the more mature choice today. We are built for the independent Canadian agent or boutique team — we are smaller, more focused, and will remain so for the foreseeable future. Pick the tool that fits, not the longer feature list."
            )}
          </p>
        </Card>
      </div>
    </section>
  );
};

export default BoldTrailComparisonTable;
