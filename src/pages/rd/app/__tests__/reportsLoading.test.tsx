import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// The page shell drags in routing and auth; neither is under test here.
vi.mock("@/components/rd/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_k: string, d?: string) => d ?? _k,
    i18n: { language: "en" },
  }),
}));

const leads = vi.fn();
vi.mock("@/hooks/rd/useLeads", () => ({ useLeads: () => leads() }));
vi.mock("@/hooks/rd/useReports", () => ({
  useFunnel: () => ({ funnel: [] }),
  useSourceBreakdown: () => ({ rows: [] }),
  useResponseTimeTrend: () => ({ avgLabel: null, spark: [], loading: false }),
  useAgentLeaderboard: () => ({ rows: [] }),
}));

import Reports from "../Reports";

/**
 * `won`, `revenue` and `capturedToShowing` are derived from the leads array,
 * which is [] while the query is in flight. The page therefore rendered
 * "Deals closed 0", "Revenue attributed $0" and "Lead -> Showing 0%" during
 * every cold load. Those are not empty states -- they are wrong measurements
 * shown to an agent who has closed deals, and they look identical to a real
 * result. An absent number must stay absent until it is known.
 */
describe("Reports KPI row while leads are loading", () => {
  it("publishes no figure it cannot yet know", () => {
    leads.mockReturnValue({ leads: [], loading: true, error: null });
    const { container } = render(<Reports />);

    expect(container.textContent).not.toMatch(/\$0\b/);
    expect(container.textContent).not.toMatch(/\b0%/);
    // Space is reserved rather than collapsed.
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows real figures once the leads resolve", () => {
    leads.mockReturnValue({
      leads: [
        { id: "1", stage: "won", budgetCad: 500_000 },
        { id: "2", stage: "showing", budgetCad: 0 },
      ],
      loading: false,
      error: null,
    });
    render(<Reports />);

    // One won deal out of two leads; both count toward showings.
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
