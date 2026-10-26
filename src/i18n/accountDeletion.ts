import i18n from "./config";

// Strings for the account-deletion flow in Settings, merged into the
// `accountDeletion` key. They live here, not in config.ts, so the flow's copy
// can be reviewed (and the French checked by a native speaker) on its own.
// Importing this module registers them; the component that uses them imports it.
//
// EVERY STATEMENT IS A DESCRIPTION OF supabase/functions/delete-account.
// If that function changes what it deletes or keeps, this copy changes with it:
//   deleted now          the function runs synchronously; there is no queue
//   subscription         cancelled immediately in Stripe, before any deletion
//   do-not-email list    email_suppressions rows survive with user_id and
//                        contact_id set to NULL (ON DELETE SET NULL)
//   billing records      the Stripe customer and invoices are not deleted
//   backups              the 30 days is the figure the Privacy Policy publishes
// It deliberately does NOT promise a confirmation email: the function sends
// none. The old copy in config.ts (app.settings.dataRights.deleteDesc and
// .confirmBody: "we'll confirm by email", "within 30 days") described a manual
// process that never existed and is no longer rendered.
//
// FR follows the app's existing vocabulary: courriel, abonnement, LCAP.

export const accountDeletionEn = {
  row: {
    desc: "Permanently delete your account and everything in it. It happens right away and cannot be undone.",
    button: "Delete my account",
    demo: "This is a shared demo account, so it cannot be deleted.",
  },
  dialog: {
    title: "Delete your account?",
    intro: "This permanently deletes your Realtor Desk account as soon as you confirm. It cannot be undone.",
    deletedTitle: "What is deleted",
    deleted: {
      profile: "Your profile, your sign-in and your settings",
      contacts: "Your contacts, with their notes, activity, conversations, documents and consent records",
      work: "Your deals, tasks, listings, automations and import history",
      files: "Your profile photo and the files you uploaded",
      connections: "The saved connections to other services, such as your calendar",
    },
    subscription:
      "If you have a subscription or a trial, it is cancelled immediately and you will not be billed again. Access ends now, including any time left in the current period.",
    keptTitle: "What is kept",
    kept: {
      suppression:
        "Email addresses that unsubscribed stay on a do-not-email list, with no link to your account, so they are not emailed again. This has no end date.",
      billing:
        "Invoices, payment history and the billing details you gave at checkout stay with our payment processor, Stripe, for as long as tax and accounting rules require.",
      backups: "Copies in our encrypted backups remain until those backups expire, which our Privacy Policy sets at 30 days.",
    },
    exportHint: "Want a copy first? The export contains your profile, contacts and deals.",
    exportButton: "Export my data",
    confirmWord: "DELETE",
    confirmLabel: "Type {{word}} to confirm",
    cancel: "Keep my account",
    submit: "Delete my account",
    retry: "Try again",
    deleting: "Deleting your account…",
    deletingHint: "This can take a moment. Keep this window open.",
  },
  success: {
    title: "Account deleted",
    body: "Your Realtor Desk account and its data have been deleted.",
  },
  error: {
    demo_account: "This is a shared demo account, so it cannot be deleted.",
    stripe_cancel_failed:
      "We could not cancel your subscription, so nothing was deleted. Try again in a few minutes.",
    unauthorized: "Your session has expired. Sign in again, then delete your account from Settings.",
    network: "We could not confirm the deletion. Check your connection and try again.",
    partial: "Part of your data was deleted, but your account is still open. Try again to finish.",
    unknown: "Something went wrong and your account was not deleted. Try again.",
    support: "If this keeps happening, contact",
  },
};

export const accountDeletionFr: typeof accountDeletionEn = {
  row: {
    desc: "Supprimez définitivement votre compte et tout ce qu’il contient. La suppression est immédiate et irréversible.",
    button: "Supprimer mon compte",
    demo: "Il s’agit d’un compte de démonstration partagé; il ne peut pas être supprimé.",
  },
  dialog: {
    title: "Supprimer votre compte ?",
    intro:
      "Votre compte Realtor Desk sera supprimé définitivement dès que vous confirmez. Cette action est irréversible.",
    deletedTitle: "Ce qui est supprimé",
    deleted: {
      profile: "Votre profil, votre accès et vos paramètres",
      contacts:
        "Vos contacts, avec leurs notes, leur activité, leurs conversations, leurs documents et leurs preuves de consentement",
      work: "Vos transactions, tâches, inscriptions, automatisations et historique d’importation",
      files: "Votre photo de profil et les fichiers que vous avez téléversés",
      connections: "Les connexions enregistrées à d’autres services, comme votre calendrier",
    },
    subscription:
      "Si vous avez un abonnement ou un essai, il est annulé immédiatement et vous ne serez plus facturé. L’accès prend fin maintenant, y compris le temps restant de la période en cours.",
    keptTitle: "Ce qui est conservé",
    kept: {
      suppression:
        "Les adresses courriel désabonnées restent sur une liste d’exclusion, sans lien avec votre compte, afin de ne plus recevoir de courriels. Cette conservation n’a pas de date de fin.",
      billing:
        "Les factures, l’historique des paiements et les renseignements de facturation fournis au paiement restent chez notre fournisseur de paiement, Stripe, aussi longtemps que l’exigent les règles fiscales et comptables.",
      backups:
        "Des copies demeurent dans nos sauvegardes chiffrées jusqu’à leur expiration, fixée à 30 jours dans notre politique de confidentialité.",
    },
    exportHint: "Vous voulez une copie d’abord ? L’exportation contient votre profil, vos contacts et vos transactions.",
    exportButton: "Exporter mes données",
    confirmWord: "SUPPRIMER",
    confirmLabel: "Tapez {{word}} pour confirmer",
    cancel: "Conserver mon compte",
    submit: "Supprimer mon compte",
    retry: "Réessayer",
    deleting: "Suppression de votre compte…",
    deletingHint: "Cela peut prendre un moment. Gardez cette fenêtre ouverte.",
  },
  success: {
    title: "Compte supprimé",
    body: "Votre compte Realtor Desk et ses données ont été supprimés.",
  },
  error: {
    demo_account: "Il s’agit d’un compte de démonstration partagé; il ne peut pas être supprimé.",
    stripe_cancel_failed:
      "Nous n’avons pas pu annuler votre abonnement; rien n’a donc été supprimé. Réessayez dans quelques minutes.",
    unauthorized:
      "Votre session a expiré. Reconnectez-vous, puis supprimez votre compte à partir des paramètres.",
    network: "Nous n’avons pas pu confirmer la suppression. Vérifiez votre connexion et réessayez.",
    partial:
      "Une partie de vos données a été supprimée, mais votre compte est toujours ouvert. Réessayez pour terminer.",
    unknown: "Une erreur s’est produite et votre compte n’a pas été supprimé. Réessayez.",
    support: "Si le problème persiste, écrivez à",
  },
};

// deep + overwrite, so this merges into the existing `translation` namespace
// without touching any other key. config.ts has already called init() by the
// time this runs (it is imported above), so the resource store exists.
i18n.addResourceBundle("en", "translation", { accountDeletion: accountDeletionEn }, true, true);
i18n.addResourceBundle("fr", "translation", { accountDeletion: accountDeletionFr }, true, true);
