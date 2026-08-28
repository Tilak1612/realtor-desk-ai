// Shared suppression-list check. Called before every Resend send so we
// honour CASL unsubscribe requests within 10 business days (actually: immediately).
//
// Suppressions are keyed on lowercased email address. A row here = never send.

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function isEmailSuppressed(
  admin: SupabaseClient,
  email: string
): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return true;
  const { data, error } = await admin
    .from("email_suppressions")
    .select("email")
    .eq("email", normalized)
    .limit(1);
  if (error) {
    // FAIL CLOSED. This previously returned false ("not suppressed") on any
    // error, and the table it queries did not exist -- so every call errored
    // and every unsubscribed contact kept receiving mail.
    //
    // Under CASL the sender bears the onus of proving consent, so the safe
    // default when we cannot determine consent state is to NOT send. A
    // withheld email is recoverable; an email to someone who withdrew consent
    // is a violation carrying up to $1M (individual) / $10M (business).
    console.error("[SUPPRESSION] check failed, refusing to send:", error.message);
    return true;
  }
  return (data?.length ?? 0) > 0;
}

export async function suppressEmail(
  admin: SupabaseClient,
  email: string,
  source: string,
  userId?: string | null,
  contactId?: string | null
): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  await admin.from("email_suppressions").upsert(
    {
      email: normalized,
      source,
      user_id: userId ?? null,
      contact_id: contactId ?? null,
    },
    { onConflict: "email" }
  );
  if (contactId) {
    await admin
      .from("contacts")
      .update({ unsubscribed: true, unsubscribe_date: new Date().toISOString() })
      .eq("id", contactId);
  }
}

export function getAdminClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
}
