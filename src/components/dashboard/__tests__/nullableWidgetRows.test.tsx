import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import TasksWidget from "../TasksWidget";
import HotLeadsWidget from "../HotLeadsWidget";
import MarketWidget from "../MarketWidget";

/**
 * The legacy dashboard widgets with the nullable values their rows really
 * carry: nothing renders as "null" / "undefined" and missing values fall back
 * to the widgets' existing defaults. All data is in-memory.
 */

vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({}) } }));

const NO_NULL_TEXT = /\bnull\b|\bundefined\b/;

describe("TasksWidget with nullable task rows and joins", () => {
  it("renders a task whose optional fields and joins are null", () => {
    renderWithProviders(
      <TasksWidget
        onTaskComplete={() => {}}
        tasks={[
          { id: "t1", title: "Call back", due_time: null, priority: null, status: null, contact: null, deal: null },
          { id: "t2", title: "Send listing", due_time: "09:30", priority: "high", status: "pending", contact: { first_name: null, last_name: "Lee" }, deal: null },
        ]}
      />,
    );
    expect(screen.getByText("Call back")).toBeInTheDocument();
    expect(screen.getByText("Send listing")).toBeInTheDocument();
    expect(screen.getByText(/Lee/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(NO_NULL_TEXT);
  });
});

describe("HotLeadsWidget with a lead missing email and score", () => {
  it("shows a 0 score and no null text", () => {
    renderWithProviders(<HotLeadsWidget leads={[{ id: "l1", name: "Ann Lee", email: null, ai_score: null }]} />);
    expect(screen.getByText("Ann Lee")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(NO_NULL_TEXT);
  });
});

describe("MarketWidget without a city", () => {
  it("falls back to its own default city", () => {
    renderWithProviders(<MarketWidget defaultCity={undefined} />);
    expect(document.body.textContent).toMatch(/Toronto/);
    expect(document.body.textContent).not.toMatch(NO_NULL_TEXT);
  });
});
