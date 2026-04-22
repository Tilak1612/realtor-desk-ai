import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// JSDOM doesn't ship window.matchMedia — polyfill as a stub so any
// component that subscribes to a media query (sticky-header breakpoint
// listener, prefers-reduced-motion, etc.) can mount under the test
// environment without crashing. Tests that assert on media-query
// behavior can override `matches` per-call.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  cleanup();
});
