import Link from "next/link";
import type { KawaiModel } from "@/data/models";
import { cn } from "@/lib/utils";

interface ModelChipProps {
  model: KawaiModel;
  active?: boolean;
}

export function ModelChip({ model, active = false }: ModelChipProps) {
  return (
    <Link
      href={`/kawai-support/${model.slug}`}
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5",
        active
          ? "bg-[hsl(245,85%,58%)] border-[hsl(245,85%,58%)] text-white shadow-md shadow-indigo-500/20"
          : "bg-white border-[hsl(240,6%,88%)] text-[hsl(240,10%,4%)] hover:border-[hsl(245,85%,58%)] hover:text-[hsl(245,85%,58%)]"
      )}
      title={model.description}
    >
      {model.name}
    </Link>
  );
}
