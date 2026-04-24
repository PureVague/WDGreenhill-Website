"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Simplified piano key layout: 26 white + black keys for visible aesthetics
const WHITE_KEYS = 26;
const KEY_PATTERN = [true, false, true, false, true, true, false, true, false, true, false, true]; // white=true, black=false

function buildKeys(count: number) {
  const keys: { isWhite: boolean; index: number }[] = [];
  for (let i = 0; keys.filter((k) => k.isWhite).length < count; i++) {
    keys.push({ isWhite: KEY_PATTERN[i % KEY_PATTERN.length], index: i });
  }
  return keys;
}

const KEYS = buildKeys(WHITE_KEYS);

export function PianoKeyWave() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef(0.5);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseXRef.current = (e.clientX - rect.left) / rect.width;
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let raf = 0;
    function animate() {
      const mx = mouseXRef.current;
      const whiteKeys = keysRef.current.filter(Boolean) as HTMLDivElement[];
      whiteKeys.forEach((key, i) => {
        const pos = i / (whiteKeys.length - 1);
        const dist = Math.abs(pos - mx);
        const wave = Math.max(0, 1 - dist * 4) * 18;
        const natural = Math.sin(Date.now() / 1200 + i * 0.5) * 4;
        key.style.transform = `scaleY(${1 + (wave + natural) * 0.018})`;
      });
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced, handleMouseMove]);

  if (reduced) return null;

  let whiteIdx = 0;
  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 h-28 flex items-end justify-center overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {KEYS.map((key, i) => {
        if (key.isWhite) {
          const idx = whiteIdx++;
          return (
            <motion.div
              key={i}
              ref={(el) => { keysRef.current[idx] = el; }}
              className="relative bg-white/10 border border-white/5 rounded-t-sm origin-bottom flex-shrink-0"
              style={{ width: "3.2%", height: "100%" }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{
                delay: 0.4 + idx * 0.018,
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          );
        } else {
          return (
            <motion.div
              key={i}
              className="absolute bg-[hsl(240,10%,10%)] border border-white/5 rounded-t-sm z-10"
              style={{ width: "2%", height: "60%", bottom: 0, left: `${(whiteIdx - 0.6) * 3.8}%` }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.7 }}
              transition={{
                delay: 0.5 + i * 0.012,
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          );
        }
      })}
    </div>
  );
}
