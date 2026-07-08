import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

// Singleton document types — exactly one instance, edited in place.
const singletonTypes = new Set(["shippingSettings"]);
// Actions a singleton is allowed to keep (no create / delete / duplicate).
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.list()
            .title("Site Settings")
            .items([
              S.listItem()
                .title("Shipping Settings")
                .id("shippingSettings")
                .child(
                  S.document()
                    .schemaType("shippingSettings")
                    .documentId("shippingSettings"),
                ),
            ]),
        ),
      S.divider(),
      // All normal document types, minus the singletons handled above.
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ""),
      ),
    ]);

export default defineConfig({
  name: "wdgreenhill",
  title: "WDGreenhill & Co — Content",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    // Strip create/delete/duplicate from singleton documents.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
    // Hide singletons from the global "create new document" menu.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((item) => !singletonTypes.has(item.templateId))
        : prev,
  },
});
