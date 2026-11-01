import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * The card reads the endpoint's error status and body to choose its message
 * (503 = not configured, body.error "reconnect_required" = reconnect). Those
 * branches are what changed when the thrown error got a real type, so they
 * are pinned here. fetch and Supabase are mocked; nothing leaves the test.
 */

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { getSession: async () => ({ data: { session: { access_token: "synthetic" } } }) } },
}));

type Reply = { status: number; body: unknown };
let replies: Record<string, Reply>;
const calls: string[] = [];

beforeEach(() => {
  calls.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const path = url.split("/").pop()!;
      calls.push(path);
      const r = replies[path] ?? { status: 404, body: {} };
      return { ok: r.status < 400, status: r.status, json: async () => r.body } as Response;
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

const render = async () => {
  const { default: GoogleCalendarCard } = await import("../GoogleCalendarCard");
  renderWithProviders(<GoogleCalendarCard />, { route: "/app/settings" });
};

describe("GoogleCalendarCard error handling", () => {
  it("says the integration is not configured when start answers 503", async () => {
    replies = { status: { status: 200, body: { configured: true, connected: false } }, start: { status: 503, body: { error: "not_configured" } } };
    await render();
    fireEvent.click(await screen.findByRole("button", { name: "Connect Google Calendar" }));
    expect(await screen.findByText("Google Calendar isn't configured yet. Please contact support.")).toBeInTheDocument();
  });

  it("gives the generic start message for any other failure", async () => {
    replies = { status: { status: 200, body: { configured: true, connected: false } }, start: { status: 500, body: {} } };
    await render();
    fireEvent.click(await screen.findByRole("button", { name: "Connect Google Calendar" }));
    expect(await screen.findByText("Couldn't start the Google connection.")).toBeInTheDocument();
  });

  it("asks to reconnect, and re-reads the status, when events says reconnect_required", async () => {
    replies = { status: { status: 200, body: { configured: true, connected: true, email: "maya@example.com" } }, events: { status: 401, body: { error: "reconnect_required" } } };
    await render();
    fireEvent.click(await screen.findByRole("button", { name: "Send test event" }));
    expect(await screen.findByText("Please reconnect Google Calendar.")).toBeInTheDocument();
    await waitFor(() => expect(calls.filter((c) => c === "status")).toHaveLength(2));
  });

  it("gives the generic test-event message for any other failure, without re-reading the status", async () => {
    replies = { status: { status: 200, body: { configured: true, connected: true } }, events: { status: 500, body: { error: "google_error" } } };
    await render();
    fireEvent.click(await screen.findByRole("button", { name: "Send test event" }));
    expect(await screen.findByText("Couldn't create the test event.")).toBeInTheDocument();
    expect(calls.filter((c) => c === "status")).toHaveLength(1);
  });
});
