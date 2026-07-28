// Public marketing-site assistant.
//
// Unauthenticated (verify_jwt = false) and calls a paid API, so every request is
// bounded: prompt/history caps, per-IP rate limit, max_tokens cap, a pre-model
// regex handoff for account/billing/legal, and a deterministic FAQ fallback on
// every failure path — the widget never shows an error state.
//
// Visitor text goes into `messages` ONLY. It is never concatenated into the
// system prompt (prompt-injection boundary).

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  buildSystemPrompt,
  fallbackReply,
  HANDOFF_REPLY,
  needsHandoff,
  toPlainText,
} from "./corpus.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_CHARS = 1000;
const MAX_HISTORY = 8;
const MAX_TOKENS = 400;
const RATE_LIMIT = 12; // requests per window
const WINDOW_MS = 60_000;
// Public widget: fast + cheap. The authenticated in-app assistant uses a larger model.
const DEFAULT_MODEL = "claude-haiku-4-5";

type Turn = { role: "user" | "assistant"; content: string };

// In-memory sliding window. Per-instance — fine at this scale; swap to Upstash
// or a Postgres counter when the site gets real traffic.
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_LIMIT;
}

function sanitizeHistory(raw: unknown): Turn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is Turn =>
        !!m &&
        typeof m === "object" &&
        (m as Turn).role != null &&
        ((m as Turn).role === "user" || (m as Turn).role === "assistant") &&
        typeof (m as Turn).content === "string" &&
        (m as Turn).content.trim().length > 0,
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// Keyword-bucket follow-up chips, generated in CODE (never by the model) so a
// chip can never tee up a question the assistant must refuse.
function suggestions(prompt: string, asked: string[]): string[] {
  const p = prompt.toLowerCase();
  const pool: string[] = [];
  if (/pric|cost|plan|\$/.test(p)) pool.push("Is there a free trial?", "What's included in the Solo plan?");
  else if (/pipeda|casl|fintrac|compli|privacy/.test(p)) pool.push("How does consent tracking work?", "Do you support French?");
  else if (/crea|ddf|mls/.test(p)) pool.push("What's on the roadmap?", "What integrations work today?");
  else if (/switch|migrat|import|boldtrail|follow up|lofty|ixact/.test(p)) pool.push("How long does migration take?", "What does it cost?");
  else pool.push("What does it cost?", "Is there a free trial?", "How do I book a demo?");
  const seen = new Set(asked.map((a) => a.toLowerCase()));
  return pool.filter((s) => !seen.has(s.toLowerCase())).slice(0, 3);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let prompt = "";
  let history: Turn[] = [];

  try {
    const body = await req.json();
    prompt = typeof body?.prompt === "string" ? body.prompt.trim().slice(0, MAX_CHARS) : "";
    history = sanitizeHistory(body?.history);
  } catch {
    return json({ text: fallbackReply(""), source: "error", suggestions: [] });
  }

  if (!prompt) return json({ error: "prompt is required" }, 400);

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(`site-assistant:${ip}`)) {
    return json(
      { text: "You're sending messages a bit fast — give it a moment and try again.", source: "rate_limit", suggestions: [] },
      429,
    );
  }

  const asked = history.filter((m) => m.role === "user").map((m) => m.content);
  const chips = suggestions(prompt, [...asked, prompt]);

  // Pre-model handoff: the model is never called for account/billing/legal.
  if (needsHandoff(prompt)) {
    return json({ text: HANDOFF_REPLY, source: "handoff", suggestions: [] });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    console.error("[site-assistant] ANTHROPIC_API_KEY not configured — serving fallback");
    return json({ text: fallbackReply(prompt), source: "fallback", suggestions: chips });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: Deno.env.get("SITE_ASSISTANT_MODEL") ?? DEFAULT_MODEL,
        max_tokens: MAX_TOKENS,
        system: buildSystemPrompt(),
        // Visitor text lives here ONLY — never in the system prompt.
        messages: [...history, { role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`[site-assistant] Anthropic API ${res.status} — serving fallback`);
      return json({ text: fallbackReply(prompt), source: "fallback", suggestions: chips });
    }

    const data = await res.json();
    const text = toPlainText(
      (data?.content ?? [])
        .filter((b: { type?: string }) => b?.type === "text")
        .map((b: { text?: string }) => b.text ?? "")
        .join("\n")
        .trim(),
    );

    if (!text) {
      return json({ text: fallbackReply(prompt), source: "fallback", suggestions: chips });
    }
    return json({ text, source: "model", suggestions: chips });
  } catch (err) {
    console.error("[site-assistant] request failed:", err instanceof Error ? err.message : String(err));
    return json({ text: fallbackReply(prompt), source: "fallback", suggestions: chips });
  }
};

serve(handler);
