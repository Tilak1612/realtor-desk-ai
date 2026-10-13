// English page -> its French translation, for hreflang.
//
// Most pages are bilingual at one URL (the French is the same path with
// ?lang=fr). A few have a standalone French page under /fr/ that is a real
// translation of an English page. Those two URLs are alternates of each other,
// and each has to name the other or the annotation is ignored.
//
// Only add a pair when the French page says the same thing as the English one.
// /fr/crm-immobilier and /fr/lcap-courriels-immobilier are written for Quebec
// and have no English twin, so they are not here and keep a single
// self-referencing fr-CA entry.
//
// scripts/prerender-pages.js reads this file as text (it cannot import
// TypeScript), so keep each pair on one line in the form "/en": "/fr/...".
export const HREFLANG_PAIRS: Record<string, string> = {
  "/features/import-contacts": "/fr/importer-contacts-csv",
  "/law-25-quebec-real-estate": "/fr/loi-25-courtier-immobilier",
};

export const frenchTwinOf = (path: string): string | undefined => HREFLANG_PAIRS[path];

export const englishTwinOf = (path: string): string | undefined =>
  Object.keys(HREFLANG_PAIRS).find((en) => HREFLANG_PAIRS[en] === path);
