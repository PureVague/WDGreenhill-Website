import "server-only";
import type { EmailAttachment } from "./send";

/**
 * Total attachment payload we will accept on a form.
 *
 * Resend's own ceiling is higher, but large emails are fragile — they bounce
 * off recipient-side limits and sit in queues. 25 MB matches what both upload
 * forms already tell the customer client-side.
 */
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

export interface CollectedAttachments {
  /** Names and sizes, for listing in the email body. */
  files: { name: string; size: number }[];
  /** The payload for Resend. */
  attachments: EmailAttachment[];
  totalBytes: number;
}

export type CollectAttachmentsResult =
  | ({ ok: true } & CollectedAttachments)
  | { ok: false; error: string };

/**
 * Read uploaded files out of a FormData body.
 *
 * Size is checked before anything is buffered into memory, so an oversized
 * submission is rejected without reading it. Empty file inputs (a browser
 * sending a zero-byte placeholder when nothing was chosen) are dropped.
 */
export async function collectAttachments(
  formData: FormData,
  field = "files",
): Promise<CollectAttachmentsResult> {
  const files = formData
    .getAll(field)
    .filter((f): f is File => f instanceof File && f.size > 0);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_ATTACHMENT_BYTES) {
    const mb = (totalBytes / 1024 / 1024).toFixed(1);
    return {
      ok: false,
      error:
        `Your files total ${mb} MB, which is over the 25 MB limit. Please compress them ` +
        `or send fewer, and email any extras to support@wdgreenhill.com.`,
    };
  }

  const attachments: EmailAttachment[] = await Promise.all(
    files.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()),
    })),
  );

  return {
    ok: true,
    files: files.map((f) => ({ name: f.name, size: f.size })),
    attachments,
    totalBytes,
  };
}
