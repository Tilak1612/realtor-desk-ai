import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./rd/useSession";

// Backs the notification bell in DashboardNavbar.
//
// The bell previously read `const notificationCount = 0; // TODO: wire to real
// notifications`, so the badge could never appear and the dropdown asserted
// "No new notifications" to every user on every page -- including an agent who
// had three showings overdue. A control that always reports the same answer is
// worse than no control: it is read as a checked, negative result.
//
// There is no `notifications` table and inventing one is a feature, not a fix.
// The honest signal already in the schema is `tasks`: anything still pending
// whose due_date has arrived or passed is exactly what a bell should surface.
// Scoped by user_id so it agrees with RLS rather than relying on it alone.

export interface DueTask {
  id: string;
  title: string;
  due_date: string | null;
  priority: string | null;
  overdue: boolean;
}

// Local calendar day, not UTC. `new Date().toISOString().slice(0,10)` rolls
// over at 00:00 UTC -- 5pm in Vancouver -- so an agent on the west coast would
// have seen tomorrow's tasks appear as due for the last seven hours of their
// working day, every day.
function localToday(): string {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const MAX_SHOWN = 20;

export function useDueTasks() {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<DueTask[], Error>({
    queryKey: ["notifications.dueTasks", userId],
    queryFn: async () => {
      if (!userId) return [];
      const today = localToday();
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, due_date, priority")
        .eq("user_id", userId)
        .eq("status", "pending")
        .not("due_date", "is", null)
        .lte("due_date", today)
        .order("due_date", { ascending: true })
        .limit(MAX_SHOWN);
      if (error) throw new Error(error.message);
      return (data ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        due_date: t.due_date,
        priority: t.priority,
        overdue: !!t.due_date && t.due_date < today,
      }));
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  return {
    tasks: query.data ?? [],
    count: query.data?.length ?? 0,
    // Distinguishes "none due" from "not known yet". The dropdown must not
    // claim an empty inbox while the query is still in flight or has failed.
    loading: sessionLoading || query.isLoading,
    error: (query.error as Error | null) ?? null,
  };
}
