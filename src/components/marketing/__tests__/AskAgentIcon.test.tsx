import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AskAgentIcon } from "../AskAgentIcon";
import SiteAssistant from "../SiteAssistant";

/**
 * The Ask Agent mark is generated artwork shipped as inline markup, so these
 * pin the properties that make it safe and themeable rather than just present.
 */

const SOURCE = readFileSync(
  join(process.cwd(), "src/components/marketing/AskAgentIcon.tsx"),
  "utf8"
);

describe("AskAgentIcon", () => {
  it("is decorative: hidden from assistive tech and out of the tab order", () => {
    const { container } = render(<AskAgentIcon />);
    const svg = container.querySelector("svg")!;
    // The launcher's own label names it; announcing the icon too would be noise.
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("focusable")).toBe("false");
  });

  it("follows the surrounding text colour, with the brand accent fixed", () => {
    const { container } = render(<AskAgentIcon />);
    const fills = [...container.querySelectorAll("path")].map((p) => p.getAttribute("fill"));
    // currentColor makes it paper on the navy launcher and navy on light surfaces.
    expect(fills).toContain("currentColor");
    expect(fills.some((f) => f?.includes("--rd-terra-600"))).toBe(true);
    // No hard-coded paper white: that would vanish on a light background.
    expect(fills).not.toContain("#FAFAF7");
  });

  it("is cropped to its artwork, not the generator's 2048 canvas", () => {
    // As delivered the mark filled under half its canvas and rendered tiny.
    const { container } = render(<AskAgentIcon />);
    const vb = container.querySelector("svg")!.getAttribute("viewBox")!;
    expect(vb).not.toBe("0 0 2048 2048");
    const [, , w, h] = vb.split(/\s+/).map(Number);
    expect(w).toBe(h); // square, so it centres in a square box
    expect(w).toBeLessThan(1300);
  });

  it("carries no background rectangle, halo slivers or active content", () => {
    // Recraft output shipped a full-canvas navy rect and three pink
    // anti-aliasing slivers. And inline SVG is markup on the live site, so
    // nothing executable or externally loaded may ride along with it.
    expect(SOURCE).not.toMatch(/M 0 0 L 2048 0/);
    expect(SOURCE).not.toMatch(/rgb\(227,\s*175,\s*163\)/);
    expect(SOURCE).not.toMatch(/<script|foreignObject|<image|href=|onload|javascript:/i);
    expect(SOURCE.match(/<path\b/g)?.length).toBe(2);
  });
});

describe("SiteAssistant launcher", () => {
  function renderAt(path: string) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <SiteAssistant />
      </MemoryRouter>
    );
  }

  it("shows the brand mark, and its accessible name is unchanged", () => {
    const { container } = renderAt("/");
    const button = screen.getByRole("button", { name: "Ask Agent about Realtor Desk" });
    expect(button.querySelector('svg[data-icon="ask-agent"]')).toBeTruthy();
    // The generic lucide bubble it replaced is gone.
    expect(container.querySelector(".lucide-message-circle")).toBeNull();
  });

  it("uses the same mark as the avatar once the panel is open", () => {
    renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: "Ask Agent about Realtor Desk" }));
    const dialog = screen.getByRole("dialog", { name: "Ask Agent" });
    expect(dialog.querySelector('svg[data-icon="ask-agent"]')).toBeTruthy();
  });
});
