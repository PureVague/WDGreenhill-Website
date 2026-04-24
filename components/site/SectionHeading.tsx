import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  size?: "default" | "lg";
}

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
  align = "left",
  size = "default",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <p
          className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,50%)]"
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          "font-display font-bold text-[hsl(240,10%,4%)] leading-tight",
          size === "default" ? "text-3xl md:text-4xl lg:text-5xl" : "text-4xl md:text-5xl lg:text-6xl"
        )}
      >
        {title}
      </h2>
      {/* Accent underline */}
      <div
        className={cn(
          "mt-3 h-1 bg-[hsl(245,85%,58%)] rounded-full",
          align === "center" ? "mx-auto w-16" : "w-16"
        )}
      />
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[hsl(240,4%,46%)] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
