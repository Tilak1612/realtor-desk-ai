import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per IP

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
};

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const sanitizeString = (str: string, maxLength: number): string => {
  return str.trim().substring(0, maxLength);
};

interface HubSpotContactRequest {
  email: string;
  fullName: string;
  phone: string;
  brokerage?: string;
  province: string;
  currentCrm?: string;
  teamSize?: string;
  biggestChallenge?: string;
  comments?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const apiKey = Deno.env.get("HUBSPOT_API_KEY");
    if (!apiKey) {
      throw new Error("HubSpot API key not configured");
    }

    const data: HubSpotContactRequest = await req.json();

    // Validate required fields
    if (!data.email || !isValidEmail(data.email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data.fullName || data.fullName.trim().length < 2 || data.fullName.trim().length > 100) {
      return new Response(
        JSON.stringify({ error: "Full name must be 2-100 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize all inputs
    const email = sanitizeString(data.email, 255);
    const fullName = sanitizeString(data.fullName, 100);
    const phone = data.phone ? sanitizeString(data.phone, 20) : "";
    const brokerage = data.brokerage ? sanitizeString(data.brokerage, 100) : "";
    const province = sanitizeString(data.province, 50);
    const currentCrm = data.currentCrm ? sanitizeString(data.currentCrm, 100) : "";
    const teamSize = data.teamSize ? sanitizeString(data.teamSize, 20) : "";
      const biggestChallenge = data.biggestChallenge ? sanitizeString(data.biggestChallenge, 200) : "";
    const comments = data.comments ? sanitizeString(data.comments, 1000) : "";

    // Split full name into first and last name
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Create or update contact in HubSpot
    const hubspotData = {
      properties: {
        email: email,
        firstname: firstName,
        lastname: lastName,
        phone: phone,
        company: brokerage,
        state: province,
        current_crm: currentCrm,
        team_size: teamSize,
        biggest_challenge: biggestChallenge,
        notes: comments,
        lifecyclestage: "lead",
        lead_source: "Demo Request Form",
      },
    };

    const hubspotResponse = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(hubspotData),
      }
    );

    if (!hubspotResponse.ok) {
      // If contact already exists, try to update it
      if (hubspotResponse.status === 409) {
        // Search for contact by email
        const searchResponse = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              filterGroups: [{
                filters: [{
                  propertyName: "email",
                  operator: "EQ",
                  value: email,
                }],
              }],
            }),
          }
        );

        const searchData = await searchResponse.json();
        if (searchData.results && searchData.results.length > 0) {
          const contactId = searchData.results[0].id;
          
          // Update existing contact
          const updateResponse = await fetch(
            `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
              },
              body: JSON.stringify(hubspotData),
            }
          );

          if (!updateResponse.ok) {
            throw new Error(`Failed to update contact in HubSpot: ${updateResponse.status}`);
          }
          return new Response(
            JSON.stringify({ success: true, action: "updated" }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      throw new Error(`HubSpot API error: ${hubspotResponse.status}`);
    }

    const result = await hubspotResponse.json();

    return new Response(
      JSON.stringify({ success: true, action: "created", contactId: result.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
