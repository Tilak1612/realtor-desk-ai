import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import type { ActivityItem } from "@/types/rd";
import {
  mapContactActivity,
  mapConversationActivity,
  type ContactActivityRow,
  type ConversationFeedRow,
} from "@/lib/rd/mapActivity";

// Two dashboard queries merged into one hook. Both scoped to the
// signed-in user via RLS, sorted newest-first, capped small.
//
// useActivityFeed  — merged stream of contact_activities +
//                    conversation_messages, ordered by timestamp,
//                    returned as ActivityItem[] (unified shape).
// useLeadsPerDay   — 7-day bucket of new contacts for the dashboard
//                    KPI sparkline. Replaces one of the mock spark
//                    traces with a real, if small, signal.

const ACTIVITY_LIMIT = 25;

export function useActivityFeed() {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<ActivityItem[], Error>({
    queryKey: ["rd.activity-feed", userId],
    queryFn: async () => {
      if (!userId) return [];

      const [activitiesRes, messagesRes] = await Promise.all([
        supabase
          .from("contact_activities")
          .select("id, contact_id, activity_type, title, description, metadata, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(ACTIVITY_LIMIT),
        supabase
          .from("conversation_messages" as never)
          .select("id, lead_id, author, author_name, body, language, sent_at")
          .eq("user_id", userId)
          .in("author", ["ai", "agent"])
          .order("sent_at", { ascending: false })
          .limit(ACTIVITY_LIMIT),
      ]);

      if (activitiesRes.error) throw new Error(activitiesRes.error.message);
      if (messagesRes.error) throw new Error(messagesRes.error.message);

      const acts = ((activitiesRes.data ?? []) as ContactActivityRow[]).map(mapContactActivity);
      const msgs = ((messagesRes.data ?? []) as unknown as ConversationFeedRow[]).map(
        mapConversationActivity
      );

      return [...acts, ...msgs]
        .sort((a, b) => +new Date(b.at) - +new Date(a.at))
        .slice(0, ACTIVITY_LIMIT);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  return {
    activity: query.data ?? [],
    loading: sessionLoading || query.isLoading,
    error: query.error ?? null,
  };
}

/** 7-day count of leads created, oldest → newest. Normalized 0..1 so
 *  it drops straight into the <Spark /> component on the KPI row. */
export function useLeadsPerDay(days: number = 7) {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<number[], Error>({
    queryKey: ["rd.leads-per-day", userId, days],
    queryFn: async () => {
      if (!userId) return [];
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await supabase
        .from("contacts")
        .select("created_at")
        .eq("user_id", userId)
        .gte("created_at", since);
      if (error) throw new Error(error.message);

      const buckets = Array.from({ length: days }, () => 0);
      const startOfToday = startOfDay(new Date()).getTime();
      for (const row of data as { created_at: string | null }[]) {
        if (!row.created_at) continue;
        const t = startOfDay(new Date(row.created_at)).getTime();
        const idx = days - 1 - Math.floor((startOfToday - t) / 86_400_000);
        if (idx >= 0 && idx < days) buckets[idx] += 1;
      }

      // Normalize 0..1 for Spark. Keep a tiny floor so a flat-zero
      // series still renders as a visible line.
      const max = Math.max(1, ...buckets);
      return buckets.map((b) => (b === 0 ? 0.05 : 0.15 + (b / max) * 0.85));
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  return {
    points: query.data ?? [],
    loading: sessionLoading || query.isLoading,
  };
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
