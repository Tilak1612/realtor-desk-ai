import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/utils/analytics";
import { CAL_ROUTE } from "@/config/booking";
import { RDWordmark } from "../Logo";
import { IconMaple } from "../icons";
import { COMMUNITY_URL, isCommunityEnabled } from "@/lib/community";
import { FOOTER_COLUMNS } from "@/config/siteNav";

// Shared footer for every public page. Columns come from FOOTER_COLUMNS in
// src/config/siteNav.ts, the same registry that drives the header and the
// mobile drawer, so a destination cannot be current in one and stale in the
// other. Only the community link is resolved here, because it depends on an
// env var rather than on the registry.
//
// Five columns of
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

  // Community link surfaces only when VITE_COMMUNITY_URL is configured, so it
  // is injected here rather than sitting in the registry as a dead entry.
  // Slotted after Careers since "Community" is brand-adjacent rather than
  // product or compliance.
  const columns = FOOTER_COLUMNS.map((col) => {
    const items = col.items.map((i) => ({
      label: t(i.labelKey, i.label),
      to: i.to,
      external: i.external,
      track: i.track,
    }));
    if (col.id === "company" && isCommunityEnabled()) {
      const at = items.findIndex((i) => i.to === "/careers");
      items.splice(at < 0 ? items.length : at + 1, 0, {
        label: t("marketingFooter.itemCommunity"),
        to: COMMUNITY_URL,
        external: true,
        track: undefined,
      });
    }
    return { id: col.id, title: t(col.titleKey, col.title), items };
  });

  return (
    <footer
      className={`bg-white px-4 sm:px-8 md:px-14 py-14 ${topBorder ? "border-t border-rd-line" : ""}`}
    >
      {/* Brand spans 2, then one slot per registry column. Adding "Who we help"
          took this from 6 slots to 7, which is too many to read at md — so md
          runs 4-up (brand + 2 columns, rest wrap) and the single row only
          appears at lg. The 2026-04-24 audit fixed the opposite failure, a
          grid too narrow for its columns, and the fix has to hold both ways. */}
      <div className="mx-auto max-w-[1200px] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10 text-rd-ink-700">
        <div className="col-span-2 md:col-span-2">
          <RDWordmark size={18} />
          <p className="mt-3.5 text-[13px] text-rd-ink-500 leading-[1.55] max-w-[280px]">
            {t("marketingFooter.tagline")}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-rd-ink-500">
            <IconMaple className="text-rd-terra-600" />
            {t("marketingFooter.madeInCanada")}
          </div>
        </div>

        {columns.map((col) => (
          <FooterCol key={col.id} title={col.title} items={col.items} />
        ))}
      </div>

      {/* Bottom bar: Privacy + Terms were previously duplicated here
          and in the Company column. 2026-04-24 audit flagged the dup.
          Kept only Unsubscribe in the bottom bar — it's the CASL-
          required single-click reachable-from-footer link; Privacy +
          Terms stay in the Company column. */}
      {/* Social accounts and the support address lived only in the legacy
          Footer. They move here as part of retiring it, so the 84 pages that
          used the old component do not silently lose the only published way
          to reach us. Same four verified profiles, unchanged. */}
      <div className="mx-auto max-w-[1200px] mt-10 pt-6 border-t border-rd-line flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-rd-ink-500">
        <a
          href="mailto:support@realtordesk.ai"
          className="hover:text-rd-ink-900 inline-flex items-center min-h-[24px]"
        >
          support@realtordesk.ai
        </a>
        <span className="flex items-center gap-4">
          {[
            ["YouTube", "https://www.youtube.com/@RealtorDeskAI"],
            ["X", "https://x.com/Realtor_desk_AI"],
            ["Facebook", "https://www.facebook.com/profile.php?id=61583653411571"],
            ["Instagram", "https://www.instagram.com/realtor_desk_ai/"],
          ].map(([name, href]) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rd-ink-900 inline-flex items-center min-h-[24px]"
            >
              {name}
            </a>
          ))}
        </span>
      </div>

      <div className="mx-auto max-w-[1200px] mt-6 pt-6 border-t border-rd-line flex flex-col md:flex-row md:justify-between gap-3 text-[12px] text-rd-ink-500">
        <div>{t("marketingFooter.copyright", { year: new Date().getFullYear() })}</div>
        <div className="flex gap-6">
          {/* min-h-[24px] on the controls, not the row. At 12px these render
              19px tall, under the 24x24 of WCAG 2.5.8 Target Size (Minimum).
              inline-flex keeps them on the same baseline as the adjacent text
              while growing the hit area rather than the type. Verified at
              320/375/390/430/768 by scripts/verify-responsive.mjs. */}
          <Link
            to="/unsubscribe"
            className="hover:text-rd-ink-900 inline-flex items-center min-h-[24px]"
          >
            {t("marketingFooter.itemUnsubscribe")}
          </Link>
          {/* A consent decision has to be changeable, not just collectable.
              This control existed only in the legacy footer, so on the whole
              marketing shell there was no way to revisit it — while
              /privacy-policy claimed "full control ... through our cookie
              consent banner". Clearing the stored choice re-shows the banner. */}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("cookie-consent");
              window.location.reload();
            }}
            className="hover:text-rd-ink-900 underline-offset-2 hover:underline inline-flex items-center min-h-[24px]"
          >
            {t("marketingFooter.itemCookieSettings", "Cookie settings")}
          </button>
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
  items: { label: string; to: string; external?: boolean; track?: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-rd-ink-900 mb-3.5">
        {title}
      </div>
      {/* Column links are navigation, not prose: each is a standalone target,
          so each needs 24px of height under WCAG 2.5.8. At 13px they rendered
          16px tall. The gap tightens from 2.5 to 1 so the column keeps roughly
          the same overall length -- the spacing moves inside each row. */}
      <ul className="flex flex-col gap-1">
        {items.map((i) => (
          <li key={i.label}>
            {i.external ? (
              <a
                href={i.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-rd-ink-600 hover:text-rd-ink-900 inline-flex items-center min-h-[24px]"
              >
                {i.label}
              </a>
            ) : (
              <Link
                to={i.to}
                className="text-[13px] text-rd-ink-600 hover:text-rd-ink-900 inline-flex items-center min-h-[24px]"
                onClick={
                  i.track
                    ? () =>
                        trackEvent("cta_click", {
                          cta_location: "footer",
                          cta_label: i.track,
                          destination: i.to,
                        })
                    : undefined
                }
              >
                {i.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
