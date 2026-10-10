import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import axe from "axe-core";
import { renderWithProviders } from "@/test/render";
import { buildNextUp, computeSummary, type DashContact, type DashInput } from "@/lib/rd/dashboard";
import { rdDashEn, rdDashFr } from "@/i18n/rdDashboard";

// The shell drags in auth, billing and nav; none of it is under test.
vi.mock("@/components/rd/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/components/rd/AddLeadDialog", () => ({ AddLeadDialog: () => null }));
vi.mock("@/hooks/rd/useSession", () => ({
  useSession: () => ({ user: { id: "u1", email: "maya@example.com", user_metadata: { full_name: "Maya Singh" } }, loading: false }),
}));
vi.mock("@/hooks/rd/useDashboardFeed", () => ({
  useActivityFeed: () => ({ activity: [], loading: false, error: null }),
}));

const data = vi.fn();
vi.mock("@/hooks/rd/useDashboardData", () => ({ useDashboardData: () => data() }));

import DashboardV2 from "../DashboardV2";

const NOW = Date.now();
const H = 3_600_000;
const iso = (msAgo: number) => new Date(NOW - msAgo).toISOString();
function c(over: Partial<DashContact>): DashContact {
  return {
    id: Math.random().toString(36).slice(2),
    first_name: "Pat",
    last_name: "Lee",
    email: "pat@example.com",
    phone: "604-555-0100",
    stage: "contacted",
    source: "Referral",
    preferred_language: "en",
    ai_score: 40,
    created_at: iso(40 * 24 * H),
    last_contact_date: iso(24 * H),
    next_followup_date: null,
    casl_consent: true,
    consent_given: null,
    consent_date: null,
    unsubscribed: false,
    budget: 500_000,
    ...over,
  };
}

function loaded(input: DashInput) {
  const names = Object.fromEntries(input.contacts.map((x) => [x.id, `${x.first_name} ${x.last_name}`]));
  return {
    summary: computeSummary(input),
    queue: buildNextUp(input, new Date(), Number.POSITIVE_INFINITY),
    names,
    loading: false,
    error: null,
    refetch: vi.fn(),
    updatedAt: NOW,
  };
}

const waiting = c({ id: "w1", first_name: "Émilie", last_name: "Tremblay", preferred_language: "fr" });
const noConsent = c({ id: "n1", first_name: "Hannah", last_name: "Weiss", ai_score: 91, casl_consent: false });
const input: DashInput = {
  contacts: [waiting, noConsent, c({ stage: "won" }), c({ source: "Open house", created_at: iso(2 * H), stage: "new", last_contact_date: null })],
  messages: [{ lead_id: "w1", author: "lead", sent_at: iso(0.4 * H) }],
  tasks: [],
};

describe("dashboard v2", () => {
  let i18nRef: { changeLanguage: (l: string) => Promise<unknown> } | null = null;
  beforeEach(() => data.mockReturnValue(loaded(input)));
  afterEach(async () => {
    await i18nRef?.changeLanguage("en");
  });

  it("shows no figure while loading", () => {
    data.mockReturnValue({ summary: null, queue: [], names: {}, loading: true, error: null, refetch: vi.fn(), updatedAt: null });
    const { container } = renderWithProviders(<DashboardV2 />, { route: "/app?v=2" });
    expect(container.textContent).not.toMatch(/\$\s?0\b/);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("links every KPI tile to the list it counts", () => {
    renderWithProviders(<DashboardV2 />, { route: "/app?v=2" });
    const region = screen.getByRole("region", { name: "Key numbers" });
    const hrefs = within(region).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "/app/inbox?filter=awaiting",
      "/app/leads?view=due",
      "/app/leads?view=new7d",
      "/app/inbox",
      "/app/pipeline",
      "/app/leads?view=open",
    ]);
    // Awaiting reply counts the one unanswered thread.
    expect(within(region).getByRole("link", { name: /^Awaiting reply 1 Right now$/ })).toBeInTheDocument();
  });

  it("does not show a response-time number below the minimum sample", () => {
    renderWithProviders(<DashboardV2 />, { route: "/app?v=2" });
    expect(screen.getByRole("link", { name: /^First response — Needs 5 replies to measure Median · last 7 days$/ })).toBeInTheDocument();
  });

  it("puts the waiting lead first, with Reply, and blocks email without consent", () => {
    renderWithProviders(<DashboardV2 />, { route: "/app?v=2" });
    const list = screen.getByRole("heading", { name: "Next up" }).closest("[aria-labelledby]")!;
    const rows = within(list as HTMLElement).getAllByRole("listitem");
    expect(rows[0]).toHaveTextContent("Émilie Tremblay");
    expect(within(rows[0]).getByRole("link", { name: "Reply to Émilie Tremblay" })).toHaveAttribute(
      "href",
      "/app/inbox?lead=w1"
    );
    const hannah = rows.find((r) => r.textContent?.includes("Hannah Weiss"))!;
    expect(within(hannah).queryByRole("link", { name: /Email Hannah/ })).toBeNull();
    expect(within(hannah).getByRole("img", { name: /Email is blocked/ })).toBeInTheDocument();
    expect(within(hannah).getByRole("link", { name: "Call Hannah Weiss" })).toHaveAttribute("href", "tel:6045550100");
  });

  it("renders fully in French, with fr-CA money", async () => {
    const { i18n } = renderWithProviders(<DashboardV2 />, { route: "/app?v=2" });
    i18nRef = i18n;
    await i18n.changeLanguage("fr");
    expect(await screen.findByRole("heading", { name: "À faire maintenant" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Chiffres clés" })).toBeInTheDocument();
    // 3 open leads x $500K = 1,5 M$ in fr-CA compact notation (not "$1.5M").
    expect(screen.getByRole("link", { name: /^Pipeline actif 1,5\s?M\s?\$ 3 clients actifs Budgets des acheteurs$/ })).toBeInTheDocument();
    expect(screen.getByText("Visite libre")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Awaiting reply|Next up|Open pipeline/);
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<DashboardV2 />, { route: "/app?v=2" });
    // Colour contrast cannot be judged in jsdom (no layout or paint).
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});

describe("dashboard v2 copy", () => {
  const keys = (o: object, p = ""): string[] =>
    Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
  it("has every English key in French and no empty strings", () => {
    expect(keys(rdDashFr).sort()).toEqual(keys(rdDashEn).sort());
    for (const k of keys(rdDashFr)) {
      const v = k.split(".").reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], rdDashFr);
      expect(String(v).trim(), k).not.toBe("");
    }
  });
});
