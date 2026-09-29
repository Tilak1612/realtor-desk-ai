import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconArrow } from "@/components/rd";

// Three real articles, linked from the homepage.
//
// NO DATES AND NO BYLINES. The brief is explicit — "three real articles, no
// fabricated dates/authors" — and these articles carry no machine-readable
// publication date or author in the repo. Rendering "Sept 2026 · by the
// Realtor Desk team" would be inventing both. A card with a title and an
// honest one-line summary is worth more than one with a fabricated byline.
//
// Every slug below is a route in App.tsx; src/test/nav/siteNav.test.ts style
// checking is applied to these in homeSections.test.ts.

export interface ResourceLink {
  to: string;
  title: string;
  blurb: string;
}

interface ResourceCardsProps {
  heading: string;
  body?: string;
  items: ResourceLink[];
  /** Where "see everything" goes. */
  allTo?: string;
  allLabel?: string;
}

export function ResourceCards({ heading, body, items, allTo, allLabel }: ResourceCardsProps) {
  const { t } = useTranslation();

  return (
    <section className="px-4 sm:px-8 md:px-14 py-16 md:py-24 border-t border-rd-line">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em]">
              {heading}
            </h2>
            {body && (
              <p className="mt-2.5 text-rd-ink-600 leading-[1.6] max-w-[60ch]">{body}</p>
            )}
          </div>
          {allTo && (
            <Link
              to={allTo}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-rd-navy-800 underline-offset-4 hover:underline min-h-[44px]"
            >
              {allLabel ?? t("landing.resources.all", "All guides")}
              <IconArrow />
            </Link>
          )}
        </div>

        <ul className="grid gap-5 md:grid-cols-3 list-none p-0 m-0">
          {items.map((r) => (
            <li key={r.to}>
              <Link
                to={r.to}
                className="group flex h-full flex-col rounded-rd-xl border border-rd-line bg-white p-7 shadow-rd-sm transition-shadow hover:shadow-rd-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-navy-400"
              >
                <h3 className="text-[17px] font-semibold leading-[1.4] text-rd-ink-900">
                  {r.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[15px] leading-[1.6] text-rd-ink-600">
                  {r.blurb}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-rd-navy-800"
                >
                  {t("landing.resources.read", "Read it")}
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
