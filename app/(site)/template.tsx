"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <>
      {/* Scroll progress bar */}
      {!reduced && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-0.5 bg-[hsl(38,93%,50%)] origin-left z-50"
          style={{ scaleX }}
          aria-hidden="true"
        />
      )}

      {/* Page transition */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </>
  );
}
