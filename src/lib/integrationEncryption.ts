import { supabase } from "@/integrations/supabase/client";

/**
 * SECURITY: Store OAuth integration tokens securely
 * This function encrypts tokens before storing them in the database
 * Never store plain text tokens in the integrations table
 */
export async function storeEncryptedIntegration({
  integrationId,
  provider,
  providerType,
  accessToken,
  refreshToken,
  expiresAt,
  metadata = {},
}: {
  integrationId?: string;
  provider: string;
  providerType: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "encrypt-integration-token",
      {
        body: {
          action: "encrypt_and_store",
          integration_id: integrationId,
          provider,
          provider_type: providerType,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          metadata,
        },
      }
    );

    if (error) throw error;

    return { data: data.integration, error: null };
  } catch (error: unknown) {
    return { data: null, error };
  }
}

/**
 * SECURITY: Retrieve and decrypt OAuth tokens
 * Only use this when you need to make API calls to the integrated service
 * Never expose decrypted tokens to the frontend or log them
 */
export async function getDecryptedTokens(integrationId: string) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "encrypt-integration-token",
      {
        body: {
          action: "decrypt",
          integration_id: integrationId,
        },
      }
    );

    if (error) throw error;

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      error: null,
    };
  } catch (error: unknown) {
    return { accessToken: null, refreshToken: null, expiresAt: null, error };
  }
}

/**
 * SECURITY: List user's integrations WITHOUT exposing tokens
 * This is safe to use for displaying integration status in the UI
 */
export async function listIntegrations() {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .select("id, provider, provider_type, expires_at, created_at, updated_at, metadata")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error: unknown) {
    return { data: null, error };
  }
}
