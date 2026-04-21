import { describe, it, expect } from "vitest";
import i18n from "@/i18n/config";

// Guard against the two i18n failure modes that bit us during the redesign:
//   1. A key is added to en but not fr (or vice-versa), so FR users see
//      the EN fallback silently — the "ghost English" bug.
//   2. A key resolves to an object in one locale and a string in another,
//      which makes i18next render the raw error
//      "key '…' returned an object instead of string." on the wrong side.
//
// This test walks both trees together and fails on any divergence.

type JsonNode = string | number | boolean | { [key: string]: JsonNode } | JsonNode[];

function resources() {
  const store = i18n.services.resourceStore.data as Record<
    string,
    { translation: Record<string, JsonNode> }
  >;
  const en = store.en?.translation;
  const fr = store.fr?.translation;
  if (!en || !fr) {
    throw new Error("Expected both en and fr translation resources to be loaded.");
  }
  return { en, fr };
}

function typeOf(node: JsonNode): "object" | "array" | "string" | "number" | "boolean" | "null" {
  if (node === null) return "null";
  if (Array.isArray(node)) return "array";
  if (typeof node === "object") return "object";
  if (typeof node === "string") return "string";
  if (typeof node === "number") return "number";
  return "boolean";
}

function walk(
  enNode: JsonNode,
  frNode: JsonNode | undefined,
  pathParts: string[],
  missing: string[],
  shape: string[]
): void {
  if (frNode === undefined) {
    missing.push(pathParts.join("."));
    return;
  }
  const enType = typeOf(enNode);
  const frType = typeOf(frNode);
  if (enType !== frType) {
    shape.push(`${pathParts.join(".")}: en=${enType} vs fr=${frType}`);
    return;
  }
  if (enType === "object") {
    const enObj = enNode as Record<string, JsonNode>;
    const frObj = frNode as Record<string, JsonNode>;
    for (const key of Object.keys(enObj)) {
      walk(enObj[key], frObj[key], [...pathParts, key], missing, shape);
    }
  }
}

describe("i18n parity between en and fr", () => {
  it("every en key path has a matching fr key path", () => {
    const { en, fr } = resources();
    const missing: string[] = [];
    const shape: string[] = [];
    walk(en, fr, [], missing, shape);

    // Shape mismatches are a harder bug class (runtime error in one locale),
    // so surface them first and fail loudly.
    expect(
      shape,
      `i18n key-shape drift between en and fr:\n  - ${shape.join("\n  - ")}`
    ).toEqual([]);

    // Then missing keys — these cause "ghost English" but at least don't crash.
    expect(
      missing,
      `i18n keys present in en but missing in fr:\n  - ${missing.join("\n  - ")}`
    ).toEqual([]);
  });
});
