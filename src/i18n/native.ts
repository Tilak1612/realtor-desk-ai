import i18n from "./config";

// Strings that only the iOS / Android app shows: the connection banner, the
// "couldn't load" screen and the back bar on the legal pages.
//
// They live here rather than in config.ts for the same reason rdDashboard.ts
// does (reviewable on their own, French checkable by a native speaker), and
// they are merged in at runtime instead of being imported by config.ts so the
// website's resource bundle is exactly what it was before the app existed.
// registerNativeStrings() is called once from src/lib/native/bootstrap.ts,
// and only inside the app.
//
// Every component that reads these also passes the English text as the t()
// default, so a string still renders if registration is ever skipped.
//
// FR follows the app's existing vocabulary: "Réessayer" for retry, "connexion"
// for the network connection.

export const nativeEn = {
  offline: {
    banner: "You’re offline. Showing what was already loaded.",
  },
  loadError: {
    offlineTitle: "You’re offline",
    offlineBody: "Realtor Desk needs a connection to load this screen. Check your Wi-Fi or mobile data, then try again.",
    title: "This screen didn’t load",
    body: "Something went wrong while loading. Try again, and if it keeps happening, close the app and reopen it.",
    retry: "Try again",
    home: "Go to dashboard",
  },
  back: "Back",
};

export const nativeFr: typeof nativeEn = {
  offline: {
    banner: "Vous êtes hors ligne. Affichage des données déjà chargées.",
  },
  loadError: {
    offlineTitle: "Vous êtes hors ligne",
    offlineBody: "Realtor Desk a besoin d’une connexion pour charger cet écran. Vérifiez votre Wi-Fi ou vos données mobiles, puis réessayez.",
    title: "Cet écran ne s’est pas chargé",
    body: "Une erreur est survenue pendant le chargement. Réessayez; si le problème persiste, fermez l’application et rouvrez-la.",
    retry: "Réessayer",
    home: "Aller au tableau de bord",
  },
  back: "Retour",
};

let registered = false;

/**
 * Merge the app-only strings under the `nativeShell` key (the sign-in strings
 * are a separate module and key, `nativeAuth`). Safe to call more than once.
 */
export function registerNativeStrings(): void {
  if (registered) return;
  registered = true;
  // deep = true, overwrite = true: add to the existing `translation` namespace
  // without replacing anything config.ts put there.
  i18n.addResourceBundle("en", "translation", { nativeShell: nativeEn }, true, true);
  i18n.addResourceBundle("fr", "translation", { nativeShell: nativeFr }, true, true);
}
