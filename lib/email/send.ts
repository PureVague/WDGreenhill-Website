import "server-only";
import { FROM_ADDRESS, getResend } from "./resend";

export interface EmailAttachment {
  filename: string;
  content: Buffer;
}

export interface SendEmailArgs {
  /** Where the notification goes — one of EMAIL_ROUTES. */
  to: string;
  /** The customer's address, so Nigel can hit Reply and reach them. */
  replyTo: string;
  subject: string;
  html: string;
  /** Plaintext alternative. Derived from the HTML when omitted. */
  text?: string;
  attachments?: EmailAttachment[];
}

export type SendEmailResult = { ok: true; id: string } | { ok: false; error: string };

/**
 * Derive a readable plaintext alternative from an HTML body.
 *
 * Not a general HTML-to-text converter — it only has to handle the markup our
 * own templates emit: a table of rows, some <pre> blocks, and <br>s.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|tr|div|h1|h2|h3|pre)>/gi, "\n")
    .replace(/<\/td>\s*<td[^>]*>/gi, "  ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Send one admin notification.
 *
 * Every route goes through here so the failure behaviour is identical
 * everywhere: the real error is logged server-side with enough context to
 * debug, and the caller gets a generic message naming an address the customer
 * can fall back to. Resend's error text never reaches the client — it can
 * carry request details, and there is nothing a customer can do with it.
 *
 * Set EMAIL_TEST_OVERRIDE to divert every email to a single address while
 * testing; the intended recipient is preserved in the subject prefix. Leave it
 * unset in production.
 */
export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  const { to, replyTo, html, text, attachments } = args;

  const override = process.env.EMAIL_TEST_OVERRIDE?.trim();
  const recipient = override || to;
  const subject = override ? `[test → ${to}] ${args.subject}` : args.subject;

  const resend = getResend();
  if (!resend) {
    console.error("[email] RESEND_API_KEY is not set — cannot send", {
      to: recipient,
      subject,
    });
    return {
      ok: false,
      error: `Sorry — we couldn't send your message. Please try again, or email us directly at ${to}.`,
    };
  }

  if (override) {
    console.warn(`[email] EMAIL_TEST_OVERRIDE active — diverting ${to} -> ${recipient}`);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: recipient,
      replyTo,
      subject,
      html,
      text: text ?? htmlToText(html),
      ...(attachments?.length ? { attachments } : {}),
    });

    if (error || !data?.id) {
      // Log the whole thing server-side; return nothing of it to the caller.
      console.error("[email] Resend rejected the send", {
        to: recipient,
        subject,
        error,
      });
      return {
        ok: false,
        error: `Sorry — we couldn't send your message. Please try again, or email us directly at ${to}.`,
      };
    }

    console.log("[email] sent", { id: data.id, to: recipient, subject });
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email] send threw", {
      to: recipient,
      subject,
      error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    });
    return {
      ok: false,
      error: `Sorry — we couldn't send your message. Please try again, or email us directly at ${to}.`,
    };
  }
}
