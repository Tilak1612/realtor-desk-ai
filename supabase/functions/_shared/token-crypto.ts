// AES-256-GCM helpers for integration credentials.
//
// Lifted verbatim (same algorithm, same key derivation, same hex wire format)
// out of encrypt-integration-token so sync-health-check can read the tokens it
// is supposed to be validating. Previously the crypto lived only inside that
// one function, which is the stated reason pingToolApi was a `return true`
// stub -- "we can't decrypt here without the encryption key in a portable way".
//
// Wire format: hex( iv[12] || ciphertext )
// Key: first 32 bytes of ENCRYPTION_KEY, as raw bytes.

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToUint8Array(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

async function importKey(key: string, usage: "encrypt" | "decrypt"): Promise<CryptoKey> {
  const keyBuffer = stringToUint8Array(key.substring(0, 32));
  return await crypto.subtle.importKey(
    "raw",
    keyBuffer.buffer as ArrayBuffer,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

export async function encryptToken(data: string, key: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await importKey(key, "encrypt");
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    stringToUint8Array(data)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return uint8ArrayToHex(combined);
}

export async function decryptToken(encryptedHex: string, key: string): Promise<string> {
  const combined = hexToUint8Array(encryptedHex);
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  const cryptoKey = await importKey(key, "decrypt");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, encrypted);
  return new TextDecoder().decode(decrypted);
}

/** Hex-only, even length, and long enough to hold a 12-byte IV plus a tag. */
export function looksEncrypted(value: string): boolean {
  return /^[0-9a-f]+$/i.test(value) && value.length > 32 && value.length % 2 === 0;
}

/**
 * Read a credentials blob that may be either AES-GCM hex or -- for rows written
 * while encrypt-integration-token was undeployed -- cleartext JSON.
 *
 * Returns null when the value cannot be interpreted, so callers can report
 * "unknown" instead of assuming health.
 */
export async function readCredentials(
  stored: string | null,
  key: string | undefined
): Promise<Record<string, unknown> | null> {
  if (!stored) return null;

  if (key && looksEncrypted(stored)) {
    try {
      return JSON.parse(await decryptToken(stored, key));
    } catch {
      return null;
    }
  }

  // Legacy cleartext fallback. These rows exist because
  // oauth-integration-callback's `|| credentialsJson` path wrote raw tokens
  // whenever the encrypt function was unavailable.
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
