import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapContactToLead, type ContactRow } from "@/lib/rd/mapContact";
import type { Lead } from "@/types/rd";
import { useSession } from "./useSession";

// Fetches the current user's contacts from Supabase and maps each row
// through mapContactToLead so the /app/leads table renders the same
// Lead shape the mock data used. Enabled only once we have a user id —
// otherwise the anon role would see RLS-denied rows.
//
// Downstream: /app/leads uses this; /app/leads/:id can reuse via
// findLead(id) on the returned array; /app/pipeline groups by stage.

const LEADS_COLUMNS =
  "id, first_name, last_name, email, phone, ai_score, lead_score, status, source, preferred_language, last_contact_date, consent_date, metadata";

interface UseLeadsResult {
  leads: Lead[];
  loading: boolean;
  error: Error | null;
}

export function useLeads(): UseLeadsResult {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<Lead[], Error>({
    queryKey: ["rd.leads", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("contacts")
        .select(LEADS_COLUMNS)
        .eq("user_id", userId)
        .order("ai_score", { ascending: false, nullsFirst: false })
        .limit(250);
      if (error) throw new Error(error.message);
      return (data as ContactRow[]).map(mapContactToLead);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  return {
    leads: query.data ?? [],
    loading: sessionLoading || query.isLoading,
    error: query.error ?? null,
  };
}

export function useLead(id: string | undefined): { lead: Lead | undefined; loading: boolean; error: Error | null } {
  const { leads, loading, error } = useLeads();
  const lead = id ? leads.find((l) => l.id === id) : undefined;
  return { lead, loading, error };
}
