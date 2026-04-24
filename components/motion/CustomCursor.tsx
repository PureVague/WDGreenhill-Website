"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const INTERACTIVE_SELECTORS = "a, button, [role='button'], input, textarea, select, label[for]";

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [isTouch, setIsTouch] = useState(true);
  const [label, setLabel] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 500, damping: 35 });
  const y = useSpring(rawY, { stiffness: 500, damping: 35 });

  useEffect(() => {
    setMounted(true);
    // Detect touch device — hide cursor on touch
    const checkTouch = () => setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    checkTouch();

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest(INTERACTIVE_SELECTORS);
      if (target) {
        setIsHovering(true);
        const tag = target.tagName.toLowerCase();
        const text =
          target.getAttribute("data-cursor-label") ??
          (tag === "a" ? "View" : tag === "button" || target.getAttribute("role") === "button" ? "Click" : "");
        setLabel(text);
      } else {
        setIsHovering(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [rawX, rawY]);

  if (!mounted || isTouch || reduced) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{ width: isHovering ? 0 : 8, height: isHovering ? 0 : 8 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Ring + label */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border-2 border-[hsl(38,93%,50%)] flex items-center justify-center"
          animate={{
            width: isHovering ? (label ? 64 : 40) : 0,
            height: isHovering ? (label ? 64 : 40) : 0,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(38,93%,50%)] whitespace-nowrap">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
