import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { getBrandBySlug } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";

interface Props {
  params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrandBySlug(brand);
  if (!b) return {};
  return {
    title: `${b.name} Parts — Digital Piano & Organ Spares`,
    description: `Genuine replacement parts for ${b.name} digital pianos, keyboards, and organs. ${b.description}`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params;
  const b = getBrandBySlug(brand);
  if (!b) notFound();

  const products = getProductsByBrand(brand);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[hsl(245,85%,58%)] transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">{b.name}</span>
        </nav>

        <SectionHeading
          label="Brand"
          title={`${b.name} Parts`}
          subtitle={b.description}
        />

        {b.slug === "kawai" && (
          <div className="mb-10 p-6 rounded-xl bg-[hsl(245,85%,58%)] text-white">
            <p className="font-bold text-lg mb-2">Official Kawai UK Service Partner</p>
            <p className="text-white/80 text-sm mb-4">
              WDGreenhill is officially recommended by Kawai UK for spare parts and non-warranty repairs.
              We stock genuine Kawai parts for current and discontinued models across all series.
            </p>
            <Link
              href="/kawai-support"
              className="inline-flex items-center gap-2 text-sm font-bold bg-white text-[hsl(245,85%,58%)] rounded-md px-4 py-2 hover:bg-white/90 transition-colors"
            >
              Visit Kawai Support Hub →
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-[hsl(240,4%,46%)] mb-4">
              No products currently listed for {b.name}.
            </p>
            <p className="text-sm text-[hsl(240,4%,56%)]">
              We hold extensive {b.name} parts not yet listed online. Please{" "}
              <Link href="/contact" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
                contact us
              </Link>{" "}
              with your model and part requirements.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[hsl(240,4%,56%)] mb-8">
              {products.length} {b.name} product{products.length !== 1 ? "s" : ""} listed
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
