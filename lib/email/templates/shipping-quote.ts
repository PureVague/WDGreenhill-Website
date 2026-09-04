import { renderEmail, type RenderedEmail } from "./layout";

export interface ShippingQuoteItem {
  sku: string;
  title: string;
  quantity: number;
  weightGrams: number;
}

export interface ShippingQuoteEmailInput {
  name: string;
  email: string;
  phone?: string;
  country: string;
  postcode: string;
  instructions?: string;
  items: ShippingQuoteItem[];
  totalWeightGrams: number;
  itemCount: number;
}

export function shippingQuoteEmail(input: ShippingQuoteEmailInput): RenderedEmail {
  const totalKg = (input.totalWeightGrams / 1000).toFixed(2);
  const plural = input.itemCount === 1 ? "" : "s";

  // The basket goes in a long block: it is a variable-length list, and a
  // pre-wrap block keeps the columns aligned in every mail client.
  const basket = input.items
    .map(
      (i) =>
        `${i.sku} · ${i.title} — ×${i.quantity} ` +
        `(${((i.weightGrams * i.quantity) / 1000).toFixed(2)}kg)`,
    )
    .join("\n");

  return renderEmail(
    `Shipping quote required: ${input.name} — ${input.itemCount} item${plural}, ${totalKg}kg`,
    "Shipping quote request",
    [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Country", value: input.country },
      { label: "Postcode", value: input.postcode },
      { label: "Total weight", value: `${totalKg}kg` },
      { label: "Items", value: `${input.itemCount} item${plural}` },
      { label: `Basket (${input.itemCount} item${plural}, ${totalKg}kg)`, value: basket, long: true },
      {
        label: "Instructions",
        value: input.instructions ?? "No special instructions.",
        long: true,
      },
    ],
  );
}
