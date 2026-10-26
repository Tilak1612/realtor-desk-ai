// Single source of truth for the company's legal identity and address.
// Edge functions cannot import from src/, so supabase/functions/_shared/company.ts
// mirrors these values; keep the two in sync.
export const COMPANY = {
  legalName: "Brainfy AI Inc.",
  street: "20542 69A Ave",
  city: "Langley",
  regionCode: "BC",
  postalCode: "V2Y 0W4",
  country: "Canada",
} as const;

/** "Langley, BC, Canada" for places that show a city, not a street address. */
export const COMPANY_CITY_COUNTRY = `${COMPANY.city}, ${COMPANY.regionCode}, ${COMPANY.country}`;

/** "20542 69A Ave, Langley, BC V2Y 0W4, Canada" on one line (legal pages, emails). */
export const COMPANY_ADDRESS_LINE = `${COMPANY.street}, ${COMPANY.city}, ${COMPANY.regionCode} ${COMPANY.postalCode}, ${COMPANY.country}`;
