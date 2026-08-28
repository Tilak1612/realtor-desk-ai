import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

// Records CASL consent on an existing contact.
//
// Why this exists: the Inbox composer refuses to send to a contact with no
// consent on file, which is correct. But consent could only ever be captured
// at creation time, via a checkbox on AddLeadDialog -- and no import path
// writes it at all. So every CSV-imported contact, and every contact created
// without ticking the box, was permanently unmessageable with no way to fix
// it from anywhere in the product.
//
// CASL notes that shape this:
//   - Express consent must be knowingly given by the contact. The agent is
//     recording evidence that it happened, so we store WHERE it came from
//     (consent_source) rather than just a boolean.
//   - The sender bears the onus of proof, so consent_date is stamped from the
//     write itself rather than accepted from the client.
//   - Withdrawal has to be honoured, so this can also clear consent.

export type ConsentSource =
  | "verbal"
  | "written"
  | "web_form"
  | "existing_relationship"
  | "referral";

export interface RecordConsentInput {
  contactId: string;
  /** false withdraws consent (and stamps the withdrawal). */
  granted: boolean;
  source?: ConsentSource;
}

export function useRecordConsent() {
  const { user } = useSession();
  const userId = user?.id;
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId, granted, source }: RecordConsentInput) => {
      if (!userId) throw new Error("Not signed in.");

      const nowIso = new Date().toISOString();
      const patch = granted
        ? {
            consent_given: true,
            casl_consent: true,
            consent_date: nowIso,
            consent_source: source ?? "verbal",
            unsubscribed: false,
            unsubscribe_date: null,
          }
        : {
            consent_given: false,
            casl_consent: false,
            // Keep consent_date as the historical record of when it was given;
            // clearing it would destroy the evidence trail. Withdrawal is
            // recorded separately.
            unsubscribed: true,
            unsubscribe_date: nowIso,
          };

      const { error } = await supabase
        .from("contacts")
        .update(patch)
        .eq("id", contactId)
        // Belt and braces alongside RLS: never let a bad id touch another
        // tenant's row.
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
      return { contactId, granted };
    },
    onSuccess: () => {
      // Leads, the lead detail and the Inbox send gate all read the same cache.
      qc.invalidateQueries({ queryKey: ["rd.leads", userId] });
    },
  });
}
