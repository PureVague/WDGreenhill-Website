import { NextRequest } from "next/server";
import { z } from "zod";

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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = supportSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.format() }, { status: 422 });
  }

  // TODO: Send via email provider
  console.log("Support request received:", {
    name: parsed.data.name,
    model: parsed.data.model,
    email: parsed.data.email,
  });

  return Response.json({ success: true });
}
