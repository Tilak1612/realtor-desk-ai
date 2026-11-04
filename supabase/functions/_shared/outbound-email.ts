// The one place every RealtorDesk email leaves through.
//
// Real recipients are mailed only when the function's environment is
// explicitly production: EMAIL_ENVIRONMENT=production, set as a Supabase
// function secret on the production project. Anything else (preview,
// staging, development, test, a typo, or nothing set at all) is treated as
// not production and the message goes to the test inbox instead, with:
//   - to: the test inbox only; cc, bcc, reply_to, headers and tags dropped
//   - subject prefixed "[TEST · realtordesk · <environment>]"
//   - every original recipient address, and every unsubscribe token (which
//     encodes the recipient and would opt the real person out if clicked),
//     redacted from the subject and body
// NODE_ENV is deliberately not consulted: a preview build can run with
// NODE_ENV=production and still must not mail real people.
//
// No imports, so vitest can load it (src/test/functions/) as well as Deno.
// Nothing here logs a recipient address.

export const TEST_INBOX = "tilak1111@gmail.com";
export const PRODUCT_TAG = "realtordesk";
export const RESEND_EMAILS_URL = "https://api.resend.com/emails";
export const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";

const KNOWN_ENVIRONMENTS = ["production", "preview", "staging", "development", "test"] as const;
export type EmailEnvironment = (typeof KNOWN_ENVIRONMENTS)[number] | "unknown";

/** Exactly "production" (any case, trimmed) is production; anything unrecognised is "unknown". */
export function resolveEmailEnvironment(value: string | null | undefined): EmailEnvironment {
  const v = (value ?? "").trim().toLowerCase();
  return (KNOWN_ENVIRONMENTS as readonly string[]).includes(v) ? (v as EmailEnvironment) : "unknown";
}

/** EMAIL_ENVIRONMENT from the Deno runtime, or undefined outside Deno (tests). */
export function readEmailEnvironment(): string | undefined {
  const deno = (globalThis as { Deno?: { env: { get(name: string): string | undefined } } }).Deno;
  return deno?.env.get("EMAIL_ENVIRONMENT");
}

type Addresses = string | string[] | undefined | null;

export interface OutboundEmail {
  from: string;
  to: Addresses;
  cc?: Addresses;
  bcc?: Addresses;
  reply_to?: Addresses;
  subject: string;
  html?: string;
  text?: string;
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
}

export interface GuardedEmail {
  payload: OutboundEmail;
  environment: EmailEnvironment;
  /** True when the original recipients were replaced by the test inbox. */
  rerouted: boolean;
}

const list = (a: Addresses): string[] =>
  (Array.isArray(a) ? a : a ? [a] : []).map((x) => String(x).trim()).filter(Boolean);

/** "Name <a@b.c>" -> "a@b.c", lowercased. */
export const addressOf = (s: string): string => (s.match(/<([^>]+)>/)?.[1] ?? s).trim().toLowerCase();

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------- redaction of test copies ----------
//
// A test copy must not carry anything that acts on, or identifies, the real
// recipient. Email HTML encodes the same text many ways (&amp;, &#38;, &#38,
// &#x26;, %26, mixed), and a browser's URL parser drops ASCII tab/LF/CR
// anywhere in a URL and trims leading/trailing C0 controls and spaces, so a
// link can be split and still work. Every check below follows those rules.
// This is redaction of the known recipients and of actionable links, not
// anonymisation: other personal data in a body (a name, say) is left as is.
//
// Numeric references follow the HTML tokenizer: digits are read greedily, the
// trailing semicolon is optional, and an invalid value (0, a surrogate, or
// beyond U+10FFFF, however long the number) becomes U+FFFD instead of
// throwing. C1 values (0x80-0x9F) also map to U+FFFD here rather than to their
// windows-1252 characters; none of those is ASCII, so classification of links
// and addresses is the same either way.

const NAMED_ENTITIES: Record<string, string[]> = {
  "&": ["&amp;?"], "@": ["&commat;"], ".": ["&period;"], "=": ["&equals;"], "?": ["&quest;"],
  "<": ["&lt;?"], ">": ["&gt;?"], '"': ["&quot;?"], "'": ["&apos;"], "+": ["&plus;"],
  "-": ["&hyphen;", "&dash;"], "_": ["&lowbar;"], "/": ["&sol;"], ":": ["&colon;"], "#": ["&num;"],
};

/**
 * A regex fragment matching one character literally or in any HTML / percent
 * encoding. A numeric form only matches when the number ends there, as the
 * tokenizer reads it: "&#640" is U+0280, never "@" followed by "0".
 */
function encodedChar(ch: string): string {
  const forms = new Set<string>();
  for (const c of new Set([ch, ch.toLowerCase(), ch.toUpperCase()])) {
    const code = c.codePointAt(0)!;
    forms.add(escapeRegExp(c));
    forms.add(`&#0*${code}(?![0-9]);?`);
    forms.add(`&#[xX]0*${code.toString(16)}(?![0-9a-fA-F]);?`);
    if (code < 0x80) forms.add(`%${code.toString(16).padStart(2, "0")}`);
    for (const n of NAMED_ENTITIES[c] ?? []) forms.add(n);
  }
  return `(?:${[...forms].join("|")})`;
}

const encodedWord = (w: string) => [...w].map(encodedChar).join("");

const ENTITY_MAP: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", commat: "@", period: ".", equals: "=",
  quest: "?", plus: "+", hyphen: "-", dash: "-", lowbar: "_", sol: "/", colon: ":", num: "#",
  tab: "\t", newline: "\n",
};

/** The character a numeric reference stands for; U+FFFD when it stands for none. Never throws. */
function scalarFor(cp: number): string {
  if (!Number.isFinite(cp) || cp === 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) return "�";
  if (cp >= 0x80 && cp <= 0x9f) return "�";
  return String.fromCodePoint(cp);
}

/** One pass of HTML character reference decoding (numeric with or without ";", named, legacy). */
function decodeHtmlRefs(s: string): string {
  return s
    .replace(/&#(?:[xX]([0-9a-fA-F]+)|([0-9]+));?/g, (_, h, d) => scalarFor(h !== undefined ? parseInt(h, 16) : parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => ENTITY_MAP[n.toLowerCase()] ?? m)
    .replace(/&(amp|lt|gt|quot)(?![0-9a-zA-Z=;])/gi, (m, n) => ENTITY_MAP[n.toLowerCase()] ?? m);
}

const percentDecode = (s: string) => s.replace(/%([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

/** What the URL parser does before anything else: drop tab/LF/CR, trim C0 controls and spaces. */
const C0_OR_SPACE = "[\\u0000-\\u0020]+";
const URL_TRIM = new RegExp(`^${C0_OR_SPACE}|${C0_OR_SPACE}$`, "g");
const stripUrlWhitespace = (s: string) => s.replace(/[\t\n\r]/g, "").replace(URL_TRIM, "");

/** Decode HTML references and percent-escapes, repeatedly, so nested encodings are seen too. */
export function decodeForInspection(s: string): string {
  let out = s;
  for (let i = 0; i < 4; i++) {
    const next = percentDecode(decodeHtmlRefs(out));
    if (next === out) break;
    out = next;
  }
  return out;
}

/** A URL as the browser would act on it, for classification only (never sent). */
function normalizeUrlForInspection(raw: string): string {
  let out = raw;
  for (let i = 0; i < 4; i++) {
    const next = stripUrlWhitespace(percentDecode(stripUrlWhitespace(decodeHtmlRefs(out))));
    if (next === out) break;
    out = next;
  }
  return out.toLowerCase();
}

/** Query parameters that make a link act on an account (opt out, sign in, confirm, authorise). */
const ACTION_PARAMS = ["token", "code", "key", "sig", "signature", "state", "auth", "access_token", "refresh_token", "otp", "nonce"];

/** True when a URL, in any encoding or split, opts someone out or carries a credential-like parameter. */
export function isActionableLink(raw: string): boolean {
  const d = normalizeUrlForInspection(raw);
  if (/\/unsubscribe\b/.test(d)) return true;
  const names = [...d.matchAll(/[?&#;]\s*([a-z0-9_-]+)\s*=/g)].map((m) => m[1]);
  return names.some((n) => ACTION_PARAMS.includes(n));
}

const mentionsRecipient = (raw: string, addresses: string[]) => {
  if (addresses.length === 0) return false;
  const d = normalizeUrlForInspection(raw);
  return addresses.some((a) => d.includes(a.toLowerCase()));
};

const SEPARATOR = `(?:[?&;#]|${["&", "?"].map(encodedChar).join("|")})`;
const EQUALS = encodedChar("=");
const ACTION_PARAM_VALUE = new RegExp(`(${SEPARATOR}(?:${ACTION_PARAMS.map(encodedWord).join("|")})${EQUALS})[^\\s"'<>&]*`, "gi");
const URL_ATTRIBUTE = /(\b(?:href|src|action|formaction|background|cite|poster)\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
const BARE_URL = /\b(?:https?|mailto)(?::|%3a|&#0*58(?![0-9]);?|&#x0*3a(?![0-9a-f]);?|&colon;)[^\s"'<>]*/gi;

/**
 * Neutralise every actionable link (attribute values, bare URLs, stray
 * token=... fragments) and every link whose target names one of `addresses`.
 */
export function neutralizeActionableLinks(s: string, addresses: string[] = []): string {
  const unsafe = (u: string) => isActionableLink(u) || mentionsRecipient(u, addresses);
  return s
    .replace(URL_ATTRIBUTE, (m, attr, dq, sq, bare) => (unsafe(dq ?? sq ?? bare ?? "") ? `${attr}"#redacted-test-link"` : m))
    .replace(BARE_URL, (u) => (unsafe(u) ? "[redacted test link]" : u))
    .replace(ACTION_PARAM_VALUE, "$1redacted-test-copy");
}

/**
 * Remove the given recipient addresses, in any HTML / percent encoding or
 * mix of them, and neutralise actionable links. Ordinary text is untouched.
 */
export function redactRecipients(s: string, addresses: string[]): string {
  const known = [...new Set(addresses.filter(Boolean))];
  let out = neutralizeActionableLinks(s, known);
  for (const a of known) {
    out = out.replace(new RegExp(encodedWord(a), "gi"), "[redacted recipient]");
  }
  return out;
}

// ---------- delivery mode and the state it may touch ----------

export interface DeliveryMode {
  environment: EmailEnvironment;
  /** True only for EMAIL_ENVIRONMENT=production. */
  production: boolean;
}

export function deliveryMode(raw: string | null | undefined = readEmailEnvironment()): DeliveryMode {
  const environment = resolveEmailEnvironment(raw);
  return { environment, production: environment === "production" };
}

/**
 * The event_type a send is recorded and deduplicated under. Production keys
 * are unchanged. Outside production the key is namespaced, so a test copy
 * (which only reaches the test inbox) never satisfies a real user's dedup
 * check or consumes their lifecycle step, even on a database shared with
 * production; test sends are still deduplicated among themselves.
 */
export function deliveryEventKey(eventType: string, mode: DeliveryMode): string {
  return mode.production ? eventType : `test:${mode.environment}:${eventType}`;
}

const recipientsOf = (email: OutboundEmail): string[] =>
  [...list(email.to), ...list(email.cc), ...list(email.bcc), ...list(email.reply_to)].map(addressOf);

/**
 * Apply the production rule to one message. Pure: no I/O, no logging.
 * `alsoRedact` lets a batch redact every recipient of every message from each
 * one, so no message carries another message's original recipient.
 */
export function guardOutbound(email: OutboundEmail, environment: EmailEnvironment, alsoRedact: string[] = []): GuardedEmail {
  if (environment === "production") {
    return { payload: { ...email }, environment, rerouted: false };
  }
  const originals = [...new Set([...recipientsOf(email), ...alsoRedact.map(addressOf)])];
  const redact = (s: string) => redactRecipients(s, originals);
  const payload: OutboundEmail = {
    from: email.from,
    to: [TEST_INBOX],
    subject: `[TEST · ${PRODUCT_TAG} · ${environment}] ${redact(email.subject)}`,
  };
  if (email.html !== undefined) payload.html = redact(email.html);
  if (email.text !== undefined) payload.text = redact(email.text);
  return { payload, environment, rerouted: true };
}

export function guardBatch(emails: OutboundEmail[], environment: EmailEnvironment): GuardedEmail[] {
  const everyone = emails.flatMap(recipientsOf);
  return emails.map((e) => guardOutbound(e, environment, everyone));
}

export type SendResult =
  | { status: "sent"; id: string | null; environment: EmailEnvironment; rerouted: boolean }
  | { status: "failed"; httpStatus: number | null; error: string; environment: EmailEnvironment; rerouted: boolean };

export interface SendOptions {
  apiKey: string | null | undefined;
  /** Raw EMAIL_ENVIRONMENT value; defaults to the Deno runtime's. */
  environment?: string | null;
  fetchImpl?: typeof fetch;
}

const GUARD_FAILED = "outbound guard failed; nothing sent";

/** The guard could not finish (malformed input): fail closed, send nothing, echo no content. */
const guardFailed = (environment: EmailEnvironment): SendResult =>
  ({ status: "failed", httpStatus: null, error: GUARD_FAILED, environment, rerouted: environment !== "production" });

/**
 * Send one message through the guard. Returns "sent" only when Resend accepted
 * it (2xx); every other outcome is "failed" with the reason, never thrown.
 */
export async function sendEmail(email: OutboundEmail, opts: SendOptions): Promise<SendResult> {
  const environment = resolveEmailEnvironment(opts.environment ?? readEmailEnvironment());
  let guarded: GuardedEmail;
  try {
    guarded = guardOutbound(email, environment);
  } catch {
    return guardFailed(environment);
  }
  const meta = { environment, rerouted: guarded.rerouted };
  if (!opts.apiKey) return { status: "failed", httpStatus: null, error: "email service not configured", ...meta };
  if (list(email.to).length === 0) return { status: "failed", httpStatus: null, error: "no recipient", ...meta };
  return post(RESEND_EMAILS_URL, guarded.payload, opts, meta, (body) => (body as { id?: string })?.id ?? null);
}

/** Send several messages in one Resend batch call, each through the guard. */
export async function sendBatch(emails: OutboundEmail[], opts: SendOptions): Promise<SendResult> {
  const environment = resolveEmailEnvironment(opts.environment ?? readEmailEnvironment());
  let guarded: GuardedEmail[];
  try {
    guarded = guardBatch(emails, environment);
  } catch {
    return guardFailed(environment);
  }
  const meta = { environment, rerouted: guarded.some((g) => g.rerouted) };
  if (!opts.apiKey) return { status: "failed", httpStatus: null, error: "email service not configured", ...meta };
  if (emails.length === 0 || emails.some((e) => list(e.to).length === 0)) {
    return { status: "failed", httpStatus: null, error: "no recipient", ...meta };
  }
  return post(RESEND_BATCH_URL, guarded.map((g) => g.payload), opts, meta, () => null);
}

async function post(
  url: string,
  body: unknown,
  opts: SendOptions,
  meta: { environment: EmailEnvironment; rerouted: boolean },
  idOf: (json: unknown) => string | null,
): Promise<SendResult> {
  const doFetch = opts.fetchImpl ?? fetch;
  try {
    const res = await doFetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${opts.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { status: "failed", httpStatus: res.status, error: detail || `HTTP ${res.status}`, ...meta };
    }
    const json = await res.json().catch(() => null);
    return { status: "sent", id: idOf(json), ...meta };
  } catch (err) {
    return { status: "failed", httpStatus: null, error: err instanceof Error ? err.message : String(err), ...meta };
  }
}
