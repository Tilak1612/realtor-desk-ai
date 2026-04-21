import { describe, it, expect, beforeEach } from "vitest";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { Sidebar } from "../Sidebar";
import { TopNav } from "../TopNav";

// Redesign chrome smoke: guards Phase I bilingual wiring. If a t() key
// is ever renamed without updating the fallback, or if the EN/FR toggle
// stops calling i18n.changeLanguage, these assertions fail fast.

describe("Sidebar", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("renders default nav labels in English", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("flips to French nav labels when i18n language is fr", async () => {
    const { i18n } = renderWithProviders(<Sidebar />);
    await act(async () => {
      await i18n.changeLanguage("fr");
    });
    expect(screen.getByText("Tableau de bord")).toBeInTheDocument();
    expect(screen.getByText("Clients potentiels")).toBeInTheDocument();
    expect(screen.getByText("Automatisation")).toBeInTheDocument();
    expect(screen.getByText("Rapports")).toBeInTheDocument();
  });
});

describe("TopNav", () => {
  beforeEach(async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("en");
    });
  });

  it("renders the live pill and search placeholder", () => {
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search leads, listings, conversations…")
    ).toBeInTheDocument();
  });

  it("EN/FR toggle is wired to i18n.changeLanguage", async () => {
    const user = userEvent.setup();
    const { i18n } = renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    expect(i18n.language).toBe("en");

    await user.click(screen.getByRole("button", { name: "FR" }));
    expect(i18n.language).toBe("fr");

    // French strings should now be rendered.
    expect(screen.getByText("En direct")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Rechercher clients, inscriptions, conversations…")
    ).toBeInTheDocument();
  });
});
