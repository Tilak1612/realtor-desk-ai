import { MarketingFooter } from "@/components/rd/marketing/MarketingFooter";

// Backwards-compat shim, mirroring the one already in place for Navbar.
//
// The public site carried TWO real footers: this one (221 lines, light
// bg-muted, 13 destinations) on 84 pages, and MarketingFooter on the four
// redesigned pages. The redesign brief flagged the split — "Homepage and
// integrations page have different footers"— and asked for one shared shell.
//
// MarketingFooter is the one to keep. It carries 20 destinations against 13,
// groups them the way the brief specifies (Product / Compare / Company /
// Canada), and swaps the legal acronyms for the FR locale (PIPEDA→LPRPDE,
// CASL→LCAP, FINTRAC→CANAFE) per the 2026-04 Bill 96 audit. The legacy footer
// was English-only.
//
// The two things this file had that the other did not — the /faq link, and
// the support address plus four social profiles — were ported across first,
// so no page loses a destination in the swap.
//
// Delete this shim once the remaining imports are migrated.
const Footer = () => <MarketingFooter />;

export default Footer;
