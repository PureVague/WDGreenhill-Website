"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Product } from "@/data/products";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Please describe your enquiry (min 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

interface EnquireModalProps {
  product: Product | null;
  onClose: () => void;
}

export function EnquireModal({ product, onClose }: EnquireModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: product ? `Hi, I'm enquiring about part ${product.sku} — ${product.title}. ` : "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        subject: `Part Enquiry: ${product?.sku ?? "Unknown"} — ${product?.title ?? ""}`,
        type: "part-enquiry",
        partSku: product?.sku,
      }),
    });
    setSubmitted(true);
    reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setSubmitted(false);
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {submitted ? "Enquiry Sent" : "Enquire About This Part"}
          </DialogTitle>
          {!submitted && product && (
            <DialogDescription>
              <span className="font-mono text-xs bg-[hsl(240,5%,94%)] px-2 py-0.5 rounded">
                {product.sku}
              </span>{" "}
              {product.title}
            </DialogDescription>
          )}
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <span className="text-emerald-600 text-2xl">✓</span>
            </div>
            <p className="font-semibold">Thank you for your enquiry.</p>
            <p className="text-sm text-[hsl(240,4%,46%)]">
              We&apos;ll respond to you within one working day at the email address you provided.
            </p>
            <Button onClick={onClose} variant="outline" className="mt-4">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="enq-name">Your name</Label>
              <Input id="enq-name" {...register("name")} placeholder="John Smith" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="enq-email">Email address</Label>
              <Input id="enq-email" type="email" {...register("email")} placeholder="john@example.com" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="enq-message">Message</Label>
              <Textarea
                id="enq-message"
                {...register("message")}
                rows={4}
                placeholder="Please describe what you need..."
              />
              {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Sending…" : "Send Enquiry"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
