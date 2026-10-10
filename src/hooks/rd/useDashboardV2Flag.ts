import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

// Gate for dashboard v2. Off for everyone unless one of these is true:
//
//   1. ?v=2 on /app — turns the preview on for this browser (?v=1 turns it off).
//      Lets Tilak and testers review on production data without a deploy flip.
//   2. profiles.business_preferences.dashboard_v2 === true — a per-account
//      switch an admin can set with one UPDATE, for a staged rollout.
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

export function useDashboardV2Flag(): { enabled: boolean; resolving: boolean; source: "url" | "local" | "account" | null } {
  const [params] = useSearchParams();
  const v = params.get("v");
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
    enabled: !!userId && !local && v !== "1",
    staleTime: 5 * 60_000,
  });

  if (v === "1") return { enabled: false, resolving: false, source: null };
  if (v === "2") return { enabled: true, resolving: false, source: "url" };
  if (local) return { enabled: true, resolving: false, source: "local" };
  return {
    enabled: account.data === true,
    resolving: sessionLoading || (!!userId && account.isLoading),
    source: account.data ? "account" : null,
  };
}
