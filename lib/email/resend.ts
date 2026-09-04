import { Resend } from "resend";

/**
 * Resend client and the routing table for admin notifications.
 *
 * The client is built lazily rather than at module scope: `new Resend()` throws
 * "Missing API key" when RESEND_API_KEY is absent, so constructing at import
 * time would crash every route that imports this file the moment the env var
 * is missing — on a fresh clone, or if the Vercel variable is ever dropped.
 * Returning null instead lets sendEmail() fail with a clean, logged error and
 * a message the customer can act on.
 */
let client: Resend | null = null;

export function getResend(): Resend | null {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  client = new Resend(apiKey);
  return client;
}

/** Verified sending domain — see the Resend dashboard. */
export const FROM_ADDRESS = "WDGreenhill & Co <noreply@wdgreenhill.com>";

/**
 * Where each form's notification goes. Reply-To is always set to the customer,
 * so replying from any of these inboxes reaches them directly.
 */
export const EMAIL_ROUTES = {
  contact: "info@wdgreenhill.com",
  repair: "support@wdgreenhill.com",
  kawaiSupport: "support@wdgreenhill.com",
  enquire: "sales@wdgreenhill.com",
  brandSuggest: "support@wdgreenhill.com",
  shippingQuote: "sales@wdgreenhill.com",
} as const;

export type EmailRoute = keyof typeof EMAIL_ROUTES;
