import Link from "next/link";
import type { Brand } from "@/data/brands";
import { cn } from "@/lib/utils";

interface BrandTileProps {
  brand: Brand;
  className?: string;
}

// Each brand gets a deterministic colour pair based on its slug
const COLOUR_PAIRS = [
  { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", hover: "hover:bg-indigo-600 hover:border-indigo-600 hover:text-white" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", hover: "hover:bg-amber-500 hover:border-amber-500 hover:text-white" },
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", hover: "hover:bg-emerald-600 hover:border-emerald-600 hover:text-white" },
  { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", hover: "hover:bg-rose-600 hover:border-rose-600 hover:text-white" },
  { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", hover: "hover:bg-violet-600 hover:border-violet-600 hover:text-white" },
  { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", hover: "hover:bg-sky-600 hover:border-sky-600 hover:text-white" },
];

function hashSlug(slug: string): number {
  return slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function BrandTile({ brand, className }: BrandTileProps) {
  const colours = COLOUR_PAIRS[hashSlug(brand.slug) % COLOUR_PAIRS.length];

  return (
    <Link
      href={`/shop/brand/${brand.slug}`}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        colours.bg,
        colours.border,
        colours.hover,
        className
      )}
    >
      <span
        className={cn(
          "text-xl font-display font-bold transition-colors duration-200",
          colours.text,
          "group-hover:text-white"
        )}
      >
        {brand.name}
      </span>
      <span
        className={cn(
          "text-xs leading-snug line-clamp-2 transition-colors duration-200",
          colours.text,
          "group-hover:text-white/80"
        )}
      >
        {brand.description}
      </span>
    </Link>
  );
}
