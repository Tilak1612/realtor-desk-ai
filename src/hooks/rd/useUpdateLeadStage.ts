import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import type { PipelineStage } from "@/types/rd";

// Mutation: move a lead to a new pipeline stage.
// Writes to public.contacts.status (our canonical column; lead_score
// sometimes holds the same info but status is the contract). Updates
// updated_at so the leaderboard/reports aggregations pick up the
// freshness. Optimistically patches the useLeads cache so the kanban
// card lands in the new column instantly; on failure the cache is
// rolled back.

interface Vars {
  leadId: string;
  toStage: PipelineStage;
}

export function useUpdateLeadStage() {
  const qc = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ leadId, toStage }: Vars) => {
      if (!userId) throw new Error("Not signed in.");
      const { error } = await supabase
        .from("contacts")
        .update({ status: toStage, updated_at: new Date().toISOString() })
        .eq("id", leadId)
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
    },
    onMutate: async ({ leadId, toStage }) => {
      await qc.cancelQueries({ queryKey: ["rd.leads", userId] });
      const prev = qc.getQueryData<unknown[]>(["rd.leads", userId]);
      qc.setQueryData<unknown[]>(["rd.leads", userId], (old) => {
        if (!Array.isArray(old)) return old;
        return (old as { id: string; stage: PipelineStage }[]).map((l) =>
          l.id === leadId ? { ...l, stage: toStage } : l
        );
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["rd.leads", userId], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["rd.leads", userId] });
      qc.invalidateQueries({ queryKey: ["rd.response-time-trend"] });
    },
  });
}
