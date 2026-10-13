import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import {
  AWAITING_WINDOW_DAYS,
  buildNextUp,
  computeSummary,
  type DashContact,
  type DashInput,
  type DashMessage,
  type DashTask,
} from "@/lib/rd/dashboard";

// Data for dashboard v2. Three RLS-scoped reads of light columns, combined by
// the pure functions in lib/rd/dashboard so the numbers are testable.
//
// Contacts are PAGED until exhausted rather than capped. useLeads stops at the
// newest 250, and the old dashboard derived every KPI from that list, so an
// agent with 1,500 imported contacts saw roughly a sixth of their pipeline.
// The columns here are deliberately narrow (no notes, tags or full metadata),
// which keeps a 2,000-contact book to a couple of small requests.

const PAGE = 1000;
/** Hard ceiling so a runaway loop can never hammer the API. 20k contacts. */
const MAX_PAGES = 20;

const CONTACT_COLUMNS =
  "id, first_name, last_name, email, phone, stage, source, preferred_language, ai_score, created_at, last_contact_date, next_followup_date, casl_consent, consent_given, consent_date, unsubscribed, budget:metadata->budgetCad";

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function fetchAllContacts(userId: string): Promise<DashContact[]> {
  const out: DashContact[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE;
    const { data, error } = await supabase
      // "as never": the aliased jsonb path (budget:metadata->budgetCad) sends the
      // generated types into infinite instantiation; rows are typed below.
      .from("contacts" as never)
      .select(CONTACT_COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as unknown as DashContact[];
    out.push(...rows);
    if (rows.length < PAGE) return out;
  }
  return out;
}

async function fetchRecentMessages(userId: string): Promise<DashMessage[]> {
  const since = new Date(Date.now() - AWAITING_WINDOW_DAYS * 86_400_000).toISOString();
  const out: DashMessage[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE;
    const { data, error } = await supabase
      .from("conversation_messages" as never)
      .select("lead_id, author, sent_at")
      .eq("user_id", userId)
      .gte("sent_at", since)
      .order("sent_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as unknown as DashMessage[];
    out.push(...rows);
    if (rows.length < PAGE) return out;
  }
  return out;
}

async function fetchDueTasks(userId: string): Promise<DashTask[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, contact_id, title, due_date, status")
    .eq("user_id", userId)
    .eq("status", "pending")
    .lte("due_date", localToday())
    .order("due_date", { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as DashTask[];
}

/**
 * Suppressed addresses (CASL unsubscribes are per address). RLS lets an owner
 * read their own rows — policy owner_reads_own_suppressions. A failed read
 * must not hide a suppression, so it fails the whole load rather than
 * returning [] and showing a suppressed contact as emailable.
 */
async function fetchSuppressedEmails(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("email_suppressions" as never)
    .select("email")
    .eq("user_id", userId)
    .limit(5000);
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as { email: string }[]).map((r) => r.email);
}

export function useDashboardData() {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<DashInput, Error>({
    queryKey: ["rd.dashboard-v2", userId],
    queryFn: async () => {
      if (!userId) return { contacts: [], messages: [], tasks: [], suppressedEmails: [] };
      const [contacts, messages, tasks, suppressedEmails] = await Promise.all([
        fetchAllContacts(userId),
        fetchRecentMessages(userId),
        fetchDueTasks(userId),
        fetchSuppressedEmails(userId),
      ]);
      return { contacts, messages, tasks, suppressedEmails };
    },
    enabled: !!userId,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const derived = useMemo(() => {
    if (!query.data) return null;
    const now = new Date();
    return {
      summary: computeSummary(query.data, now),
      // All candidates; the card slices and the chips count from the same list.
      queue: buildNextUp(query.data, now, Number.POSITIVE_INFINITY),
      names: Object.fromEntries(
        query.data.contacts.map((c) => [c.id, [c.first_name, c.last_name].filter(Boolean).join(" ").trim()])
      ) as Record<string, string>,
    };
  }, [query.data]);

  return {
    summary: derived?.summary ?? null,
    queue: derived?.queue ?? [],
    names: derived?.names ?? {},
    loading: sessionLoading || query.isLoading,
    error: query.error ?? null,
    refetch: query.refetch,
    updatedAt: query.dataUpdatedAt || null,
  };
}
