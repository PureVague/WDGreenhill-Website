import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BrandTile } from "@/components/shop/BrandTile";
import { ShopSearch } from "@/components/shop/ShopSearch";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { Cpu, Zap, CircuitBoard, SlidersHorizontal, Music2, Footprints, Speaker, Plug, CircleDot, ToggleLeft, Box, Droplets, BookOpen, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Digital Piano & Organ Parts",
  description:
    "Browse 1,000s of replacement parts for digital pianos, keyboards, and organs. Filter by category or by make. Kawai, Yamaha, Roland, Hammond, Wurlitzer, and more.",
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  semiconductors: Cpu,
  "transistors-diodes": Zap,
  pcbs: CircuitBoard,
  potentiometers: SlidersHorizontal,
  "keys-keyframes": Music2,
  "pedal-parts": Footprints,
  speakers: Speaker,
  "power-supplies": Plug,
  "knobs-buttons": CircleDot,
  switches: ToggleLeft,
  "cabinet-parts": Box,
  "hammond-oil": Droplets,
  "owners-manuals": BookOpen,
  "service-manuals": Wrench,
};

export default function ShopPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-4">
            <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Shop</span>
          </nav>
          <SectionHeading
            label="Parts & Manuals"
            title="Browse Our Catalogue"
            subtitle="Over 1,000 replacement parts, semiconductors, manuals, and consumables for digital pianos, keyboards, and electronic organs. Browse by category or by manufacturer."
          />
        </div>

        {/* By Category */}
        <section aria-labelledby="by-category">
          <h2 id="by-category" className="text-2xl font-display font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? CircuitBoard;
              return (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-[hsl(240,6%,88%)] bg-white text-center hover:border-[hsl(245,85%,58%)] hover:bg-[hsl(245,85%,58%)]/5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-[hsl(245,85%,58%)]/10 flex items-center justify-center group-hover:bg-[hsl(245,85%,58%)] transition-colors duration-200">
                    <Icon className="w-6 h-6 text-[hsl(245,85%,58%)] group-hover:text-white transition-colors duration-200" />
                  </div>
                  <span className="text-sm font-semibold text-[hsl(240,10%,4%)] leading-tight">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="piano-keys-divider my-16" aria-hidden="true" />

        {/* By Make */}
        <section aria-labelledby="by-brand">
          <h2 id="by-brand" className="text-2xl font-display font-bold mb-8">Browse by Make</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {brands.map((brand) => (
              <BrandTile key={brand.slug} brand={brand} />
            ))}
          </div>
        </section>

        {/* Live search + filter across all products */}
        <ShopSearch />
      </div>
    </div>
  );
}
