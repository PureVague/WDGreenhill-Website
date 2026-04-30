/**
 * Custom event tracking via Vercel Analytics.
 *
 * Import `track` from "@vercel/analytics" and call it from client components
 * on meaningful user actions. Events only fire in production — no data is sent
 * in development or preview deployments.
 *
 * Rules:
 *  - Never include PII (email, name, phone, full address).
 *  - Use aggregable properties only (brand, model name, item count, totals).
 *  - Keep event names human-readable and consistent (sentence case, past tense).
 *
 * Usage pattern:
 *
 *   import { track } from "@vercel/analytics";
 *
 *   // Repair request form — fire on successful submission:
 *   // track("Repair request submitted", { brand: "Kawai", model: "CA901" });
 *
 *   // Parts enquiry modal — fire on successful submission:
 *   // track("Parts enquiry submitted", { sku: "KEP-068", brand: "Kawai" });
 *
 *   // Brand suggest modal — fire on successful submission:
 *   // track("Brand enquiry submitted", { brand: "Solina" });
 *
 *   // Cart — fire when the user clicks "Proceed to Checkout":
 *   // track("Cart checkout started", { itemCount: 3, totalGBP: 124.95 });
 *
 *   // Checkout success page — fire on mount (after Stripe redirect):
 *   // track("Stripe checkout completed", { itemCount: 3, totalGBP: 124.95 });
 *
 * Do not wire up any of the above calls yet. This file exists only to
 * document the pattern so it can be dropped in place once analytics data
 * is flowing and we know what's worth measuring.
 */

export {};
