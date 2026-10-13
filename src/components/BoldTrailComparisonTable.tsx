import { Card } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

// Four rows only. Revised 2026-10-11: the BoldTrail column used to assert a
// "12-month contract standard", "no published refund policy" and features that
// are "US-only", sourced to a G2 review page and a help article we could not
// confirm, and the intro compared "400,000+ agents" with "fewer than a hundred"
// of ours. Neither count is something we can stand behind. The BoldTrail cells
// now say only what boldtrail.com itself showed on 2026-10-02 (no prices, a demo
// request, no mention of Canada or French) and otherwise tell the reader what to
// ask. The Realtor Desk price and guarantee wording is unchanged.

interface Row {
  axis: string;
  boldtrail: string;
  boldtrailSource?: { label: string; href: string };
  us: string;
}

const rows: Row[] = [
  {
    axis: "Pricing transparency",
    boldtrail: "Not published. Its site directs visitors to request a demo.",
    boldtrailSource: {
      label: "boldtrail.com, read October 2, 2026",
      href: "https://www.boldtrail.com",
    },
    us: "Published on /pricing. $149/mo CAD (Solo) or $299/mo (Team); annual billing saves up to $789/yr. GST/HST at checkout.",
  },
  {
    axis: "Billing commitment",
    boldtrail: "Ask for the contract length and what it costs to leave early, in writing.",
    us: "Month-to-month. Cancel any time from /billing.",
  },
  {
    axis: "Canada (consent, data location, French)",
    boldtrail:
      "Its homepage does not mention Canada, French or Canadian MLS. Ask how consent is recorded and where data is stored.",
    boldtrailSource: {
      label: "boldtrail.com, read October 2, 2026",
      href: "https://www.boldtrail.com",
    },
    us:
      "Built for Canada. A consent record on each contact, a database hosted in Canada, and French or English set per contact.",
  },
  {
    axis: "Money-back guarantee",
    boldtrail: "Ask for the refund terms in writing before you sign.",
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
            "We do not compare on feature breadth: BoldTrail is a far larger product. These are four things worth checking, with what BoldTrail's own site showed when we read it and what to ask where it says nothing."
          )}
        </p>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium w-1/3">&nbsp;</th>
                <th className="px-4 py-3 font-medium">BoldTrail</th>
                <th className="px-4 py-3 font-medium">Realtor Desk</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.axis} className="border-t border-border align-top">
                  <td className="px-4 py-4 font-semibold">{row.axis}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <div className="flex gap-2">
                      <Minus className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p>{row.boldtrail}</p>
                        {row.boldtrailSource && (
                          <a
                            href={row.boldtrailSource.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline text-primary mt-1 inline-flex items-center min-h-[24px]"
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
              "If you run a large brokerage in the United States, need BackOffice commission splits, or require deep integration with US-specific MLS systems that Realtor Desk does not connect to, BoldTrail is the more mature choice today. We are built for the independent Canadian agent or boutique team — we are smaller, more focused, and will remain so for the foreseeable future. Pick the tool that fits, not the longer feature list."
            )}
          </p>
        </Card>
      </div>
    </section>
  );
};

export default BoldTrailComparisonTable;
