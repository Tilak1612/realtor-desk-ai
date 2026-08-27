import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import Signup from "../Signup";

// This page renders the full auth shell, Radix primitives, the password
// strength meter and i18n. In jsdom a single render plus form fill routinely
// exceeds vitest's 5s default on a loaded machine, which made these tests
// intermittently red for reasons unrelated to the code under test. The work is
// real, so the budget is raised rather than the assertions weakened.
vi.setConfig({ testTimeout: 20000 });

// Guards the conversion + compliance contract of the signup form.

const signUp = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signUp: (...a: unknown[]) => signUp(...a),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));

describe("Signup form", () => {
  beforeEach(async () => {
    signUp.mockReset();
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("requires exactly three fields; brokerage and phone never block submit", async () => {
    const user = userEvent.setup({ delay: null });
    signUp.mockResolvedValue({ data: { user: { id: "u1" }, session: { access_token: "t" } }, error: null });
    renderWithProviders(<Signup />);

    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));

    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(1), { timeout: 5000 });
  });

  it("shows the terms notice adjacent to the CTA and links both documents", () => {
    renderWithProviders(<Signup />);
    expect(screen.getByText(/by continuing, you agree to our/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /terms of service/i })).toHaveAttribute("href", "/terms-of-service");
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy-policy");
  });

  it("records which legal versions were accepted, and when", async () => {
    const user = userEvent.setup({ delay: null });
    signUp.mockResolvedValue({ data: { user: { id: "u1" }, session: { access_token: "t" } }, error: null });
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));

    await waitFor(() => expect(signUp).toHaveBeenCalled(), { timeout: 5000 });
    const meta = signUp.mock.calls[0][0].options.data;
    expect(meta.terms_version).toBe("2026-04-22");
    expect(meta.privacy_version).toBe("2026-04-24");
    expect(Date.parse(meta.terms_accepted_at)).not.toBeNaN();
    // Untouched marketing box must never record consent.
    expect(meta.marketing_consent).toBe(false);
    expect(meta.marketing_consent_at).toBeNull();
  });

  it("records marketing consent only when the box is ticked (CASL)", async () => {
    const user = userEvent.setup({ delay: null });
    signUp.mockResolvedValue({ data: { user: { id: "u1" }, session: { access_token: "t" } }, error: null });
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByLabelText(/email me product updates/i));
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));

    await waitFor(() => expect(signUp).toHaveBeenCalled(), { timeout: 5000 });
    const meta = signUp.mock.calls[0][0].options.data;
    expect(meta.marketing_consent).toBe(true);
    expect(Date.parse(meta.marketing_consent_at)).not.toBeNaN();
  });

  it("rejects an invalid email without calling the API", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "not-an-email");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));
    expect(signUp).not.toHaveBeenCalled();
  });

  it("rejects a weak password without calling the API", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "weak");
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));
    expect(signUp).not.toHaveBeenCalled();
  });

  it("preserves entered values when the request fails", async () => {
    const user = userEvent.setup({ delay: null });
    signUp.mockRejectedValue(new Error("Network request failed"));
    renderWithProviders(<Signup />);

    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument(), { timeout: 5000 });
    expect(screen.getByLabelText("Full Name *(required)")).toHaveValue("Jane Tremblay");
    expect(screen.getByLabelText("Email *(required)")).toHaveValue("jane@brokerage.ca");
  });

  it("marketing consent is never pre-checked (CASL / Law 25)", () => {
    renderWithProviders(<Signup />);
    expect(screen.getByLabelText(/email me product updates/i)).not.toBeChecked();
  });

  it("does not fold marketing consent into the continue notice", () => {
    renderWithProviders(<Signup />);
    // Passive consent is not a lawful basis for commercial email under CASL.
    expect(screen.getByText(/by continuing, you agree to our/i).textContent)
      .not.toMatch(/marketing|updates|tips/i);
  });

  it("does not render a confirm-password field", () => {
    renderWithProviders(<Signup />);
    expect(screen.queryByLabelText(/confirm password/i)).not.toBeInTheDocument();
  });

  it("discloses billing before checkout without claiming a trial has started", () => {
    renderWithProviders(<Signup />);
    expect(screen.getByText(/you are not charged today/i)).toBeInTheDocument();
    expect(screen.getByText(/stripe-hosted checkout/i)).toBeInTheDocument();
    expect(screen.getByText(/if you started your trial today/i)).toBeInTheDocument();
  });

  it("names the offer in the CTA rather than 'Create Account'", () => {
    renderWithProviders(<Signup />);
    expect(screen.getByRole("button", { name: /start my .* free trial/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^create account$/i })).not.toBeInTheDocument();
  });

  it("renders the French offer and billing copy", async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("fr");
    });
    renderWithProviders(<Signup />);
    expect(screen.getByText(/rien ne vous est facturé aujourd'hui/i)).toBeInTheDocument();
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });
});
