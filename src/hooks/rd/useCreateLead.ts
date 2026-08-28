import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
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

      // Json, not Record<string, unknown>: only the former is assignable to a
      // jsonb column, so this is the shape the compiler can actually check.
      const metadata: Record<string, Json> = {};
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

      // Score the lead immediately. calculate-lead-score is a real rule-based
      // scorer that writes ai_lead_scores AND contacts.ai_score -- it was just
      // never invoked outside the legacy contact page, which is why every new
      // lead rendered a score of 0 on /app/leads and ai_lead_scores was empty.
      //
      // Deliberately non-blocking: a scoring failure must not fail lead
      // creation. An unscored lead is recoverable; a lost lead is not.
      void supabase.functions
        .invoke("calculate-lead-score", { body: { contact_id: data.id } })
        .then(() => qc.invalidateQueries({ queryKey: ["rd.leads", userId] }))
        .catch((e) => console.warn("[useCreateLead] scoring failed (non-fatal):", e));

      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rd.leads", userId] });
    },
  });
}
