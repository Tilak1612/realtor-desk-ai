import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDrawerA11y } from "../useDrawerA11y";

/**
 * The three faults this hook exists to fix, each asserted against a real
 * render rather than by reading the source.
 */

const realMM = window.matchMedia;

/** Pin the breakpoint so the drawer is in overlay (mobile) or rail (desktop). */
function mockViewport(isStatic: boolean) {
  window.matchMedia = ((q: string) => ({
    matches: isStatic,
    media: q,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { ref, drawerProps } = useDrawerA11y({ open, onClose, label: "Navigation" });
  return (
    <aside ref={ref} data-testid="drawer" {...drawerProps}>
      <button type="button">Close</button>
      <a href="/leads">Leads</a>
    </aside>
  );
}

afterEach(() => {
  window.matchMedia = realMM;
});

describe("useDrawerA11y", () => {
  describe("as an overlay, below the breakpoint", () => {
    beforeEach(() => mockViewport(false));

    it("leaves the tab order entirely when closed", () => {
      // -translate-x-full moves it out of sight but NOT out of the tab order.
      // That is the bug: keyboard users tabbed through invisible nav links.
      render(<Drawer open={false} onClose={() => {}} />);
      expect(screen.getByTestId("drawer").hasAttribute("inert")).toBe(true);
    });

    it("announces itself as a modal dialog when open", () => {
      render(<Drawer open onClose={() => {}} />);
      const drawer = screen.getByTestId("drawer");
      expect(drawer.getAttribute("role")).toBe("dialog");
      expect(drawer.getAttribute("aria-modal")).toBe("true");
      expect(drawer.getAttribute("aria-label")).toBe("Navigation");
      expect(drawer.hasAttribute("inert")).toBe(false);
    });

    it("closes on Escape", () => {
      const onClose = vi.fn();
      render(<Drawer open onClose={onClose} />);
      fireEvent.keyDown(window, { key: "Escape" });
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not hijack Escape while closed", () => {
      const onClose = vi.fn();
      render(<Drawer open={false} onClose={onClose} />);
      fireEvent.keyDown(window, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });

    it("moves focus into the drawer on open and back out on close", () => {
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      const { rerender } = render(<Drawer open={false} onClose={() => {}} />);
      rerender(<Drawer open onClose={() => {}} />);
      // Focus lands on the first control inside, not left behind the overlay.
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close" }));

      rerender(<Drawer open={false} onClose={() => {}} />);
      // And returns to whatever opened it, rather than falling to <body>.
      expect(document.activeElement).toBe(trigger);
      trigger.remove();
    });
  });

  describe("as a static rail, at the breakpoint and above", () => {
    beforeEach(() => mockViewport(true));

    it("is a plain navigation column, never a dialog", () => {
      // A permanently visible sidebar claiming aria-modal would tell a screen
      // reader the rest of the page is inert when it plainly is not.
      render(<Drawer open={false} onClose={() => {}} />);
      const drawer = screen.getByTestId("drawer");
      expect(drawer.getAttribute("role")).toBe(null);
      expect(drawer.getAttribute("aria-modal")).toBe(null);
      expect(drawer.hasAttribute("inert")).toBe(false);
    });

    it("ignores Escape", () => {
      const onClose = vi.fn();
      render(<Drawer open onClose={onClose} />);
      fireEvent.keyDown(window, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
