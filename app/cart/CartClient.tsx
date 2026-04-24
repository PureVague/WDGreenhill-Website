"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export function CartClient() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);

  const sub = subtotal();
  const vat = sub * 0.2;
  const total = sub + vat;

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ sku: i.sku, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Checkout failed. Please try again.");
        setCheckingOut(false);
      }
    } catch {
      alert("Network error. Please try again.");
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center py-20">
          <ShoppingCart className="w-20 h-20 mx-auto text-[hsl(240,6%,88%)] mb-6" />
          <h1 className="font-display font-bold text-3xl mb-4">Your cart is empty</h1>
          <p className="text-[hsl(240,4%,46%)] mb-8">
            Browse our catalogue to find parts, manuals, and consumables.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Browse Parts <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Cart</span>
        </nav>

        <h1 className="font-display font-bold text-4xl mb-10">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.sku} className="flex gap-5 p-5 rounded-xl border border-[hsl(240,6%,88%)] bg-white">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[hsl(240,5%,96%)]">
                    <Image src={item.image} alt={item.title} fill sizes="96px" className="object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/product/${item.slug}`} className="font-semibold hover:text-[hsl(245,85%,58%)] transition-colors line-clamp-2">
                      {item.title}
                    </Link>
                    <p className="text-xs font-mono text-[hsl(240,4%,56%)] mt-1">SKU: {item.sku}</p>
                    <p className="text-xs text-[hsl(240,4%,56%)] capitalize mt-0.5">{item.brand.replace(/-/g, " ")}</p>

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
                      <div className="flex items-center rounded-lg border border-[hsl(240,6%,88%)] overflow-hidden">
                        <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} className="px-3 py-2 hover:bg-[hsl(240,5%,94%)] transition-colors" aria-label="Decrease quantity">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 py-2 text-sm font-bold border-x border-[hsl(240,6%,88%)]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} className="px-3 py-2 hover:bg-[hsl(240,5%,94%)] transition-colors" aria-label="Increase quantity">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-xs text-[hsl(240,4%,56%)]">ex. VAT</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.sku)}
                          className="p-2 rounded-md text-[hsl(240,4%,60%)] hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                Clear cart
              </Button>
              <Button variant="outline" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-2xl border border-[hsl(240,6%,88%)] bg-white">
              <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[hsl(240,4%,46%)]">Subtotal (ex. VAT)</span>
                  <span className="font-semibold">{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(240,4%,46%)]">VAT (20%)</span>
                  <span className="font-semibold">{formatPrice(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(240,4%,46%)]">Shipping</span>
                  <span className="text-[hsl(240,4%,46%)]">Calculated at checkout</span>
                </div>
                <div className="border-t border-[hsl(240,6%,88%)] pt-3 flex justify-between font-bold text-base">
                  <span>Estimated Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-6 gap-2"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? "Redirecting…" : "Proceed to Checkout"}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-xs text-[hsl(240,4%,60%)] mt-4 text-center">
                Secure checkout via Stripe. Free UK shipping on orders over £150 ex. VAT.
              </p>

              {/* Trust marks */}
              <div className="mt-6 pt-6 border-t border-[hsl(240,6%,88%)]">
                <p className="text-xs text-[hsl(240,4%,56%)] text-center">
                  🔒 SSL encrypted · Stripe payments · 30-day returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
