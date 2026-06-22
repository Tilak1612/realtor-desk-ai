import { describe, it, expect } from "vitest";
import { normalizeHeader, parseCsv, mapRowToContact } from "@/lib/csvImport";

// Regression coverage for the contact CSV import (core CRM "uploads" feature).
// Added by audit on 2026-06-21 — the parser/mapper handles messy real-world
// CSVs (quoted commas, escaped quotes, BOM, CRLF, header variants, name
// splitting) and had no test coverage.

describe("normalizeHeader", () => {
  it("snake_cases spaces, dashes, and slashes", () => {
    expect(normalizeHeader("First Name")).toBe("first_name");
    expect(normalizeHeader("E-mail Address")).toBe("e_mail_address");
    expect(normalizeHeader("Company / HQ")).toBe("company_hq");
  });

  it("strips punctuation and collapses repeats", () => {
    expect(normalizeHeader("Company (HQ)")).toBe("company_hq");
    expect(normalizeHeader("  Phone #  ")).toBe("phone");
    expect(normalizeHeader("FIRSTNAME")).toBe("firstname");
  });
});

describe("parseCsv", () => {
  it("returns [] for empty input", () => {
    expect(parseCsv("")).toEqual([]);
    expect(parseCsv("\n\n")).toEqual([]);
  });

  it("parses a simple file into normalized-key rows", () => {
    const rows = parseCsv("First Name,Email\nJohn,john@example.com");
    expect(rows).toEqual([{ first_name: "John", email: "john@example.com" }]);
  });

  it("handles quoted fields containing commas", () => {
    const rows = parseCsv('name,city\n"Smith, John","Toronto, ON"');
    expect(rows[0]).toEqual({ name: "Smith, John", city: "Toronto, ON" });
  });

  it("handles escaped double quotes inside quoted fields", () => {
    const rows = parseCsv('note\n"he said ""hi"""');
    expect(rows[0].note).toBe('he said "hi"');
  });

  it("strips a leading UTF-8 BOM", () => {
    const rows = parseCsv("﻿email\na@b.com");
    expect(rows[0]).toEqual({ email: "a@b.com" });
  });

  it("handles CRLF and mixed line endings", () => {
    const rows = parseCsv("email\r\na@b.com\r\nc@d.com");
    expect(rows.map((r) => r.email)).toEqual(["a@b.com", "c@d.com"]);
  });

  it("drops fully blank rows but keeps partial rows", () => {
    const rows = parseCsv("first_name,email\nJohn,\n\n,jane@example.com");
    expect(rows).toEqual([
      { first_name: "John", email: "" },
      { first_name: "", email: "jane@example.com" },
    ]);
  });

  it("trims cell whitespace", () => {
    const rows = parseCsv("name\n  Padded  ");
    expect(rows[0].name).toBe("Padded");
  });
});

describe("mapRowToContact", () => {
  const uid = "user-123";

  it("maps direct first/last/email/phone with default source", () => {
    const c = mapRowToContact(
      { first_name: "John", last_name: "Doe", email: "j@d.com", phone: "416-555-0123" },
      uid
    );
    expect(c).toMatchObject({
      user_id: uid,
      first_name: "John",
      last_name: "Doe",
      email: "j@d.com",
      phone: "416-555-0123",
      source: "csv_import",
      tags: [],
    });
  });

  it("splits full_name when no first/last is present and preserves the original", () => {
    const c = mapRowToContact({ full_name: "Jane Mary Smith", email: "j@s.com" }, uid);
    expect(c?.first_name).toBe("Jane");
    expect(c?.last_name).toBe("Mary Smith");
    expect(c?.metadata.full_name).toBe("Jane Mary Smith");
  });

  it("resolves header aliases for email and phone", () => {
    const c = mapRowToContact(
      { given_name: "A", surname: "B", email_address: "x@y.com", mobile_phone: "999" },
      uid
    );
    expect(c?.email).toBe("x@y.com");
    expect(c?.phone).toBe("999");
  });

  it("returns null for unsalvageable rows (no name and no email)", () => {
    expect(mapRowToContact({ phone: "555" }, uid)).toBeNull();
    expect(mapRowToContact({}, uid)).toBeNull();
  });

  it("splits tags on semicolons and trims them", () => {
    const c = mapRowToContact({ email: "a@b.com", tags: " vip ; buyer ;; seller " }, uid);
    expect(c?.tags).toEqual(["vip", "buyer", "seller"]);
  });

  it("stashes non-column fields into metadata and honors an explicit source", () => {
    const c = mapRowToContact(
      {
        first_name: "K",
        company: "Acme",
        website: "acme.com",
        job_title: "Agent",
        notes: "met at open house",
        source: "referral",
      },
      uid
    );
    expect(c?.source).toBe("referral");
    expect(c?.metadata).toMatchObject({
      company_name: "Acme",
      company_domain: "acme.com",
      job_title: "Agent",
      notes_imported: "met at open house",
    });
  });

  it("does not stash full_name when first/last came in directly", () => {
    const c = mapRowToContact({ first_name: "Solo", email: "s@x.com" }, uid);
    expect(c?.metadata.full_name).toBeUndefined();
  });
});
