import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_k: string, d?: string) => d ?? _k,
    i18n: { language: "en" },
  }),
}));

import { Reveal } from "@/components/motion/Reveal";
import { SkeletonStatRow, SkeletonRows } from "@/components/rd/Skeleton";
import { PasswordInput } from "@/components/ui/password-input";

/**
 * Accessibility checks run with axe-core directly rather than through a
 * matcher wrapper, so the failure message can name the rule and the node.
 *
 * Scope is deliberate: these are the components this visual-upgrade work
 * introduces or changes. A whole-page scan would drag in routing, auth and
 * Supabase, and would mostly report pre-existing issues that belong in their
 * own PR rather than gating this one.
 */
async function violations(container: HTMLElement) {
  const results = await axe.run(container, {
    // Colour contrast cannot be judged in jsdom: it has no layout or paint,
    // so every result would be an unreliable guess in either direction.
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
    help: v.help,
  }));
}

describe("accessibility of the components this work touches", () => {
  it("Reveal wrapper introduces no violations", async () => {
    const { container } = render(
      <Reveal>
        <section aria-label="Example">
          <h2>Pipeline</h2>
          <p>Leads move left to right.</p>
        </section>
      </Reveal>
    );
    expect(await violations(container)).toEqual([]);
  });

  it("loading placeholders are hidden from assistive technology", async () => {
    const { container } = render(
      <div>
        <SkeletonStatRow count={3} />
        <SkeletonRows rows={3} />
      </div>
    );
    expect(await violations(container)).toEqual([]);
  });

  it("the password field is labelled and its state is exposed", async () => {
    const { container } = render(
      <div>
        <label htmlFor="pw">Password</label>
        <PasswordInput id="pw" name="password" showValidation value="Password1!" onChange={() => {}} />
      </div>
    );
    expect(await violations(container)).toEqual([]);
  });

  it("the show/hide password control has an accessible name", async () => {
    const { container } = render(
      <div>
        <label htmlFor="pw2">Password</label>
        <PasswordInput id="pw2" name="password" value="" onChange={() => {}} />
      </div>
    );
    const toggle = container.querySelector('button[aria-label]');
    // A bare eye icon with no name is the classic failure here; the control
    // is unusable by a screen reader without it.
    expect(toggle?.getAttribute("aria-label")).toMatch(/password/i);
  });
});
