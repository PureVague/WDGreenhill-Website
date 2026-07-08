/**
 * Seed the shippingSettings singleton with default rates, thresholds, messaging
 * and a full ISO 3166-1 alpha-2 country -> zone map.
 *
 * Run with:  npx tsx scripts/seed-shipping-settings.ts
 *
 * Uses createIfNotExists on the fixed id "shippingSettings" so it is safe to
 * re-run: it will NOT overwrite values Nigel has since edited in Studio. To
 * force a reset, delete the document in Studio first, then re-run.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

// ── Load .env.local ──────────────────────────────────────────────────────────
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of envFile.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
} catch {
  /* rely on existing env */
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity env vars (project id / dataset / token).");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

let keyN = 0;
const k = () => `k${(keyN++).toString(36)}`;

// ── Zone classification ──────────────────────────────────────────────────────

const UK_CODES = ["GB", "IM", "JE", "GG"];

// EU-27 + EFTA/microstates/Gibraltar treated as "Europe" for shipping.
const EUROPE_CODES = [
  // EU-27
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // Non-EU Europe
  "CH", "NO", "IS", "LI", "AD", "MC", "SM", "VA", "GI",
];

// Full ISO 3166-1 alpha-2 officially assigned codes (249).
const ALL_ISO_CODES = [
  "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ",
  "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS",
  "BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN",
  "CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE",
  "EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF",
  "GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM",
  "HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM",
  "JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC",
  "LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK",
  "ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA",
  "NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG",
  "PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW",
  "SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS",
  "ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO",
  "TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI",
  "VN","VU","WF","WS","YE","YT","ZA","ZM","ZW",
];

const ukSet = new Set(UK_CODES);
const europeSet = new Set(EUROPE_CODES);

function zoneFor(code: string): "uk" | "europe" | "row" {
  if (ukSet.has(code)) return "uk";
  if (europeSet.has(code)) return "europe";
  return "row";
}

const countryZoneMap = ALL_ISO_CODES.map((countryCode) => ({
  _key: k(),
  countryCode,
  zoneKey: zoneFor(countryCode),
}));

// ── Defaults ─────────────────────────────────────────────────────────────────

const doc = {
  _id: "shippingSettings",
  _type: "shippingSettings",
  zones: [
    { _key: k(), zoneKey: "uk", displayName: "United Kingdom", baseFeeGBP: 5.95, perKgAfterGBP: 2.5 },
    { _key: k(), zoneKey: "europe", displayName: "Europe", baseFeeGBP: 14.95, perKgAfterGBP: 6.0 },
    { _key: k(), zoneKey: "row", displayName: "Rest of World", baseFeeGBP: 24.95, perKgAfterGBP: 9.0 },
  ],
  quoteThresholds: {
    perItemMaxGrams: 2000,
    perItemMaxDimensionCm: 60,
    cartTotalMaxGrams: 10000,
  },
  messaging: {
    quoteRequiredMessage:
      "One or more items in your basket are large or heavy. To keep shipping fair, we'll send you an individual quote by email within 1 working day. Complete the enquiry form below and we'll be in touch — no payment is taken now.",
    internationalCustomsNotice:
      "Orders shipping outside the UK may be subject to import duty, VAT, or a handling fee in the destination country. These are the responsibility of the recipient and are not included in the shipping cost above. See our shipping policy for details.",
    ukVatNote: "UK prices include 20% VAT.",
  },
  countryZoneMap,
};

async function main() {
  const counts = countryZoneMap.reduce(
    (acc, c) => ((acc[c.zoneKey] = (acc[c.zoneKey] ?? 0) + 1), acc),
    {} as Record<string, number>,
  );
  console.log(
    `\nSeeding shippingSettings — countries: uk=${counts.uk} europe=${counts.europe} row=${counts.row} (total ${countryZoneMap.length}).`,
  );

  const result = await client.createIfNotExists(doc);
  const created = result._createdAt === result._updatedAt;
  console.log(
    created
      ? "Created shippingSettings singleton with defaults."
      : "shippingSettings already exists — left untouched (delete in Studio to reseed).",
  );
  console.log("Done.\n");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
