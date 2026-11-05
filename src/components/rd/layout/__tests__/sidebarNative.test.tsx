import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * The workspace card at the top of the /app drawer, inside the iOS / Android
 * app.
 *
 * Under the workspace name the card shows the subscription ("Brokerage plan",
 * "Trial"). The app names no plan anywhere: it is a companion to a
 * subscription bought on the website. The card's chevron is also left out
 * there, because it is a drawing with no handler behind it. The website keeps
 * both.
 */

const h = vi.hoisted(() => ({ native: true }));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));

import { Sidebar } from "../Sidebar";

const WORKSPACE = { name: "Lohia Realty", tier: "Brokerage plan", mark: "LR" };
const card = () => screen.getByText("Lohia Realty").parentElement!.parentElement!;

beforeEach(async () => {
  h.native = true;
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

describe("workspace card in the app", () => {
  it("shows the workspace name and no plan name", () => {
    renderWithProviders(<Sidebar open workspace={WORKSPACE} />, { route: "/app" });
    expect(screen.getByText("Lohia Realty")).toBeInTheDocument();
    expect(screen.getByText("LR")).toBeInTheDocument();
    expect(screen.queryByText("Brokerage plan")).toBeNull();
    expect(document.getElementById("rd-app-nav")!.textContent).not.toMatch(/\bplan\b|\btrial\b/i);
  });

  it("hides the plan whatever it is, including a trial", () => {
    renderWithProviders(<Sidebar open workspace={{ ...WORKSPACE, tier: "Trial" }} />, { route: "/app" });
    expect(screen.queryByText("Trial")).toBeNull();
  });

  it("has no chevron on the card, since the card opens nothing", () => {
    renderWithProviders(<Sidebar open workspace={WORKSPACE} />, { route: "/app" });
    expect(card().querySelector("svg")).toBeNull();
    // Nothing on the card is a control.
    expect(card().querySelector("button, a, [role='button']")).toBeNull();
  });

  it("keeps the chevron that closes the drawer", () => {
    renderWithProviders(<Sidebar open workspace={WORKSPACE} />, { route: "/app" });
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeInTheDocument();
  });
});

describe("workspace card on the web (unchanged)", () => {
  beforeEach(() => {
    h.native = false;
  });

  it("shows the plan under the workspace name, and the chevron", () => {
    renderWithProviders(<Sidebar open workspace={WORKSPACE} />, { route: "/app" });
    expect(screen.getByText("Lohia Realty")).toBeInTheDocument();
    expect(screen.getByText("Brokerage plan")).toBeInTheDocument();
    expect(card().querySelector("svg")).not.toBeNull();
  });
});
