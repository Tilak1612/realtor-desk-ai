import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

// Public marketing-site assistant widget. Answers are rendered as PLAIN TEXT
// (whitespace-pre-line) — the endpoint strips markdown, so no parser is needed.
// Follow-up chips come from the server and are generated in code, never by the
// model, so a chip can't tee up a question the assistant must refuse.

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/site-assistant`;
const MAX_HISTORY = 8;

type Turn = { role: "user" | "assistant"; content: string };

const SiteAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [chips, setChips] = useState<string[]>([
    "What does it cost?",
    "Is there a free trial?",
    "Do you support French?",
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, busy]);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || busy) return;
    setInput("");
    setBusy(true);
    const next = [...turns, { role: "user" as const, content: prompt }];
    setTurns(next);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
        },
        body: JSON.stringify({ prompt, history: next.slice(-MAX_HISTORY) }),
      });
      const data = await res.json();
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          content:
            data?.text ??
            "I couldn't reach the assistant just now — our team can help at https://www.realtordesk.ai/contact",
        },
      ]);
      if (Array.isArray(data?.suggestions)) setChips(data.suggestions);
    } catch {
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          content:
            "I couldn't reach the assistant just now — our team can help at https://www.realtordesk.ai/contact",
        },
      ]);
      setChips([]);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Ask Desk AI about Realtor Desk"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Ask Desk AI"
      className="fixed bottom-5 right-5 z-40 flex h-[32rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Ask Desk AI</p>
          <p className="text-xs text-muted-foreground">About Realtor Desk</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close assistant"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {turns.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Hi — I can answer questions about Realtor Desk: pricing, features, the free trial, and
            how it supports Canadian compliance. What would you like to know?
          </p>
        )}
        {turns.map((t, i) => (
          <div
            key={i}
            className={
              t.role === "user"
                ? "ml-auto max-w-[85%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "mr-auto max-w-[90%] whitespace-pre-line rounded-xl bg-muted px-3 py-2 text-sm text-foreground"
            }
          >
            {t.content}
          </div>
        ))}
        {busy && <p className="text-xs text-muted-foreground">Thinking…</p>}
        <div ref={endRef} />
      </div>

      {chips.length > 0 && !busy && (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border px-3 py-2"
      >
        <label htmlFor="site-assistant-input" className="sr-only">
          Ask a question about Realtor Desk
        </label>
        <input
          id="site-assistant-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder="Ask about pricing, features…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send message"
          className="rounded-md p-1.5 text-primary disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <p className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
        AI answers can be imperfect —{" "}
        <a href="/contact" className="underline hover:text-primary">
          talk to our team
        </a>{" "}
        anytime.
      </p>
    </div>
  );
};

export default SiteAssistant;
