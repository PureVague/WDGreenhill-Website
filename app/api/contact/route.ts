import { NextRequest } from "next/server";
import { z } from "zod";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/email/rate-limit";
import { EMAIL_ROUTES } from "@/lib/email/resend";
import { sendEmail } from "@/lib/email/send";
import { contactEmail } from "@/lib/email/templates/contact";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  type: z.string().optional(),
  partSku: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const limit = checkRateLimit("contact", clientIp(request.headers));
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", details: parsed.error.format() },
      { status: 422 },
    );
  }

  const { subject, html, text } = contactEmail(parsed.data);
  const sent = await sendEmail({
    to: EMAIL_ROUTES.contact,
    replyTo: parsed.data.email,
    subject,
    html,
    text,
  });

  if (!sent.ok) return Response.json({ ok: false, error: sent.error }, { status: 502 });
  return Response.json({ ok: true });
}
