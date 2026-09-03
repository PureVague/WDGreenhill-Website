// Shape of a brand as the UI components consume it.
//
// The brand records themselves now live in Sanity — see lib/sanity/data.ts,
// which fetches them and maps them back into this shape so the rendering
// components did not have to change.

export interface Brand {
  slug: string;
  name: string;
  description: string;
  featured: boolean;
}
