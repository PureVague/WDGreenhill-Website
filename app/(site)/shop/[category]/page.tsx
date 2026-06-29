import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.name} — Digital Piano Parts`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const products = getProductsByCategory(category);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[hsl(245,85%,58%)] transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">{cat.name}</span>
        </nav>

        <SectionHeading
          label="Category"
          title={cat.name}
          subtitle={cat.description}
        />

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-[hsl(240,4%,46%)] mb-4">
              No products currently listed in this category.
            </p>
            <p className="text-sm text-[hsl(240,4%,56%)]">
              Many parts from our extensive inventory are not yet listed online. Please{" "}
              <Link href="/contact" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
                contact us
              </Link>{" "}
              to enquire about specific parts.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[hsl(240,4%,56%)] mb-8">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          </>
        )}

        <div className="mt-16 p-6 bg-[hsl(245,85%,58%)]/5 border border-[hsl(245,85%,58%)]/20 rounded-xl">
          <p className="text-sm text-[hsl(240,10%,4%)]">
            <strong>Can&apos;t find what you need?</strong> We hold thousands of parts not yet listed online. Email{" "}
            <a href="mailto:sales@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2 font-semibold">
              sales@wdgreenhill.com
            </a>{" "}
            with your part number, brand, and model.
          </p>
        </div>
      </div>
    </div>
  );
}
