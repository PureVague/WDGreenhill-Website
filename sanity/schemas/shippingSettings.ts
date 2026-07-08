import { defineField, defineType } from "sanity";

// Singleton — only one document of this type ever exists. The single-instance
// behaviour is enforced in the Studio structure + document actions
// (see sanity.config.ts). Holds all site-wide shipping configuration.
export const shippingSettings = defineType({
  name: "shippingSettings",
  title: "Shipping Settings",
  type: "document",
  fields: [
    defineField({
      name: "zones",
      title: "Shipping zones & rates",
      type: "array",
      description: "The three fixed zones. Edit the rates; the zone keys are fixed.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "zoneKey",
              title: "Zone key",
              type: "string",
              readOnly: true,
              options: {
                list: [
                  { title: "UK", value: "uk" },
                  { title: "Europe", value: "europe" },
                  { title: "Rest of World", value: "row" },
                ],
              },
            },
            { name: "displayName", title: "Display name", type: "string" },
            {
              name: "baseFeeGBP",
              title: "Base fee (GBP, first 500g)",
              type: "number",
              validation: (R) => R.required().min(0),
            },
            {
              name: "perKgAfterGBP",
              title: "Per additional kg (GBP)",
              type: "number",
              validation: (R) => R.required().min(0),
            },
            {
              name: "freeShippingThresholdGBP",
              title: "Free shipping over (GBP, optional)",
              type: "number",
              validation: (R) => R.min(0),
            },
          ],
          preview: {
            select: { title: "displayName", base: "baseFeeGBP", perKg: "perKgAfterGBP" },
            prepare({ title, base, perKg }) {
              return {
                title: title ?? "—",
                subtitle: `£${base ?? "?"} base · £${perKg ?? "?"}/kg`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "quoteThresholds",
      title: "Ships-by-quote thresholds",
      type: "object",
      description: "Any threshold crossed forces the order to a manual shipping quote.",
      fields: [
        {
          name: "perItemMaxGrams",
          title: "Max weight per item (grams)",
          type: "number",
          initialValue: 2000,
          validation: (R) => R.required().min(0),
        },
        {
          name: "perItemMaxDimensionCm",
          title: "Max single dimension per item (cm)",
          type: "number",
          initialValue: 60,
          validation: (R) => R.required().min(0),
        },
        {
          name: "cartTotalMaxGrams",
          title: "Max total cart weight (grams)",
          type: "number",
          initialValue: 10000,
          validation: (R) => R.required().min(0),
        },
      ],
    }),
    defineField({
      name: "messaging",
      title: "Checkout messaging",
      type: "object",
      fields: [
        {
          name: "quoteRequiredMessage",
          title: "Quote-required message",
          type: "text",
          rows: 3,
          description: "Shown at checkout when a quote-only trigger fires.",
        },
        {
          name: "internationalCustomsNotice",
          title: "International customs notice",
          type: "text",
          rows: 3,
          description: "Shown at checkout for non-UK destinations.",
        },
        {
          name: "ukVatNote",
          title: "UK VAT note",
          type: "text",
          rows: 2,
          description: "Shown at checkout for UK destinations.",
        },
      ],
    }),
    defineField({
      name: "countryZoneMap",
      title: "Country → zone map",
      type: "array",
      description: "ISO 3166-1 alpha-2 country codes mapped to a shipping zone. Seeded automatically.",
      of: [
        {
          type: "object",
          fields: [
            { name: "countryCode", title: "Country code (ISO alpha-2)", type: "string" },
            {
              name: "zoneKey",
              title: "Zone",
              type: "string",
              options: {
                list: [
                  { title: "UK", value: "uk" },
                  { title: "Europe", value: "europe" },
                  { title: "Rest of World", value: "row" },
                ],
              },
            },
          ],
          preview: {
            select: { title: "countryCode", subtitle: "zoneKey" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Shipping Settings" };
    },
  },
});
