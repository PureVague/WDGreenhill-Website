import "server-only";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityClient, urlFor } from "./client";
import {
  productsQuery,
  productBySkuQuery,
  productByExactSkuQuery,
  productsByBrandQuery,
  productsByCategoryQuery,
  productsByKawaiModelQuery,
  featuredProductsQuery,
  relatedProductsQuery,
  allBrandsQuery,
  allCategoriesQuery,
  kawaiModelsQuery,
  kawaiModelBySlugQuery,
  manualsQuery,
  shippingSettingsQuery,
  productsShippingQuery,
  checkoutProductsBySkusQuery,
} from "./queries";
import type {
  SanityProduct,
  SanityBrand,
  SanityCategory,
  SanityKawaiModel,
  SanityManual,
  ProductShipping,
  CheckoutProduct,
} from "./types";
import type { Product } from "@/data/products";
import type { Brand } from "@/data/brands";
import type { Category } from "@/data/categories";
import type { KawaiModel } from "@/data/models";
import type { Manual, ManualType, ManualFormat } from "@/data/manuals";
import type { ShippingSettings, ShippingClass } from "@/lib/shipping/calculate";

// ── Helpers ──────────────────────────────────────────────────────────────────

function blocksToText(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children.map((c) => (c as { text?: string }).text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

function imageUrls(images: SanityProduct["images"]): string[] {
  if (!images) return [];
  return images.map((img) =>
    urlFor(img).width(1200).height(1200).fit("max").auto("format").quality(80).url(),
  );
}

// ── Mappers (Sanity shape → existing site shape) ─────────────────────────────

function mapProduct(p: SanityProduct): Product {
  return {
    sku: p.sku,
    title: p.title,
    slug: p.slug,
    brand: p.brand ?? "",
    categories: p.categories ?? [],
    compatibleModels: [...(p.compatibleModels ?? []), ...(p.compatibleModelsText ?? [])],
    price: p.price ?? 0,
    stock: p.stock ?? 0,
    images: imageUrls(p.images),
    description: blocksToText(p.description),
    specs: Object.fromEntries((p.specs ?? []).map((s) => [s.label, s.value])),
    featured: p.featured ?? false,
  };
}

function mapBrand(b: SanityBrand): Brand {
  return {
    slug: b.slug,
    name: b.name,
    description: blocksToText(b.description),
    featured: b.isPartner ?? false,
  };
}

function mapCategory(c: SanityCategory): Category {
  return {
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    icon: c.icon ?? "circuit-board",
  };
}

function mapKawai(m: SanityKawaiModel): KawaiModel {
  const yearRange = m.yearIntroduced
    ? `${m.yearIntroduced}–${m.yearDiscontinued ?? "present"}`
    : "";
  return {
    slug: m.slug,
    name: m.name,
    series: m.series as KawaiModel["series"],
    yearRange,
    description: m.shortDescription ?? "",
    status: m.status,
    category: (m.category ?? undefined) as KawaiModel["category"],
    yearIntroduced: m.yearIntroduced ?? undefined,
    yearDiscontinued: m.yearDiscontinued ?? undefined,
    keyFeatures: m.keyFeatures ?? undefined,
    longDescription: m.longDescription ? blocksToText(m.longDescription) : undefined,
    cabinetFinishes: m.cabinetFinishes ?? undefined,
    predecessor: m.predecessor ?? undefined,
    successor: m.successor ?? undefined,
  };
}

const MANUAL_TYPE_MAP: Record<string, ManualType> = {
  "Owner's Manual": "owner",
  "Service Manual": "service",
  Schematic: "schematic",
};
const MANUAL_FORMAT_MAP: Record<string, ManualFormat> = {
  PDF: "pdf",
  Paper: "paper",
  Both: "both",
};

function mapManual(m: SanityManual): Manual {
  return {
    id: m._id,
    brand: m.brandName ?? "",
    model: m.model,
    type: MANUAL_TYPE_MAP[m.type] ?? "service",
    format: MANUAL_FORMAT_MAP[m.format] ?? "pdf",
    price: m.price ?? 0,
    inStock: m.stockCount == null ? true : m.stockCount > 0,
    year: m.year ?? undefined,
    notes: m.description ?? undefined,
  };
}

// Resilient fetch: never throw during render/build. If Sanity is unreachable
// (e.g. network blip, or empty dataset before migration), log and fall back so
// pages render a clean empty state instead of crashing. ISR (revalidate) will
// pick up real data on the next regeneration.
async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err) {
    console.error("[sanity] query failed:", err instanceof Error ? err.message : err);
    return fallback;
  }
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const data = await safeFetch<SanityProduct[]>(productsQuery, {}, []);
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await safeFetch<SanityProduct | null>(productBySkuQuery, { slug }, null);
  return data ? mapProduct(data) : null;
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  const data = await safeFetch<SanityProduct | null>(productByExactSkuQuery, { sku }, null);
  return data ? mapProduct(data) : null;
}

export async function getProductsByBrand(brand: string): Promise<Product[]> {
  const data = await safeFetch<SanityProduct[]>(productsByBrandQuery, { brand }, []);
  return data.map(mapProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const data = await safeFetch<SanityProduct[]>(productsByCategoryQuery, { category }, []);
  return data.map(mapProduct);
}

export async function getProductsByKawaiModel(model: string): Promise<Product[]> {
  const data = await safeFetch<SanityProduct[]>(productsByKawaiModelQuery, { model }, []);
  return data.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const data = await safeFetch<SanityProduct[]>(featuredProductsQuery, {}, []);
  return data.map(mapProduct);
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const data = await safeFetch<SanityProduct[]>(
    relatedProductsQuery,
    { brand: product.brand, slug: product.slug },
    [],
  );
  return data.map(mapProduct);
}

// ── Brands / Categories ──────────────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  const data = await safeFetch<SanityBrand[]>(allBrandsQuery, {}, []);
  return data.map(mapBrand);
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const data = await safeFetch<SanityBrand[]>(allBrandsQuery, {}, []);
  return data.map(mapBrand).find((b) => b.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  const data = await safeFetch<SanityCategory[]>(allCategoriesQuery, {}, []);
  return data.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const data = await safeFetch<SanityCategory[]>(allCategoriesQuery, {}, []);
  return data.map(mapCategory).find((c) => c.slug === slug);
}

// ── Kawai models ─────────────────────────────────────────────────────────────

export async function getKawaiModels(): Promise<KawaiModel[]> {
  const data = await safeFetch<SanityKawaiModel[]>(kawaiModelsQuery, {}, []);
  return data.map(mapKawai);
}

export async function getKawaiModelBySlug(slug: string): Promise<KawaiModel | null> {
  const data = await safeFetch<SanityKawaiModel | null>(kawaiModelBySlugQuery, { slug }, null);
  return data ? mapKawai(data) : null;
}

// ── Manuals ──────────────────────────────────────────────────────────────────

export async function getManuals(): Promise<Manual[]> {
  const data = await safeFetch<SanityManual[]>(manualsQuery, {}, []);
  return data.map(mapManual);
}

// ── Shipping ─────────────────────────────────────────────────────────────────

export interface NormalizedProductShipping {
  sku: string;
  weightGrams: number;
  dimensions?: { lengthCm?: number; widthCm?: number; heightCm?: number };
  shippingClass: ShippingClass;
}

function normalizeShipping(p: ProductShipping): NormalizedProductShipping {
  return {
    sku: p.sku,
    weightGrams: typeof p.weightGrams === "number" ? p.weightGrams : 10,
    dimensions: p.dimensions ?? undefined,
    shippingClass: (p.shippingClass ?? "standard") as ShippingClass,
  };
}

export async function getShippingSettings(): Promise<ShippingSettings | null> {
  const data = await safeFetch<ShippingSettings | null>(shippingSettingsQuery, {}, null);
  if (!data) return null;
  return {
    zones: (data.zones ?? []).filter(Boolean),
    quoteThresholds: data.quoteThresholds ?? {
      perItemMaxGrams: 2000,
      perItemMaxDimensionCm: 60,
      cartTotalMaxGrams: 10000,
    },
    countryZoneMap: (data.countryZoneMap ?? []).filter((c) => c && c.countryCode),
    messaging: data.messaging,
  };
}

export async function getProductsShipping(): Promise<NormalizedProductShipping[]> {
  const data = await safeFetch<ProductShipping[]>(productsShippingQuery, {}, []);
  return data.map(normalizeShipping);
}

export async function getCheckoutProductsBySkus(skus: string[]): Promise<CheckoutProduct[]> {
  if (skus.length === 0) return [];
  return safeFetch<CheckoutProduct[]>(checkoutProductsBySkusQuery, { skus }, []);
}
