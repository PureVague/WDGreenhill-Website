import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { ProductPageClient } from "./ProductPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wdgreenhill.com";

interface Props {
  params: Promise<{ sku: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ sku: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;
  const product = getProductBySlug(sku);
  if (!product) return {};

  return {
    title: `${product.title} — Part No. ${product.sku}`,
    description: `${product.description.slice(0, 155)}…`,
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 155),
      images: product.images[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.title }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { sku } = await params;
  const product = getProductBySlug(sku);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand.replace(/-/g, " "),
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/product/${product.slug}`,
      priceCurrency: "GBP",
      price: product.price.toFixed(2),
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "W D Greenhill & Co Ltd",
      },
    },
    ...(product.images[0] ? { image: product.images[0] } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageClient sku={sku} />
    </>
  );
}
