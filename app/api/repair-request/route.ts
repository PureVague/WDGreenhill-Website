import { NextRequest } from "next/server";
import { z } from "zod";

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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = repairSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.format() }, { status: 422 });
  }

  const { name, email, brand, model, problemDescription } = parsed.data;
  const subject = `Repair request: ${brand} ${model} — ${name}`;

  // TODO: Send via email provider (Resend/SendGrid)
  console.log("Repair request received:", { subject, email, problemDescription: problemDescription.slice(0, 100) });

  return Response.json({ success: true });
}
