import { NextRequest } from "next/server";
import { z } from "zod";

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

  const { name, email, phone, country, postcode, instructions, items, totalWeightGrams, itemCount } =
    parsed.data;

  const totalKg = (totalWeightGrams / 1000).toFixed(2);
  const subject = `Shipping quote required: ${name} — ${itemCount} item${itemCount !== 1 ? "s" : ""}, ${totalKg}kg`;

  const textBody = [
    `Name:     ${name}`,
    `Email:    ${email}`,
    phone ? `Phone:    ${phone}` : null,
    `Country:  ${country}`,
    `Postcode: ${postcode}`,
    ``,
    `Basket (${itemCount} items, ${totalKg}kg total):`,
    ...items.map(
      (i) => `  ${i.sku} · ${i.title} — ×${i.quantity} (${((i.weightGrams * i.quantity) / 1000).toFixed(2)}kg)`,
    ),
    ``,
    instructions ? `Instructions:\n${instructions}` : "No special instructions.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  // TODO: Plug in Resend or Nodemailer using EMAIL_PROVIDER env var.
  // await resend.emails.send({
  //   from:    process.env.EMAIL_FROM!,
  //   to:      "sales@wdgreenhill.com",
  //   replyTo: email,
  //   subject,
  //   text:    textBody,
  // });
  console.log("Shipping quote request:", { subject, body: textBody.slice(0, 400) });

  return Response.json({ ok: true });
}
