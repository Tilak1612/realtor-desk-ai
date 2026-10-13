import { isNativeApp } from "@/lib/native/platform";

// Handing the person their data export as a file.
//
// On the web this is the long-standing Blob + <a download> click. That does
// nothing inside the iOS and Android apps: a WKWebView / Android WebView has no
// download manager behind an anchor's download attribute, so the button
// appeared to work and produced no file. In the app the file is written to the
// app's cache directory and offered through the system share sheet instead
// ("Save to Files", Mail, Drive, ...).
//
// The cache directory specifically: it needs no storage permission on either
// platform, and it is the one location @capacitor/share can share from on
// Android without editing the native project's file_paths.xml.

// Its own folder so an old export can be removed without knowing its name.
const NATIVE_EXPORT_DIR = "realtordesk-export";

/**
 * Remove any export left in the app's cache. An export is a copy of the
 * person's contacts, so it should not outlive its purpose: called before each
 * new export and after the account is deleted. Best effort, native only.
 */
export async function clearNativeExports(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    await Filesystem.rmdir({ path: NATIVE_EXPORT_DIR, directory: Directory.Cache, recursive: true });
  } catch {
    /* the folder not existing is the usual case */
  }
}

// Dismissing the share sheet rejects the promise. That is the person changing
// their mind, not a failed export.
const isShareCancel = (e: unknown): boolean =>
  /cancel/i.test(e instanceof Error ? e.message : String(e));

/**
 * Give `contents` to the person as a file called `filename`.
 * Throws if the file could not be produced, so the caller can say so.
 */
export async function saveExportFile(filename: string, contents: string): Promise<void> {
  if (!isNativeApp()) {
    const blob = new Blob([contents], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    return;
  }

  // Loaded on demand so the web bundle never pulls the native plugins in.
  const { Filesystem, Directory, Encoding } = await import("@capacitor/filesystem");
  const { Share } = await import("@capacitor/share");

  await clearNativeExports();
  const { uri } = await Filesystem.writeFile({
    path: NATIVE_EXPORT_DIR + "/" + filename,
    data: contents,
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
    recursive: true,
  });

  try {
    await Share.share({ title: filename, files: [uri], dialogTitle: filename });
  } catch (e) {
    if (!isShareCancel(e)) throw e;
  }
}
