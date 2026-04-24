import type { Metadata } from "next";
import Link from "next/link";
import { Award, HelpCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ModelChip } from "@/components/shop/ModelChip";
import { kawaiModels, kawaiSeriesOrder, getModelsBySeries } from "@/data/models";

export const metadata: Metadata = {
  title: "Kawai Support Hub — Official UK Service Partner",
  description:
    "WDGreenhill is officially recommended by Kawai UK for digital piano servicing, spare parts, and non-warranty repairs. Find parts and support for all Kawai models.",
};

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

        {/* Model selector */}
        <div>
          <h2 className="font-display font-bold text-3xl mb-3">Select Your Model</h2>
          <p className="text-[hsl(240,4%,46%)] mb-10 max-w-2xl">
            All Kawai models currently supported. Click a model to see available parts, service manuals, and model-specific support information.
          </p>

          <div className="space-y-10">
            {kawaiSeriesOrder.map((series) => {
              const models = getModelsBySeries(series);
              if (models.length === 0) return null;
              return (
                <div key={series}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,50%)] mb-4">
                    {series} Series
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {models.map((model) => (
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
