import { describe, it, expect, beforeEach } from "vitest";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { Sidebar } from "../Sidebar";
import { TopNav } from "../TopNav";
import { MarketingHeader } from "../MarketingHeader";
import { PRIMARY_NAV } from "@/config/siteNav";

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

  // The command search box and the notification bell were removed: neither
  // had a handler, so both rendered as live controls that silently did
  // nothing. These assert they stay gone until something real backs them.
  it("does not render a search box it cannot serve", () => {
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(
      screen.queryByPlaceholderText(/Search leads, listings, conversations/)
    ).not.toBeInTheDocument();
  });

  it("does not render a notification bell with no notification system", () => {
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(screen.queryByLabelText("Notifications")).not.toBeInTheDocument();
  });

  it("exposes an account menu, which is the only way to sign out of /app", () => {
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(screen.getByLabelText("Account menu")).toBeInTheDocument();
  });

  // The "Live" pill and the unread dot used to default to ON and no caller
  // ever passed either, so every page showed a green Live badge and a red
  // notification dot for a notification system that does not exist. They now
  // default OFF and only appear when something real sets them.
  it("does not claim Live or unread unless told to", () => {
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(screen.queryByText("Live")).not.toBeInTheDocument();
  });

  it("renders the live pill when isLive is passed", () => {
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} isLive />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("EN/FR toggle is wired to i18n.changeLanguage", async () => {
    const user = userEvent.setup();
    const { i18n } = renderWithProviders(<TopNav agent={{ name: "Sarah K." }} isLive />);
    expect(i18n.language).toBe("en");

    await user.click(screen.getByRole("button", { name: "FR" }));
    expect(i18n.language).toBe("fr");

    // French strings should now be rendered.
    expect(screen.getByText("En direct")).toBeInTheDocument();
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

  it("exposes every registry group and its links, plus EN/FR and the three actions", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");

    // The drawer is registry-driven, so assert against the registry rather
    // than a hardcoded list — that is the property worth pinning. A group with
    // a `to` is a plain link; the rest are <details> whose summary carries the
    // label and whose children are the links.
    for (const g of PRIMARY_NAV) {
      if (g.to) {
        expect(
          screen.getAllByRole("link", { name: g.label }).length,
          `drawer is missing the "${g.label}" link`,
        ).toBeGreaterThan(0);
        continue;
      }
      const summaries = screen.getAllByText(g.label, { selector: "summary" });
      expect(summaries.length, `drawer is missing the "${g.label}" group`).toBeGreaterThan(0);

      // Open it and confirm its children are reachable. <details> children are
      // in the DOM either way, so this checks the disclosure actually toggles.
      const details = summaries[0].closest("details") as HTMLDetailsElement;
      expect(details.open, `"${g.label}" should start collapsed`).toBe(false);
      await user.click(summaries[0]);
      expect(details.open, `"${g.label}" should expand on click`).toBe(true);

      const children = [...(g.items ?? []), ...(g.panes ?? []).flatMap((p) => p.items)];
      for (const child of children) {
        expect(
          details.querySelector(`a[href="${child.to}"]`),
          `"${g.label}" should link to ${child.to}`,
        ).toBeTruthy();
      }
    }

    // EN/FR toggle is inside the drawer in addition to the (hidden-on-mobile) bar.
    expect(screen.getAllByRole("button", { name: "EN" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: "FR" }).length).toBeGreaterThanOrEqual(1);
    // CTAs — there are two of each (hidden desktop + visible mobile drawer).
    //
    // role "link", not "button". These used to be <Link><RDButton/></Link>,
    // and it was the nested <button> that answered to role "button" — invalid
    // HTML that also gave each control two tab stops and emitted no analytics.
    // They are CtaLink now, which renders one anchor. A control that navigates
    // is a link, which is what the nav-link assertions above already expect.
    expect(screen.getAllByRole("link", { name: "Sign in" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: "Start free trial" }).length).toBeGreaterThanOrEqual(1);
    // The booking CTA, added to both the drawer and the lg+ header.
    expect(screen.getAllByRole("link", { name: "Book a demo" }).length).toBeGreaterThanOrEqual(1);
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
