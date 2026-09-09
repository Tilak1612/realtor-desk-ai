import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every public form must report form_start and form_submit.
 *
 * The specific events (demo_request, sign_up, trial_start,
 * lead_magnet_signup) are deliberately NOT replaced by these. They are wired
 * into existing reporting and renaming them would break continuity. The
 * generic pair exists so completion rate can be compared across forms that
 * share no other vocabulary.
 */

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

const PUBLIC_FORMS = [
  ["contact", "src/pages/Contact.tsx"],
  ["demo request", "src/pages/Demo.tsx"],
  ["signup", "src/pages/Signup.tsx"],
  ["newsletter", "src/pages/Resources.tsx"],
] as const;

describe("public form analytics", () => {
  it("reports a start and a submit from every public form", () => {
    for (const [name, file] of PUBLIC_FORMS) {
      const src = read(file);
      expect(src, `${name} does not use the shared form-analytics hook`).toContain(
        "useFormAnalytics"
      );
      expect(src, `${name} never signals form_start`).toMatch(/onStart/);
      expect(src, `${name} never signals form_submit`).toMatch(/onSubmitted\(\)/);
    }
  });

  it("fires each event at most once per mount", () => {
    // form_start is bound to focus/change. Without the guard it would fire on
    // every keystroke, and an event per character is not a metric.
    const hook = read("src/hooks/useFormAnalytics.ts");
    expect(hook).toContain("fired.current.start");
    expect(hook).toContain("fired.current.submit");
  });

  it("keeps the newsletter form writing somewhere real", () => {
    // It previously had no onSubmit and an unbound input, so type="submit"
    // did a native GET: the page reloaded and the address was discarded,
    // while the form collected CASL consent for a subscription that never
    // existed.
    const src = read("src/pages/Resources.tsx");
    expect(src, "the newsletter form has no submit handler").toMatch(
      /<form[^>]*onSubmit=\{handleNewsletterSubmit\}/
    );
    expect(src, "the newsletter email input is not bound to state").toMatch(
      /value=\{newsletterEmail\}/
    );
    expect(src, "the newsletter form does not persist anything").toContain(
      "email_captures"
    );
    // source discriminates it from the lead-magnet rows in the same table.
    expect(src).toContain('source: "newsletter_resources"');
  });
});
