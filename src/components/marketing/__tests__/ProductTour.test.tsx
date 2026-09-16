import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductTour } from "../ProductTour";

/**
 * The product walkthrough is a CONTENT video. These pin the obligations that
 * come with that, and the rule that a phone pays nothing until it is tapped.
 */

const realMM = window.matchMedia;
const realIO = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
let playSpy: ReturnType<typeof vi.fn>;
let pauseSpy: ReturnType<typeof vi.fn>;
let ioCallback: ((e: Array<{ isIntersecting: boolean }>) => void) | null = null;

function mockMedia(q: Record<string, boolean>) {
  window.matchMedia = ((query: string) => ({
    matches: !!q[query],
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function renderTour() {
  return render(
    <MemoryRouter>
      <ProductTour />
    </MemoryRouter>
  );
}

beforeEach(() => {
  // jsdom does not implement media playback.
  playSpy = vi.fn(function (this: HTMLMediaElement) {
    Object.defineProperty(this, "paused", { value: false, configurable: true });
    return Promise.resolve();
  });
  pauseSpy = vi.fn(function (this: HTMLMediaElement) {
    Object.defineProperty(this, "paused", { value: true, configurable: true });
  });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playSpy as never);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pauseSpy as never);
  ioCallback = null;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = class {
    constructor(cb: typeof ioCallback) {
      ioCallback = cb;
    }
    observe() {}
    disconnect() {}
  };
});

afterEach(() => {
  window.matchMedia = realMM;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = realIO;
  vi.restoreAllMocks();
});

describe("ProductTour", () => {
  it("is marked up as content, not decoration", () => {
    mockMedia({ "(min-width: 1024px)": true });
    const { container } = renderTour();
    const video = container.querySelector("video")!;
    // A product demo carries information; hiding it from a screen reader
    // would be wrong. It needs a name instead.
    expect(video.getAttribute("aria-hidden")).toBeNull();
    expect((video.getAttribute("aria-label") || "").length).toBeGreaterThan(10);
    expect(container.querySelector("figcaption")).toBeTruthy();
  });

  it("fetches nothing up front and never uses the autoplay attribute", () => {
    mockMedia({ "(min-width: 1024px)": true });
    const { container } = renderTour();
    const video = container.querySelector("video")!;
    expect(video.getAttribute("preload")).toBe("none");
    // The attribute cannot see reduced motion or the breakpoint.
    expect(video.hasAttribute("autoplay")).toBe(false);
    expect(video.muted).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.getAttribute("poster")).toBeTruthy();
  });

  it("offers webm and mp4, with the smaller encode first for phones", () => {
    mockMedia({});
    const { container } = renderTour();
    const sources = [...container.querySelectorAll("source")];
    expect(sources.map((s) => s.getAttribute("type"))).toEqual([
      "video/webm",
      "video/mp4",
      "video/webm",
      "video/mp4",
    ]);
    expect(sources[0].getAttribute("media")).toBe("(max-width: 767px)");
    expect(sources[2].getAttribute("media")).toBeNull();
  });

  it("has a pause control wired to the video (WCAG 2.2.2)", () => {
    mockMedia({ "(min-width: 1024px)": true });
    renderTour();
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-controls")).toBe("product-tour-video");
  });

  it("keeps the control's accessible name when its label is visually hidden", () => {
    // Below sm the control is icon-only and the text is sr-only. sr-only text
    // is still in the accessibility tree, so the name must survive -- an
    // icon-only button with no name is exactly the failure to avoid.
    mockMedia({ "(max-width: 767px)": true });
    renderTour();
    // Matches the translated label, or the key if i18n is not initialised here.
    expect(
      screen.getByRole("button", { name: /walkthrough|visite|productTour\.(play|pause)/i })
    ).toBeTruthy();
    // The glyph is decoration and must not be part of the name.
    expect(screen.getByRole("button").querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it("plays on desktop once half of it is on screen, and pauses when it leaves", () => {
    mockMedia({ "(min-width: 1024px)": true });
    renderTour();
    ioCallback!([{ isIntersecting: true }]);
    expect(playSpy).toHaveBeenCalledTimes(1);
    ioCallback!([{ isIntersecting: false }]);
    expect(pauseSpy).toHaveBeenCalledTimes(1);
  });

  it("never starts by itself on a phone", () => {
    mockMedia({ "(max-width: 767px)": true });
    renderTour();
    // No observer is even created below the breakpoint.
    expect(ioCallback).toBeNull();
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("never starts by itself when reduced motion is requested", () => {
    mockMedia({ "(min-width: 1024px)": true, "(prefers-reduced-motion: reduce)": true });
    renderTour();
    expect(ioCallback).toBeNull();
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("does not let autoplay override an explicit pause", () => {
    mockMedia({ "(min-width: 1024px)": true });
    renderTour();
    ioCallback!([{ isIntersecting: true }]);
    expect(playSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button")); // user pauses
    expect(pauseSpy).toHaveBeenCalledTimes(1);
    ioCallback!([{ isIntersecting: false }]);
    ioCallback!([{ isIntersecting: true }]); // scrolls back
    expect(playSpy).toHaveBeenCalledTimes(1); // still paused
  });

  it("plays when a phone visitor taps it", () => {
    mockMedia({ "(max-width: 767px)": true });
    renderTour();
    fireEvent.click(screen.getByRole("button"));
    expect(playSpy).toHaveBeenCalledTimes(1);
  });
});
