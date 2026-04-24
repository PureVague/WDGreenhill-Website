"use client";

import { midiToFrequency } from "./keyboard";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/**
 * Play a piano-like note using a WebAudio oscillator + gain envelope.
 * Uses two detuned oscillators (sawtooth + triangle) to emulate a piano partial.
 */
export function playNote(midiNote: number, velocity = 0.7, durationSec = 1.2): void {
  try {
    const ac = getCtx();
    const freq = midiToFrequency(midiNote);
    const now = ac.currentTime;

    // Master gain
    const master = ac.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(velocity * 0.4, now + 0.01);
    master.gain.exponentialRampToValueAtTime(velocity * 0.18, now + 0.3);
    master.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
    master.connect(ac.destination);

    // Primary oscillator — triangle (piano-like, low in harmonics)
    const osc1 = ac.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.value = freq;

    // Secondary oscillator — detuned for warmth
    const osc2 = ac.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2; // octave above — simulates hammer partial

    const gain2 = ac.createGain();
    gain2.gain.value = 0.3;

    osc1.connect(master);
    osc2.connect(gain2);
    gain2.connect(master);

    // High-pass to cut rumble on low notes
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 40;

    osc1.connect(hp);
    hp.connect(master);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSec + 0.05);
    osc2.stop(now + durationSec + 0.05);
  } catch {
    // Silently fail if AudioContext is unavailable
  }
}
