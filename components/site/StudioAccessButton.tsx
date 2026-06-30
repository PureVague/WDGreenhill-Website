"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

/**
 * Floating admin shortcut → /studio. Bottom-LEFT so it never collides with the
 * music player (bottom-right). Hidden on the studio routes themselves.
 */
export function StudioAccessButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <div className="group fixed bottom-6 left-6 z-40">
      <Link
        href="/studio"
        aria-label="Open admin panel"
        className={[
          "flex h-12 w-12 items-center justify-center rounded-full",
          "bg-neutral-900/80 backdrop-blur-sm border border-white/10 shadow-lg",
          "text-[hsl(38,93%,50%)] transition-all duration-200",
          "hover:scale-110 hover:border-[hsl(38,93%,50%)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(245,85%,58%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(50,20%,98%)]",
        ].join(" ")}
      >
        <Settings className="h-5 w-5" />
      </Link>

      {/* Tooltip — fades in after a ~300ms hover delay, fades out immediately */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap",
          "rounded-md border border-white/10 bg-neutral-900/90 px-2.5 py-1 backdrop-blur-sm",
          "text-xs font-medium text-white",
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-300",
        ].join(" ")}
      >
        Admin
      </span>
    </div>
  );
}
