"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { cn } from "@/lib/utils";

type SortKey = "relevance" | "price-asc" | "price-desc" | "name-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name A–Z" },
];

export function ShopSearch() {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.compatibleModels.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    if (selectedCategory) result = result.filter((p) => p.categories.includes(selectedCategory));
    if (inStockOnly) result = result.filter((p) => p.stock > 0);

    result = [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [query, selectedBrand, selectedCategory, inStockOnly, sort]);

  const hasFilters = query || selectedBrand || selectedCategory || inStockOnly;

  function clearAll() {
    setQuery("");
    setSelectedBrand("");
    setSelectedCategory("");
    setInStockOnly(false);
    setSort("relevance");
  }

  return (
    <section aria-labelledby="all-products-heading" className="mt-20 border-t border-[hsl(240,6%,88%)] pt-16">
      <h2 id="all-products-heading" className="text-2xl font-display font-bold mb-8">
        All Products
      </h2>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(240,4%,56%)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by part name, SKU, brand, or model…"
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-[hsl(240,6%,88%)] bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(245,85%,58%)]"
            aria-label="Search products"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-11 px-3 rounded-lg border border-[hsl(240,6%,88%)] bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(245,85%,58%)] text-[hsl(240,10%,4%)]"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={cn(
            "h-11 px-4 rounded-lg border text-sm font-semibold flex items-center gap-2 transition-colors",
            filtersOpen
              ? "border-[hsl(245,85%,58%)] bg-[hsl(245,85%,58%)] text-white"
              : "border-[hsl(240,6%,88%)] bg-white text-[hsl(240,10%,4%)] hover:border-[hsl(245,85%,58%)]"
          )}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && !query && (
            <span className="w-2 h-2 rounded-full bg-[hsl(38,93%,50%)]" />
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {filtersOpen && (
        <div className="mb-6 p-5 rounded-xl border border-[hsl(240,6%,88%)] bg-[hsl(240,5%,98%)] grid sm:grid-cols-3 gap-5">
          {/* Brand */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[hsl(240,4%,46%)] mb-2">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[hsl(240,6%,88%)] bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(245,85%,58%)]"
            >
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[hsl(240,4%,46%)] mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[hsl(240,6%,88%)] bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(245,85%,58%)]"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* In stock */}
          <div className="flex flex-col justify-center">
            <label className="block text-xs font-bold uppercase tracking-wider text-[hsl(240,4%,46%)] mb-2">
              Availability
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[hsl(240,6%,88%)] accent-[hsl(245,85%,58%)]"
              />
              <span className="text-sm font-semibold">In stock only</span>
            </label>
          </div>
        </div>
      )}

      {/* Results meta */}
      <div className="flex items-center justify-between mb-6 text-sm text-[hsl(240,4%,56%)]">
        <span>
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {hasFilters ? " matching your search" : " in catalogue"}
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[hsl(245,85%,58%)] font-semibold hover:underline"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold text-[hsl(240,4%,46%)] mb-2">No parts found</p>
          <p className="text-sm text-[hsl(240,4%,56%)]">
            Try a different search term, or{" "}
            <a href="/contact" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
              contact us
            </a>{" "}
            — we hold thousands of unlisted parts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
