"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music2, VolumeX, Volume2, SkipBack, SkipForward,
  Play, Pause, ChevronDown, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { usePlayer } from "./ambient-player.context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export function AmbientPlayer() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    playing, muted, volume,
    currentTrack,
    togglePlay, toggleMute, setVolume, nextTrack, prevTrack,
  } = usePlayer();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // 'M' key toggles mute
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        toggleMute();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggleMute]);

  const displayTitle = currentTrack.title.length > 30
    ? currentTrack.title
    : currentTrack.title;

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      aria-label="Background music player"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "w-80 rounded-2xl border border-[hsl(240,6%,20%)] shadow-2xl",
              "bg-[hsl(240,10%,8%)] text-white overflow-hidden",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music2 className="w-3.5 h-3.5 text-[hsl(245,85%,65%)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Now Playing
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors rounded-md p-1"
                aria-label="Collapse player"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Track info */}
            <div className="px-4 pt-4 pb-2 overflow-hidden">
              <div className="overflow-hidden whitespace-nowrap">
                <motion.p
                  key={currentTrack.id}
                  className="text-sm font-semibold text-white leading-snug truncate"
                  animate={
                    !reduced && displayTitle.length > 28
                      ? { x: ["0%", "-30%", "-30%", "0%"] }
                      : {}
                  }
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {currentTrack.title}
                </motion.p>
              </div>
              <p className="text-xs text-white/50 mt-0.5 truncate">
                {currentTrack.composer}
                {currentTrack.performer !== currentTrack.composer && ` · ${currentTrack.performer}`}
              </p>
            </div>

            {/* Transport controls */}
            <div className="flex items-center justify-center gap-4 py-3">
              <button
                onClick={prevTrack}
                className="text-white/50 hover:text-white transition-colors p-1.5"
                aria-label="Previous track"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <motion.button
                whileTap={reduced ? {} : { scale: 0.9 }}
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[hsl(38,93%,50%)] hover:bg-[hsl(38,93%,45%)] flex items-center justify-center transition-colors shadow-lg shadow-amber-500/20"
                aria-label={playing ? "Pause background music" : "Play background music"}
              >
                {playing
                  ? <Pause className="w-5 h-5 text-[hsl(240,10%,4%)]" />
                  : <Play className="w-5 h-5 text-[hsl(240,10%,4%)] ml-0.5" />
                }
              </motion.button>

              <button
                onClick={nextTrack}
                className="text-white/50 hover:text-white transition-colors p-1.5"
                aria-label="Next track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume + mute */}
            <div className="px-4 pb-4 flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                aria-label={muted ? "Unmute" : "Mute (keyboard shortcut: M)"}
                title="M to toggle mute"
              >
                {muted
                  ? <VolumeX className="w-4 h-4 text-[hsl(38,93%,50%)]" />
                  : <Volume2 className="w-4 h-4" />
                }
              </button>

              {/* Volume slider */}
              <div className="flex-1 relative">
                <label className="sr-only">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  aria-valuenow={Math.round(volume * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Volume"
                  className="volume-slider w-full appearance-none h-1.5 rounded-full cursor-pointer outline-none"
                  style={{
                    background: `linear-gradient(to right, hsl(38,93%,50%) ${volume * 100}%, hsl(240,6%,25%) ${volume * 100}%)`,
                  }}
                />
              </div>

              <span className="text-xs text-white/40 w-7 text-right flex-shrink-0">
                {Math.round(volume * 100)}
              </span>
            </div>

            {/* Credits link */}
            <div className="border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                {currentTrack.licence}
              </span>
              <Link
                href="/credits"
                className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                onClick={() => setOpen(false)}
              >
                Credits
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <div className="relative">
        {/* Pulsing ring when playing */}
        {!reduced && playing && !muted && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[hsl(245,85%,58%)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <motion.button
          whileTap={reduced ? {} : { scale: 0.92 }}
          onClick={() => setOpen(v => !v)}
          className={cn(
            "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors",
            "bg-[hsl(240,10%,8%)] border border-[hsl(240,6%,20%)] text-white",
            "hover:border-[hsl(245,85%,58%)] hover:text-[hsl(245,85%,65%)]",
            open && "border-[hsl(245,85%,58%)] text-[hsl(245,85%,65%)]",
          )}
          aria-label={open ? "Collapse music player" : "Open music player"}
          aria-expanded={open}
        >
          {muted
            ? <VolumeX className="w-5 h-5" />
            : <Music2 className="w-5 h-5" />
          }
        </motion.button>
      </div>
    </div>
  );
}
