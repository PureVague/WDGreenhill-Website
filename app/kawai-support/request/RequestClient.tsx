"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/site/SectionHeading";
import { kawaiModels } from "@/data/models";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  model: z.string().min(1, "Please select your Kawai model"),
  serialNumber: z.string().optional(),
  purchaseYear: z.string().optional(),
  problemDescription: z.string().min(20, "Please describe the issue in at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

export function RequestClient() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    await fetch("/api/support-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/kawai-support" className="hover:text-[hsl(245,85%,58%)] transition-colors">Kawai Support</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Request Support</span>
        </nav>

        <SectionHeading
          label="Official Kawai partner"
          title="Request Kawai Support"
          subtitle="Submit a support request and our team will respond within one working day. Please provide as much detail as possible to help us assist you quickly."
        />

        {submitted ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <span className="text-emerald-600 text-4xl">✓</span>
            </div>
            <h2 className="font-display font-bold text-2xl">Request Received</h2>
            <p className="text-[hsl(240,4%,46%)] max-w-md mx-auto leading-relaxed">
              Thank you. We&apos;ll review your request and respond to you at the email address provided within one working day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button variant="outline" asChild>
                <Link href="/kawai-support">Back to Kawai Support</Link>
              </Button>
              <Button asChild>
                <Link href="/shop/brand/kawai">Browse Kawai Parts</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact details */}
            <div className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white space-y-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[hsl(240,4%,56%)]">Your Details</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="req-name">Full name *</Label>
                  <Input id="req-name" {...register("name")} placeholder="John Smith" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="req-email">Email address *</Label>
                  <Input id="req-email" type="email" {...register("email")} placeholder="john@example.com" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="req-phone">Phone number (optional)</Label>
                <Input id="req-phone" type="tel" {...register("phone")} placeholder="+44 7700 900000" />
              </div>
            </div>

            {/* Piano details */}
            <div className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white space-y-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[hsl(240,4%,56%)]">Piano Details</h3>
              <div className="space-y-1.5">
                <Label htmlFor="req-model">Kawai model *</Label>
                <select
                  id="req-model"
                  {...register("model")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select your model…</option>
                  {kawaiModels.map((m) => (
                    <option key={m.slug} value={m.name}>
                      {m.series} Series — {m.name}
                    </option>
                  ))}
                </select>
                {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="req-serial">Serial number (if known)</Label>
                  <Input id="req-serial" {...register("serialNumber")} placeholder="e.g. 1234567" />
                  <p className="text-xs text-[hsl(240,4%,56%)]">Found on the underside of the piano.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="req-year">Approximate purchase year</Label>
                  <Input id="req-year" {...register("purchaseYear")} placeholder="e.g. 2018" />
                </div>
              </div>
            </div>

            {/* Problem */}
            <div className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white space-y-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[hsl(240,4%,56%)]">Problem Description</h3>
              <div className="space-y-1.5">
                <Label htmlFor="req-problem">Describe the issue *</Label>
                <Textarea
                  id="req-problem"
                  {...register("problemDescription")}
                  rows={6}
                  placeholder="Please describe the issue in as much detail as possible. When did it start? Is it intermittent? Which keys or functions are affected? Any relevant history (e.g. recent moves, liquid spills, age)?"
                />
                {errors.problemDescription && (
                  <p className="text-xs text-red-500">{errors.problemDescription.message}</p>
                )}
              </div>
              <p className="text-xs text-[hsl(240,4%,56%)]">
                You can also email photos or a short video of the issue to{" "}
                <a href="mailto:support@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
                  support@wdgreenhill.com
                </a>{" "}
                after submitting this form.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit Support Request"}
            </Button>

            <p className="text-xs text-center text-[hsl(240,4%,60%)]">
              By submitting this form you agree to us contacting you regarding your Kawai piano.
              We do not share your details with third parties.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
