export interface ShippingZone {
  id: string;
  label: string;
  price: number; // GBP ex VAT
  estimatedDays: string;
}

export const shippingZones: ShippingZone[] = [
  { id: "uk", label: "United Kingdom", price: 7.95, estimatedDays: "1–3 working days" },
  { id: "eu", label: "European Union", price: 24.95, estimatedDays: "3–7 working days" },
  { id: "row", label: "Rest of World", price: 39.95, estimatedDays: "7–14 working days" },
];

export const FREE_SHIPPING_THRESHOLD_GBP = 150;
