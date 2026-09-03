/**
 * Shared mappings for the Wix product import.
 *
 * The Wix export uses slightly different category slugs than the ones already
 * in Sanity from the original migration. Where the display names are identical
 * we alias to the EXISTING slug rather than creating a duplicate category —
 * otherwise Studio would show two categories both reading "Keys & Key Frames"
 * and products would be split across them.
 *
 * Used by both preflight-wix-import.ts and the batch importer.
 */

export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  // Wix slug            -> existing Sanity slug (same display name)
  "keys-and-key-frames": "keys-keyframes",
  "knobs-and-buttons": "knobs-buttons",
};

/** Resolve a Wix category slug to the canonical Sanity slug. */
export function resolveCategorySlug(wixSlug: string): string {
  return CATEGORY_SLUG_ALIASES[wixSlug] ?? wixSlug;
}
