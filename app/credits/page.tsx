import type { Metadata } from "next";
import Link from "next/link";
import { TRACKS } from "@/data/tracks";

export const metadata: Metadata = {
  title: "Music Credits",
  description: "Licensing and attribution for background music used on this site.",
  robots: { index: false, follow: false },
};

export default function CreditsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="font-display font-bold text-4xl text-[hsl(240,10%,4%)] mb-4">
        Music Credits
      </h1>
      <p className="text-[hsl(240,4%,46%)] mb-12 leading-relaxed">
        This site plays soft ambient piano music to enhance the browsing experience.
        All tracks used are royalty-free and/or licensed for commercial use. Full
        attribution details are listed below.
      </p>

      <div className="space-y-6">
        {TRACKS.map((track, i) => (
          <div
            key={track.id}
            className="flex flex-col gap-1 p-5 rounded-xl border border-[hsl(240,6%,88%)] bg-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[hsl(240,10%,4%)]">
                  <span className="text-[hsl(240,4%,56%)] font-mono text-sm mr-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {track.title}
                </p>
                <p className="text-sm text-[hsl(240,4%,46%)] mt-0.5">
                  {track.composer}
                  {track.performer !== track.composer && ` · Performed by ${track.performer}`}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[hsl(245,85%,58%)]/10 text-[hsl(245,85%,58%)] whitespace-nowrap flex-shrink-0">
                {track.licence}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-[hsl(240,4%,60%)]">
              <span>Source: {track.source}</span>
              <a
                href={track.licenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[hsl(245,85%,58%)] underline transition-colors"
              >
                Licence details ↗
              </a>
            </div>

            {track.attribution && (
              <p className="text-xs text-[hsl(240,4%,56%)] mt-2 italic border-l-2 border-[hsl(245,85%,58%)] pl-3">
                Attribution required: {track.attribution}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-[hsl(240,6%,88%)] text-xs text-[hsl(240,4%,56%)] space-y-1">
        <p>
          Public domain recordings sourced from{" "}
          <a href="https://musopen.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-[hsl(245,85%,58%)]">
            Musopen.org
          </a>{" "}
          — a non-profit dedicated to freeing music from copyright.
        </p>
        <p>
          Additional tracks from{" "}
          <a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[hsl(245,85%,58%)]">
            Pixabay Music
          </a>{" "}
          under the Pixabay Content Licence (free for commercial use, no attribution required).
        </p>
        <p className="mt-4">
          <Link href="/" className="text-[hsl(245,85%,58%)] hover:underline">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
