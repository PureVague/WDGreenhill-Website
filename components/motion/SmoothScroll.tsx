"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef   = useRef<number>(0);
  const reduced  = useReducedMotion();
  const pathname = usePathname();

  // ── Mount Lenis + attach resize triggers ─────────────────────────────────
  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // autoResize:true (default) only reacts to window.resize events.
      // The ResizeObserver below covers DOM-height changes that window.resize misses.
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // (a) window.load — fires after every resource (images, fonts, deferred
    //     scripts) has finished downloading. Lenis may have cached a smaller
    //     height before images painted, so recalculate once everything is in.
    const onLoad = () => lenis.resize();
    window.addEventListener("load", onLoad);

    // (b) ResizeObserver on <body> — catches any DOM height change that
    //     window.resize misses: images loading, font swaps, scroll-driven
    //     animations settling, lazy sections appearing, modals opening/closing.
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("load", onLoad);
      ro.disconnect();
    };
  }, [reduced]);

  // ── (c) Route changes ─────────────────────────────────────────────────────
  // Each Next.js navigation renders a completely different page height.
  // Give the new page 120 ms to settle (initial DOM paint + entrance
  // animation frame), then force Lenis to remeasure.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const t = setTimeout(() => lenis.resize(), 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return <>{children}</>;
}
