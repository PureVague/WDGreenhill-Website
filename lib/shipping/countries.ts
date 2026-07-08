// Country lists for the checkout / cart country selectors. Codes are ISO
// 3166-1 alpha-2 and align with the seeded countryZoneMap in Sanity.

export interface Country {
  code: string;
  name: string;
}

// The 20 most common destinations, shown first / by default.
export const POPULAR_COUNTRIES: Country[] = [
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "PT", name: "Portugal" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "CH", name: "Switzerland" },
  { code: "PL", name: "Poland" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
];

// Fuller list (popular + the rest of the EU/EFTA + other common markets),
// revealed when the user chooses "See all countries".
export const ALL_COUNTRIES: Country[] = [
  ...POPULAR_COUNTRIES,
  { code: "AT", name: "Austria" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "LV", name: "Latvia" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "GI", name: "Gibraltar" },
  { code: "JE", name: "Jersey" },
  { code: "GG", name: "Guernsey" },
  { code: "IM", name: "Isle of Man" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "BR", name: "Brazil" },
  { code: "CN", name: "China" },
  { code: "HK", name: "Hong Kong" },
  { code: "IN", name: "India" },
  { code: "IL", name: "Israel" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "MY", name: "Malaysia" },
  { code: "QA", name: "Qatar" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "ZA", name: "South Africa" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Türkiye" },
  { code: "TW", name: "Taiwan" },
];

// Countries WDGreenhill can ship to (used for Stripe's allowed_countries).
// Curated — UK + EU-27 + EFTA + major RoW markets. Excludes microstates and
// sub-jurisdictions Stripe doesn't accept as shipping countries.
export const STRIPE_ALLOWED_COUNTRIES: string[] = [
  // UK
  "GB",
  // EU-27
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EFTA
  "CH", "NO", "IS", "LI",
  // Major RoW
  "US", "CA", "AU", "NZ", "JP", "SG", "HK", "AE", "BR", "CN", "IN", "IL",
  "KR", "MX", "MY", "QA", "SA", "ZA", "TH", "TR", "TW",
];
