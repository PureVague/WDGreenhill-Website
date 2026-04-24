"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { buildKeyboard, KEY_GEOMETRY, type KeyData } from "@/lib/keyboard";
import { playNote } from "@/lib/note-player";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// ─── Layout constants ────────────────────────────────────────────────────────
const FULL_START = 21;   // A0
const FULL_END   = 108;  // C8
const SMALL_START = 48;  // C3
const SMALL_END   = 83;  // B5 (36 white keys visible on mobile)

// Depress amounts in px
const MAX_DEPRESS = 6;
const NEIGHBOUR_DEPRESS = 2.5;
const CLICK_DEPRESS = 9;

// Idle shimmer interval range (ms)
const SHIMMER_MIN = 8000;
const SHIMMER_MAX = 14000;

// ─── Types ───────────────────────────────────────────────────────────────────
interface GlowState {
  midiNote: number;
  startedAt: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** SVG path: rectangle with sharp top corners, rounded bottom corners only */
function roundedBottomPath(x: number, y: number, w: number, h: number, r: number): string {
  return [
    `M ${x} ${y}`,
    `L ${x + w} ${y}`,
    `L ${x + w} ${y + h - r}`,
    `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `L ${x + r} ${y + h}`,
    `Q ${x} ${y + h} ${x} ${y + h - r}`,
    "Z",
  ].join(" ");
}

// ─── Component ───────────────────────────────────────────────────────────────
export function PianoKeyboard() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState(1440);

  // Derived layout
  const useFull = containerWidth >= 768;
  const startMidi = useFull ? FULL_START : SMALL_START;
  const endMidi   = useFull ? FULL_END   : SMALL_END;

  // Calculate white key width so layout fills container exactly
  const whiteCountForLayout = useFull ? 52 : 21; // 52 whites in 88 keys, 21 whites in C3-B5
  const whiteWidth = Math.max(10, containerWidth / whiteCountForLayout);

  const layout = buildKeyboard(startMidi, endMidi, whiteWidth);
  const { whiteHeight } = layout;
  const { whiteKeyCornerRadius, blackKeyCornerRadius } = KEY_GEOMETRY;

  // ── Hover / depress state ────────────────────────────────────────────────
  const cursorX = useMotionValue(-1000);
  const [hoveredMidi, setHoveredMidi] = useState<number | null>(null);
  const [pressedMidi, setPressedMidi] = useState<number | null>(null);
  const [glows, setGlows] = useState<GlowState[]>([]);

  // ── Shimmer state ─────────────────────────────────────────────────────────
  const [shimmerActive, setShimmerActive] = useState(false);

  // ── Entrance animation ────────────────────────────────────────────────────
  const c4Midi = 60;
  const c4White = layout.whites.find(k => k.midiNote === c4Midi);
  const c4X = c4White?.x ?? layout.totalWidth / 2;

  function getDelay(key: KeyData): number {
    const dist = Math.abs(key.x - c4X);
    return (dist / layout.totalWidth) * 0.9;
  }

  // ── Resize observer ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  // ── Idle shimmer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduced) return;
    let timeout: ReturnType<typeof setTimeout>;
    function schedule() {
      const delay = SHIMMER_MIN + Math.random() * (SHIMMER_MAX - SHIMMER_MIN);
      timeout = setTimeout(() => {
        setShimmerActive(true);
        setTimeout(() => setShimmerActive(false), 1800);
        schedule();
      }, delay);
    }
    schedule();
    return () => clearTimeout(timeout);
  }, [reduced]);

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const findKeyAtX = useCallback((clientX: number): KeyData | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const svgX = clientX - rect.left;
    for (const k of layout.blacks) {
      if (svgX >= k.x && svgX <= k.x + k.width) return k;
    }
    for (const k of layout.whites) {
      if (svgX >= k.x && svgX <= k.x + k.width) return k;
    }
    return null;
  }, [layout]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    cursorX.set(e.clientX);
    const key = findKeyAtX(e.clientX);
    setHoveredMidi(key?.midiNote ?? null);
  }, [cursorX, findKeyAtX]);

  const handleMouseLeave = useCallback(() => {
    cursorX.set(-1000);
    setHoveredMidi(null);
  }, [cursorX]);

  const handleKeyClick = useCallback((key: KeyData) => {
    setPressedMidi(key.midiNote);
    playNote(key.midiNote);
    setGlows(prev => [...prev, { midiNote: key.midiNote, startedAt: Date.now() }]);
    setTimeout(() => setPressedMidi(null), 200);
    setTimeout(() => {
      setGlows(prev => prev.filter(g => g.midiNote !== key.midiNote || Date.now() - g.startedAt < 600));
    }, 700);
  }, []);

  // ── Depress amount per key ────────────────────────────────────────────────
  function getDepress(key: KeyData): number {
    if (pressedMidi === key.midiNote) return CLICK_DEPRESS;
    if (hoveredMidi === null) return 0;
    const dist = Math.abs(key.midiNote - hoveredMidi);
    if (dist === 0) return MAX_DEPRESS;
    if (dist <= 2) return NEIGHBOUR_DEPRESS * (1 - dist / 3);
    return 0;
  }

  function hasGlow(midi: number) {
    return glows.some(g => g.midiNote === midi);
  }

  const svgHeight = whiteHeight + 8;

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ height: svgHeight + 16 }}
      aria-hidden="true"
    >
      {/* Gradient fade — top of keyboard blends into hero */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: "60%",
          background: "linear-gradient(to bottom, hsl(240,10%,4%) 0%, transparent 100%)",
        }}
      />

      <svg
        ref={svgRef}
        width={layout.totalWidth}
        height={svgHeight}
        viewBox={`0 0 ${layout.totalWidth} ${svgHeight}`}
        className="absolute bottom-0 pointer-events-auto"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: "100%",
          cursor: "pointer",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* White key gradient: slightly darker top, bright middle, subtle shadow bottom */}
          <linearGradient id="wk-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#EBEBЕ8" />
            <stop offset="10%"  stopColor="#FAFAF7" />
            <stop offset="80%"  stopColor="#F5F5F2" />
            <stop offset="100%" stopColor="#D8D8D5" />
          </linearGradient>
          {/* White key glow gradient */}
          <linearGradient id="wk-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="hsl(38,93%,60%)" stopOpacity="0.7" />
            <stop offset="30%" stopColor="hsl(38,93%,60%)" stopOpacity="0.0" />
          </linearGradient>
          {/* Black key glow */}
          <linearGradient id="bk-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="hsl(245,85%,65%)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="hsl(38,93%,60%)"  stopOpacity="0.0" />
          </linearGradient>
          {/* Drop shadow filter for white keys */}
          <filter id="wk-shadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.18" />
          </filter>
          {/* Shimmer gradient */}
          <linearGradient id="shimmer-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
            <stop offset="40%"  stopColor="rgba(255,255,255,0.18)" />
            <stop offset="60%"  stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* ── WHITE KEYS ── */}
        <g id="whites">
          {layout.whites.map((key) => {
            const depress = getDepress(key);
            const isGlowing = hasGlow(key.midiNote);
            const isHovered = hoveredMidi === key.midiNote;
            const delay = getDelay(key);
            const x = key.x + 0.5;
            const w = key.width - 1;
            const h = key.height - 1;
            const r = whiteKeyCornerRadius;

            return (
              <motion.g
                key={key.midiNote}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -60 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0.5, delay }
                    : { type: "spring", stiffness: 300, damping: 20, delay }
                }
                onClick={() => handleKeyClick(key)}
                style={{ cursor: "pointer" }}
              >
                {/* Key body — rounded bottom only */}
                <motion.path
                  d={roundedBottomPath(x, 0.5, w, h, r)}
                  fill="url(#wk-grad)"
                  stroke="#888"
                  strokeWidth={0.5}
                  filter="url(#wk-shadow)"
                  animate={{ y: depress }}
                  transition={{ type: "spring", stiffness: 600, damping: 30 }}
                />
                {/* Hover tint */}
                {isHovered && (
                  <path
                    d={roundedBottomPath(x, 0.5, w, h, r)}
                    fill="rgba(245,158,11,0.08)"
                  />
                )}
                {/* Glow on click */}
                {isGlowing && (
                  <motion.path
                    d={roundedBottomPath(x, 0.5, w, h * 0.4, r)}
                    fill="url(#wk-glow)"
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.g>
            );
          })}
        </g>

        {/* ── BLACK KEYS ── */}
        <g id="blacks">
          {layout.blacks.map((key) => {
            const depress = getDepress(key);
            const isGlowing = hasGlow(key.midiNote);
            const isHovered = hoveredMidi === key.midiNote;
            const delay = getDelay(key);
            const r = blackKeyCornerRadius;

            return (
              <motion.g
                key={key.midiNote}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -80 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0.5, delay: delay + 0.1 }
                    : { type: "spring", stiffness: 320, damping: 22, delay: delay + 0.05 }
                }
                onClick={() => handleKeyClick(key)}
                style={{ cursor: "pointer" }}
              >
                {/* Key body — flat dark, rounded bottom only */}
                <motion.path
                  d={roundedBottomPath(key.x, 0, key.width, key.height, r)}
                  fill="#0A0A0B"
                  animate={{ y: depress * 0.8 }}
                  transition={{ type: "spring", stiffness: 600, damping: 30 }}
                />
                {/* 2px top highlight strip only */}
                <rect
                  x={key.x + 1}
                  y={1}
                  width={key.width - 2}
                  height={2}
                  fill="rgba(255,255,255,0.08)"
                  style={{ pointerEvents: "none" }}
                />
                {/* Hover tint */}
                {isHovered && (
                  <path
                    d={roundedBottomPath(key.x, 0, key.width, key.height * 0.5, r)}
                    fill="rgba(245,158,11,0.25)"
                  />
                )}
                {/* Glow on click */}
                {isGlowing && (
                  <motion.path
                    d={roundedBottomPath(key.x, 0, key.width, key.height * 0.5, r)}
                    fill="url(#bk-glow)"
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.g>
            );
          })}
        </g>

        {/* ── IDLE SHIMMER ── */}
        <AnimatePresence>
          {shimmerActive && (
            <motion.rect
              x={0}
              y={0}
              width={layout.totalWidth}
              height={whiteHeight}
              fill="url(#shimmer-grad)"
              initial={{ x: -layout.totalWidth, opacity: 0.8 }}
              animate={{ x: layout.totalWidth * 2, opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              style={{ pointerEvents: "none" }}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
