import { defineField, defineType } from "sanity";

const SERIES = ["ES", "KDP", "CN", "CA", "CL", "CS", "MP", "VPC", "NV", "DG", "K", "Other"];
const CATEGORIES = [
  "portable",
  "compact-home",
  "mid-home",
  "concert-artist",
  "stage",
  "controller",
  "hybrid",
  "anytime-upright",
  "acoustic-with-digital",
];

export const kawaiModel = defineType({
  name: "kawaiModel",
  title: "Kawai Model",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "CA901"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "string",
      options: { list: SERIES.map((s) => ({ title: s, value: s })) },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES.map((c) => ({ title: c, value: c })) },
    }),
    defineField({
      name: "yearIntroduced",
      title: "Year introduced",
      type: "number",
    }),
    defineField({
      name: "yearDiscontinued",
      title: "Year discontinued",
      type: "number",
      description: "Leave empty if still in production.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Current", value: "current" },
          { title: "Legacy", value: "legacy" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "predecessor",
      title: "Predecessor",
      type: "reference",
      to: [{ type: "kawaiModel" }],
      description: "The model this one replaced.",
    }),
    defineField({
      name: "successor",
      title: "Successor",
      type: "reference",
      to: [{ type: "kawaiModel" }],
      description: "The model that replaced this one.",
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "string",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "longDescription",
      title: "Long description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "keyFeatures",
      title: "Key features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "cabinetFinishes",
      title: "Cabinet finishes",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "name", series: "series", status: "status" },
    prepare({ title, series, status }) {
      return {
        title,
        subtitle: [series, status].filter(Boolean).join(" · "),
      };
    },
  },
});
