const PRODUCT = 'realtordesk';
const IS_DEV = import.meta.env.DEV;
// Window.gtag is declared in vite-env.d.ts

/**
 * Has the visitor opted in to analytics?
 *
 * Both senders below used to fire unconditionally. Consent Mode alone is not
 * enough here: with analytics_storage denied Google still sends cookieless
 * pings, which is a transmission this product should not be making at all
 * given it sells PIPEDA and Quebec Law 25 competence. Law 25 requires opt-in
 * for tracking technology used to profile, so nothing leaves the page until
 * the visitor says yes.
 *
 * Defaults to false — an absent or malformed value means no consent, never
 * assumed consent.
 */
function analyticsAllowed(): boolean {
  try {
    const raw = localStorage.getItem('cookie-consent');
    if (!raw) return false;
    return JSON.parse(raw)?.analytics === true;
  } catch {
    return false;
  }
}

export const trackPageView = (path: string, title: string) => {
  if (typeof window.gtag !== 'function') return;
  if (!analyticsAllowed()) return;
  window.gtag('event', 'page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: title,
    product: PRODUCT,
  });
  if (IS_DEV) console.log('[GA4 PageView]', path, title);
};

export const trackEvent = (
  eventName: string,
  params: Record<string, unknown> = {}
) => {
  if (typeof window.gtag !== 'function') return;
  if (!analyticsAllowed()) return;
  const payload = {
    product: PRODUCT,
    page_path: window.location.pathname,
    page_location: window.location.href,
    ...params,
  };
  window.gtag('event', eventName, payload);
  if (IS_DEV) console.log('[GA4 Event]', eventName, payload);
};
