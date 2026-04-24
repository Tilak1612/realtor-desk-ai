import { MarketingHeader } from "@/components/rd/layout/MarketingHeader";

// Backwards-compat shim. Round-3 Item A unified the two public-site
// headers; this file used to be a separate legacy Navbar (fixed-position,
// title-case "Sign In", "Get Started" CTA, underlined active nav). Rather
// than swap `<Navbar />` with `<MarketingHeader />` across 60+ pages, this
// shim delegates so every page picks up the unified chrome automatically.
// The shim can be deleted once all imports are migrated.
const Navbar = () => <MarketingHeader />;

export default Navbar;
