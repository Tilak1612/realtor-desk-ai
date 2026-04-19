// CSV import helpers.
//
// Handles the messy realities of CSVs exported from other CRMs / mailers:
// - quoted fields with commas inside ("Smith, John")
// - escaped quotes ("""he said ""hi""""")
// - BOM byte at the start of the file (Excel likes to add one)
// - CRLF and mixed line endings
// - header variants ("First name" vs "first_name" vs "FIRSTNAME")
// - files that only give you full_name, no first/last split
// - files with company / domain fields we don't have DB columns for

export interface CsvRow {
  [normalizedHeader: string]: string;
}

export interface ContactImportPayload {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  tags: string[];
  metadata: Record<string, string>;
}

// Normalize a header to snake_case: "First Name" → "first_name",
// "E-mail Address" → "e_mail_address", "Company (HQ)" → "company_hq".
export const normalizeHeader = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[\s\-/]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

// Proper CSV parse — handles quoted fields, escaped quotes, BOM, CRLF.
export const parseCsv = (text: string): CsvRow[] => {
  if (!text) return [];
  // Strip UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (field !== "" || current.length > 0) {
          current.push(field);
          rows.push(current);
          current = [];
          field = "";
        }
        if (ch === "\r" && next === "\n") i++;
      } else {
        field += ch;
      }
    }
  }
  if (field !== "" || current.length > 0) {
    current.push(field);
    rows.push(current);
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map(normalizeHeader);
  return rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((row) => {
      const obj: CsvRow = {};
      headers.forEach((h, idx) => {
        obj[h] = (row[idx] ?? "").trim();
      });
      return obj;
    });
};

// Pick the first non-empty value from a row among a set of known header aliases.
const pick = (row: CsvRow, ...keys: string[]): string => {
  for (const k of keys) {
    const v = row[k];
    if (v && v.trim() !== "") return v.trim();
  }
  return "";
};

// Map a parsed CSV row to a contacts-table insert payload.
// Returns null for rows we can't salvage (no name AND no email).
export const mapRowToContact = (
  row: CsvRow,
  userId: string
): ContactImportPayload | null => {
  const email = pick(row, "email", "email_address", "e_mail", "emailaddress");
  const phone = pick(
    row,
    "phone",
    "mobile",
    "phone_number",
    "mobile_phone",
    "cell",
    "cell_phone",
    "telephone"
  );
  const fullName = pick(row, "full_name", "name", "contact_name", "display_name");

  let firstName = pick(row, "first_name", "firstname", "given_name");
  let lastName = pick(row, "last_name", "lastname", "family_name", "surname");

  // If only full_name is provided, split on the first whitespace.
  if (!firstName && !lastName && fullName) {
    const parts = fullName.split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  // Drop rows we can't identify at all.
  if (!firstName && !lastName && !email) return null;

  const companyName = pick(row, "company_name", "company", "organization", "organisation", "employer");
  const companyDomain = pick(row, "company_domain", "domain", "website", "company_website");
  const jobTitle = pick(row, "title", "job_title", "position", "role");
  const sourceValue = pick(row, "source", "lead_source");
  const tagsRaw = pick(row, "tags", "labels");
  const notes = pick(row, "notes", "comments", "description");

  // Stash fields we don't have first-class columns for so nothing is lost.
  const metadata: Record<string, string> = {};
  if (companyName) metadata.company_name = companyName;
  if (companyDomain) metadata.company_domain = companyDomain;
  if (jobTitle) metadata.job_title = jobTitle;
  if (notes) metadata.notes_imported = notes;
  // Preserve full_name when we had to split, so the original is still recoverable.
  if (fullName && (firstName || lastName)) metadata.full_name = fullName;

  return {
    user_id: userId,
    first_name: firstName || null,
    last_name: lastName || null,
    email: email || null,
    phone: phone || null,
    source: sourceValue || "csv_import",
    tags: tagsRaw ? tagsRaw.split(";").map((t) => t.trim()).filter(Boolean) : [],
    metadata,
  };
};
