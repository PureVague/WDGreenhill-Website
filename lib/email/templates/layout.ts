import { escapeHtml } from "../escape";

/**
 * Shared renderer for admin notification emails.
 *
 * Templates hand over raw values and this escapes every one of them, so the
 * "escape all user content" rule is structural rather than something each
 * template has to remember. Nothing here interpolates a caller string into
 * markup unescaped.
 *
 * Deliberately plain: inline styles only, no external CSS, no images, no web
 * fonts. This has to render in Outlook, Apple Mail and a phone lock screen.
 */

export interface Field {
  label: string;
  /** Rendered only when non-empty — null/undefined rows are dropped. */
  value: string | number | null | undefined;
  /**
   * Long free text (a problem description, a message). Rendered in a
   * pre-wrap block so line breaks survive and a long unbroken string cannot
   * stretch the table.
   */
  long?: boolean;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const FOOTER = "Sent from the WDGreenhill website. Reply directly to respond to the customer.";

const FONT = "Arial, Helvetica, sans-serif";

/** Longest subject we will emit. Mail clients truncate well before this. */
const MAX_SUBJECT = 180;

/**
 * Clean a subject line.
 *
 * Subjects are a header, not a body: a newline in a customer's name has no
 * business there, and control characters are never wanted. Resend sends over
 * its JSON API rather than raw SMTP so this is not the last line of defence
 * against header injection, but a subject should be one tidy line regardless.
 * Fields feeding subjects can be long — productTitle alone allows 300
 * characters — so clamp the result too.
 */
function cleanSubject(raw: string): string {
  const flat = raw
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return flat.length > MAX_SUBJECT ? `${flat.slice(0, MAX_SUBJECT - 1).trimEnd()}…` : flat;
}

function present(f: Field): f is Field & { value: string | number } {
  if (f.value === null || f.value === undefined) return false;
  return String(f.value).trim() !== "";
}

function longBlock(value: string): string {
  return (
    `<pre style="white-space: pre-wrap; word-break: break-word; margin: 0; ` +
    `font-family: ${FONT}; font-size: 14px; line-height: 1.5; color: #111;">` +
    `${escapeHtml(value)}</pre>`
  );
}

/**
 * Build the HTML and plaintext bodies for a notification.
 *
 * `heading` is the in-body title. Short fields become a two-column table;
 * fields marked `long` are rendered underneath as full-width labelled blocks,
 * which reads far better than cramming a paragraph into a table cell.
 */
export function renderEmail(subject: string, heading: string, fields: Field[]): RenderedEmail {
  const live = fields.filter(present);
  const short = live.filter((f) => !f.long);
  const long = live.filter((f) => f.long);

  const rows = short
    .map(
      (f) =>
        `<tr>` +
        `<td style="padding: 6px 16px 6px 0; vertical-align: top; color: #555; ` +
        `font-size: 14px; white-space: nowrap;">${escapeHtml(f.label)}</td>` +
        `<td style="padding: 6px 0; vertical-align: top; color: #111; font-size: 14px; ` +
        `word-break: break-word;">${escapeHtml(String(f.value))}</td>` +
        `</tr>`,
    )
    .join("");

  const longSections = long
    .map(
      (f) =>
        `<div style="margin-top: 20px;">` +
        `<div style="color: #555; font-size: 13px; text-transform: uppercase; ` +
        `letter-spacing: 0.04em; margin-bottom: 6px;">${escapeHtml(f.label)}</div>` +
        `<div style="border-left: 3px solid #ddd; padding-left: 12px;">` +
        `${longBlock(String(f.value))}</div>` +
        `</div>`,
    )
    .join("");

  const html =
    `<div style="font-family: ${FONT}; font-size: 14px; line-height: 1.5; color: #111; ` +
    `max-width: 640px; padding: 8px;">` +
    `<h1 style="font-size: 18px; margin: 0 0 16px; color: #111;">${escapeHtml(heading)}</h1>` +
    (rows ? `<table cellpadding="0" cellspacing="0" border="0">${rows}</table>` : "") +
    longSections +
    `<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 28px 0 12px;">` +
    `<p style="font-size: 12px; color: #777; margin: 0;">${escapeHtml(FOOTER)}</p>` +
    `</div>`;

  const text = [
    heading,
    "",
    ...short.map((f) => `${f.label}: ${f.value}`),
    ...long.flatMap((f) => ["", `${f.label}:`, String(f.value)]),
    "",
    "—",
    FOOTER,
  ].join("\n");

  return { subject: cleanSubject(subject), html, text };
}
