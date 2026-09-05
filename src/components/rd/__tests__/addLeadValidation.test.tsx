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

/**
 * The dialog declared role="dialog" and aria-modal="true" while implementing
 * none of what those promise: Escape did nothing, Tab walked out into the page
 * behind it, and closing dropped focus to the top of the document. Claiming
 * aria-modal while focus can leave is worse than not claiming it — assistive
 * technology tells the user the rest of the page is inert while the keyboard
 * says otherwise.
 */
describe("AddLeadDialog modal behaviour", () => {
  it("closes on Escape", async () => {
    const user = userEvent.setup({ delay: null });
    const onClose = vi.fn();
    render(<AddLeadDialog open onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks body scroll while open and restores it on unmount", () => {
    const { unmount } = render(<AddLeadDialog open onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("keeps Tab inside the dialog", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(<AddLeadDialog open onClose={() => {}} />);

    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    expect(focusable.length).toBeGreaterThan(1);

    // From the last focusable element, Tab must wrap to the first rather than
    // escaping to the document behind the dialog.
    focusable[focusable.length - 1].focus();
    await user.tab();

    expect(document.activeElement).toBe(focusable[0]);
  });

  it("returns focus to the opener when it closes", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    expect(document.activeElement).toBe(opener);

    const { unmount } = render(<AddLeadDialog open onClose={() => {}} />);
    unmount();

    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});
