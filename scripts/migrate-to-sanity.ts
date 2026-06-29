/**
 * One-off migration: seed Sanity with the existing TypeScript data files.
 *
 * Run with:   npx tsx scripts/migrate-to-sanity.ts
 *
 * Idempotent — safe to re-run. Each document uses a deterministic _id and is
 * created only if it doesn't already exist. References are made weak so the
 * order of creation can't cause integrity failures, and a second pass wires up
 * Kawai predecessor/successor links once every model exists.
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and a
 * write-capable SANITY_API_TOKEN. These are read from .env.local automatically.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

// ── Load .env.local (tsx does not do this automatically) ─────────────────────
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
} catch {
  // .env.local not found — rely on already-present env vars.
}

import { brands } from "../data/brands";
import { categories } from "../data/categories";
import { kawaiModels } from "../data/models";
import { products } from "../data/products";
import { manuals } from "../data/manuals";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing Sanity env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

let keyCounter = 0;
const k = () => `k${(keyCounter++).toString(36)}`;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function toBlocks(text: string | undefined) {
  if (!text) return undefined;
  return text
    .split(/\n\n+/)
    .filter(Boolean)
    .map((para) => ({
      _type: "block",
      _key: k(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: k(), text: para, marks: [] }],
    }));
}

const weakRef = (id: string) => ({ _type: "reference", _ref: id, _weak: true });

// Create only if missing; logs Created vs Exists.
type SanityDoc = { _id: string; _type: string } & Record<string, unknown>;
async function ensure(doc: SanityDoc, label: string) {
  const existing = await client.getDocument(doc._id);
  if (existing) {
    console.log(`Exists  ${doc._type}: ${label}`);
    return false;
  }
  await client.create(doc);
  console.log(`Created ${doc._type}: ${label}`);
  return true;
}

// ── Lookup sets ──────────────────────────────────────────────────────────────

const kawaiSlugs = new Set(kawaiModels.map((m) => m.slug));
const brandSlugs = new Set(brands.map((b) => b.slug));
const brandNameToSlug = new Map(brands.map((b) => [b.name.toLowerCase(), b.slug]));

function parseYears(yearRange: string): { intro?: number; disc?: number } {
  const [a, b] = yearRange.split("–").map((s) => s.trim());
  const intro = a && /^\d{4}$/.test(a) ? Number(a) : undefined;
  const disc = b && /^\d{4}$/.test(b) ? Number(b) : undefined;
  return { intro, disc };
}

// ── Migration ────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nMigrating to Sanity project ${projectId}/${dataset}\n`);

  // 1. Brands
  for (const b of brands) {
    const isPartner = b.slug === "kawai";
    await ensure(
      {
        _id: `brand-${b.slug}`,
        _type: "brand",
        name: b.name,
        slug: { _type: "slug", current: b.slug },
        isPartner,
        ...(isPartner ? { partnerLabel: "Official" } : {}),
        description: toBlocks(b.description),
      },
      b.name,
    );
  }

  // 2. Categories
  for (const c of categories) {
    await ensure(
      {
        _id: `category-${c.slug}`,
        _type: "category",
        name: c.name,
        slug: { _type: "slug", current: c.slug },
        description: c.description,
        icon: c.icon,
      },
      c.name,
    );
  }

  // 3. Kawai models (base — predecessor/successor wired in pass 2)
  for (const m of kawaiModels) {
    const parsed = parseYears(m.yearRange);
    await ensure(
      {
        _id: `kawaiModel-${m.slug}`,
        _type: "kawaiModel",
        name: m.name,
        slug: { _type: "slug", current: m.slug },
        series: m.series,
        ...(m.category ? { category: m.category } : {}),
        ...(m.yearIntroduced ?? parsed.intro
          ? { yearIntroduced: m.yearIntroduced ?? parsed.intro }
          : {}),
        ...(m.yearDiscontinued ?? parsed.disc
          ? { yearDiscontinued: m.yearDiscontinued ?? parsed.disc }
          : {}),
        status: m.status,
        shortDescription: (m.description ?? "").slice(0, 200),
        longDescription: toBlocks(m.longDescription),
        ...(m.keyFeatures ? { keyFeatures: m.keyFeatures } : {}),
        ...(m.cabinetFinishes ? { cabinetFinishes: m.cabinetFinishes } : {}),
      },
      m.name,
    );
  }

  // 3b. Second pass: predecessor / successor references
  for (const m of kawaiModels) {
    const patch: Record<string, unknown> = {};
    if (m.predecessor && kawaiSlugs.has(m.predecessor)) {
      patch.predecessor = weakRef(`kawaiModel-${m.predecessor}`);
    }
    if (m.successor && kawaiSlugs.has(m.successor)) {
      patch.successor = weakRef(`kawaiModel-${m.successor}`);
    }
    if (Object.keys(patch).length > 0) {
      await client.patch(`kawaiModel-${m.slug}`).set(patch).commit();
      console.log(`Linked  kawaiModel: ${m.name}`);
    }
  }

  // 4. Products
  for (const p of products) {
    if (!brandSlugs.has(p.brand)) {
      console.warn(`! Product ${p.sku}: brand slug "${p.brand}" not in brands data`);
    }
    const modelRefs = p.compatibleModels.filter((s) => kawaiSlugs.has(s));
    const modelText = p.compatibleModels.filter((s) => !kawaiSlugs.has(s));

    await ensure(
      {
        _id: `product-${p.slug}`,
        _type: "product",
        sku: p.sku,
        title: p.title,
        slug: { _type: "slug", current: p.slug },
        brand: weakRef(`brand-${p.brand}`),
        categories: p.categories.map((c) => ({ ...weakRef(`category-${c}`), _key: k() })),
        compatibleModels: modelRefs.map((s) => ({ ...weakRef(`kawaiModel-${s}`), _key: k() })),
        ...(modelText.length ? { compatibleModelsText: modelText } : {}),
        price: p.price,
        stock: p.stock,
        featured: p.featured,
        description: toBlocks(p.description),
        specifications: Object.entries(p.specs).map(([label, value]) => ({
          _key: k(),
          label,
          value,
        })),
      },
      `${p.sku} — ${p.title}`,
    );
  }

  // 5. Manuals
  for (const man of manuals) {
    const brandSlug = brandNameToSlug.get(man.brand.toLowerCase()) ?? slugify(man.brand);
    const typeMap: Record<string, string> = {
      owner: "Owner's Manual",
      service: "Service Manual",
      schematic: "Schematic",
    };
    const formatMap: Record<string, string> = { pdf: "PDF", paper: "Paper", both: "Both" };
    await ensure(
      {
        _id: `manual-${man.id}`,
        _type: "manual",
        brand: weakRef(`brand-${brandSlug}`),
        model: man.model,
        type: typeMap[man.type] ?? "Service Manual",
        format: formatMap[man.format] ?? "PDF",
        price: man.price,
        stockCount: man.inStock ? 1 : 0,
        ...(man.year ? { year: man.year } : {}),
        ...(man.notes ? { description: man.notes } : {}),
      },
      `${man.brand} ${man.model}`,
    );
  }

  console.log(
    `\nDone. brands=${brands.length} categories=${categories.length} ` +
      `models=${kawaiModels.length} products=${products.length} manuals=${manuals.length}\n`,
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
