/**
 * Backfill weightGrams on existing products.
 *
 * Run with:  npx tsx scripts/backfill-product-weights.ts
 *
 * Idempotent — only sets a weight on products that don't already have one, so
 * re-runs never overwrite weights Nigel has refined. Light default (10g) is
 * intentional: better to under-charge shipping on one item than accidentally
 * quote-block everything. Products whose SKU/title look heavy get 500g.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

// ── Load .env.local ──────────────────────────────────────────────────────────
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of envFile.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
} catch {
  /* rely on existing env */
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity env vars (project id / dataset / token).");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

const HEAVY_KEYWORDS = ["cabinet", "keyboard", "pcb assembly", "amplifier", "speaker"];
const LIGHT_DEFAULT = 10;
const HEAVY_DEFAULT = 500;

interface Row {
  _id: string;
  sku?: string;
  title?: string;
  weightGrams?: number | null;
}

async function main() {
  const products = await client.fetch<Row[]>(
    `*[_type == "product"]{ _id, sku, title, weightGrams }`,
  );
  console.log(`\nFetched ${products.length} products.\n`);

  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    if (typeof p.weightGrams === "number") {
      skipped++;
      continue;
    }
    const haystack = `${p.sku ?? ""} ${p.title ?? ""}`.toLowerCase();
    const heavy = HEAVY_KEYWORDS.some((k) => haystack.includes(k));
    const weight = heavy ? HEAVY_DEFAULT : LIGHT_DEFAULT;

    await client.patch(p._id).set({ weightGrams: weight }).commit();
    console.log(`Set ${weight}g  ${p.sku ?? p._id} — ${p.title ?? ""}${heavy ? "  (heavy)" : ""}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped} (already had a weight).\n`);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
