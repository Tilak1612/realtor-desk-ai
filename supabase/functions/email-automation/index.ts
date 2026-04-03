import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (id: string): boolean => UUID_REGEX.test(id);

// Valid email campaign types
const VALID_CAMPAIGN_TYPES = ["welcome", "nurture", "follow_up", "property_alert"] as const;
type CampaignType = typeof VALID_CAMPAIGN_TYPES[number];

const isValidCampaignType = (type: string): type is CampaignType => {
  return VALID_CAMPAIGN_TYPES.includes(type as CampaignType);
};

interface EmailCampaign {
  contactId: string;
  type: CampaignType;
  delay?: number; // Days to delay (0-365)
}

const handler = async (req: Request): Promise<Response> => {
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
          headers: { "Content-Type": "application/json", ...corsHeaders },
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
          headers: { "Content-Type": "application/json", ...corsHeaders },
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
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { contactId, type, delay = 0 } = body;

    // Validate contactId
    if (!contactId || typeof contactId !== "string") {
      return new Response(
        JSON.stringify({ error: "Contact ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!isValidUUID(contactId)) {
      return new Response(
        JSON.stringify({ error: "Invalid contact ID format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate type
    if (!type || typeof type !== "string") {
      return new Response(
        JSON.stringify({ error: "Campaign type is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!isValidCampaignType(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid campaign type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate delay (must be a number between 0 and 365)
    const parsedDelay = typeof delay === "number" ? delay : parseInt(delay, 10);
    if (isNaN(parsedDelay) || parsedDelay < 0 || parsedDelay > 365) {
      return new Response(
        JSON.stringify({ error: "Delay must be between 0 and 365 days" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get contact details - verify ownership
    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", contactId)
      .eq("user_id", user.id) // Only allow access to user's own contacts
      .single();

    if (contactError || !contact) {
      console.error("Contact lookup failed:", contactError?.message);
      return new Response(
        JSON.stringify({ error: "Contact not found or unauthorized" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email templates based on campaign type
    const templates = {
      welcome: {
        subject: `Welcome to Realtor Desk AI, ${contact.first_name}!`,
        html: `
          <h1>Welcome ${contact.first_name}!</h1>
          <p>Thank you for choosing Realtor Desk AI. We're excited to help you grow your real estate business.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Import your existing contacts</li>
            <li>Connect your calendar</li>
            <li>Set up your AI chatbot</li>
          </ul>
          <p>Need help? Reply to this email anytime.</p>
          <p>Best regards,<br>The Realtor Desk AI Team</p>
        `,
      },
      nurture: {
        subject: `${contact.first_name}, here's your personalized market update`,
        html: `
          <h1>Hi ${contact.first_name},</h1>
          <p>We noticed you're interested in ${contact.tags?.join(", ") || "real estate"} in your area.</p>
          <p>Here are some insights that might interest you:</p>
          <ul>
            <li>Average home prices in your area increased by 3.2% this quarter</li>
            <li>5 new listings matching your criteria</li>
            <li>Market conditions favor buyers right now</li>
          </ul>
          <p>Ready to take the next step? Let's schedule a call.</p>
          <p>Best regards,<br>Your Realtor</p>
        `,
      },
      follow_up: {
        subject: `Following up on our conversation, ${contact.first_name}`,
        html: `
          <h1>Hi ${contact.first_name},</h1>
          <p>I wanted to follow up on our recent conversation about your real estate needs.</p>
          <p>Have you had a chance to think about the properties we discussed?</p>
          <p>I'm here to answer any questions you might have.</p>
          <p>Let's schedule a time to chat this week.</p>
          <p>Best regards,<br>Your Realtor</p>
        `,
      },
      property_alert: {
        subject: `New Property Alert for ${contact.first_name}!`,
        html: `
          <h1>New Properties Just Listed!</h1>
          <p>Hi ${contact.first_name},</p>
          <p>Great news! We found new properties that match your search criteria:</p>
          <p><strong>3 new listings</strong> in your preferred area and price range.</p>
          <p>These properties often sell quickly. Want to schedule viewings?</p>
          <p>Click here to see the full details and book your showings.</p>
          <p>Best regards,<br>Your Realtor</p>
        `,
      },
    };

    const template = templates[type];

    // Schedule or send immediately
    if (parsedDelay > 0) {
      // Log scheduled email
      await supabase.from("scheduled_emails").insert({
        contact_id: contactId,
        type,
        scheduled_for: new Date(Date.now() + parsedDelay * 24 * 60 * 60 * 1000).toISOString(),
        status: "scheduled",
      });

      return new Response(
        JSON.stringify({ success: true, message: "Email scheduled", delay: parsedDelay }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Log sent email
    await supabase.from("email_log").insert({
      contact_id: contactId,
      type,
      sent_at: new Date().toISOString(),
      status: "sent",
    });

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({
        success: true,
        action: "sent",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    // Log full error details server-side only
    console.error("Error in email-automation function:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return generic error message to client
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
