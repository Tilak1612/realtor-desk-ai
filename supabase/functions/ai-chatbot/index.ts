import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (id: string): boolean => UUID_REGEX.test(id);

// Validate message structure
const isValidMessage = (msg: unknown): msg is { role: string; content: string } => {
  if (typeof msg !== "object" || msg === null) return false;
  const m = msg as Record<string, unknown>;
  return (
    typeof m.role === "string" &&
    ["user", "assistant", "system"].includes(m.role) &&
    typeof m.content === "string" &&
    m.content.length <= 50000 // Max 50k chars per message
  );
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ============ AUTHENTICATION CHECK ============
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    // ============ END AUTHENTICATION CHECK ============

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { messages, contactId } = body;

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    for (const msg of messages) {
      if (!isValidMessage(msg)) {
        return new Response(
          JSON.stringify({ error: "Invalid message structure" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Validate contactId if provided
    if (contactId !== undefined && contactId !== null) {
      if (typeof contactId !== "string" || !isValidUUID(contactId)) {
        return new Response(
          JSON.stringify({ error: "Invalid contact ID format" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role for data access
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get contact context if contactId provided - verify ownership
    let contactContext = "";
    if (contactId) {
      const { data: contact } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", contactId)
        .eq("user_id", user.id) // Only allow access to user's own contacts
        .single();
      
      if (contact) {
        contactContext = `Contact Info: ${contact.first_name} ${contact.last_name}, Email: ${contact.email}, Phone: ${contact.phone || "N/A"}, Tags: ${contact.tags?.join(", ") || "None"}`;
      }
    }

    const systemPrompt = `You are a helpful AI assistant for Realtor Desk AI, a CRM platform designed specifically for Canadian real estate agents. You help realtors with:

- Managing contacts and leads
- Scheduling showings and appointments
- Answering questions about properties
- Providing market insights for Canadian real estate
- Automating follow-ups and communications

Be professional, friendly, and concise. Focus on helping Canadian realtors succeed.

${contactContext ? `Current Contact Context: ${contactContext}` : ""}`;

    // 30-second timeout to prevent runaway requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({ error: "AI request timed out. Please try again." }),
          { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw fetchError;
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    // Log full error details server-side only
    console.error("AI chatbot error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return generic error message to client
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
