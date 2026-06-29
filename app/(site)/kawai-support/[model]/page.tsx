import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, Wrench, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { getModelBySlug, kawaiModels, SERIES_LABELS } from "@/data/models";
import { products } from "@/data/products";
import { manuals } from "@/data/manuals";

interface Props {
  params: Promise<{ model: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wdgreenhill.com";

export async function generateStaticParams() {
  return kawaiModels.map((m) => ({ model: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  const m = getModelBySlug(model);
  if (!m) return {};
  return {
    title: `Kawai ${m.name} — Service, Repairs & Parts | WDGreenhill & Co`,
    description: `${m.description} WDGreenhill & Co is Kawai UK's official service partner for non-warranty repairs and parts.`,
    openGraph: {
      title: `Kawai ${m.name} — Parts & Support`,
      description: m.description,
    },
  };
}

export default async function KawaiModelPage({ params }: Props) {
  const { model: slug } = await params;
  const m = getModelBySlug(slug);
  if (!m) notFound();

  const modelProducts = products.filter((p) => p.compatibleModels.includes(slug));
  const modelManuals  = manuals.filter(
    (man) =>
      man.brand.toLowerCase() === "kawai" &&
      man.model.toLowerCase().includes(m.name.toLowerCase()),
  );

  const predecessor = m.predecessor ? getModelBySlug(m.predecessor) : undefined;
  const successor   = m.successor   ? getModelBySlug(m.successor)   : undefined;

  const isCurrent = m.status === "current";
  const seriesLabel = SERIES_LABELS[m.series] ?? `${m.series} Series`;

  // Product JSON-LD structured data
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Kawai ${m.name}`,
    description: m.description,
    brand: {
      "@type": "Brand",
      name: "Kawai",
    },
    offers: modelProducts.length > 0
      ? {
          "@type": "AggregateOffer",
          offerCount: modelProducts.length,
          priceCurrency: "GBP",
          seller: {
            "@type": "Organization",
            name: "W D Greenhill & Co Ltd",
            url: SITE_URL,
          },
        }
      : undefined,
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8 flex items-center flex-wrap gap-1">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/kawai-support" className="hover:text-[hsl(245,85%,58%)] transition-colors">Kawai Support</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[hsl(240,4%,40%)]">{m.series} Series</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span aria-current="page" className="font-medium text-[hsl(240,10%,10%)]">{m.name}</span>
        </nav>

        {/* Title row */}
        <div className="flex flex-wrap items-start gap-4 mb-8">
          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                isCurrent
                  ? "bg-[hsl(245,85%,58%)]/10 text-[hsl(245,85%,58%)] border border-[hsl(245,85%,58%)]/30"
                  : "bg-[hsl(240,5%,92%)] text-[hsl(240,4%,46%)] border border-[hsl(240,6%,84%)]"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-[hsl(245,85%,58%)]" : "bg-[hsl(240,4%,60%)]"}`} />
                {isCurrent ? "Current model" : "Legacy model"}
              </span>
              <span className="text-xs text-[hsl(240,4%,56%)] font-medium">
                {seriesLabel} · {m.yearRange}
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl text-[hsl(240,10%,4%)] leading-tight mb-4">
              Kawai {m.name}
            </h1>
            <p className="text-lg text-[hsl(240,4%,36%)] max-w-2xl leading-relaxed">
              {m.description}
            </p>
          </div>

          {/* Hero image placeholder */}
          <div className="hidden md:flex w-56 h-40 rounded-2xl bg-gradient-to-br from-[hsl(245,85%,58%)]/8 to-[hsl(240,10%,4%)]/5 border border-[hsl(240,6%,88%)] items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-25">
              <rect x="8" y="20" width="48" height="30" rx="3" fill="currentColor" className="text-[hsl(240,10%,4%)]"/>
              <rect x="10" y="22" width="44" height="26" rx="2" fill="white"/>
              {/* White keys */}
              {Array.from({ length: 14 }).map((_, i) => (
                <rect key={i} x={10 + i * 3.14} y={22} width={2.8} height={26} rx={0.4} fill="white" stroke="#ddd" strokeWidth={0.3} />
              ))}
              {/* Black keys */}
              {[1,2,4,5,6,8,9,11,12,13].map((pos) => (
                <rect key={pos} x={10 + pos * 3.14 - 0.8} y={22} width={2} height={16} rx={0.3} fill="#222" />
              ))}
            </svg>
          </div>
        </div>

        {/* Predecessor / successor family tree */}
        {(predecessor || successor) && (
          <div className="mb-8 flex flex-wrap gap-3">
            {predecessor && (
              <div className="flex items-center gap-2 text-sm text-[hsl(240,4%,46%)] bg-[hsl(240,5%,96%)] border border-[hsl(240,6%,88%)] rounded-lg px-4 py-2.5">
                <span>Replaced the</span>
                <Link
                  href={`/kawai-support/${predecessor.slug}`}
                  className="font-semibold text-[hsl(245,85%,58%)] hover:underline underline-offset-2"
                >
                  {predecessor.name}
                </Link>
              </div>
            )}
            {successor && (
              <div className="flex items-center gap-2 text-sm text-[hsl(240,4%,46%)] bg-[hsl(240,5%,96%)] border border-[hsl(240,6%,88%)] rounded-lg px-4 py-2.5">
                <span>Succeeded by the</span>
                <Link
                  href={`/kawai-support/${successor.slug}`}
                  className="font-semibold text-[hsl(245,85%,58%)] hover:underline underline-offset-2"
                >
                  {successor.name}
                </Link>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}

        {/* Key features */}
        {m.keyFeatures && m.keyFeatures.length > 0 && (
          <section aria-labelledby="features-heading" className="mb-14 p-6 rounded-2xl bg-white border border-[hsl(240,6%,88%)]">
            <h2 id="features-heading" className="font-display font-bold text-xl mb-4">
              Key Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {m.keyFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(245,85%,58%)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[hsl(240,4%,36%)]">{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-14">
          <Button asChild size="lg" className="gap-2">
            <Link href={`/repairs/request?brand=Kawai&model=${encodeURIComponent(m.name)}`}>
              <Wrench className="w-4 h-4" />
              Request repair for this model
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/kawai-support">
              ← All Kawai Models
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/kawai-support/faq">
              Kawai FAQ
            </Link>
          </Button>
        </div>

        {/* Parts */}
        <section aria-labelledby="parts-heading" className="mb-16">
          <h2 id="parts-heading" className="font-display font-bold text-2xl mb-6">
            Parts Available for the {m.name}
            {modelProducts.length > 0 && (
              <span className="ml-2 text-base font-normal text-[hsl(240,4%,56%)]">({modelProducts.length})</span>
            )}
          </h2>
          {modelProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {modelProducts.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[hsl(240,5%,96%)] border border-[hsl(240,6%,88%)]">
              <p className="font-semibold text-[hsl(240,10%,4%)] mb-2">
                We stock and source parts for the {m.name}.
              </p>
              <p className="text-sm text-[hsl(240,4%,46%)]">
                If you don&apos;t see what you need listed, please request an enquiry — much of our 5,000-manual library and
                rare-parts inventory isn&apos;t yet listed online. Email{" "}
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
              Service Manuals
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

        {/* Firmware */}
        <div className="p-6 rounded-xl border border-[hsl(240,6%,88%)] bg-white">
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
