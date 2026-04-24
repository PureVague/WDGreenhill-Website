export interface Brand {
  slug: string;
  name: string;
  description: string;
  featured: boolean;
}

export const brands: Brand[] = [
  { slug: "baldwin", name: "Baldwin", description: "American piano manufacturer, est. 1862.", featured: false },
  { slug: "bontempi", name: "Bontempi", description: "Italian keyboard and organ manufacturer.", featured: false },
  { slug: "casio", name: "Casio", description: "Japanese electronics and digital keyboard brand.", featured: true },
  { slug: "conn", name: "Conn", description: "Historic American organ and wind instrument maker.", featured: false },
  { slug: "crumar", name: "Crumar", description: "Italian electronic organ and synthesizer brand.", featured: false },
  { slug: "dexibell", name: "Dexibell", description: "Modern Italian digital piano innovator.", featured: false },
  { slug: "elka", name: "Elka", description: "Italian electronic organ and keyboard brand.", featured: false },
  { slug: "eminent", name: "Eminent", description: "Dutch electronic organ manufacturer.", featured: false },
  { slug: "farfisa", name: "Farfisa", description: "Iconic Italian combo organ manufacturer.", featured: false },
  { slug: "fender-rhodes", name: "Fender Rhodes", description: "Legendary electric piano, beloved by jazz & soul musicians.", featured: true },
  { slug: "gem", name: "GEM", description: "General Music Corporation — Italian arranger keyboards.", featured: false },
  { slug: "godwin", name: "Godwin", description: "Italian electronic organ brand.", featured: false },
  { slug: "gulbransen", name: "Gulbransen", description: "American organ manufacturer, ceased operations 1990s.", featured: false },
  { slug: "hammond", name: "Hammond", description: "The definitive tonewheel organ, est. 1935.", featured: true },
  { slug: "hohner", name: "Hohner", description: "German instrument maker — melodicas, accordions, clavinets.", featured: false },
  { slug: "jen", name: "Jen", description: "Italian electronic organ brand.", featured: false },
  { slug: "kawai", name: "Kawai", description: "Premium Japanese digital piano maker — official UK service partner.", featured: true },
  { slug: "kimball", name: "Kimball", description: "American piano and organ manufacturer, closed 1996.", featured: false },
  { slug: "korg", name: "Korg", description: "Japanese synthesizer and digital piano innovator.", featured: true },
  { slug: "kurzweil", name: "Kurzweil", description: "American high-end digital piano brand, founded by Ray Kurzweil.", featured: true },
  { slug: "leslie", name: "Leslie", description: "Rotary speaker cabinets — the definitive organ sound.", featured: false },
  { slug: "lowrey", name: "Lowrey", description: "American home organ manufacturer, closed 1990s.", featured: false },
  { slug: "orla", name: "Orla", description: "Italian home organ and digital piano brand.", featured: false },
  { slug: "rodgers", name: "Rodgers", description: "American classical/liturgical digital organ manufacturer.", featured: false },
  { slug: "roland", name: "Roland", description: "Japanese digital piano and synthesizer giant.", featured: true },
  { slug: "technics", name: "Technics", description: "Panasonic's premium keyboard and digital piano line.", featured: true },
  { slug: "thomas", name: "Thomas", description: "Thomas Organ Corporation — the business WDGreenhill was founded to support.", featured: false },
  { slug: "viscount", name: "Viscount", description: "Italian classical and liturgical organ manufacturer.", featured: false },
  { slug: "wurlitzer", name: "Wurlitzer", description: "Iconic American electric piano and jukebox maker.", featured: true },
  { slug: "yamaha", name: "Yamaha", description: "Japan's largest musical instrument manufacturer.", featured: true },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
