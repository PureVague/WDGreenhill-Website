// Pure, isomorphic shipping calculation. Safe to import on client and server —
// no Sanity/network access here; the caller supplies fetched shippingSettings.

export type ShippingClass = "standard" | "quote-only" | "digital";
export type ZoneKey = "uk" | "europe" | "row";

export interface ShippingItem {
  sku: string;
  quantity: number;
  weightGrams: number;
  dimensions?: { lengthCm?: number; widthCm?: number; heightCm?: number };
  shippingClass: ShippingClass;
}

export interface ShippingZoneRate {
  zoneKey: ZoneKey;
  displayName: string;
  baseFeeGBP: number;
  perKgAfterGBP: number;
  freeShippingThresholdGBP?: number;
}

export interface QuoteThresholds {
  perItemMaxGrams: number;
  perItemMaxDimensionCm: number;
  cartTotalMaxGrams: number;
}

export interface ShippingSettings {
  zones: ShippingZoneRate[];
  quoteThresholds: QuoteThresholds;
  countryZoneMap: Array<{ countryCode: string; zoneKey: ZoneKey }>;
  messaging?: {
    quoteRequiredMessage?: string;
    internationalCustomsNotice?: string;
    ukVatNote?: string;
  };
}

export interface ShippingCalcInput {
  items: ShippingItem[];
  destinationCountryCode: string; // ISO alpha-2
  shippingSettings: ShippingSettings;
  subtotalGBP?: number; // ex-VAT subtotal, for the free-shipping threshold
}

export type ShippingCalcResult =
  | { kind: "calculated"; zone: ZoneKey; costGBP: number; totalWeightGrams: number }
  | { kind: "free"; zone: ZoneKey; reason: "over-threshold" }
  | { kind: "quote-required"; reason: "heavy-item" | "oversized" | "cart-total-weight" | "explicit-flag" }
  | { kind: "no-shipping"; reason: "digital-only" }
  | { kind: "error"; message: string };

const DEFAULT_ZONE: ZoneKey = "row";
const FIRST_BAND_GRAMS = 500;

function maxDimension(d?: ShippingItem["dimensions"]): number {
  if (!d) return 0;
  return Math.max(d.lengthCm ?? 0, d.widthCm ?? 0, d.heightCm ?? 0);
}

export function zoneForCountry(
  countryCode: string,
  settings: ShippingSettings,
): ZoneKey {
  const code = (countryCode ?? "").toUpperCase();
  const entry = settings.countryZoneMap.find((c) => c.countryCode.toUpperCase() === code);
  return entry?.zoneKey ?? DEFAULT_ZONE;
}

export function totalCartWeight(items: ShippingItem[]): number {
  return items
    .filter((i) => i.shippingClass !== "digital")
    .reduce((sum, i) => sum + i.weightGrams * i.quantity, 0);
}

export function calculateShipping(input: ShippingCalcInput): ShippingCalcResult {
  const { items, destinationCountryCode, shippingSettings, subtotalGBP } = input;

  if (!items || items.length === 0) {
    return { kind: "error", message: "No items to ship." };
  }

  const { quoteThresholds } = shippingSettings;
  if (!quoteThresholds || !Array.isArray(shippingSettings.zones)) {
    return { kind: "error", message: "Shipping settings are not configured." };
  }

  const physicalItems = items.filter((i) => i.shippingClass !== "digital");

  // 1. All digital → nothing ships.
  if (physicalItems.length === 0) {
    return { kind: "no-shipping", reason: "digital-only" };
  }

  // 2. Any explicit quote-only item.
  if (items.some((i) => i.shippingClass === "quote-only")) {
    return { kind: "quote-required", reason: "explicit-flag" };
  }

  // 3. Per-item thresholds (weight × qty, and any single dimension).
  for (const item of physicalItems) {
    if (item.weightGrams * item.quantity > quoteThresholds.perItemMaxGrams) {
      return { kind: "quote-required", reason: "heavy-item" };
    }
    if (maxDimension(item.dimensions) > quoteThresholds.perItemMaxDimensionCm) {
      return { kind: "quote-required", reason: "oversized" };
    }
  }

  // 4–5. Total cart weight threshold.
  const totalWeightGrams = totalCartWeight(physicalItems);
  if (totalWeightGrams > quoteThresholds.cartTotalMaxGrams) {
    return { kind: "quote-required", reason: "cart-total-weight" };
  }

  // 6–7. Resolve zone + rate.
  const zone = zoneForCountry(destinationCountryCode, shippingSettings);
  const rate = shippingSettings.zones.find((z) => z.zoneKey === zone);
  if (!rate) {
    return { kind: "error", message: `No shipping rate configured for zone "${zone}".` };
  }

  // 9. Free shipping (per-zone threshold) — before charging.
  if (
    rate.freeShippingThresholdGBP != null &&
    subtotalGBP != null &&
    subtotalGBP > rate.freeShippingThresholdGBP
  ) {
    return { kind: "free", zone, reason: "over-threshold" };
  }

  // 8. Weight-banded cost. First 500g = base fee; each additional kg (rounded
  //    up) adds the per-kg rate.
  let costGBP = rate.baseFeeGBP;
  if (totalWeightGrams > FIRST_BAND_GRAMS) {
    const extraKg = Math.ceil((totalWeightGrams - FIRST_BAND_GRAMS) / 1000);
    costGBP += extraKg * rate.perKgAfterGBP;
  }
  costGBP = Math.round(costGBP * 100) / 100;

  return { kind: "calculated", zone, costGBP, totalWeightGrams };
}
