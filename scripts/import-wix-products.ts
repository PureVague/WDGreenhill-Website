/**
 * Batch importer for the Wix catalogue export.
 *
 *   npx tsx scripts/import-wix-products.ts --batch=1 --dry-run   (report only)
 *   npx tsx scripts/import-wix-products.ts --batch=1             (import batch 1)
 *   npx tsx scripts/import-wix-products.ts --batch=2,3           (several batches)
 *   npx tsx scripts/import-wix-products.ts --all                 (all 12 batches)
 *
 * Flags:
 *   --dry-run           plan and report, write nothing (no image uploads either)
 *   --skip-images       create products without downloading their Wix image
 *   --include-hidden    also import products the Wix store had hidden
 *   --update-existing   patch price/stock/weight on SKUs already in Sanity
 *   --repair            fix products this script already imported: re-upload
 *                       images that failed, and file unfiled ones under
 *                       Uncategorised
 *   --concurrency=N     parallel image downloads (default 4)
 *
 * Run scripts/preflight-wix-import.ts first — this script references brands,
 * categories and Kawai models by id, and reports rather than creates anything
 * missing.
 *
 * Idempotent. A product's identity is its SKU, not its title: the document id
 * is derived from the SKU so a re-export with a tidied-up product name patches
 * the same document instead of creating a second one. Products whose SKU is
 * already in Sanity are skipped unless --update-existing is passed, so the
 * hand-written seed products are never silently overwritten.
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

// ── Arguments ────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const SKIP_IMAGES = argv.includes("--skip-images") || DRY_RUN;
const INCLUDE_HIDDEN = argv.includes("--include-hidden");
const UPDATE_EXISTING = argv.includes("--update-existing");
const REPAIR = argv.includes("--repair");
const CONCURRENCY = Math.max(
  1,
  Number(argv.find((a) => a.startsWith("--concurrency="))?.slice(14) ?? 4),
);

/** The site path products live at — used when rewriting old Wix cross-links. */
const PRODUCT_PATH = "/shop/product";

/** Where a bare Wix media id has to be hung to become a URL. */
const WIX_MEDIA_BASE = "https://static.wixstatic.com/media/";

/** The product schema accepts at most 8 images. */
const MAX_IMAGES = 8;

// ── Types ────────────────────────────────────────────────────────────────────

interface WixProduct {
  wixId: string;
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

interface WixExport {
  meta: { totalProducts: number; totalBatches: number };
  batches: { batchNumber: number; productCount: number; products: WixProduct[] }[];
}

type SanityDoc = { _id: string; _type: string } & Record<string, unknown>;

/** Everything the document builder needs to resolve references and links. */
interface Context {
  brandSlugs: Set<string>;
  catSlugs: Set<string>;
  modelSlugs: Set<string>;
  /** Every SKU in the export (lowercased) -> the slug it will be imported as. */
  slugBySku: Map<string, string>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

let keyCounter = 0;
const k = () => `k${(keyCounter++).toString(36)}`;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const weakRef = (id: string) => ({ _type: "reference", _ref: id, _weak: true });

/**
 * Every image URL for a product.
 *
 * Nine rows in the export have Wix's multi-image field flattened into one
 * semicolon-separated string, where only the first entry is a full URL and the
 * rest are bare media ids. Fetching the raw string 403s, so split it and hang
 * the bare ids off the media base — those products have 2-4 photos each and
 * the schema has room for 8.
 */
function imageUrlsFor(p: WixProduct): string[] {
  if (!p.imageUrl) return [];
  return p.imageUrl
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (/^https?:\/\//i.test(part) ? part : WIX_MEDIA_BASE + part))
    .slice(0, MAX_IMAGES);
}

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

/**
 * Wix descriptions carry a handful of "part superseded — use this one instead"
 * links back into the old wdgreenhill.co.uk store. Point those at the new site
 * where the target part is in this export; leave the absolute URL alone (and
 * report it) where it isn't, so a dead link stays visible rather than invented.
 */
const rewrittenLinks: string[] = [];
const unresolvedLinks: string[] = [];

function rewriteProductHref(href: string, sku: string, ctx: Context): string {
  const match = /^https?:\/\/(?:www\.)?wdgreenhill\.(?:co\.uk|com)\/product-page\/(.+?)\/?$/i.exec(
    href,
  );
  if (!match) return href;

  const path = decodeURIComponent(match[1]).toLowerCase();
  let target = ctx.slugBySku.get(path);
  if (!target) {
    // Wix slugs append a description to the part number ("f-10h-pedal"), so
    // fall back to the longest SKU the path starts with.
    let best = "";
    for (const candidate of ctx.slugBySku.keys()) {
      if (path.startsWith(candidate) && candidate.length > best.length) best = candidate;
    }
    if (best) target = ctx.slugBySku.get(best);
  }

  if (!target) {
    unresolvedLinks.push(`${sku}: ${href}`);
    return href;
  }
  rewrittenLinks.push(`${sku}: /product-page/${path} -> ${PRODUCT_PATH}/${target}`);
  return `${PRODUCT_PATH}/${target}`;
}

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface LinkDef {
  _type: "link";
  _key: string;
  href: string;
}

/**
 * Convert a Wix description to Portable Text.
 *
 * The export only ever uses <p>, <br>, <strong>, <a>, <u> and <span> (Wix's
 * inline colour styling). <p> and <br> both become blocks — the descriptions
 * use <br> to list one cross-reference part number per line, which reads far
 * better as separate paragraphs than as one run-on. <u> and <span> have no
 * equivalent in the product schema, so their text is kept and the styling
 * dropped. Wix's empty <p>&nbsp;</p> spacer paragraphs are discarded.
 */
function htmlToBlocks(html: string, sku: string, ctx: Context) {
  const chunks = html
    .replace(/<\/p\s*>/gi, "\u0000")
    .replace(/<p[^>]*>/gi, "")
    .split("\u0000")
    .flatMap((para) => para.split(/<br\s*\/?>/i));

  const blocks = [];
  for (const chunk of chunks) {
    const markDefs: LinkDef[] = [];
    const spans = parseInline(chunk, markDefs, sku, ctx);
    if (spans.length === 0) continue;
    blocks.push({
      _type: "block",
      _key: k(),
      style: "normal",
      markDefs: markDefs.filter((def) => spans.some((s) => s.marks.includes(def._key))),
      children: spans,
    });
  }
  return blocks.length > 0 ? blocks : undefined;
}

function parseInline(html: string, markDefs: LinkDef[], sku: string, ctx: Context): Span[] {
  const spans: Span[] = [];
  const decorators: string[] = [];
  let linkKey: string | null = null;
  let buffer = "";

  const flush = () => {
    const text = decodeEntities(buffer).replace(/\s+/g, " ");
    buffer = "";
    if (!text) return;
    const marks = [...decorators];
    if (linkKey) marks.push(linkKey);
    spans.push({ _type: "span", _key: k(), text, marks });
  };

  const pop = (mark: string) => {
    const at = decorators.lastIndexOf(mark);
    if (at !== -1) decorators.splice(at, 1);
  };

  const tag = /<([a-zA-Z]+)([^>]*)>|<\/\s*([a-zA-Z]+)\s*>/g;
  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = tag.exec(html)) !== null) {
    buffer += html.slice(cursor, m.index);
    cursor = tag.lastIndex;
    const open = m[1]?.toLowerCase();
    const close = m[3]?.toLowerCase();

    if (open === "strong" || open === "b") {
      flush();
      decorators.push("strong");
    } else if (open === "em" || open === "i") {
      flush();
      decorators.push("em");
    } else if (open === "a") {
      const href = /href\s*=\s*"([^"]*)"/i.exec(m[2] ?? "")?.[1];
      if (href) {
        flush();
        linkKey = k();
        markDefs.push({ _type: "link", _key: linkKey, href: rewriteProductHref(href, sku, ctx) });
      }
    } else if (close === "strong" || close === "b") {
      flush();
      pop("strong");
    } else if (close === "em" || close === "i") {
      flush();
      pop("em");
    } else if (close === "a") {
      flush();
      linkKey = null;
    }
    // <u>, <span> and anything else: keep the text, drop the styling.
  }
  buffer += html.slice(cursor);
  flush();

  // Trim the paragraph's outer edges without disturbing spacing between spans.
  if (spans.length > 0) {
    spans[0].text = spans[0].text.replace(/^\s+/, "");
    spans[spans.length - 1].text = spans[spans.length - 1].text.replace(/\s+$/, "");
  }
  return spans.filter((s) => s.text !== "");
}

/** Run `fn` over `items` with at most `limit` in flight at once. */
async function mapPool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      for (let i = next++; i < items.length; i = next++) {
        await fn(items[i]);
      }
    }),
  );
}

/**
 * Download a Wix image and hand it to Sanity. Sanity stores assets by content
 * hash, so re-running the import reuses the asset rather than duplicating it.
 */
async function uploadImage(url: string, sku: string, index: number): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = Buffer.from(await res.arrayBuffer());
      if (body.length === 0) throw new Error("empty body");
      const ext = /\.(jpe?g|png|webp|gif)$/i.exec(new URL(url).pathname)?.[1]?.toLowerCase();
      const suffix = index === 0 ? "" : `-${index + 1}`;
      const asset = await client.assets.upload("image", body, {
        filename: `${slugify(sku)}${suffix}.${ext ?? "jpg"}`,
      });
      return asset._id;
    } catch (err) {
      lastError = err;
      if (attempt === 1) await new Promise((r) => setTimeout(r, 750));
    }
  }
  throw lastError;
}

// ── Import ───────────────────────────────────────────────────────────────────

/**
 * Categories for a product, falling back to Uncategorised.
 *
 * A product with no category exists in the catalogue but appears on no
 * category page. Filing the unfiled ones under Uncategorised keeps them
 * browsable and gives Nigel one list to work through in Studio.
 */
function categoriesFor(p: WixProduct, ctx: Context): string[] {
  const resolved = p.categories.map(resolveCategorySlug).filter((s) => ctx.catSlugs.has(s));
  if (resolved.length > 0) return resolved;
  return ctx.catSlugs.has(UNCATEGORISED.slug) ? [UNCATEGORISED.slug] : [];
}

function buildDoc(p: WixProduct, slug: string, assetIds: string[], ctx: Context) {
  const categories = categoriesFor(p, ctx);
  const modelRefs = p.compatibleModels.filter((c) => ctx.modelSlugs.has(slugify(c)));
  const modelText = p.compatibleModels.filter((c) => !ctx.modelSlugs.has(slugify(c)));
  const description = htmlToBlocks(p.descriptionHtml, p.sku, ctx);

  const doc: SanityDoc = {
    _id: `product-${slugify(p.sku)}`,
    _type: "product",
    sku: p.sku,
    title: p.name,
    slug: { _type: "slug", current: slug },
    brand: weakRef(`brand-${slugify(p.brand)}`),
    price: p.priceGbp,
    stock: p.stock,
    featured: false,
    weightGrams: p.weightGrams,
    shippingClass: p.shippingClass,
  };
  if (categories.length > 0) {
    doc.categories = categories.map((s) => ({ ...weakRef(`category-${s}`), _key: k() }));
  }
  if (modelRefs.length > 0) {
    doc.compatibleModels = modelRefs.map((c) => ({
      ...weakRef(`kawaiModel-${slugify(c)}`),
      _key: k(),
    }));
  }
  if (modelText.length > 0) doc.compatibleModelsText = modelText;
  if (description) doc.description = description;
  if (assetIds.length > 0) {
    doc.images = assetIds.map((id) => ({
      _type: "image",
      _key: k(),
      asset: { _type: "reference", _ref: id },
    }));
  }
  return doc;
}

function reportLinks() {
  if (rewrittenLinks.length > 0) {
    console.log(`\nCROSS-LINKS rewritten to this site (${rewrittenLinks.length})`);
    for (const l of rewrittenLinks) console.log(`  ${l}`);
  }
  if (unresolvedLinks.length > 0) {
    console.log(
      `\nCROSS-LINKS left pointing at the old Wix store (${unresolvedLinks.length}) — ` +
        `the target part isn't in the export:`,
    );
    for (const l of unresolvedLinks) console.log(`  ${l}`);
  }
}

async function main() {
  const data: WixExport = JSON.parse(
    readFileSync(resolve(process.cwd(), "wix-products-cleaned.json"), "utf8"),
  );

  // ── Which batches ──────────────────────────────────────────────────────────
  const batchArg = argv.find((a) => a.startsWith("--batch="))?.slice(8);
  const wanted = argv.includes("--all")
    ? data.batches.map((b) => b.batchNumber)
    : (batchArg ?? "")
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n));

  if (wanted.length === 0) {
    console.error("Nothing to do. Pass --batch=N (or a comma-separated list), or --all.");
    process.exit(1);
  }
  const unknown = wanted.filter((n) => !data.batches.some((b) => b.batchNumber === n));
  if (unknown.length > 0) {
    console.error(`No such batch: ${unknown.join(", ")} (export has 1-${data.meta.totalBatches}).`);
    process.exit(1);
  }

  console.log(
    `\n${DRY_RUN ? "DRY RUN — no writes" : "LIVE"} — batch ${wanted.join(", ")} of ` +
      `${data.meta.totalBatches} (${data.meta.totalProducts} products in the export)\n`,
  );

  // ── What already exists ────────────────────────────────────────────────────
  const [existingProducts, brands, cats, models] = await Promise.all([
    client.fetch<
      { _id: string; sku: string | null; slug: string | null; images: number; cats: number }[]
    >(
      `*[_type=="product" && !(_id in path("drafts.**"))]{
         _id, sku, "slug": slug.current,
         "images": coalesce(count(images), 0),
         "cats": coalesce(count(categories), 0)
       }`,
    ),
    client.fetch<string[]>(`*[_type=="brand"].slug.current`),
    client.fetch<string[]>(`*[_type=="category"].slug.current`),
    client.fetch<string[]>(`*[_type=="kawaiModel"].slug.current`),
  ]);

  const ctx: Context = {
    brandSlugs: new Set(brands),
    catSlugs: new Set(cats),
    modelSlugs: new Set(models),
    slugBySku: new Map(),
  };
  const bySku = new Map(existingProducts.filter((p) => p.sku).map((p) => [p.sku!.toLowerCase(), p]));

  // ── Assign slugs across the whole export ───────────────────────────────────
  // Done over all products in file order, not just the selected batches, so a
  // product's slug is the same whichever order the batches are run in and
  // cross-links can resolve to parts that haven't been imported yet.
  const allProducts = data.batches.flatMap((b) => b.products);
  const takenSlugs = new Set(existingProducts.map((p) => p.slug).filter((s): s is string => !!s));

  // A SKU that is already in Sanity keeps whatever slug it was given, so
  // re-running a batch reproduces the same slugs rather than suffixing every
  // product with a clone of itself — and cross-links keep resolving.
  for (const product of allProducts) {
    const doc = bySku.get(product.sku.toLowerCase());
    if (doc?.slug) ctx.slugBySku.set(product.sku.toLowerCase(), doc.slug);
  }

  const slugCollisions: string[] = [];
  for (const product of allProducts) {
    if (ctx.slugBySku.has(product.sku.toLowerCase())) continue;
    const base = slugify(product.name) || slugify(product.sku);
    let slug = base;
    for (let n = 2; takenSlugs.has(slug); n++) {
      if (n === 2) slugCollisions.push(`${product.sku}: "${base}" already taken`);
      slug = `${base}-${n}`;
    }
    takenSlugs.add(slug);
    ctx.slugBySku.set(product.sku.toLowerCase(), slug);
  }

  console.log(
    `Sanity has ${existingProducts.length} products, ${brands.length} brands, ` +
      `${cats.length} categories, ${models.length} Kawai models\n`,
  );

  // ── Plan ───────────────────────────────────────────────────────────────────
  const scope = data.batches
    .filter((b) => wanted.includes(b.batchNumber))
    .flatMap((b) => b.products);

  const hidden = scope.filter((p) => !p.visible);
  const candidates = INCLUDE_HIDDEN ? scope : scope.filter((p) => p.visible);
  const alreadyPresent = candidates.filter((p) => bySku.has(p.sku.toLowerCase()));
  const toCreate = candidates.filter((p) => !bySku.has(p.sku.toLowerCase()));

  const missingBrand = toCreate.filter((p) => !ctx.brandSlugs.has(slugify(p.brand)));
  const missingCategory = toCreate.flatMap((p) =>
    p.categories.map(resolveCategorySlug).filter((s) => !ctx.catSlugs.has(s)),
  );
  const missingModel = toCreate.flatMap((p) =>
    p.compatibleModels.filter((c) => !ctx.modelSlugs.has(slugify(c))),
  );

  if (missingBrand.length > 0) {
    console.error(
      `${missingBrand.length} product(s) reference a brand that isn't in Sanity — ` +
        `run scripts/preflight-wix-import.ts first:`,
    );
    for (const p of missingBrand) console.error(`  ${p.sku}: ${p.brand}`);
    process.exit(1);
  }
  if (missingCategory.length > 0) {
    console.log(`! categories referenced but missing: ${[...new Set(missingCategory)].join(", ")}`);
  }
  if (missingModel.length > 0) {
    console.log(
      `! Kawai models referenced but missing (kept as free text): ` +
        `${[...new Set(missingModel)].join(", ")}`,
    );
  }

  console.log(`PLAN — ${scope.length} products in scope`);
  console.log(`  create            ${toCreate.length}`);
  console.log(
    `  already in Sanity ${alreadyPresent.length}` +
      (alreadyPresent.length > 0 ? (UPDATE_EXISTING ? " (will patch)" : " (skipped)") : ""),
  );
  for (const p of alreadyPresent) {
    console.log(`     ${p.sku.padEnd(18)} ${bySku.get(p.sku.toLowerCase())!._id}`);
  }
  if (hidden.length > 0) {
    console.log(
      `  hidden in Wix     ${hidden.length}` +
        (INCLUDE_HIDDEN ? " (included)" : " (skipped — the schema has no visibility field)"),
    );
    for (const p of hidden) console.log(`     ${p.sku.padEnd(18)} ${p.name}`);
  }
  if (slugCollisions.length > 0) {
    console.log(`  slug collisions   ${slugCollisions.length} (suffixed)`);
    for (const c of slugCollisions) console.log(`     ${c}`);
  }

  // Things worth a human's attention rather than a failure.
  const noImage = toCreate.filter((p) => imageUrlsFor(p).length === 0);
  const noCategory = toCreate.filter((p) => p.categories.length === 0);
  const freePriced = toCreate.filter((p) => p.priceGbp === 0);
  const quoteOnly = toCreate.filter((p) => p.shippingClass === "quote-only");
  console.log(`\nTO REVIEW after import`);
  console.log(`  no image          ${noImage.length}`);
  console.log(`  no category       ${noCategory.length}  (filed under Uncategorised)`);
  console.log(
    `  £0.00 price       ${freePriced.length}` +
      (freePriced.length > 0
        ? `  (${freePriced.filter((p) => p.stock > 0).length} of those in stock)`
        : ""),
  );
  console.log(`  quote-only ship   ${quoteOnly.length}`);

  // Products this script imported that ended up with fewer images than the
  // export has for them — almost always a transient fetch failure. Restricted
  // to documents whose id this script would have minted, so a seed product or
  // one Nigel has added photos to by hand is never rewritten.
  const mine = (p: WixProduct) =>
    bySku.get(p.sku.toLowerCase())!._id === `product-${slugify(p.sku)}`;

  const needImages = REPAIR
    ? alreadyPresent.filter(
        (p) => mine(p) && bySku.get(p.sku.toLowerCase())!.images < imageUrlsFor(p).length,
      )
    : [];
  // Imported before the Uncategorised fallback existed, so still filed nowhere.
  const needCategory = REPAIR
    ? alreadyPresent.filter((p) => mine(p) && bySku.get(p.sku.toLowerCase())!.cats === 0)
    : [];

  if (REPAIR) {
    console.log(`\nREPAIR`);
    console.log(`  missing images     ${needImages.length}`);
    for (const p of needImages) {
      const doc = bySku.get(p.sku.toLowerCase())!;
      console.log(`     ${p.sku.padEnd(18)} has ${doc.images}, export has ${imageUrlsFor(p).length}`);
    }
    console.log(`  no category        ${needCategory.length}`);
    for (const p of needCategory) console.log(`     ${p.sku.padEnd(18)} ${p.name}`);
  }

  if (
    toCreate.length === 0 &&
    needImages.length === 0 &&
    needCategory.length === 0 &&
    !(UPDATE_EXISTING && alreadyPresent.length > 0)
  ) {
    console.log(`\nNothing to write.\n`);
    return;
  }

  // ── Images ─────────────────────────────────────────────────────────────────
  const assetsBySku = new Map<string, string[]>();
  const imageFailures: string[] = [];
  const needImagery = [...toCreate, ...needImages];
  const jobs = needImagery.flatMap((p) =>
    imageUrlsFor(p).map((url, index) => ({ sku: p.sku, url, index })),
  );
  const multiImage = needImagery.filter((p) => imageUrlsFor(p).length > 1);

  if (SKIP_IMAGES) {
    console.log(`\nIMAGES — skipped (${jobs.length} would be uploaded)`);
  } else if (jobs.length > 0) {
    const productCount = needImagery.filter((p) => imageUrlsFor(p).length > 0).length;
    console.log(
      `\nIMAGES — uploading ${jobs.length} for ${productCount} products ` +
        `at concurrency ${CONCURRENCY}`,
    );
    if (multiImage.length > 0) {
      console.log(
        `  ${multiImage.length} product(s) carry more than one photo: ` +
          multiImage.map((p) => `${p.sku} (${imageUrlsFor(p).length})`).join(", "),
      );
    }
    // Ordered per product so images land in the order Wix had them.
    const ordered = new Map<string, (string | undefined)[]>();
    for (const p of needImagery) ordered.set(p.sku, new Array(imageUrlsFor(p).length));
    let done = 0;
    await mapPool(jobs, CONCURRENCY, async (job) => {
      try {
        ordered.get(job.sku)![job.index] = await uploadImage(job.url, job.sku, job.index);
      } catch (err) {
        imageFailures.push(
          `${job.sku} image ${job.index + 1}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      if (++done % 25 === 0 || done === jobs.length) console.log(`  ${done}/${jobs.length}`);
    });
    for (const [sku, ids] of ordered) {
      const kept = ids.filter((id): id is string => !!id);
      if (kept.length > 0) assetsBySku.set(sku, kept);
    }
    if (imageFailures.length > 0) {
      console.log(`  ${imageFailures.length} failed (the product is still created):`);
      for (const f of imageFailures) console.log(`    ${f}`);
    }
  }

  if (DRY_RUN) {
    const sample = toCreate[0];
    if (sample) {
      console.log(`\nSAMPLE DOCUMENT — ${sample.sku}`);
      const slug = ctx.slugBySku.get(sample.sku.toLowerCase())!;
      console.log(JSON.stringify(buildDoc(sample, slug, [], ctx), null, 2));
    }
    // Warm the link report over the whole scope, not just the sample.
    for (const p of toCreate) htmlToBlocks(p.descriptionHtml, p.sku, ctx);
    reportLinks();
    console.log(`\nDry run complete — nothing written.\n`);
    return;
  }

  // ── Write ──────────────────────────────────────────────────────────────────
  if (toCreate.length > 0) console.log(`\nWRITING ${toCreate.length} products…`);
  let created = 0;
  const writeFailures: string[] = [];
  for (const p of toCreate) {
    const slug = ctx.slugBySku.get(p.sku.toLowerCase())!;
    try {
      await client.createIfNotExists(buildDoc(p, slug, assetsBySku.get(p.sku) ?? [], ctx));
      if (++created % 20 === 0 || created === toCreate.length) {
        console.log(`  ${created}/${toCreate.length}`);
      }
    } catch (err) {
      writeFailures.push(`${p.sku}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  let repaired = 0;
  for (const p of needImages) {
    const ids = assetsBySku.get(p.sku) ?? [];
    if (ids.length === 0) continue;
    const target = bySku.get(p.sku.toLowerCase())!;
    await client
      .patch(target._id)
      .set({
        images: ids.map((id) => ({
          _type: "image",
          _key: k(),
          asset: { _type: "reference", _ref: id },
        })),
      })
      .commit();
    console.log(`  repaired ${p.sku.padEnd(18)} ${ids.length} image(s)`);
    repaired++;
  }

  let refiled = 0;
  for (const p of needCategory) {
    const slugs = categoriesFor(p, ctx);
    if (slugs.length === 0) continue;
    await client
      .patch(bySku.get(p.sku.toLowerCase())!._id)
      .set({ categories: slugs.map((s) => ({ ...weakRef(`category-${s}`), _key: k() })) })
      .commit();
    console.log(`  refiled  ${p.sku.padEnd(18)} ${slugs.join(", ")}`);
    refiled++;
  }

  let patched = 0;
  if (UPDATE_EXISTING && alreadyPresent.length > 0) {
    console.log(`\nPATCHING ${alreadyPresent.length} existing products (price, stock, weight)`);
    for (const p of alreadyPresent) {
      const target = bySku.get(p.sku.toLowerCase())!;
      await client
        .patch(target._id)
        .set({ price: p.priceGbp, stock: p.stock, weightGrams: p.weightGrams })
        .commit();
      console.log(`  ${p.sku.padEnd(18)} £${p.priceGbp.toFixed(2)}  stock ${p.stock}`);
      patched++;
    }
  }

  reportLinks();

  // ── Verify ─────────────────────────────────────────────────────────────────
  const expected = toCreate.map((p) => `product-${slugify(p.sku)}`);
  const landed = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: expected });
  const missing = expected.filter((id) => !landed.includes(id));
  const total = await client.fetch<number>(
    `count(*[_type=="product" && !(_id in path("drafts.**"))])`,
  );

  console.log(`\nVERIFY`);
  console.log(`  created             ${created}`);
  if (repaired > 0) console.log(`  images repaired     ${repaired}`);
  if (refiled > 0) console.log(`  refiled             ${refiled}`);
  if (patched > 0) console.log(`  patched             ${patched}`);
  console.log(`  images attached     ${[...assetsBySku.values()].flat().length}`);
  if (imageFailures.length > 0) console.log(`  image failures      ${imageFailures.length}`);
  console.log(`  present in Sanity   ${landed.length}/${expected.length}`);
  console.log(`  products now        ${total}`);
  if (missing.length > 0 || writeFailures.length > 0) {
    for (const f of writeFailures) console.log(`  ! write failed: ${f}`);
    for (const id of missing) console.log(`  ! not found after write: ${id}`);
    process.exitCode = 1;
  }
  console.log("");
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
