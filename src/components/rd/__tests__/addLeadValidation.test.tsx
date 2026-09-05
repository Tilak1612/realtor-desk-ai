import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// The dialog reaches Supabase and the leads cache; neither is under test here.
vi.mock("@/hooks/rd/useCreateLead", () => ({
  useCreateLead: () => ({ mutateAsync: vi.fn().mockResolvedValue({ id: "x" }), isPending: false }),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import { AddLeadDialog } from "../AddLeadDialog";

/**
 * Guards a defect that neither typecheck nor the existing suite could see:
 * `fieldError` was set in submit() and never cleared, so once "First name is
 * required." appeared it stayed on screen even after the user typed a name.
 * The product told someone a field they had just filled was still wrong.
 *
 * Also pins the assistive-technology wiring, which was absent — the message
 * existed but nothing connected it to the input it described.
 */
describe("AddLeadDialog validation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows a required-field error when first name is empty", async () => {
    const user = userEvent.setup({ delay: null });
    render(<AddLeadDialog open onClose={() => {}} />);

    await user.click(screen.getByRole("button", { name: /add lead|save|create/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/first name is required/i);
    });
  });

  it("clears the error as soon as the user types a name", async () => {
    const user = userEvent.setup({ delay: null });
    render(<AddLeadDialog open onClose={() => {}} />);

    await user.click(screen.getByRole("button", { name: /add lead|save|create/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    // The regression: this used to leave the alert on screen.
    await user.type(screen.getByLabelText(/first name/i), "Avery");

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("links the error to the input it describes", async () => {
    const user = userEvent.setup({ delay: null });
    render(<AddLeadDialog open onClose={() => {}} />);

    const input = screen.getByLabelText(/first name/i);
    expect(input).not.toHaveAttribute("aria-invalid", "true");

    await user.click(screen.getByRole("button", { name: /add lead|save|create/i }));

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
      // A screen reader needs the message associated with the field, not just
      // present somewhere on the page.
      expect(input.getAttribute("aria-describedby")).toBe("al-first-error");
      expect(screen.getByRole("alert")).toHaveAttribute("id", "al-first-error");
    });
  });
});
