import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  SkeletonStatCard,
  SkeletonStatRow,
  SkeletonRows,
  SkeletonLines,
} from "../Skeleton";

/**
 * These guard the reason the skeletons exist: the /app shell had no loading
 * placeholders at all, so every card rendered a single line of "Loading…" text
 * in a box far shorter than the content that replaced it, and the KPI tiles
 * rendered a computed 0 before the real number arrived.
 *
 * Verifying this in a browser is awkward — React Query caches with a 30s
 * staleTime, so on a warm cache the loading window is too short to observe
 * reliably. The contract is asserted here instead.
 */
describe("RD skeletons", () => {
  it("renders one placeholder card per requested stat", () => {
    const { container } = render(<SkeletonStatRow count={3} />);
    // Each card contains a label bar and a value bar.
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(6);
  });

  it("renders the requested number of rows", () => {
    const { container } = render(<SkeletonRows rows={4} />);
    // Avatar + two text bars per row.
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(12);
  });

  it("renders list lines in pairs", () => {
    const { container } = render(<SkeletonLines rows={4} />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(8);
  });

  it("hides placeholders from assistive technology", () => {
    // A screen reader should hear nothing from a loading placeholder — it is
    // decorative, and the live region that replaces it carries the meaning.
    const { container: rows } = render(<SkeletonRows rows={2} />);
    const { container: lines } = render(<SkeletonLines rows={2} />);
    expect(rows.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(lines.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("reserves height rather than collapsing", () => {
    // The value bar carries an explicit height class. Without it the card
    // collapses and the page shifts when the real number lands in 38px type.
    const { container } = render(<SkeletonStatCard />);
    const bars = [...container.querySelectorAll(".animate-pulse")];
    expect(bars.some((b) => b.className.includes("h-[38px]"))).toBe(true);
  });
});
