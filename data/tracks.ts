export type Track = {
  id: string;
  title: string;
  composer: string;
  performer: string;
  source: string;
  licence: string;
  licenceUrl: string;
  attribution?: string; // Required for CC BY tracks
  file: string;
  durationSec: number;
};

/**
 * All tracks must be downloaded manually and placed in /public/audio/.
 * See README or the /credits page for licence details.
 *
 * Musopen recordings: public domain — no attribution required.
 * Pixabay Music: Pixabay Content Licence — free for commercial use, no attribution required.
 * Kevin MacLeod (incompetech): CC BY 4.0 — attribution required (see /credits).
 */
export const TRACKS: Track[] = [
  {
    id: "gymnopedie-1",
    title: "Gymnopédie No. 1",
    composer: "Erik Satie",
    performer: "Musopen Symphony",
    source: "Musopen",
    licence: "Public Domain",
    licenceUrl: "https://musopen.org/music/8010-3-gymnopedies/",
    file: "/audio/track-01.mp3",
    durationSec: 109,
  },
  {
    id: "clair-de-lune",
    title: "Clair de Lune",
    composer: "Claude Debussy",
    performer: "Musopen Symphony",
    source: "Musopen",
    licence: "Public Domain",
    licenceUrl: "https://musopen.org/music/2504-suite-bergamasque/",
    file: "/audio/track-02.mp3",
    durationSec: 113,
  },
  {
    id: "gnossienne-1",
    title: "Gnossienne No. 1",
    composer: "Erik Satie",
    performer: "Musopen Symphony",
    source: "Musopen",
    licence: "Public Domain",
    licenceUrl: "https://musopen.org/music/8008-trois-gnossiennes/",
    file: "/audio/track-03.mp3",
    durationSec: 142,
  },
  {
    id: "ambient-piano-04",
    title: "Ambient Piano (Track 4)", // TODO: confirm title
    composer: "Unknown",             // TODO: confirm composer
    performer: "Unknown",            // TODO: confirm performer
    source: "TBC",                   // TODO: confirm licence details
    licence: "TBC",                  // TODO: confirm licence details
    licenceUrl: "#",                 // TODO: confirm licence details
    file: "/audio/track-04.mp3",
    durationSec: 131,
  },
  {
    id: "ambient-piano-05",
    title: "Ambient Piano (Track 5)", // TODO: confirm title
    composer: "Unknown",              // TODO: confirm composer
    performer: "Unknown",             // TODO: confirm performer
    source: "TBC",                    // TODO: confirm licence details
    licence: "TBC",                   // TODO: confirm licence details
    licenceUrl: "#",                  // TODO: confirm licence details
    file: "/audio/track-05.mp3",
    durationSec: 141,
  },
];
