import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendSmsRequest {
  contactId: string;
  message: string;
  templateId?: string;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
}

// Replace template variables in text
const replaceVariables = (text: string, contact: Contact): string => {
  return text
    .replace(/\{\{first_name\}\}/g, contact.first_name || "")
    .replace(/\{\{last_name\}\}/g, contact.last_name || "")
    .replace(/\{\{email\}\}/g, contact.email || "")
    .replace(/\{\{full_name\}\}/g, `${contact.first_name} ${contact.last_name || ""}`.trim());
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: SendSmsRequest = await req.json();
    const { contactId, message, templateId } = body;

    if (!contactId || !message) {
      return new Response(
        JSON.stringify({ error: "contactId and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get contact
    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", contactId)
      .eq("user_id", user.id)
      .single();

    if (contactError || !contact) {
      console.error("Contact not found:", contactError?.message);
      return new Response(
        JSON.stringify({ error: "Contact not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!contact.phone) {
      return new Response(
        JSON.stringify({ error: "Contact has no phone number" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check SMS consent
    const { data: consent } = await supabase
      .from("sms_consent")
      .select("*")
      .eq("contact_id", contactId)
      .eq("user_id", user.id)
      .single();

    if (consent && consent.opted_out_at && !consent.opted_in) {
      return new Response(
        JSON.stringify({ error: "Contact has opted out of SMS" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Replace variables in message
    const processedMessage = replaceVariables(message, contact);

    // Get Twilio credentials
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error("Twilio credentials not configured");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create SMS record first
    const { data: smsRecord, error: smsInsertError } = await supabase
      .from("sms_messages")
      .insert({
        user_id: user.id,
        contact_id: contactId,
        direction: "outbound",
        message: processedMessage,
        to_phone: contact.phone,
        from_phone: twilioPhoneNumber,
        status: "pending",
      })
      .select()
      .single();

    if (smsInsertError) {
      console.error("Error creating SMS record:", smsInsertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to create SMS record" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    const formData = new URLSearchParams();
    formData.append("To", contact.phone);
    formData.append("From", twilioPhoneNumber);
    formData.append("Body", processedMessage);

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const twilioResult = await twilioResponse.json();
    console.log("Twilio response:", twilioResult);

    if (!twilioResponse.ok) {
      // Update SMS record with error
      await supabase
        .from("sms_messages")
        .update({ 
          status: "failed",
          error_message: twilioResult.message || "Failed to send SMS"
        })
        .eq("id", smsRecord.id);

      return new Response(
        JSON.stringify({ error: twilioResult.message || "Failed to send SMS" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update SMS record with success
    await supabase
      .from("sms_messages")
      .update({ 
        status: twilioResult.status || "queued",
        twilio_sid: twilioResult.sid,
        sent_at: new Date().toISOString(),
      })
      .eq("id", smsRecord.id);

    // Update template usage count if using a template
    if (templateId) {
      await supabase
        .from("sms_templates")
        .update({ usage_count: supabase.rpc("increment", { row_id: templateId }) })
        .eq("id", templateId);
    }

    console.log("SMS sent successfully to:", contact.phone);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: smsRecord.id,
        twilioSid: twilioResult.sid,
        status: twilioResult.status 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-sms function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
