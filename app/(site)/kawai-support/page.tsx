import type { Metadata } from "next";
import Link from "next/link";
import { Award, HelpCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ModelChip } from "@/components/shop/ModelChip";
import {
  kawaiSeriesOrder,
  getCurrentModelsBySeries,
  getLegacyModelsBySeries,
  SERIES_LABELS,
  type KawaiSeries,
} from "@/data/models";

export const metadata: Metadata = {
  title: "Kawai Support Hub — Official UK Service Partner",
  description:
    "WDGreenhill is officially recommended by Kawai UK for digital piano servicing, spare parts, and non-warranty repairs. Find parts and support for all Kawai models — current and legacy.",
};

// Series that have at least one current model
const CURRENT_SERIES: KawaiSeries[] = ["CA", "CN", "ES", "KDP", "MP", "VPC", "NV", "DG", "K"];
// Series that are legacy-only
const LEGACY_ONLY_SERIES: KawaiSeries[] = ["CL", "CS"];
// Series with both current and legacy (show legacy group separately)
const MIXED_SERIES: KawaiSeries[] = ["CA", "CN", "ES", "KDP", "MP"];

export default function KawaiSupportPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full bg-[hsl(245,85%,58%)] text-white px-5 py-2.5 text-sm font-bold">
            <Award className="w-4 h-4" />
            Official Kawai UK Service Partner
          </div>
          <SectionHeading
            title="Kawai Support Hub"
            subtitle="WDGreenhill is officially recommended by Kawai UK for all non-warranty digital piano repairs, spare parts supply, and technical support. We stock genuine Kawai parts for current and discontinued models across all series."
          />
          <p className="text-[hsl(240,4%,36%)] mt-2 max-w-2xl">
            Whether your Kawai was bought yesterday or twenty years ago, we can help. Find your model below.
          </p>
        </div>

        {/* CTAs */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <Link
            href="/kawai-support/faq"
            className="group flex items-start gap-5 p-8 rounded-2xl border-2 border-[hsl(240,6%,88%)] bg-white hover:border-[hsl(245,85%,58%)] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-[hsl(245,85%,58%)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(245,85%,58%)] transition-colors">
              <HelpCircle className="w-6 h-6 text-[hsl(245,85%,58%)] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl mb-2">Frequently Asked Questions</h3>
              <p className="text-sm text-[hsl(240,4%,46%)] leading-relaxed">
                Answers to the most common technical questions about Kawai digital pianos — firmware updates, pedal behaviour, action noise, and more.
              </p>
            </div>
          </Link>

          <Link
            href="/repairs/request"
            className="group flex items-start gap-5 p-8 rounded-2xl bg-[hsl(245,85%,58%)] text-white hover:bg-[hsl(245,85%,50%)] hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl mb-2">Request a Repair</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Submit a support request with your Kawai model, serial number, and a description of the issue. We&apos;ll respond within one working day.
              </p>
            </div>
          </Link>
        </div>

        {/* ── CURRENT MODELS ──────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="font-display font-bold text-3xl mb-1">Current Models</h2>
          <p className="text-[hsl(240,4%,46%)] mb-10 max-w-2xl text-sm">
            The full 2026 Kawai production lineup. Click a model to see available parts, service manuals, and model-specific support.
          </p>

          <div className="space-y-8">
            {CURRENT_SERIES.map((series) => {
              const models = getCurrentModelsBySeries(series);
              if (models.length === 0) return null;
              return (
                <div key={series}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,50%)] mb-3">
                    {SERIES_LABELS[series] ?? `${series} Series`}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {models.map((model) => (
                      <ModelChip key={model.slug} model={model} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LEGACY MODELS ───────────────────────────────────────────────── */}
        <div className="border-t border-[hsl(240,6%,88%)] pt-14 mb-10">
          <h2 className="font-display font-bold text-3xl mb-1">Legacy Models</h2>
          <p className="text-[hsl(240,4%,46%)] mb-10 max-w-2xl text-sm">
            No longer in production, but still fully serviced and supported. WDGreenhill holds genuine parts for instruments going back to the 1980s. Don&apos;t see yours? Contact us.
          </p>

          <div className="space-y-8">
            {/* Series that have legacy entries (from current-series or legacy-only) */}
            {[...MIXED_SERIES, "VPC", ...LEGACY_ONLY_SERIES].map((series) => {
              const models = getLegacyModelsBySeries(series as KawaiSeries);
              if (models.length === 0) return null;
              return (
                <div key={`legacy-${series}`}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(240,4%,56%)] mb-3">
                    {SERIES_LABELS[series as KawaiSeries] ?? `${series} Series`}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {models
                      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                      .map((model) => (
                        <ModelChip key={model.slug} model={model} />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-16 p-8 rounded-2xl bg-[hsl(240,10%,4%)] text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,50%)] mb-3">
            Don&apos;t see your model?
          </p>
          <p className="text-white/70 leading-relaxed mb-4">
            We hold parts for many discontinued Kawai models not yet listed on this website. If your model isn&apos;t shown, please{" "}
            <a href="mailto:support@wdgreenhill.com" className="text-[hsl(245,85%,75%)] underline underline-offset-2">
              contact our support team
            </a>{" "}
            with your model number and serial number — we&apos;ll check our full inventory.
          </p>
          <Button variant="secondary" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
