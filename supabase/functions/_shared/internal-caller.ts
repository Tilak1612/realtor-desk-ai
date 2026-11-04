// Is this request from another RealtorDesk edge function, made with the
// project's service-role key (supabaseAdmin.functions.invoke)? No imports, so
// vitest can load it as well as Deno.
//
// The gateway's verify_jwt accepts any valid project JWT, including the public
// anon key and every signed-in user's token, so it does not establish this.
// Uses only the SUPABASE_SERVICE_ROLE_KEY the function already has: no new
// credential or grant.

function timingSafeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

export function isServiceRoleCaller(headers: Headers, serviceRoleKey: string | null | undefined): boolean {
  if (!serviceRoleKey) return false;
  const bearer = (headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const apikey = (headers.get("apikey") ?? "").trim();
  return (bearer !== "" && timingSafeEqual(bearer, serviceRoleKey)) || (apikey !== "" && timingSafeEqual(apikey, serviceRoleKey));
}
