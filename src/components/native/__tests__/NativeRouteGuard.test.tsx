import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

const native = vi.hoisted(() => ({ value: false }));
const hideSplash = vi.hoisted(() => vi.fn());

vi.mock("@/lib/native/platform", () => ({
  isNativeApp: () => native.value,
  nativePlatform: () => (native.value ? "ios" : "web"),
}));
// The real module pulls in the Capacitor plugins; the guard only needs this.
vi.mock("@/lib/native/bootstrap", () => ({ hideSplash }));

import { NativeRouteGuard } from "../NativeRouteGuard";

const Where = () => <div data-testid="where">{useLocation().pathname}</div>;

// A cut-down App.tsx: the marketing home, pricing, the dashboard and settings.
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <NativeRouteGuard>
        <Routes>
          <Route path="/" element={<div>marketing home</div>} />
          <Route path="/pricing" element={<div>pricing page</div>} />
          <Route path="/billing" element={<div>billing page</div>} />
          <Route path="/app" element={<div>dashboard</div>} />
          <Route path="/app/settings" element={<div>settings</div>} />
          <Route path="/app/leads/:id" element={<div>lead detail</div>} />
          <Route path="*" element={<div>public 404</div>} />
        </Routes>
      </NativeRouteGuard>
      <Where />
    </MemoryRouter>,
  );

beforeEach(() => {
  native.value = false;
  hideSplash.mockClear();
});

describe("NativeRouteGuard on the web", () => {
  it("renders every route untouched", () => {
    renderAt("/");
    expect(screen.getByText("marketing home")).toBeInTheDocument();
  });

  it("does not redirect pricing or billing", () => {
    renderAt("/pricing");
    expect(screen.getByText("pricing page")).toBeInTheDocument();
    expect(screen.getByTestId("where")).toHaveTextContent("/pricing");
  });

  it("never touches the splash screen", () => {
    renderAt("/app");
    expect(hideSplash).not.toHaveBeenCalled();
  });
});

describe("NativeRouteGuard in the app", () => {
  beforeEach(() => {
    native.value = true;
  });

  it("starts on the dashboard, not the marketing homepage", () => {
    renderAt("/");
    expect(screen.queryByText("marketing home")).not.toBeInTheDocument();
    expect(screen.getByText("dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("where")).toHaveTextContent("/app");
  });

  it.each(["/pricing", "/signup", "/features", "/blog/anything", "/calendar"])(
    "redirects %s to the dashboard",
    (path) => {
      renderAt(path);
      expect(screen.getByText("dashboard")).toBeInTheDocument();
      expect(screen.queryByText("pricing page")).not.toBeInTheDocument();
      expect(screen.queryByText("public 404")).not.toBeInTheDocument();
    },
  );

  it("sends /billing?required=1 to settings, which is outside the billing gate", () => {
    renderAt("/billing?required=1");
    expect(screen.queryByText("billing page")).not.toBeInTheDocument();
    expect(screen.getByText("settings")).toBeInTheDocument();
  });

  it("leaves product routes alone", () => {
    renderAt("/app/leads/123");
    expect(screen.getByText("lead detail")).toBeInTheDocument();
    expect(screen.getByTestId("where")).toHaveTextContent("/app/leads/123");
  });

  it("takes the splash down once an allowed screen has rendered", () => {
    renderAt("/app");
    expect(hideSplash).toHaveBeenCalled();
  });
});
