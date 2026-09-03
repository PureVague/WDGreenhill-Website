// Shape of a category as the UI components consume it.
//
// The category records themselves now live in Sanity — see lib/sanity/data.ts.

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
}
