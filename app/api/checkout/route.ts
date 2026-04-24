import { NextRequest } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { getProductBySku } from "@/data/products";
import { shippingZones } from "@/data/shipping";

const cartItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().int().positive().max(99),
});

const checkoutBodySchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid cart", details: parsed.error.format() }, { status: 422 });
  }

  const { items } = parsed.data;

  // Validate each item and build line items from server-side product data
  const lineItems: {
    price_data: {
      currency: string;
      product_data: { name: string; metadata: Record<string, string> };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = getProductBySku(item.sku);
    if (!product) {
      return Response.json({ error: `Unknown product SKU: ${item.sku}` }, { status: 422 });
    }
    if (product.stock === 0) {
      return Response.json({ error: `${product.title} is out of stock` }, { status: 422 });
    }
    lineItems.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: product.title,
          metadata: { sku: product.sku, brand: product.brand },
        },
        // Stripe uses pence (integer). Price is ex-VAT; Stripe automatic_tax handles VAT.
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    });
  }

  // Build shipping options from data file
  const shippingOptions = shippingZones.map((zone) => ({
    shipping_rate_data: {
      type: "fixed_amount" as const,
      fixed_amount: { amount: Math.round(zone.price * 100), currency: "gbp" },
      display_name: zone.label,
      delivery_estimate: {
        minimum: { unit: "business_day" as const, value: 1 },
        maximum: { unit: "business_day" as const, value: parseInt(zone.estimatedDays.split("–")[1] ?? "14") },
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ["GB", "IE", "FR", "DE", "NL", "BE", "IT", "ES", "PT", "AT", "SE", "NO", "DK", "FI", "PL", "US", "CA", "AU", "NZ", "JP"] },
    shipping_options: shippingOptions,
    automatic_tax: { enabled: true },
    billing_address_collection: "required",
    payment_method_types: ["card"],
    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/cart`,
    metadata: {
      source: "wdgreenhill-web",
    },
  });

  return Response.json({ url: session.url });
}
