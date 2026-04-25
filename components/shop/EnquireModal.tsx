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
import type { Product } from "@/data/products";

const LS_NAME  = "wdg_contact_name";
const LS_EMAIL = "wdg_contact_email";

const schema = z.object({
  name:     z.string().min(2, "Please enter your name"),
  email:    z.string().email("Please enter a valid email address"),
  phone:    z.string().optional(),
  quantity: z.coerce.number().int().min(1, "Minimum quantity is 1"),
  message:  z.string().max(1000, "Message must be under 1000 characters").optional(),
});

type FormValues = z.infer<typeof schema>;

interface EnquireModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

function getSaved(key: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

export function EnquireModal({ product, isOpen, onClose }: EnquireModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name:     getSaved(LS_NAME),
      email:    getSaved(LS_EMAIL),
      quantity: 1,
    },
  });

  // Auto-close 3s after success
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

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sku: product.sku,
          productTitle: product.title,
          productUrl: `${window.location.origin}/shop/product/${product.slug}`,
        }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) throw new Error(json.error ?? "Server error");
      localStorage.setItem(LS_NAME, data.name);
      localStorage.setItem(LS_EMAIL, data.email);
      reset({ name: data.name, email: data.email, phone: "", quantity: 1, message: "" });
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong. Please try again, or email sales@wdgreenhill.com directly.",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] z-[60]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {submitted ? "Enquiry sent" : "Enquire about this part"}
          </DialogTitle>
          {!submitted && (
            <DialogDescription>
              Part:{" "}
              <span className="font-mono text-xs bg-[hsl(240,5%,94%)] px-1.5 py-0.5 rounded">
                {product.sku}
              </span>{" "}
              {product.title} — currently out of stock
            </DialogDescription>
          )}
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-4 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-[hsl(240,10%,4%)]">
                Thanks — we&apos;ll be in touch within 1 working day.
              </p>
              <p className="text-sm text-[hsl(240,4%,56%)] mt-1">
                This window will close automatically.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); onClose(); }}>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="enq-name">Name <span aria-hidden="true">*</span></Label>
                <Input id="enq-name" {...register("name")} placeholder="Jane Smith" autoComplete="name" />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="enq-qty">Quantity needed <span aria-hidden="true">*</span></Label>
                <Input
                  id="enq-qty"
                  type="number"
                  min={1}
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-email">Email address <span aria-hidden="true">*</span></Label>
              <Input
                id="enq-email"
                type="email"
                {...register("email")}
                placeholder="jane@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-phone">
                Phone <span className="text-[hsl(240,4%,56%)] font-normal text-xs">(optional)</span>
              </Label>
              <Input
                id="enq-phone"
                type="tel"
                {...register("phone")}
                placeholder="+44 7700 000000"
                autoComplete="tel"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-message">
                Message <span className="text-[hsl(240,4%,56%)] font-normal text-xs">(optional)</span>
              </Label>
              <Textarea
                id="enq-message"
                {...register("message")}
                rows={3}
                maxLength={1000}
                placeholder="Any specific requirements or questions about availability?"
              />
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message.message}</p>
              )}
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
