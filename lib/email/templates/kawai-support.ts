import { renderEmail, type RenderedEmail } from "./layout";

export interface KawaiSupportEmailInput {
  name: string;
  email: string;
  phone?: string;
  model: string;
  serialNumber?: string;
  purchaseYear?: string;
  problemDescription: string;
}

export function kawaiSupportEmail(input: KawaiSupportEmailInput): RenderedEmail {
  return renderEmail(
    `Kawai support: ${input.model} — ${input.name}`,
    "Kawai support request",
    [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Model", value: input.model },
      { label: "Serial no.", value: input.serialNumber },
      { label: "Purchase year", value: input.purchaseYear },
      { label: "Problem", value: input.problemDescription, long: true },
    ],
  );
}
