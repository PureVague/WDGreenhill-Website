import { NextRequest } from "next/server";
import { z } from "zod";

const CURRENT_YEAR = new Date().getFullYear();
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

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

  // Validate files server-side
  const fileEntries = formData.getAll("files");
  const files       = fileEntries.filter((f): f is File => f instanceof File && f.size > 0);
  const totalBytes  = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_FILE_BYTES) {
    return Response.json({ ok: false, error: "Total file size exceeds 25 MB" }, { status: 422 });
  }

  const { name, email, phone, brand, model, year, description } = parsed.data;

  const subject  = `Brand enquiry: ${brand} — ${name}`;
  const textBody = [
    `Name:        ${name}`,
    `Email:       ${email}`,
    phone   ? `Phone:       ${phone}`  : null,
    ``,
    `Brand:       ${brand}`,
    model   ? `Model:       ${model}`  : null,
    year    ? `Year:        ${year}`   : null,
    ``,
    `Issue:\n${description}`,
    files.length > 0
      ? `\nAttachments: ${files.map((f) => `${f.name} (${(f.size / 1024).toFixed(0)} KB)`).join(", ")}`
      : null,
  ].filter((l) => l !== null).join("\n");

  // TODO: Plug in Resend or Nodemailer using EMAIL_PROVIDER env var
  // When EMAIL_PROVIDER=resend, use:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from:        process.env.EMAIL_FROM!,
  //   to:          "support@wdgreenhill.com",
  //   replyTo:     email,
  //   subject,
  //   text:        textBody,
  //   attachments: await Promise.all(files.map(async (f) => ({
  //     filename: f.name,
  //     content:  Buffer.from(await f.arrayBuffer()),
  //   }))),
  // });
  console.log("Brand suggest submission:", { subject, body: textBody.slice(0, 300) });

  return Response.json({ ok: true });
}
