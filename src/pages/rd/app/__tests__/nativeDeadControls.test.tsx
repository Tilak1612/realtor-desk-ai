import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, act, fireEvent, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/render";

/**
 * Controls that do nothing.
 *
 * Several buttons in /app are drawn but have no handler: Call, Book showing
 * and Take over on a conversation and on a lead; "Draft with AI", "Attach
 * listing" and "Template" under the lead composer; and a Forecast tab that
 * only says it is not available yet. A store reviewer taps every button, and a
 * touch screen gives no hover hint that one is inert, so the iOS / Android app
 * leaves them out. The website is not changed by this: each test renders the
 * same screen both ways.
 */

const h = vi.hoisted(() => ({ native: true }));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));

vi.mock("@/integrations/supabase/client", () => {
  const result = { data: [], error: null, count: 0 };
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  for (const k of ["select", "eq", "neq", "in", "is", "gte", "lte", "order", "limit", "range", "match", "not", "or", "filter", "insert", "update"]) {
    chain[k] = self;
  }
  chain.single = async () => ({ data: null, error: null });
  chain.maybeSingle = async () => ({ data: null, error: null });
  chain.then = (resolve: (v: typeof result) => unknown) => Promise.resolve(result).then(resolve);
  return {
    supabase: {
      from: () => chain,
      rpc: async () => ({ data: null, error: null }),
      functions: { invoke: async () => ({ data: null, error: null }) },
      channel: () => ({ on: () => ({ subscribe: () => ({}) }), subscribe: () => ({}) }),
      removeChannel: () => {},
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    },
  };
});

const LEAD = {
  id: "l1", name: "Sarah Mitchell", email: "sarah@example.com", phone: "+1 (780) 555-0110",
  language: "EN", source: "Website", listing: "1200 Jasper Ave NW", city: "Edmonton",
  stage: "showing", score: 94, lastActivity: "1h ago", aiHandling: false,
  nextFollowupDate: null, assignedAgentId: null,
};

vi.mock("@/hooks/rd/useLeads", () => ({
  useLeads: () => ({ loading: false, error: null, leads: [LEAD] }),
  useLead: () => ({ loading: false, error: null, lead: LEAD }),
}));

beforeEach(async () => {
  h.native = true;
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

async function openInboxThread() {
  const { default: Inbox } = await import("@/pages/rd/app/Inbox");
  renderWithProviders(<Inbox />, { route: "/app/inbox" });
  await act(async () => fireEvent.click(screen.getByRole("button", { name: /Sarah Mitchell/ })));
  return document.getElementById("inbox-thread")!;
}

describe("the conversation header", () => {
  it("has no Call, Book showing or Take over in the app", async () => {
    const thread = await openInboxThread();
    expect(thread.querySelector('[aria-label="Call"]')).toBeNull();
    expect(thread.querySelector('[aria-label="Book showing"]')).toBeNull();
    expect(thread.textContent ?? "").not.toContain("Take over");
    // The thread itself is still there and still usable.
    expect(thread.textContent ?? "").toContain("Sarah Mitchell");
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("still has them on the website", async () => {
    h.native = false;
    const thread = await openInboxThread();
    expect(thread.querySelector('[aria-label="Call"]')).not.toBeNull();
    expect(thread.querySelector('[aria-label="Book showing"]')).not.toBeNull();
    expect(thread.textContent ?? "").toContain("Take over");
  });
});

async function renderLead() {
  const { default: LeadDetail } = await import("@/pages/rd/app/LeadDetail");
  renderWithProviders(
    <Routes>
      <Route path="/app/leads/:id" element={<LeadDetail />} />
    </Routes>,
    { route: "/app/leads/l1" },
  );
  await waitFor(() => expect(screen.getAllByText("Sarah Mitchell").length).toBeGreaterThan(0));
}

describe("the lead record", () => {
  const DEAD = ["Call", "Book showing", "Take over", "Draft with AI", "Attach listing", "Template ▾"];

  it("has none of the handler-less buttons in the app, and keeps Send", async () => {
    await renderLead();
    for (const name of DEAD) {
      expect(screen.queryByRole("button", { name }), name).toBeNull();
    }
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("still has all of them on the website", async () => {
    h.native = false;
    await renderLead();
    for (const name of DEAD) {
      expect(screen.getByRole("button", { name }), name).toBeInTheDocument();
    }
  });
});

async function renderPipeline() {
  const { default: Pipeline } = await import("@/pages/rd/app/Pipeline");
  renderWithProviders(<Pipeline />, { route: "/app/pipeline" });
}

describe("the pipeline view switch", () => {
  it("offers Kanban and List but not Forecast in the app", async () => {
    await renderPipeline();
    expect(screen.getByRole("button", { name: "Kanban" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "List" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Forecast" })).toBeNull();
  });

  it("still offers Forecast on the website", async () => {
    h.native = false;
    await renderPipeline();
    expect(screen.getByRole("button", { name: "Forecast" })).toBeInTheDocument();
  });
});
