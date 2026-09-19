import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { screen, act, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * Feature parity between desktop, tablet and phone in the signed-in app.
 *
 * jsdom applies no Tailwind, so it cannot say what is visible at 390px. The
 * width-by-width measurement lives in scripts/verify-dashboard-parity.mjs,
 * which renders every /app screen at 1440/1024/820/390 in a real browser and
 * diffs what a person can reach. These tests pin the specific gaps it found,
 * so they cannot return unnoticed between sweeps:
 *
 *   - Leads: Listing, Email, Call and Open were `hidden lg:*` with no mobile
 *     equivalent -- and on desktop Email/Call did nothing (their only handler
 *     was stopPropagation). Row checkboxes held no state. All of it sat
 *     inside the row's <a>.
 *   - Tasks: the whole filter panel -- search, priority, type, status,
 *     contact -- was `hidden lg:block`, under a comment "Hidden on mobile".
 *   - Stage could only be changed by dragging a Pipeline card: fiddly on a
 *     phone, impossible from a keyboard.
 *   - Both navigation toggles lacked aria-expanded, and their labels were
 *     English-only.
 */

const ROOT = join(__dirname, "..", "..", "..");
const src = (p: string) => readFileSync(join(ROOT, p), "utf8");

// The Leads page reaches the Supabase client through AppShell, and the real
// client throws at import without env vars. A chainable no-op stands in.
vi.mock("@/integrations/supabase/client", () => {
  const result = { data: [], error: null, count: 0 };
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  for (const k of ["select", "eq", "neq", "in", "is", "gte", "lte", "order", "limit", "range", "match", "not", "or", "filter"]) {
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

vi.mock("@/hooks/rd/useLeads", () => ({
  useLeads: () => ({
    loading: false,
    error: null,
    leads: [
      {
        id: "l1", name: "Sarah Mitchell", email: "sarah@example.com", phone: "+1 (780) 555-0110",
        language: "EN", source: "Website", listing: "1200 Jasper Ave NW", city: "Edmonton",
        stage: "showing", score: 94, lastActivity: "1h ago", aiHandling: false,
        nextFollowupDate: null, assignedAgentId: null,
      },
      {
        // A webhook lead with no address gets a placeholder -- never mail it.
        id: "l2", name: "No Email Lead", email: "no-email-abc@placeholder.invalid", phone: "",
        language: "FR", source: "Webhook", stage: "new", score: 40, lastActivity: "2h ago",
        aiHandling: false, nextFollowupDate: null, assignedAgentId: null,
      },
    ],
  }),
}));

describe("Leads rows", () => {
  it("offers working Email and Call links, named per lead, at every width", async () => {
    const { default: Leads } = await import("@/pages/rd/app/Leads");
    renderWithProviders(<Leads />, { route: "/app/leads" });

    const email = screen.getByRole("link", { name: "Email Sarah Mitchell" });
    const call = screen.getByRole("link", { name: "Call Sarah Mitchell" });
    expect(email.getAttribute("href")).toBe("mailto:sarah@example.com");
    // Formatting stripped: tel: needs digits and a leading +.
    expect(call.getAttribute("href")).toBe("tel:+17805550110");

    // Not hidden below lg -- the whole point.
    expect(email.parentElement!.className.split(/\s+/)).not.toContain("hidden");
  });

  it("never offers to email a placeholder address or call a missing number", async () => {
    const { default: Leads } = await import("@/pages/rd/app/Leads");
    renderWithProviders(<Leads />, { route: "/app/leads" });
    expect(screen.queryByRole("link", { name: "Email No Email Lead" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Call No Email Lead" })).toBeNull();
  });

  it("puts the listing in the mobile meta line, not only a desktop column", async () => {
    const { default: Leads } = await import("@/pages/rd/app/Leads");
    renderWithProviders(<Leads />, { route: "/app/leads" });
    const copies = screen.getAllByText("1200 Jasper Ave NW");
    // One for the lg column, one for the stacked layout below it.
    expect(copies.some((el) => /\blg:hidden\b/.test(el.className))).toBe(true);
  });

  it("names the row link by the lead, and nests nothing interactive inside it", async () => {
    const { default: Leads } = await import("@/pages/rd/app/Leads");
    renderWithProviders(<Leads />, { route: "/app/leads" });

    // Was the whole row's text: "SMSarah MitchellENsarah@...94Showing1h ago94Showing1h ago".
    const row = screen.getByRole("link", { name: "Sarah Mitchell" });
    expect(row.getAttribute("href")).toBe("/app/leads/l1");

    for (const a of document.querySelectorAll("a")) {
      expect(a.querySelector("a, button, input, select, textarea"), a.outerHTML.slice(0, 80)).toBeNull();
    }
  });

  it("has no selection checkboxes, because nothing ever used a selection", async () => {
    const { default: Leads } = await import("@/pages/rd/app/Leads");
    renderWithProviders(<Leads />, { route: "/app/leads" });
    expect(screen.queryAllByRole("checkbox")).toEqual([]);
  });
});

describe("Tasks filters", () => {
  const realMM = window.matchMedia;
  const mm = (isDesktop: boolean) =>
    ((q: string) => ({
      matches: q.includes("min-width: 1024px") ? isDesktop : false,
      media: q, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

  afterEach(() => {
    window.matchMedia = realMM;
  });

  const FILTERS = { search: "", priorities: [], types: [], status: [], contactId: "" };

  it("are reachable on a phone: collapsed behind a toggle, not removed", async () => {
    window.matchMedia = mm(false);
    const { default: TasksFilters } = await import("@/components/tasks/TasksFilters");
    renderWithProviders(<TasksFilters filters={FILTERS} onFiltersChange={() => {}} />);

    const show = screen.getByRole("button", { name: /show filters/i });
    expect(show.getAttribute("aria-expanded")).toBe("false");
    await act(async () => fireEvent.click(show));

    expect(screen.getByLabelText(/search tasks/i)).toBeTruthy();
    const hide = screen.getByRole("button", { name: /hide filters/i });
    expect(hide.getAttribute("aria-expanded")).toBe("true");
    // And the panel itself carries no breakpoint-hiding class any more.
    expect(document.getElementById("tasks-filters-panel")!.className.split(/\s+/)).not.toContain("hidden");
  });

  it("say how many filters are active while collapsed", async () => {
    window.matchMedia = mm(false);
    const { default: TasksFilters } = await import("@/components/tasks/TasksFilters");
    renderWithProviders(
      <TasksFilters filters={{ ...FILTERS, priorities: ["high"], search: "offer" }} onFiltersChange={() => {}} />
    );
    // Collapsed on a phone, this is the only sign the list is filtered.
    expect(screen.getByRole("button", { name: /show filters\s*2/i })).toBeTruthy();
  });
});

describe("navigation toggles", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("the /app toggle reports whether the drawer is open", async () => {
    const { TopNav } = await import("@/components/rd/layout/TopNav");
    const { unmount } = renderWithProviders(<TopNav agent={{ name: "A" }} navOpen={false} />);
    expect(screen.getByRole("button", { name: "Open navigation" }).getAttribute("aria-expanded")).toBe("false");
    unmount();
    renderWithProviders(<TopNav agent={{ name: "A" }} navOpen />);
    expect(screen.getByRole("button", { name: "Open navigation" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("is labelled in French too", async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("fr");
    });
    const { TopNav } = await import("@/components/rd/layout/TopNav");
    renderWithProviders(<TopNav agent={{ name: "A" }} />);
    expect(screen.getByRole("button", { name: "Ouvrir la navigation" })).toBeTruthy();
  });

  it("the legacy shell toggle names what it controls and its state", () => {
    const s = src("src/components/dashboard/DashboardSidebar.tsx");
    expect(s).toContain('aria-controls="app-sidebar"');
    expect(s).toContain("aria-expanded={isOpen}");
    expect(s).toContain('id="app-sidebar"');
    // Hardcoded English was the only label before. (The explanatory comment
    // quotes the old string, so match the attribute, not the words.)
    expect(s).not.toMatch(/aria-label=\{isOpen \? "Close menu" : "Open menu"\}/);
    expect(s).toMatch(/aria-label=\{isOpen \? t\(/);
  });
});

describe("changing a lead's stage", () => {
  it("does not depend on dragging a Pipeline card", () => {
    const s = src("src/pages/rd/app/LeadDetail.tsx");
    expect(s).toContain("function StageControl");
    expect(s).toContain("useUpdateLeadStage");
    expect(s).toMatch(/<KVRow k="Stage" v=\{<StageControl/);
  });

  it("lets a phone scroll the board: touch drags on press-and-hold only", () => {
    const s = src("src/pages/rd/app/Pipeline.tsx");
    expect(s).toContain("TouchSensor");
    expect(s).toMatch(/delay:\s*\d{3}/);
    expect(s).not.toContain("touch-none");
    expect(s).not.toMatch(/useSensor\(PointerSensor/);
  });
});

describe("the two navigation menus", () => {
  // The /app screens and the legacy pages (Tasks, Calendar, ...) render
  // different sidebars. Each one is the ONLY navigation on its pages, at every
  // width, so a destination missing from either is unreachable from half the
  // dashboard. AI Assistant was missing from one, Conversations from the other.
  //
  // Legacy paths redirect into /app, so compare where each link LANDS.
  const LANDS: Record<string, string> = {
    "/today": "/app", "/contacts": "/app/leads", "/deals": "/app/pipeline",
    "/reports": "/app/reports", "/automations": "/app/automation", "/settings": "/app/settings",
  };
  const land = (p: string) => LANDS[p] ?? p;

  const rd = [...src("src/components/rd/layout/Sidebar.tsx").matchAll(/to: "(\/[^"]*)"/g)].map((m) => land(m[1]));
  const legacy = [...src("src/components/dashboard/DashboardSidebar.tsx").matchAll(/path: "(\/[^"]*)"/g)].map((m) => land(m[1]));

  it("reach the same destinations", () => {
    // Billing is in the /app account menu (TopNav), not its sidebar.
    const rdPlusAccountMenu = new Set([...rd, "/billing"]);
    expect([...new Set(legacy)].filter((p) => !rdPlusAccountMenu.has(p)), "in legacy menu only").toEqual([]);
    expect([...new Set(rd)].filter((p) => !legacy.includes(p)), "in /app menu only").toEqual([]);
  });

  it("are translated: every /app menu label has an EN and a FR string", () => {
    const keys = [...src("src/components/rd/layout/Sidebar.tsx").matchAll(/t\("rd\.sidebar\.nav\.(\w+)"/g)].map((m) => m[1]);
    const i18n = src("src/i18n/config.ts");
    const navBlocks = [...i18n.matchAll(/\n {10}nav: \{([\s\S]*?)\n {10}\}/g)].map((m) => m[1]);
    expect(navBlocks.length).toBe(2);
    for (const block of navBlocks) {
      for (const k of keys) expect(block, `rd.sidebar.nav.${k}`).toMatch(new RegExp(`\\b${k}:`));
    }
  });
});

describe("Leads toolbar on a phone", () => {
  // At 390px the non-wrapping tabs+sort row pushed the Sort button to x=433,
  // off the screen and clipped by overflow-x:hidden. jsdom cannot lay out, so
  // pin the two classes that prevent it; verify:parity measures the result.
  it("lets the sort control wrap onto its own line instead of off-screen", () => {
    const s = src("src/pages/rd/app/Leads.tsx");
    expect(s).toMatch(/Tabs \+ sort[\s\S]{0,600}className="flex flex-wrap/);
  });

  it("scrolls the tab strip sideways rather than breaking labels across lines", () => {
    const s = src("src/components/rd/Tabs.tsx");
    expect(s).toContain("overflow-x-auto");
    expect(s).toContain("whitespace-nowrap");
    expect(s).toContain("min-w-0");
  });
});

describe("Inbox on a phone", () => {
  // Below lg the list and the open thread were stacked into one screen height
  // as two short, separately scrolling panes; tapping a conversation opened it
  // underneath, often off-screen. Now: list, then thread, with a way back.
  it("shows one pane at a time below lg, and both from lg up", async () => {
    const { default: Inbox } = await import("@/pages/rd/app/Inbox");
    renderWithProviders(<Inbox />, { route: "/app/inbox" });

    const thread = document.getElementById("inbox-thread")!;
    expect(thread.className).toMatch(/\bhidden lg:flex\b/); // list view first

    const row = screen.getByRole("button", { name: /Sarah Mitchell/ });
    expect(row.getAttribute("aria-controls")).toBe("inbox-thread");
    await act(async () => fireEvent.click(row));

    // Compare class TOKENS: /\bhidden\b/ also matches "overflow-hidden".
    const open = document.getElementById("inbox-thread")!;
    expect(open.className.split(/\s+/)).not.toContain("hidden");
    const back = screen.getByRole("button", { name: /back to conversations/i });
    expect(back.className).toContain("lg:hidden");

    await act(async () => fireEvent.click(back));
    expect(document.getElementById("inbox-thread")!.className).toMatch(/\bhidden lg:flex\b/);
  });
});

describe("Lead Detail on a phone", () => {
  it("scrolls as one page below lg instead of two stacked letterbox panes", () => {
    const s = src("src/pages/rd/app/LeadDetail.tsx");
    expect(s).toContain('lg:grid-cols-[1.6fr_1fr] lg:h-full lg:overflow-hidden"');
    expect(s).not.toContain('lg:grid-cols-[1.6fr_1fr] h-full overflow-hidden"');
  });
});

describe("the pre-sales assistant", () => {
  it("stays out of the signed-in app, where it sat on top of Send", () => {
    const s = src("src/components/marketing/SiteAssistant.tsx");
    for (const p of ['"/app"', '"/tasks"', '"/calendar"', '"/billing"', '"/settings"']) {
      expect(s).toContain(p);
    }
    expect(s).toMatch(/APP_PREFIXES\.some/);
  });
});

describe("Calendar at tablet-landscape width", () => {
  // At 1024px equal thirds gave the date picker 224px of the ~252 it needs;
  // it overflowed past the screen edge and the next-month button and Saturday
  // column were clipped. verify:parity measures it; this pins the cause.
  it("sizes the date picker column to its content, not a third of the row", () => {
    const s = src("src/pages/Calendar.tsx");
    expect(s).toContain("md:grid-cols-[minmax(0,1fr)_auto]");
    expect(s).not.toContain('className="grid gap-6 md:grid-cols-3"');
  });
});
