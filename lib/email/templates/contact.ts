import { renderEmail, type RenderedEmail } from "./layout";

export interface ContactEmailInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: string;
  partSku?: string;
}

export function contactEmail(input: ContactEmailInput): RenderedEmail {
  const topic = input.subject.trim() || "General enquiry";
  return renderEmail(`Contact form: ${topic} — ${input.name}`, "Contact form submission", [
    { label: "Name", value: input.name },
    { label: "Email", value: input.email },
    { label: "Subject", value: topic },
    { label: "Type", value: input.type },
    { label: "Part SKU", value: input.partSku },
    { label: "Message", value: input.message, long: true },
  ]);
}
