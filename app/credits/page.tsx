import type { Metadata } from "next";
import Link from "next/link";
import { tracks } from "@/data/tracks";

export const metadata: Metadata = {
  title: "Music Credits",
  description: "Credits for the ambient piano music used on this site.",
  robots: { index: false, follow: false },
};

export default function CreditsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="font-display font-bold text-4xl text-[hsl(240,10%,4%)] mb-4">
        Music Credits
      </h1>

      <p className="text-[hsl(240,4%,46%)] mb-12 leading-relaxed">
        The ambient piano music you hear on this site is sourced from Pixabay under the{" "}
        <a
          href="https://pixabay.com/service/license-summary/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[hsl(245,85%,58%)] transition-colors"
        >
          Pixabay Content License
        </a>
        . Pixabay does not require attribution, but we credit the artists below in
        appreciation of their work. The full licence terms are available{" "}
        <a
          href="https://pixabay.com/service/license-summary/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[hsl(245,85%,58%)] transition-colors"
        >
          here
        </a>
        .
      </p>

      <div className="divide-y divide-[hsl(240,6%,90%)]">
        {tracks.map((track) => (
          <div key={track.id} className="py-6 first:pt-0 last:pb-0">
            <h3 className="font-display font-semibold text-lg text-[hsl(240,10%,4%)] mb-1">
              {track.title}
            </h3>
            <p className="text-sm text-[hsl(240,4%,40%)] mb-3">
              {track.artist}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[hsl(240,4%,56%)]">
              <span>
                Source:{" "}
                <a
                  href={track.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[hsl(245,85%,58%)] transition-colors"
                >
                  {track.source}
                </a>
              </span>
              <span>
                Licence:{" "}
                <a
                  href={track.licenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[hsl(245,85%,58%)] transition-colors"
                >
                  {track.licence}
                </a>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-[hsl(240,6%,88%)] text-xs text-[hsl(240,4%,56%)]">
        <Link href="/" className="text-[hsl(245,85%,58%)] hover:underline">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
