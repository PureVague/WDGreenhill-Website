import { NextRequest } from "next/server";
import { z } from "zod";
import { products } from "@/data/products";

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

  // Server-side: confirm SKU actually exists in the product catalogue
  const product = products.find((p) => p.sku === sku);
  if (!product) {
    return Response.json({ ok: false, error: "Unknown SKU" }, { status: 422 });
  }

  const subject  = `Parts enquiry: ${productTitle} — ${name}`;
  const textBody = [
    `Name:     ${name}`,
    `Email:    ${email}`,
    phone ? `Phone:    ${phone}` : null,
    `Quantity: ${quantity}`,
    ``,
    `SKU:      ${sku}`,
    `Part:     ${productTitle}`,
    `URL:      ${productUrl}`,
    ``,
    message ? `Message:\n${message}` : "No message provided.",
  ].filter((l) => l !== null).join("\n");

  // TODO: Plug in Resend or Nodemailer using EMAIL_PROVIDER env var
  // When EMAIL_PROVIDER=resend, use:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from:     process.env.EMAIL_FROM!,
  //   to:       "sales@wdgreenhill.com",
  //   replyTo:  email,
  //   subject,
  //   text:     textBody,
  // });
  console.log("Enquiry submission:", { subject, body: textBody.slice(0, 200) });

  return Response.json({ ok: true });
}
