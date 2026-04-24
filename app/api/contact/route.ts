import { NextRequest } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  type: z.string().optional(),
  partSku: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.format() }, { status: 422 });
  }

  const { name, email, subject, message } = parsed.data;

  // TODO: Plug in Resend or Nodemailer using EMAIL_PROVIDER env var
  console.log("Contact form submission:", { name, email, subject, message: message.slice(0, 100) });

  // When EMAIL_PROVIDER=resend, use:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: process.env.EMAIL_FROM!, to: process.env.EMAIL_TO!, subject, html: `...` });

  return Response.json({ success: true });
}
