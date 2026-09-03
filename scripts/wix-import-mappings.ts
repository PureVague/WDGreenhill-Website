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

/**
 * Fallback category for products the Wix export left unfiled.
 *
 * Roughly 80 products across the catalogue have no category. Without this they
 * would exist in Sanity but appear on no category page — present in search and
 * on brand pages, yet effectively unbrowsable. Filing them here keeps them
 * reachable, and gives Nigel a single list in Studio to work through.
 */
export const UNCATEGORISED = {
  slug: "uncategorised",
  name: "Uncategorised",
  description:
    "Parts not yet filed into a category. Browse by make, or search by part number.",
} as const;
