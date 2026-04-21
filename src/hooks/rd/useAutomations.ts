import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import type {
  AutomationSequence,
  AutomationStep,
  AutomationStepKind,
  AutomationTriggerKind,
} from "@/types/rd";

// React Query hooks over public.automation_sequences +
// public.automation_steps. The list query fans in both tables with one
// join then groups steps under their sequence; the mutation only flips
// `active` for now — full editor ships later with its own PR.

interface SequenceRow {
  id: string;
  name: string;
  trigger: string;
  active: boolean;
  last_run_at: string | null;
  stats_30d: { sent: number; opened: number; replied: number } | null;
}
interface StepRow {
  id: string;
  sequence_id: string;
  position: number;
  kind: string;
  label: string;
  hours: number | null;
  template_id: string | null;
}

export function useAutomations() {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  const query = useQuery<AutomationSequence[], Error>({
    queryKey: ["rd.automations", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Pull sequences + all their steps in two queries. Can't express
      // "ordered steps nested under sequences" in one PostgREST call
      // cleanly without a view; two-round-trip is fine at this scale.
      const seqRes = await supabase
        .from("automation_sequences" as never)
        .select("id, name, trigger, active, last_run_at, stats_30d")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (seqRes.error) throw new Error(seqRes.error.message);

      const sequences = (seqRes.data ?? []) as unknown as SequenceRow[];
      if (sequences.length === 0) return [];

      const ids = sequences.map((s) => s.id);
      const stepsRes = await supabase
        .from("automation_steps" as never)
        .select("id, sequence_id, position, kind, label, hours, template_id")
        .in("sequence_id", ids)
        .order("position", { ascending: true });
      if (stepsRes.error) throw new Error(stepsRes.error.message);

      const stepsBySeq: Record<string, AutomationStep[]> = {};
      for (const row of (stepsRes.data ?? []) as unknown as StepRow[]) {
        (stepsBySeq[row.sequence_id] ??= []).push({
          id: row.id,
          kind: row.kind as AutomationStepKind,
          label: row.label,
          hours: row.hours ?? undefined,
          templateId: row.template_id ?? undefined,
        });
      }

      return sequences.map(
        (s): AutomationSequence => ({
          id: s.id,
          name: s.name,
          trigger: s.trigger as AutomationTriggerKind,
          active: s.active,
          lastRunAt: s.last_run_at ?? undefined,
          stats30d: s.stats_30d ?? { sent: 0, opened: 0, replied: 0 },
          steps: stepsBySeq[s.id] ?? [],
        })
      );
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  return {
    sequences: query.data ?? [],
    loading: sessionLoading || query.isLoading,
    error: query.error ?? null,
  };
}

export function useToggleAutomation() {
  const qc = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      if (!userId) throw new Error("Not signed in.");
      const { error } = await supabase
        .from("automation_sequences" as never)
        .update({ active, updated_at: new Date().toISOString() } as never)
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rd.automations", userId] });
    },
  });
}
