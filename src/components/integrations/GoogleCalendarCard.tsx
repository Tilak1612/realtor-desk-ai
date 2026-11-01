import { useCallback, useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Status = {
  configured: boolean;
  connected: boolean;
  email?: string | null;
  calendarId?: string | null;
  needsReconnect?: boolean;
};

const BASE = "/api/integrations/google";

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** A non-2xx answer from the endpoint, with its parsed body and HTTP status. */
class CallError extends Error {
  constructor(message: string, readonly body: { error?: string }, readonly status: number) {
    super(message);
  }
}

async function call(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE}/${path}`, {
    credentials: "same-origin",
    ...init,
    headers: { "Content-Type": "application/json", ...(await authHeaders()), ...(init.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new CallError(body.error || `HTTP ${res.status}`, body, res.status);
  return body;
}

const RESULT_MESSAGES: Record<string, string> = {
  denied: "Google access was cancelled.",
  invalid_state: "The connection request expired. Please try again.",
  token_error: "Google could not complete the connection. Please try again.",
  not_configured: "Google Calendar isn't configured yet. Please contact support.",
};

export default function GoogleCalendarCard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await call("status"));
    } catch {
      setStatus({ configured: false, connected: false });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("google");
    const clean = () => {
      params.delete("google");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
    };
    (async () => {
      if (result === "finish") {
        setBusy(true);
        try {
          const r = await call("finalize", { method: "POST" });
          setMessage({ kind: "ok", text: `Google Calendar connected${r.email ? ` as ${r.email}` : ""}.` });
        } catch {
          setMessage({ kind: "error", text: "Couldn't finish connecting Google Calendar. Please try again." });
        } finally {
          setBusy(false);
          clean();
        }
      } else if (result) {
        setMessage({ kind: "error", text: RESULT_MESSAGES[result] || "Google Calendar connection failed." });
        clean();
      }
      await refresh();
    })();
  }, [refresh]);

  const connect = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const { url } = await call("start", { method: "POST" });
      window.location.assign(url);
    } catch (e: unknown) {
      setBusy(false);
      const notConfigured = e instanceof CallError && e.status === 503;
      setMessage({ kind: "error", text: notConfigured ? RESULT_MESSAGES.not_configured : "Couldn't start the Google connection." });
    }
  };

  const disconnect = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await call("disconnect", { method: "POST" });
      setMessage({ kind: "ok", text: "Google Calendar disconnected." });
      await refresh();
    } catch {
      setMessage({ kind: "error", text: "Couldn't disconnect. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const testEvent = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const start = new Date(Date.now() + 60 * 60 * 1000);
      start.setMinutes(0, 0, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      await call("events", {
        method: "POST",
        body: JSON.stringify({
          summary: "Test event",
          description: "Created to confirm the Google Calendar connection works.",
          start: start.toISOString(),
          end: end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      setMessage({ kind: "ok", text: "Test event added to your Google Calendar." });
    } catch (e: unknown) {
      const reconnect = e instanceof CallError && e.body?.error === "reconnect_required";
      if (reconnect) await refresh();
      setMessage({ kind: "error", text: reconnect ? "Please reconnect Google Calendar." : "Couldn't create the test event." });
    } finally {
      setBusy(false);
    }
  };

  const connected = !!status?.connected;

  return (
    <Card id="google-calendar">
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Google Calendar
          {connected && (
            <Badge variant="secondary" className="ml-1 gap-1">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Sync events to a dedicated calendar in your Google account. We can only see and edit the calendar we create. We never touch your other calendars.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === null ? (
          <p role="status" className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Checking connection…
          </p>
        ) : connected ? (
          <p className="text-sm">
            Connected as <span className="font-medium">{status.email || "your Google account"}</span>
          </p>
        ) : status.needsReconnect ? (
          <p className="text-sm text-amber-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Google access expired. Please reconnect.
          </p>
        ) : !status.configured ? (
          <p className="text-sm text-muted-foreground">Google Calendar isn't available yet.</p>
        ) : null}

        {message && (
          <p className={`text-sm ${message.kind === "ok" ? "text-green-600" : "text-destructive"}`} role="status">
            {message.text}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {connected ? (
            <>
              <Button variant="outline" size="sm" onClick={testEvent} disabled={busy}>
                Send test event
              </Button>
              <Button variant="outline" size="sm" onClick={disconnect} disabled={busy}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={connect} disabled={busy || status === null || status?.configured === false}>
              {busy && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />}
              {busy
                ? "Connecting…"
                : status?.needsReconnect
                  ? "Reconnect Google Calendar"
                  : "Connect Google Calendar"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
