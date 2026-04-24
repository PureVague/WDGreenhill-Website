"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/site/SectionHeading";
import { brands } from "@/data/brands";
import { kawaiModels } from "@/data/models";

const BRANDS_FOR_FORM = [
  ...brands.map((b) => b.name).sort((a, b) => a.localeCompare(b)),
  "Other",
];

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(7, "Please enter a contact phone number"),
    brand: z.string().min(1, "Please select a brand"),
    otherBrand: z.string().optional(),
    model: z.string().min(1, "Please enter your model"),
    serialNumber: z.string().optional(),
    purchaseYear: z.string().optional(),
    problemDescription: z
      .string()
      .min(20, "Please describe the issue in at least 20 characters")
      .max(2000, "Maximum 2000 characters"),
    consent: z.boolean().refine((v) => v === true, {
      message: "Please confirm you are happy to be contacted",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.brand === "Other" && !data.otherBrand?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify the brand",
        path: ["otherBrand"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export function RepairRequestClient() {
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  });

  const selectedBrand = watch("brand");
  const descLength = watch("problemDescription")?.length ?? 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 25 * 1024 * 1024) {
      setUploadError("Total file size must not exceed 25 MB.");
      setUploadedFiles([]);
    } else {
      setUploadError("");
      setUploadedFiles(files);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      brand: data.brand === "Other" ? (data.otherBrand ?? "Other") : data.brand,
      fileCount: uploadedFiles.length,
    };
    await fetch("/api/repair-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 pb-24 flex items-center">
        <div className="max-w-lg mx-auto px-6 text-center w-full">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="font-display font-bold text-3xl mb-4">Request Received</h2>
          <p className="text-[hsl(240,4%,46%)] leading-relaxed mb-8">
            Thank you. We&apos;ll review your request and respond within one working day.
            If you have photos or video of the fault, please email them to{" "}
            <a href="mailto:support@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
              support@wdgreenhill.com
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/repairs">Back to Repairs</Link>
            </Button>
            <Button asChild>
              <Link href="/shop">Browse Parts</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/repairs" className="hover:text-[hsl(245,85%,58%)] transition-colors">Repairs</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Request a Repair</span>
        </nav>

        <SectionHeading
          label="All makes & models"
          title="Request a Repair"
          subtitle="Tell us about your instrument and the fault. We'll respond within one working day with a diagnosis or a request for further information."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Contact details */}
          <fieldset className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white space-y-5">
            <legend className="font-semibold text-sm uppercase tracking-wider text-[hsl(240,4%,56%)] px-1">
              Your Details
            </legend>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="rr-name">Full name *</Label>
                <Input id="rr-name" {...register("name")} placeholder="John Smith" autoComplete="name" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rr-email">Email address *</Label>
                <Input id="rr-email" type="email" {...register("email")} placeholder="john@example.com" autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rr-phone">Phone number *</Label>
              <Input id="rr-phone" type="tel" {...register("phone")} placeholder="+44 7700 900000" autoComplete="tel" />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </fieldset>

          {/* Instrument details */}
          <fieldset className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white space-y-5">
            <legend className="font-semibold text-sm uppercase tracking-wider text-[hsl(240,4%,56%)] px-1">
              Instrument Details
            </legend>

            {/* Brand selector */}
            <div className="space-y-1.5">
              <Label htmlFor="rr-brand">Brand *</Label>
              <select
                id="rr-brand"
                {...register("brand")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select brand…</option>
                {BRANDS_FOR_FORM.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.brand && <p className="text-xs text-red-500">{errors.brand.message}</p>}
            </div>

            {/* "Other" brand free text — conditional */}
            {selectedBrand === "Other" && (
              <div className="space-y-1.5">
                <Label htmlFor="rr-other-brand">Please specify brand *</Label>
                <Input id="rr-other-brand" {...register("otherBrand")} placeholder="e.g. Orla, Kimball…" />
                {errors.otherBrand && <p className="text-xs text-red-500">{errors.otherBrand.message}</p>}
              </div>
            )}

            {/* Model — Kawai dropdown or free text */}
            <div className="space-y-1.5">
              <Label htmlFor="rr-model">Model *</Label>
              {selectedBrand === "Kawai" ? (
                <select
                  id="rr-model"
                  {...register("model")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Kawai model…</option>
                  {kawaiModels.map((m) => (
                    <option key={m.slug} value={m.name}>
                      {m.series} Series — {m.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id="rr-model"
                  {...register("model")}
                  placeholder={selectedBrand ? `e.g. ${selectedBrand} model number or name` : "e.g. Model name or number"}
                />
              )}
              {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="rr-serial">Serial number <span className="text-[hsl(240,4%,60%)] font-normal">(optional)</span></Label>
                <Input id="rr-serial" {...register("serialNumber")} placeholder="e.g. 1234567" />
                <p className="text-xs text-[hsl(240,4%,56%)]">Usually found on the underside or rear panel.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rr-year">Approx. purchase year <span className="text-[hsl(240,4%,60%)] font-normal">(optional)</span></Label>
                <Input
                  id="rr-year"
                  type="number"
                  {...register("purchaseYear")}
                  placeholder="e.g. 2015"
                  min={1960}
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </fieldset>

          {/* Problem description */}
          <fieldset className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white space-y-5">
            <legend className="font-semibold text-sm uppercase tracking-wider text-[hsl(240,4%,56%)] px-1">
              Fault Description
            </legend>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="rr-problem">Describe the fault *</Label>
                <span className={`text-xs ${descLength > 1800 ? "text-amber-600" : "text-[hsl(240,4%,60%)]"}`}>
                  {descLength}/2000
                </span>
              </div>
              <Textarea
                id="rr-problem"
                {...register("problemDescription")}
                rows={7}
                placeholder="Please describe the fault in as much detail as possible. When did it start? Is it intermittent? Which keys, functions, or channels are affected? Any relevant history — liquid spill, a fall, recent transport, age of instrument?"
                maxLength={2000}
              />
              {errors.problemDescription && (
                <p className="text-xs text-red-500">{errors.problemDescription.message}</p>
              )}
            </div>

            {/* File upload */}
            <div className="space-y-1.5">
              <Label htmlFor="rr-files">Photos or video <span className="text-[hsl(240,4%,60%)] font-normal">(optional)</span></Label>
              <label
                htmlFor="rr-files"
                className="flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-dashed border-[hsl(240,6%,88%)] hover:border-[hsl(245,85%,58%)] cursor-pointer transition-colors text-center"
              >
                <Upload className="w-5 h-5 text-[hsl(240,4%,56%)]" />
                <span className="text-sm text-[hsl(240,4%,46%)]">
                  {uploadedFiles.length > 0
                    ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? "s" : ""} selected`
                    : "Click to upload images or video"}
                </span>
                <span className="text-xs text-[hsl(240,4%,60%)]">JPG, PNG, GIF, MP4 — 25 MB total max</span>
                <input
                  id="rr-files"
                  type="file"
                  multiple
                  accept="image/*,video/mp4"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
              <p className="text-xs text-[hsl(240,4%,56%)]">
                Alternatively, email files to{" "}
                <a href="mailto:support@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
                  support@wdgreenhill.com
                </a>{" "}
                after submitting this form.
              </p>
            </div>
          </fieldset>

          {/* Consent */}
          <div className="flex items-start gap-3">
            <input
              id="rr-consent"
              type="checkbox"
              {...register("consent")}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[hsl(245,85%,58%)] focus:ring-[hsl(245,85%,58%)]"
            />
            <div>
              <Label htmlFor="rr-consent" className="text-sm font-normal leading-relaxed cursor-pointer">
                I&apos;m happy to be contacted by WD Greenhill & Co about this repair enquiry. *
              </Label>
              {errors.consent && <p className="text-xs text-red-500 mt-1">{errors.consent.message}</p>}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !!uploadError}>
            {isSubmitting ? "Submitting…" : "Submit Repair Request"}
          </Button>

          <p className="text-xs text-center text-[hsl(240,4%,60%)]">
            We do not share your details with third parties. See our{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[hsl(245,85%,58%)]">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
