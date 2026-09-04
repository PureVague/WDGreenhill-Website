import { renderEmail, type RenderedEmail } from "./layout";

export interface RepairEmailInput {
  name: string;
  email: string;
  phone: string;
  /** Already resolved by the client: "Other" is replaced with otherBrand. */
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseYear?: string;
  problemDescription: string;
  attachmentCount: number;
}

export function repairEmail(input: RepairEmailInput): RenderedEmail {
  return renderEmail(
    `Repair request: ${input.brand} ${input.model} — ${input.name}`,
    "Repair request",
    [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Brand", value: input.brand },
      { label: "Model", value: input.model },
      { label: "Serial no.", value: input.serialNumber },
      { label: "Purchase year", value: input.purchaseYear },
      {
        label: "Attachments",
        value: input.attachmentCount > 0 ? `${input.attachmentCount} attached` : undefined,
      },
      { label: "Problem", value: input.problemDescription, long: true },
    ],
  );
}
