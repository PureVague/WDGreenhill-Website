// ─────────────────────────────────────────────────────────────────────────────
// Kawai model catalogue
// ─────────────────────────────────────────────────────────────────────────────
// series values map to distinct product lines.
// KCP (old Classic Player branding) is normalised to "KDP" here.

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

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT 2026 MODELS (17 primary + DG30 + K-300 AR2)
// ─────────────────────────────────────────────────────────────────────────────

const currentModels: KawaiModel[] = [
  // ── ES Series (portable) ───────────────────────────────────────────────────
  {
    slug: "es60",
    name: "ES60",
    series: "ES",
    yearRange: "2022–present",
    description: "Entry-level portable digital piano with weighted keys and Kawai's Progressive Hammer Compact action.",
    status: "current",
    category: "portable",
    yearIntroduced: 2022,
    keyFeatures: [
      "Progressive Hammer Compact (PHC) action — 88 weighted keys",
      "Harmonic Imaging (HI) sound engine",
      "256-note polyphony",
      "Built-in speakers",
      "Bluetooth MIDI",
      "Lightweight and portable design",
    ],
  },
  {
    slug: "es120",
    name: "ES120",
    series: "ES",
    yearRange: "2021–present",
    description: "Successor to the popular ES110. Portable digital piano with the Responsive Hammer Compact II action and improved speaker system.",
    status: "current",
    category: "portable",
    yearIntroduced: 2021,
    predecessor: "es110",
    keyFeatures: [
      "Responsive Hammer Compact II (RHCII) action",
      "Harmonic Imaging (HI) sound engine",
      "192-note polyphony",
      "Bluetooth MIDI and Audio",
      "Improved dual speaker system",
      "Virtual Technician customisation",
    ],
  },
  {
    slug: "es520",
    name: "ES520",
    series: "ES",
    yearRange: "2021–present",
    description: "Mid-range portable digital piano with Bluetooth, multiple instrument sounds, and onboard speakers.",
    status: "current",
    category: "portable",
    yearIntroduced: 2021,
    keyFeatures: [
      "Responsive Hammer Compact II (RHCII) action",
      "Harmonic Imaging XL (HIXL) sound engine",
      "256-note polyphony",
      "Bluetooth MIDI and Audio",
      "40W 4-speaker system",
      "USB audio interface functionality",
    ],
  },
  {
    slug: "es920",
    name: "ES920",
    series: "ES",
    yearRange: "2022–present",
    description: "Flagship portable digital piano. RHIII action, Shigeru SK-EX and EX concert grand sounds, Bluetooth audio + MIDI.",
    status: "current",
    category: "portable",
    yearIntroduced: 2022,
    keyFeatures: [
      "Responsive Hammer III (RHIII) action with Let-Off simulation",
      "Shigeru Kawai SK-EX and Kawai EX concert grand samples",
      "256-note polyphony",
      "Bluetooth MIDI and Audio",
      "SK-EX Rendering sound engine",
      "USB audio interface functionality",
    ],
  },

  // ── KDP Series (compact home) ──────────────────────────────────────────────
  {
    slug: "kdp75",
    name: "KDP75",
    series: "KDP",
    yearRange: "2021–present",
    description: "Entry-level compact home digital piano with RHC action, Harmonic Imaging sound, and stand.",
    status: "current",
    category: "compact-home",
    yearIntroduced: 2021,
    keyFeatures: [
      "Responsive Hammer Compact (RHC) action",
      "Harmonic Imaging (HI) sound engine",
      "192-note polyphony",
      "Includes matching wooden stand and bench",
      "Bluetooth MIDI",
    ],
  },
  {
    slug: "kdp120",
    name: "KDP120",
    series: "KDP",
    yearRange: "2021–present",
    description: "Compact home digital piano with RHCII action, 88-key sampling, Bluetooth MIDI. Successor to KDP110.",
    status: "current",
    category: "compact-home",
    yearIntroduced: 2021,
    predecessor: "kdp110",
    keyFeatures: [
      "Responsive Hammer Compact II (RHCII) action",
      "Harmonic Imaging XL (HIXL) with 88-note sampling",
      "192-note polyphony",
      "Bluetooth MIDI and Audio",
      "Integrated wooden furniture stand",
    ],
  },

  // ── CN Series (mid-range home) ─────────────────────────────────────────────
  {
    slug: "cn201",
    name: "CN201",
    series: "CN",
    yearRange: "2022–present",
    description: "Improved RHIII keyboard action, Shigeru Kawai SK-EX and EX concert grand sounds, Bluetooth MIDI and Audio, OLED display. Replaced the CN29 in 2022.",
    status: "current",
    category: "mid-home",
    yearIntroduced: 2022,
    predecessor: "cn29",
    keyFeatures: [
      "Responsive Hammer III (RHIII) action with Let-Off simulation",
      "Shigeru Kawai SK-EX and Kawai EX concert grand sounds",
      "256-note polyphony",
      "OLED display with Virtual Technician",
      "Bluetooth MIDI and Audio",
      "Grand Feel Pedal System",
    ],
  },
  {
    slug: "cn301",
    name: "CN301",
    series: "CN",
    yearRange: "2022–present",
    description: "Higher-spec CN with upgraded speakers, larger OLED display, Grand Feel Pedal System, more instrument sounds, and full app connectivity. Replaced the CN39 in 2022.",
    status: "current",
    category: "mid-home",
    yearIntroduced: 2022,
    predecessor: "cn39",
    keyFeatures: [
      "Responsive Hammer III (RHIII) action with Let-Off simulation",
      "Shigeru Kawai SK-EX and EX concert grand sounds",
      "256-note polyphony",
      "Upgraded speaker system and OLED display",
      "Grand Feel Pedal System",
      "Bluetooth MIDI and Audio",
    ],
  },

  // ── CA Series (Concert Artist) ─────────────────────────────────────────────
  {
    slug: "ca401",
    name: "CA401",
    series: "CA",
    yearRange: "2022–present",
    description: "Entry-level Concert Artist with Grand Feel Compact wooden-key action and Shigeru SK-EX sounds.",
    status: "current",
    category: "concert-artist",
    yearIntroduced: 2022,
    keyFeatures: [
      "Grand Feel Compact (GFC) wooden-key action",
      "Shigeru Kawai SK-EX concert grand sound",
      "256-note polyphony",
      "Virtual Technician",
      "Bluetooth MIDI and Audio",
      "Premium furniture cabinet",
    ],
  },
  {
    slug: "ca501",
    name: "CA501",
    series: "CA",
    yearRange: "2022–present",
    description: "Mid-tier Concert Artist with Grand Feel Compact action, OLED display, redesigned 360° speaker system, new SK-EX Competition Grand sample.",
    status: "current",
    category: "concert-artist",
    yearIntroduced: 2022,
    // predecessor: "ca59", // TODO: confirm — CA59 not in current data
    keyFeatures: [
      "Grand Feel Compact (GFC) wooden-key action",
      "SK-EX Competition Grand and Shigeru SK-EX samples",
      "256-note polyphony",
      "OLED display",
      "Redesigned 360° Spatial Sound speaker system",
      "Bluetooth MIDI and Audio",
    ],
  },
  {
    slug: "ca701",
    name: "CA701",
    series: "CA",
    yearRange: "2022–present",
    description: "High-end Concert Artist with the flagship Grand Feel III wooden-key action, SK-EX Rendering sound engine, anti-glare LCD touchscreen, Bluetooth v5.",
    status: "current",
    category: "concert-artist",
    yearIntroduced: 2022,
    // predecessor: "ca79", // TODO: confirm — CA79 not in current data
    keyFeatures: [
      "Grand Feel III (GFIII) wooden-key action with Let-Off simulation",
      "SK-EX Rendering sound engine with 88-note sampling",
      "256-note polyphony",
      "Anti-glare LCD touchscreen display",
      "6-speaker system",
      "Bluetooth MIDI and Audio v5",
    ],
  },
  {
    slug: "ca901",
    name: "CA901",
    series: "CA",
    yearRange: "2022–present",
    description: "Top-of-line Concert Artist, distinguished by an authentic wooden TwinDrive soundboard speaker system on top of all CA701 features.",
    status: "current",
    category: "concert-artist",
    yearIntroduced: 2022,
    predecessor: "ca99",
    keyFeatures: [
      "Grand Feel III (GFIII) wooden-key action with Let-Off simulation",
      "SK-EX Rendering sound engine",
      "Unique TwinDrive wooden soundboard speaker system",
      "256-note polyphony",
      "Anti-glare LCD touchscreen display",
      "Bluetooth MIDI and Audio v5",
    ],
  },

  // ── MP Series (stage piano) ────────────────────────────────────────────────
  {
    slug: "mp7se",
    name: "MP7SE",
    series: "MP",
    yearRange: "2019–present",
    description: "Stage piano with RHIII action, deep editing and layering capabilities for live performance.",
    status: "current",
    category: "stage",
    yearIntroduced: 2019,
    predecessor: "mp7",
    keyFeatures: [
      "Responsive Hammer III (RHIII) action",
      "Extensive layering and splitting tools",
      "Comprehensive MIDI implementation",
      "SK-EX concert grand sounds",
      "Bluetooth MIDI",
    ],
  },
  {
    slug: "mp11se",
    name: "MP11SE",
    series: "MP",
    yearRange: "2019–present",
    description: "Flagship stage piano with Grand Feel wooden-key action — the only stage piano in this class with a real wooden action.",
    status: "current",
    category: "stage",
    yearIntroduced: 2019,
    predecessor: "mp11",
    keyFeatures: [
      "Grand Feel (GF) wooden-key action — unique in the stage piano market",
      "Shigeru Kawai SK-EX flagship concert grand sounds",
      "256-note polyphony",
      "Comprehensive layering, splitting, and MIDI control",
      "Bluetooth MIDI",
    ],
  },

  // ── VPC Series (controller) ────────────────────────────────────────────────
  {
    slug: "vpc1",
    name: "VPC1",
    series: "VPC",
    yearRange: "2013–present",
    description: "Virtual Piano Controller — premium 88-key MIDI controller with Grand Feel action, no internal sounds. Designed for use with software pianos like Pianoteq and Ivory.",
    status: "current",
    category: "controller",
    yearIntroduced: 2013,
    keyFeatures: [
      "Grand Feel (GF) wooden-key action — 88 keys",
      "No internal sounds — purely a MIDI controller",
      "Compatible with Pianoteq, Ivory, Ravenscroft, and other software pianos",
      "Let-Off simulation",
      "USB MIDI and standard MIDI output",
    ],
  },

  // ── NV Series (Novus hybrid) ───────────────────────────────────────────────
  {
    slug: "nv5s",
    name: "NV5S",
    series: "NV",
    yearRange: "2020–present",
    description: "Novus hybrid upright with a real Millennium III acoustic upright action married to digital sound generation.",
    status: "current",
    category: "hybrid",
    yearIntroduced: 2020,
    keyFeatures: [
      "Genuine Millennium III acoustic upright action",
      "Digital sound generation with Shigeru SK-EX and EX sounds",
      "256-note polyphony",
      "Real hammer escapement — identical feel to an acoustic upright",
      "Silent practice via headphones",
      "Bluetooth MIDI and Audio",
    ],
  },
  {
    slug: "nv10s",
    name: "NV10S",
    series: "NV",
    yearRange: "2020–present",
    description: "Flagship Novus hybrid grand-action piano — a real Millennium III grand-style action with digital piano sounds.",
    status: "current",
    category: "hybrid",
    yearIntroduced: 2020,
    keyFeatures: [
      "Genuine Millennium III grand-style acoustic action",
      "SK-EX Rendering sound engine",
      "256-note polyphony",
      "Authentic grand piano key feel and touch weight",
      "Silent practice via headphones",
      "Anti-glare LCD touchscreen",
    ],
  },

  // ── DG Series (furniture digital) ─────────────────────────────────────────
  {
    slug: "dg30",
    name: "DG30",
    series: "DG",
    yearRange: "2021–present",
    description: "Furniture-cabinet digital piano with high-end speaker system in an upright-piano-style cabinet, designed to be a dedicated home instrument.",
    status: "current",
    category: "anytime-upright",
    yearIntroduced: 2021,
    keyFeatures: [
      "Grand Feel Compact (GFC) wooden-key action",
      "Shigeru Kawai SK-EX concert grand sounds",
      "Full upright piano furniture cabinet",
      "Integrated speaker system tuned for the cabinet",
      "Bluetooth MIDI and Audio",
    ],
  },

  // ── K Series (acoustic with AnyTime digital system) ───────────────────────
  {
    slug: "k-300-ar2",
    name: "K-300 AR2",
    series: "K",
    yearRange: "2019–present",
    description: "Real Kawai K-300 acoustic upright with Kawai's AnyTime silent system and digital piano sounds for headphone practice.",
    status: "current",
    category: "acoustic-with-digital",
    yearIntroduced: 2019,
    keyFeatures: [
      "Genuine Kawai K-300 acoustic upright action",
      "AnyTime (AR) silent system — mute acoustic strings, play digitally",
      "Kawai digital piano sounds via headphones",
      "Full acoustic piano feel and performance",
      "Ideal for practice in shared living environments",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY MODELS (all models no longer in current production)
// ─────────────────────────────────────────────────────────────────────────────

const legacyModels: KawaiModel[] = [
  // ── CA Series (Concert Artist) — legacy ───────────────────────────────────
  { slug: "ca5",  name: "CA5",  series: "CA", yearRange: "2009–2012", description: "Earlier Concert Artist with Responsive Hammer Compact action.", status: "legacy" },
  { slug: "ca7",  name: "CA7",  series: "CA", yearRange: "2009–2013", description: "Premium Concert Artist with Grand Feel action and Shigeru Kawai sound samples.", status: "legacy" },
  { slug: "ca9",  name: "CA9",  series: "CA", yearRange: "2011–2014", description: "Flagship Concert Artist of its era with Grand Feel action.", status: "legacy" },
  { slug: "ca13", name: "CA13", series: "CA", yearRange: "2012–2015", description: "Entry Concert Artist with Grand Feel keyboard action and Harmonic Imaging sound technology.", status: "legacy" },
  { slug: "ca15", name: "CA15", series: "CA", yearRange: "2012–2016", description: "Mid-range Concert Artist with Shigeru Kawai SK-EX sound samples.", status: "legacy" },
  { slug: "ca17", name: "CA17", series: "CA", yearRange: "2013–2017", description: "Upper mid-range Concert Artist with Grand Feel II action and integrated Bluetooth.", status: "legacy" },
  { slug: "ca18", name: "CA18", series: "CA", yearRange: "2018–2021", description: "Successor to the CA17 with improved Grand Feel Compact action.", status: "legacy" },
  { slug: "ca48", name: "CA48", series: "CA", yearRange: "2018–2022", description: "Mid-level Concert Artist with Grand Feel action and 40W amplification.", status: "legacy" },
  { slug: "ca51", name: "CA51", series: "CA", yearRange: "2021–2022", description: "Entry Concert Artist with Grand Feel Compact action and Harmonic Imaging XL.", status: "legacy" },
  { slug: "ca58", name: "CA58", series: "CA", yearRange: "2019–2022", description: "Concert Artist with Grand Feel Compact action and wooden keys.", status: "legacy" },
  { slug: "ca63", name: "CA63", series: "CA", yearRange: "2013–2016", description: "Premium Concert Artist with Grand Feel II action and 4-speaker system.", status: "legacy" },
  { slug: "ca65", name: "CA65", series: "CA", yearRange: "2016–2019", description: "Upper Concert Artist with Grand Feel III action and Virtual Technician feature.", status: "legacy" },
  { slug: "ca67", name: "CA67", series: "CA", yearRange: "2019–2022", description: "Advanced Concert Artist with Grand Feel III action and Bluetooth MIDI/audio.", status: "legacy" },
  { slug: "ca71", name: "CA71", series: "CA", yearRange: "2021–2022", description: "Mid-range Concert Artist with Grand Feel action and wooden keys.", status: "legacy" },
  { slug: "ca78", name: "CA78", series: "CA", yearRange: "2022–2023", description: "High-end Concert Artist with Grand Feel III action and 4-speaker configuration.", status: "legacy" },
  { slug: "ca91", name: "CA91", series: "CA", yearRange: "2021–2022", description: "Premium Concert Artist with Grand Feel action and Shigeru Kawai sampling.", status: "legacy" },
  { slug: "ca93", name: "CA93", series: "CA", yearRange: "2016–2021", description: "High-end Concert Artist with Grand Feel Ebony and Ivory touch.", status: "legacy" },
  { slug: "ca95", name: "CA95", series: "CA", yearRange: "2018–2021", description: "Advanced Concert Artist with Grand Feel action and 6-speaker system.", status: "legacy" },
  { slug: "ca97", name: "CA97", series: "CA", yearRange: "2016–2019", description: "Flagship Concert Artist with Grand Feel III action and Shigeru Kawai EX grand.", status: "legacy" },
  { slug: "ca98", name: "CA98", series: "CA", yearRange: "2022–2023", description: "Concert Artist with Grand Feel III action and Spatial Headphone Sound.", status: "legacy" },
  { slug: "ca99", name: "CA99", series: "CA", yearRange: "2021–2022", description: "Top-of-line Concert Artist with Millennium III Grand Feel and full Shigeru sampling.", status: "legacy", successor: "ca901" },

  // ── CL Series (Classic) — legacy ──────────────────────────────────────────
  { slug: "cl20", name: "CL20", series: "CL", yearRange: "2005–2010", description: "Entry Classic series with Responsive Hammer II action.", status: "legacy" },
  { slug: "cl25", name: "CL25", series: "CL", yearRange: "2007–2012", description: "Mid Classic series digital piano.", status: "legacy" },
  { slug: "cl26", name: "CL26", series: "CL", yearRange: "2010–2014", description: "Classic series with improved sound and hammer action.", status: "legacy" },
  { slug: "cl30", name: "CL30", series: "CL", yearRange: "2012–2016", description: "Classic series with let-off simulation.", status: "legacy" },
  { slug: "cl35", name: "CL35", series: "CL", yearRange: "2016–2019", description: "Slimline Classic series with Harmonic Imaging.", status: "legacy" },
  { slug: "cl36", name: "CL36", series: "CL", yearRange: "2019–2023", description: "Classic series, compact upright design.", status: "legacy" },

  // ── CN Series (Concert Niveau) — legacy ───────────────────────────────────
  { slug: "cn2",  name: "CN2",  series: "CN", yearRange: "2004–2008", description: "Early Concert Niveau with Responsive Hammer action.", status: "legacy" },
  { slug: "cn3",  name: "CN3",  series: "CN", yearRange: "2005–2009", description: "Entry Concert Niveau with Responsive Hammer action.", status: "legacy" },
  { slug: "cn4",  name: "CN4",  series: "CN", yearRange: "2006–2010", description: "Concert Niveau with enhanced hammer escapement.", status: "legacy" },
  { slug: "cn21", name: "CN21", series: "CN", yearRange: "2010–2013", description: "Mid-range CN with Responsive Hammer II.", status: "legacy" },
  { slug: "cn22", name: "CN22", series: "CN", yearRange: "2012–2015", description: "Concert Niveau with improved HI sound samples.", status: "legacy" },
  { slug: "cn23", name: "CN23", series: "CN", yearRange: "2013–2016", description: "CN with Harmonic Imaging XL.", status: "legacy" },
  { slug: "cn24", name: "CN24", series: "CN", yearRange: "2014–2017", description: "Mid CN with wooden key option.", status: "legacy" },
  { slug: "cn25", name: "CN25", series: "CN", yearRange: "2015–2018", description: "CN with Bluetooth MIDI.", status: "legacy" },
  { slug: "cn27", name: "CN27", series: "CN", yearRange: "2017–2020", description: "CN with Grand Feel Compact action.", status: "legacy" },
  { slug: "cn29", name: "CN29", series: "CN", yearRange: "2019–2022", description: "CN with RHIII action and Virtual Technician software.", status: "legacy", successor: "cn201" },
  { slug: "cn31", name: "CN31", series: "CN", yearRange: "2021–2022", description: "CN with Responsive Hammer Compact II action.", status: "legacy" },
  { slug: "cn32", name: "CN32", series: "CN", yearRange: "2022–2023", description: "Mid CN with Grand Feel Compact action.", status: "legacy" },
  { slug: "cn33", name: "CN33", series: "CN", yearRange: "2022–2023", description: "CN with Harmonic Imaging XL sound.", status: "legacy" },
  { slug: "cn34", name: "CN34", series: "CN", yearRange: "2023–2024", description: "CN with enhanced piano sound samples.", status: "legacy" },
  { slug: "cn35", name: "CN35", series: "CN", yearRange: "2023–2024", description: "Upper CN with full Virtual Technician.", status: "legacy" },
  { slug: "cn37", name: "CN37", series: "CN", yearRange: "2023–2024", description: "Premium CN with Grand Feel Compact action.", status: "legacy" },
  { slug: "cn39", name: "CN39", series: "CN", yearRange: "2019–2022", description: "High CN with wooden keys and HIIX sound.", status: "legacy", successor: "cn301" },
  { slug: "cn41", name: "CN41", series: "CN", yearRange: "2024–2025", description: "CN with Grand Feel Compact III action.", status: "legacy" },
  { slug: "cn42", name: "CN42", series: "CN", yearRange: "2024–2025", description: "Advanced CN with Shigeru Kawai SK-EX samples.", status: "legacy" },
  { slug: "cn43", name: "CN43", series: "CN", yearRange: "2024–2025", description: "Top CN with 88-note Spatial Headphone Sound.", status: "legacy" },

  // ── CS Series — legacy ─────────────────────────────────────────────────────
  { slug: "cs3",  name: "CS3",  series: "CS", yearRange: "2005–2009", description: "Early CS with Responsive Hammer III.", status: "legacy" },
  { slug: "cs4",  name: "CS4",  series: "CS", yearRange: "2007–2011", description: "CS with improved pedal mechanism.", status: "legacy" },
  { slug: "cs6",  name: "CS6",  series: "CS", yearRange: "2009–2013", description: "CS with Harmonic Imaging sound.", status: "legacy" },
  { slug: "cs7",  name: "CS7",  series: "CS", yearRange: "2010–2014", description: "Premium CS with wooden key action.", status: "legacy" },
  { slug: "cs8",  name: "CS8",  series: "CS", yearRange: "2012–2016", description: "CS with extended sound library.", status: "legacy" },
  { slug: "cs9",  name: "CS9",  series: "CS", yearRange: "2014–2018", description: "Flagship CS with Grand Feel III action.", status: "legacy" },
  { slug: "cs10", name: "CS10", series: "CS", yearRange: "2012–2016", description: "CS with integrated stand and speaker system.", status: "legacy" },
  { slug: "cs11", name: "CS11", series: "CS", yearRange: "2014–2018", description: "CS with wooden key Grand Feel Compact action.", status: "legacy" },

  // ── ES Series (portable) — legacy ─────────────────────────────────────────
  { slug: "es1",   name: "ES1",   series: "ES", yearRange: "2002–2006", description: "Early portable stage piano with Responsive Hammer action.", status: "legacy" },
  { slug: "es3",   name: "ES3",   series: "ES", yearRange: "2004–2008", description: "Portable stage piano with grade-weighted action.", status: "legacy" },
  { slug: "es4",   name: "ES4",   series: "ES", yearRange: "2006–2010", description: "ES with improved grand feel action.", status: "legacy" },
  { slug: "es5",   name: "ES5",   series: "ES", yearRange: "2008–2012", description: "ES with Harmonic Imaging sound.", status: "legacy" },
  { slug: "es6",   name: "ES6",   series: "ES", yearRange: "2010–2013", description: "Stage piano with Grand Feel action.", status: "legacy" },
  { slug: "es7",   name: "ES7",   series: "ES", yearRange: "2011–2015", description: "Advanced stage piano with extensive sound library.", status: "legacy" },
  { slug: "es8",   name: "ES8",   series: "ES", yearRange: "2015–2020", description: "Professional stage piano with 88-note Grand Feel action.", status: "legacy" },
  { slug: "es100", name: "ES100", series: "ES", yearRange: "2015–2018", description: "Portable ES with 192-voice polyphony.", status: "legacy" },
  { slug: "es110", name: "ES110", series: "ES", yearRange: "2018–2021", description: "Portable with Responsive Hammer Compact II and Bluetooth.", status: "legacy", successor: "es120" },

  // ── KDP Series (compact home) — legacy ────────────────────────────────────
  { slug: "kcp80",  name: "KCP80",  series: "KDP", yearRange: "2006–2010", description: "Entry-level compact digital piano with Responsive Hammer action.", status: "legacy" },
  { slug: "kdp80",  name: "KDP80",  series: "KDP", yearRange: "2011–2015", description: "KDP entry digital piano with integrated stand.", status: "legacy" },
  { slug: "kdp90",  name: "KDP90",  series: "KDP", yearRange: "2013–2017", description: "KDP mid-range with Responsive Hammer II.", status: "legacy" },
  { slug: "kdp110", name: "KDP110", series: "KDP", yearRange: "2017–2021", description: "KDP with Harmonic Imaging XL and twin speakers.", status: "legacy", successor: "kdp120" },

  // ── MP Series (stage piano) — legacy ──────────────────────────────────────
  { slug: "mp4",   name: "MP4",   series: "MP", yearRange: "2005–2009", description: "Professional stage piano with 88-key Responsive Hammer action.", status: "legacy" },
  { slug: "mp5",   name: "MP5",   series: "MP", yearRange: "2006–2010", description: "MP with wooden key action.", status: "legacy" },
  { slug: "mp6",   name: "MP6",   series: "MP", yearRange: "2008–2012", description: "Pro stage piano with extended sound palette.", status: "legacy" },
  { slug: "mp7",   name: "MP7",   series: "MP", yearRange: "2012–2016", description: "MP with balanced hammer action and MIDI.", status: "legacy", successor: "mp7se" },
  { slug: "mp8",   name: "MP8",   series: "MP", yearRange: "2008–2013", description: "MP with Grand Feel action.", status: "legacy" },
  { slug: "mp8ii", name: "MP8ii", series: "MP", yearRange: "2013–2017", description: "Revised MP8 with improved key action and sound.", status: "legacy" },
  { slug: "mp10",  name: "MP10",  series: "MP", yearRange: "2016–2020", description: "MP with Grand Feel III action and high-resolution sampling.", status: "legacy" },
  { slug: "mp11",  name: "MP11",  series: "MP", yearRange: "2015–2019", description: "Flagship stage piano with Shigeru Kawai SK-EX samples.", status: "legacy", successor: "mp11se" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Merged catalogue
// ─────────────────────────────────────────────────────────────────────────────

export const kawaiModels: KawaiModel[] = [...currentModels, ...legacyModels];

// Series display order — current-era series first, then legacy-only series
export const kawaiSeriesOrder: KawaiSeries[] = [
  "CA", "CN", "ES", "KDP", "MP", "VPC", "NV", "DG", "K",
  "CL", "CS", "Other",
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getModelBySlug(slug: string): KawaiModel | undefined {
  return kawaiModels.find((m) => m.slug === slug);
}

export function getModelsBySeries(series: string): KawaiModel[] {
  return kawaiModels.filter((m) => m.series === series);
}

export function getCurrentModels(): KawaiModel[] {
  return kawaiModels.filter((m) => m.status === "current");
}

export function getLegacyModels(): KawaiModel[] {
  return kawaiModels.filter((m) => m.status === "legacy");
}

export function getCurrentModelsBySeries(series: KawaiSeries): KawaiModel[] {
  return kawaiModels.filter((m) => m.series === series && m.status === "current");
}

export function getLegacyModelsBySeries(series: KawaiSeries): KawaiModel[] {
  return kawaiModels.filter((m) => m.series === series && m.status === "legacy");
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
