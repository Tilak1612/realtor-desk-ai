import { describe, it, expect } from "vitest";
import { toCsv, datedFilename } from "../csv";

// The legacy exporter in Contacts.tsx joins values with commas and no
// escaping, so a contact named "Smith, Jr." silently shifts every following
// column and the file will not parse. These cases pin the behaviour that
// replaces it.
describe("toCsv", () => {
  const strip = (s: string) => s.replace(/^﻿/, "");

  it("emits a UTF-8 BOM so Excel renders accented French names correctly", () => {
    expect(toCsv(["a"], [["Émilie"]]).startsWith("﻿")).toBe(true);
  });

  it("quotes a field containing a comma", () => {
    expect(strip(toCsv(["name"], [["Smith, Jr."]]))).toBe('name\r\n"Smith, Jr."\r\n');
  });

  it("doubles embedded quotes", () => {
    expect(strip(toCsv(["note"], [['He said "yes"']]))).toBe('note\r\n"He said ""yes"""\r\n');
  });

  it("quotes fields containing newlines", () => {
    expect(strip(toCsv(["note"], [["line one\nline two"]]))).toBe('note\r\n"line one\nline two"\r\n');
  });

  it("writes empty for null and undefined rather than the string 'undefined'", () => {
    expect(strip(toCsv(["a", "b"], [[null, undefined]]))).toBe("a,b\r\n,\r\n");
  });

  it("leaves ordinary values unquoted", () => {
    expect(strip(toCsv(["stage", "count"], [["Contacted", 4]]))).toBe("stage,count\r\nContacted,4\r\n");
  });

  it("uses CRLF line endings", () => {
    expect(strip(toCsv(["a"], [["1"], ["2"]]))).toBe("a\r\n1\r\n2\r\n");
  });
});

describe("datedFilename", () => {
  it("stamps the date and the .csv extension", () => {
    expect(datedFilename("realtordesk-report", new Date("2026-08-28T14:00:00Z")))
      .toBe("realtordesk-report-2026-08-28.csv");
  });
});
