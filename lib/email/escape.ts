/**
 * Escape a string for interpolation into an HTML email body.
 *
 * Every user-supplied value that reaches a template goes through this. A
 * customer typing `<script>` into their name must arrive in Nigel's mail client
 * as visible text, never as live markup.
 *
 * In practice you should not need to call this by hand — `renderEmail()` in
 * ./templates/layout.ts escapes every field it is given, so templates pass raw
 * values and escaping cannot be forgotten.
 */
export const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
