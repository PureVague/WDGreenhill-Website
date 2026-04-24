import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "About WD Greenhill & Co — 45 Years of Expertise",
  description:
    "The story of WD Greenhill & Co Ltd — founded by Bill Greenhill in 1980, continued by Nigel Greenhill today. Europe's largest independent digital piano parts stockist.",
};

const TIMELINE = [
  {
    year: "1980",
    title: "The business is born",
    body: "Bill Greenhill purchases the entire Thomas Organ Corporation parts inventory from Whirlpool following the closure of Thomas's UK operation. Committed to honouring all outstanding warranty obligations — some valid for up to five years — he establishes \"Thomas Spares\" from the family home.",
  },
  {
    year: "1980s",
    title: "An industry in transition",
    body: "The home organ industry collapses rapidly. Lowrey, Conn, Kimball, Gulbransen — one by one, the major American organ manufacturers close their doors. Bill acquires parts stock from each as they exit the market, building what will become the largest independent organ parts archive in Europe.",
  },
  {
    year: "1990s",
    title: "Digital pianos arrive",
    body: "As digital piano technology matures and the consumer market grows, WDGreenhill expands its focus to include Yamaha, Roland, Kawai, Technics, and Casio digital piano parts. The archive of service manuals — already vast for organs — grows rapidly with every new manufacturer served.",
  },
  {
    year: "2000s",
    title: "Official Kawai partnership",
    body: "Kawai UK formally recommends WDGreenhill as its preferred non-warranty service partner and spare parts supplier for the UK market. A relationship that continues to this day — we are Kawai UK&apos;s recommended contact for all owners seeking parts or technical assistance outside the manufacturer warranty period.",
  },
  {
    year: "January 2013",
    title: "Bill Greenhill passes away",
    body: "The founder of the business, Bill Greenhill, passes away after a short illness. His son Nigel Greenhill — who had grown up with the business — takes over day-to-day operations and continues the work his father began more than three decades earlier.",
  },
  {
    year: "Today",
    title: "Carrying the tradition forward",
    body: "Under Nigel Greenhill's leadership, the business holds over 5,000 service and owner's manuals, thousands of mechanical and electronic components, and rare semiconductor stock for instruments dating back to the 1960s. The collection continues to grow.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">About</span>
        </nav>
        <SectionHeading
          label="Est. 1980"
          title="Europe's Largest Independent Stockist"
          subtitle="The story of a parts business built on principle — fulfilling warranty obligations for instruments whose manufacturer had ceased trading, and never stopping."
          size="lg"
        />
      </div>

      {/* Full-bleed dark pull quote */}
      <div className="bg-[hsl(240,10%,4%)] py-20 px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="font-display font-bold text-white leading-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)" }}>
            &ldquo;Bill purchased the entire Thomas parts stock and committed to honouring every outstanding warranty — some valid for up to five years. That commitment is still the foundation of everything we do.&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-[hsl(38,93%,50%)] font-semibold">
            — Nigel Greenhill, continuing his father&apos;s work
          </figcaption>
        </div>
      </div>

      {/* History timeline */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-display font-bold text-3xl mb-12">Company History</h2>
        <div className="space-y-0">
          {TIMELINE.map(({ year, title, body }, i) => (
            <div key={year} className="flex gap-8 pb-12">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[hsl(245,85%,58%)] flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className="flex-1 w-px bg-[hsl(240,6%,88%)] mt-3" />
                )}
              </div>
              {/* Content */}
              <div className="pb-0 pt-2 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,50%)] mb-1">{year}</p>
                <h3 className="font-display font-bold text-xl mb-3">{title}</h3>
                <p className="text-[hsl(240,4%,36%)] leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What we stock */}
      <div className="bg-[hsl(50,20%,96%)] py-20 px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-10">What We Hold</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "5,000+ Manuals",
                body: "Service manuals, owner&apos;s manuals, and schematics from over 100 manufacturers — dating from the 1960s to the present day. Many are unique copies held nowhere else.",
              },
              {
                title: "Rare Semiconductors",
                body: "SAJ110, M108, M208, MO86, M147, TO-5 packaged dividers, and dozens of other ICs that can&apos;t be found anywhere else. Many are NOS (new old stock) from the original manufacturer.",
              },
              {
                title: "Mechanical Components",
                body: "Keys, contacts, bushings, pedal mechanisms, switches, potentiometers, knobs, hinges, fallboards, speaker drivers, and power supplies — covering every instrument we support.",
              },
              {
                title: "Hammond Oil",
                body: "Genuine Hammond organ oil for tonewheel and motor lubrication — the authentic product specified by the factory, available in 250ml and 1 litre quantities.",
              },
              {
                title: "PCBs & Modules",
                body: "Replacement printed circuit boards for many models — CPU boards, key scanning boards, display boards, and amplifier modules. Tested before despatch.",
              },
              {
                title: "Thomas Organ Parts",
                body: "Original parts from the Thomas Organ Corporation inventory purchased in 1980 — including TOS (Thomas Organ Semiconductor) divider chips in the original TO-5 metal can. Possibly the last remaining stock in the world.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="bg-white p-8 rounded-2xl border border-[hsl(240,6%,88%)]">
                <h3 className="font-display font-bold text-xl mb-3">{title}</h3>
                <p className="text-[hsl(240,4%,36%)] leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why independent repair matters */}
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display font-bold text-3xl mb-6">Why Independent Repair Matters</h2>
        <div className="prose prose-lg max-w-none text-[hsl(240,4%,36%)] space-y-5">
          <p>
            A digital piano is not a disposable object. The finest instruments — a Kawai CA99, a Yamaha Clavinova, a Roland RD-2000 — are precision-engineered tools that will serve a musician well for decades if maintained properly. A faulty key contact, a worn pedal mechanism, or a failed power supply need not mean the end of an instrument&apos;s life. Yet without access to the right parts and the knowledge to use them, that is exactly what happens.
          </p>
          <p>
            The electronics industry has a poor record of supporting its products beyond a few years after production ends. When a manufacturer ceases making a model — or ceases trading entirely — the supply of spare parts dries up rapidly. The instrument becomes landfill not because it is worn out, but because nobody holds the specific resistor, the correct keybed contact strip, the proprietary IC chip it needs.
          </p>
          <p>
            WDGreenhill exists precisely to prevent this. For 45 years we have systematically acquired parts stock from closing manufacturers, built relationships with component suppliers worldwide, and maintained an archive of technical documentation that would otherwise have been lost. The result is that a Hammond organ from 1965, a Thomas electronic organ from 1975, a Kawai digital piano from 2008 — all can be returned to service, kept in use, kept making music.
          </p>
          <p>
            We believe that the right instrument, properly maintained, is a lifetime companion. Our mission is to keep those instruments playable for as long as their owners want them.
          </p>
        </div>
      </div>
    </div>
  );
}
