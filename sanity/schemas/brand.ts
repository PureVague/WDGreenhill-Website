import { defineField, defineType } from "sanity";

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
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
      name: "logoFile",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "isPartner",
      title: "Official partner?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "partnerLabel",
      title: "Partner label",
      type: "string",
      description: "Shown only when 'Official partner' is enabled (e.g. 'Official').",
      hidden: ({ parent }) => !parent?.isPartner,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current", media: "logoFile" },
  },
});
