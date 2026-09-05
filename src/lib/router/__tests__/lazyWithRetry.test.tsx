import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { lazyWithRetry } from "../lazyWithRetry";

const RELOAD_KEY = "rd:chunk-reload";
const realLocation = window.location;

function stubReload() {
  const reload = vi.fn();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...realLocation, reload },
  });
  return reload;
}

function Ok() {
  return <p>route content</p>;
}

/**
 * Guards the production failure this exists for: a deploy lands while a tab is
 * open, the chunk names in the loaded document stop existing, and Vercel's SPA
 * rewrite answers the missing .js with index.html. The import rejects with a
 * MIME error and, before this wrapper, the route silently never rendered.
 */
describe("lazyWithRetry", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: realLocation,
    });
  });

  it("renders the route when the chunk loads", async () => {
    const C = lazyWithRetry(async () => ({ default: Ok }));
    render(<Suspense fallback={<span>loading</span>}><C /></Suspense>);
    expect(await screen.findByText("route content")).toBeInTheDocument();
  });

  it("reloads once when the chunk is missing", async () => {
    const reload = stubReload();
    const C = lazyWithRetry(async () => {
      throw new TypeError("Failed to fetch dynamically imported module");
    });
    render(<Suspense fallback={<span>loading</span>}><C /></Suspense>);

    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    expect(sessionStorage.getItem(RELOAD_KEY)).toBe("1");
  });

  it("does not reload a second time — a real failure must surface", async () => {
    // The flag survives the reload, so the retried load that fails again is a
    // genuine error, not a stale chunk. Reloading again would loop forever.
    sessionStorage.setItem(RELOAD_KEY, "1");
    const reload = stubReload();
    const err = new TypeError("Failed to fetch dynamically imported module");
    const C = lazyWithRetry(async () => { throw err; });

    // The rejection propagates to React; swallow the console noise.
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <Suspense fallback={<span>loading</span>}>
        <C />
      </Suspense>
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(reload).not.toHaveBeenCalled();
  });

  it("clears the flag after a successful load so a later deploy still recovers", async () => {
    sessionStorage.setItem(RELOAD_KEY, "1");
    const C = lazyWithRetry(async () => ({ default: Ok }));
    render(<Suspense fallback={<span>loading</span>}><C /></Suspense>);

    await screen.findByText("route content");
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeNull();
  });
});
