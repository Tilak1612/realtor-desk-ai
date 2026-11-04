// Offline harness for running the real Deno edge-function handlers in vitest.
//
// The database is an in-memory model of the PostgREST queries the handlers
// actually make: filters (eq, neq, gt, gte, lt, lte, in, is, and `col->>key`
// JSON paths), order, limit, exact/head counts, single()/maybeSingle()
// cardinality errors, column defaults and returning writes. Any other filter
// is recorded in `unsupported` and throws, so a test can never pass because a
// predicate was silently ignored. This models the query semantics used here;
// it is NOT PostgREST, Postgres, RLS or the Supabase gateway, none of which
// these tests exercise.
//
// Stripe, Resend and the Deno runtime are likewise stand-ins. Nothing here can
// reach a network.

import { vi } from "vitest";

export type Row = Record<string, unknown>;
export type Op = "select" | "insert" | "update" | "upsert" | "delete";
export type FilterKind = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "is";
export interface DbError { message: string; code?: string }
export interface Call {
  table: string;
  op: Op;
  filters: Array<[FilterKind, string, unknown]>;
  payload?: unknown;
  terminal: "many" | "single" | "maybeSingle";
  count?: "exact";
  head?: boolean;
  limit?: number;
  order?: { column: string; ascending: boolean };
  returning: boolean;
}

export interface FakeDbOptions {
  tables?: Record<string, Row[]>;
  /** Return an error to make this call fail; undefined for normal behaviour. */
  fail?: (call: Call) => DbError | undefined;
  /** Column defaults applied to inserted rows, per table (like DEFAULT now()). */
  defaults?: Record<string, () => Row>;
}

export interface QueryResult {
  data: unknown;
  error: DbError | null;
  count: number | null;
}

/** The chainable subset of the supabase-js query builder the handlers use. */
export interface QueryBuilder extends PromiseLike<QueryResult> {
  select(columns?: string, options?: { count?: "exact"; head?: boolean }): QueryBuilder;
  eq(column: string, value: unknown): QueryBuilder;
  neq(column: string, value: unknown): QueryBuilder;
  gt(column: string, value: unknown): QueryBuilder;
  gte(column: string, value: unknown): QueryBuilder;
  lt(column: string, value: unknown): QueryBuilder;
  lte(column: string, value: unknown): QueryBuilder;
  in(column: string, values: unknown[]): QueryBuilder;
  is(column: string, value: unknown): QueryBuilder;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder;
  limit(n: number): QueryBuilder;
  insert(payload: unknown): QueryBuilder;
  update(payload: unknown): QueryBuilder;
  upsert(payload: unknown): QueryBuilder;
  delete(): QueryBuilder;
  single(): Promise<QueryResult>;
  maybeSingle(): Promise<QueryResult>;
}

const SUPPORTED = new Set<FilterKind>(["eq", "neq", "gt", "gte", "lt", "lte", "in", "is"]);
const ISO = /^\d{4}-\d{2}-\d{2}T/;

function columnValue(row: Row, column: string): unknown {
  const json = column.match(/^(\w+)->>(\w+)$/);
  if (!json) return row[column];
  const v = (row[json[1]] as Row | null | undefined)?.[json[2]];
  return v === undefined || v === null ? null : String(v); // ->> yields text
}

function compare(a: unknown, b: unknown): number {
  if (typeof a === "string" && typeof b === "string" && ISO.test(a) && ISO.test(b)) return Date.parse(a) - Date.parse(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
}

function matches(row: Row, [kind, column, value]: [FilterKind, string, unknown]): boolean {
  const v = columnValue(row, column);
  switch (kind) {
    case "eq": return v !== null && v !== undefined && compare(v, value) === 0;
    case "neq": return v !== null && v !== undefined && compare(v, value) !== 0;
    case "gt": return v != null && compare(v, value) > 0;
    case "gte": return v != null && compare(v, value) >= 0;
    case "lt": return v != null && compare(v, value) < 0;
    case "lte": return v != null && compare(v, value) <= 0;
    case "in": return Array.isArray(value) && value.some((x) => compare(v, x) === 0);
    case "is": return value === null ? v === null || v === undefined : v === value;
  }
}

export function fakeSupabase(opts: FakeDbOptions = {}) {
  const tables: Record<string, Row[]> = structuredClone(opts.tables ?? {});
  const calls: Call[] = [];
  const unsupported: string[] = [];
  const invokes: Array<{ name: string; body: unknown }> = [];
  let invokeResult: { data: unknown; error: unknown } = { data: { success: true }, error: null };
  let user: { id: string; email?: string } | null = null;
  let nextId = 1;

  const execute = (call: Call): QueryResult => {
    calls.push(call);
    const injected = opts.fail?.(call);
    if (injected) return { data: null, error: injected, count: null };
    const rows = (tables[call.table] ??= []);
    const selected = () => rows.filter((r) => call.filters.every((f) => matches(r, f)));

    if (call.op === "insert" || call.op === "upsert") {
      const incoming = (Array.isArray(call.payload) ? call.payload : [call.payload]) as Row[];
      const added = incoming.map((p) => ({ id: `row-${nextId++}`, ...(opts.defaults?.[call.table]?.() ?? {}), ...p }));
      rows.push(...added);
      return shape(call, added);
    }
    if (call.op === "update") {
      const hit = selected();
      for (const r of hit) Object.assign(r, call.payload as Row);
      return shape(call, hit);
    }
    if (call.op === "delete") {
      const hit = new Set(selected());
      tables[call.table] = rows.filter((r) => !hit.has(r));
      return shape(call, [...hit]);
    }
    let out = selected();
    const count = out.length;
    if (call.order) {
      const { column, ascending } = call.order;
      out = [...out].sort((a, b) => compare(a[column], b[column]) * (ascending ? 1 : -1));
    }
    if (call.limit !== undefined) out = out.slice(0, call.limit);
    if (call.head) return { data: null, error: null, count: call.count ? count : null };
    const r = shape(call, out);
    return { ...r, count: call.count ? count : null };
  };

  const shape = (call: Call, rows: Row[]): QueryResult => {
    const isWrite = call.op !== "select";
    if (isWrite && !call.returning) return { data: null, error: null, count: null };
    if (call.terminal === "single") {
      return rows.length === 1
        ? { data: structuredClone(rows[0]), error: null, count: null }
        : { data: null, error: { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" }, count: null };
    }
    if (call.terminal === "maybeSingle") {
      if (rows.length > 1) return { data: null, error: { code: "PGRST116", message: "JSON object requested, multiple rows returned" }, count: null };
      return { data: rows[0] ? structuredClone(rows[0]) : null, error: null, count: null };
    }
    return { data: structuredClone(rows), error: null, count: null };
  };

  const from = (table: string): QueryBuilder => {
    const call: Call = { table, op: "select", filters: [], terminal: "many", returning: false };
    const b: Record<string, unknown> = {};
    b.select = (_cols?: string, o?: { count?: "exact"; head?: boolean }) => {
      if (call.op === "select") { call.count = o?.count; call.head = o?.head; } else call.returning = true;
      return b;
    };
    for (const kind of SUPPORTED) b[kind] = (col: string, val: unknown) => { call.filters.push([kind, col, val]); return b; };
    for (const kind of ["like", "ilike", "match", "filter", "or", "not", "contains", "containedBy", "textSearch", "range", "overlaps"]) {
      b[kind] = () => {
        unsupported.push(`${table}.${kind}`);
        throw new Error(`fake db: unsupported predicate ${kind} on ${table}`);
      };
    }
    b.order = (column: string, o?: { ascending?: boolean }) => { call.order = { column, ascending: o?.ascending ?? true }; return b; };
    b.limit = (n: number) => { call.limit = n; return b; };
    for (const op of ["insert", "update", "upsert"] as const) b[op] = (payload: unknown) => { call.op = op; call.payload = payload; return b; };
    b.delete = () => { call.op = "delete"; return b; };
    b.single = async () => { call.terminal = "single"; return execute(call); };
    b.maybeSingle = async () => { call.terminal = "maybeSingle"; return execute(call); };
    b.then = (ok: (v: unknown) => unknown, bad: (e: unknown) => unknown) => Promise.resolve().then(() => execute(call)).then(ok, bad);
    return b as unknown as QueryBuilder;
  };

  const client = {
    from,
    auth: { getUser: async () => ({ data: { user }, error: user ? null : { message: "invalid token" } }) },
    functions: {
      invoke: async (name: string, o: { body: unknown }) => {
        invokes.push({ name, body: o.body });
        return invokeResult;
      },
    },
  };

  return {
    client,
    tables,
    calls,
    unsupported,
    invokes,
    writes: () => calls.filter((c) => c.op !== "select"),
    reads: (table: string) => calls.filter((c) => c.op === "select" && c.table === table),
    setUser: (u: { id: string; email?: string } | null) => { user = u; },
    setInvokeResult: (r: { data: unknown; error: unknown }) => { invokeResult = r; },
  };
}

export type FakeDb = ReturnType<typeof fakeSupabase>;

/** A FunctionsHttpError-shaped error carrying the callee's HTTP status. */
export const invokeError = (status: number) =>
  Object.assign(new Error(`Edge Function returned a non-2xx status code`), { context: new Response("{}", { status }) });

export function fakeDenoEnv(initial: Record<string, string | undefined>) {
  const env: Record<string, string | undefined> = { ...initial };
  (globalThis as unknown as { Deno: unknown }).Deno = { env: { get: (k: string) => env[k] } };
  return env;
}

/** Recording stand-in for Resend: every POST is captured, nothing leaves. */
export function recordingFetch(status = 200, body: unknown = { id: "em_synthetic" }) {
  const sent: Array<{ url: string; payload: Record<string, unknown> }> = [];
  let nextStatus = status;
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    sent.push({ url, payload: JSON.parse(String(init?.body ?? "{}")) });
    return new Response(JSON.stringify(nextStatus < 400 ? body : { message: "synthetic provider failure" }), { status: nextStatus });
  });
  vi.stubGlobal("fetch", fn);
  return { fn, sent, failWith: (s: number) => { nextStatus = s; } };
}

export const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://functions.invalid/fn", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });

/**
 * Load a Deno edge function's entry file (its serve() call registers the
 * handler with the stubbed server). The path is built at run time so the
 * app's tsc, whose scope is src/ and which has no Deno types, does not follow
 * it into Deno-only code; vitest resolves it as usual.
 */
export async function importEdgeFunction(name: string): Promise<void> {
  const entry = `../../../../supabase/functions/${name}/index.ts`;
  await import(/* @vite-ignore */ entry);
}

export const isoAgo = (ms: number) => new Date(Date.now() - ms).toISOString();
export const HOUR = 3_600_000;
