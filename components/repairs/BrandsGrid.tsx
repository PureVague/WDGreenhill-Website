"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { brands } from "@/data/brands";
import { BrandSuggestModal } from "./BrandSuggestModal";

export function BrandsGrid() {
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {sortedBrands.map((brand) => (
          <div
            key={brand.slug}
            className="group flex items-center gap-3 p-3 rounded-lg border border-[hsl(240,6%,88%)] bg-[hsl(50,20%,98%)] hover:border-[hsl(245,85%,58%)] hover:bg-[hsl(245,85%,58%)]/5 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-[hsl(245,85%,58%)] flex-shrink-0 group-hover:scale-125 transition-transform" />
            <span className="text-sm font-semibold text-[hsl(240,10%,4%)]">{brand.name}</span>
            {brand.slug === "kawai" && (
              <span className="ml-auto text-[10px] font-bold text-[hsl(245,85%,58%)] bg-[hsl(245,85%,58%)]/10 px-1.5 py-0.5 rounded">
                Official
              </span>
            )}
          </div>
        ))}

        {/* "Other" action tile — opens BrandSuggestModal */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-[hsl(240,6%,80%)] bg-transparent hover:border-[hsl(245,85%,58%)] hover:bg-[hsl(245,85%,58%)]/5 transition-all text-left w-full"
          aria-haspopup="dialog"
          aria-label="Ask us about a brand not listed"
        >
          <Plus className="w-3.5 h-3.5 text-[hsl(240,4%,60%)] group-hover:text-[hsl(245,85%,58%)] flex-shrink-0 transition-colors" />
          <div className="min-w-0">
            <span className="text-sm font-semibold text-[hsl(240,4%,50%)] group-hover:text-[hsl(245,85%,58%)] transition-colors block leading-tight">
              Other
            </span>
            <span className="text-xs text-[hsl(240,4%,60%)] group-hover:text-[hsl(245,85%,58%)]/70 transition-colors block leading-tight">
              Ask us about your brand
            </span>
          </div>
        </button>
      </div>

      <BrandSuggestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
