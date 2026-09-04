import { renderEmail, type RenderedEmail } from "./layout";

export interface BrandSuggestEmailInput {
  name: string;
  email: string;
  phone?: string;
  brand: string;
  model?: string;
  year?: number;
  description: string;
  /** Filenames and sizes, for the body — the files themselves go as attachments. */
  files: { name: string; size: number }[];
}

export function brandSuggestEmail(input: BrandSuggestEmailInput): RenderedEmail {
  const attachments = input.files.length
    ? input.files.map((f) => `${f.name} (${(f.size / 1024).toFixed(0)} KB)`).join(", ")
    : undefined;

  return renderEmail(`Brand enquiry: ${input.brand} — ${input.name}`, "Brand enquiry", [
    { label: "Name", value: input.name },
    { label: "Email", value: input.email },
    { label: "Phone", value: input.phone },
    { label: "Brand", value: input.brand },
    { label: "Model", value: input.model },
    { label: "Year", value: input.year },
    { label: "Attachments", value: attachments },
    { label: "Issue", value: input.description, long: true },
  ]);
}
