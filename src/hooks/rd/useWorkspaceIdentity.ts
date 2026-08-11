import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

// Who is actually signed in, for the app chrome (sidebar workspace card +
// topbar avatar).
//
// This exists because AppShell and Sidebar previously hardcoded fallbacks —
// agentName defaulted to "Sarah Khoury" and the workspace card to
// "Royal LePage · Sarah K." with an "RL" mark. No caller ever passed real
// values, so every signed-in user saw a different brokerage's name and
// initials in their own account. That reads as leaked tenant data, which is
// the worst thing a CRM can imply.
//
// Fallbacks here are deliberately neutral. If we don't know the name we say
// so — we never substitute a plausible-looking company, because a believable
// wrong answer is worse than an obviously empty one.

export interface WorkspaceIdentity {
  /** Display name for the avatar + greeting. Empty string if unknown. */
  agentName: string;
  /** Sales-demo account: full access without a Stripe subscription. */
  isDemo: boolean;
  workspace: { name: string; tier: string; mark: string };
  loading: boolean;
}

const TIER_LABEL: Record<string, string> = {
  agent: "Solo plan",
  team: "Team plan",
  brokerage: "Brokerage plan",
};

/** Initials from a display name: "Poonam Lohia" -> "PL". */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function useWorkspaceIdentity(): WorkspaceIdentity {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["rd.workspaceIdentity", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, company_name, subscription_tier, is_demo")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });

  // Fall back to the email local-part before giving up entirely — it is at
  // least the real user, unlike a stand-in name.
  const agentName =
    (data?.full_name?.trim() || "") ||
    (user?.email ? user.email.split("@")[0] : "");

  const company = data?.company_name?.trim() || "";
  const mark = initials(company || agentName);

  return {
    agentName,
    isDemo: data?.is_demo === true,
    workspace: {
      name: company || agentName || "Your workspace",
      tier: TIER_LABEL[data?.subscription_tier ?? ""] ?? "Trial",
      mark: mark || "—",
    },
    loading: sessionLoading || isLoading,
  };
}
