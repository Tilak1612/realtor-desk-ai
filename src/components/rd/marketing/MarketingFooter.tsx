import { Link } from "react-router-dom";
import { RDWordmark } from "../Logo";
import { IconMaple } from "../icons";

// Shared footer for every /redesign marketing page. Matches the
// MarketingFooter block in rd-marketing.jsx — five columns of links,
// wordmark + tagline on the left, "Made in Canada" strip, copyright +
// legal links.
//
// Link targets use real routes where they exist (Pricing / Features /
// Compare / Roadmap / PIPEDA page aliased as /security). "Coming soon"
// links route to /resources until their dedicated page lands.

interface MarketingFooterProps {
  /** Renders a slim top border above the columns. Default true. */
  topBorder?: boolean;
}

export function MarketingFooter({ topBorder = true }: MarketingFooterProps) {
  return (
    <footer
      className={`bg-white px-4 sm:px-8 md:px-14 py-14 ${topBorder ? "border-t border-rd-line" : ""}`}
    >
      <div className="mx-auto max-w-[1200px] grid grid-cols-2 md:grid-cols-5 gap-10 text-rd-ink-700">
        <div className="col-span-2 md:col-span-1.5" style={{ gridColumn: "span 2 / span 2" }}>
          <RDWordmark size={18} />
          <p className="mt-3.5 text-[13px] text-rd-ink-500 leading-[1.55] max-w-[280px]">
            The CRM built for Canadian real estate. Hosted in Canada, bilingual, PIPEDA-native.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-rd-ink-500">
            <IconMaple className="text-rd-terra-600" />
            Made in Canada
          </div>
        </div>

        <FooterCol
          title="Product"
          items={[
            { label: "Features", to: "/features" },
            { label: "Pricing", to: "/pricing" },
            { label: "How it works", to: "/how-it-works" },
            { label: "Integrations", to: "/integrations" },
            { label: "Roadmap", to: "/roadmap" },
          ]}
        />
        <FooterCol
          title="Compare"
          items={[
            { label: "vs BoldTrail", to: "/compare/boldtrail" },
            { label: "vs Follow Up Boss", to: "/switch-from-followupboss" },
            { label: "vs Lofty", to: "/switch-from-lofty" },
            { label: "vs IXACT", to: "/switch-from-ixact" },
            { label: "vs Wise Agent", to: "/switch-from-wiseagent" },
          ]}
        />
        <FooterCol
          title="Canada"
          items={[
            { label: "PIPEDA", to: "/pipeda-compliance" },
            { label: "CASL", to: "/pipeda-compliance" },
            { label: "FINTRAC", to: "/fintrac-compliance" },
            { label: "CREA DDF", to: "/canadian-market" },
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            { label: "Blog", to: "/resources" },
            { label: "Careers", to: "/careers" },
            { label: "Contact", to: "/contact" },
            { label: "Privacy", to: "/privacy-policy" },
            { label: "Terms", to: "/terms-of-service" },
          ]}
        />
      </div>

      <div className="mx-auto max-w-[1200px] mt-10 pt-6 border-t border-rd-line flex flex-col md:flex-row md:justify-between gap-3 text-[12px] text-rd-ink-500">
        <div>© {new Date().getFullYear()} Realtor Desk · Brainfy AI Inc. · Edmonton, AB</div>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:text-rd-ink-900">Privacy</Link>
          <Link to="/terms-of-service" className="hover:text-rd-ink-900">Terms</Link>
          <Link to="/unsubscribe" className="hover:text-rd-ink-900">Unsubscribe</Link>
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
