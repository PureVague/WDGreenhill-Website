import { renderEmail, type RenderedEmail } from "./layout";

export interface EnquireEmailInput {
  name: string;
  email: string;
  phone?: string;
  quantity: number;
  message?: string;
  sku: string;
  productTitle: string;
  productUrl: string;
  /** Live stock at the moment of enquiry, from the server-side SKU lookup. */
  stock?: number;
}

export function enquireEmail(input: EnquireEmailInput): RenderedEmail {
  return renderEmail(
    `Parts enquiry: ${input.productTitle} — ${input.name}`,
    "Parts enquiry",
    [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Quantity", value: input.quantity },
      { label: "SKU", value: input.sku },
      { label: "Part", value: input.productTitle },
      { label: "In stock", value: input.stock },
      { label: "URL", value: input.productUrl },
      { label: "Message", value: input.message ?? "No message provided.", long: true },
    ],
  );
}
