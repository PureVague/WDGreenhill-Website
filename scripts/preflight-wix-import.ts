/**
 * Pre-flight for the Wix product import: ensure every brand, category and
 * Kawai model referenced by wix-products-cleaned.json exists in Sanity.
 *
 *   npx tsx scripts/preflight-wix-import.ts --dry-run   (report only)
 *   npx tsx scripts/preflight-wix-import.ts             (create missing docs)
 *
 * Idempotent: existence is checked by slug, and creates use deterministic ids
 * (brand-<slug>, category-<slug>, kawaiModel-<slug>) matching the earlier
 * migration. Never touches product documents.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { CATEGORY_SLUG_ALIASES, UNCATEGORISED, resolveCategorySlug } from "./wix-import-mappings";

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

const DRY_RUN = process.argv.includes("--dry-run");
const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

// ── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Normalised key for near-duplicate detection (strips separators + "and").
const norm = (s: string) => s.toLowerCase().replace(/and/g, "").replace(/[^a-z0-9]/g, "");

// ── Canonical copy for documents this script creates ────────────────────────

/** Kawai is WDG's official service partner — rendered as a badge on brand pages. */
const KAWAI_PARTNER_LABEL = "Official UK Service Partner";

/** Placeholder blurb for model stubs nobody has written up yet. */
const stubDescription = (code: string) => `Kawai ${code} — parts, service, and manuals stocked.`;

/**
 * Wording this script has used in the past. reconcile() rewrites a stub only
 * when its description still matches one of these, so anything hand-edited in
 * Studio is left alone.
 */
const SUPERSEDED_STUB_DESCRIPTIONS: ((code: string) => string)[] = [
  (code) => `Kawai ${code} — service parts available.`,
];

const VALID_SERIES = ["ES", "KDP", "CN", "CA", "CL", "CS", "MP", "VPC", "NV", "DG", "K", "Other"];

function seriesFor(model: string): string {
  const prefix = (model.match(/^[A-Za-z]+/)?.[0] ?? "").toUpperCase();
  if (prefix === "KCP") return "KDP"; // old Classic Player branding
  return VALID_SERIES.includes(prefix) ? prefix : "Other";
}

interface Meta {
  brands: string[];
  categories: { slug: string; name: string }[];
  compatibleModelsDetected: string[];
}

/**
 * Bring documents that already exist in line with the canonical copy above.
 *
 * Both patches are deliberately conservative. The brand label is only rewritten
 * when it actually differs, and a model stub's description is only rewritten
 * when it still matches wording this script generated — so the real write-ups
 * from the original migration, and anything Nigel edits in Studio, are never
 * clobbered.
 */
async function reconcile(modelPlan: { code: string; slug: string }[]) {
  console.log(`\n${DRY_RUN ? "RECONCILE (dry run)" : "RECONCILE"}`);

  const kawai = await client.getDocument<{ partnerLabel?: string }>("brand-kawai");
  if (!kawai) {
    console.log("  brand-kawai not found — skipping partner label");
  } else if (kawai.partnerLabel === KAWAI_PARTNER_LABEL) {
    console.log(`  brand kawai: partnerLabel already "${KAWAI_PARTNER_LABEL}"`);
  } else {
    if (!DRY_RUN) {
      await client.patch("brand-kawai").set({ partnerLabel: KAWAI_PARTNER_LABEL }).commit();
    }
    console.log(
      `  brand kawai: partnerLabel "${kawai.partnerLabel ?? "—"}" -> "${KAWAI_PARTNER_LABEL}"`,
    );
  }

  const stubs = await client.fetch<{ _id: string; name: string; shortDescription?: string }[]>(
    `*[_type=="kawaiModel" && _id in $ids]{ _id, name, shortDescription }`,
    { ids: modelPlan.map((m) => `kawaiModel-${m.slug}`) },
  );

  let updated = 0;
  let preserved = 0;
  for (const stub of stubs) {
    const wanted = stubDescription(stub.name);
    if (stub.shortDescription === wanted) continue;
    const isOurs = SUPERSEDED_STUB_DESCRIPTIONS.some(
      (fn) => fn(stub.name) === stub.shortDescription,
    );
    if (!isOurs) {
      preserved++;
      continue;
    }
    if (!DRY_RUN) await client.patch(stub._id).set({ shortDescription: wanted }).commit();
    console.log(`  ${stub.name}: description -> "${wanted}"`);
    updated++;
  }
  console.log(
    `  ${updated} stub description${updated === 1 ? "" : "s"} ` +
      `${DRY_RUN ? "would be " : ""}updated, ${preserved} hand-written ` +
      `description${preserved === 1 ? "" : "s"} left untouched`,
  );
}

async function main() {
  const meta: Meta = JSON.parse(
    readFileSync(resolve(process.cwd(), "wix-products-cleaned.json"), "utf8"),
  ).meta;

  console.log(`\n${DRY_RUN ? "DRY RUN — no writes" : "LIVE — creating missing documents"}\n`);

  // ── Fetch what already exists ──────────────────────────────────────────────
  const [existingBrands, existingCats, existingModels] = await Promise.all([
    client.fetch<{ slug: string; name: string }[]>(
      `*[_type=="brand"]{ "slug": slug.current, name }`,
    ),
    client.fetch<{ slug: string; name: string }[]>(
      `*[_type=="category"]{ "slug": slug.current, name }`,
    ),
    client.fetch<{ slug: string; name: string }[]>(
      `*[_type=="kawaiModel"]{ "slug": slug.current, name }`,
    ),
  ]);

  const brandSlugs = new Set(existingBrands.map((b) => b.slug));
  const catSlugs = new Set(existingCats.map((c) => c.slug));
  const modelSlugs = new Set(existingModels.map((m) => m.slug));

  console.log(
    `Existing in Sanity — brands: ${existingBrands.length}, categories: ${existingCats.length}, kawaiModels: ${existingModels.length}\n`,
  );

  // ── Brands ─────────────────────────────────────────────────────────────────
  const brandPlan = meta.brands.map((name) => ({ name, slug: slugify(name) }));
  const missingBrands = brandPlan.filter((b) => !brandSlugs.has(b.slug));

  console.log(`BRANDS: ${meta.brands.length} referenced, ${missingBrands.length} missing`);
  for (const b of missingBrands) console.log(`  + ${b.slug.padEnd(20)} ${b.name}`);

  // ── Categories (aliased slugs resolve to existing docs, never duplicated) ──
  // Uncategorised is not in the export — the importer files products the Wix
  // data left unfiled into it, so it has to exist before an import runs.
  const referencedCats = [...meta.categories, UNCATEGORISED];
  const aliased = meta.categories.filter((c) => CATEGORY_SLUG_ALIASES[c.slug]);
  const missingCats = referencedCats
    .filter((c) => !CATEGORY_SLUG_ALIASES[c.slug])
    .filter((c) => !catSlugs.has(c.slug));

  console.log(`\nCATEGORIES: ${referencedCats.length} referenced, ${missingCats.length} to create`);
  for (const c of missingCats) console.log(`  + ${c.slug.padEnd(24)} ${c.name}`);
  if (aliased.length) {
    console.log(`\n  Aliased to existing categories (no duplicates created):`);
    for (const a of aliased) {
      const target = resolveCategorySlug(a.slug);
      const ok = catSlugs.has(target);
      console.log(`     ${a.slug} -> ${target}${ok ? "" : "   !! TARGET MISSING"}`);
    }
  }
  // Any unresolved near-duplicates we haven't explicitly aliased.
  const catNearDupes = missingCats
    .map((c) => ({
      cat: c,
      match: existingCats.find((e) => norm(e.slug) === norm(c.slug) || norm(e.name) === norm(c.name)),
    }))
    .filter((x) => x.match);
  if (catNearDupes.length) {
    console.log(`\n  !! UNALIASED NEAR-DUPLICATES — review before creating:`);
    for (const d of catNearDupes) {
      console.log(`     "${d.cat.slug}" ~ existing "${d.match!.slug}" (${d.match!.name})`);
    }
  }

  // ── Kawai models (with near-duplicate warning) ─────────────────────────────
  const modelPlan = meta.compatibleModelsDetected.map((code) => ({
    code,
    slug: slugify(code),
    series: seriesFor(code),
  }));
  const missingModels = modelPlan.filter((m) => !modelSlugs.has(m.slug));
  const modelNearDupes = missingModels
    .map((m) => ({
      m,
      match: existingModels.find(
        (e) => e.slug.startsWith(m.slug) || m.slug.startsWith(e.slug),
      ),
    }))
    .filter((x) => x.match);

  console.log(
    `\nKAWAI MODELS: ${meta.compatibleModelsDetected.length} referenced, ${missingModels.length} missing`,
  );
  for (const m of missingModels) console.log(`  + ${m.slug.padEnd(12)} ${m.code} (series ${m.series})`);
  if (modelNearDupes.length) {
    console.log(`\n  !! NEAR-DUPLICATES of existing models:`);
    for (const d of modelNearDupes) {
      console.log(`     "${d.m.slug}" ~ existing "${d.match!.slug}" (${d.match!.name})`);
    }
  }

  await reconcile(modelPlan);

  if (DRY_RUN) {
    console.log(`\nDry run complete — nothing written.\n`);
    return;
  }

  // ── Create ─────────────────────────────────────────────────────────────────
  console.log(`\nCreating…\n`);

  for (const b of missingBrands) {
    const isKawai = b.slug === "kawai";
    await client.createIfNotExists({
      _id: `brand-${b.slug}`,
      _type: "brand",
      name: b.name,
      slug: { _type: "slug", current: b.slug },
      isPartner: isKawai,
      ...(isKawai ? { partnerLabel: KAWAI_PARTNER_LABEL } : {}),
    });
    console.log(`Created brand: ${b.name}`);
  }

  for (const c of missingCats) {
    const description = "description" in c ? c.description : undefined;
    await client.createIfNotExists({
      _id: `category-${c.slug}`,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      ...(description ? { description } : {}),
    });
    console.log(`Created category: ${c.name} (${c.slug})`);
  }

  for (const m of missingModels) {
    await client.createIfNotExists({
      _id: `kawaiModel-${m.slug}`,
      _type: "kawaiModel",
      name: m.code,
      slug: { _type: "slug", current: m.slug },
      series: m.series,
      status: "legacy",
      shortDescription: stubDescription(m.code),
    });
    console.log(`Created kawaiModel stub: ${m.code} (${m.series})`);
  }

  // ── Verify ─────────────────────────────────────────────────────────────────
  const [bAfter, cAfter, mAfter] = await Promise.all([
    client.fetch<string[]>(`*[_type=="brand"].slug.current`),
    client.fetch<string[]>(`*[_type=="category"].slug.current`),
    client.fetch<string[]>(`*[_type=="kawaiModel"].slug.current`),
  ]);
  const bSet = new Set(bAfter), cSet = new Set(cAfter), mSet = new Set(mAfter);
  const stillMissing = {
    brands: brandPlan.filter((b) => !bSet.has(b.slug)).map((b) => b.slug),
    // Aliased slugs must resolve to an existing canonical category.
    categories: referencedCats
      .filter((c) => !cSet.has(resolveCategorySlug(c.slug)))
      .map((c) => `${c.slug} -> ${resolveCategorySlug(c.slug)}`),
    models: modelPlan.filter((m) => !mSet.has(m.slug)).map((m) => m.slug),
  };

  console.log(`\nVERIFY — totals now: brands=${bAfter.length}, categories=${cAfter.length}, kawaiModels=${mAfter.length}`);
  console.log(
    `All referenced present? brands: ${stillMissing.brands.length === 0}, ` +
      `categories: ${stillMissing.categories.length === 0}, models: ${stillMissing.models.length === 0}`,
  );
  if (stillMissing.brands.length || stillMissing.categories.length || stillMissing.models.length) {
    console.log("STILL MISSING:", JSON.stringify(stillMissing));
    process.exitCode = 1;
  }
  console.log("");
}

main().catch((err) => {
  console.error("Pre-flight failed:", err);
  process.exit(1);
});
