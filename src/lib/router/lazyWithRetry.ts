import { lazy, type ComponentType } from "react";

/**
 * React.lazy that survives a deploy happening under an open tab.
 *
 * Every route in this app is code-split, and each build stamps its chunks
 * with a fresh content hash. When a deploy lands, the chunks the *currently
 * loaded* page references stop existing. Vercel's SPA rewrite then answers
 * the request for a missing `.js` with `index.html`, so the browser reports
 *
 *   Expected a JavaScript-or-Wasm module script but the server responded
 *   with a MIME type of "text/html"
 *
 * rather than a 404, and the dynamic import rejects. Without a guard the
 * route simply never renders: the user clicks a link and nothing happens,
 * for as long as the tab stays open. This was observed in production.
 *
 * One reload fixes it, because the reload fetches the new index.html and with
 * it the new chunk names. The reload is recorded in sessionStorage so a
 * genuine, persistent failure -- a chunk that really is missing, an offline
 * device -- surfaces as an error instead of an infinite refresh loop. The
 * flag is per-tab and cleared on the next successful chunk load, so a second
 * deploy later in the same session is still handled.
 */

const RELOAD_KEY = "rd:chunk-reload";

/** sessionStorage throws outright in some privacy modes; never let that be the failure. */
function safeSession(): Storage | null {
  try {
    const s = window.sessionStorage;
    const probe = "__rd_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      // Getting here means chunks resolve again; allow a future deploy to
      // trigger its own single reload.
      safeSession()?.removeItem(RELOAD_KEY);
      return mod;
    } catch (error) {
      const session = safeSession();
      const alreadyReloaded = session?.getItem(RELOAD_KEY) === "1";

      if (!alreadyReloaded && typeof window !== "undefined") {
        session?.setItem(RELOAD_KEY, "1");
        window.location.reload();
        // Deliberately never settles. The reload replaces the document, and
        // resolving or rejecting here would race a teardown that is already
        // under way.
        return new Promise<never>(() => {});
      }

      // Second failure: this is not a stale chunk. Let the error boundary
      // handle it rather than reloading forever.
      throw error;
    }
  });
}
