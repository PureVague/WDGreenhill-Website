import { groq } from "next-sanity";

// ── Shared projections ──────────────────────────────────────────────────────

const PRODUCT_FIELDS = groq`
  _id,
  sku,
  title,
  "slug": slug.current,
  "brand": brand->slug.current,
  "brandName": brand->name,
  "categories": categories[]->slug.current,
  "compatibleModels": compatibleModels[]->slug.current,
  compatibleModelsText,
  price,
  stock,
  featured,
  images,
  description,
  "specs": specifications,
  seo
`;

const KAWAI_FIELDS = groq`
  _id,
  name,
  "slug": slug.current,
  series,
  category,
  yearIntroduced,
  yearDiscontinued,
  status,
  "predecessor": predecessor->slug.current,
  "successor": successor->slug.current,
  shortDescription,
  longDescription,
  keyFeatures,
  cabinetFinishes
`;

// ── Products ────────────────────────────────────────────────────────────────

export const productsQuery = groq`
  *[_type == "product"] | order(title asc) { ${PRODUCT_FIELDS} }
`;

export const productBySkuQuery = groq`
  *[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }
`;

export const productsByBrandQuery = groq`
  *[_type == "product" && brand->slug.current == $brand] | order(title asc) { ${PRODUCT_FIELDS} }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && $category in categories[]->slug.current] | order(title asc) { ${PRODUCT_FIELDS} }
`;

export const productsByKawaiModelQuery = groq`
  *[_type == "product" && $model in compatibleModels[]->slug.current] | order(title asc) { ${PRODUCT_FIELDS} }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(title asc) { ${PRODUCT_FIELDS} }
`;

// ── Brands ──────────────────────────────────────────────────────────────────

export const allBrandsQuery = groq`
  *[_type == "brand"] | order(name asc) {
    _id, name, "slug": slug.current, isPartner, partnerLabel, description, logoFile
  }
`;

// ── Categories ──────────────────────────────────────────────────────────────

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id, name, "slug": slug.current, description, icon
  }
`;

// ── Kawai models ────────────────────────────────────────────────────────────

export const kawaiModelsQuery = groq`
  *[_type == "kawaiModel"] | order(name asc) { ${KAWAI_FIELDS} }
`;

export const kawaiModelsBySeriesQuery = groq`
  *[_type == "kawaiModel" && series == $series] | order(name asc) { ${KAWAI_FIELDS} }
`;

export const kawaiModelBySlugQuery = groq`
  *[_type == "kawaiModel" && slug.current == $slug][0] { ${KAWAI_FIELDS} }
`;

// ── Manuals ─────────────────────────────────────────────────────────────────

export const manualsQuery = groq`
  *[_type == "manual"] | order(brand->name asc, model asc) {
    _id, "brandName": brand->name, model, type, format, price, stockCount, year, description
  }
`;
