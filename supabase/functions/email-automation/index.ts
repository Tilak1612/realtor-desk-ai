import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailCampaign {
  contactId: string;
  type: "welcome" | "nurture" | "follow_up" | "property_alert";
  delay?: number; // Days to delay
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactId, type, delay = 0 }: EmailCampaign = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get contact details
    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", contactId)
      .single();

    if (contactError || !contact) {
      throw new Error("Contact not found");
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
    if (delay > 0) {
      // Log scheduled email
      await supabase.from("scheduled_emails").insert({
        contact_id: contactId,
        type,
        scheduled_for: new Date(Date.now() + delay * 24 * 60 * 60 * 1000).toISOString(),
        status: "scheduled",
      });

      return new Response(
        JSON.stringify({ success: true, message: "Email scheduled", delay }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email immediately using Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Realtor Desk AI <onboarding@resend.dev>",
        to: [contact.email],
        subject: template.subject,
        html: template.html,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend API error: ${errorText}`);
    }

    const emailData = await resendResponse.json();

    // Log sent email
    await supabase.from("email_log").insert({
      contact_id: contactId,
      type,
      sent_at: new Date().toISOString(),
      status: "sent",
    });

    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, action: "sent", emailId: emailData.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in email-automation function:", error);
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
