import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (id: string): boolean => UUID_REGEX.test(id);

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CLAUDE-CHAT] ${step}${detailsStr}`);
};

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
    logStep("Function started");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      console.error("Authentication failed:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

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

    const { messages, conversationId } = body;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate each message
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

    // Validate conversationId if provided
    if (conversationId !== undefined && conversationId !== null) {
      if (typeof conversationId !== "string" || !isValidUUID(conversationId)) {
        return new Response(
          JSON.stringify({ error: "Invalid conversation ID format" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    logStep("Received messages", { messageCount: messages.length, conversationId });

    // Fetch user context
    const { data: contacts } = await supabaseClient
      .from('contacts')
      .select('first_name, last_name, email, ai_score')
      .eq('user_id', user.id)
      .order('ai_score', { ascending: false })
      .limit(5);

    const { data: deals } = await supabaseClient
      .from('deals')
      .select('title, stage, value, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: tasks } = await supabaseClient
      .from('tasks')
      .select('title, status, priority, due_date')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })
      .limit(5);

    const contextSummary = {
      contacts: contacts?.length || 0,
      topContacts: contacts?.map(c => `${c.first_name} ${c.last_name} (Score: ${c.ai_score})`).join(', '),
      activeDeals: deals?.filter(d => d.status === 'active').length || 0,
      pipelineValue: deals?.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 0,
      pendingTasks: tasks?.length || 0,
      upcomingTasks: tasks?.map(t => `${t.title} (${t.due_date})`).join(', ')
    };

    const systemPrompt = `You are an AI assistant for real estate agents using Realtor Desk AI CRM.

You help with:
- Answering questions about their contacts and deals
- Creating and managing tasks
- Providing real estate market insights
- Writing email templates
- Scheduling follow-ups
- Analyzing pipeline and performance

Current user context:
- Total contacts: ${contextSummary.contacts}
- Top contacts: ${contextSummary.topContacts || 'None yet'}
- Active deals: ${contextSummary.activeDeals}
- Pipeline value: $${contextSummary.pipelineValue.toLocaleString()}
- Pending tasks: ${contextSummary.pendingTasks}
- Upcoming tasks: ${contextSummary.upcomingTasks || 'None'}

Be helpful, professional, and real-estate focused. Provide actionable advice and always consider the user's current CRM data in your responses.`;

    logStep("Calling Lovable AI (Gemini)");

    // 30-second timeout to prevent runaway requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${lovableApiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ],
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        logStep("AI request timed out");
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
      const errorText = await response.text();
      logStep("AI API error", { status: response.status });
      
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
      console.error("AI API error details:", errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    logStep("AI response received");

    // Save conversation
    if (conversationId) {
      const { data: conversation } = await supabaseClient
        .from('ai_conversations')
        .select('messages')
        .eq('id', conversationId)
        .eq('user_id', user.id) // Verify ownership
        .single();

      if (conversation) {
        const updatedMessages = [
          ...(conversation?.messages || []),
          ...messages,
          { role: 'assistant', content: assistantMessage }
        ];

        await supabaseClient
          .from('ai_conversations')
          .update({ 
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId)
          .eq('user_id', user.id);
      }
    } else {
      // Create new conversation
      const title = messages[0]?.content?.substring(0, 50) || 'New Chat';
      await supabaseClient
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title,
          messages: [...messages, { role: 'assistant', content: assistantMessage }]
        });
    }

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Log full error details server-side only
    console.error("[CLAUDE-CHAT] ERROR:", {
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
