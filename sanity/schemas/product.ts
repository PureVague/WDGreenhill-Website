import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "sku",
      title: "SKU / Part Number",
      type: "string",
      validation: (Rule) =>
        Rule.required().custom(async (sku, context) => {
          if (!sku) return "SKU is required";
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2025-01-01" });
          const id = (document?._id ?? "").replace(/^drafts\./, "");
          const params = {
            draft: `drafts.${id}`,
            published: id,
            sku,
          };
          const count = await client.fetch(
            `count(*[_type == "product" && sku == $sku && !(_id in [$draft, $published])])`,
            params,
          );
          return count > 0 ? "Another product already uses this SKU" : true;
        }),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "compatibleModels",
      title: "Compatible Kawai models",
      type: "array",
      of: [{ type: "reference", to: [{ type: "kawaiModel" }] }],
      description: "Structured references — for Kawai parts.",
    }),
    defineField({
      name: "compatibleModelsText",
      title: "Compatible models (free text)",
      type: "array",
      of: [{ type: "string" }],
      description: "Plain model names for non-Kawai brands not yet structured.",
    }),
    defineField({
      name: "price",
      title: "Price (GBP ex. VAT)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
          lists: [{ title: "Bullet", value: "bullet" }],
        },
      ],
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "value", type: "string", title: "Value" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "shippingNotes",
      title: "Shipping notes",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "title", type: "string", title: "Title override" },
        { name: "description", type: "text", rows: 2, title: "Description override" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      sku: "sku",
      stock: "stock",
      brandName: "brand.name",
      media: "images.0",
    },
    prepare({ title, sku, stock, brandName, media }) {
      const stockLabel = typeof stock === "number" ? (stock > 0 ? `${stock} in stock` : "Out of stock") : "—";
      return {
        title: `${sku ?? "—"} · ${title ?? ""}`.trim(),
        subtitle: [brandName, stockLabel].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
