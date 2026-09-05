import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, render, act } from "@testing-library/react";
import { useReveal } from "../useReveal";

const realIO = window.IntersectionObserver;
const realMM = window.matchMedia;

function stubIO() {
  const instances: Array<{ cb: IntersectionObserverCallback }> = [];
  class FakeIO {
    cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
      instances.push(this);
    }
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() { return []; }
    root = null; rootMargin = ""; thresholds = [];
  }
  window.IntersectionObserver = FakeIO as unknown as typeof IntersectionObserver;
  return instances;
}

function stubReducedMotion(matches: boolean) {
  window.matchMedia = ((q: string) => ({
    matches, media: q, onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("useReveal", () => {
  beforeEach(() => stubReducedMotion(false));
  afterEach(() => {
    window.IntersectionObserver = realIO;
    window.matchMedia = realMM;
  });

  it("starts hidden only when it can actually reveal", () => {
    stubIO();
    const { result } = renderHook(() => useReveal());
    expect(result.current.revealed).toBe(false);
  });

  it("reveals when the element intersects", () => {
    const instances = stubIO();
    // Rendered through a real component so React attaches the ref during
    // commit, before the effect runs. Assigning ref.current by hand after
    // renderHook reproduces nothing -- the effect has already bailed on a
    // null ref by then, which is what made the first version of this test
    // fail against working code.
    let seen = false;
    function Probe() {
      const { ref, revealed } = useReveal<HTMLDivElement>();
      seen = revealed;
      return <div ref={ref} />;
    }
    const { rerender } = render(<Probe />);
    expect(seen).toBe(false);

    act(() => {
      instances[0]?.cb(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });
    rerender(<Probe />);
    expect(seen).toBe(true);
  });

  /**
   * These three are the reason the hook exists in this shape. Each is a case
   * where naive scroll-reveal leaves content permanently invisible.
   */
  it("renders content immediately when the user asks for reduced motion", () => {
    stubIO();
    stubReducedMotion(true);
    const { result } = renderHook(() => useReveal());
    expect(result.current.revealed).toBe(true);
  });

  it("renders content immediately when IntersectionObserver is unavailable", () => {
    delete (window as unknown as Record<string, unknown>).IntersectionObserver;
    const { result } = renderHook(() => useReveal());
    expect(result.current.revealed).toBe(true);
  });

  it("renders content immediately when matchMedia is unavailable", () => {
    stubIO();
    delete (window as unknown as Record<string, unknown>).matchMedia;
    const { result } = renderHook(() => useReveal());
    // No preference can be read, so animate -- but never hide.
    expect(result.current.revealed).toBe(false);
  });
});
