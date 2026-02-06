import { supabase } from "@/integrations/supabase/client";

export interface LeadScoreResult {
  success: boolean;
  score: number;
  quality: "hot" | "warm" | "cold";
  factors: {
    engagement: number;
    recency: number;
    propertyMatch: number;
    demographics: number;
    communication: number;
  };
  insights: string[];
  actions: string[];
  confidence: "high" | "medium" | "low";
}

export async function calculateLeadScore(contactId: string): Promise<LeadScoreResult> {
  try {
    const { data, error } = await supabase.functions.invoke("lead-score-calculator", {
      body: { contactId },
    });

    if (error) throw error;

    return data as LeadScoreResult;
  } catch (error: unknown) {
    throw new Error(error.message || "Failed to calculate lead score");
  }
}

export async function getLeadScore(contactId: string) {
  try {
    const { data, error } = await supabase
      .from("lead_scores")
      .select("*")
      .eq("contact_id", contactId)
      .order("calculated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error: unknown) {
    return null;
  }
}
