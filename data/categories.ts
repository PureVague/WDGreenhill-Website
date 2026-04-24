export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
}

export const categories: Category[] = [
  { slug: "semiconductors", name: "Semiconductors", description: "IC chips, divider chips, TOS chips, rare logic ICs — SAJ110, M108, M208, MO86, M147 and more.", icon: "cpu" },
  { slug: "transistors-diodes", name: "Transistors & Diodes", description: "Bipolar transistors, FETs, diodes, TO-5 packaged and standard through-hole components.", icon: "zap" },
  { slug: "pcbs", name: "PCBs", description: "Replacement printed circuit boards — main boards, display boards, key scanning boards.", icon: "circuit-board" },
  { slug: "potentiometers", name: "Potentiometers", description: "Slider, rotary, and trimmer potentiometers for keyboards, organs, and digital pianos.", icon: "sliders-horizontal" },
  { slug: "keys-keyframes", name: "Keys & Key Frames", description: "Replacement piano keys, key contacts, key bushings, and complete key assemblies.", icon: "piano" },
  { slug: "pedal-parts", name: "Pedal Parts", description: "Sustain pedals, damper mechanisms, pedal springs, pedal boards, and pedal contacts.", icon: "footprints" },
  { slug: "speakers", name: "Speakers", description: "Replacement speaker drivers, tweeters, woofers, and amplifier modules.", icon: "speaker" },
  { slug: "power-supplies", name: "Power Supplies", description: "AC adapters, internal PSU boards, transformer assemblies, and fuse holders.", icon: "plug" },
  { slug: "knobs-buttons", name: "Knobs & Buttons", description: "Replacement knobs, push-buttons, slider caps, and panel buttons.", icon: "circle-dot" },
  { slug: "switches", name: "Switches", description: "Tactile switches, rotary switches, slide switches, and toggle switches.", icon: "toggle-left" },
  { slug: "cabinet-parts", name: "Cabinet Parts", description: "Hinges, fallboards, music rests, end cheeks, and cabinet hardware.", icon: "box" },
  { slug: "hammond-oil", name: "Hammond Oil", description: "Genuine Hammond organ oil for tonewheel and motor lubrication.", icon: "droplets" },
  { slug: "owners-manuals", name: "Owner's Manuals", description: "Original owner's manuals for keyboards, organs, and digital pianos.", icon: "book-open" },
  { slug: "service-manuals", name: "Service Manuals", description: "Technical service manuals and schematics for technicians.", icon: "wrench" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
