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
  "id, first_name, last_name, email, phone, ai_score, stage, source, preferred_language, last_contact_date, consent_date, next_followup_date, metadata";

// Newest first. This used to be ORDER BY ai_score DESC with the same 250 cap --
// and since contacts.ai_score defaults to 0 and no create path sets it, every
// newly created lead sorted to the very bottom. On a book of 30 contacts a new
// lead was already off page 1; past 250 contacts it was never fetched at all,
// by this hook or by Leads/Pipeline/Inbox/Reports which all read it.
// created_at DESC makes the cap behave predictably: the most recent 250 are
// always present, so a lead can never be created and then be invisible.
const LEADS_ORDER_COLUMN = "created_at";
const LEADS_FETCH_LIMIT = 250;

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
        .order(LEADS_ORDER_COLUMN, { ascending: false })
        .limit(LEADS_FETCH_LIMIT);
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
