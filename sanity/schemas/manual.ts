import { defineField, defineType } from "sanity";

export const manual = defineType({
  name: "manual",
  title: "Manual",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "model",
      title: "Model",
      type: "string",
      description: "The specific model this manual is for, e.g. 'B3'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Owner's Manual", value: "Owner's Manual" },
          { title: "Service Manual", value: "Service Manual" },
          { title: "Schematic", value: "Schematic" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "PDF", value: "PDF" },
          { title: "Paper", value: "Paper" },
          { title: "Both", value: "Both" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (GBP ex. VAT)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "pdfFile",
      title: "PDF file",
      type: "file",
      options: { accept: ".pdf" },
      description: "Upload only when the format includes PDF.",
      hidden: ({ parent }) => parent?.format === "Paper",
    }),
    defineField({
      name: "stockCount",
      title: "Stock count (paper copies)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "year",
      title: "Year / era",
      type: "string",
      description: "Optional, e.g. '1955–1974'.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { model: "model", type: "type", brandName: "brand.name" },
    prepare({ model, type, brandName }) {
      return {
        title: `${brandName ?? "—"} ${model ?? ""}`.trim(),
        subtitle: type,
      };
    },
  },
});
