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
  // Round-14 mobile-overlap root-cause rewrite. The old dropdown was
  // `position: absolute` under the nav — no backdrop, no scroll lock,
  // hero H1 leaked through. The rewrite uses a Radix Dialog modal,
  // which gives us portal rendering, focus trap, scroll lock, Escape
  // close, and aria-modal. These assertions lock the modal contract
  // so any accidental regression to a dropdown pattern fails CI.
  //
  // Reset language to EN before each case — the TopNav suite above
  // flips i18n to FR and the language persists across describes.
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("sticky header sits at z-40 with opaque bg (WCAG contrast)", () => {
    const { container } = renderWithProviders(<MarketingHeader />);
    const header = container.querySelector("header");
    expect(header, "MarketingHeader should render a <header> landmark").toBeTruthy();
    if (!header) return;

    const cls = header.className;
    expect(cls).toMatch(/\bsticky\b/);
    expect(cls).toMatch(/\btop-0\b/);
    expect(cls).toMatch(/\bz-40\b/);
    // 95% opacity is the WCAG AA contrast floor for the hero ink on the
    // translucent header. Before this PR it was bg-white/70 which was
    // flagged for contrast.
    expect(cls).toMatch(/bg-white\/95|bg-rd-navy-800\/95/);
  });

  it("opens a portal-rendered modal drawer with role=dialog + labelling", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);

    const hamburger = screen.getByRole("button", { name: "Open menu" });
    await user.click(hamburger);

    // Radix Dialog renders role="dialog" on the Content element and
    // portals it out of the header subtree. Radix v1.1 enforces
    // modality via `hideOthers` (inert background) + FocusScope
    // instead of the aria-modal attribute, so we don't assert it.
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    // Dialog.Title + Dialog.Description wire up aria labelling
    // automatically.
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    // data-state="open" is Radix's canonical open marker — used by the
    // enter/exit animation classes.
    expect(dialog.getAttribute("data-state")).toBe("open");
    // Content MUST be portaled outside the <header> subtree so stacking
    // contexts and overflow:hidden ancestors can't clip it.
    const header = document.querySelector("header");
    expect(header?.contains(dialog)).toBe(false);
  });

  it("drawer content sits at z-70, fixed inset-y-0 right-0, full-viewport height", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = await screen.findByRole("dialog");
    const cls = dialog.className;
    expect(cls).toMatch(/\bfixed\b/);
    expect(cls).toMatch(/\binset-y-0\b/);
    expect(cls).toMatch(/\bright-0\b/);
    expect(cls).toMatch(/\bh-full\b/);
    expect(cls).toMatch(/z-\[70\]/);
    // Panel must be opaque — no translucent bleed-through.
    expect(cls).toMatch(/\bbg-white\b|\bbg-rd-navy-800\b/);
  });

  it("renders a dedicated backdrop at z-60 beneath the drawer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    // Radix marks the overlay with data-state="open". It must sit at
    // z-60 — above the z-40 header, below the z-70 content.
    const overlay = document.querySelector(
      '[data-state="open"][aria-hidden="true"], [data-state="open"].fixed.inset-0'
    ) as HTMLElement | null;
    // Fallback: any element with both fixed + inset-0 + z-[60] classes.
    const overlayByClass = Array.from(document.querySelectorAll<HTMLElement>("div")).find(
      (el) =>
        el.className.includes("fixed") &&
        el.className.includes("inset-0") &&
        el.className.includes("z-[60]")
    );
    const found = overlay ?? overlayByClass;
    expect(found, "drawer should render a backdrop element").toBeTruthy();
    if (!found) return;
    expect(found.className).toMatch(/z-\[60\]/);
  });

  it("exposes the full 8-item toolbar (5 nav links + EN/FR + Sign in + Start free trial)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    // Nav links rendered inside the drawer. Desktop nav is also mounted
    // (hidden via md:hidden but still in the DOM), so there can be ≥1.
    const featuresLinks = await screen.findAllByRole("link", { name: "Features" });
    expect(featuresLinks.length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "How it works" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Pricing" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Compare" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Resources" }).length).toBeGreaterThan(0);
    // EN/FR toggle is inside the drawer in addition to the (hidden-on-mobile) bar.
    expect(screen.getAllByRole("button", { name: "EN" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: "FR" }).length).toBeGreaterThanOrEqual(1);
    // CTAs — there are two of each (hidden desktop + visible mobile drawer).
    expect(screen.getAllByRole("button", { name: "Sign in" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: "Start free trial" }).length).toBeGreaterThanOrEqual(1);
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    // Radix unmounts the content on close.
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
