/**
 * RFC 4180 CSV building and download.
 *
 * Written deliberately rather than reusing the legacy exporter in
 * Contacts.tsx, which interpolates values straight into a comma-joined string
 * with no escaping — a contact named `Smith, Jr.` or a note containing a quote
 * silently shifts every following column, and the file will not parse.
 *
 * Rules applied here:
 *   - a field containing a comma, double-quote, CR or LF is wrapped in quotes
 *   - embedded double-quotes are doubled
 *   - null/undefined become an empty field, never the string "undefined"
 *   - CRLF line endings, which Excel expects
 *   - a UTF-8 BOM, so Excel renders accented French names correctly rather
 *     than mojibake — this product is bilingual and that matters
 */

function escapeField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers, ...rows].map((r) => r.map(escapeField).join(","));
  return "﻿" + lines.join("\r\n") + "\r\n";
}

/** Trigger a browser download of `content` as `filename`. */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick: revoking synchronously can cancel the download
  // in some browsers before it has started reading the blob.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** `realtordesk-report-2026-08-28.csv` */
export function datedFilename(prefix: string, now = new Date()): string {
  const d = now.toISOString().slice(0, 10);
  return `${prefix}-${d}.csv`;
}
