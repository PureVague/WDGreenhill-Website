/**
 * Post-import catalogue report.
 *
 *   npx tsx scripts/wix-import-report.ts
 *
 * Reads only. Prints a summary of the catalogue as it now stands in Sanity and
 * writes reports/wix-import-attention.md — the list of things a human needs to
 * fix in Studio that no import could decide automatically.
 *
 * Safe to re-run: regenerate it as you work through the list to see what is
 * left. Everything is derived from Sanity, not from the export, so it reflects
 * edits made in Studio.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

const OUT = "reports/wix-import-attention.md";

interface Row {
  _id: string;
  sku: string;
  title: string;
  slug: string | null;
  price: number;
  stock: number;
  featured: boolean;
  brand: string | null;
  brandName: string | null;
  cats: (string | null)[] | null;
  models: (string | null)[] | null;
  images: number;
  descriptionText: string | null;
}

const table = (rows: [string, number][], total: number) =>
  rows
    .map(([label, n]) => `| ${label} | ${n} | ${((n / total) * 100).toFixed(1)}% |`)
    .join("\n");

const list = (rows: Row[], limit = Infinity) =>
  rows
    .slice(0, limit)
    .map((r) => `| \`${r.sku}\` | ${r.title.replace(/\|/g, "\\|")} |`)
    .join("\n");

async function main() {
  const products = await client.fetch<Row[]>(
    `*[_type=="product" && !(_id in path("drafts.**"))]{
       _id, sku, title, "slug": slug.current, price, stock, featured,
       "brand": brand->slug.current,
       "brandName": brand->name,
       "cats": categories[]->slug.current,
       "models": compatibleModels[]->slug.current,
       "images": coalesce(count(images), 0),
       "descriptionText": array::join(description[].children[].text, " ")
     } | order(sku asc)`,
  );
  const kawaiModels = await client.fetch<{ name: string; slug: string }[]>(
    `*[_type=="kawaiModel"]{ name, "slug": slug.current }`,
  );
  const categories = await client.fetch<{ name: string; slug: string }[]>(
    `*[_type=="category"]{ name, "slug": slug.current }`,
  );
  const catName = new Map(categories.map((c) => [c.slug, c.name]));

  const total = products.length;

  // ── Aggregates ─────────────────────────────────────────────────────────────
  const byBrand = new Map<string, number>();
  for (const p of products) {
    const name = p.brandName ?? "(no brand)";
    byBrand.set(name, (byBrand.get(name) ?? 0) + 1);
  }
  const brandRows = [...byBrand.entries()].sort((a, b) => b[1] - a[1]);

  const byCategory = new Map<string, number>();
  for (const p of products) {
    for (const slug of p.cats ?? []) {
      if (!slug) continue;
      const name = catName.get(slug) ?? slug;
      byCategory.set(name, (byCategory.get(name) ?? 0) + 1);
    }
  }
  const categoryRows = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);

  const inStock = products.filter((p) => p.stock > 0);
  const freePriced = products.filter((p) => p.price === 0);
  const noImage = products.filter((p) => p.images === 0);
  const unbranded = products.filter((p) => p.brand === "unbranded");
  const uncategorised = products.filter((p) => (p.cats ?? []).includes("uncategorised"));
  const featured = products.filter((p) => p.featured);

  // Kawai parts with no structured compatibleModels reference. Either the brand
  // is Kawai, or a Kawai model code appears in the title/description — the
  // latter catches parts filed under another make that still fit a Kawai.
  const codes = kawaiModels
    .map((m) => m.name)
    .filter((n) => /^[A-Z]+\d/.test(n))
    .sort((a, b) => b.length - a.length);
  const codeRe = new RegExp(`\\b(${codes.join("|")})\\b`, "i");
  const kawaiNoModels = products.filter((p) => {
    if ((p.models ?? []).filter(Boolean).length > 0) return false;
    const haystack = `${p.title} ${p.descriptionText ?? ""}`;
    return p.brand === "kawai" || codeRe.test(haystack);
  });

  // ── Console summary ────────────────────────────────────────────────────────
  console.log(`\nCATALOGUE — ${total} products in Sanity\n`);
  console.log(`  in stock          ${inStock.length}`);
  console.log(`  out of stock      ${total - inStock.length}`);
  console.log(`  priced £0.00      ${freePriced.length}`);
  console.log(`  no image          ${noImage.length}`);
  console.log(`  Unbranded         ${unbranded.length}`);
  console.log(`  Uncategorised     ${uncategorised.length}`);
  console.log(`  featured          ${featured.length}`);
  console.log(`  Kawai, no models  ${kawaiNoModels.length}`);
  console.log(`\nTOP 10 BRANDS`);
  for (const [name, n] of brandRows.slice(0, 10)) console.log(`  ${String(n).padStart(5)}  ${name}`);
  console.log(`\nCATEGORIES`);
  for (const [name, n] of categoryRows) console.log(`  ${String(n).padStart(5)}  ${name}`);

  // ── Attention report ───────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const md = `# Wix import — needs a human

Generated ${today} from the live Sanity dataset by \`scripts/wix-import-report.ts\`.
Re-run that script to regenerate this file as you work through the list.

Nothing here is broken. These are the decisions the import could not make on its
own, ordered roughly by how much they affect a customer.

**Catalogue: ${total} products** — ${inStock.length} in stock, ${total - inStock.length} out of stock.

---

## 1. Unbranded products (${unbranded.length})

Filed under the "Unbranded" brand because the Wix export had no make against
them. They are reachable by search and category but not from any brand page.
Reassigning a real brand in Studio is the single highest-value cleanup here.

| SKU | Title |
| --- | --- |
${list(unbranded)}

---

## 2. Products with no image (${noImage.length})

These had no image in the Wix export at all — nothing failed to download, there
was simply no photo. A parts catalogue converts far better with pictures, so
these are worth photographing over time. The largest single block is the Thomas
organ \`24-5xxx\` / \`39-5xxx\` / \`52-5xxx\` run.

| SKU | Title |
| --- | --- |
${list(noImage)}

---

## 3. Priced £0.00 (${freePriced.length})

Every one is out of stock, so none can be bought at £0 — but they show a £0
price on the site. Either price them or hide them.

| SKU | Title | Stock |
| --- | --- | --- |
${freePriced.map((p) => `| \`${p.sku}\` | ${p.title.replace(/\|/g, "\\|")} | ${p.stock} |`).join("\n")}

---

## 4. Uncategorised (${uncategorised.length})

The export had no category for these, so they were filed under **Uncategorised**
to keep them browsable. Re-file them into a real category in Studio and they
drop off this list.

| SKU | Title |
| --- | --- |
${list(uncategorised)}

---

## 5. Kawai parts with no compatible-model links (${kawaiNoModels.length})

Either the brand is Kawai or a Kawai model code appears in the title or
description, but the product has no structured \`compatibleModels\` reference —
so it will not appear on the relevant Kawai model page. The Wix export only
carried model data for some products; the rest need linking by hand.

Because this is matched on text, expect some false positives (a code that is
part of a longer part number, say). Check before linking.

| SKU | Title |
| --- | --- |
${list(kawaiNoModels)}

---

## 6. Smaller things

**Hidden in Wix, not imported (2).** \`238124\` (Sensor Rail KKB-031,032,033) and
\`238688\` (PWB KKB-040 A/B) were hidden in the Wix store. The product schema has
no visibility field, so importing them would have put them straight in the shop.
Re-run with \`--include-hidden\` if they should come in.

**One dead cross-link.** \`238730-389\`'s description says the part is superseded
by \`238747-389\`, which is not in the export, so that link still points at the
old Wix store. Either add the replacement part or edit the description.

**Free-text SKUs.** A few products use a description where a part number should
be: \`DP-7 Amp PCB\`, \`DP-7 Main PCB\`, \`GDP100 / GDP200 Pedals\`. They import fine
but will not match how customers search.

**Featured products have no images (${featured.filter((p) => p.images === 0).length} of ${featured.length}).** Not urgent — the featured
section is currently off the home page. Worth fixing before it is ever re-added.

${featured.map((p) => `- \`${p.sku}\` ${p.title} — ${p.images === 0 ? "**no image**" : `${p.images} image(s)`}`).join("\n")}

**Descriptions repeat the brand and part number.** Most imported descriptions
open with the make and end with "Part # X", both of which the page already
shows. Deliberately left alone — the import is lossless, and tidying is a
per-product judgement call for Studio.

---

## Reference — catalogue breakdown

### By brand

| Brand | Products | Share |
| --- | --- | --- |
${table(brandRows, total)}

### By category

| Category | Products | Share |
| --- | --- | --- |
${table(categoryRows, total)}

*A product can sit in more than one category, so these do not sum to ${total}.*
`;

  mkdirSync("reports", { recursive: true });
  writeFileSync(OUT, md);
  console.log(`\nWrote ${OUT} (${md.split("\n").length} lines)\n`);
}

main().catch((err) => {
  console.error("Report failed:", err);
  process.exit(1);
});
