"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, calcTotal } from "@/lib/format";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const sub = subtotal();
  const vat = sub * 0.2;
  const total = sub + vat;

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            aria-label="Shopping cart"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[hsl(240,6%,88%)]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[hsl(245,85%,58%)]" />
                <h2 className="text-lg font-bold">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 hover:bg-[hsl(240,5%,94%)] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                  <ShoppingCart className="w-16 h-16 text-[hsl(240,6%,88%)]" />
                  <p className="text-lg font-semibold text-[hsl(240,4%,46%)]">Your cart is empty</p>
                  <Button variant="outline" onClick={onClose} asChild>
                    <Link href="/shop">Browse Parts</Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-[hsl(240,6%,92%)]">
                  {items.map((item) => (
                    <li key={item.sku} className="flex gap-4 px-6 py-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[hsl(240,5%,96%)]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/product/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-semibold line-clamp-2 hover:text-[hsl(245,85%,58%)] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-[hsl(240,4%,56%)] mt-0.5 font-mono">
                          SKU: {item.sku}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          {/* Qty adjuster */}
                          <div className="flex items-center rounded-md border border-[hsl(240,6%,88%)] overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-[hsl(240,5%,94%)] transition-colors text-[hsl(240,4%,46%)]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-sm font-semibold border-x border-[hsl(240,6%,88%)]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-[hsl(240,5%,94%)] transition-colors text-[hsl(240,4%,46%)]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-xs text-[hsl(240,4%,56%)]">ex. VAT</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.sku)}
                        className="self-start p-1.5 rounded-md text-[hsl(240,4%,60%)] hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer totals */}
            {items.length > 0 && (
              <div className="border-t border-[hsl(240,6%,88%)] px-6 py-5 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[hsl(240,4%,46%)]">
                    <span>Subtotal (ex. VAT)</span>
                    <span>{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between text-[hsl(240,4%,46%)]">
                    <span>VAT (20%)</span>
                    <span>{formatPrice(vat)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-1 border-t border-[hsl(240,6%,88%)]">
                    <span>Total (inc. VAT)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <p className="text-xs text-[hsl(240,4%,56%)]">
                  Shipping calculated at checkout. Free UK shipping on orders over £150.
                </p>
                <Button className="w-full" size="lg" asChild onClick={onClose}>
                  <Link href="/cart">View Cart & Checkout</Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
