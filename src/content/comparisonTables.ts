// Comparison tables as data, so the page and the prerendered HTML read the
// same rows. Every string is an i18n key under `prefix`; a cell of `true`
// means "included" and renders the `included` key (the page adds a tick).
//
// scripts/prerender-pages.js recognises this shape (prefix, columns,
// sections) on any @/content import and emits it as a real <table>, so a
// crawler that does not run JavaScript gets each row with its own values.
// Before this, the rows were built inside the component and never reached
// the static HTML at all.

export type ComparisonCell = string | true;

export interface ComparisonTable {
  prefix: string;
  columns: [string, string, string];
  included?: string;
  note?: string;
  sections: { heading?: string; rows: [string, ComparisonCell, ComparisonCell][] }[];
}

// /compare/boldtrail. BoldTrail cells come from boldtrail.com/faq, read
// 4 November 2026; "vNotStated" is used wherever that page is silent.
export const BOLDTRAIL_COMPARE_TABLE: ComparisonTable = {
  prefix: "compareBoldtrail",
  columns: ["colFeature", "colThem", "colUs"],
  note: "sourceNote",
  sections: [
    {
      heading: "secScope",
      rows: [
        ["fProduct", "vProductThem", "vProductUs"],
        ["fIdx", "vIncluded", "vNotOffered"],
        ["fBackOffice", "vBackOfficeThem", "vNotOffered"],
        ["fTeams", "vTeamsThem", "vPlanned"],
      ],
    },
    {
      heading: "secCanadianFit",
      rows: [
        ["fDataRegion", "vNotStated", "vDataUs"],
        ["fFrench", "vNotStated", "vFrenchUs"],
        ["fCasl", "vNotStated", "vCaslUs"],
        ["fDdf", "vNotStated", "vDdfUs"],
      ],
    },
    {
      heading: "secFollowUp",
      rows: [
        ["fScoring", "vScoringThem", "vScoringUs"],
        ["fCampaigns", "vIncluded", "vCampaignsUs"],
        ["fCalling", "vCallingThem", "vNotOffered"],
      ],
    },
    {
      heading: "secCost",
      rows: [
        ["fStartingPrice", "vPriceQuoteThem", "vPriceListUs"],
        ["fTrial", "vNotStated", "vTrialUs"],
        ["fSetupFee", "vSetupThem", "vSetupUs"],
      ],
    },
  ],
};

// The homepage strip: the short version of the table above.
export const HOME_COMPARE_STRIP: ComparisonTable = {
  prefix: "landing.compareStrip",
  columns: ["hCapability", "hThem", "hUs"],
  included: "valIncluded",
  note: "sourceNote",
  sections: [
    {
      rows: [
        ["rowWhat", "valWhatThem", "valWhatUs"],
        ["rowPrice", "valPriceThem", "valPriceUs"],
        ["rowData", "valNotStated", "valDataUs"],
        ["rowBilingual", "valNotStated", true],
        ["rowCasl", "valNotStated", true],
        ["rowDdf", "valNotStated", "valRoadmap"],
      ],
    },
  ],
};
