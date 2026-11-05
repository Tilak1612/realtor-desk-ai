import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * /account-deletion, the URL that goes in the App Store and Google Play
 * listings. Google Play checks that it names the app and the developer and
 * says how to ask for deletion without the app; the rest of what is pinned
 * here is that the page keeps agreeing with the code and the Privacy Policy
 * instead of drifting into promises nobody keeps.
 */

vi.setConfig({ testTimeout: 20000 });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

import AccountDeletion from "../AccountDeletion";

const ROOT = join(__dirname, "..", "..", "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

describe("/account-deletion", () => {
  it("names the app and the developer", () => {
    renderWithProviders(<AccountDeletion />, { route: "/account-deletion" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Delete your Realtor Desk account");
    expect(screen.getAllByText(/Brainfy AI Inc\./).length).toBeGreaterThan(0);
  });

  it("gives the in-app steps and a way to ask without signing in", () => {
    renderWithProviders(<AccountDeletion />, { route: "/account-deletion" });
    const main = screen.getByRole("main").textContent ?? "";
    expect(main).toMatch(/Open Settings/);
    expect(main).toMatch(/Delete my account/);
    expect(main).toMatch(/DELETE in English, SUPPRIMER in French/);
    expect(main).toMatch(/If you cannot sign in/);
  });

  it("uses the privacy address the Privacy Policy publishes, and no other", () => {
    const policy = read("src/pages/PrivacyPolicy.tsx");
    const published = policy.match(/Privacy Matters:<\/strong>\s*([\w.+-]+@[\w.-]+)/)?.[1];
    expect(published).toBe("privacy@realtordesk.ai");

    renderWithProviders(<AccountDeletion />, { route: "/account-deletion" });
    const mailtos = screen
      .getByRole("main")
      .querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]');
    expect(mailtos.length).toBeGreaterThan(0);
    for (const a of mailtos) expect(a.getAttribute("href")).toBe("mailto:" + published);
  });

  it("states the same backup period as the Privacy Policy", () => {
    expect(read("src/pages/PrivacyPolicy.tsx")).toMatch(/backups with 30-day retention/);
    renderWithProviders(<AccountDeletion />, { route: "/account-deletion" });
    expect(screen.getByRole("main").textContent).toMatch(/Up to 30 days/);
  });

  it("says what is kept and that billing stops, and promises nothing the function does not do", () => {
    renderWithProviders(<AccountDeletion />, { route: "/account-deletion" });
    const main = screen.getByRole("main").textContent ?? "";
    expect(main).toMatch(/do-not-email list/);
    expect(main).toMatch(/Stripe/);
    expect(main).toMatch(/cancelled immediately, before\s+anything is deleted/);
    expect(main).not.toMatch(/confirmation email|confirm by email|refund/i);
    // Its own tables are the ones the function really handles.
    const fn = read("supabase/functions/delete-account/deletion.ts");
    expect(fn).toMatch(/RETAINED_TABLES = \["email_suppressions"\]/);
  });

  it("sets a title and description within the SERP budgets, as literals the prerenderer can read", async () => {
    const src = read("src/pages/AccountDeletion.tsx");
    const title = src.match(/<SEO\s+title="([^"]+)"/)?.[1] ?? "";
    const description = src.match(/description="([^"]+)"/)?.[1] ?? "";
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThan(50);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(src).toMatch(/canonicalUrl="https:\/\/www\.realtordesk\.ai\/account-deletion"/);

    renderWithProviders(<AccountDeletion />, { route: "/account-deletion" });
    await waitFor(() => expect(document.title).toBe(title));
  });
});
