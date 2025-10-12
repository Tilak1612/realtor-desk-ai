import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LeadScoreData {
  contact_id: string;
  score: number;
  factors: {
    engagement: number;
    behavior: number;
    budget_match: number;
    timeline: number;
    qualification: number;
  };
  prediction_confidence: number;
  recommended_actions: string[];
  optimal_contact_time: string | null;
  insights: string | null;
  calculated_at: string;
}

export const useLeadScore = (contactId: string) => {
  const [leadScore, setLeadScore] = useState<LeadScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  const fetchLeadScore = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ai_lead_scores")
        .select("*")
        .eq("contact_id", contactId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        throw error;
      }

      setLeadScore(data as unknown as LeadScoreData);
    } catch (error: any) {
      console.error("Error fetching lead score:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLeadScore = async () => {
    try {
      setCalculating(true);

      const { data, error } = await supabase.functions.invoke("calculate-lead-score", {
        body: { contact_id: contactId },
      });

      if (error) throw error;

      toast({
        title: "Lead score updated",
        description: `Score: ${data.score}/100`,
      });

      await fetchLeadScore();
      return data;
    } catch (error: any) {
      console.error("Error calculating lead score:", error);
      toast({
        title: "Error calculating lead score",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (contactId) {
      fetchLeadScore();
    }
  }, [contactId]);

  return {
    leadScore,
    loading,
    calculating,
    calculateLeadScore,
    refreshLeadScore: fetchLeadScore,
  };
};
