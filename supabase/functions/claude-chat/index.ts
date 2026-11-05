// The assistant inside the product (/app/ai-assistant and the chat widget).
//
// Signed-in agents only (verify_jwt = true, and the token is checked again
// below). It reads a short summary of the caller's own CRM, sends it with the
// conversation to the Anthropic Messages API, and returns text. It has no
// tools: it cannot write to the CRM, send or schedule anything.
//
// Contract with the browser, unchanged by the move from the Lovable gateway:
//   in   { messages: [{ role, content }], conversationId?: string | null }
//   out  200 { message }  |  4xx/5xx { error }
//
// Uses the same ANTHROPIC_API_KEY secret as ../site-assistant. What the model
// is told, how the history is shaped and how errors are mapped is in ./chat.ts,
// which has no imports and is unit-tested (src/lib/assistant/__tests__).
//
// Never logged: message content, the CRM summary, the API key. Anthropic
// errors are logged as status + error type + request id only.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import {
  ANTHROPIC_MESSAGES_URL,
  buildAnthropicRequest,
  buildCrmSummary,
  buildSystemPrompt,
  DEFAULT_MODEL,
  isValidMessage,
  mapAnthropicStatus,
  MAX_MESSAGES,
  modelAcceptsDefaultFallback,
  OPEN_DEALS_SUM_LIMIT,
  readReply,
  REFUSAL_MESSAGE,
  TIMEOUT_MS,
  toAnthropicMessages,
  type Turn,
} from "./chat.ts";

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

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isAbort = (e: unknown): boolean => (e as { name?: string } | null)?.name === "AbortError";

// The parts of an Anthropic response (or error body) that are logged here.
// The answer itself is read by readReply in ./chat.ts.
type AnthropicPayload = {
  model?: string;
  stop_reason?: string;
  usage?: { input_tokens?: number; output_tokens?: number };
  error?: { type?: string };
  request_id?: string;
} | null;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // The same secret ../site-assistant reads. Never logged, never returned.
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      console.error("[CLAUDE-CHAT] ANTHROPIC_API_KEY is not configured");
      return json({ error: "Service configuration error" }, 500);
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "No authorization header" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      console.error("Authentication failed:", userError?.message);
      return json({ error: "Unauthorized" }, 401);
    }
    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid request body" }, 400);
    }

    const { messages, conversationId } = body ?? {};

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return json({ error: "Invalid messages format" }, 400);
    }

    // Validate each message
    for (const msg of messages) {
      if (!isValidMessage(msg)) {
        return json({ error: "Invalid message structure" }, 400);
      }
    }

    // conversationId is still accepted (both callers send null) and still has
    // to be a UUID when present, but nothing is done with it: see the note on
    // conversation storage further down.
    if (conversationId !== undefined && conversationId !== null) {
      if (typeof conversationId !== "string" || !isValidUUID(conversationId)) {
        return json({ error: "Invalid conversation ID format" }, 400);
      }
    }

    // System prompt on the server, user/assistant turns only, first and last
    // turn the user's, capped. Nothing a browser sends becomes a system message.
    const turns: Turn[] = toAnthropicMessages(messages);
    if (turns.length === 0) {
      return json({ error: "Invalid messages format" }, 400);
    }

    logStep("Received messages", { messageCount: messages.length, sentCount: turns.length });

    // ---- CRM summary -------------------------------------------------------
    // Service-role client, so every query is scoped to the caller by user_id.
    const [contactCount, topContacts, openDeals, recentDeals, pendingTaskCount, nextTasks] = await Promise.all([
      // FIX (total contacts): this used to be the length of the limit(5) query
      // below, so "Total contacts" could never be more than 5. A count with
      // head: true asks Postgres for the number and returns no rows.
      supabaseClient
        .from('contacts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      // nullsFirst: false, because Postgres sorts NULL first on a descending
      // order: unscored contacts were being listed as the "top" ones.
      supabaseClient
        .from('contacts')
        .select('first_name, last_name, ai_score')
        .eq('user_id', user.id)
        .order('ai_score', { ascending: false, nullsFirst: false })
        .limit(5),
      // FIX (pipeline value): this used to add up `value` on the 5 newest deals
      // whatever their status, so sold and lost deals were counted and a sixth
      // open deal was not. It is now the open deals only, by the definition the
      // Deals page uses (status active, stage not sold or withdrawn). PostgREST
      // aggregates (value.sum()) are off by default on Supabase, so this is a
      // bounded read of one column instead: up to OPEN_DEALS_SUM_LIMIT rows,
      // with the exact count alongside so the summary can say "at least" when
      // an account has more open deals than that. The summary labels the figure
      // as a sum of entered values, not a forecast.
      supabaseClient
        .from('deals')
        .select('value', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'active')
        .neq('stage', 'sold')
        .neq('stage', 'withdrawn')
        .limit(OPEN_DEALS_SUM_LIMIT),
      supabaseClient
        .from('deals')
        .select('title, stage, status, value')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      // Same limit(5) mistake as the contact total: counted separately.
      supabaseClient
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending'),
      supabaseClient
        .from('tasks')
        .select('title, due_date')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5),
    ]);

    // A failed query leaves that line of the summary as "not available"; the
    // assistant can still draft. Code only: an error message can quote a value.
    const failed = Object.entries({ contactCount, topContacts, openDeals, recentDeals, pendingTaskCount, nextTasks })
      .filter(([, r]) => r.error)
      .map(([name, r]) => `${name}:${r.error?.code ?? "error"}`);
    if (failed.length > 0) logStep("CRM summary query failed", { failed });

    const systemPrompt = buildSystemPrompt(
      buildCrmSummary({
        contactCount: contactCount.error ? null : contactCount.count ?? null,
        topContacts: topContacts.data ?? [],
        openDealCount: openDeals.error ? null : openDeals.count ?? null,
        openDealValues: (openDeals.data ?? []).map((d: { value: number | null }) => d.value),
        recentDeals: recentDeals.data ?? [],
        pendingTaskCount: pendingTaskCount.error ? null : pendingTaskCount.count ?? null,
        nextTasks: nextTasks.data ?? [],
      }),
    );

    // ---- Anthropic Messages API --------------------------------------------
    // Optional override, like SITE_ASSISTANT_MODEL in ../site-assistant.
    const model = Deno.env.get("CLAUDE_CHAT_MODEL") ?? DEFAULT_MODEL;
    logStep("Calling Anthropic", { model });

    const callAnthropic = (withFallback: boolean, signal: AbortSignal): Promise<Response> => {
      const request = buildAnthropicRequest({ model, system: systemPrompt, messages: turns, withFallback });
      return fetch(ANTHROPIC_MESSAGES_URL, {
        method: "POST",
        headers: { ...request.headers, "x-api-key": anthropicApiKey },
        body: JSON.stringify(request.body),
        signal,
      });
    };

    // 30-second timeout to prevent runaway requests. It covers the whole
    // exchange: both attempts and reading the response body.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let status: number;
    let payload: AnthropicPayload = null;
    try {
      let response = await callAnthropic(true, controller.signal);

      // The first attempt asks for the server-side refusal fallback, which is
      // a beta. A 400 is what an account without that beta gets (and what a
      // malformed request gets), so try once more without it rather than have
      // the assistant depend on a beta being switched on.
      if (response.status === 400 && modelAcceptsDefaultFallback(model)) {
        await response.body?.cancel();
        logStep("Anthropic returned 400 with the fallback beta, retrying without it");
        response = await callAnthropic(false, controller.signal);
      }

      status = response.status;
      try {
        payload = (await response.json()) as AnthropicPayload;
      } catch (parseError) {
        if (isAbort(parseError)) throw parseError;
        payload = null; // not JSON: handled below as an empty reply or by status
      }
      if (!response.ok) {
        logStep("Anthropic API error", {
          status,
          type: payload?.error?.type,
          requestId: payload?.request_id ?? response.headers.get("request-id"),
        });
      }
    } catch (fetchError) {
      if (isAbort(fetchError)) {
        logStep("AI request timed out");
        return json({ error: "AI request timed out. Please try again." }, 504);
      }
      throw fetchError;
    } finally {
      clearTimeout(timeout);
    }

    if (status < 200 || status >= 300) {
      const mapped = mapAnthropicStatus(status);
      return json({ error: mapped.error }, mapped.status);
    }

    logStep("AI response received", {
      model: payload?.model,
      stopReason: payload?.stop_reason,
      inputTokens: payload?.usage?.input_tokens,
      outputTokens: payload?.usage?.output_tokens,
    });

    const reply = readReply(payload);

    // FIX (conversation storage): REMOVED. This function used to finish by
    // writing the exchange to `ai_conversations`. Two things were wrong with
    // it. It never returned a conversation id, so the page always sent null and
    // every turn inserted a new row holding the whole history so far. And the
    // table does not exist in production (it is only in an archived migration),
    // so every one of those inserts failed, silently, because the result was
    // never checked. Nothing has ever been stored. Rather than keep code that
    // writes to a table that is not there, the persistence is gone: the
    // conversation lives in the page's memory and ends when the page is left or
    // "Clear Chat" is pressed, which is what was already happening. Bringing
    // saved conversations back means a migration (table + RLS), returning the
    // id from here, and saying so in the privacy wording.

    if (reply.kind === "refusal") {
      // Declined by a safety classifier, on the requested model and on the
      // fallback. An answer, not an error: asking again would be declined again.
      return json({ message: REFUSAL_MESSAGE });
    }
    if (reply.kind === "empty") {
      return json({ error: "AI service temporarily unavailable" }, 500);
    }
    if (reply.truncated) logStep("AI response hit max_tokens");

    return json({ message: reply.text });
  } catch (error) {
    // Log full error details server-side only
    console.error("[CLAUDE-CHAT] ERROR:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return generic error message to client
    return json({ error: "An error occurred processing your request" }, 500);
  }
});
