import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import Signup from "../Signup";

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
    const user = userEvent.setup();
    signUp.mockResolvedValue({ data: { user: { id: "u1" }, session: { access_token: "t" } }, error: null });
    renderWithProviders(<Signup />);

    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByLabelText(/i agree to the/i));
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));

    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(1));
  });

  it("blocks submission when the terms box is unchecked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));
    expect(signUp).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without calling the API", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "not-an-email");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByLabelText(/i agree to the/i));
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));
    expect(signUp).not.toHaveBeenCalled();
  });

  it("rejects a weak password without calling the API", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Signup />);
    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "weak");
    await user.click(screen.getByLabelText(/i agree to the/i));
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));
    expect(signUp).not.toHaveBeenCalled();
  });

  it("preserves entered values when the request fails", async () => {
    const user = userEvent.setup();
    signUp.mockRejectedValue(new Error("Network request failed"));
    renderWithProviders(<Signup />);

    await user.type(screen.getByLabelText("Full Name *(required)"), "Jane Tremblay");
    await user.type(screen.getByLabelText("Email *(required)"), "jane@brokerage.ca");
    await user.type(screen.getByLabelText("Password *(required)"), "Str0ngPassw0rd!");
    await user.click(screen.getByLabelText(/i agree to the/i));
    await user.click(screen.getByRole("button", { name: /start my .* free trial/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByLabelText("Full Name *(required)")).toHaveValue("Jane Tremblay");
    expect(screen.getByLabelText("Email *(required)")).toHaveValue("jane@brokerage.ca");
  });

  it("neither consent box is pre-checked (CASL / Law 25)", () => {
    renderWithProviders(<Signup />);
    expect(screen.getByLabelText(/i agree to the/i)).not.toBeChecked();
    expect(screen.getByLabelText(/email me product updates/i)).not.toBeChecked();
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
