import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";

/**
 * The AI assistant when the model does not answer, and what the page says the
 * assistant can do.
 *
 * A failed request used to end in a toast: a few seconds later the person was
 * looking at their own question with nothing under it and no way to send it
 * again. These tests pin the replacement (an inline row that stays, with a
 * retry that does not repeat the question) for both ways of sending, and pin
 * that the page no longer offers what the claude-chat function cannot do.
 */

vi.setConfig({ testTimeout: 20000 });

const invoke = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: { user: { id: "user-1" } } }, error: null }),
      getUser: async () => ({ data: { user: { id: "user-1" } }, error: null }),
    },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
    functions: { invoke: (...a: unknown[]) => invoke(...a) },
  },
}));
// The assistant is under test, not the dashboard chrome around it.
vi.mock("@/components/layout/AppLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import AIAssistant from "../AIAssistant";
import { aiChatEn, aiChatFr } from "@/i18n/aiAssistant";

// What supabase-js hands back for a 500 from the function: no data, and an
// error whose message is about the transport, not about the person's question.
const SERVER_ERROR = { data: null, error: new Error("Edge Function returned a non-2xx status code") };
const answer = (message: string) => ({ data: { message }, error: null });

const setLanguage = async (lng: string) => {
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage(lng);
  });
};
const setupUser = () => userEvent.setup({ delay: null, pointerEventsCheck: 0 });
const sentMessages = (call: number) =>
  (invoke.mock.calls[call][1] as { body: { messages: { role: string; content: string }[] } }).body.messages;

beforeEach(async () => {
  invoke.mockReset();
  // jsdom has no layout, so the page's scroll-to-latest has nothing to call.
  Element.prototype.scrollIntoView = vi.fn();
  // The page logs the failure for whoever is debugging; keep the run quiet.
  vi.spyOn(console, "error").mockImplementation(() => {});
  await setLanguage("en");
});

describe("AI assistant: a request that fails", () => {
  it("shows an inline error under the question, announced, with a way to retry", async () => {
    invoke.mockResolvedValueOnce(SERVER_ERROR);
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    await user.type(screen.getByLabelText("Message the assistant"), "Who should I call first?{Enter}");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("The assistant could not answer right now.");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    // The question is still there, and the error comes after it in the page.
    const question = screen.getByText("Who should I call first?");
    expect(question.compareDocumentPosition(alert) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The transport's wording is for the console, not for the person.
    expect(screen.queryByText(/non-2xx/)).toBeNull();
  });

  it("treats an error body and an empty body as failures too", async () => {
    invoke
      .mockResolvedValueOnce({ data: { error: "AI service temporarily unavailable" }, error: null })
      .mockResolvedValueOnce({ data: {}, error: null });
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    await user.type(screen.getByLabelText("Message the assistant"), "Hello{Enter}");
    await screen.findByRole("alert");

    await user.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(invoke).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("alert")).toHaveTextContent("The assistant could not answer right now.");
  });

  it("retry resends that question once and replaces the error with the answer", async () => {
    invoke.mockResolvedValueOnce(SERVER_ERROR).mockResolvedValueOnce(answer("Start with Priya."));
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    await user.type(screen.getByLabelText("Message the assistant"), "Who should I call first?{Enter}");
    await screen.findByRole("alert");
    expect(invoke).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Start with Priya.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
    expect(invoke).toHaveBeenCalledTimes(2);
    // Same question, sent once more, not appended a second time.
    expect(sentMessages(1)).toEqual([{ role: "user", content: "Who should I call first?" }]);
    expect(sentMessages(1)).toEqual(sentMessages(0));
    expect(screen.getAllByText("Who should I call first?")).toHaveLength(1);
  });

  it("sends one request for two taps on Try again", async () => {
    let release: (v: unknown) => void = () => {};
    invoke
      .mockResolvedValueOnce(SERVER_ERROR)
      .mockReturnValueOnce(new Promise((resolve) => (release = resolve)));
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    fireEvent.change(screen.getByLabelText("Message the assistant"), { target: { value: "Hello" } });
    fireEvent.submit(screen.getByLabelText("Message the assistant").closest("form")!);
    const retry = await screen.findByRole("button", { name: "Try again" });

    // Both clicks land before React has re-rendered with loading = true.
    await act(async () => {
      retry.click();
      retry.click();
    });
    await waitFor(() => expect(invoke).toHaveBeenCalledTimes(2));

    await act(async () => release(answer("Hi.")));
    expect(await screen.findByText("Hi.")).toBeInTheDocument();
    expect(invoke).toHaveBeenCalledTimes(2);
  });

  it("behaves the same for a quick action", async () => {
    invoke.mockResolvedValueOnce(SERVER_ERROR).mockResolvedValueOnce(answer("Here is a draft task."));
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    await user.click(screen.getByRole("button", { name: "Draft a task" }));
    await screen.findByRole("alert");
    expect(screen.getAllByText(aiChatEn.prompts.draftTask)).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Here is a draft task.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getAllByText(aiChatEn.prompts.draftTask)).toHaveLength(1);
    expect(sentMessages(1)).toEqual([{ role: "user", content: aiChatEn.prompts.draftTask }]);
  });

  it("keeps the error until the chat is cleared", async () => {
    invoke.mockResolvedValueOnce(SERVER_ERROR);
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    await user.type(screen.getByLabelText("Message the assistant"), "Hello{Enter}");
    await screen.findByRole("alert");
    // Still there well after a toast would have gone.
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear Chat" }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText("Hello")).toBeNull();
  });

  it("says a request is in flight, to the eye and to a screen reader", async () => {
    let release: (v: unknown) => void = () => {};
    invoke.mockReturnValueOnce(new Promise((resolve) => (release = resolve)));
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    await user.type(screen.getByLabelText("Message the assistant"), "Hello{Enter}");
    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("The assistant is preparing a response…");
    expect(status.querySelectorAll(".animate-bounce")).toHaveLength(3);

    await act(async () => release(answer("Hi.")));
    await screen.findByText("Hi.");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("reads in French", async () => {
    invoke.mockResolvedValueOnce(SERVER_ERROR);
    await setLanguage("fr");
    const user = setupUser();
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    await user.click(screen.getByRole("button", { name: "Rédiger une tâche" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("L’assistant n’a pas pu répondre pour le moment.");
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();
    // The quick action sends a French question, shown in the person's bubble.
    expect(sentMessages(0)).toEqual([{ role: "user", content: aiChatFr.prompts.draftTask }]);
  });
});

describe("AI assistant: what the page says it can do", () => {
  // The claude-chat function has no tools and no market data: it reads a short
  // summary of the account and returns text.
  it("offers no market research and no action it cannot take", () => {
    renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });

    expect(screen.queryByRole("button", { name: /market/i })).toBeNull();
    expect(screen.queryByRole("button", { name: "Create task" })).toBeNull();
    for (const name of ["Analyze my pipeline", "Draft follow-up email", "Draft a task"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("describes itself without promising to manage, create or research anything", async () => {
    const { container } = renderWithProviders(<AIAssistant />, { route: "/ai-assistant" });
    expect(screen.getByText(aiChatEn.welcomeDesc)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/manage contacts|create tasks|real estate insights|market trends/i);
    expect(aiChatEn.welcomeDesc).toMatch(/can’t change anything in your CRM/);
    expect(aiChatEn.welcomeDesc).toMatch(/don’t have market data/);

    await setLanguage("fr");
    expect(screen.getByText(aiChatFr.welcomeDesc)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/gérer vos contacts|créer des tâches|perspectives immobilières|Recherche de marché/i);
  });

  it("has the same keys in English and French, none empty", () => {
    const keys = (o: Record<string, unknown>, p = ""): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        typeof v === "string" ? [p + k] : keys(v as Record<string, unknown>, p + k + "."),
      );
    expect(keys(aiChatFr)).toEqual(keys(aiChatEn));
    const values = (o: Record<string, unknown>): string[] =>
      Object.values(o).flatMap((v) => (typeof v === "string" ? [v] : values(v as Record<string, unknown>)));
    for (const v of [...values(aiChatEn), ...values(aiChatFr)]) expect(v.trim()).not.toBe("");
  });
});
