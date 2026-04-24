import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
  const isLight = variant === "light";
  return (
    <div className={cn("flex items-start gap-2.5 leading-none select-none", className)}>
      {/* Accent bar */}
      <div
        className={cn(
          "w-0.5 self-stretch rounded-full mt-0.5 mb-0.5 transition-colors duration-150",
          isLight ? "bg-indigo-400" : "bg-[hsl(245,85%,58%)]"
        )}
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-display font-bold text-xl tracking-tight transition-colors duration-150",
            isLight ? "text-white" : "text-[hsl(240,10%,4%)]"
          )}
        >
          WD Greenhill
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-150",
            isLight ? "text-amber-300/90" : "text-[hsl(38,93%,50%)]"
          )}
        >
          &amp; Co Ltd
        </span>
      </div>
    </div>
  );
}
