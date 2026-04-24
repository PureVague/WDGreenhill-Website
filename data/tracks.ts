export type Track = {
  id: string;
  title: string;
  artist: string;
  source: "Pixabay";
  sourceUrl: string;
  licence: "Pixabay Content License";
  licenceUrl: string;
  file: string;
  durationSec: number;
};

export const tracks: Track[] = [
  {
    id: "the-mountain-inspiring-background-piano",
    title: "Inspiring Background Piano",
    artist: "The_Mountain",
    source: "Pixabay",
    sourceUrl: "https://pixabay.com/music/?id=380683",
    licence: "Pixabay Content License",
    licenceUrl: "https://pixabay.com/service/license-summary/",
    file: "/audio/the_mountain-inspiring-background-piano-380683.mp3",
    durationSec: 141,
  },
  {
    id: "atlasaudio-sentimental-piano",
    title: "Sentimental Piano",
    artist: "AtlasAudio",
    source: "Pixabay",
    sourceUrl: "https://pixabay.com/music/?id=512258",
    licence: "Pixabay Content License",
    licenceUrl: "https://pixabay.com/service/license-summary/",
    file: "/audio/atlasaudio-sentimental-piano-512258.mp3",
    durationSec: 109,
  },
  {
    id: "leberch-background-piano",
    title: "Background Piano",
    artist: "leberch",
    source: "Pixabay",
    sourceUrl: "https://pixabay.com/music/?id=445170",
    licence: "Pixabay Content License",
    licenceUrl: "https://pixabay.com/service/license-summary/",
    file: "/audio/leberch-background-piano-445170.mp3",
    durationSec: 113,
  },
  {
    id: "nastelbom-emotional-piano",
    title: "Emotional Piano",
    artist: "NastelBom",
    source: "Pixabay",
    sourceUrl: "https://pixabay.com/music/?id=495887",
    licence: "Pixabay Content License",
    licenceUrl: "https://pixabay.com/service/license-summary/",
    file: "/audio/nastelbom-emotional-piano-495887.mp3",
    durationSec: 142,
  },
  {
    id: "paulyudin-piano-piano-music",
    title: "Piano Piano Music",
    artist: "PaulYudin",
    source: "Pixabay",
    sourceUrl: "https://pixabay.com/music/?id=508963",
    licence: "Pixabay Content License",
    licenceUrl: "https://pixabay.com/service/license-summary/",
    file: "/audio/paulyudin-piano-piano-music-508963.mp3",
    durationSec: 131,
  },
];

// Backward-compat alias used by existing imports
export const TRACKS = tracks;
