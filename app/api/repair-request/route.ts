import { NextRequest } from "next/server";
import { z } from "zod";
import { collectAttachments } from "@/lib/email/attachments";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/email/rate-limit";
import { EMAIL_ROUTES } from "@/lib/email/resend";
import { sendEmail } from "@/lib/email/send";
import { repairEmail } from "@/lib/email/templates/repair";

const repairSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(7).max(30),
    brand: z.string().min(1).max(100),
    otherBrand: z.string().max(100).optional(),
    model: z.string().min(1).max(200),
    serialNumber: z.string().max(100).optional(),
    purchaseYear: z.string().max(4).optional(),
    problemDescription: z.string().min(20).max(2000),
    consent: z.literal(true),
    fileCount: z.number().int().min(0).max(20).optional(),
  })
  .superRefine((data, ctx) => {
    // Server-side enforcement: if brand contains "Other", otherBrand must be set
    if (data.brand === "Other" && !data.otherBrand?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "otherBrand is required when brand is Other",
        path: ["otherBrand"],
      });
    }
  });

export async function POST(request: NextRequest) {
  const limit = checkRateLimit("repair-request", clientIp(request.headers));
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const collected = await collectAttachments(formData);
  if (!collected.ok) {
    return Response.json({ ok: false, error: collected.error }, { status: 422 });
  }

  // FormData carries everything as strings; coerce the two non-string fields
  // back before validating so the schema itself is unchanged.
  const text = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() !== "" ? v : undefined;
  };

  const raw = {
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    brand: text("brand"),
    otherBrand: text("otherBrand"),
    model: text("model"),
    serialNumber: text("serialNumber"),
    purchaseYear: text("purchaseYear"),
    problemDescription: text("problemDescription"),
    consent: formData.get("consent") === "true",
    fileCount: collected.files.length,
  };

  const parsed = repairSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", details: parsed.error.format() },
      { status: 422 },
    );
  }

  const email = repairEmail({
    ...parsed.data,
    attachmentCount: collected.files.length,
  });

  const sent = await sendEmail({
    to: EMAIL_ROUTES.repair,
    replyTo: parsed.data.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    attachments: collected.attachments,
  });

  if (!sent.ok) return Response.json({ ok: false, error: sent.error }, { status: 502 });
  return Response.json({ ok: true });
}
