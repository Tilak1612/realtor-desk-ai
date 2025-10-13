import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CLAUDE-CHAT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { messages, conversationId } = await req.json();
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

    logStep("Calling Claude API");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("Claude API error", { status: response.status, error: errorText });
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;
    logStep("Claude response received");

    // Save conversation
    if (conversationId) {
      const { data: conversation } = await supabaseClient
        .from('ai_conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();

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
        .eq('id', conversationId);
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});