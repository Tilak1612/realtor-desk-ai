import { describe, it, expect, beforeEach } from "vitest";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { Sidebar } from "../Sidebar";
import { TopNav } from "../TopNav";
import { MarketingHeader } from "../MarketingHeader";

// Redesign chrome smoke: guards Phase I bilingual wiring. If a t() key
// is ever renamed without updating the fallback, or if the EN/FR toggle
// stops calling i18n.changeLanguage, these assertions fail fast.

describe("Sidebar", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("renders default nav labels in English", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("flips to French nav labels when i18n language is fr", async () => {
    const { i18n } = renderWithProviders(<Sidebar />);
    await act(async () => {
      await i18n.changeLanguage("fr");
    });
    expect(screen.getByText("Tableau de bord")).toBeInTheDocument();
    expect(screen.getByText("Clients potentiels")).toBeInTheDocument();
    expect(screen.getByText("Automatisation")).toBeInTheDocument();
    expect(screen.getByText("Rapports")).toBeInTheDocument();
  });
});

describe("TopNav", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("renders the live pill and search placeholder", () => {
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search leads, listings, conversations…")
    ).toBeInTheDocument();
  });

  it("EN/FR toggle is wired to i18n.changeLanguage", async () => {
    const user = userEvent.setup();
    const { i18n } = renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(i18n.language).toBe("en");

    await user.click(screen.getByRole("button", { name: "FR" }));
    expect(i18n.language).toBe("fr");

    // French strings should now be rendered.
    expect(screen.getByText("En direct")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Rechercher clients, inscriptions, conversations…")
    ).toBeInTheDocument();
  });
});

describe("MarketingHeader mobile drawer", () => {
  // Round-12 preview review surfaced that the drawer inherited the parent
  // nav's backdrop-blur + semi-transparent bg, rendering translucent over
  // the hero. The fix is four structural properties on the drawer element.
  // This test locks all four so any accidental className refactor fails CI.

  it("opens on hamburger click with opaque bg, z-50, no backdrop-filter, and a shadow", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<MarketingHeader />);

    // Drawer is conditionally rendered — click the hamburger first.
    const hamburger = screen.getByRole("button", { name: "Open menu" });
    await user.click(hamburger);

    // Match the drawer's own className signature: it's the only div that
    // carries both `md:hidden` and `absolute top-full`. Querying
    // container directly avoids relying on Tailwind class-selector
    // syntax that trips up the `closest()` matcher in JSDOM.
    const drawer = Array.from(container.querySelectorAll("div")).find((el) =>
      el.className.includes("md:hidden") &&
      el.className.includes("absolute") &&
      el.className.includes("top-full")
    ) as HTMLElement | undefined;
    expect(drawer, "drawer container should be present after opening").toBeTruthy();
    if (!drawer) return;

    const cls = drawer.className;
    // Z-index high enough to clear any hero decoration.
    expect(cls).toMatch(/\bz-50\b/);
    // Elevation + edge separation from the hero beneath.
    expect(cls).toMatch(/shadow-rd-lg/);
    expect(cls).toMatch(/border-b/);
    // Opaque background — paper tone default.
    expect(cls).toMatch(/\bbg-white\b/);
    // Inline style overrides the parent's backdrop-filter so translucency
    // from the nav bar doesn't bleed through onto the drawer.
    expect(drawer.style.backdropFilter).toBe("none");
  });
});
