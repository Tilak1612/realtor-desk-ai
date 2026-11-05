import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * The data export as a file.
 *
 * In a browser it is a Blob behind an <a download>. Inside the iOS / Android
 * app that click produces nothing, so there the file is written to the cache
 * directory and handed to the share sheet. Neither path can be watched in a
 * unit test, so what is pinned is which path runs and what it is given.
 */

let native = false;
vi.mock("@/lib/native/platform", () => ({ isNativeApp: () => native }));

const writeFile = vi.fn();
const rmdir = vi.fn();
const share = vi.fn();
vi.mock("@capacitor/filesystem", () => ({
  Filesystem: {
    writeFile: (...a: unknown[]) => writeFile(...a),
    rmdir: (...a: unknown[]) => rmdir(...a),
  },
  Directory: { Cache: "CACHE", Documents: "DOCUMENTS" },
  Encoding: { UTF8: "utf8" },
}));
vi.mock("@capacitor/share", () => ({ Share: { share: (...a: unknown[]) => share(...a) } }));

import { clearNativeExports, saveExportFile } from "../exportFile";

beforeEach(() => {
  native = false;
  writeFile.mockReset().mockResolvedValue({ uri: "file:///cache/realtordesk-export/export.json" });
  rmdir.mockReset().mockResolvedValue(undefined);
  share.mockReset().mockResolvedValue({ activityType: "" });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("saveExportFile on the web", () => {
  it("downloads through an anchor exactly as before, and touches no native plugin", async () => {
    const createObjectURL = vi.fn(() => "blob:mock");
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const created: HTMLAnchorElement[] = [];
    const realCreate = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = realCreate(tag);
      if (tag === "a") created.push(el as HTMLAnchorElement);
      return el;
    });

    await saveExportFile("realtordesk-data-export-2026-10-13.json", "{}");

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    expect(created[0].download).toBe("realtordesk-data-export-2026-10-13.json");
    expect(created[0].href).toBe("blob:mock");
    expect(writeFile).not.toHaveBeenCalled();
    expect(share).not.toHaveBeenCalled();
  });
});

describe("saveExportFile in the app", () => {
  beforeEach(() => {
    native = true;
  });

  it("writes to the cache directory and opens the share sheet with that file", async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    await saveExportFile("export.json", '{"contacts":[]}');

    expect(writeFile).toHaveBeenCalledWith({
      path: "realtordesk-export/export.json",
      data: '{"contacts":[]}',
      directory: "CACHE",
      encoding: "utf8",
      recursive: true,
    });
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ files: ["file:///cache/realtordesk-export/export.json"] }),
    );
    // The dead path is not also taken.
    expect(click).not.toHaveBeenCalled();
  });

  it("removes the previous export before writing a new one", async () => {
    await saveExportFile("export.json", "{}");
    expect(rmdir).toHaveBeenCalledWith({ path: "realtordesk-export", directory: "CACHE", recursive: true });
    expect(rmdir.mock.invocationCallOrder[0]).toBeLessThan(writeFile.mock.invocationCallOrder[0]);
  });

  it("treats a dismissed share sheet as a choice, not an error", async () => {
    share.mockRejectedValue(new Error("Share canceled"));
    await expect(saveExportFile("export.json", "{}")).resolves.toBeUndefined();
  });

  it("surfaces a real failure so the page can say the export did not work", async () => {
    writeFile.mockRejectedValue(new Error("No space left on device"));
    await expect(saveExportFile("export.json", "{}")).rejects.toThrow("No space left");
    expect(share).not.toHaveBeenCalled();

    writeFile.mockResolvedValue({ uri: "file:///x" });
    share.mockRejectedValue(new Error("Share API not available"));
    await expect(saveExportFile("export.json", "{}")).rejects.toThrow("not available");
  });
});

describe("clearNativeExports", () => {
  it("does nothing on the web", async () => {
    await clearNativeExports();
    expect(rmdir).not.toHaveBeenCalled();
  });

  it("is best effort in the app: a missing folder is not an error", async () => {
    native = true;
    rmdir.mockRejectedValue(new Error("Folder does not exist"));
    await expect(clearNativeExports()).resolves.toBeUndefined();
  });
});
