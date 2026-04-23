import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RDWordmark } from "../Logo";
import { IconMaple } from "../icons";

// Shared footer for every /redesign marketing page. Five columns of
// links, wordmark + tagline on the left, "Made in Canada" strip,
// copyright + legal links. Copy flows through the `marketingFooter.*`
// namespace so the FR toggle swaps column headings, link labels, and
// legal acronyms (PIPEDA→LPRPDE, CASL→LCAP, FINTRAC→CANAFE) — per the
// 2026-04 Bill 96 audit which flagged the previous EN-only footer.

interface MarketingFooterProps {
  topBorder?: boolean;
}

export function MarketingFooter({ topBorder = true }: MarketingFooterProps) {
  const { t } = useTranslation();
  return (
    <footer
      className={`bg-white px-4 sm:px-8 md:px-14 py-14 ${topBorder ? "border-t border-rd-line" : ""}`}
    >
      <div className="mx-auto max-w-[1200px] grid grid-cols-2 md:grid-cols-5 gap-10 text-rd-ink-700">
        <div className="col-span-2 md:col-span-1.5" style={{ gridColumn: "span 2 / span 2" }}>
          <RDWordmark size={18} />
          <p className="mt-3.5 text-[13px] text-rd-ink-500 leading-[1.55] max-w-[280px]">
            {t("marketingFooter.tagline")}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-rd-ink-500">
            <IconMaple className="text-rd-terra-600" />
            {t("marketingFooter.madeInCanada")}
          </div>
        </div>

        <FooterCol
          title={t("marketingFooter.colProduct")}
          items={[
            { label: t("marketingFooter.itemFeatures"), to: "/features" },
            { label: t("marketingFooter.itemPricing"), to: "/pricing" },
            { label: t("marketingFooter.itemHowItWorks"), to: "/how-it-works" },
            { label: t("marketingFooter.itemIntegrations"), to: "/integrations" },
            { label: t("marketingFooter.itemRoadmap"), to: "/roadmap" },
          ]}
        />
        <FooterCol
          title={t("marketingFooter.colCompare")}
          items={[
            { label: t("marketingFooter.itemVsBoldtrail"), to: "/compare/boldtrail" },
            { label: t("marketingFooter.itemVsFub"), to: "/switch-from-follow-up-boss" },
            { label: t("marketingFooter.itemVsLofty"), to: "/switch-from-lofty" },
            { label: t("marketingFooter.itemVsIxact"), to: "/switch-from-ixact" },
            { label: t("marketingFooter.itemVsWiseAgent"), to: "/switch-from-wise-agent" },
          ]}
        />
        <FooterCol
          title={t("marketingFooter.colCanada")}
          items={[
            { label: t("marketingFooter.itemPipeda"), to: "/pipeda-compliance" },
            { label: t("marketingFooter.itemCasl"), to: "/pipeda-compliance" },
            { label: t("marketingFooter.itemFintrac"), to: "/fintrac-compliance" },
            { label: t("marketingFooter.itemCreaDdf"), to: "/canadian-market" },
          ]}
        />
        <FooterCol
          title={t("marketingFooter.colCompany")}
          items={[
            { label: t("marketingFooter.itemBlog"), to: "/resources" },
            { label: t("marketingFooter.itemCareers"), to: "/careers" },
            { label: t("marketingFooter.itemContact"), to: "/contact" },
            { label: t("marketingFooter.itemPrivacy"), to: "/privacy-policy" },
            { label: t("marketingFooter.itemTerms"), to: "/terms-of-service" },
          ]}
        />
      </div>

      <div className="mx-auto max-w-[1200px] mt-10 pt-6 border-t border-rd-line flex flex-col md:flex-row md:justify-between gap-3 text-[12px] text-rd-ink-500">
        <div>{t("marketingFooter.copyright", { year: new Date().getFullYear() })}</div>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:text-rd-ink-900">{t("marketingFooter.itemPrivacy")}</Link>
          <Link to="/terms-of-service" className="hover:text-rd-ink-900">{t("marketingFooter.itemTerms")}</Link>
          <Link to="/unsubscribe" className="hover:text-rd-ink-900">{t("marketingFooter.itemUnsubscribe")}</Link>
          <span>EN · FR</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-rd-ink-900 mb-3.5">
        {title}
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-[13px] text-rd-ink-600 hover:text-rd-ink-900">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
