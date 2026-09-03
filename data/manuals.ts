// Shape of a manual as the UI components consume it.
//
// The manual records themselves now live in Sanity — see lib/sanity/data.ts.

export type ManualType = "owner" | "service" | "schematic";
export type ManualFormat = "pdf" | "paper" | "both";

export interface Manual {
  id: string;
  brand: string;
  model: string;
  type: ManualType;
  format: ManualFormat;
  price: number; // GBP ex VAT
  inStock: boolean;
  year?: string;
  notes?: string;
}
