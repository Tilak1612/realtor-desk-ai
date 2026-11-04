import { afterEach, describe, expect, it, vi } from "vitest";
import {
  guardBatch,
  guardOutbound,
  readEmailEnvironment,
  resolveEmailEnvironment,
  RESEND_BATCH_URL,
  RESEND_EMAILS_URL,
  sendBatch,
  sendEmail,
  TEST_INBOX,
  type OutboundEmail,
} from "../../../supabase/functions/_shared/outbound-email.ts";

// Synthetic addresses only. A mocked fetch stands in for Resend: nothing leaves.

const ORIGINALS = ["agent.one@example.com", "copy@example.org", "hidden@example.net", "replies@example.com"];
const unsubscribeUrl = "https://www.realtordesk.ai/unsubscribe?token=eyJlIjoiYWdlbnQub25lQGV4YW1wbGUuY29tIn0.c2lnbmF0dXJl";

const message = (): OutboundEmail => ({
  from: "RealtorDesk AI <support@realtordesk.ai>",
  to: ["Agent One <Agent.One@Example.com>"],
  cc: ["copy@example.org"],
  bcc: "hidden@example.net",
  reply_to: "replies@example.com",
  subject: "Hello agent.one@example.com",
  html: `<p>Sent to agent.one@example.com (${encodeURIComponent("agent.one@example.com")})</p><a href="${unsubscribeUrl}">Unsubscribe</a>`,
  text: "Sent to AGENT.ONE@EXAMPLE.COM",
  headers: { "List-Unsubscribe": `<${unsubscribeUrl}>`, "X-Recipient": "agent.one@example.com" },
  tags: [{ name: "recipient", value: "agent.one@example.com" }],
});

const NON_PRODUCTION = ["development", "test", "preview", "staging", "unknown"] as const;

const leaks = (value: unknown) => {
  const s = JSON.stringify(value).toLowerCase();
  return ORIGINALS.filter((a) => s.includes(a) || s.includes(encodeURIComponent(a)));
};

afterEach(() => vi.restoreAllMocks());

describe("resolveEmailEnvironment", () => {
  it.each([
    ["production", "production"],
    [" PRODUCTION ", "production"],
    ["preview", "preview"],
    ["staging", "staging"],
    ["development", "development"],
    ["test", "test"],
    [undefined, "unknown"],
    [null, "unknown"],
    ["", "unknown"],
    ["prod", "unknown"],
    ["live", "unknown"],
  ])("%j is %s", (raw, expected) => {
    expect(resolveEmailEnvironment(raw as string | undefined)).toBe(expected);
  });

  it("ignores NODE_ENV: a preview build with NODE_ENV=production is not production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(readEmailEnvironment()).toBeUndefined(); // no Deno runtime, nothing set
    expect(resolveEmailEnvironment(readEmailEnvironment())).toBe("unknown");
    vi.unstubAllEnvs();
  });
});

describe("guardOutbound outside production", () => {
  it.each(NON_PRODUCTION)("%s: only the test inbox, labelled, with no original recipient anywhere", (env) => {
    const { payload, rerouted, environment } = guardOutbound(message(), env);

    expect(rerouted).toBe(true);
    expect(environment).toBe(env);
    expect(payload.to).toEqual([TEST_INBOX]);
    expect(Object.keys(payload).sort()).toEqual(["from", "html", "subject", "text", "to"]);
    expect(payload.subject.startsWith(`[TEST · realtordesk · ${env}] `)).toBe(true);
    expect(leaks(payload)).toEqual([]);
  });

  it("neutralises the unsubscribe link, which would opt the real recipient out if clicked", () => {
    const { payload } = guardOutbound(message(), "preview");
    expect(payload.html).not.toContain("eyJlIjoiYWdlbnQub25lQGV4YW1wbGUuY29tIn0");
    expect(payload.html).toContain('href="#redacted-test-link"');
  });

  it("does not mutate the caller's message", () => {
    const m = message();
    const before = JSON.stringify(m);
    guardOutbound(m, "test");
    expect(JSON.stringify(m)).toBe(before);
  });
});

describe("guardOutbound in production", () => {
  it("passes the message through unchanged, cc and bcc included", () => {
    const m = message();
    const { payload, rerouted } = guardOutbound(m, "production");
    expect(rerouted).toBe(false);
    expect(payload).toEqual(m);
  });
});

describe("guardBatch", () => {
  it("guards every message in a batch", () => {
    const batch = [message(), { ...message(), to: "second@example.com" }];
    const out = guardBatch(batch, "staging");
    expect(out.every((g) => g.rerouted && JSON.stringify(g.payload.to) === JSON.stringify([TEST_INBOX]))).toBe(true);
    expect(leaks(out)).toEqual([]);
    expect(JSON.stringify(out)).not.toContain("second@example.com");
  });
});

const okFetch = (id = "em_synthetic") =>
  vi.fn(async () => new Response(JSON.stringify({ id }), { status: 200, headers: { "content-type": "application/json" } }));

describe("sendEmail", () => {
  it.each(NON_PRODUCTION.filter((e) => e !== "unknown"))("%s: the request itself carries no original recipient", async (env) => {
    const fetchImpl = okFetch();
    const res = await sendEmail(message(), { apiKey: "re_synthetic", environment: env, fetchImpl });

    expect(res).toEqual({ status: "sent", id: "em_synthetic", environment: env, rerouted: true });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RESEND_EMAILS_URL);
    expect(JSON.parse(init.body as string).to).toEqual([TEST_INBOX]);
    expect(leaks({ url, init })).toEqual([]);
  });

  it("an unset environment fails safe to the test inbox", async () => {
    const fetchImpl = okFetch();
    const res = await sendEmail(message(), { apiKey: "re_synthetic", fetchImpl });
    expect(res).toMatchObject({ status: "sent", environment: "unknown", rerouted: true });
    expect(leaks(fetchImpl.mock.calls)).toEqual([]);
  });

  it("production sends to the real recipients", async () => {
    const fetchImpl = okFetch();
    await sendEmail(message(), { apiKey: "re_synthetic", environment: "production", fetchImpl });
    const body = JSON.parse((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.to).toEqual(["Agent One <Agent.One@Example.com>"]);
    expect(body.bcc).toBe("hidden@example.net");
  });

  it("reports a provider rejection as failed, never sent, and does not throw", async () => {
    const fetchImpl = vi.fn(async () => new Response('{"message":"invalid from"}', { status: 422 }));
    const res = await sendEmail(message(), { apiKey: "re_synthetic", environment: "production", fetchImpl });
    expect(res).toMatchObject({ status: "failed", httpStatus: 422, error: '{"message":"invalid from"}' });
  });

  it("reports a network error as failed", async () => {
    const fetchImpl = vi.fn(async () => { throw new TypeError("network down"); });
    const res = await sendEmail(message(), { apiKey: "re_synthetic", environment: "preview", fetchImpl });
    expect(res).toMatchObject({ status: "failed", httpStatus: null, error: "network down", rerouted: true });
  });

  it("fails without calling the provider when not configured or without a recipient", async () => {
    const fetchImpl = okFetch();
    expect(await sendEmail(message(), { apiKey: undefined, environment: "production", fetchImpl })).toMatchObject({ status: "failed", error: "email service not configured" });
    expect(await sendEmail({ ...message(), to: [] }, { apiKey: "re_synthetic", environment: "production", fetchImpl })).toMatchObject({ status: "failed", error: "no recipient" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("logs nothing, so no recipient reaches the logs", async () => {
    const spies = (["log", "info", "warn", "error", "debug"] as const).map((k) => vi.spyOn(console, k).mockImplementation(() => {}));
    await sendEmail(message(), { apiKey: "re_synthetic", environment: "preview", fetchImpl: okFetch() });
    await sendEmail(message(), { apiKey: "re_synthetic", environment: "preview", fetchImpl: vi.fn(async () => new Response("bad", { status: 500 })) });
    for (const s of spies) expect(s).not.toHaveBeenCalled();
  });
});

describe("sendBatch", () => {
  it("posts every guarded message to the batch endpoint with no original recipient", async () => {
    const fetchImpl = okFetch();
    const res = await sendBatch([message(), { ...message(), to: "second@example.com" }], { apiKey: "re_synthetic", environment: "test", fetchImpl });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(res).toMatchObject({ status: "sent", rerouted: true });
    expect(url).toBe(RESEND_BATCH_URL);
    expect(JSON.parse(init.body as string).map((m: { to: string[] }) => m.to)).toEqual([[TEST_INBOX], [TEST_INBOX]]);
    expect(leaks(init)).toEqual([]);
    expect(String(init.body)).not.toContain("second@example.com");
  });

  it("refuses a batch with a message that has no recipient", async () => {
    const fetchImpl = okFetch();
    expect(await sendBatch([message(), { ...message(), to: [] }], { apiKey: "re_synthetic", environment: "production", fetchImpl })).toMatchObject({ status: "failed", error: "no recipient" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

// ---------- encodings an HTML email really uses ----------

const TOKEN = "eyJzeW50aGV0aWMiOnRydWV9.c2ln";
const inPreview = (html: string, to: OutboundEmail["to"] = "agent.one@example.com") =>
  guardOutbound({ from: "RealtorDesk AI <support@realtordesk.ai>", to, subject: "s", html }, "preview").payload.html!;

describe("redaction across HTML and percent encodings", () => {
  it.each([
    ["&amp;token= in an href", `<a href="https://www.realtordesk.ai/unsubscribe?a=1&amp;token=${TOKEN}">x</a>`],
    ["a percent-encoded parameter name ?%74oken=", `<a href="https://www.realtordesk.ai/x?%74oken=${TOKEN}">x</a>`],
    ["a hex entity &#x74;oken=", `<a href="https://www.realtordesk.ai/x?&#x74;oken=${TOKEN}">x</a>`],
    ["mixed &amp;%74ok&#101;n=", `<a href='https://www.realtordesk.ai/x?a=1&amp;%74ok&#101;n=${TOKEN}'>x</a>`],
    ["an unquoted href", `<a href=https://www.realtordesk.ai/unsubscribe?token=${TOKEN}>x</a>`],
    ["a bare URL in text", `Opt out: https://www.realtordesk.ai/unsubscribe?token=${TOKEN} today`],
    ["a fully percent-encoded URL in text", `see https%3A%2F%2Fwww.realtordesk.ai%2Funsubscribe%3Ftoken%3D${TOKEN}`],
    ["a stray fragment outside any URL", `ref &amp;token=${TOKEN} end`],
  ])("removes the token for %s", (_what, html) => {
    const out = inPreview(html);
    expect(out).not.toContain(TOKEN);
    expect(decodeURIComponent(out.replace(/&amp;/g, "&"))).not.toContain(TOKEN);
  });

  it("removes every value of a repeated parameter", () => {
    const out = inPreview(`https://www.realtordesk.ai/x?token=first-${TOKEN}&token=second-${TOKEN}`);
    expect(out).not.toContain("first-");
    expect(out).not.toContain("second-");
  });

  it.each([
    ["HTML-escaped", "a&amp;b@example.com"],
    ["numeric entities", "a&#38;b&#64;example&#46;com"],
    ["hex entities", "a&#x26;b&#x40;example.com"],
    ["percent-encoded", "a%26b%40example.com"],
    ["mixed", "A&amp;B%40Example&#46;COM"],
  ])("redacts a recipient written %s", (_what, written) => {
    const out = inPreview(`<p>Sent to ${written}.</p>`, "a&b@example.com");
    expect(out).toBe("<p>Sent to [redacted recipient].</p>");
  });

  it("leaves ordinary text and ordinary links alone", () => {
    const html = '<p>A token of thanks. Code review on Monday. Write to support@realtordesk.ai.</p><a href="https://www.realtordesk.ai/dashboard?tab=leads">Dashboard</a>';
    expect(inPreview(html)).toBe(html);
  });

  it("does not let one batch message carry another message's escaped recipient", () => {
    const out = guardBatch([
      { from: "f@x.example", to: "a&b@example.com", subject: "1", html: "<p>one</p>" },
      { from: "f@x.example", to: "second@example.com", subject: "2", html: "<p>cc a&amp;b@example.com and second&#64;example.com</p>" },
    ], "staging");
    expect(out[1].payload.html).toBe("<p>cc [redacted recipient] and [redacted recipient]</p>");
  });

  it("production mail is not touched by any of this", () => {
    const html = `<a href="https://www.realtordesk.ai/unsubscribe?a=1&amp;token=${TOKEN}">x</a> a&amp;b@example.com`;
    expect(guardOutbound({ from: "f", to: "a&b@example.com", subject: "s", html }, "production").payload.html).toBe(html);
  });
});

// ---------- HTML/URL parsing semantics (v3) ----------
//
// Browsers decode numeric character references with or without the trailing
// semicolon, and the URL parser drops ASCII tab/LF/CR anywhere in a URL and
// trims leading/trailing C0 controls and spaces. Classification follows that.

describe("redaction follows HTML and URL parsing", () => {
  const T = "eyJzeW50aGV0aWMiOnRydWV9.c2ln";
  const NEUTRAL = '<a href="#redacted-test-link">x</a>';

  it.each([
    ["decimal, no semicolon", `<a href="https://www.realtordesk.ai/x?a=1&#38token=${T}">x</a>`],
    ["decimal param name, no semicolon", `<a href="https://www.realtordesk.ai/x?&#116oken=${T}">x</a>`],
    ["hex param name, no semicolon", `<a href="https://www.realtordesk.ai/x?&#x74oken=${T}">x</a>`],
    ["zero-padded hex, no semicolon", `<a href="https://www.realtordesk.ai/x?&#x0074oken=${T}">x</a>`],
    ["path split by an encoded newline", `<a href="https://www.realtordesk.ai/unsub&#10;scribe?id=${T}">x</a>`],
    ["path split by an encoded tab, no semicolon", `<a href="https://www.realtordesk.ai/unsub&#9scribe?id=${T}">x</a>`],
    ["param split by a raw tab", `<a href="https://www.realtordesk.ai/x?to\tken=${T}">x</a>`],
    ["param split by a raw CR LF", `<a href="https://www.realtordesk.ai/x?tok\r\nen=${T}">x</a>`],
    ["leading control and space", `<a href="\u0001 https://www.realtordesk.ai/unsubscribe?id=${T}">x</a>`],
  ])("neutralises an actionable link written with %s", (_what, html) => {
    expect(inPreview(html)).toBe(NEUTRAL);
  });

  it.each([
    ["decimal, no semicolons", "agent&#46one&#64example&#46com"],
    // Hex digits are read greedily too, so a semicolonless hex reference is only
    // the intended character when the next letter is not a hex digit.
    ["hex, no semicolon where the number ends", "agent&#x2Eone&#X40;example&#x2E;com"],
    ["mixed with and without", "agent&#46;one&#64example.com"],
  ])("redacts a recipient written with %s", (_what, written) => {
    expect(inPreview(`<p>${written}</p>`)).toBe("<p>[redacted recipient]</p>");
  });

  it("does not misread a longer number as a shorter entity (HTML reads digits greedily)", () => {
    // &#640 is U+0280, not "@0"; &#x40e is U+040E, not "@e": neither is the recipient.
    for (const html of ["<p>agent.one&#640example.com</p>", "<p>agent.one&#x40example.com</p>"]) {
      expect(inPreview(html)).toBe(html);
    }
  });

  it("neutralises a mailto link whose address is split by a newline", () => {
    expect(inPreview('<a href="mailto:agent.one@exam&#10;ple.com">x</a>')).toBe(NEUTRAL);
    expect(inPreview('<a href="mailto:agent.one@exam\nple.com">x</a>')).toBe(NEUTRAL);
  });

  it.each([
    ["beyond U+10FFFF", "&#99999999999;"],
    ["U+110000 in hex", "&#x110000;"],
    ["a lone surrogate", "&#xD800;"],
    ["NUL", "&#0;"],
    ["an absurdly long number", `&#${"9".repeat(400)};`],
  ])("an invalid numeric reference (%s) does not throw and is left as written in ordinary text", (_what, ref) => {
    const html = `<p>value ${ref} here</p>`;
    expect(() => inPreview(html)).not.toThrow();
    expect(inPreview(html)).toBe(html);
  });

  it("an invalid reference inside an actionable link still gets the link neutralised", () => {
    expect(inPreview(`<a href="https://www.realtordesk.ai/unsubscribe?x=&#x110000;&token=${T}">x</a>`)).toBe(NEUTRAL);
  });

  it("leaves ordinary text, ordinary references and ordinary links exactly as they were", () => {
    const html = [
      "<p>&#169; 2026 RealtorDesk &#8212; tokens of thanks &amp; code review.</p>",
      '<a href="https://www.realtordesk.ai/dashboard?tab=leads&amp;sort=new">Dashboard</a>',
      '<a href="https://www.realtordesk.ai/pricing&#10;">Pricing</a>',
    ].join("");
    expect(inPreview(html)).toBe(html);
  });

  it("a guard failure sends nothing and reports a structured failure", async () => {
    const hostile = { from: "f", to: "a@example.com", subject: "s", get html(): string { throw new RangeError("boom"); } };
    const fetchImpl = vi.fn();
    const res = await sendEmail(hostile as unknown as OutboundEmail, { apiKey: "re_synthetic", environment: "preview", fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(res).toMatchObject({ status: "failed", httpStatus: null, error: "outbound guard failed; nothing sent" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
