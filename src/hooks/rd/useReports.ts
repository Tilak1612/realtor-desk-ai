import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { useLeads } from "./useLeads";
import type { LeadSource, PipelineStage } from "@/types/rd";

// Aggregates for /app/reports. No schema changes — everything here
// derives from contacts + conversation_messages we already have.
// Each hook is independent so the page can render partial results
// (funnel shows up immediately, response-time may take an extra beat).

interface FunnelBucket {
  stage: PipelineStage;
  label: string;
  count: number;
  pct: number;
}

const FUNNEL_ORDER: { stage: PipelineStage; label: string }[] = [
  { stage: "new", label: "Leads captured" },
  { stage: "contacted", label: "Contacted" },
  { stage: "qualified", label: "Qualified" },
  { stage: "showing", label: "Showing booked" },
  { stage: "offer", label: "Offer" },
  { stage: "won", label: "Closed won" },
];

export function useFunnel() {
  const { leads, loading } = useLeads();

  const buckets: FunnelBucket[] = (() => {
    const cumulative: Record<PipelineStage, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      showing: 0,
      offer: 0,
      won: 0,
      lost: 0,
    };

    // A lead in stage `qualified` is also past new + contacted, so the
    // funnel counts each stage as "reached or moved past."
    const stageIndex: Record<PipelineStage, number> = {
      new: 0,
      contacted: 1,
      qualified: 2,
      showing: 3,
      offer: 4,
      won: 5,
      lost: 5, // lost counts toward the captured bucket only
    };
    for (const lead of leads) {
      const depth = stageIndex[lead.stage];
      for (let i = 0; i <= depth; i++) {
        const stageAtI = FUNNEL_ORDER[i]?.stage;
        if (stageAtI) cumulative[stageAtI] += 1;
      }
    }

    const top = cumulative.new || 1;
    return FUNNEL_ORDER.map(({ stage, label }) => ({
      stage,
      label,
      count: cumulative[stage],
      pct: Math.round((cumulative[stage] / top) * 100),
    }));
  })();

  return { funnel: buckets, loading };
}

interface SourceRow {
  source: LeadSource;
  label: string;
  count: number;
  closed: number;
  pct: number;
}

export function useSourceBreakdown() {
  const { leads, loading } = useLeads();

  const byLabel = new Map<LeadSource, { count: number; closed: number }>();
  for (const l of leads) {
    const v = byLabel.get(l.source) ?? { count: 0, closed: 0 };
    v.count += 1;
    if (l.stage === "won") v.closed += 1;
    byLabel.set(l.source, v);
  }
  const total = Math.max(1, leads.length);
  const rows: SourceRow[] = Array.from(byLabel.entries()).map(([source, v]) => ({
    source,
    label: source,
    count: v.count,
    closed: v.closed,
    pct: Math.round((v.count / total) * 100),
  }));

  rows.sort((a, b) => b.count - a.count);
  return { rows, loading };
}

/** Average AI response time over the last N days. Computed as the
 *  delta between each AI message and the most recent preceding lead
 *  message in the same thread. Returned as a short human label and a
 *  normalized 0..1 per-day spark array. */
export function useResponseTimeTrend(days: number = 21) {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ["rd.response-time-trend", userId, days],
    queryFn: async () => {
      if (!userId) return { avgSeconds: null as number | null, spark: [] as number[] };
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await supabase
        .from("conversation_messages" as never)
        .select("lead_id, author, sent_at")
        .eq("user_id", userId)
        .gte("sent_at", since)
        .order("sent_at", { ascending: true });
      if (error) throw new Error(error.message);

      const byLead: Record<string, { t: number; a: string }[]> = {};
      for (const row of (data ?? []) as unknown as {
        lead_id: string;
        author: string;
        sent_at: string;
      }[]) {
        (byLead[row.lead_id] ??= []).push({
          t: new Date(row.sent_at).getTime(),
          a: row.author,
        });
      }

      // Compute response deltas: each AI message that follows a lead
      // message in the same thread contributes one delta bucketed by day.
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const dailySums = new Array(days).fill(0);
      const dailyCounts = new Array(days).fill(0);
      const allDeltas: number[] = [];

      for (const msgs of Object.values(byLead)) {
        let lastLeadAt: number | null = null;
        for (const m of msgs) {
          if (m.a === "lead") lastLeadAt = m.t;
          else if (m.a === "ai" && lastLeadAt !== null) {
            const deltaSec = Math.max(0, (m.t - lastLeadAt) / 1000);
            const bucketFromEnd = Math.floor((startOfToday.getTime() - m.t) / 86_400_000);
            const idx = days - 1 - bucketFromEnd;
            if (idx >= 0 && idx < days) {
              dailySums[idx] += deltaSec;
              dailyCounts[idx] += 1;
            }
            allDeltas.push(deltaSec);
            lastLeadAt = null; // only count first AI reply per lead message
          }
        }
      }

      const avgSeconds =
        allDeltas.length > 0
          ? allDeltas.reduce((a, b) => a + b, 0) / allDeltas.length
          : null;

      // Normalize spark: per-day averages, 0..1. Lower = better.
      const perDay = dailySums.map((sum, i) =>
        dailyCounts[i] > 0 ? sum / dailyCounts[i] : 0
      );
      const max = Math.max(1, ...perDay);
      const spark = perDay.map((s) => (s === 0 ? 0.1 : 1 - (s / max) * 0.9));

      return { avgSeconds, spark };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  const formatted =
    query.data?.avgSeconds != null
      ? formatDuration(query.data.avgSeconds)
      : null;

  return {
    avgLabel: formatted,
    avgSeconds: query.data?.avgSeconds ?? null,
    spark: query.data?.spark ?? [],
    loading: sessionLoading || query.isLoading,
  };
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec - h * 3600) / 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Agent leaderboard — when the contacts table has assigned_agent_id
 *  wired, this will group by agent. For Phase G without that column, we
 *  just return a single-row "you" bucket derived from the signed-in
 *  user's leads. */
export function useAgentLeaderboard() {
  const { user } = useSession();
  const { leads } = useLeads();

  const youDeals = leads.filter((l) => l.stage === "won").length;
  const youVolume = leads
    .filter((l) => l.stage === "won")
    .reduce((sum, l) => sum + (l.budgetCad ?? 0), 0);

  const rows = [
    {
      rank: 1,
      name: inferName(user?.user_metadata?.full_name ?? user?.email ?? "You"),
      deals: youDeals,
      volume: youVolume,
      me: true,
    },
  ];
  return { rows };
}

function inferName(raw: string): string {
  if (!raw) return "You";
  if (raw.includes("@")) {
    const [local] = raw.split("@");
    return local;
  }
  return raw;
}
