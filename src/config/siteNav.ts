import { CAL_ROUTE } from "@/config/booking";

// THE public-site navigation registry.
//
// The redesign brief asks for "one typed navigation/route registry [to] drive
// header, mobile nav, footer and related links" instead of four hand-maintained
// copies. This is it. MarketingHeader, its mobile drawer, and MarketingFooter
// all read from here, so a destination can only appear in one place and be
// stale in another if someone edits this file wrongly — and siteNav.test.ts
// fails if a `to` is not a real public route.
//
// TWO RULES THAT COST US PAGES IN THE NAV, AND WHY THEY STAY:
//
//   1. Public only. /ai-assistant and /onboarding are wrapped in
//      <ProtectedRoute> in App.tsx (onboarding also in <RequireBilling>), so a
//      logged-out visitor clicking them lands on the login screen. The brief
//      lists both as public menu destinations. They are not, so they are not
//      here. "Desk AI" resolves to the public /features/ai-powered-crm page
//      instead — see SOLUTIONS_PANES.
//
//   2. Existing URLs win. The brief proposes /solutions/agents|teams|
//      brokerages; this site already serves those audiences at
//      /use-cases/solo-agent, /use-cases/real-estate-team and
//      /use-cases/brokerage, all indexed. Creating the proposed paths would
//      have produced three duplicate pages competing with three live ones.

export interface NavItem {
  /** Route path, or an absolute URL when `external`. */
  to: string;
  /** i18n key. `label` is the English fallback and the source of truth for copy review. */
  labelKey: string;
  label: string;
  /** One-sentence description. Rendered in the desktop panels, omitted in the drawer. */
  descKey?: string;
  desc?: string;
  external?: boolean;
  /** Analytics event name. Set only on funnel steps, not on plain navigation. */
  track?: string;
}

export interface NavGroup {
  id: string;
  labelKey: string;
  label: string;
  /** A group whose trigger is itself a destination (Pricing). No panel is rendered. */
  to?: string;
  items?: NavItem[];
  /** Two-level group: a left selector picks which pane of items is shown. */
  panes?: NavPane[];
}

export interface NavPane {
  id: string;
  labelKey: string;
  label: string;
  descKey: string;
  desc: string;
  /** The pane selector is itself a real link, not a tab that only swaps content. */
  to: string;
  items: NavItem[];
}

const WHO_WE_HELP: NavItem[] = [
  {
    to: "/use-cases/solo-agent",
    labelKey: "siteNav.agents",
    label: "Agents",
    descKey: "siteNav.agentsDesc",
    desc: "One agent, every lead in one list, and a next step waiting each morning.",
  },
  {
    to: "/use-cases/real-estate-team",
    labelKey: "siteNav.teams",
    label: "Teams",
    descKey: "siteNav.teamsDesc",
    // Deliberately not "built for teams". /use-cases/real-estate-team is a
    // buyer guide that says Realtor Desk is not yet right for one — production
    // has no seat, assignment or shared-pipeline model. The menu must not
    // promise what the page then retracts.
    desc: "What a team should demand from a CRM, and where we are not there yet.",
  },
  {
    to: "/use-cases/brokerage",
    labelKey: "siteNav.brokerages",
    label: "Brokerages",
    descKey: "siteNav.brokeragesDesc",
    desc: "A brokerage buyer guide: FINTRAC records, seats, offboarding.",
  },
];

export const SOLUTIONS_PANES: NavPane[] = [
  {
    id: "platform",
    labelKey: "siteNav.panePlatform",
    label: "Platform",
    descKey: "siteNav.panePlatformDesc",
    desc: "The CRM itself",
    to: "/features",
    items: [
      {
        to: "/features",
        labelKey: "siteNav.platformOverview",
        label: "Platform overview",
        descKey: "siteNav.platformOverviewDesc",
        desc: "Everything the product does, on one page.",
      },
      {
        to: "/features/ai-lead-scoring",
        labelKey: "siteNav.leadScoring",
        label: "Lead scoring",
        descKey: "siteNav.leadScoringDesc",
        desc: "A 0–100 score per lead, with the reasons shown rather than hidden.",
      },
      {
        to: "/features/ai-lead-follow-up",
        labelKey: "siteNav.followUp",
        label: "Follow-up",
        descKey: "siteNav.followUpDesc",
        desc: "A suggested next action and a time to do it. You send it.",
      },
      {
        to: "/what-is-a-real-estate-crm",
        labelKey: "siteNav.whatIsCrm",
        label: "What is a real estate CRM?",
        descKey: "siteNav.whatIsCrmDesc",
        desc: "Start here if you are still working from a spreadsheet.",
      },
    ],
  },
  {
    id: "desk-ai",
    labelKey: "siteNav.paneDeskAi",
    label: "Desk AI",
    descKey: "siteNav.paneDeskAiDesc",
    desc: "Where AI helps",
    // NOT /ai-assistant — that route is behind <ProtectedRoute> and would send
    // a logged-out visitor to the login screen from a marketing menu.
    to: "/features/ai-powered-crm",
    items: [
      {
        to: "/features/ai-powered-crm",
        labelKey: "siteNav.aiCrm",
        label: "AI in the CRM",
        descKey: "siteNav.aiCrmDesc",
        desc: "The specific places AI does work, and where it stops.",
      },
      {
        to: "/ai-crm-canadian-real-estate-agents-guide",
        labelKey: "siteNav.aiGuide",
        label: "AI for Canadian agents",
        descKey: "siteNav.aiGuideDesc",
        desc: "A guide to what these tools can and cannot do here.",
      },
      {
        to: "/features/casl-compliant-email",
        labelKey: "siteNav.caslEmail",
        label: "CASL-aware email",
        descKey: "siteNav.caslEmailDesc",
        desc: "Consent recorded per contact; sending is refused without it.",
      },
    ],
  },
  {
    id: "connections",
    labelKey: "siteNav.paneConnections",
    label: "Connections",
    descKey: "siteNav.paneConnectionsDesc",
    desc: "Listings and other tools",
    to: "/integrations",
    items: [
      {
        to: "/integrations",
        labelKey: "siteNav.integrations",
        label: "Integrations",
        descKey: "siteNav.integrationsDesc",
        desc: "What connects today, per capability rather than per vendor.",
      },
      {
        to: "/features/bilingual-crm",
        labelKey: "siteNav.bilingual",
        label: "Bilingual workflows",
        descKey: "siteNav.bilingualDesc",
        desc: "Interface and client email in French, set per contact.",
      },
      {
        to: "/roadmap",
        labelKey: "siteNav.roadmap",
        label: "Roadmap",
        descKey: "siteNav.roadmapDesc",
        desc: "Live, partial and planned — including CREA DDF®.",
      },
    ],
  },
];

const RESOURCES: NavItem[] = [
  {
    to: "/resources",
    labelKey: "siteNav.guides",
    label: "Guides & articles",
    descKey: "siteNav.guidesDesc",
    desc: "Written for the Canadian market, dated and sourced.",
  },
  {
    to: "/how-it-works",
    labelKey: "siteNav.howItWorks",
    label: "How it works",
    descKey: "siteNav.howItWorksDesc",
    desc: "Lead in, context reviewed, next step chosen.",
  },
  {
    // The hub, not a single vendor page. "Compare" pointed at
    // /compare/boldtrail, which sent everyone to one competitor regardless of
    // which one they actually use.
    to: "/compare",
    labelKey: "siteNav.compare",
    label: "Compare",
    descKey: "siteNav.compareDesc",
    desc: "Nine comparisons, and which vendors publish a price.",
  },
  {
    to: "/faq",
    labelKey: "siteNav.faq",
    label: "FAQ",
    descKey: "siteNav.faqDesc",
    desc: "Pricing, data residency, CASL and the trial.",
  },
];

const COMPANY: NavItem[] = [
  {
    to: "/about",
    labelKey: "siteNav.about",
    label: "About",
    descKey: "siteNav.aboutDesc",
    desc: "Who builds Realtor Desk, and where.",
  },
  {
    to: "/contact",
    labelKey: "siteNav.contact",
    label: "Contact",
    descKey: "siteNav.contactDesc",
    desc: "Reach a person, not a queue number.",
  },
  {
    to: "/partners",
    labelKey: "siteNav.partners",
    label: "Partners",
    descKey: "siteNav.partnersDesc",
    desc: "The referral program and its actual terms.",
  },
  {
    to: "/careers",
    labelKey: "siteNav.careers",
    label: "Careers",
    descKey: "siteNav.careersDesc",
    desc: "Open roles, or an honest note when there are none.",
  },
];

/** Drives the desktop header and the mobile drawer. Order is the render order. */
export const PRIMARY_NAV: NavGroup[] = [
  { id: "who-we-help", labelKey: "siteNav.whoWeHelp", label: "Who we help", items: WHO_WE_HELP },
  { id: "solutions", labelKey: "siteNav.solutions", label: "Solutions", panes: SOLUTIONS_PANES },
  { id: "pricing", labelKey: "siteNav.pricing", label: "Pricing", to: "/pricing" },
  { id: "resources", labelKey: "siteNav.resources", label: "Resources", items: RESOURCES },
  { id: "company", labelKey: "siteNav.company", label: "Company", items: COMPANY },
];

export const HEADER_ACTIONS = {
  demo: { to: CAL_ROUTE, labelKey: "marketingHeader.ctaBookDemo", label: "Book a demo", track: "book_demo" },
  signIn: { to: "/login", labelKey: "marketingHeader.ctaSignIn", label: "Sign in" },
  trial: { to: "/signup", labelKey: "marketingHeader.ctaStartFreeTrial", label: "Start free trial" },
} as const;

/**
 * Every internal destination the public chrome can reach. siteNav.test.ts
 * asserts each one is a route declared in App.tsx — the check that makes this
 * registry worth having, since a typo here would otherwise ship a 404 into the
 * header of all 88 public pages at once.
 */
export function allNavRoutes(): string[] {
  const out: string[] = [];
  const push = (items: NavItem[]) => {
    for (const i of items) if (!i.external) out.push(i.to);
  };
  for (const g of PRIMARY_NAV) {
    if (g.to) out.push(g.to);
    if (g.items) push(g.items);
    for (const p of g.panes ?? []) {
      out.push(p.to);
      push(p.items);
    }
  }
  out.push(HEADER_ACTIONS.signIn.to, HEADER_ACTIONS.trial.to);
  return [...new Set(out)];
}

// ── Footer ────────────────────────────────────────────────────────────────
//
// The footer carries two kinds of column: ones that mirror the header (Product,
// Who we help, Resources, Company) and ones that exist only here (Compare,
// Canada & compliance). Both live in this file so "one registry drives header,
// mobile nav, footer and related links" is literally true rather than true for
// the header and approximately true for the footer.
//
// Labels keep their existing `marketingFooter.*` keys. Those translations are
// the output of the 2026-04 Bill 96 audit, which swaps the legal acronyms in
// French (PIPEDA→LPRPDE, CASL→LCAP, FINTRAC→CANAFE). Renaming the keys would
// silently drop French back to English on the compliance column of every page.

export interface FooterColumn {
  id: string;
  titleKey: string;
  title: string;
  items: NavItem[];
}

const FOOTER_PRODUCT: NavItem[] = [
  { to: "/features", labelKey: "marketingFooter.itemFeatures", label: "Features" },
  { to: "/pricing", labelKey: "marketingFooter.itemPricing", label: "Pricing" },
  { to: "/how-it-works", labelKey: "marketingFooter.itemHowItWorks", label: "How it works" },
  { to: "/integrations", labelKey: "marketingFooter.itemIntegrations", label: "Integrations" },
  { to: "/roadmap", labelKey: "marketingFooter.itemRoadmap", label: "Roadmap" },
  // The one footer link that is a funnel step rather than navigation.
  { to: CAL_ROUTE, labelKey: "marketingFooter.itemBookDemo", label: "Book a demo", track: "book_demo" },
];

const FOOTER_COMPARE: NavItem[] = [
  { to: "/compare", labelKey: "siteNav.compareAll", label: "All comparisons" },
  { to: "/compare/boldtrail", labelKey: "marketingFooter.itemVsBoldtrail", label: "vs BoldTrail" },
  { to: "/switch-from-follow-up-boss", labelKey: "marketingFooter.itemVsFub", label: "vs Follow Up Boss" },
  { to: "/switch-from-lofty", labelKey: "marketingFooter.itemVsLofty", label: "vs Lofty" },
  { to: "/switch-from-ixact", labelKey: "marketingFooter.itemVsIxact", label: "vs IXACT Contact" },
  { to: "/switch-from-wise-agent", labelKey: "marketingFooter.itemVsWiseAgent", label: "vs Wise Agent" },
];

const FOOTER_CANADA: NavItem[] = [
  { to: "/pipeda-compliance", labelKey: "marketingFooter.itemPipeda", label: "PIPEDA" },
  // CASL points at the CASL article, not the PIPEDA page. They are different
  // statutes, and someone checking our CASL posture landed on the wrong one
  // until the 2026-04-24 audit.
  {
    to: "/resources/casl-compliance-real-estate-email-marketing-canada",
    labelKey: "marketingFooter.itemCasl",
    label: "CASL",
  },
  { to: "/fintrac-compliance", labelKey: "marketingFooter.itemFintrac", label: "FINTRAC" },
  { to: "/canadian-market", labelKey: "marketingFooter.itemCreaDdf", label: "CREA DDF®" },
];

const FOOTER_COMPANY: NavItem[] = [
  { to: "/about", labelKey: "siteNav.about", label: "About" },
  { to: "/resources", labelKey: "marketingFooter.itemBlog", label: "Blog" },
  { to: "/faq", labelKey: "siteNav.faq", label: "FAQ" },
  { to: "/partners", labelKey: "marketingHeader.navPartners", label: "Partners" },
  { to: "/careers", labelKey: "marketingFooter.itemCareers", label: "Careers" },
  { to: "/contact", labelKey: "marketingFooter.itemContact", label: "Contact" },
  { to: "/privacy-policy", labelKey: "marketingFooter.itemPrivacy", label: "Privacy" },
  { to: "/terms-of-service", labelKey: "marketingFooter.itemTerms", label: "Terms" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  { id: "product", titleKey: "marketingFooter.colProduct", title: "Product", items: FOOTER_PRODUCT },
  { id: "who-we-help", titleKey: "siteNav.whoWeHelp", title: "Who we help", items: WHO_WE_HELP },
  { id: "compare", titleKey: "marketingFooter.colCompare", title: "Compare", items: FOOTER_COMPARE },
  { id: "canada", titleKey: "marketingFooter.colCanada", title: "Canada", items: FOOTER_CANADA },
  { id: "company", titleKey: "marketingFooter.colCompany", title: "Company", items: FOOTER_COMPANY },
];

/** Internal footer destinations, for the same route check the header gets. */
export function allFooterRoutes(): string[] {
  return [
    ...new Set(
      FOOTER_COLUMNS.flatMap((c) => c.items)
        .filter((i) => !i.external && i.to.startsWith("/"))
        .map((i) => i.to),
    ),
  ];
}
