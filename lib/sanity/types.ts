import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

export interface SanityProduct {
  _id: string;
  sku: string;
  title: string;
  slug: string;
  brand: string | null;          // brand slug
  brandName: string | null;
  categories: string[] | null;   // category slugs
  compatibleModels: string[] | null; // kawai model slugs
  compatibleModelsText: string[] | null;
  price: number;
  stock: number;
  featured: boolean;
  images: SanityImageSource[] | null;
  description: PortableTextBlock[] | null;
  specs: { label: string; value: string }[] | null;
  seo?: { title?: string; description?: string };
}

export interface SanityBrand {
  _id: string;
  name: string;
  slug: string;
  isPartner: boolean;
  partnerLabel: string | null;
  description: PortableTextBlock[] | null;
  logoFile: SanityImageSource | null;
}

export interface SanityCategory {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

export interface SanityKawaiModel {
  _id: string;
  name: string;
  slug: string;
  series: string;
  category: string | null;
  yearIntroduced: number | null;
  yearDiscontinued: number | null;
  status: "current" | "legacy";
  predecessor: string | null;   // slug
  successor: string | null;     // slug
  shortDescription: string | null;
  longDescription: PortableTextBlock[] | null;
  keyFeatures: string[] | null;
  cabinetFinishes: string[] | null;
}

export interface SanityManual {
  _id: string;
  brandName: string | null;
  model: string;
  type: string;
  format: string;
  price: number | null;
  stockCount: number | null;
  year: string | null;
  description: string | null;
}
