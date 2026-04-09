import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[DDF-IMPORT] ${step}${detailsStr}`);
};

// ─── DDF Auth Layer ─────────────────────────────────────────
// Tokens expire after 60 minutes. Cache in-memory per isolate.

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getDdfToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 5-min buffer)
  if (cachedToken && cachedToken.expiresAt > now + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const clientId = Deno.env.get("CREA_DDF_CLIENT_ID");
  const clientSecret = Deno.env.get("CREA_DDF_CLIENT_SECRET");
  const tokenUrl = Deno.env.get("CREA_DDF_TOKEN_URL") || "https://identity.crea.ca/connect/token";

  if (!clientId || !clientSecret) {
    throw new Error("DDF_NOT_CONFIGURED");
  }

  logStep("Requesting DDF token");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "DDFApi_Read",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const body = await res.text();
      logStep("DDF token request failed", { status: res.status, body });
      throw new Error("DDF_AUTH_FAILED");
    }

    const data = await res.json();
    const expiresIn = (data.expires_in || 3600) * 1000; // ms
    cachedToken = {
      token: data.access_token,
      expiresAt: now + expiresIn,
    };

    logStep("DDF token acquired", { expiresIn: data.expires_in });
    return cachedToken.token;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("DDF_TIMEOUT");
    }
    throw err;
  }
}

// ─── DDF Listing Lookup ─────────────────────────────────────

async function fetchListingFromDdf(listingId: string): Promise<Record<string, unknown> | null> {
  const token = await getDdfToken();
  const baseUrl = Deno.env.get("CREA_DDF_API_URL") || "https://ddfapi.realtor.ca/odata/v1";

  // Try by ListingKey first, then by MLS number
  const endpoints = [
    `${baseUrl}/Properties('${listingId}')`,
    `${baseUrl}/Properties?$filter=ListingKey eq '${listingId}' or MlsNumber eq '${listingId}'&$top=1`,
  ];

  for (const url of endpoints) {
    logStep("Fetching from DDF", { url: url.substring(0, 100) });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 404) continue;

      if (!res.ok) {
        logStep("DDF API error", { status: res.status });
        continue;
      }

      const data = await res.json();

      // Single entity response
      if (data && data.ListingKey) return data;

      // Collection response
      if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
        return data.value[0];
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === "AbortError") {
        logStep("DDF request timed out");
        continue;
      }
      logStep("DDF fetch error", { error: err instanceof Error ? err.message : String(err) });
      continue;
    }
  }

  return null;
}

// ─── Field Mapper ───────────────────────────────────────────
// Maps DDF RESO-style fields to RealtorDesk property_listings columns.

interface NormalizedProperty {
  source: string;
  source_listing_id: string | null;
  mls_number: string | null;
  realtor_ca_url: string | null;
  title: string;
  address: string;
  street: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string;
  price: number | null;
  currency: string;
  property_type: string | null;
  listing_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: number | null;
  year_built: number | null;
  description: string | null;
  status: string | null;
  photos_json: string[];
  image_url: string | null;
  raw_source_payload: Record<string, unknown>;
}

function mapDdfToProperty(raw: Record<string, unknown>, inputUrl?: string): NormalizedProperty {
  const str = (v: unknown) => (typeof v === "string" && v.trim()) ? v.trim() : null;
  const num = (v: unknown) => {
    const n = Number(v);
    return isNaN(n) ? null : n;
  };

  const street = str(raw.UnparsedAddress) || str(raw.StreetNumber)
    ? `${str(raw.StreetNumber) || ""} ${str(raw.StreetName) || ""} ${str(raw.StreetSuffix) || ""}`.trim() || null
    : null;

  const city = str(raw.City) || str(raw.CityRegion) || null;
  const province = str(raw.StateOrProvince) || str(raw.Province) || null;
  const postalCode = str(raw.PostalCode) || null;
  const fullAddress = [street, city, province, postalCode].filter(Boolean).join(", ");

  // Photos
  const photos: string[] = [];
  if (raw.Media && Array.isArray(raw.Media)) {
    for (const m of raw.Media) {
      const mediaUrl = (m as Record<string, unknown>)?.MediaURL;
      if (typeof mediaUrl === "string") photos.push(mediaUrl);
    }
  }
  if (raw.Photo && Array.isArray(raw.Photo)) {
    for (const p of raw.Photo) {
      if (typeof p === "string") photos.push(p);
      else if (typeof (p as Record<string, unknown>)?.HighResPath === "string") {
        photos.push((p as Record<string, unknown>).HighResPath as string);
      }
    }
  }

  // Map property type
  const rawType = str(raw.PropertyType) || str(raw.PropertySubType) || null;
  let propertyType = rawType;
  if (rawType) {
    const lower = rawType.toLowerCase();
    if (lower.includes("detach")) propertyType = "house";
    else if (lower.includes("condo") || lower.includes("apartment")) propertyType = "condo";
    else if (lower.includes("town")) propertyType = "townhouse";
    else if (lower.includes("land") || lower.includes("vacant")) propertyType = "land";
    else if (lower.includes("commercial")) propertyType = "commercial";
  }

  // Map status
  const rawStatus = str(raw.StandardStatus) || str(raw.MlsStatus) || null;
  let status = "active";
  if (rawStatus) {
    const lower = rawStatus.toLowerCase();
    if (lower.includes("sold") || lower.includes("closed")) status = "sold";
    else if (lower.includes("pending")) status = "pending";
    else if (lower.includes("coming")) status = "coming_soon";
    else if (lower.includes("cancel") || lower.includes("expired") || lower.includes("withdrawn")) status = "off_market";
  }

  return {
    source: "crea_ddf",
    source_listing_id: str(raw.ListingKey) || str(raw.ListingId) || null,
    mls_number: str(raw.MlsNumber) || str(raw.ListingId) || null,
    realtor_ca_url: inputUrl || null,
    title: fullAddress || str(raw.PublicRemarks)?.substring(0, 80) || "Imported Listing",
    address: fullAddress,
    street,
    city,
    province,
    postal_code: postalCode,
    country: str(raw.Country) || "CA",
    price: num(raw.ListPrice) || num(raw.Price) || null,
    currency: str(raw.CurrencyCode) || "CAD",
    property_type: propertyType,
    listing_type: str(raw.TransactionType)?.toLowerCase().includes("lease") ? "lease" : "sale",
    bedrooms: num(raw.BedroomsTotal) || num(raw.Bedrooms) || null,
    bathrooms: num(raw.BathroomsTotalInteger) || num(raw.Bathrooms) || null,
    square_feet: num(raw.LivingArea) || num(raw.BuildingAreaTotal) || null,
    lot_size: num(raw.LotSizeArea) || num(raw.LotSize) || null,
    year_built: num(raw.YearBuilt) || null,
    description: str(raw.PublicRemarks) || str(raw.Description) || null,
    status,
    photos_json: photos,
    image_url: photos[0] || null,
    raw_source_payload: raw,
  };
}

// ─── Input Parser ───────────────────────────────────────────

function parseInput(input: string): { type: "url" | "mls"; value: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Realtor.ca URL — extract listing ID from path
  const realtorMatch = trimmed.match(/realtor\.ca\/real-estate\/(\d+)/i);
  if (realtorMatch) {
    return { type: "url", value: realtorMatch[1] };
  }

  // Any URL with realtor.ca
  if (trimmed.includes("realtor.ca")) {
    // Try to extract any numeric ID
    const numMatch = trimmed.match(/\/(\d{6,})/);
    if (numMatch) return { type: "url", value: numMatch[1] };
  }

  // MLS number pattern (letter(s) + digits, e.g. E1234567, C123456)
  const mlsMatch = trimmed.match(/^[A-Z]{0,3}\d{5,10}$/i);
  if (mlsMatch) {
    return { type: "mls", value: trimmed.toUpperCase() };
  }

  // Pure numeric (listing ID)
  if (/^\d{5,}$/.test(trimmed)) {
    return { type: "mls", value: trimmed };
  }

  return null;
}

// ─── Main Handler ───────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "unauthorized", message: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "unauthorized", message: "Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Authenticated", { userId: user.id });

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "invalid_input", message: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { input, mode = "preview" } = body;

    if (!input || typeof input !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "invalid_input", message: "Please enter a Realtor.ca URL or MLS number." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse input
    const parsed = parseInput(input);
    if (!parsed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "invalid_input",
          message: "We couldn't recognize that input. Please enter a Realtor.ca listing URL or MLS number (e.g. E1234567).",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Input parsed", { type: parsed.type, value: parsed.value });

    // Fetch from DDF
    let rawListing: Record<string, unknown> | null = null;
    try {
      rawListing = await fetchListingFromDdf(parsed.value);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);

      if (errMsg === "DDF_NOT_CONFIGURED") {
        logStep("DDF credentials not configured");
        return new Response(
          JSON.stringify({
            success: false,
            error: "ddf_not_configured",
            message: "CREA DDF integration is being set up. You can still add properties manually.",
          }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (errMsg === "DDF_AUTH_FAILED") {
        logStep("DDF auth failed");
        return new Response(
          JSON.stringify({
            success: false,
            error: "ddf_auth_failed",
            message: "We couldn't connect to the listing service right now. Please try again later or add the property manually.",
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (errMsg === "DDF_TIMEOUT") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "ddf_timeout",
            message: "The listing service took too long to respond. Please try again or add the property manually.",
          }),
          { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw err;
    }

    if (!rawListing) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "not_found",
          message: "We couldn't find that listing. Please check the URL or MLS number and try again.",
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map fields
    const inputUrl = parsed.type === "url"
      ? input.trim()
      : undefined;
    const property = mapDdfToProperty(rawListing, inputUrl);

    logStep("Listing mapped", { mls: property.mls_number, address: property.address });

    // Preview mode
    if (mode === "preview") {
      return new Response(
        JSON.stringify({ success: true, mode: "preview", property }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save mode
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check for duplicate
    if (property.source_listing_id) {
      const { data: existing } = await supabase
        .from("property_listings")
        .select("id, title, address, mls_number")
        .eq("user_id", user.id)
        .eq("source", "crea_ddf")
        .eq("source_listing_id", property.source_listing_id)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({
            success: true,
            mode: "save",
            duplicate: true,
            message: "This property is already in your account.",
            property: existing,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Insert
    const { data: saved, error: insertError } = await supabase
      .from("property_listings")
      .insert({
        user_id: user.id,
        source: property.source,
        source_listing_id: property.source_listing_id,
        mls_number: property.mls_number,
        realtor_ca_url: property.realtor_ca_url,
        title: property.title,
        address: property.address,
        street: property.street,
        city: property.city,
        province: property.province,
        postal_code: property.postal_code,
        country: property.country,
        price: property.price,
        currency: property.currency,
        property_type: property.property_type,
        listing_type: property.listing_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_feet: property.square_feet,
        lot_size: property.lot_size,
        year_built: property.year_built,
        description: property.description,
        status: property.status,
        image_url: property.image_url,
        photos_json: property.photos_json,
        raw_source_payload: property.raw_source_payload,
        data_source: "crea_ddf",
      })
      .select()
      .single();

    if (insertError) {
      logStep("Insert failed", { error: insertError.message });
      // Unique constraint violation = duplicate
      if (insertError.code === "23505") {
        return new Response(
          JSON.stringify({
            success: true,
            mode: "save",
            duplicate: true,
            message: "This property is already in your account.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw insertError;
    }

    logStep("Property saved", { id: saved.id });

    return new Response(
      JSON.stringify({ success: true, mode: "save", property: saved }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[DDF-IMPORT] Error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({
        success: false,
        error: "internal",
        message: "Something went wrong. You can still add the property manually.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
