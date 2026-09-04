import { NextRequest } from "next/server";
import { z } from "zod";
import { collectAttachments } from "@/lib/email/attachments";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/email/rate-limit";
import { EMAIL_ROUTES } from "@/lib/email/resend";
import { sendEmail } from "@/lib/email/send";
import { brandSuggestEmail } from "@/lib/email/templates/brand-suggest";

const CURRENT_YEAR = new Date().getFullYear();

const bodySchema = z.object({
  name:        z.string().min(2).max(100),
  email:       z.string().email(),
  phone:       z.string().max(30).optional(),
  brand:       z.string().min(1).max(100),
  model:       z.string().max(200).optional(),
  year:        z.coerce.number().int().min(1950).max(CURRENT_YEAR).optional(),
  description: z.string().min(10).max(1500),
});

export async function POST(request: NextRequest) {
  const limit = checkRateLimit("brand-suggest", clientIp(request.headers));
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const raw = {
    name:        formData.get("name"),
    email:       formData.get("email"),
    phone:       formData.get("phone") || undefined,
    brand:       formData.get("brand"),
    model:       formData.get("model") || undefined,
    year:        formData.get("year")  || undefined,
    description: formData.get("description"),
  };

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", details: parsed.error.format() },
      { status: 422 },
    );
  }

  const collected = await collectAttachments(formData);
  if (!collected.ok) {
    return Response.json({ ok: false, error: collected.error }, { status: 422 });
  }

  const { subject, html, text } = brandSuggestEmail({
    ...parsed.data,
    files: collected.files,
  });

  const sent = await sendEmail({
    to: EMAIL_ROUTES.brandSuggest,
    replyTo: parsed.data.email,
    subject,
    html,
    text,
    attachments: collected.attachments,
  });

  if (!sent.ok) return Response.json({ ok: false, error: sent.error }, { status: 502 });
  return Response.json({ ok: true });
}
