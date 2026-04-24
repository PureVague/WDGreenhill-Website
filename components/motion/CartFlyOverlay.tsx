"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartFlyStore, type FlyPayload } from "@/lib/cart-fly-store";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function FlyItem({ item, onDone }: { item: FlyPayload; onDone: () => void }) {
  const [cartRect, setCartRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-cart-trigger]");
    if (el) setCartRect(el.getBoundingClientRect());
  }, []);

  if (!cartRect) return null;

  const fromX = item.fromRect.x + item.fromRect.width / 2;
  const fromY = item.fromRect.y + item.fromRect.height / 2;
  const toX = cartRect.x + cartRect.width / 2;
  const toY = cartRect.y + cartRect.height / 2;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998] rounded-full overflow-hidden shadow-lg border-2 border-[hsl(38,93%,50%)]"
      style={{ width: 56, height: 56, top: fromY - 28, left: fromX - 28 }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        x: toX - fromX,
        y: toY - fromY,
        scale: 0.3,
        opacity: 0,
      }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      onAnimationComplete={onDone}
    >
      <Image
        src={item.imageUrl}
        alt=""
        fill
        sizes="56px"
        className="object-contain p-1"
      />
    </motion.div>
  );
}

export function CartFlyOverlay() {
  const { items, remove } = useCartFlyStore();
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <AnimatePresence>
      {items.map((item) => (
        <FlyItem key={item.id} item={item} onDone={() => remove(item.id)} />
      ))}
    </AnimatePresence>
  );
}
