import { isNativeApp } from "@/lib/native/platform";

// Permission to send personal data to third-party AI providers.
//
// App Store guideline 5.1.2(i) requires the app to say which AI providers
// receive personal data and to get the person's permission before the first
// send. Three features in the app send it: the assistant (Anthropic), lead
// insights when a lead is created or rescored (OpenAI) and call summaries
// (OpenAI). Each asks here first.
//
// Asked in the iOS / Android app only; the website is unchanged. Remembered
// per user on this device. A reinstall asks again, which errs the right way.

const key = (userId: string) => `rd.aiConsent.v1.${userId}`;

export function aiConsentRequired(): boolean {
  return isNativeApp();
}

/** True when AI features may send this user's data now. */
export function hasAiConsent(userId: string | null | undefined): boolean {
  if (!aiConsentRequired()) return true;
  if (!userId) return false;
  try {
    return Boolean(localStorage.getItem(key(userId)));
  } catch {
    return false;
  }
}

export function recordAiConsent(userId: string): void {
  try {
    localStorage.setItem(key(userId), new Date().toISOString());
  } catch {
    // Storage blocked: the person is asked again next time, nothing is sent.
  }
}

export function withdrawAiConsent(userId: string): void {
  try {
    localStorage.removeItem(key(userId));
  } catch {
    // Nothing stored, nothing to remove.
  }
}
