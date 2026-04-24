/**
 * Piano keyboard layout builder — anatomically accurate 88-key layout.
 *
 * Key insight: black key offsets are measured from the GAP between two
 * adjacent white keys (≈ 1.0 × whiteWidth from the lower key's left edge),
 * not from the midpoint of a single white key. Offsets near 1.0 place the
 * key AT the gap; values like 0.92 shift it slightly toward the lower note.
 */

// ─── Geometry constants ──────────────────────────────────────────────────────
// All proportions relative to one white-key width (= 1.0)
export const KEY_GEOMETRY = {
  whiteKeyHeightRatio: 5.5,        // white key height = 5.5 × white key width
  blackKeyWidthRatio:  0.58,       // ~58% of white key width
  blackKeyHeightRatio: 3.48,       // ~63% of white key height (3.48/5.5 ≈ 0.633)
  whiteKeyCornerRadius: 2,         // px — subtle rounding on bottom corners only
  blackKeyCornerRadius: 1.5,       // px — subtle rounding on bottom corners only

  // Horizontal offset of each black key from the gap between its two whites.
  // The "gap" is at (prevWhiteIndex + 1) × whiteWidth from the keyboard left.
  // Positive = shifted toward higher note, negative = toward lower note.
  // Unit: white-key widths.
  blackKeySpecOffsets: {
    1:  -0.08,   // C# — slightly toward C
    3:  +0.08,   // D# — slightly toward E
    6:  -0.10,   // F# — slightly toward F
    8:   0.00,   // G# — centred between G and A
    10: +0.10,   // A# — slightly toward B
  } as Record<number, number>,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────
export type KeyData = {
  midiNote: number;
  noteName: string;   // e.g. "C4", "F#4"
  octave: number;
  isWhite: boolean;
  x: number;
  width: number;
  height: number;
};

export type KeyboardLayout = {
  whites: KeyData[];
  blacks: KeyData[];
  totalWidth: number;
  whiteWidth: number;
  whiteHeight: number;
};

// ─── Note name helpers ───────────────────────────────────────────────────────
const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;
const WHITE_SEMITONES = new Set([0, 2, 4, 5, 7, 9, 11]);

function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const semitone = midi % 12;
  return `${NOTE_NAMES[semitone]}${octave}`;
}

// ─── Builder ─────────────────────────────────────────────────────────────────
/**
 * Build an accurate piano keyboard layout.
 *
 * @param startMidi  First MIDI note (21 = A0 for full 88-key)
 * @param endMidi    Last  MIDI note (108 = C8 for full 88-key)
 * @param whiteWidth Width of each white key in px (blacks are derived from this)
 */
export function buildKeyboard(
  startMidi = 21,
  endMidi   = 108,
  whiteWidth = 24,
): KeyboardLayout {
  const { whiteKeyHeightRatio, blackKeyWidthRatio, blackKeyHeightRatio, blackKeySpecOffsets } = KEY_GEOMETRY;

  const wh = whiteWidth * whiteKeyHeightRatio;
  const bw = whiteWidth * blackKeyWidthRatio;
  const bh = whiteWidth * blackKeyHeightRatio;

  const whites: KeyData[] = [];
  const blacks: KeyData[] = [];

  let whiteIndex = 0;

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const semitone = midi % 12;
    const octave   = Math.floor(midi / 12) - 1;
    const noteName = midiToNoteName(midi);

    if (WHITE_SEMITONES.has(semitone)) {
      whites.push({
        midiNote: midi,
        noteName,
        octave,
        isWhite: true,
        x:      whiteIndex * whiteWidth,
        width:  whiteWidth,
        height: wh,
      });
      whiteIndex++;
    } else {
      // Center = gap position + spec offset
      // Gap between prevWhite and nextWhite is at (prevWhiteIndex + 1) × whiteWidth
      const prevWhiteIndex = whiteIndex - 1;
      const specOffset = blackKeySpecOffsets[semitone] ?? 0;
      const centerX = (prevWhiteIndex + 1 + specOffset) * whiteWidth;

      blacks.push({
        midiNote: midi,
        noteName,
        octave,
        isWhite: false,
        x:      centerX - bw / 2,
        width:  bw,
        height: bh,
      });
    }
  }

  return {
    whites,
    blacks,
    totalWidth: whiteIndex * whiteWidth,
    whiteWidth,
    whiteHeight: wh,
  };
}

/** MIDI note → frequency (Hz), equal temperament, A4 = 440 Hz */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
