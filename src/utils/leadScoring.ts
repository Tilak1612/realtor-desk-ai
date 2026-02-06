import { supabase } from "@/integrations/supabase/client";

/**
 * Triggers lead score calculation for a contact
 */
export const triggerLeadScoreCalculation = async (contactId: string) => {
  const { data, error } = await supabase.functions.invoke("calculate-lead-score", {
    body: { contact_id: contactId },
  });

  if (error) throw error;
  return data;
};

/**
 * Batch calculate lead scores for multiple contacts
 */
export const batchCalculateLeadScores = async (contactIds: string[]) => {
  const results = await Promise.allSettled(
    contactIds.map((id) => triggerLeadScoreCalculation(id))
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { successful, failed };
};

/**
 * Get score color based on value
 */
export const getScoreColor = (score: number | null): string => {
  if (!score && score !== 0) return "text-muted-foreground";
  if (score >= 85) return "text-green-500";
  if (score >= 70) return "text-orange-500";
  if (score >= 50) return "text-yellow-500";
  return "text-muted-foreground";
};

/**
 * Get score label based on value
 */
export const getScoreLabel = (score: number | null): string => {
  if (!score && score !== 0) return "Not Scored";
  if (score >= 85) return "🔥 Hot Lead";
  if (score >= 70) return "Warm Lead";
  if (score >= 50) return "Cool Lead";
  return "Cold Lead";
};
