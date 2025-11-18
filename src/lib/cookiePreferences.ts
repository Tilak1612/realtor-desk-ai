/**
 * Cookie Preferences Management Utility
 * Provides functions to manage and retrieve cookie consent preferences
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
}

/**
 * Get current cookie preferences from localStorage
 */
export const getCookiePreferences = (): CookiePreferences | null => {
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) return null;
  
  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
};

/**
 * Save cookie preferences to localStorage
 */
export const saveCookiePreferences = (preferences: Omit<CookiePreferences, 'timestamp'>): void => {
  const consent: CookiePreferences = {
    ...preferences,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem("cookie-consent", JSON.stringify(consent));
};

/**
 * Clear cookie preferences (prompts banner to show again)
 */
export const clearCookiePreferences = (): void => {
  localStorage.removeItem("cookie-consent");
};

/**
 * Check if specific cookie type is enabled
 */
export const isCookieEnabled = (type: keyof Omit<CookiePreferences, 'timestamp'>): boolean => {
  const prefs = getCookiePreferences();
  if (!prefs) return false;
  return prefs[type] === true;
};
