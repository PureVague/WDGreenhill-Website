"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";

const STEPS = [
  { step: "1", title: "Confirmation email", body: "A receipt will be sent to your email address within a few minutes." },
  { step: "2", title: "Processing", body: "We'll review your order and prepare it for despatch, typically the same working day." },
  { step: "3", title: "Despatch notification", body: "You'll receive a despatch email with tracking information when your order ships." },
  { step: "4", title: "Delivery", body: "UK orders typically arrive within 1–3 working days of despatch." },
];

export function CheckoutSuccess() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen pt-28 pb-24 flex items-center">
      <div className="max-w-xl mx-auto px-6 text-center w-full">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="font-display font-bold text-4xl mb-4">Order Confirmed</h1>
        <p className="text-lg text-[hsl(240,4%,46%)] mb-10">
          Thank you for your order with WD Greenhill & Co. You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="text-left p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white mb-10 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)]">What Happens Next</h2>
          {STEPS.map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[hsl(245,85%,58%)] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {step}
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-[hsl(240,4%,46%)]">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        <p className="text-xs text-[hsl(240,4%,60%)] mt-8">
          Questions? Email{" "}
          <a href="mailto:sales@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
            sales@wdgreenhill.com
          </a>{" "}
          or call +44 (0)1702 546195.
        </p>
      </div>
    </div>
  );
}
