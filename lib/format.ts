const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
  return GBP.format(amount);
}

export function formatPriceWithVat(amount: number, vatRate = 0.2): string {
  return GBP.format(amount * (1 + vatRate));
}

export function calcVat(amount: number, vatRate = 0.2): number {
  return amount * vatRate;
}

export function calcTotal(amount: number, vatRate = 0.2): number {
  return amount * (1 + vatRate);
}
