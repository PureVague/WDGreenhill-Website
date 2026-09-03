// ─────────────────────────────────────────────────────────────────────────────
// Kawai model catalogue — types and presentation constants
// ─────────────────────────────────────────────────────────────────────────────
// The model records themselves now live in Sanity — see lib/sanity/data.ts,
// which fetches them and maps them back into this shape. What stays here is
// the shape itself plus SERIES_LABELS, which is presentation copy rather than
// content and so has no business in the CMS.
//
// series values map to distinct product lines.
// KCP (old Classic Player branding) is normalised to "KDP".

export type KawaiSeries = "CA" | "CL" | "CN" | "CS" | "DG" | "ES" | "K" | "KDP" | "MP" | "NV" | "VPC" | "Other";
export type KawaiCategory =
  | "portable"
  | "compact-home"
  | "mid-home"
  | "concert-artist"
  | "stage"
  | "controller"
  | "hybrid"
  | "anytime-upright"
  | "acoustic-with-digital";

export interface KawaiModel {
  slug:             string;
  name:             string;
  series:           KawaiSeries;
  yearRange:        string;           // display string e.g. "2022–present"
  description:      string;           // one-sentence summary (= shortDescription) — kept for compat
  status:           "current" | "legacy";

  // Extended fields — present on current models, optional on legacy
  category?:        KawaiCategory;
  yearIntroduced?:  number;
  yearDiscontinued?: number;
  keyFeatures?:     string[];
  longDescription?: string;
  cabinetFinishes?: string[];
  weight?:          string;
  dimensions?:      { width: string; depth: string; height: string };

  // Family tree navigation (slug references)
  predecessor?:     string;           // slug of the model this replaced
  successor?:       string;           // slug of the model that replaced this
}

// Series display labels (human-friendly)
export const SERIES_LABELS: Partial<Record<KawaiSeries, string>> = {
  CA:  "CA — Concert Artist",
  CN:  "CN — Concert Niveau",
  ES:  "ES — Portable",
  KDP: "KDP — Compact Home",
  MP:  "MP — Stage Piano",
  VPC: "VPC — MIDI Controller",
  NV:  "NV — Novus Hybrid",
  DG:  "DG — Digital Grand Cabinet",
  K:   "K — Acoustic with AnyTime",
  CL:  "CL — Classic",
  CS:  "CS — CS Series",
};
