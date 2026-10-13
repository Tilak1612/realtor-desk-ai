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
  "id, first_name, last_name, email, phone, ai_score, stage, source, preferred_language, last_contact_date, consent_date, next_followup_date, created_at, metadata";

// Newest first. This used to be ORDER BY ai_score DESC with the same 250 cap --
// and since contacts.ai_score defaults to 0 and no create path sets it, every
// newly created lead sorted to the very bottom. On a book of 30 contacts a new
// lead was already off page 1; past 250 contacts it was never fetched at all,
// by this hook or by Leads/Pipeline/Inbox/Reports which all read it.
// created_at DESC makes the cap behave predictably: the most recent 250 are
// always present, so a lead can never be created and then be invisible.
const LEADS_ORDER_COLUMN = "created_at";
// 2026-10: no longer a cap. The dashboard now counts every contact and each of
// its numbers links here (?view=, ?stage=) — a list capped at the newest 250
// would show "Follow-ups due 40" opening a list of 12 for any agent with an
// imported sphere. Pages of 1,000 (PostgREST's max_rows) until exhausted,
// with a ceiling so a runaway loop can never hammer the API.
const LEADS_PAGE = 1000;
const LEADS_MAX_PAGES = 20;

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
      const rows: ContactRow[] = [];
      for (let page = 0; page < LEADS_MAX_PAGES; page++) {
        const from = page * LEADS_PAGE;
        const { data, error } = await supabase
          .from("contacts")
          .select(LEADS_COLUMNS)
          .eq("user_id", userId)
          .order(LEADS_ORDER_COLUMN, { ascending: false })
          // Tie-break so pages never overlap or skip rows sharing a timestamp
          // (bulk imports stamp many rows with the same created_at).
          .order("id", { ascending: true })
          .range(from, from + LEADS_PAGE - 1);
        if (error) throw new Error(error.message);
        const batch = (data ?? []) as ContactRow[];
        rows.push(...batch);
        if (batch.length < LEADS_PAGE) break;
      }
      return rows.map(mapContactToLead);
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
