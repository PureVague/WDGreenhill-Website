// Shape of a product as the UI components consume it.
//
// The product records themselves now live in Sanity — see lib/sanity/data.ts,
// which fetches them and maps them back into this shape.

export interface Product {
  sku: string;
  title: string;
  slug: string;
  brand: string;
  categories: string[];
  compatibleModels: string[];
  price: number; // GBP ex VAT
  stock: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  featured: boolean;
}
