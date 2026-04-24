import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench, Search, Package, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { getFeaturedProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Europe's Largest Digital Piano Parts Stockist | WD Greenhill & Co",
  description:
    "WD Greenhill & Co — Europe's largest independent stockist of digital piano, keyboard & organ parts. Official Kawai UK service partner. Est. 1980. 5,000+ manuals, 30+ brands.",
};

const STATS = [
  { value: 5000, suffix: "+", label: "Service & Owner's Manuals" },
  { value: 45, suffix: " Years", label: "In Business" },
  { value: 30, suffix: "+", label: "Brands Supported" },
  { value: 1000, suffix: "s", label: "Parts In Stock" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Search,
    title: "Find Your Part",
    body: "Search by brand, model, category, or part number. Browse 1,000s of genuine replacement components for instruments from the 1960s to today.",
  },
  {
    step: "02",
    icon: Package,
    title: "Order Online",
    body: "Add to your cart and check out securely via Stripe. All prices shown ex. VAT — VAT is calculated and added at checkout.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "We Ship Worldwide",
    body: "Orders despatched from Essex within 1–2 working days. UK, EU, and rest of world shipping available. Rare parts quoted on request.",
  },
];

const FEATURED_BRANDS = [
  "Kawai", "Yamaha", "Roland", "Technics", "Hammond", "Wurlitzer",
  "Korg", "Kurzweil", "Fender Rhodes", "Dexibell", "Leslie", "Thomas",
];

const TESTIMONIALS = [
  {
    quote: "I had given up finding a replacement damper felt for my 1980 Wurlitzer. WDGreenhill had it in stock, shipped next day. Incredible.",
    author: "Martin K.",
    role: "Piano technician, Birmingham",
  },
  {
    quote: "These are the people to call for rare IC chips. I needed an SAJ110 for a Farfisa restoration and they had three on the shelf. Brilliant service.",
    author: "Claire S.",
    role: "Vintage keyboard restorer, Edinburgh",
  },
  {
    quote: "As an independent service engineer, WDGreenhill is my first call for Kawai parts. Fast, accurate, and they actually know the instruments.",
    author: "David T.",
    role: "Kawai-accredited technician, London",
  },
];

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="flex flex-col">
      {/* ═══ HERO ═══ */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[hsl(240,10%,4%)]"
        aria-label="Hero"
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(hsl(245,85%,58%) 1px, transparent 1px), linear-gradient(90deg, hsl(245,85%,58%) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
          aria-hidden="true"
        />
        {/* Radial glow — indigo top-left */}
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(245,85%,58%) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Radial glow — amber bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(38,93%,50%) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Piano keys decoration at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 opacity-30"
          style={{
            background: "repeating-linear-gradient(90deg, #fff 0px, #fff 14px, transparent 14px, transparent 20px, #000 20px, #000 34px, transparent 34px, transparent 40px)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 pt-40">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <div className="animate-fade-up inline-flex items-center gap-2 mb-8 rounded-full border border-[hsl(245,85%,65%)] bg-[hsl(245,85%,58%)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(245,85%,75%)]"
              style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              <Award className="w-3 h-3" />
              Official Kawai UK Service Partner · Est. 1980
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up font-display font-bold text-white leading-[0.9] mb-8"
              style={{ fontSize: "clamp(3rem, 10vw, 8rem)", letterSpacing: "-0.03em", animationDelay: "250ms", animationFillMode: "both" }}
            >
              Keeping digital
              <br />
              <span className="text-[hsl(38,93%,50%)]">pianos alive</span>
              <br />
              since 1980.
            </h1>

            {/* Subhead */}
            <p className="animate-fade-up text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-12"
              style={{ animationDelay: "400ms", animationFillMode: "both" }}>
              Europe&apos;s largest independent stockist of digital piano, keyboard & organ parts.
              5,000+ manuals, 30+ brands, 45 years of expertise. Parts for instruments dating
              back to the 1960s.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up flex flex-wrap gap-4"
              style={{ animationDelay: "550ms", animationFillMode: "both" }}>
              <Button size="xl" variant="secondary" asChild>
                <Link href="/shop">
                  Browse Parts
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-[hsl(240,10%,4%)]"
                asChild
              >
                <Link href="/repairs/request">Request a Repair</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BY THE NUMBERS ═══ */}
      <section className="bg-[hsl(245,85%,58%)] text-white py-14" aria-label="Statistics">
        <div className="max-w-7xl mx-auto px-6">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-none mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </dd>
                <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ BRAND MARQUEE ═══ */}
      <section className="bg-white border-y border-[hsl(240,6%,88%)] py-8 overflow-hidden" aria-label="Brands we support">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[hsl(240,4%,56%)] mb-6">
          Brands We Support
        </p>
        <div className="relative">
          <div className="flex animate-marquee gap-12 whitespace-nowrap" aria-hidden="true">
            {[...FEATURED_BRANDS, ...FEATURED_BRANDS].map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="text-2xl font-display font-bold text-[hsl(240,6%,80%)] hover:text-[hsl(245,85%,58%)] transition-colors cursor-default select-none"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full" aria-labelledby="how-it-works-title">
        <SectionHeading
          label="Simple process"
          title="How it works"
          subtitle="Whether you&apos;re a professional technician or a first-time home repair, ordering is straightforward."
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-8 mt-4">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, body }, i) => (
            <ScrollReveal key={step} delay={i * 120}>
            <div
              className="relative p-8 rounded-2xl border border-[hsl(240,6%,88%)] bg-white hover:border-[hsl(245,85%,58%)] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group h-full"
            >
              <div className="absolute top-6 right-6 font-display font-bold text-5xl text-[hsl(240,6%,92%)] group-hover:text-[hsl(245,85%,58%)]/10 transition-colors duration-300" aria-hidden="true">
                {step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[hsl(245,85%,58%)] flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{title}</h3>
              <p className="text-[hsl(240,4%,46%)] leading-relaxed text-sm">{body}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ KAWAI PARTNERSHIP BANNER ═══ */}
      <section className="bg-[hsl(240,10%,4%)] py-16 px-6" aria-label="Kawai partnership">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl border border-[hsl(245,85%,58%)]/30 bg-[hsl(245,85%,58%)]/5 p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,50%)] mb-3">
                Official Partner
              </p>
              <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-4 leading-tight">
                Kawai UK&apos;s recommended<br />service partner.
              </h2>
              <p className="text-white/60 max-w-lg leading-relaxed">
                WDGreenhill is officially recommended by Kawai UK for all non-warranty digital piano
                servicing, spare parts supply, and technical repairs. We hold genuine Kawai parts
                for current and discontinued models.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/kawai-support">
                  Kawai Support Hub
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-[hsl(240,10%,4%)]"
                asChild
              >
                <Link href="/repairs/request">Request a Repair</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full" aria-labelledby="featured-products-title">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <SectionHeading
            label="Popular parts"
            title="Featured Products"
            className="mb-0"
          />
          <Button variant="outline" asChild>
            <Link href="/shop">
              View All Parts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, i) => (
            <ScrollReveal key={product.sku} delay={i * 80}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-[hsl(50,20%,96%)] py-24 px-6" aria-labelledby="testimonials-title">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="What people say"
            title="Trusted by technicians & collectors"
            align="center"
            subtitle="From vintage organ restorers to professional Kawai service engineers — we're the parts supplier the industry relies on."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ quote, author, role }, i) => (
              <ScrollReveal key={author} delay={i * 100}>
              <figure
                className="bg-white rounded-2xl p-8 border border-[hsl(240,6%,88%)] shadow-sm h-full"
              >
                <blockquote>
                  <p className="text-[hsl(240,10%,4%)] leading-relaxed italic mb-6">
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption>
                  <p className="font-bold text-sm">{author}</p>
                  <p className="text-xs text-[hsl(240,4%,56%)]">{role}</p>
                </figcaption>
              </figure>
              </ScrollReveal>
            ))}
          </div>
          <p className="text-center text-xs text-[hsl(240,4%,60%)] mt-6">
            * Testimonials are representative of customer feedback. Names changed for privacy.
          </p>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-20 px-6 bg-white" aria-label="Newsletter signup">
        <div className="max-w-xl mx-auto text-center">
          <SectionHeading
            label="Stay informed"
            title="New parts & manuals arrivals"
            subtitle="We regularly add new old stock and newly sourced parts. Sign up to hear about additions relevant to your instruments."
            align="center"
          />
          <NewsletterForm />
          <p className="text-xs text-[hsl(240,4%,60%)] mt-3">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
