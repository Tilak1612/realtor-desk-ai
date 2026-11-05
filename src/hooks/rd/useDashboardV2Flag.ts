import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { isNativeApp } from "@/lib/native/platform";

// Gate for dashboard v2. Off for everyone unless one of these is true:
//
//   1. ?v=2 on /app — turns the preview on for this browser (?v=1 turns it off).
//      Lets Tilak and testers review on production data without a deploy flip.
//   2. profiles.business_preferences.dashboard_v2 === true — a per-account
//      switch an admin can set with one UPDATE, for a staged rollout.
//   3. The page is running inside the iOS / Android app. There v2 is the
//      default, for everyone, with no flag to read.
//
// Why the app differs (3). The v1 dashboard words its activity feed as "Desk AI
// replied to …" under a green "Live" badge and counts "Showings booked", and
// fills an empty account with sample rows in that voice. Nothing in the product
// replies or books on its own, so a store reviewer opening the app reads those
// lines as a claim about what it does. v2 was written to drop that wording. On
// the web v1 stays the default exactly as before: rule 3 is behind
// isNativeApp(), which is always false in a browser.
//
// ?v=1 still works in the app, but only for the page view that carries it. It
// is not remembered the way the web remembers ?v=2, because the app has no
// address bar to type ?v=2 into again: a remembered "off" could leave a phone
// on the v1 wording with no way back.
//
// No migration: business_preferences is an existing jsonb column. Storage is
// wrapped because private windows and blocked site data throw on access.

const KEY = "rd.dashboardV2";

function readLocal(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function writeLocal(on: boolean) {
  try {
    if (on) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the flag lasts for this page view only */
  }
}

export function useDashboardV2Flag(): {
  enabled: boolean;
  resolving: boolean;
  source: "url" | "local" | "account" | "native" | null;
} {
  const [params] = useSearchParams();
  const v = params.get("v");
  const native = isNativeApp();
  const [local, setLocal] = useState<boolean>(() => (v === "2" ? true : v === "1" ? false : readLocal()));

  useEffect(() => {
    if (v === "2") {
      writeLocal(true);
      setLocal(true);
    } else if (v === "1") {
      writeLocal(false);
      setLocal(false);
    }
  }, [v]);

  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;
  const account = useQuery<boolean>({
    queryKey: ["rd.dashboard-v2-flag", userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("profiles")
        .select("business_preferences")
        .eq("id", userId)
        .maybeSingle();
      if (error) return false; // a flag read must never block the dashboard
      const prefs = (data?.business_preferences ?? {}) as Record<string, unknown>;
      return prefs.dashboard_v2 === true;
    },
    // Never in the app: the answer there does not depend on the account, so
    // the dashboard must not wait on (or spend a request on) this read.
    enabled: !!userId && !local && v !== "1" && !native,
    staleTime: 5 * 60_000,
  });

  if (v === "1") return { enabled: false, resolving: false, source: null };
  if (v === "2") return { enabled: true, resolving: false, source: "url" };
  // After the two URL overrides and before anything stored or fetched, so the
  // app's first paint is already v2 (resolving is false, v1 never flashes).
  if (native) return { enabled: true, resolving: false, source: "native" };
  if (local) return { enabled: true, resolving: false, source: "local" };
  return {
    enabled: account.data === true,
    resolving: sessionLoading || (!!userId && account.isLoading),
    source: account.data ? "account" : null,
  };
}
