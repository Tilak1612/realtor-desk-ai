import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface AutomationStep {
  id: string;
  step_order: number;
  action_type: string;
  action_config: {
    subject?: string;
    body?: string;
    delay_days?: number;
    tag_name?: string;
    task_title?: string;
    sms_message?: string;
  };
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  tags: string[] | null;
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

    const body = await req.json();
    const { automationId, contactId, action } = body;

    if (!automationId || !contactId) {
      return new Response(
        JSON.stringify({ error: "automationId and contactId are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify automation belongs to user
    const { data: automation, error: automationError } = await supabase
      .from("email_automations")
      .select("*")
      .eq("id", automationId)
      .eq("user_id", user.id)
      .single();

    if (automationError || !automation) {
      console.error("Automation not found:", automationError?.message);
      return new Response(
        JSON.stringify({ error: "Automation not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

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

    // Get automation steps
    const { data: steps, error: stepsError } = await supabase
      .from("automation_steps")
      .select("*")
      .eq("automation_id", automationId)
      .order("step_order", { ascending: true });

    if (stepsError) {
      console.error("Error fetching steps:", stepsError.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch automation steps" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "enroll") {
      // Enroll contact in automation
      const { data: enrollment, error: enrollError } = await supabase
        .from("automation_enrollments")
        .insert({
          automation_id: automationId,
          contact_id: contactId,
          current_step: 0,
          status: "active",
          next_action_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (enrollError) {
        console.error("Error enrolling contact:", enrollError.message);
        return new Response(
          JSON.stringify({ error: "Failed to enroll contact" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Contact enrolled in automation:", enrollment.id);

      return new Response(
        JSON.stringify({ success: true, enrollmentId: enrollment.id, message: "Contact enrolled" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "execute_step") {
      const { enrollmentId, stepIndex } = body;

      if (stepIndex === undefined || !enrollmentId) {
        return new Response(
          JSON.stringify({ error: "enrollmentId and stepIndex are required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const step = steps[stepIndex] as AutomationStep;
      if (!step) {
        // No more steps, mark as completed
        await supabase
          .from("automation_enrollments")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", enrollmentId);

        return new Response(
          JSON.stringify({ success: true, message: "Automation completed" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      let executionStatus = "success";
      let errorMessage = null;

      try {
        switch (step.action_type) {
          case "send_email": {
            const subject = replaceVariables(step.action_config.subject || "No Subject", contact);
            const bodyHtml = replaceVariables(step.action_config.body || "", contact)
              .split("\n")
              .map(line => `<p>${line}</p>`)
              .join("");

            const emailResult = await resend.emails.send({
              from: "Realtor Desk <noreply@resend.dev>",
              to: [contact.email],
              subject,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  ${bodyHtml}
                </div>
              `,
            });

            console.log("Email sent:", emailResult);
            break;
          }

          case "wait": {
            const delayDays = step.action_config.delay_days || 1;
            const nextActionAt = new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000);

            await supabase
              .from("automation_enrollments")
              .update({ 
                current_step: stepIndex + 1,
                next_action_at: nextActionAt.toISOString() 
              })
              .eq("id", enrollmentId);

            console.log(`Wait step: next action at ${nextActionAt.toISOString()}`);
            break;
          }

          case "add_tag": {
            const tagName = step.action_config.tag_name;
            if (tagName) {
              const currentTags = contact.tags || [];
              if (!currentTags.includes(tagName)) {
                await supabase
                  .from("contacts")
                  .update({ tags: [...currentTags, tagName] })
                  .eq("id", contactId);
              }
            }
            console.log("Tag added:", tagName);
            break;
          }

          case "create_task": {
            const taskTitle = replaceVariables(step.action_config.task_title || "Follow up", contact);
            await supabase
              .from("tasks")
              .insert({
                user_id: user.id,
                contact_id: contactId,
                title: taskTitle,
                status: "pending",
                priority: "medium",
                due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              });
            console.log("Task created:", taskTitle);
            break;
          }

          case "send_sms": {
            if (!contact.phone) {
              console.error("Contact has no phone number for SMS");
              throw new Error("Contact has no phone number");
            }

            const smsMessage = replaceVariables(step.action_config.sms_message || "", contact);

            // Get Twilio credentials
            const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
            const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
            const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

            if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
              throw new Error("SMS service not configured");
            }

            // Create SMS record
            const { data: smsRecord } = await supabase
              .from("sms_messages")
              .insert({
                user_id: user.id,
                contact_id: contactId,
                direction: "outbound",
                message: smsMessage,
                to_phone: contact.phone,
                from_phone: twilioPhoneNumber,
                status: "pending",
              })
              .select()
              .single();

            // Send SMS via Twilio
            const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
            const formData = new URLSearchParams();
            formData.append("To", contact.phone);
            formData.append("From", twilioPhoneNumber);
            formData.append("Body", smsMessage);

            const twilioResponse = await fetch(twilioUrl, {
              method: "POST",
              headers: {
                "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: formData,
            });

            const twilioResult = await twilioResponse.json();

            if (!twilioResponse.ok) {
              if (smsRecord) {
                await supabase
                  .from("sms_messages")
                  .update({ status: "failed", error_message: twilioResult.message })
                  .eq("id", smsRecord.id);
              }
              throw new Error(twilioResult.message || "Failed to send SMS");
            }

            if (smsRecord) {
              await supabase
                .from("sms_messages")
                .update({ 
                  status: twilioResult.status || "queued",
                  twilio_sid: twilioResult.sid,
                  sent_at: new Date().toISOString(),
                })
                .eq("id", smsRecord.id);
            }

            console.log("SMS sent:", twilioResult.sid);
            break;
          }
        }
      } catch (error: unknown) {
        console.error("Error executing step:", error);
        executionStatus = "failed";
        errorMessage = error instanceof Error ? error.message : "Unknown error";
      }

      // Log the execution
      await supabase.from("automation_logs").insert({
        automation_id: automationId,
        enrollment_id: enrollmentId,
        step_id: step.id,
        action_type: step.action_type,
        status: executionStatus,
        error_message: errorMessage,
      });

      // Move to next step if not a wait step
      if (step.action_type !== "wait" && executionStatus === "success") {
        await supabase
          .from("automation_enrollments")
          .update({ current_step: stepIndex + 1 })
          .eq("id", enrollmentId);
      }

      return new Response(
        JSON.stringify({ 
          success: executionStatus === "success", 
          message: `Step ${stepIndex + 1} executed`,
          status: executionStatus 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'enroll' or 'execute_step'" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in run-automation function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
