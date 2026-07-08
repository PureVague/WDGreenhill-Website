"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ALL_COUNTRIES } from "@/lib/shipping/countries";

const LS_NAME = "wdg_contact_name";
const LS_EMAIL = "wdg_contact_email";

function getSaved(key: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(2, "Please select a delivery country"),
  postcode: z.string().min(2, "Please enter your postcode / ZIP"),
  instructions: z.string().max(1000, "Please keep this under 1000 characters").optional(),
});

type FormValues = z.infer<typeof schema>;

export interface QuoteLineItem {
  sku: string;
  title: string;
  quantity: number;
  weightGrams: number;
}

export interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteLineItem[];
  totalWeightGrams: number;
  defaultCountry?: string;
}

export function QuoteRequestModal({
  isOpen,
  onClose,
  items,
  totalWeightGrams,
  defaultCountry = "GB",
}: QuoteRequestModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: getSaved(LS_NAME),
      email: getSaved(LS_EMAIL),
      country: defaultCountry,
    },
  });

  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 6000);
    return () => clearTimeout(t);
  }, [submitted, onClose]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSubmitError(null);
      onClose();
    }
  };

  const totalKg = (totalWeightGrams / 1000).toFixed(2);
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/shipping-quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items,
          totalWeightGrams,
          itemCount,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) throw new Error(json.error ?? "Server error");
      localStorage.setItem(LS_NAME, data.name);
      localStorage.setItem(LS_EMAIL, data.email);
      reset({ name: data.name, email: data.email, phone: "", country: data.country, postcode: "", instructions: "" });
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong. Please try again, or email sales@wdgreenhill.com directly.",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[540px] z-[60] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {submitted ? "Quote requested" : "Request a shipping quote"}
          </DialogTitle>
          {!submitted && (
            <DialogDescription>
              One or more items are large or heavy, so we&apos;ll quote shipping individually.
              Send your details and we&apos;ll email a quote within 1 working day &mdash; no
              payment is taken now.
            </DialogDescription>
          )}
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-4 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-[hsl(240,10%,4%)]">
                Thanks &mdash; we&apos;ll send you a shipping quote by email within 1 working day.
              </p>
              <p className="text-sm text-[hsl(240,4%,56%)] mt-2">
                If you&apos;d like to pay for the items now excluding shipping, please email{" "}
                <a href="mailto:sales@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
                  sales@wdgreenhill.com
                </a>{" "}
                directly.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); onClose(); }}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1" noValidate>
            {submitError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* Cart preview (read-only) */}
            <div className="rounded-lg border border-[hsl(240,6%,88%)] bg-[hsl(240,5%,97%)] p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[hsl(240,4%,46%)] mb-2">
                Your basket ({itemCount} item{itemCount !== 1 ? "s" : ""} · {totalKg}kg)
              </p>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {items.map((i) => (
                  <li key={i.sku} className="flex justify-between gap-3 text-xs text-[hsl(240,4%,40%)]">
                    <span className="truncate">
                      <span className="font-mono">{i.sku}</span> · {i.title}
                    </span>
                    <span className="flex-shrink-0 tabular-nums">
                      ×{i.quantity} · {((i.weightGrams * i.quantity) / 1000).toFixed(2)}kg
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="q-name">Name <span aria-hidden="true">*</span></Label>
                <Input id="q-name" {...register("name")} placeholder="Jane Smith" autoComplete="name" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="q-email">Email <span aria-hidden="true">*</span></Label>
                <Input id="q-email" type="email" {...register("email")} placeholder="jane@example.com" autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="q-phone">
                Phone <span className="text-[hsl(240,4%,56%)] font-normal text-xs">(optional)</span>
              </Label>
              <Input id="q-phone" type="tel" {...register("phone")} placeholder="+44 7700 000000" autoComplete="tel" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="q-country">Delivery country <span aria-hidden="true">*</span></Label>
                <select
                  id="q-country"
                  {...register("country")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="q-postcode">Postcode / ZIP <span aria-hidden="true">*</span></Label>
                <Input id="q-postcode" {...register("postcode")} placeholder="SS4 1TA" autoComplete="postal-code" />
                {errors.postcode && <p className="text-xs text-red-500">{errors.postcode.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="q-instructions">
                Special instructions <span className="text-[hsl(240,4%,56%)] font-normal text-xs">(optional)</span>
              </Label>
              <Textarea
                id="q-instructions"
                {...register("instructions")}
                rows={2}
                maxLength={1000}
                placeholder="Delivery access, preferred courier, deadlines…"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Sending…" : "Request Quote"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
