import { NextRequest } from "next/server";
import { z } from "zod";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/email/rate-limit";
import { EMAIL_ROUTES } from "@/lib/email/resend";
import { sendEmail } from "@/lib/email/send";
import { kawaiSupportEmail } from "@/lib/email/templates/kawai-support";

const supportSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  model: z.string().min(1),
  serialNumber: z.string().optional(),
  purchaseYear: z.string().optional(),
  problemDescription: z.string().min(20).max(5000),
});

export async function POST(request: NextRequest) {
  const limit = checkRateLimit("support-request", clientIp(request.headers));
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = supportSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", details: parsed.error.format() },
      { status: 422 },
    );
  }

  const { subject, html, text } = kawaiSupportEmail(parsed.data);
  const sent = await sendEmail({
    to: EMAIL_ROUTES.kawaiSupport,
    replyTo: parsed.data.email,
    subject,
    html,
    text,
  });

  if (!sent.ok) return Response.json({ ok: false, error: sent.error }, { status: 502 });
  return Response.json({ ok: true });
}
