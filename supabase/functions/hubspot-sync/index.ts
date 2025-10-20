import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const apiKey = Deno.env.get("HUBSPOT_API_KEY");
    if (!apiKey) {
      console.error("HUBSPOT_API_KEY not configured");
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
    
    console.log("Syncing validated contact to HubSpot:", email);

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
        console.log("Contact exists, attempting to update");
        
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
            const updateError = await updateResponse.text();
            console.error("HubSpot update error:", updateError);
            throw new Error(`Failed to update contact in HubSpot: ${updateResponse.status}`);
          }

          console.log("Successfully updated contact in HubSpot");
          return new Response(
            JSON.stringify({ success: true, action: "updated" }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      const errorText = await hubspotResponse.text();
      console.error("HubSpot API error:", errorText);
      throw new Error(`HubSpot API error: ${hubspotResponse.status}`);
    }

    const result = await hubspotResponse.json();
    console.log("Successfully created contact in HubSpot:", result.id);

    return new Response(
      JSON.stringify({ success: true, action: "created", contactId: result.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in hubspot-sync function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
