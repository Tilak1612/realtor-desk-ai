import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAuthDeepLinks } from "@/lib/native/auth/deepLinks";
import { registerAuthLifecycle } from "@/lib/native/auth/lifecycle";

// Connects the two native auth listeners to the router, so wiring them is one
// element instead of two effects in App.tsx:
//
//   deep links   a provider sign-in or an emailed link returning to the app
//   lifecycle    refresh the session when the app comes back to the foreground
//
// Must be rendered INSIDE <BrowserRouter> (it needs useNavigate) and outside
// any route, so it is mounted for the whole life of the app. Both register
// functions return immediately in a browser, so on the web this is an empty
// component.
export function NativeAuthBridge() {
  const navigate = useNavigate();

  // useNavigate() returns a new function on every location change. Calling
  // register again only swaps the function the single listener uses; it does
  // not add a second listener.
  useEffect(() => {
    registerAuthDeepLinks(navigate);
  }, [navigate]);

  useEffect(() => registerAuthLifecycle(), []);

  return null;
}

export default NativeAuthBridge;
