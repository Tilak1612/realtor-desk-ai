import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/render";

/**
 * /call-workflow/:contactId, offline. Every Supabase call is recorded against
 * an in-memory mock, so the tests can assert exactly which reads and writes
 * the page makes: nothing reaches a database, the AI or a phone.
 */

type Write = { table: string; op: "update" | "insert" | "delete"; payload: unknown; id?: unknown };

const h = vi.hoisted(() => ({
  session: null as unknown,
  contact: null as Record<string, unknown> | null,
  taskInsertError: null as { message: string } | null,
  reads: [] as string[],
  writes: [] as Write[],
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("sonner", () => ({ toast: h.toast }));
vi.mock("@/components/layout/AppLayout", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock("@/components/call-workflow/AICallSummaryPanel", () => ({ default: () => null }));
vi.mock("@/components/feedback/WorkflowFeedbackWidget", () => ({ default: () => null }));
vi.mock("@/hooks/useAiConsent", () => ({ useAiConsent: () => ({ ensure: async () => false, dialog: null }) }));

// Radix Select does not drive reliably in jsdom; a native <select> with the
// same value / onValueChange contract keeps the page's own logic under test.
vi.mock("@/components/ui/select", async () => {
  const R = await import("react");
  const idOf = (children: React.ReactNode): string | undefined => {
    let id: string | undefined;
    R.Children.forEach(children, (c) => {
      if (R.isValidElement<{ id?: string }>(c) && c.props.id) id = c.props.id;
    });
    return id;
  };
  return {
    Select: ({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) => (
      <select data-testid={idOf(children)} value={value} onChange={(e) => onValueChange(e.target.value)}>
        <option value="" />
        {children}
      </select>
    ),
    SelectTrigger: () => null,
    SelectValue: () => null,
    SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => <option value={value}>{children}</option>,
  };
});

vi.mock("@/integrations/supabase/client", () => {
  const from = (table: string) => {
    const builder = {
      select: () => builder,
      eq: (_col: string, id: unknown) => {
        if (pending) {
          h.writes.push({ ...pending, id });
          pending = null;
          return Promise.resolve({ error: null });
        }
        return builder;
      },
      single: async () => {
        h.reads.push(table);
        if (table === "contacts") return h.contact ? { data: h.contact, error: null } : { data: null, error: { message: "not found" } };
        return { data: { id: "u1", full_name: "Agent" }, error: null };
      },
      update: (payload: unknown) => {
        pending = { table, op: "update", payload };
        return builder;
      },
      insert: async (payload: unknown) => {
        h.writes.push({ table, op: "insert", payload });
        return { error: table === "tasks" ? h.taskInsertError : null };
      },
      delete: () => {
        pending = { table, op: "delete", payload: null };
        return builder;
      },
    };
    let pending: Write | null = null;
    return builder;
  };
  return {
    supabase: {
      from,
      auth: { getSession: async () => ({ data: { session: h.session } }) },
      functions: { invoke: vi.fn() },
    },
  };
});

const fullContact = {
  id: "c1",
  first_name: "Ann",
  last_name: "Lee",
  phone: "+1 604 555 0100",
  email: "ann@example.com",
  tags: ["buyer"],
  stage: "warm_lead",
  notes: "Prefers mornings",
  last_contact_date: null,
  next_followup_date: null,
};
const minimalContact = {
  id: "c2",
  first_name: null,
  last_name: null,
  phone: null,
  email: null,
  tags: null,
  stage: null,
  notes: null,
  last_contact_date: null,
  next_followup_date: null,
};

beforeEach(() => {
  h.session = { user: { id: "u1", email: "agent@example.com" } };
  h.contact = { ...fullContact };
  h.taskInsertError = null;
  h.reads.length = 0;
  h.writes.length = 0;
  h.toast.success.mockClear();
  h.toast.error.mockClear();
});

const render = async (route = "/call-workflow/c1") => {
  const { default: CallWorkflow } = await import("../CallWorkflow");
  renderWithProviders(
    <Routes>
      <Route path="/call-workflow/:contactId" element={<CallWorkflow />} />
      <Route path="/call-workflow" element={<CallWorkflow />} />
      <Route path="/today" element={<div>TODAY</div>} />
      <Route path="/login" element={<div>SIGN IN</div>} />
    </Routes>,
    { route },
  );
};

/** Fill the form the way an agent would, then Save & Close. */
const fillAndSave = async () => {
  await screen.findByText("Call Actions");
  fireEvent.change(screen.getByTestId("call-outcome"), { target: { value: "voicemail" } });
  fireEvent.change(screen.getByPlaceholderText(/What did you discuss/), { target: { value: "Left message" } });
  fireEvent.change(screen.getByTestId("next-step-type"), { target: { value: "call" } });
  fireEvent.change(document.getElementById("next-step-date")!, { target: { value: "2026-11-10" } });
  fireEvent.click(screen.getByText("Save & Close"));
};

describe("CallWorkflow with a contact whose fields are all null", () => {
  it("renders neutral fallbacks, no call link and no literal null/undefined", async () => {
    h.contact = { ...minimalContact };
    await render("/call-workflow/c2");

    expect(await screen.findByText("Unnamed contact")).toBeInTheDocument();
    expect(screen.getByText("No stage set")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /No phone number/ })).toBeDisabled();
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(document.body.textContent).not.toMatch(/\bnull\b|\bundefined\b/);
  });

  it("stores no placeholder name in the titles it writes", async () => {
    h.contact = { ...minimalContact };
    await render("/call-workflow/c2");
    await fillAndSave();
    await screen.findByText("TODAY");

    const titles = h.writes.filter((w) => w.op === "insert").map((w) => (w.payload as { title: string }).title);
    expect(titles).toEqual(["Call", "Call follow-up"]);
    expect(JSON.stringify(h.writes)).not.toMatch(/null follow-up|Unnamed|undefined/);
  });
});

describe("CallWorkflow without a contact id", () => {
  it("makes no contact query and builds no queue", async () => {
    await render("/call-workflow");
    expect(await screen.findByText("Contact not found")).toBeInTheDocument();
    expect(h.reads).not.toContain("contacts");
    expect(h.writes).toEqual([]);
  });
});

describe("CallWorkflow without a signed-in user", () => {
  it("writes nothing and says how to recover", async () => {
    // A session whose user is absent when the page stores it (but present for
    // the profile read), so the contact loads while `user` state is null.
    let reads = 0;
    h.session = { get user() { return reads++ === 0 ? null : { id: "u1" }; } };
    await render();
    await fillAndSave();

    await waitFor(() => expect(h.toast.error).toHaveBeenCalled());
    expect(h.toast.error.mock.calls[0][0]).toBe("You're signed out, so nothing was saved");
    expect(h.toast.error.mock.calls[0][1]).toMatchObject({ action: { label: "Sign in" } });
    expect(h.writes).toEqual([]);
    expect(h.toast.success).not.toHaveBeenCalled();
    expect(screen.queryByText("TODAY")).toBeNull();
  });
});

describe("CallWorkflow saving a call", () => {
  it("writes the same contact, activity and task payloads as before", async () => {
    await render();
    await fillAndSave();
    await screen.findByText("TODAY");

    expect(h.writes).toEqual([
      {
        table: "contacts",
        op: "update",
        id: "c1",
        payload: { notes: "Left message", stage: "warm_lead", last_contact_date: expect.any(String), next_followup_date: "2026-11-10T09:00:00" },
      },
      {
        table: "contact_activities",
        op: "insert",
        payload: { user_id: "u1", contact_id: "c1", activity_type: "call_made", title: "Call with Ann Lee", description: "Outcome: voicemail\n\nLeft message" },
      },
      {
        table: "tasks",
        op: "insert",
        payload: { user_id: "u1", contact_id: "c1", title: "Call follow-up: Ann Lee", description: "Left message", due_date: "2026-11-10T09:00:00", priority: "medium", status: "pending" },
      },
    ]);
    expect(h.toast.success).toHaveBeenCalledWith("Call saved successfully!");
    expect(h.toast.error).not.toHaveBeenCalled();
  });

  it("reports a failed follow-up task truthfully and keeps what was saved", async () => {
    h.taskInsertError = { message: "permission denied for table tasks." };
    await render();
    await fillAndSave();
    await screen.findByText("TODAY");

    // The contact update and timeline entry stand; nothing is deleted or undone.
    expect(h.writes.map((w) => `${w.op}:${w.table}`)).toEqual(["update:contacts", "insert:contact_activities", "insert:tasks"]);
    expect(h.writes.some((w) => w.op === "delete")).toBe(false);
    expect(h.toast.error).toHaveBeenCalledWith("Call saved, but the follow-up task was not created", {
      description: "permission denied for table tasks. Add the follow-up from Tasks.",
    });
    expect(h.toast.success).not.toHaveBeenCalled();
  });
});
