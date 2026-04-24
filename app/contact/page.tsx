import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with WD Greenhill & Co — parts enquiries, technical questions, or general support. Call +44 (0)1702 546195 or use our contact form.",
};

export default function ContactPage() {
  return <ContactClient />;
}
