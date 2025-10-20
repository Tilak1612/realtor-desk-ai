import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper function to convert Uint8Array to hex string
function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper function to convert hex string to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g);
  if (!matches) throw new Error('Invalid hex string');
  return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}

// Encrypt data using AES-GCM
async function encrypt(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Generate a random IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Import the key
  const keyBuffer = stringToUint8Array(key.padEnd(32, '0').substring(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer.buffer as ArrayBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Encrypt the data
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBuffer
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Return as hex string
  return uint8ArrayToHex(combined);
}

// Decrypt data using AES-GCM
async function decrypt(encryptedHex: string, key: string): Promise<string> {
  const combined = hexToUint8Array(encryptedHex);
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  
  // Import the key
  const keyBuffer = stringToUint8Array(key.padEnd(32, '0').substring(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer.buffer as ArrayBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encrypted
  );
  
  // Convert back to string
  return new TextDecoder().decode(decrypted);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY not configured');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, integration_id, provider, provider_type, access_token, refresh_token, expires_at, metadata } = await req.json();

    if (action === 'encrypt_and_store') {
      // Encrypt tokens
      const encryptedAccessToken = access_token ? await encrypt(access_token, encryptionKey) : null;
      const encryptedRefreshToken = refresh_token ? await encrypt(refresh_token, encryptionKey) : null;

      // Store in database with encrypted tokens
      const { data, error } = await supabaseClient
        .from('integrations')
        .upsert({
          id: integration_id,
          user_id: user.id,
          provider,
          provider_type,
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          expires_at,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      // Return success WITHOUT the encrypted tokens
      return new Response(
        JSON.stringify({
          success: true,
          integration: {
            id: data.id,
            provider: data.provider,
            provider_type: data.provider_type,
            expires_at: data.expires_at,
            created_at: data.created_at,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'decrypt') {
      // Fetch integration
      const { data, error } = await supabaseClient
        .from('integrations')
        .select('*')
        .eq('id', integration_id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Decrypt tokens
      const decryptedAccessToken = data.access_token ? await decrypt(data.access_token, encryptionKey) : null;
      const decryptedRefreshToken = data.refresh_token ? await decrypt(data.refresh_token, encryptionKey) : null;

      return new Response(
        JSON.stringify({
          access_token: decryptedAccessToken,
          refresh_token: decryptedRefreshToken,
          expires_at: data.expires_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Invalid action. Use "encrypt_and_store" or "decrypt"');
    }
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
