import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import type { PipelineStage } from "@/types/rd";

// Create a contact for the signed-in user.
//
// This is the CRM's front door and it did not exist: every "Add lead" /
// "New lead" button in the product rendered with no onClick, so there was
// no way to put data into the CRM at all — the audit's #5 finding.
//
// Writes to public.contacts using the same column names useLeads selects
// (stage, not the non-existent status; ai_score left null so the scoring
// pipeline owns it). RLS owner_insert enforces user_id = auth.uid(), so a
// forged user_id fails at the database even if this code regresses.

export interface NewLeadInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  stage: PipelineStage;
  source: string;
  preferredLanguage: "en" | "fr";
  city?: string;
  budgetCad?: number;
  /** CASL: set only when the user affirms consent was captured. */
  consentCaptured: boolean;
}

export function useCreateLead() {
  const qc = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (input: NewLeadInput) => {
      if (!userId) throw new Error("Not signed in.");

      const metadata: Record<string, unknown> = {};
      if (input.city) metadata.city = input.city;
      if (input.budgetCad) metadata.budgetCad = input.budgetCad;

      const { data, error } = await supabase
        .from("contacts")
        .insert({
          user_id: userId,
          first_name: input.firstName.trim(),
          last_name: input.lastName.trim() || null,
          email: input.email.trim().toLowerCase(),
          phone: input.phone?.trim() || null,
          stage: input.stage,
          source: input.source,
          preferred_language: input.preferredLanguage,
          // CASL: consent_date is a legal record. Only stamped when the
          // agent affirms it was actually captured — never defaulted.
          consent_date: input.consentCaptured ? new Date().toISOString() : null,
          metadata,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rd.leads", userId] });
    },
  });
}
