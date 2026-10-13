// Strings that exist only inside the iOS / Android app: the sign-in screen's
// one line of orientation, where an emailed link opens, and the screen shown to
// an account with no active subscription.
//
// Kept out of config.ts and registered here (addResourceBundle, deep merge) so
// the app's copy can be reviewed on its own, and so this module is the only
// thing a native screen has to import to be sure its strings are loaded.
//
// THE RULE FOR EVERY STRING IN THIS FILE. The app is a sign-in companion to a
// subscription bought on the website (App Store guideline 3.1.3(f), Google
// Play payments policy). Nothing here may name a price or a plan, say
// "subscribe", "upgrade" or "buy", or tell the reader to go somewhere to pay.
// Saying where an emailed link opens is fine; steering to a purchase is not.
//
// FR is Canadian French and follows config.ts: "courriel", no space before
// "?", sentence case.

import i18n from "./config";

export const nativeAuthEn = {
  login: {
    accountLine: "Sign in with your Realtor Desk account.",
    apple: "Continue with Apple",
  },
  forgot: {
    whereLinkOpens:
      "The link opens realtordesk.ai in your browser. Set your new password there, then come back to this app and sign in with it.",
  },
  verify: {
    whereLinkOpens:
      "The link opens realtordesk.ai in your browser. Once your email is confirmed, come back to this app and sign in.",
  },
  reset: {
    linkInvalid:
      "This reset link has expired or was already used. Request a new one from the sign-in screen.",
  },
  noAccess: {
    title: "No active subscription on this account",
    body: "This account does not have an active Realtor Desk subscription, so the app cannot open your workspace.",
    signedInAs: "Signed in as {{email}}",
    recheckHint: "If that has just changed, check again.",
    dataNote: "Your data is still yours. You can export or delete it from your account settings.",
    checkAgain: "Check again",
    checking: "Checking…",
    settings: "Account settings",
    signOut: "Sign out",
  },
};

export const nativeAuthFr: typeof nativeAuthEn = {
  login: {
    accountLine: "Connectez-vous avec votre compte Realtor Desk.",
    apple: "Continuer avec Apple",
  },
  forgot: {
    whereLinkOpens:
      "Le lien s'ouvre sur realtordesk.ai dans votre navigateur. Choisissez-y votre nouveau mot de passe, puis revenez dans l'application et connectez-vous avec celui-ci.",
  },
  verify: {
    whereLinkOpens:
      "Le lien s'ouvre sur realtordesk.ai dans votre navigateur. Une fois votre courriel confirmé, revenez dans l'application et connectez-vous.",
  },
  reset: {
    linkInvalid:
      "Ce lien de réinitialisation a expiré ou a déjà été utilisé. Demandez-en un nouveau à partir de l'écran de connexion.",
  },
  noAccess: {
    title: "Aucun abonnement actif pour ce compte",
    body: "Ce compte n'a pas d'abonnement Realtor Desk actif; l'application ne peut donc pas ouvrir votre espace de travail.",
    signedInAs: "Connecté en tant que {{email}}",
    recheckHint: "Si la situation vient de changer, vérifiez de nouveau.",
    dataNote: "Vos données vous appartiennent toujours. Vous pouvez les exporter ou les supprimer dans les paramètres de votre compte.",
    checkAgain: "Vérifier de nouveau",
    checking: "Vérification…",
    settings: "Paramètres du compte",
    signOut: "Se déconnecter",
  },
};

// deep = true, overwrite = true: merges under `nativeAuth` without touching any
// other key, and is safe to run twice (hot reload, or two screens importing it).
i18n.addResourceBundle("en", "translation", { nativeAuth: nativeAuthEn }, true, true);
i18n.addResourceBundle("fr", "translation", { nativeAuth: nativeAuthFr }, true, true);
