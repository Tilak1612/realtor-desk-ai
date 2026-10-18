import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/render";

/**
 * "Delete my account" in Settings.
 *
 * What this replaced showed a toast and deleted nothing, so the properties
 * worth pinning are the ones a store reviewer and a real customer both hit:
 * it cannot fire by accident, the shared demo account cannot use it, success
 * actually ends the session, and a failure is said out loud with a way forward.
 */

vi.setConfig({ testTimeout: 20000 });

const requestAccountDeletion = vi.fn();
const clearLocalSession = vi.fn();
const signOutIntentionally = vi.fn();
const clearNativeExports = vi.fn();
const toast = vi.fn();

// Mocked whole, without importActual: the real module imports the Supabase
// client, which throws wherever the env is absent (every CI run).
vi.mock("@/lib/account/deleteAccount", () => ({
  ACCOUNT_SUPPORT_EMAIL: "support@realtordesk.ai",
  DELETE_CONFIRM_PHRASE: "DELETE",
  requestAccountDeletion: (...a: unknown[]) => requestAccountDeletion(...a),
  clearLocalSession: (...a: unknown[]) => clearLocalSession(...a),
}));
vi.mock("@/lib/auth/signOut", () => ({
  signOutIntentionally: (...a: unknown[]) => signOutIntentionally(...a),
}));
vi.mock("@/lib/account/exportFile", () => ({
  clearNativeExports: (...a: unknown[]) => clearNativeExports(...a),
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: (...a: unknown[]) => toast(...a) }),
}));

import DeleteAccountDialog from "../DeleteAccountDialog";

const setLanguage = async (lng: string) => {
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage(lng);
  });
};

function renderDialog(props: Partial<React.ComponentProps<typeof DeleteAccountDialog>> = {}) {
  return renderWithProviders(
    <Routes>
      <Route path="/settings" element={<DeleteAccountDialog isDemo={false} {...props} />} />
      <Route path="/login" element={<div>LOGIN PAGE</div>} />
    </Routes>,
    { route: "/settings" },
  );
}

// Radix sets pointer-events: none on <body> while a dialog is open, which
// user-event reads as "unclickable" in jsdom.
const setupUser = () => userEvent.setup({ delay: null, pointerEventsCheck: 0 });

async function openDialog(user: ReturnType<typeof setupUser>) {
  await user.click(screen.getByRole("button", { name: "Delete my account" }));
  return screen.findByRole("alertdialog");
}

beforeEach(async () => {
  requestAccountDeletion.mockReset();
  clearLocalSession.mockReset().mockResolvedValue(undefined);
  signOutIntentionally.mockReset().mockResolvedValue({ error: null });
  clearNativeExports.mockReset().mockResolvedValue(undefined);
  toast.mockReset();
  await setLanguage("en");
});

describe("DeleteAccountDialog: confirmation", () => {
  it("does nothing until the confirmation word is typed", async () => {
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    const submit = within(dialog).getByRole("button", { name: "Delete my account" });
    const input = within(dialog).getByLabelText("Type DELETE to confirm");

    expect(submit).toBeDisabled();
    await user.type(input, "DELET");
    expect(submit).toBeDisabled();
    await user.clear(input);
    await user.type(input, "remove");
    expect(submit).toBeDisabled();
    await user.click(submit);
    expect(requestAccountDeletion).not.toHaveBeenCalled();
  });

  it("accepts the word however a phone keyboard cased it", async () => {
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), " Delete ");
    expect(within(dialog).getByRole("button", { name: "Delete my account" })).toBeEnabled();
  });

  it("asks for the French word in French", async () => {
    await setLanguage("fr");
    const user = setupUser();
    renderDialog();
    await user.click(screen.getByRole("button", { name: "Supprimer mon compte" }));
    const dialog = await screen.findByRole("alertdialog");
    const submit = within(dialog).getByRole("button", { name: "Supprimer mon compte" });
    const input = within(dialog).getByLabelText("Tapez SUPPRIMER pour confirmer");

    await user.type(input, "DELETE");
    expect(submit).toBeDisabled();
    await user.clear(input);
    await user.type(input, "supprimer");
    expect(submit).toBeEnabled();
  });

  it("forgets the typed word when the dialog is closed", async () => {
    const user = setupUser();
    renderDialog();
    let dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), "DELETE");
    await user.click(within(dialog).getByRole("button", { name: "Keep my account" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());

    dialog = await openDialog(user);
    expect(within(dialog).getByLabelText("Type DELETE to confirm")).toHaveValue("");
    expect(requestAccountDeletion).not.toHaveBeenCalled();
  });
});

describe("DeleteAccountDialog: what it tells the person", () => {
  it("says what is deleted, what is kept, and that billing stops", async () => {
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    const text = dialog.textContent ?? "";

    expect(text).toMatch(/cannot be undone/i);
    expect(text).toMatch(/What is deleted/);
    expect(text).toMatch(/What is kept/);
    expect(text).toMatch(/cancelled immediately and you will not be billed again/);
    expect(text).toMatch(/do-not-email list/);
    expect(text).toMatch(/Stripe/);
  });

  it("no longer promises an email confirmation or a 30-day wait", async () => {
    const user = setupUser();
    renderDialog();
    for (const lng of ["en", "fr"]) {
      await setLanguage(lng);
      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/confirm by email|confirmerons par courriel/i);
      expect(text).not.toMatch(/within 30 days|en moins de 30 jours/i);
    }
    await setLanguage("en");
    const dialog = await openDialog(user);
    expect(dialog.textContent).not.toMatch(/confirm by email|within 30 days/i);
  });

  it("offers the export first, when the page gives it one", async () => {
    const onExport = vi.fn();
    const user = setupUser();
    renderDialog({ onExport });
    const dialog = await openDialog(user);
    await user.click(within(dialog).getByRole("button", { name: "Export my data" }));
    expect(onExport).toHaveBeenCalledTimes(1);
    expect(requestAccountDeletion).not.toHaveBeenCalled();
  });
});

describe("DeleteAccountDialog: demo account", () => {
  it("disables the button and explains why", async () => {
    const user = setupUser();
    renderDialog({ isDemo: true });
    const trigger = screen.getByRole("button", { name: "Delete my account" });

    expect(trigger).toBeDisabled();
    expect(screen.getByText("This is a shared demo account, so it cannot be deleted.")).toBeInTheDocument();
    expect(trigger).toHaveAccessibleDescription("This is a shared demo account, so it cannot be deleted.");

    await user.click(trigger);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(requestAccountDeletion).not.toHaveBeenCalled();
  });
});

describe("DeleteAccountDialog: success", () => {
  it("deletes, signs out, and lands on /login with a confirmation", async () => {
    requestAccountDeletion.mockResolvedValue({ ok: true, failure: null, completedSteps: [] });
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), "DELETE");
    await user.click(within(dialog).getByRole("button", { name: "Delete my account" }));

    await waitFor(() => expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument());
    expect(requestAccountDeletion).toHaveBeenCalledTimes(1);
    expect(signOutIntentionally).toHaveBeenCalledTimes(1);
    expect(clearNativeExports).toHaveBeenCalledTimes(1);
    expect(clearLocalSession).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Account deleted" }),
    );
    // Signed out only AFTER the server confirmed.
    expect(requestAccountDeletion.mock.invocationCallOrder[0]).toBeLessThan(
      signOutIntentionally.mock.invocationCallOrder[0],
    );
  });

  it("still clears this device's session when the server sign-out fails", async () => {
    requestAccountDeletion.mockResolvedValue({ ok: true, failure: null, completedSteps: [] });
    signOutIntentionally.mockResolvedValue({ error: new Error("user not found") });
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), "DELETE");
    await user.click(within(dialog).getByRole("button", { name: "Delete my account" }));

    await waitFor(() => expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument());
    expect(clearLocalSession).toHaveBeenCalledTimes(1);
  });

  it("shows progress and cannot be submitted twice while the request is out", async () => {
    let resolve: (v: unknown) => void = () => {};
    requestAccountDeletion.mockReturnValue(new Promise((r) => { resolve = r; }));
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), "DELETE");
    await user.click(within(dialog).getByRole("button", { name: "Delete my account" }));

    const busy = await within(dialog).findByRole("button", { name: /Deleting your account/ });
    expect(busy).toBeDisabled();
    expect(within(dialog).getByRole("status")).toHaveTextContent("Keep this window open");
    expect(within(dialog).getByRole("button", { name: "Keep my account" })).toBeDisabled();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(requestAccountDeletion).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve({ ok: true, failure: null, completedSteps: [] });
    });
    await waitFor(() => expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument());
  });
});

describe("DeleteAccountDialog: failure", () => {
  it("shows the reason inline with the support address, and stays signed in", async () => {
    requestAccountDeletion.mockResolvedValue({
      ok: false,
      failure: "stripe_cancel_failed",
      completedSteps: ["demo_check"],
    });
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), "DELETE");
    await user.click(within(dialog).getByRole("button", { name: "Delete my account" }));

    const alert = await within(dialog).findByRole("alert");
    expect(alert).toHaveTextContent("We could not cancel your subscription, so nothing was deleted.");
    expect(within(alert).getByRole("link", { name: "support@realtordesk.ai" })).toHaveAttribute(
      "href",
      "mailto:support@realtordesk.ai",
    );
    expect(signOutIntentionally).not.toHaveBeenCalled();
    expect(toast).not.toHaveBeenCalled();
    expect(screen.queryByText("LOGIN PAGE")).toBeNull();
  });

  it("lets the person retry without retyping, and finishes if the retry works", async () => {
    requestAccountDeletion
      .mockResolvedValueOnce({ ok: false, failure: "partial", completedSteps: ["delete_storage"] })
      .mockResolvedValueOnce({ ok: true, failure: null, completedSteps: [] });
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), "DELETE");
    await user.click(within(dialog).getByRole("button", { name: "Delete my account" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "Part of your data was deleted, but your account is still open.",
    );
    const retry = within(dialog).getByRole("button", { name: "Try again" });
    expect(retry).toBeEnabled();
    await user.click(retry);

    await waitFor(() => expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument());
    expect(requestAccountDeletion).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["network", "We could not confirm the deletion."],
    ["unauthorized", "Your session has expired."],
    ["demo_account", "This is a shared demo account"],
    ["unknown", "Something went wrong and your account was not deleted."],
  ])("has a message for %s", async (failure, message) => {
    requestAccountDeletion.mockResolvedValue({ ok: false, failure, completedSteps: [] });
    const user = setupUser();
    renderDialog();
    const dialog = await openDialog(user);
    await user.type(within(dialog).getByLabelText("Type DELETE to confirm"), "DELETE");
    await user.click(within(dialog).getByRole("button", { name: "Delete my account" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(message);
  });
});

describe("account deletion strings", () => {
  it("has the same keys in English and French, none of them empty", async () => {
    const { accountDeletionEn, accountDeletionFr } = await import("@/i18n/accountDeletion");
    const flatten = (o: Record<string, unknown>, p = ""): [string, string][] =>
      Object.entries(o).flatMap(([k, v]) =>
        typeof v === "string" ? [[p + k, v]] : flatten(v as Record<string, unknown>, p + k + "."),
      );
    const en = flatten(accountDeletionEn);
    const fr = flatten(accountDeletionFr);
    expect(fr.map(([k]) => k)).toEqual(en.map(([k]) => k));
    for (const [k, v] of [...en, ...fr]) expect(v.trim(), k).not.toBe("");
  });

  it("registers without editing config.ts, in both languages", async () => {
    const i18n = (await import("@/i18n/config")).default;
    await import("@/i18n/accountDeletion");
    expect(i18n.getFixedT("en")("accountDeletion.dialog.title")).toBe("Delete your account?");
    expect(i18n.getFixedT("fr")("accountDeletion.dialog.title")).toBe("Supprimer votre compte ?");
    // The neighbouring keys in the same namespace are still there.
    expect(i18n.getFixedT("fr")("app.settings.dataRights.deleteTitle")).toBe("Supprimer mon compte");
  });
});
