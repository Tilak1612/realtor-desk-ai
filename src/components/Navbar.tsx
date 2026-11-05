import { MarketingHeader } from "@/components/rd/layout/MarketingHeader";
import { NativeBackBar } from "@/components/native/NativeBackBar";
import { isNativeApp } from "@/lib/native/platform";

// Backwards-compat shim. Round-3 Item A unified the two public-site
// headers; this file used to be a separate legacy Navbar (fixed-position,
// title-case "Sign In", "Get Started" CTA, underlined active nav). Rather
// than swap `<Navbar />` with `<MarketingHeader />` across 60+ pages, this
// shim delegates so every page picks up the unified chrome automatically.
// The shim can be deleted once all imports are migrated.
//
// In the iOS / Android app the only pages left that render this are the two
// legal pages (every other marketing route is redirected away by
// NativeRouteGuard). The marketing header links to pricing and sign-up, which
// the app must not show, so there it is replaced by a plain back bar.
const Navbar = () => (isNativeApp() ? <NativeBackBar /> : <MarketingHeader />);

export default Navbar;
