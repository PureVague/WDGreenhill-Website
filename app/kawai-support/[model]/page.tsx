import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { getModelBySlug } from "@/data/models";
import { products } from "@/data/products";
import { manuals } from "@/data/manuals";

interface Props {
  params: Promise<{ model: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  const m = getModelBySlug(model);
  if (!m) return {};
  return {
    title: `Kawai ${m.name} Parts & Support`,
    description: `Genuine spare parts, service manuals, and technical support for the Kawai ${m.name}. WDGreenhill — official Kawai UK service partner.`,
  };
}

export default async function KawaiModelPage({ params }: Props) {
  const { model } = await params;
  const m = getModelBySlug(model);
  if (!m) notFound();

  const modelProducts = products.filter((p) => p.compatibleModels.includes(model));
  const modelManuals = manuals.filter(
    (man) => man.brand.toLowerCase() === "kawai" && man.model.toLowerCase().includes(m.name.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/kawai-support" className="hover:text-[hsl(245,85%,58%)] transition-colors">Kawai Support</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">{m.name}</span>
        </nav>

        <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-[hsl(245,85%,58%)] bg-[hsl(245,85%,58%)]/10 px-4 py-2 text-xs font-bold text-[hsl(245,85%,58%)] uppercase tracking-[0.15em]">
          {m.series} Series · {m.yearRange}
        </div>

        <SectionHeading
          title={`Kawai ${m.name}`}
          subtitle={m.description}
        />

        {/* Quick actions */}
        <div className="flex flex-wrap gap-4 mb-14">
          <Button asChild>
            <Link href="/repairs/request">
              <Wrench className="w-4 h-4" />
              Request Support for this Model
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/kawai-support/faq">
              View Kawai FAQ
            </Link>
          </Button>
        </div>

        {/* Parts */}
        <section aria-labelledby="parts-heading" className="mb-16">
          <h2 id="parts-heading" className="font-display font-bold text-2xl mb-6">
            Available Parts ({modelProducts.length})
          </h2>
          {modelProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {modelProducts.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[hsl(240,5%,96%)] border border-[hsl(240,6%,88%)]">
              <p className="text-[hsl(240,4%,46%)] mb-2">
                No parts are currently listed for the {m.name} on our website.
              </p>
              <p className="text-sm text-[hsl(240,4%,56%)]">
                We hold an extensive inventory of Kawai parts not yet listed online. Please email{" "}
                <a href="mailto:sales@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
                  sales@wdgreenhill.com
                </a>{" "}
                with your part number and we&apos;ll check our stock.
              </p>
            </div>
          )}
        </section>

        {/* Manuals */}
        {modelManuals.length > 0 && (
          <section aria-labelledby="manuals-heading" className="mb-16">
            <h2 id="manuals-heading" className="font-display font-bold text-2xl mb-6">
              Available Manuals
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {modelManuals.map((manual) => (
                <div
                  key={manual.id}
                  className="flex items-start gap-4 p-5 rounded-xl border border-[hsl(240,6%,88%)] bg-white"
                >
                  <FileText className="w-5 h-5 text-[hsl(245,85%,58%)] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{manual.brand} {manual.model}</p>
                    <p className="text-xs text-[hsl(240,4%,56%)] capitalize mb-3">
                      {manual.type.replace("-", " ")} Manual · {manual.format.toUpperCase()}
                    </p>
                    <Link
                      href="/manuals"
                      className="text-xs font-semibold text-[hsl(245,85%,58%)] hover:underline"
                    >
                      View in Library →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Firmware link */}
        <div className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white mb-8">
          <h3 className="font-semibold mb-2">Firmware Updates</h3>
          <p className="text-sm text-[hsl(240,4%,46%)] mb-3">
            Kawai releases firmware updates for many models. Download the latest firmware for your {m.name} directly from Kawai.
          </p>
          <a
            href="https://www.kawai-global.com/support/updates"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[hsl(245,85%,58%)] hover:underline underline-offset-2"
          >
            kawai-global.com/support/updates →
          </a>
        </div>
      </div>
    </div>
  );
}
