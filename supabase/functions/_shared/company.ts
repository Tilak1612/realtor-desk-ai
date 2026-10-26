// Mirror of src/config/company.ts for edge functions (they cannot import from src/).
// Keep the two files in sync.
export const COMPANY = {
  legalName: "Brainfy AI Inc.",
  street: "20542 69A Ave",
  city: "Langley",
  regionCode: "BC",
  postalCode: "V2Y 0W4",
  country: "Canada",
} as const;

export const COMPANY_CITY_COUNTRY = `${COMPANY.city}, ${COMPANY.regionCode}, ${COMPANY.country}`;
export const COMPANY_ADDRESS_LINE = `${COMPANY.street}, ${COMPANY.city}, ${COMPANY.regionCode} ${COMPANY.postalCode}, ${COMPANY.country}`;
