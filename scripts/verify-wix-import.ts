/**
 * Check imported products against the Wix export they came from.
 *
 *   npx tsx scripts/verify-wix-import.ts --batch=1
 *   npx tsx scripts/verify-wix-import.ts --all
 *
 * Reads only. Run after import-wix-products.ts to confirm a batch landed
 * intact: commercial fields match, every reference resolves, image assets are
 * really there, and — the part worth checking hardest — no description text was
 * lost converting Wix's HTML to Portable Text.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { UNCATEGORISED, resolveCategorySlug } from "./wix-import-mappings";

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

const argv = process.argv.slice(2);

// ── Types ────────────────────────────────────────────────────────────────────

interface WixProduct {
  sku: string;
  name: string;
  descriptionHtml: string;
  brand: string;
  categories: string[];
  compatibleModels: string[];
  priceGbp: number;
  stock: number;
  weightGrams: number;
  imageUrl: string | null;
  visible: boolean;
  shippingClass: string;
}

interface Doc {
  _id: string;
  sku: string;
  title: string;
  slug: string | null;
  price: number;
  stock: number;
  weightGrams: number;
  shippingClass: string;
  featured: boolean;
  brand: string | null;
  cats: (string | null)[] | null;
  models: (string | null)[] | null;
  compatibleModelsText: string[] | null;
  description: { children?: { text: string; marks?: string[] }[]; markDefs?: { _key: string }[] }[] | null;
  images: number;
  imagesResolved: number;
}

// ── Helpers (deliberately re-derived, not shared with the importer) ──────────

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, name: string) => {
    const named = NAMED_ENTITIES[name.toLowerCase()];
    if (named !== undefined) return named;
    if (name.toLowerCase().startsWith("#x")) {
      return String.fromCodePoint(parseInt(name.slice(2), 16));
    }
    if (name.startsWith("#")) return String.fromCodePoint(Number(name.slice(1)));
    return whole;
  });
}

const normalise = (s: string) => decodeEntities(s).replace(/\s+/g, " ").trim();

/** Visible text of the source HTML, tags removed. */
const textFromHtml = (html: string) => normalise(html.replace(/<[^>]+>/g, " "));

/** Visible text of the stored Portable Text. */
const textFromBlocks = (blocks: Doc["description"]) =>
  normalise((blocks ?? []).map((b) => (b.children ?? []).map((c) => c.text).join("")).join(" "));

function imageCountFor(p: WixProduct): number {
  if (!p.imageUrl) return 0;
  return p.imageUrl.split(";").filter((s) => s.trim()).length;
}

async function main() {
  const data: {
    meta: { totalBatches: number };
    batches: { batchNumber: number; products: WixProduct[] }[];
  } = JSON.parse(readFileSync(resolve(process.cwd(), "wix-products-cleaned.json"), "utf8"));

  const batchArg = argv.find((a) => a.startsWith("--batch="))?.slice(8);
  const wanted = argv.includes("--all")
    ? data.batches.map((b) => b.batchNumber)
    : (batchArg ?? "")
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n));

  if (wanted.length === 0) {
    console.error("Pass --batch=N (or a comma-separated list), or --all.");
    process.exit(1);
  }

  const source = data.batches
    .filter((b) => wanted.includes(b.batchNumber))
    .flatMap((b) => b.products);
  const bySku = new Map(source.map((p) => [p.sku, p]));

  const docs = await client.fetch<Doc[]>(
    `*[_type=="product" && !(_id in path("drafts.**")) && sku in $skus]{
       _id, sku, title, "slug": slug.current, price, stock, weightGrams, shippingClass, featured,
       "brand": brand->slug.current,
       "cats": categories[]->slug.current,
       "models": compatibleModels[]->slug.current,
       compatibleModelsText,
       description,
       "images": coalesce(count(images), 0),
       "imagesResolved": coalesce(count(images[defined(asset->url)]), 0)
     }`,
    { skus: source.map((p) => p.sku) },
  );

  console.log(`\nVERIFYING batch ${wanted.join(", ")} — ${source.length} products in the export`);
  console.log(`${docs.length} found in Sanity\n`);

  const problems: string[] = [];
  const notes: string[] = [];
  let linkAnnotations = 0;
  let markedSpans = 0;
  let imagesChecked = 0;
  let uncategorised = 0;
  let featured = 0;

  for (const doc of docs) {
    const src = bySku.get(doc.sku)!;
    const fail = (msg: string) => problems.push(`${doc.sku}: ${msg}`);

    if (doc.title !== src.name) fail(`title "${doc.title}" != "${src.name}"`);
    if (doc.price !== src.priceGbp) fail(`price ${doc.price} != ${src.priceGbp}`);
    if (doc.stock !== src.stock) fail(`stock ${doc.stock} != ${src.stock}`);
    if (doc.weightGrams !== src.weightGrams) fail(`weight ${doc.weightGrams} != ${src.weightGrams}`);
    if (doc.shippingClass !== src.shippingClass) fail(`shippingClass ${doc.shippingClass}`);
    if (!doc.slug) fail(`no slug`);
    // `featured` is editorial, not imported — the importer sets it false and
    // Nigel picks the homepage selection in Studio. Counted, never asserted.
    if (doc.featured) featured++;

    // References: a null in a resolved array means the reference is dangling.
    if (doc.brand !== slugify(src.brand)) fail(`brand ${doc.brand} != ${slugify(src.brand)}`);
    const cats = doc.cats ?? [];
    // Products the export left unfiled are filed under Uncategorised instead.
    const resolved = src.categories.map(resolveCategorySlug);
    const wantCats = resolved.length > 0 ? resolved : [UNCATEGORISED.slug];
    if (cats.some((c) => c === null)) fail(`a category reference does not resolve`);
    if (cats.length !== wantCats.length) {
      fail(`${cats.length} categories, expected ${wantCats.length}`);
    }
    for (const want of wantCats) {
      if (!cats.includes(want)) fail(`category ${want} missing`);
    }
    if (resolved.length === 0) uncategorised++;

    const models = doc.models ?? [];
    if (models.some((m) => m === null)) fail(`a Kawai model reference does not resolve`);
    const modelText = doc.compatibleModelsText ?? [];
    if (models.length + modelText.length !== src.compatibleModels.length) {
      fail(
        `${models.length} model refs + ${modelText.length} text != ` +
          `${src.compatibleModels.length} in the export`,
      );
    }
    for (const code of src.compatibleModels) {
      if (!models.includes(slugify(code)) && !modelText.includes(code)) {
        fail(`compatible model ${code} missing`);
      }
    }

    // Images.
    const wantImages = imageCountFor(src);
    imagesChecked += doc.images;
    if (doc.images !== doc.imagesResolved) fail(`${doc.images - doc.imagesResolved} image asset(s) do not resolve`);
    if (doc.images !== wantImages) {
      notes.push(`${doc.sku}: ${doc.images} image(s), export has ${wantImages}`);
    }

    // Description text must survive the HTML -> Portable Text conversion.
    const want = textFromHtml(src.descriptionHtml);
    const got = textFromBlocks(doc.description);
    if (want !== got) {
      fail(`description text drift\n      export: ${want}\n      sanity: ${got}`);
    }

    // Every mark on a span must be a decorator or resolve to a markDef.
    for (const block of doc.description ?? []) {
      linkAnnotations += (block.markDefs ?? []).length;
      for (const child of block.children ?? []) {
        const marks = child.marks ?? [];
        if (marks.length > 0) markedSpans++;
        for (const mark of marks) {
          if (mark === "strong" || mark === "em") continue;
          if (!(block.markDefs ?? []).some((d) => d._key === mark)) {
            fail(`dangling mark "${mark}"`);
          }
        }
      }
    }
  }

  const missing = source.filter((p) => !docs.some((d) => d.sku === p.sku));
  const notImported = missing.filter((p) => !p.visible);
  const unexplained = missing.filter((p) => p.visible);

  console.log(`CHECKED`);
  console.log(`  products          ${docs.length}`);
  console.log(`  images            ${imagesChecked} (all assets resolve)`);
  console.log(`  link annotations  ${linkAnnotations}`);
  console.log(`  styled spans      ${markedSpans}`);
  if (featured > 0) console.log(`  featured          ${featured} (editorial, set in Studio)`);
  if (uncategorised > 0) {
    console.log(`  uncategorised     ${uncategorised} (unfiled in the export, filed under Uncategorised)`);
  }
  if (notImported.length > 0) {
    console.log(`  hidden in Wix     ${notImported.length} (not imported, as expected)`);
  }

  if (notes.length > 0) {
    console.log(`\nNOTES (${notes.length})`);
    for (const n of notes) console.log(`  ${n}`);
  }

  if (unexplained.length > 0) {
    console.log(`\nMISSING from Sanity (${unexplained.length})`);
    for (const p of unexplained) console.log(`  ${p.sku}  ${p.name}`);
  }

  if (problems.length === 0 && unexplained.length === 0) {
    console.log(`\nPASS — ${docs.length} products match the export.\n`);
    return;
  }

  console.log(`\nFAIL — ${problems.length} problem(s)`);
  for (const p of problems.slice(0, 40)) console.log(`  ${p}`);
  if (problems.length > 40) console.log(`  … and ${problems.length - 40} more`);
  console.log("");
  process.exitCode = 1;
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
