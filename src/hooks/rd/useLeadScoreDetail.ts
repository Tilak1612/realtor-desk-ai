import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Reads the real, computed lead score for a contact.
//
// /app/leads/:id previously rendered four "criteria" bars derived from the
// score itself — Intent = score + 3, Urgency = score - 4, Budget fit = score.
// Those explained nothing; they were the same number drawn four times.
//
// calculate-lead-score already computes genuine weighted factors (engagement,
// behaviour, budget match, timeline, qualification) plus a confidence value
// that is deliberately penalised when inputs are missing. It just was never
// invoked outside the legacy contact page, so ai_lead_scores stayed empty.
// Lead creation now triggers it; this hook surfaces what it produced.

export interface LeadScoreFactors {
  engagement: number;
  behavior: number;
  budget_match: number;
  timeline: number;
  qualification: number;
}

export interface LeadScoreDetail {
  score: number;
  factors: LeadScoreFactors | null;
  /** 0–1. Falls as inputs go missing, so a confident-looking score isn't faked. */
  predictionConfidence: number | null;
  recommendedActions: string[] | null;
  calculatedAt: string | null;
}

export function useLeadScoreDetail(contactId: string | undefined) {
  const { data, isLoading } = useQuery<LeadScoreDetail | null>({
    queryKey: ["rd.leadScore", contactId],
    queryFn: async () => {
      if (!contactId) return null;
      const { data, error } = await supabase
        .from("ai_lead_scores")
        .select("score, factors, prediction_confidence, recommended_actions, calculated_at")
        .eq("contact_id", contactId)
        .maybeSingle();
      // No row simply means "not scored yet" — the UI says so rather than
      // inventing bars.
      if (error || !data) return null;
      return {
        score: data.score ?? 0,
        factors: (data.factors as unknown as LeadScoreFactors) ?? null,
        predictionConfidence: data.prediction_confidence ?? null,
        recommendedActions: (data.recommended_actions as unknown as string[]) ?? null,
        calculatedAt: data.calculated_at ?? null,
      };
    },
    enabled: !!contactId,
    staleTime: 60_000,
  });

  return { detail: data ?? null, loading: isLoading };
}
