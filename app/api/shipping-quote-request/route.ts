import { NextRequest } from "next/server";
import { z } from "zod";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/email/rate-limit";
import { EMAIL_ROUTES } from "@/lib/email/resend";
import { sendEmail } from "@/lib/email/send";
import { shippingQuoteEmail } from "@/lib/email/templates/shipping-quote";

const lineItemSchema = z.object({
  sku: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  weightGrams: z.number().min(0),
});

const quoteSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  country: z.string().min(2).max(2),
  postcode: z.string().min(1).max(20),
  instructions: z.string().max(1000).optional(),
  items: z.array(lineItemSchema).min(1).max(50),
  totalWeightGrams: z.number().min(0),
  itemCount: z.number().int().min(1),
});

export async function POST(request: NextRequest) {
  const limit = checkRateLimit("shipping-quote-request", clientIp(request.headers));
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", details: parsed.error.format() },
      { status: 422 },
    );
  }

  const { subject, html, text } = shippingQuoteEmail(parsed.data);
  const sent = await sendEmail({
    to: EMAIL_ROUTES.shippingQuote,
    replyTo: parsed.data.email,
    subject,
    html,
    text,
  });

  if (!sent.ok) return Response.json({ ok: false, error: sent.error }, { status: 502 });
  return Response.json({ ok: true });
}
