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
    console.error("[SUPPRESSION] check failed:", error.message);
    return false; // fail-open on infra error; do not silently drop emails
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
