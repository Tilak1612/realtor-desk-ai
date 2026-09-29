import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  PRIMARY_NAV,
  SOLUTIONS_PANES,
  FOOTER_COLUMNS,
  allNavRoutes,
  allFooterRoutes,
  HEADER_ACTIONS,
} from "@/config/siteNav";

// The registry's whole value is that a destination exists in exactly one place.
// That only holds if the destinations are real. A typo in siteNav.ts would ship
// a 404 into the header of every public page simultaneously, so these tests read
// App.tsx rather than trusting the registry to describe itself.

const APP = fs.readFileSync(path.resolve(__dirname, "../../App.tsx"), "utf8");

/** Every `path="..."` declared in App.tsx. */
const declaredRoutes = new Set(
  [...APP.matchAll(/path="([^"]+)"/g)].map((m) => m[1]),
);

/**
 * Routes rendered inside <ProtectedRoute> or <RequireBilling>. A logged-out
 * visitor who clicks one from a marketing menu lands on the login screen, so
 * these must never appear in public chrome. Matched on the same line, which is
 * how App.tsx writes them.
 */
const gatedRoutes = new Set(
  APP.split("\n")
    .filter((l) => /<ProtectedRoute|<RequireBilling/.test(l))
    .flatMap((l) => [...l.matchAll(/path="([^"]+)"/g)].map((m) => m[1])),
);

describe("site navigation registry", () => {
  it("points only at routes App.tsx actually declares", () => {
    const missing = allNavRoutes().filter((r) => !declaredRoutes.has(r));
    expect(missing, `nav destinations with no route in App.tsx: ${missing.join(", ")}`).toEqual([]);
  });

  it("points only at routes a logged-out visitor can open", () => {
    const gated = allNavRoutes().filter((r) => gatedRoutes.has(r));
    expect(
      gated,
      `public nav links into authenticated routes (they redirect to /login): ${gated.join(", ")}`,
    ).toEqual([]);
  });

  it("gives every group either a destination or children, never neither", () => {
    for (const g of PRIMARY_NAV) {
      const hasChildren = Boolean(g.items?.length || g.panes?.length);
      expect(Boolean(g.to) || hasChildren, `group "${g.id}" is an empty menu`).toBe(true);
    }
  });

  it("describes every link it renders in a panel", () => {
    // The brief requires a one-sentence description beside each panel link;
    // an undescribed link is the "coming soon" filler the acceptance criteria ban.
    const panelItems = PRIMARY_NAV.flatMap((g) => [
      ...(g.items ?? []),
      ...(g.panes ?? []).flatMap((p) => p.items),
    ]);
    const undescribed = panelItems.filter((i) => !i.desc?.trim()).map((i) => i.to);
    expect(undescribed, `panel links with no description: ${undescribed.join(", ")}`).toEqual([]);
  });

  it("keeps each Solutions pane selector a real link, not a content-only tab", () => {
    for (const pane of SOLUTIONS_PANES) {
      expect(declaredRoutes.has(pane.to), `pane "${pane.id}" selector -> ${pane.to}`).toBe(true);
    }
  });

  it("does not list the same destination twice in one group", () => {
    for (const g of PRIMARY_NAV) {
      for (const list of [g.items ?? [], ...(g.panes ?? []).map((p) => p.items)]) {
        const tos = list.map((i) => i.to);
        expect(new Set(tos).size, `duplicate link inside "${g.id}"`).toBe(tos.length);
      }
    }
  });

  it("points the footer only at declared, ungated routes too", () => {
    const routes = allFooterRoutes();
    const missing = routes.filter((r) => !declaredRoutes.has(r));
    expect(missing, `footer destinations with no route: ${missing.join(", ")}`).toEqual([]);
    const gated = routes.filter((r) => gatedRoutes.has(r));
    expect(gated, `footer links into authenticated routes: ${gated.join(", ")}`).toEqual([]);
  });

  it("gives every footer column a title and at least one link", () => {
    for (const c of FOOTER_COLUMNS) {
      expect(c.title.trim(), `column "${c.id}" has no title`).not.toBe("");
      expect(c.items.length, `column "${c.id}" is empty`).toBeGreaterThan(0);
    }
  });

  it("keeps the Canada column's legal links pointing at their own statutes", () => {
    // These were crossed once: the CASL link pointed at the PIPEDA page, so
    // anyone checking our CASL posture landed on the wrong statute. Different
    // laws, different obligations — pin it.
    const canada = FOOTER_COLUMNS.find((c) => c.id === "canada");
    const casl = canada?.items.find((i) => i.label === "CASL");
    expect(casl?.to).toContain("casl");
    expect(canada?.items.find((i) => i.label === "PIPEDA")?.to).toContain("pipeda");
  });

  it("keeps the trial and sign-in actions on their existing auth routes", () => {
    // Conversion behavior the brief says to preserve: the trial CTA must keep
    // going to the real signup flow, not to a new marketing page.
    expect(HEADER_ACTIONS.trial.to).toBe("/signup");
    expect(HEADER_ACTIONS.signIn.to).toBe("/login");
  });
});
