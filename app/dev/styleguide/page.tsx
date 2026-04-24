// Dev-only style guide page — not linked from production nav

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/SectionHeading";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";

export default function StyleGuidePage() {
  if (process.env.NODE_ENV === "production") {
    return <p className="p-8 text-center">Not available in production.</p>;
  }

  return (
    <div className="min-h-screen pt-28 pb-24 max-w-5xl mx-auto px-6">
      <h1 className="font-display font-bold text-5xl mb-2">WDGreenhill Style Guide</h1>
      <p className="text-[hsl(240,4%,46%)] mb-16">Design tokens, component variants, and typography specimens.</p>

      {/* Colour palette */}
      <section className="mb-16">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-6">Colour Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Primary (Indigo)", bg: "bg-[hsl(245,85%,58%)]", text: "text-white" },
            { name: "Secondary (Amber)", bg: "bg-[hsl(38,93%,50%)]", text: "text-[hsl(240,10%,4%)]" },
            { name: "Accent (Magenta)", bg: "bg-[hsl(330,80%,55%)]", text: "text-white" },
            { name: "Foreground", bg: "bg-[hsl(240,10%,4%)]", text: "text-white" },
            { name: "Background", bg: "bg-[hsl(50,20%,98%)] border border-[hsl(240,6%,88%)]", text: "text-[hsl(240,10%,4%)]" },
            { name: "Muted", bg: "bg-[hsl(240,5%,94%)]", text: "text-[hsl(240,4%,46%)]" },
            { name: "Indigo 50", bg: "bg-indigo-50 border border-indigo-100", text: "text-indigo-700" },
            { name: "Indigo 900", bg: "bg-indigo-900", text: "text-white" },
          ].map(({ name, bg, text }) => (
            <div key={name} className={`${bg} ${text} rounded-xl p-4`}>
              <p className="text-xs font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-6">Typography</h2>
        <div className="space-y-4">
          <p className="font-display font-bold" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: "0.9", letterSpacing: "-0.03em" }}>
            Display Heading
          </p>
          <p className="font-display font-bold text-5xl">Heading XL (5xl)</p>
          <p className="font-display font-bold text-3xl">Heading LG (3xl)</p>
          <p className="font-display font-bold text-2xl">Heading MD (2xl)</p>
          <p className="font-display font-bold text-xl">Heading SM (xl)</p>
          <p className="text-base text-[hsl(240,4%,36%)] leading-relaxed max-w-2xl">
            Body text — Inter/Geist. Used for paragraphs, descriptions, and interface copy. The quick brown fox jumps over the lazy dog. Comfortable line-height for long-form reading.
          </p>
          <p className="text-sm text-[hsl(240,4%,46%)]">Small / secondary text</p>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,50%)]">Label / eyebrow text</p>
          <p className="font-mono text-sm text-[hsl(240,4%,46%)]">Mono — SKU: KEP-221 · Part number display</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-16">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Default (Primary)</Button>
          <Button variant="secondary">Secondary (Amber)</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">XL</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-16">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-6">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="instock">In Stock</Badge>
          <Badge variant="outofstock">Out of Stock</Badge>
          <Badge variant="draft">Draft</Badge>
        </div>
      </section>

      {/* Section Headings */}
      <section className="mb-16">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-6">Section Headings</h2>
        <SectionHeading label="Label" title="Section Heading Default" subtitle="Subtitle text that provides more context about this section." />
        <SectionHeading label="Centred" title="Centred Variant" subtitle="Aligned to the centre." align="center" />
        <SectionHeading title="Large variant — no label or subtitle" size="lg" />
      </section>

      {/* Animated Counter */}
      <section className="mb-16">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-6">Animated Counter</h2>
        <div className="flex gap-12">
          <div>
            <p className="font-display font-bold text-5xl"><AnimatedCounter target={5000} suffix="+" /></p>
            <p className="text-sm text-[hsl(240,4%,56%)]">Manuals</p>
          </div>
          <div>
            <p className="font-display font-bold text-5xl"><AnimatedCounter target={45} suffix=" yrs" /></p>
            <p className="text-sm text-[hsl(240,4%,56%)]">Experience</p>
          </div>
        </div>
      </section>

      {/* Piano keys divider */}
      <section className="mb-16">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-[hsl(240,4%,56%)] mb-6">Decorative Elements</h2>
        <div className="piano-keys-divider" />
      </section>
    </div>
  );
}
