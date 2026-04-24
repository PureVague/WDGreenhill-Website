import { NextRequest } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid email" }, { status: 422 });
  }

  // TODO: Add to email list (Mailchimp, Resend Audiences, etc.)
  console.log("Newsletter signup:", parsed.data.email);

  return Response.json({ success: true });
}
