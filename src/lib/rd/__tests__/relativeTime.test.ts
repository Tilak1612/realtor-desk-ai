import { afterEach, describe, expect, it } from "vitest";
import i18n from "@/i18n/config";
import { leadActivity, messageTime, relativeLabel, sourceLabel, tempLabel } from "../relativeTime";

const NOW = new Date(2026, 9, 18, 9, 0).getTime();
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const H = 3_600_000;
const D = 24 * H;

describe("relative times and lead labels", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("reads in English", async () => {
    await i18n.changeLanguage("en");
    const t = i18n.t.bind(i18n);
    expect(relativeLabel(ago(2 * D), t, "en-CA", NOW)).toBe("2d ago");
    expect(relativeLabel(ago(1 * D + H), t, "en-CA", NOW)).toBe("yesterday");
    expect(relativeLabel(ago(15 * D), t, "en-CA", NOW)).toBe("2w ago");
    expect(sourceLabel("Form", t)).toBe("Form");
    expect(tempLabel(94, t)).toBe("Hot");
  });

  it("reads in French", async () => {
    await i18n.changeLanguage("fr");
    const t = i18n.t.bind(i18n);
    expect(relativeLabel(ago(2 * D), t, "fr-CA", NOW)).toBe("il y a 2 j");
    expect(relativeLabel(ago(1 * D + H), t, "fr-CA", NOW)).toBe("hier");
    expect(relativeLabel(ago(3 * H), t, "fr-CA", NOW)).toBe("il y a 3 h");
    expect(sourceLabel("Form", t)).toBe("Formulaire");
    expect(sourceLabel("Referral", t)).toBe("Recommandation");
    expect(tempLabel(62, t)).toBe("Tiède");
    expect(t("rd.shared.leadCounts", { total: 40, hot: 6 })).toBe("40 au total · 6 chauds");
  });

  it("passes unknown sources through and keeps fixture labels", async () => {
    const t = i18n.t.bind(i18n);
    expect(sourceLabel("Webhook", t)).toBe("Webhook");
    expect(leadActivity({ lastActivity: "1h ago" }, t, "en-CA")).toBe("1h ago");
  });

  it("shows a clock time only for messages sent today", async () => {
    const t = i18n.t.bind(i18n);
    const now = new Date(NOW);
    expect(messageTime(ago(2 * D), t, "en-CA", now)).toBe("2d ago");
    expect(messageTime(ago(H), t, "en-CA", now)).toMatch(/\d/);
    expect(messageTime(ago(H), t, "en-CA", now)).not.toMatch(/ago/);
  });
});
