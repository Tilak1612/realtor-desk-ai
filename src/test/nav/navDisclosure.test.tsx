import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { MarketingHeader } from "@/components/rd/layout/MarketingHeader";
import { SOLUTIONS_PANES } from "@/config/siteNav";

// The disclosure behaviours the brief calls out by name. Each one here is a
// menu bug we would otherwise only find by hand at some width on some device:
// two panels open at once, Escape leaving focus stranded, a panel that cannot
// be reached because it closes on the way, or a "Platform" selector that
// switches content but never navigates.

const openMenu = async (user: ReturnType<typeof userEvent.setup>, name: string) => {
  const trigger = screen.getByRole("button", { name: new RegExp(`^${name}`) });
  await user.click(trigger);
  return trigger;
};

describe("desktop nav disclosures", () => {
  it("opens a panel on click and marks the trigger expanded", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);

    const trigger = await openMenu(user, "Who we help");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Agents/ })).toBeTruthy();
  });

  it("keeps at most one panel open", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);

    const who = await openMenu(user, "Who we help");
    expect(who).toHaveAttribute("aria-expanded", "true");

    const solutions = await openMenu(user, "Solutions");
    expect(solutions).toHaveAttribute("aria-expanded", "true");
    expect(who, "opening Solutions should have closed Who we help").toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("does not let a closing menu shut the one that replaced it", async () => {
    // Moving the pointer from one trigger to the next fires mouseleave on the
    // first and mouseenter on the second. The first schedules a close; if that
    // timer fires blind it lands after the second has opened and blinks it
    // shut. Waiting past the delay is the whole point of this test.
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);

    await openMenu(user, "Who we help");
    const solutions = await openMenu(user, "Solutions");

    await new Promise((r) => setTimeout(r, 250));
    expect(
      solutions,
      "the neighbouring menu's close timer should not have closed this one",
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);

    const trigger = await openMenu(user, "Resources");
    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    // Focus return is the part people skip; without it Escape drops the
    // keyboard user back at the top of the document.
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when a pointer goes down outside the menu", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);

    const trigger = await openMenu(user, "Company");
    await user.click(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("switches Solutions panes on keyboard focus, not only hover", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await openMenu(user, "Solutions");

    const [first, second] = SOLUTIONS_PANES;
    // "Platform" the selector and "Platform overview" the link both live in
    // this panel, so scope selector queries to the selector list.
    const selectors = within(screen.getByRole("list", { name: "Solutions categories" }));

    // The first pane's contents are showing.
    expect(screen.getByRole("link", { name: new RegExp(first.items[0].label) })).toBeTruthy();

    // Focusing the second selector — no pointer involved — must swap the pane.
    // A hover-only implementation fails here, which is the point.
    selectors.getByRole("link", { name: new RegExp(`^${second.label}`) }).focus();
    expect(
      await screen.findByRole("link", { name: new RegExp(second.items[0].label) }),
      `focusing "${second.label}" should reveal its links`,
    ).toBeTruthy();
  });

  it("keeps each Solutions pane selector a navigable link", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await openMenu(user, "Solutions");

    const selectors = within(screen.getByRole("list", { name: "Solutions categories" }));
    for (const pane of SOLUTIONS_PANES) {
      const selector = selectors.getByRole("link", { name: new RegExp(`^${pane.label}`) });
      expect(selector, `"${pane.label}" selector should link to ${pane.to}`).toHaveAttribute(
        "href",
        pane.to,
      );
    }
  });

  it("describes every link in an open panel", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MarketingHeader />);
    await openMenu(user, "Who we help");

    for (const link of screen.getAllByRole("link", { name: /Agents|Teams|Brokerages/ })) {
      // Two lines: the label and its one-sentence description.
      expect(within(link).getAllByText(/\S/).length).toBeGreaterThan(1);
    }
  });
});
