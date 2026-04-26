"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/site/SectionHeading";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Please enter a subject"),
  message: z.string().min(10, "Please enter your message"),
});

type FormValues = z.infer<typeof schema>;

const CONTACT_EMAILS = [
  { label: "General", email: "info@wdgreenhill.com" },
  { label: "Sales", email: "sales@wdgreenhill.com" },
  { label: "Customer Support", email: "support@wdgreenhill.com" },
  { label: "Enquiries", email: "enquiries@wdgreenhill.com" },
  { label: "Webmaster", email: "webmaster@wdgreenhill.com" },
];

export function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
    reset();
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Contact</span>
        </nav>

        <SectionHeading
          label="Get in touch"
          title="Contact Us"
          subtitle="We&apos;re happy to help with parts enquiries, technical questions, or anything else. We aim to respond to all enquiries within one working day."
        />

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="space-y-10">
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-5">Find Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(245,85%,58%)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[hsl(245,85%,58%)]" />
                  </div>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-[hsl(240,4%,46%)] mt-0.5">
                      138 Ashingdon Road<br />
                      Rochford, Essex<br />
                      SS4 1TA, United Kingdom
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(245,85%,58%)]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[hsl(245,85%,58%)]" />
                  </div>
                  <div>
                    <p className="font-semibold">Telephone</p>
                    <a href="tel:+441702546195" className="text-sm text-[hsl(245,85%,58%)] hover:underline block mt-0.5">+44 (0)1702 546195</a>
                    <a href="tel:+447860890755" className="text-sm text-[hsl(245,85%,58%)] hover:underline block">07860 890755</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(245,85%,58%)]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[hsl(245,85%,58%)]" />
                  </div>
                  <div>
                    <p className="font-semibold">Opening Hours</p>
                    {/* TODO: confirm with client */}
                    <p className="text-sm text-[hsl(240,4%,46%)] mt-0.5">
                      Monday–Friday: 9:00am–5:00pm<br />
                      <span className="text-[hsl(240,4%,60%)] text-xs">Please confirm hours before visiting</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-5">Email Addresses</h3>
              <div className="space-y-3">
                {CONTACT_EMAILS.map(({ label, email }) => (
                  <div key={email} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(245,85%,58%)]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[hsl(245,85%,58%)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[hsl(240,4%,56%)]">{label}</p>
                      <a href={`mailto:${email}`} className="text-sm text-[hsl(245,85%,58%)] hover:underline underline-offset-2">
                        {email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-5">Location</h3>
              <div className="rounded-xl overflow-hidden border border-[hsl(240,6%,88%)] h-64">
                <iframe
                  title="WD Greenhill & Co location — 138 Ashingdon Road, Rochford"
                  src="https://www.google.com/maps?q=138+Ashingdon+Road,+Rochford,+Essex+SS4+1TA,+UK&output=embed"
                  width="100%"
                  height="256"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Map showing WD Greenhill & Co location in Rochford, Essex"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/138+Ashingdon+Road,+Rochford,+Essex+SS4+1TA,+UK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[hsl(245,85%,58%)] hover:underline mt-1 inline-block"
              >
                View larger map ↗
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h3 className="font-display font-bold text-2xl mb-6">Send Us a Message</h3>
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <span className="text-emerald-600 text-3xl">✓</span>
                </div>
                <p className="font-semibold text-lg">Message sent.</p>
                <p className="text-sm text-[hsl(240,4%,46%)]">
                  Thank you for contacting WDGreenhill. We&apos;ll reply within one working day.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="con-name">Your name *</Label>
                    <Input id="con-name" {...register("name")} placeholder="John Smith" />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="con-email">Email address *</Label>
                    <Input id="con-email" type="email" {...register("email")} placeholder="john@example.com" />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="con-subject">Subject *</Label>
                  <Input id="con-subject" {...register("subject")} placeholder="e.g. Parts enquiry — Kawai CN3" />
                  {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="con-message">Message *</Label>
                  <Textarea id="con-message" {...register("message")} rows={7} placeholder="Please include your model number and any relevant part numbers where applicable." />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
