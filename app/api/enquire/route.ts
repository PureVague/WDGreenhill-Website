import { NextRequest } from "next/server";
import { z } from "zod";
import { getProductBySku } from "@/lib/sanity/data";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/email/rate-limit";
import { EMAIL_ROUTES } from "@/lib/email/resend";
import { sendEmail } from "@/lib/email/send";
import { enquireEmail } from "@/lib/email/templates/enquire";

const enquireSchema = z.object({
  name:         z.string().min(2).max(100),
  email:        z.string().email(),
  phone:        z.string().max(30).optional(),
  quantity:     z.number().int().min(1),
  message:      z.string().max(1000).optional(),
  sku:          z.string().min(1).max(50),
  productTitle: z.string().min(1).max(300),
  productUrl:   z.string().url(),
});

export async function POST(request: NextRequest) {
  const limit = checkRateLimit("enquire", clientIp(request.headers));
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = enquireSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", details: parsed.error.format() },
      { status: 422 },
    );
  }

  const { name, email, phone, quantity, message, sku, productTitle, productUrl } = parsed.data;

  // Server-side: confirm SKU actually exists in the product catalogue, so a
  // tampered client cannot raise an enquiry against a part we do not sell.
  const product = await getProductBySku(sku);
  if (!product) {
    return Response.json({ ok: false, error: "Unknown SKU" }, { status: 422 });
  }

  // Prefer the catalogue's own title over the client's, and include live stock
  // so Nigel can answer availability without looking it up.
  const { subject, html, text } = enquireEmail({
    name,
    email,
    phone,
    quantity,
    message,
    sku,
    productTitle: product.title || productTitle,
    productUrl,
    stock: product.stock,
  });

  const sent = await sendEmail({
    to: EMAIL_ROUTES.enquire,
    replyTo: email,
    subject,
    html,
    text,
  });

  if (!sent.ok) return Response.json({ ok: false, error: sent.error }, { status: 502 });
  return Response.json({ ok: true });
}
