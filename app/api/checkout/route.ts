import { NextRequest } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { getCheckoutProductsBySkus, getShippingSettings } from "@/lib/sanity/data";
import { calculateShipping, type ShippingItem, type ZoneKey } from "@/lib/shipping/calculate";
import { STRIPE_ALLOWED_COUNTRIES } from "@/lib/shipping/countries";

const cartItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().int().positive().max(99),
});

const checkoutBodySchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Representative country per zone (address is unknown at session creation, so
// we offer one weight-based option per zone and let Stripe collect the address).
const ZONE_REP_COUNTRY: Record<ZoneKey, string> = { uk: "GB", europe: "DE", row: "US" };
const ZONE_DELIVERY_DAYS: Record<ZoneKey, [number, number]> = {
  uk: [1, 3],
  europe: [3, 7],
  row: [7, 14],
};

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

  // Refetch authoritative product data from Sanity — never trust client prices/weights.
  const products = await getCheckoutProductsBySkus(items.map((i) => i.sku));
  const bySku = new Map(products.map((p) => [p.sku, p]));

  const lineItems: {
    price_data: {
      currency: string;
      product_data: { name: string; metadata: Record<string, string> };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];
  const shippingItems: ShippingItem[] = [];
  let subtotalGBP = 0;

  for (const item of items) {
    const product = bySku.get(item.sku);
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
          metadata: { sku: product.sku, brand: product.brand ?? "" },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    });
    subtotalGBP += product.price * item.quantity;
    shippingItems.push({
      sku: product.sku,
      quantity: item.quantity,
      weightGrams: typeof product.weightGrams === "number" ? product.weightGrams : 10,
      dimensions: product.dimensions ?? undefined,
      shippingClass: product.shippingClass ?? "standard",
    });
  }

  const shippingSettings = await getShippingSettings();
  if (!shippingSettings) {
    return Response.json({ error: "Shipping is not configured. Please contact us." }, { status: 500 });
  }

  // Country-independent determination (quote-only / digital) — check once.
  const check = calculateShipping({
    items: shippingItems,
    destinationCountryCode: "GB",
    shippingSettings,
    subtotalGBP,
  });

  if (check.kind === "quote-required") {
    return Response.json(
      { error: "This order needs a shipping quote.", quoteRequired: true, reason: check.reason },
      { status: 409 },
    );
  }

  const digitalOnly = check.kind === "no-shipping";

  // Build one weight-based shipping option per configured zone.
  const shippingOptions = digitalOnly
    ? []
    : shippingSettings.zones
        .map((zone) => {
          const r = calculateShipping({
            items: shippingItems,
            destinationCountryCode: ZONE_REP_COUNTRY[zone.zoneKey] ?? "US",
            shippingSettings,
            subtotalGBP,
          });
          const amountGBP = r.kind === "free" ? 0 : r.kind === "calculated" ? r.costGBP : null;
          if (amountGBP == null) return null;
          const [min, max] = ZONE_DELIVERY_DAYS[zone.zoneKey] ?? [3, 14];
          return {
            shipping_rate_data: {
              type: "fixed_amount" as const,
              fixed_amount: { amount: Math.round(amountGBP * 100), currency: "gbp" },
              display_name: zone.displayName,
              delivery_estimate: {
                minimum: { unit: "business_day" as const, value: min },
                maximum: { unit: "business_day" as const, value: max },
              },
            },
          };
        })
        .filter((o): o is NonNullable<typeof o> => o !== null);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    ...(digitalOnly
      ? {}
      : {
          shipping_address_collection: { allowed_countries: STRIPE_ALLOWED_COUNTRIES as never },
          shipping_options: shippingOptions,
        }),
    automatic_tax: { enabled: true },
    billing_address_collection: "required",
    payment_method_types: ["card"],
    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/cart`,
    metadata: { source: "wdgreenhill-web" },
  });

  return Response.json({ url: session.url });
}
