import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// /resources/open-house-sign-in-sheet-template promises two downloads. A page
// that offers a template and serves a 404 is the kind of claim this site does
// not make, so the files are checked here, along with the two things the page
// says about them: the CSV's columns, and that the importer reads six of them.

const ROOT = path.resolve(__dirname, "../../..");
const pdf = path.join(ROOT, "public/downloads/open-house-sign-in-sheet.pdf");
const csv = path.join(ROOT, "public/downloads/open-house-sign-in-sheet.csv");
const page = fs.readFileSync(
  path.join(ROOT, "src/pages/resources/OpenHouseSignInSheetTemplate.tsx"),
  "utf8",
);

describe("open house sign-in sheet downloads", () => {
  it("ships the PDF the page links to", () => {
    expect(page).toContain('"/downloads/open-house-sign-in-sheet.pdf"');
    expect(fs.readFileSync(pdf).subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("ships the CSV with the columns the page describes", () => {
    expect(page).toContain('"/downloads/open-house-sign-in-sheet.csv"');
    const header = fs.readFileSync(csv, "utf8").split(/\r?\n/)[0].split(",");
    expect(header).toEqual([
      "First Name", "Last Name", "Email", "Phone", "Working With Agent",
      "Consent To Email", "Consent Date", "Source", "Tags", "Notes",
    ]);
  });

  it("uses headers the contact importer recognises for the columns it imports", () => {
    const importer = fs.readFileSync(path.join(ROOT, "src/lib/csvImport.ts"), "utf8");
    for (const key of ["first_name", "last_name", "email", "phone", "source", "tags", "notes"]) {
      expect(importer).toContain('"' + key + '"');
    }
  });
});
