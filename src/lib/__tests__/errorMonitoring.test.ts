import { afterEach, describe, expect, it, vi } from "vitest";
import { errorMonitor, measureAPICall, withErrorLogging } from "../errorMonitoring";

/** What the two helpers log from a thrown value, and that they always rethrow it. */

afterEach(() => vi.restoreAllMocks());

describe("withErrorLogging", () => {
  it("logs an Error's message and stack, then rethrows the same error", async () => {
    const log = vi.spyOn(errorMonitor, "logError").mockImplementation(() => {});
    const boom = new Error("boom");
    await expect(withErrorLogging("db", "load", async () => { throw boom; }, "u1")).rejects.toBe(boom);
    expect(log).toHaveBeenCalledWith("db", "load failed", { error: "boom", stack: boom.stack }, "u1");
  });

  it("logs a plain Supabase-style error object's message", async () => {
    const log = vi.spyOn(errorMonitor, "logError").mockImplementation(() => {});
    const pg = { message: "permission denied", code: "42501" };
    await expect(withErrorLogging("db", "load", async () => { throw pg; })).rejects.toBe(pg);
    expect(log).toHaveBeenCalledWith("db", "load failed", { error: "permission denied", stack: undefined }, undefined);
  });

  it("still rethrows a thrown string or null, logging no message", async () => {
    const log = vi.spyOn(errorMonitor, "logError").mockImplementation(() => {});
    await expect(withErrorLogging("db", "load", async () => { throw "nope"; })).rejects.toBe("nope");
    await expect(withErrorLogging("db", "load", async () => { throw null; })).rejects.toBeNull();
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenLastCalledWith("db", "load failed", { error: undefined, stack: undefined }, undefined);
  });
});

describe("measureAPICall", () => {
  it.each([
    ["status", { status: 404, message: "not found" }, 404],
    ["statusCode", { statusCode: 429, message: "slow down" }, 429],
    ["neither (defaults to 500)", new Error("network"), 500],
  ])("logs the code from %s and rethrows", async (_what, thrown, code) => {
    const log = vi.spyOn(errorMonitor, "logAPICall").mockImplementation(() => {});
    await expect(measureAPICall("/x", "GET", async () => { throw thrown; })).rejects.toBe(thrown);
    expect(log).toHaveBeenCalledWith("/x", "GET", code, expect.any(Number), (thrown as { message: string }).message, undefined);
  });

  it("logs 200 on success", async () => {
    const log = vi.spyOn(errorMonitor, "logAPICall").mockImplementation(() => {});
    await expect(measureAPICall("/x", "GET", async () => "ok", "u1")).resolves.toBe("ok");
    expect(log).toHaveBeenCalledWith("/x", "GET", 200, expect.any(Number), undefined, "u1");
  });
});
