"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, Paperclip, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CURRENT_YEAR = new Date().getFullYear();
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

const LS_NAME  = "wdg_contact_name";
const LS_EMAIL = "wdg_contact_email";

function getSaved(key: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

const schema = z.object({
  name:        z.string().min(2, "Please enter your name"),
  email:       z.string().email("Please enter a valid email address"),
  phone:       z.string().optional(),
  brand:       z.string().min(1, "Please enter the brand name"),
  model:       z.string().optional(),
  year:        z.preprocess(
                 (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
                 z.number().int()
                   .min(1950, "Year must be 1950 or later")
                   .max(CURRENT_YEAR, "Year can't be in the future")
                   .optional()
               ),
  description: z.string()
                 .min(10, "Please describe the issue (at least 10 characters)")
                 .max(1500, "Description must be under 1500 characters"),
  consent:     z.boolean().refine((v) => v === true, {
                 message: "Please confirm you're happy to be contacted",
               }),
});

type FormValues = z.infer<typeof schema>;

export interface BrandSuggestModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

export function BrandSuggestModal({ isOpen, onClose }: BrandSuggestModalProps) {
  const [submitted,   setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [files,       setFiles]       = useState<File[]>([]);
  const [fileError,   setFileError]   = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name:    getSaved(LS_NAME),
      email:   getSaved(LS_EMAIL),
      consent: false,
    },
  });

  // Auto-close 3 s after success
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
    return () => clearTimeout(t);
  }, [submitted, onClose]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSubmitError(null);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selected  = Array.from(e.target.files ?? []);
    const totalSize = selected.reduce((s, f) => s + f.size, 0);
    if (totalSize > MAX_FILE_BYTES) {
      setFileError("Total file size must be under 25 MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFiles(selected);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // Reset the native input so re-selecting the same file triggers onChange
      if (next.length === 0 && fileInputRef.current) fileInputRef.current.value = "";
      return next;
    });
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append("name",        data.name);
      fd.append("email",       data.email);
      if (data.phone)           fd.append("phone",  data.phone);
      fd.append("brand",       data.brand);
      if (data.model)           fd.append("model",  data.model);
      if (data.year != null)    fd.append("year",   String(data.year));
      fd.append("description", data.description);
      files.forEach((f) => fd.append("files", f));

      const res  = await fetch("/api/brand-suggest", { method: "POST", body: fd });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) throw new Error(json.error ?? "Server error");

      localStorage.setItem(LS_NAME,  data.name);
      localStorage.setItem(LS_EMAIL, data.email);

      reset({
        name:        data.name,
        email:       data.email,
        phone:       "",
        brand:       "",
        model:       "",
        year:        undefined,
        description: "",
        consent:     false,
      });
      setFiles([]);
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong. Please try again, or email support@wdgreenhill.com directly.",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] z-[60] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {submitted ? "Enquiry sent" : "Don’t see your brand? Tell us about it."}
          </DialogTitle>
          {!submitted && (
            <DialogDescription>
              With 45 years in the industry we&apos;ve worked on most makes &mdash; even the obscure
              ones. Send us the details and we&apos;ll get back to you.
            </DialogDescription>
          )}
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-4 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-[hsl(240,10%,4%)]">
                Thanks &mdash; we&apos;ll review and get back to you within 1 working day.
              </p>
              <p className="text-sm text-[hsl(240,4%,56%)] mt-1">
                This window will close automatically.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSubmitted(false); onClose(); }}
            >
              Close now
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1" noValidate>
            {submitError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bs-name">Name <span aria-hidden="true">*</span></Label>
                <Input id="bs-name" {...register("name")} placeholder="Jane Smith" autoComplete="name" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bs-email">Email <span aria-hidden="true">*</span></Label>
                <Input id="bs-email" type="email" {...register("email")} placeholder="jane@example.com" autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="bs-phone">
                Phone{" "}
                <span className="text-[hsl(240,4%,56%)] font-normal text-xs">(optional)</span>
              </Label>
              <Input id="bs-phone" type="tel" {...register("phone")} placeholder="+44 7700 000000" autoComplete="tel" />
            </div>

            {/* Brand + Model */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bs-brand">Brand name <span aria-hidden="true">*</span></Label>
                <Input id="bs-brand" {...register("brand")} placeholder="e.g. Solina, Logan, Eko" />
                {errors.brand && <p className="text-xs text-red-500">{errors.brand.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bs-model">
                  Model{" "}
                  <span className="text-[hsl(240,4%,56%)] font-normal text-xs">(optional)</span>
                </Label>
                <Input id="bs-model" {...register("model")} placeholder="If known" />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <Label htmlFor="bs-year">
                Approximate year{" "}
                <span className="text-[hsl(240,4%,56%)] font-normal text-xs">(optional)</span>
              </Label>
              <Input
                id="bs-year"
                type="number"
                min={1950}
                max={CURRENT_YEAR}
                {...register("year")}
                placeholder="e.g. 1982"
              />
              {errors.year && (
                <p className="text-xs text-red-500">{errors.year.message as string}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="bs-description">
                Describe the issue <span aria-hidden="true">*</span>
              </Label>
              <Textarea
                id="bs-description"
                {...register("description")}
                rows={4}
                maxLength={1500}
                placeholder="What fault or problem are you experiencing? Any error messages, unusual sounds, or behaviour?"
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* File upload */}
            <div className="space-y-1.5">
              <Label htmlFor="bs-files">
                Photos / video{" "}
                <span className="text-[hsl(240,4%,56%)] font-normal text-xs">
                  (optional &mdash; max 25 MB total)
                </span>
              </Label>
              {/* Visible label acts as the button */}
              <label
                htmlFor="bs-files"
                className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[hsl(240,6%,88%)] px-4 py-3 text-sm text-[hsl(240,4%,56%)] hover:border-[hsl(245,85%,58%)] hover:text-[hsl(245,85%,58%)] transition-colors"
              >
                <Paperclip className="w-4 h-4 flex-shrink-0" />
                {files.length === 0
                  ? "Attach images or video…"
                  : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
              </label>
              <input
                id="bs-files"
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4"
                multiple
                className="sr-only"
                onChange={handleFileChange}
              />
              {fileError && <p className="text-xs text-red-500">{fileError}</p>}
              {files.length > 0 && (
                <ul className="space-y-1 mt-1">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[hsl(240,4%,46%)]">
                      <span className="truncate flex-1">{f.name}</span>
                      <span className="flex-shrink-0 text-[hsl(240,4%,60%)]">
                        ({(f.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Remove ${f.name}`}
                        className="text-[hsl(240,4%,56%)] hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                id="bs-consent"
                type="checkbox"
                {...register("consent")}
                className="mt-0.5 h-4 w-4 rounded border-[hsl(240,6%,88%)] accent-[hsl(245,85%,58%)]"
              />
              <div>
                <Label htmlFor="bs-consent" className="font-normal text-sm cursor-pointer">
                  I&apos;m happy to be contacted about this enquiry{" "}
                  <span aria-hidden="true">*</span>
                </Label>
                {errors.consent && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.consent.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Sending…" : "Send Enquiry"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
