import i18n from "./config";

// Strings for the data card on Settings (export my data / delete my account),
// merged into the `settingsData` key. Kept out of config.ts for the same reason
// as ./aiAssistant.ts: several people edit config.ts at once. Importing the
// module registers it; Settings.tsx imports it.
//
// Why these replace three strings the card used to show:
//
//   title        Was "Security (PIPEDA)": `app.settings.security` followed by
//                the name of a statute. The card is not about security, and a
//                statute's name in a heading reads as a claim of compliance.
//   description  Was `canadian.compliant`, "PIPEDA & CASL Compliant". Nobody
//                certifies that, and the rule for this product's copy is that
//                it never claims compliance. The new line states two things
//                that are true and checkable: the production database is
//                hosted in Canada (the wording the PIPEDA page publishes), and
//                this card is where the data can be exported or deleted.
//   exportDesc   Was `app.settings.dataRights.exportDesc`, which ended in
//                "(PIPEDA access right)". Same sentence without the legal
//                label.
//
// `canadian.compliant` and `app.settings.dataRights.exportDesc` are still in
// config.ts (EN and FR) and are no longer rendered by anything.

export const settingsDataEn = {
  title: "Your data",
  description: "The database is hosted in Canada. You can export or delete your data here.",
  exportDesc: "Download everything we store about you as a JSON file.",
};

export const settingsDataFr: typeof settingsDataEn = {
  title: "Vos données",
  description: "La base de données est hébergée au Canada. Vous pouvez exporter ou supprimer vos données ici.",
  exportDesc: "Téléchargez au format JSON toutes les informations que nous conservons à votre sujet.",
};

i18n.addResourceBundle("en", "translation", { settingsData: settingsDataEn }, true, true);
i18n.addResourceBundle("fr", "translation", { settingsData: settingsDataFr }, true, true);
