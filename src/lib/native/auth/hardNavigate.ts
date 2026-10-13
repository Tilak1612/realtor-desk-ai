/**
 * Leave the current page for `path` with a full reload, discarding everything
 * held in memory (React state, the query cache, the subscription context).
 *
 * In its own module only so tests can replace it: jsdom does not implement
 * navigation, and window.location cannot be spied on.
 */
export function hardNavigate(path: string): void {
  window.location.replace(path);
}
