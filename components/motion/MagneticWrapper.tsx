"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxDistance?: number;
}

export function MagneticWrapper({ children, className, maxDistance = 8 }: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 350, damping: 30 });
  const y = useSpring(rawY, { stiffness: 350, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rawX.set(dx * maxDistance);
    rawY.set(dy * maxDistance);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
