import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";

/**
 * "Report this response" on the AI assistant.
 *
 * Google Play's AI-generated content policy requires an in-app way to flag
 * offensive output; this is it. The tests pin that a report really is written
 * (to the existing user_feedback table, with the reason), that it carries the
 * one reported answer and not the conversation, and that a failed write says so.
 */

vi.setConfig({ testTimeout: 20000 });

const insert = vi.fn();
const from = vi.fn((_table: string) => ({ insert: (...a: unknown[]) => insert(...a) }));
const invoke = vi.fn();
let session: unknown = { user: { id: "user-1" } };
const toast = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      getUser: async () => ({ data: { user: { id: "user-1" } }, error: null }),
    },
    from: (table: string) =>
      table === "user_feedback"
        ? from(table)
        : { select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }) },
    functions: { invoke: (...a: unknown[]) => invoke(...a) },
  },
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: (...a: unknown[]) => toast(...a) }),
}));
// The page test below needs the assistant, not the dashboard chrome around it.
vi.mock("@/components/layout/AppLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import ReportAIResponse, {
  AI_REPORT_FEEDBACK_TYPE,
  REPORTED_TEXT_MAX,
} from "../ReportAIResponse";

const setLanguage = async (lng: string) => {
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage(lng);
  });
};
const setupUser = () => userEvent.setup({ delay: null, pointerEventsCheck: 0 });

beforeEach(async () => {
  insert.mockReset().mockResolvedValue({ error: null });
  from.mockClear();
  invoke.mockReset();
  toast.mockReset();
  session = { user: { id: "user-1" } };
  // jsdom has no layout, so the page's scroll-to-latest has nothing to call.
  Element.prototype.scrollIntoView = vi.fn();
  await setLanguage("en");
});

describe("ReportAIResponse", () => {
  it("writes one user_feedback row with the reason, the comment and the reported text", async () => {
    const user = setupUser();
    renderWithProviders(<ReportAIResponse responseText="The market always goes up." />, {
      route: "/ai-assistant",
    });

    await user.click(screen.getByRole("button", { name: "Report this response" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("radio", { name: "It is offensive or harmful" }));
    await user.type(within(dialog).getByLabelText("Comment (optional)"), "  Not acceptable.  ");
    await user.click(within(dialog).getByRole("button", { name: "Send report" }));

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(from).toHaveBeenCalledWith("user_feedback");
    const row = insert.mock.calls[0][0];
    expect(row).toMatchObject({
      user_id: "user-1",
      feedback_type: AI_REPORT_FEEDBACK_TYPE,
      was_helpful: false,
      comment: "Not acceptable.",
      metadata: {
        reason: "offensive",
        reported_text: "The market always goes up.",
        reported_text_truncated: false,
      },
    });
    // Only columns the table already has.
    expect(Object.keys(row).sort()).toEqual(
      ["comment", "feedback_type", "metadata", "page_url", "user_id", "was_helpful"].sort(),
    );
  });

  it("confirms with a toast and settles into 'Reported'", async () => {
    const user = setupUser();
    renderWithProviders(<ReportAIResponse responseText="An answer." />);
    await user.click(screen.getByRole("button", { name: "Report this response" }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Send report" }));

    await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Report sent" })));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("button", { name: "Reported" })).toBeDisabled();
    // Defaults: "inaccurate", no comment.
    expect(insert.mock.calls[0][0]).toMatchObject({ comment: null, metadata: { reason: "inaccurate" } });
  });

  it("stores a truncated copy of a long response, and says it was cut", async () => {
    const long = "x".repeat(REPORTED_TEXT_MAX + 500);
    const user = setupUser();
    renderWithProviders(<ReportAIResponse responseText={long} />);
    await user.click(screen.getByRole("button", { name: "Report this response" }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Send report" }));

    await waitFor(() => expect(insert).toHaveBeenCalled());
    const { metadata } = insert.mock.calls[0][0];
    expect(metadata.reported_text).toHaveLength(REPORTED_TEXT_MAX);
    expect(metadata.reported_text_truncated).toBe(true);
  });

  it("says so when the report could not be saved, and lets the person retry", async () => {
    insert.mockResolvedValueOnce({ error: { message: "new row violates row-level security policy" } });
    const user = setupUser();
    renderWithProviders(<ReportAIResponse responseText="An answer." />);
    await user.click(screen.getByRole("button", { name: "Report this response" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText("Comment (optional)"), "Wrong year.");
    await user.click(within(dialog).getByRole("button", { name: "Send report" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent("Your report could not be sent.");
    expect(toast).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Reported" })).toBeNull();
    // The comment is still there for the second attempt.
    expect(within(dialog).getByLabelText("Comment (optional)")).toHaveValue("Wrong year.");

    await user.click(within(dialog).getByRole("button", { name: "Send report" }));
    await waitFor(() => expect(toast).toHaveBeenCalled());
    expect(insert).toHaveBeenCalledTimes(2);
  });

  it("does not pretend to have reported when there is no session", async () => {
    session = null;
    const user = setupUser();
    renderWithProviders(<ReportAIResponse responseText="An answer." />);
    await user.click(screen.getByRole("button", { name: "Report this response" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Send report" }));

    expect(await within(dialog).findByRole("alert")).toBeInTheDocument();
    expect(insert).not.toHaveBeenCalled();
  });

  it("is in French when the app is", async () => {
    await setLanguage("fr");
    const user = setupUser();
    renderWithProviders(<ReportAIResponse responseText="Une réponse." />);
    await user.click(screen.getByRole("button", { name: "Signaler cette réponse" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("radio", { name: "Elle est offensante ou nuisible" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Envoyer le signalement" })).toBeInTheDocument();
  });

  it("has the same keys in English and French", async () => {
    const { aiReportEn, aiReportFr } = await import("@/i18n/aiResponseReport");
    const keys = (o: Record<string, unknown>, p = ""): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        typeof v === "string" ? [p + k] : keys(v as Record<string, unknown>, p + k + "."),
      );
    expect(keys(aiReportFr)).toEqual(keys(aiReportEn));
  });
});

describe("AI assistant page", () => {
  it("tells the person, under the input, that responses are AI-generated and can be wrong", async () => {
    const { default: AIAssistant } = await import("@/pages/AIAssistant");
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });
    expect(
      screen.getByText("Responses are generated by AI and can be wrong. Check anything important before you rely on it."),
    ).toBeInTheDocument();

    await setLanguage("fr");
    expect(screen.getByText(/Les réponses sont générées par l’IA et peuvent être erronées/)).toBeInTheDocument();
  });

  it("puts a report control on every assistant message and none on the person's own", async () => {
    invoke
      .mockResolvedValueOnce({ data: { message: "First answer." }, error: null })
      .mockResolvedValueOnce({ data: { message: "Second answer." }, error: null });
    const { default: AIAssistant } = await import("@/pages/AIAssistant");
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    const input = screen.getByLabelText("Message the assistant");
    await user.type(input, "First question{Enter}");
    await screen.findByText("First answer.");
    await user.type(input, "Second question{Enter}");
    await screen.findByText("Second answer.");

    expect(screen.getAllByRole("button", { name: "Report this response" })).toHaveLength(2);

    // Reporting the second answer stores that answer, not the conversation.
    await user.click(screen.getAllByRole("button", { name: "Report this response" })[1]);
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Send report" }));
    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    const stored = JSON.stringify(insert.mock.calls[0][0]);
    expect(stored).toContain("Second answer.");
    expect(stored).not.toContain("First answer.");
    expect(stored).not.toContain("First question");
    expect(stored).not.toContain("Second question");
  });
});
