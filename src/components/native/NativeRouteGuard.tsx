import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hideSplash } from "@/lib/native/bootstrap";
import { isNativeApp } from "@/lib/native/platform";
import { isAllowedInNative, nativeRedirectFor } from "@/lib/native/routes";

// Keeps the iOS / Android app inside the product.
//
// The app is built from the same route table as the website, so the bundle
// contains the homepage, pricing, sign-up and ninety marketing pages. None of
// them may ever render in the app: it is a sign-in companion to a subscription
// bought on the web, and a pricing page or a "start your free trial" button
// inside it is exactly what App Store guideline 3.1.3(f) and Google Play's
// payments policy do not allow.
//
// Rather than fork the route table, this sits around <Routes> and answers one
// question per navigation: is this path on the allow-list in
// src/lib/native/routes.ts? If not, it redirects (to /app for almost
// everything, which is also how the start route "/" becomes the dashboard, and
// from there ProtectedRoute sends a signed-out user to /login).
//
// On the web it renders its children and nothing else: no hook runs, no effect
// is registered, no location is read.

interface Props {
  children: ReactNode;
}

function Guard({ children }: Props) {
  const { pathname } = useLocation();
  const allowed = isAllowedInNative(pathname);

  // The router has committed a screen the app is allowed to show, so the
  // launch splash can come down. Keyed on `allowed` so the first commit, which
  // is normally the "/" -> "/app" redirect, does not reveal a blank frame.
  useEffect(() => {
    if (allowed) hideSplash();
  }, [allowed]);

  if (!allowed) return <Navigate to={nativeRedirectFor(pathname)} replace />;
  return <>{children}</>;
}

export function NativeRouteGuard({ children }: Props) {
  if (!isNativeApp()) return <>{children}</>;
  return <Guard>{children}</Guard>;
}

export default NativeRouteGuard;
