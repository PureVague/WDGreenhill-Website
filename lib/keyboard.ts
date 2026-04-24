/**
 * Piano keyboard layout builder.
 *
 * Generates the correct 88-key layout (or any subset) with proper
 * black-key positions using the standard chromatic/diatonic pattern.
 *
 * Keyboard starts at A0 (MIDI 21) and ends at C8 (MIDI 108).
 */

export type WhiteKey = {
  type: "white";
  midiNote: number;
  noteName: string;  // e.g. "C4"
  whiteIndex: number; // 0-based position among white keys
  x: number;
  width: number;
  height: number;
};

export type BlackKey = {
  type: "black";
  midiNote: number;
  noteName: string;
  x: number;
  width: number;
  height: number;
};

export type KeyboardLayout = {
  whites: WhiteKey[];
  blacks: BlackKey[];
  totalWidth: number;
};

// Chromatic scale: which semitones are white keys (0=C,2=D,4=E,5=F,7=G,9=A,11=B)
const WHITE_SEMITONES = new Set([0, 2, 4, 5, 7, 9, 11]);
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Black key offsets within each octave group (fraction of white key width from left of previous white)
// C#=between C&D, D#=between D&E, F#=between F&G, G#=between G&A, A#=between A&B
// These are the centroid positions as fraction of white-key width
const BLACK_KEY_OFFSETS: Record<number, number> = {
  1:  0.67,  // C# — 2/3 right of C
  3:  0.33,  // D# — 1/3 right of D (from left of D's right edge)
  6:  0.67,  // F#
  8:  0.50,  // G#
  10: 0.33,  // A#
};

function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const semitone = midi % 12;
  return `${NOTE_NAMES[semitone]}${octave}`;
}

/**
 * Build keyboard layout.
 *
 * @param startMidi  First MIDI note (default 21 = A0)
 * @param endMidi    Last MIDI note (default 108 = C8)
 * @param whiteWidth Width of each white key in px
 * @param whiteHeight Height of white keys
 * @param blackWidthRatio  Black key width as fraction of white key width (default 0.6)
 * @param blackHeightRatio Black key height as fraction of white key height (default 0.62)
 */
export function buildKeyboard(
  startMidi = 21,
  endMidi = 108,
  whiteWidth = 24,
  whiteHeight = 120,
  blackWidthRatio = 0.6,
  blackHeightRatio = 0.62,
): KeyboardLayout {
  const whites: WhiteKey[] = [];
  const blacks: BlackKey[] = [];

  let whiteIndex = 0;

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const semitone = midi % 12;
    const noteName = midiToNoteName(midi);

    if (WHITE_SEMITONES.has(semitone)) {
      whites.push({
        type: "white",
        midiNote: midi,
        noteName,
        whiteIndex,
        x: whiteIndex * whiteWidth,
        width: whiteWidth,
        height: whiteHeight,
      });
      whiteIndex++;
    } else {
      // Black key: find the previous white key's position to anchor
      const prevWhiteIndex = whiteIndex - 1;
      const offset = BLACK_KEY_OFFSETS[semitone] ?? 0.5;
      const bw = whiteWidth * blackWidthRatio;
      const bh = whiteHeight * blackHeightRatio;
      const centerX = prevWhiteIndex * whiteWidth + whiteWidth * offset;

      blacks.push({
        type: "black",
        midiNote: midi,
        noteName,
        x: centerX - bw / 2,
        width: bw,
        height: bh,
      });
    }
  }

  return {
    whites,
    blacks,
    totalWidth: whiteIndex * whiteWidth,
  };
}

/** MIDI note → frequency (Hz) using equal temperament, A4 = 440Hz */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
