import { describe, it, expect, beforeEach } from "vitest";
import { screen, act } from "@testing-library/react";
import axe from "axe-core";
import { renderWithProviders } from "@/test/render";
import { Sidebar } from "../Sidebar";

/**
 * The dashboard shell is a named priority in the visual brief, and its
 * navigation had two defects that are invisible to a sighted user:
 *
 *  1. The current page was signalled ONLY by background colour. A screen
 *     reader user moving through the sidebar had no way to know where they
 *     were -- every item announced identically.
 *
 *  2. The unread count rendered as a bare number beside the label, so it
 *     read as "Leads 12" with nothing saying what the 12 was.
 */
describe("Sidebar accessibility", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("marks the current page with aria-current, not just colour", () => {
    renderWithProviders(<Sidebar />, { route: "/app/leads" });
    const current = screen.getAllByRole("link").filter(
      (a) => a.getAttribute("aria-current") === "page"
    );
    expect(current, "no link carries aria-current=page").toHaveLength(1);
    expect(current[0]).toHaveTextContent(/leads/i);
  });

  it("marks exactly one item, so the dashboard link does not also claim it", () => {
    // /app/leads starts with "/app", and the dashboard entry matches on
    // pathname === "/app" precisely to avoid claiming every child route. If
    // that check regresses, two links announce as current.
    renderWithProviders(<Sidebar />, { route: "/app/pipeline" });
    const current = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent(/pipeline/i);
  });

  it("never renders a count as a bare unlabelled number", () => {
    const { container } = renderWithProviders(<Sidebar />, {
      route: "/app",
      // Counts are supplied by the shell; pass one so the assertion has
      // something to bite on rather than passing vacuously when none render.
    });
    const badges = [...container.querySelectorAll("span")].filter((el) =>
      /^\d+$/.test((el.textContent ?? "").trim())
    );
    for (const badge of badges) {
      // A number visible to sighted users must either be hidden from
      // assistive tech with a labelled equivalent beside it, or carry its own
      // accessible name. "Leads 12" alone does not say what the 12 is.
      const hidden = badge.getAttribute("aria-hidden") === "true";
      const labelled = badge.parentElement?.querySelector(".sr-only");
      expect(
        hidden && labelled,
        `bare count "${badge.textContent}" with no accessible label`
      ).toBeTruthy();
    }
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<Sidebar />, { route: "/app" });
    const r = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(r.violations.map((v) => `${v.id}(${v.nodes.length})`)).toEqual([]);
  });
});
