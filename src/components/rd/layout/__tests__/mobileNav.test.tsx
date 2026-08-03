import { describe, it, expect, beforeEach } from "vitest";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { Sidebar } from "../Sidebar";
import { TopNav } from "../TopNav";

// Guards the mobile drawer.
//
// Before this, Sidebar was an unconditional `w-[240px] flex-shrink-0` column
// at every viewport, so a 375px phone got ~135px of usable content and there
// was no control anywhere that opened navigation. These assertions fail if
// the drawer regresses back to a static rail or loses its toggle.

describe("mobile navigation drawer", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("hides the rail off-canvas when closed and shows it when open", () => {
    const { unmount } = renderWithProviders(<Sidebar open={false} />);
    // The <aside> is the nav landmark's container; grab it by id.
    const closed = document.getElementById("rd-app-nav")!;
    expect(closed.className).toContain("-translate-x-full");
    // It must still be a static rail from lg up regardless of drawer state.
    expect(closed.className).toContain("lg:static");
    expect(closed.className).toContain("lg:translate-x-0");
    unmount();

    renderWithProviders(<Sidebar open />);
    const open = document.getElementById("rd-app-nav")!;
    expect(open.className).toContain("translate-x-0");
    expect(open.className).not.toContain("-translate-x-full");
  });

  it("closes when a nav destination is chosen", async () => {
    const user = userEvent.setup();
    let closed = 0;
    renderWithProviders(<Sidebar open onClose={() => (closed += 1)} />);

    await user.click(screen.getByText("Leads"));
    expect(closed).toBe(1);
  });

  it("closes from the drawer's own close control", async () => {
    const user = userEvent.setup();
    let closed = 0;
    renderWithProviders(<Sidebar open onClose={() => (closed += 1)} />);

    await user.click(screen.getByLabelText("Close navigation"));
    expect(closed).toBe(1);
  });

  it("exposes a topbar control that opens the drawer", async () => {
    const user = userEvent.setup();
    let opened = 0;
    renderWithProviders(
      <TopNav agent={{ name: "Test Agent" }} onMenuClick={() => (opened += 1)} />,
    );

    const toggle = screen.getByLabelText("Open navigation");
    // Present for assistive tech, and pointed at the drawer it controls.
    expect(toggle).toHaveAttribute("aria-controls", "rd-app-nav");
    await user.click(toggle);
    expect(opened).toBe(1);
  });
});

describe("Sidebar Desk AI panel", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  // It used to default to "Answered 47 leads this week. Avg response 38s."
  // for everyone — invented numbers presented as the user's own performance.
  it("is omitted when no real figures are supplied", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.queryByText(/leads this week/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/47/)).not.toBeInTheDocument();
  });

  it("renders when real figures are supplied", () => {
    renderWithProviders(
      <Sidebar deskStatus={{ leadsThisWeek: 3, avgResponse: "12s" }} />,
    );
    expect(screen.getByText(/leads this week/i)).toBeInTheDocument();
  });
});
