"use client";

import React, {
  createContext, useContext, useEffect, useRef, useState, useCallback,
} from "react";
import { TRACKS, type Track } from "@/data/tracks";
import { shuffle } from "@/lib/shuffle";

const STORAGE_KEY_VOLUME  = "wdg_audio_volume";
const STORAGE_KEY_MUTED   = "wdg_audio_muted";
const STORAGE_KEY_INDEX   = "wdg_audio_index";
const STORAGE_KEY_POSITION = "wdg_audio_pos";

const DEFAULT_VOLUME = 0.35;
const CROSSFADE_SEC  = 2;
const TAB_BLUR_RATIO = 0.4; // reduce to 40% on blur

interface PlayerState {
  playing: boolean;
  muted: boolean;
  volume: number;        // 0–1
  currentTrack: Track;
  currentIndex: number;
  queue: Track[];
}

interface PlayerActions {
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside AmbientPlayerProvider");
  return ctx;
}

export function AmbientPlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>(() => shuffle(TRACKS));
  const [index, setIndex] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [unlockedByGesture, setUnlockedByGesture] = useState(false);

  const audioA = useRef<HTMLAudioElement | null>(null);
  const audioB = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<"A" | "B">("A");
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTrack = queue[index] ?? queue[0];

  // ── Restore from localStorage ─────────────────────────────────────────────
  useEffect(() => {
    const savedVolume  = parseFloat(localStorage.getItem(STORAGE_KEY_VOLUME)  ?? `${DEFAULT_VOLUME}`);
    const savedMuted   = localStorage.getItem(STORAGE_KEY_MUTED) === "true";
    const savedIndex   = parseInt(localStorage.getItem(STORAGE_KEY_INDEX)   ?? "0", 10);
    const savedPos     = parseFloat(localStorage.getItem(STORAGE_KEY_POSITION) ?? "0");

    setVolumeState(isNaN(savedVolume) ? DEFAULT_VOLUME : Math.min(1, Math.max(0, savedVolume)));
    setMuted(savedMuted);
    setIndex(isNaN(savedIndex) ? 0 : savedIndex % TRACKS.length);

    if (audioA.current) {
      audioA.current.currentTime = isNaN(savedPos) ? 0 : savedPos;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist state ─────────────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem(STORAGE_KEY_VOLUME,  String(volume));  }, [volume]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_MUTED,   String(muted));   }, [muted]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_INDEX,   String(index));   }, [index]);

  // Save position every 5s
  useEffect(() => {
    const id = setInterval(() => {
      const el = activeRef.current === "A" ? audioA.current : audioB.current;
      if (el) localStorage.setItem(STORAGE_KEY_POSITION, String(el.currentTime));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Initialise audio elements ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    audioA.current = new Audio();
    audioB.current = new Audio();

    [audioA.current, audioB.current].forEach(el => {
      el.preload = "auto";
      el.volume = 0; // start silent; unmuted via gesture
    });

    // Load first track
    audioA.current.src = queue[0].file;
    audioA.current.load();

    return () => {
      audioA.current?.pause();
      audioB.current?.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── First-gesture unlock ──────────────────────────────────────────────────
  useEffect(() => {
    const wasMuted = localStorage.getItem(STORAGE_KEY_MUTED) === "true";

    const unlock = () => {
      if (unlockedByGesture) return;
      setUnlockedByGesture(true);
      const el = audioA.current;
      if (!el) return;

      el.play().then(() => {
        setPlaying(true);
        if (!wasMuted) {
          // Fade in over 2s
          const target = volume;
          let current = 0;
          const step = target / (2000 / 50);
          const id = setInterval(() => {
            current = Math.min(target, current + step);
            if (el) el.volume = current;
            if (current >= target) clearInterval(id);
          }, 50);
        }
      }).catch(() => {});

      document.removeEventListener("click",   unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown", unlock);
    };

    document.addEventListener("click",      unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("keydown",    unlock, { once: true });

    return () => {
      document.removeEventListener("click",      unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown",    unlock);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tab visibility — reduce/restore volume ────────────────────────────────
  useEffect(() => {
    const onChange = () => {
      const el = activeRef.current === "A" ? audioA.current : audioB.current;
      if (!el || muted) return;
      el.volume = document.hidden ? volume * TAB_BLUR_RATIO : volume;
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, [volume, muted]);

  // ── Update volume on audio elements ──────────────────────────────────────
  useEffect(() => {
    const el = activeRef.current === "A" ? audioA.current : audioB.current;
    if (!el) return;
    el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // ── Track-ended: crossfade to next ────────────────────────────────────────
  const loadAndPlay = useCallback((nextIndex: number, fadeOut: HTMLAudioElement, fadeIn: HTMLAudioElement) => {
    const track = queue[nextIndex];
    fadeIn.src = track.file;
    fadeIn.volume = 0;
    fadeIn.load();
    fadeIn.play().catch(() => {});

    let elapsed = 0;
    const steps = (CROSSFADE_SEC * 1000) / 50;
    const targetVol = muted ? 0 : volume;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = setInterval(() => {
      elapsed++;
      const t = Math.min(elapsed / steps, 1);
      fadeOut.volume = targetVol * (1 - t);
      fadeIn.volume  = targetVol * t;
      if (t >= 1) {
        clearInterval(fadeIntervalRef.current!);
        fadeOut.pause();
        fadeOut.src = "";
      }
    }, 50);
  }, [muted, volume, queue]);

  useEffect(() => {
    const el = audioA.current;
    if (!el) return;

    const onEnded = () => {
      const nextIndex = (index + 1) % queue.length;
      // If we wrapped around, reshuffle
      const nextQueue = nextIndex === 0 ? shuffle(TRACKS) : queue;
      if (nextIndex === 0) setQueue(nextQueue);
      setIndex(nextIndex);

      const fadeOut = activeRef.current === "A" ? audioA.current! : audioB.current!;
      const fadeIn  = activeRef.current === "A" ? audioB.current! : audioA.current!;
      activeRef.current = activeRef.current === "A" ? "B" : "A";
      loadAndPlay(nextIndex, fadeOut, fadeIn);
    };

    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [index, queue, loadAndPlay]);

  // ── Load track when index changes manually ────────────────────────────────
  const loadTrack = useCallback((newIndex: number) => {
    const el = activeRef.current === "A" ? audioA.current : audioB.current;
    if (!el) return;
    el.src = queue[newIndex].file;
    el.volume = muted ? 0 : volume;
    el.load();
    if (playing) el.play().catch(() => {});
  }, [queue, muted, volume, playing]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const el = activeRef.current === "A" ? audioA.current : audioB.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      const el = activeRef.current === "A" ? audioA.current : audioB.current;
      if (el) el.volume = next ? 0 : volume;
      return next;
    });
  }, [volume]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    if (!muted) {
      const el = activeRef.current === "A" ? audioA.current : audioB.current;
      if (el) el.volume = clamped;
    }
  }, [muted]);

  const nextTrack = useCallback(() => {
    const ni = (index + 1) % queue.length;
    setIndex(ni);
    loadTrack(ni);
  }, [index, queue.length, loadTrack]);

  const prevTrack = useCallback(() => {
    const pi = (index - 1 + queue.length) % queue.length;
    setIndex(pi);
    loadTrack(pi);
  }, [index, queue.length, loadTrack]);

  return (
    <PlayerContext.Provider value={{
      playing, muted, volume, currentTrack, currentIndex: index, queue,
      togglePlay, toggleMute, setVolume, nextTrack, prevTrack,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
