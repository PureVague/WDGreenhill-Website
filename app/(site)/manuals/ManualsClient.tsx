"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, FileText, Book, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/SectionHeading";
import { manuals, searchManuals, type ManualType } from "@/data/manuals";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<ManualType, string> = {
  owner: "Owner's Manual",
  service: "Service Manual",
  schematic: "Schematic",
};

const TYPE_ICONS: Record<ManualType, React.ComponentType<{ className?: string }>> = {
  owner: Book,
  service: Wrench,
  schematic: FileText,
};

export function ManualsClient() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ManualType | "all">("all");

  const filtered = (query.trim() ? searchManuals(query) : manuals).filter(
    (m) => typeFilter === "all" || m.type === typeFilter
  );

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Manuals Library</span>
        </nav>

        <SectionHeading
          label="Archive"
          title="Over 5,000 Manuals In Stock"
          subtitle="We hold service manuals, owner's manuals, and schematics for over 100 manufacturers — many dating back to the 1960s. The selection below represents a fraction of our archive. If your manual isn't listed, email us."
        />

        {/* Notice */}
        <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          <strong>Full library:</strong> Only a selection of our 5,000+ manuals is searchable here. For manuals not shown, email{" "}
          <a href="mailto:info@wdgreenhill.com" className="underline underline-offset-2 font-semibold">
            info@wdgreenhill.com
          </a>{" "}
          with brand and model — we&apos;ll check our archive.
        </div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(240,4%,56%)]" />
            <Input
              type="search"
              placeholder="Search by brand or model…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              aria-label="Search manuals"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "owner", "service", "schematic"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold border transition-colors",
                  typeFilter === type
                    ? "bg-[hsl(245,85%,58%)] text-white border-[hsl(245,85%,58%)]"
                    : "bg-white border-[hsl(240,6%,88%)] text-[hsl(240,4%,46%)] hover:border-[hsl(245,85%,58%)]"
                )}
              >
                {type === "all" ? "All" : TYPE_LABELS[type as ManualType]}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[hsl(240,4%,56%)] mb-6">
          {filtered.length} manual{filtered.length !== 1 ? "s" : ""} shown
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[hsl(240,6%,88%)]">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(240,5%,96%)] border-b border-[hsl(240,6%,88%)]">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-[hsl(240,4%,46%)] text-xs uppercase tracking-wider">Brand</th>
                <th className="text-left px-5 py-3.5 font-semibold text-[hsl(240,4%,46%)] text-xs uppercase tracking-wider">Model</th>
                <th className="text-left px-5 py-3.5 font-semibold text-[hsl(240,4%,46%)] text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 font-semibold text-[hsl(240,4%,46%)] text-xs uppercase tracking-wider">Format</th>
                <th className="text-left px-5 py-3.5 font-semibold text-[hsl(240,4%,46%)] text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 font-semibold text-[hsl(240,4%,46%)] text-xs uppercase tracking-wider">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(240,6%,92%)] bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[hsl(240,4%,56%)]">
                    No manuals found for &ldquo;{query}&rdquo;. Try a different search, or email{" "}
                    <a href="mailto:info@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline">
                      info@wdgreenhill.com
                    </a>
                    .
                  </td>
                </tr>
              ) : (
                filtered.map((manual) => {
                  const Icon = TYPE_ICONS[manual.type];
                  return (
                    <tr key={manual.id} className="hover:bg-[hsl(245,85%,58%)]/3 transition-colors">
                      <td className="px-5 py-4 font-semibold">{manual.brand}</td>
                      <td className="px-5 py-4">
                        {manual.model}
                        {manual.year && <span className="text-xs text-[hsl(240,4%,60%)] ml-2">({manual.year})</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[hsl(245,85%,58%)]" />
                          {TYPE_LABELS[manual.type]}
                        </span>
                      </td>
                      <td className="px-5 py-4 uppercase text-xs font-mono font-semibold">
                        {manual.format}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {formatPrice(manual.price)}
                        <span className="text-xs text-[hsl(240,4%,56%)] font-normal ml-1">ex. VAT</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={manual.inStock ? "instock" : "outofstock"}>
                          {manual.inStock ? "In Stock" : "Enquire"}
                        </Badge>
                        {manual.notes && (
                          <p className="text-xs text-[hsl(240,4%,56%)] mt-1">{manual.notes}</p>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[hsl(240,4%,56%)] mt-6 text-center">
          All manuals are supplied as copies. Originals are preserved in our archive.
          Prices shown ex. VAT. UK VAT applies at checkout.
        </p>
      </div>
    </div>
  );
}
