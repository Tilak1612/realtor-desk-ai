/**
 * The demo booking destination, in one place.
 *
 * It is a public URL, not a secret: the Cal.com embed is unauthenticated and
 * needs no API key, which is why nothing here is read from the environment.
 * Putting it behind a VITE_ variable would imply a secret that does not exist
 * and add a way for the booking page to break in one environment only.
 *
 * Every Book-a-Demo control in the app routes to CAL_ROUTE, and only the
 * booking page itself touches the cal.com URLs -- so the calendar can be
 * moved, renamed or replaced by editing this file.
 */

/** Where every in-app "Book a demo" control points. */
export const CAL_ROUTE = "/demo";

/** The public booking page, used verbatim as the embed's fallback link. */
export const CAL_EVENT_URL = "https://cal.com/team/brainfy-ai/realtordesk-demo";

/**
 * The cal.com link slug -- CAL_EVENT_URL without the origin. The embed takes
 * this form, and deriving it from the URL above keeps the two from drifting
 * apart when one of them is edited.
 */
export const CAL_LINK = CAL_EVENT_URL.replace(/^https?:\/\/cal\.com\//, "");

/**
 * Namespaces an embed instance. Cal keys its API calls and its `on` handlers
 * by this, so a page holding more than one calendar keeps their events
 * separate rather than firing every handler for every booking.
 */
export const CAL_NAMESPACE = "realtordesk-demo";
