import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PRIMARY_NAV } from "@/config/siteNav";
import { IconArrow } from "@/components/rd";

// The "Who we help" row: Agents, Teams, Brokerages.
//
// Sourced from the nav registry rather than a fourth hardcoded list, so the
// three cards, the header panel, the mobile drawer and the footer column all
// name the same three destinations with the same descriptions. If an audience
// page is ever retired, it disappears from all four at once.
//
// The reference recording uses image-led cards with the label over a photo.
// Not copied: we have no licensed photography of Canadian agents, and a stock
// image of someone in a blazer adds nothing a buyer can use. These are
// type-led, which also means the label cannot become unreadable against an
// image — the acceptance criteria require every label stay legible.

export function AudienceCards({ className }: { className?: string }) {
  const { t } = useTranslation();
  const group = PRIMARY_NAV.find((g) => g.id === "who-we-help");
  if (!group?.items?.length) return null;

  return (
    <section className={`px-4 sm:px-8 md:px-14 py-16 md:py-24 ${className ?? ""}`}>
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] mb-2.5">
          {t("landing.audience.heading", "A desk for the way you work")}
        </h2>
        <p className="text-rd-ink-600 leading-[1.6] max-w-[60ch] mb-10">
          {t(
            "landing.audience.body",
            "Three honest starting points. Each one says what Realtor Desk does for that shape of business — and, where it is not the right fit yet, says that instead.",
          )}
        </p>

        <ul className="grid gap-5 md:grid-cols-3 list-none p-0 m-0">
          {group.items.map((a) => (
            <li key={a.to}>
              <Link
                to={a.to}
                className="group flex h-full flex-col rounded-rd-xl border border-rd-line bg-white p-7 shadow-rd-sm transition-shadow hover:shadow-rd-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400"
              >
                <h3 className="text-[20px] font-semibold text-rd-ink-900">
                  {t(a.labelKey, a.label)}
                </h3>
                <p className="mt-2.5 flex-1 text-[15px] leading-[1.6] text-rd-ink-600">
                  {a.descKey ? t(a.descKey, a.desc ?? "") : a.desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-rd-navy-800">
                  {t("landing.audience.cta", "Read the guide")}
                  <IconArrow className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
