import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../Spinner";

/**
 * The point of this component is that it survives the two conditions the old
 * hand-rolled spinners failed: a screen reader, and reduced motion.
 */
describe("Spinner", () => {
  it("is announced, with text that says what is loading", () => {
    render(<Spinner label="Checking your subscription" />);
    // role="status" is what makes it a live region. The old spinners were bare
    // <div className="animate-spin" /> with nothing in the a11y tree at all.
    const status = screen.getByRole("status");
    expect(status).toBeTruthy();
    expect(status.textContent).toContain("Checking your subscription");
  });

  it("keeps the label visually hidden unless asked to show it", () => {
    const { rerender } = render(<Spinner label="Loading" />);
    expect(screen.getByText("Loading").className).toContain("sr-only");

    rerender(<Spinner label="Loading" showLabel />);
    expect(screen.getByText("Loading").className).not.toContain("sr-only");
  });

  it("hides the ring itself from assistive tech", () => {
    // The ring is decoration; the text carries the meaning. Announcing both
    // would be noise.
    const { container } = render(<Spinner label="Loading" />);
    const ring = container.querySelector(".rd-spinner");
    expect(ring?.getAttribute("aria-hidden")).toBe("true");
  });

  it("draws a full ring, so it is still visible when animation is suppressed", () => {
    // index.css sets animation-duration: 0.01ms !important under
    // prefers-reduced-motion, globally. A spinner styled only with border-b-2
    // and a spin becomes a stationary quarter-line -- indistinguishable from a
    // rendering artefact. Keeping all four borders means the shape reads as a
    // deliberate indicator even frozen.
    const { container } = render(<Spinner label="Loading" />);
    const cls = container.querySelector(".rd-spinner")?.className ?? "";
    expect(cls).toContain("rounded-full");
    expect(cls).toContain("border-rd-line");
    expect(cls).not.toContain("border-b-2");
  });
});
