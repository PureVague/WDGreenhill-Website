"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, MessageSquare, Package, Truck, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shop/ProductCard";
import { EnquireModal } from "@/components/site/EnquireModal";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

const TABS = ["Description", "Specifications", "Compatibility", "Shipping & Returns"] as const;
type Tab = (typeof TABS)[number];

export function ProductPageClient({ sku }: { sku: string }) {
  const product = getProductBySlug(sku);
  if (!product) notFound();

  const [activeTab, setActiveTab] = useState<Tab>("Description");
  const [quantity, setQuantity] = useState(1);
  const [enquireProduct, setEnquireProduct] = useState<Product | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const related = getRelatedProducts(product);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        sku: product.sku,
        slug: product.slug,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.images[0] ?? "/images/placeholder-part.svg",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-10">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[hsl(245,85%,58%)] transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop/brand/${product.brand}`} className="hover:text-[hsl(245,85%,58%)] transition-colors capitalize">
            {product.brand.replace("-", " ")}
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page" className="truncate max-w-xs inline-block">{product.title}</span>
        </nav>

        {/* Main product layout */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[hsl(240,5%,96%)] border border-[hsl(240,6%,88%)] mb-4">
              <Image
                src={product.images[0] ?? "/images/placeholder-part.svg"}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-12"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[hsl(245,85%,58%)] bg-[hsl(240,5%,96%)]"
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Link
                href={`/shop/brand/${product.brand}`}
                className="text-xs font-bold uppercase tracking-widest text-[hsl(245,85%,58%)] hover:underline"
              >
                {product.brand.replace(/-/g, " ")}
              </Link>
              <Badge variant={inStock ? "instock" : "outofstock"}>
                {inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </Badge>
            </div>

            <h1 className="font-display font-bold text-3xl md:text-4xl text-[hsl(240,10%,4%)] leading-tight mb-3">
              {product.title}
            </h1>

            <p className="text-sm font-mono text-[hsl(240,4%,56%)] mb-6">
              Part Number / SKU: <strong className="text-[hsl(240,10%,4%)]">{product.sku}</strong>
            </p>

            {product.compatibleModels.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[hsl(240,4%,56%)] mb-2">Fits models:</p>
                <div className="flex flex-wrap gap-2">
                  {product.compatibleModels.map((model) => (
                    <Link
                      key={model}
                      href={`/kawai-support/${model}`}
                      className="inline-flex items-center rounded-md border border-[hsl(240,6%,88%)] px-2.5 py-1 text-xs font-semibold hover:border-[hsl(245,85%,58%)] hover:text-[hsl(245,85%,58%)] transition-colors"
                    >
                      {model.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 p-5 rounded-xl bg-[hsl(240,5%,96%)] border border-[hsl(240,6%,88%)]">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold text-4xl text-[hsl(240,10%,4%)]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-[hsl(240,4%,56%)]">ex. VAT</span>
              </div>
              <p className="text-xs text-[hsl(240,4%,60%)] mt-1">
                {formatPrice(product.price * 1.2)} inc. 20% UK VAT
              </p>
            </div>

            {inStock ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-lg border border-[hsl(240,6%,88%)] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-[hsl(240,5%,94%)] transition-colors font-bold text-lg"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-5 py-3 text-base font-bold border-x border-[hsl(240,6%,88%)] min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 hover:bg-[hsl(240,5%,94%)] transition-colors font-bold text-lg"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2"
                onClick={() => setEnquireProduct(product)}
              >
                <MessageSquare className="w-5 h-5" />
                Enquire About Availability
              </Button>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[hsl(240,6%,88%)] pt-6">
              {[
                { icon: Package, label: "Genuine parts", sub: "Authentic components" },
                { icon: Truck, label: "Ships worldwide", sub: "UK, EU, global" },
                { icon: RefreshCw, label: "Expert support", sub: "45 years experience" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-1.5 text-[hsl(245,85%,58%)]" />
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-xs text-[hsl(240,4%,56%)]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="border-b border-[hsl(240,6%,88%)] flex gap-0 overflow-x-auto" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-[hsl(245,85%,58%)] text-[hsl(245,85%,58%)]"
                    : "border-transparent text-[hsl(240,4%,46%)] hover:text-[hsl(240,10%,4%)]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pt-8 max-w-3xl" role="tabpanel">
            {activeTab === "Description" && (
              <div className="prose prose-sm max-w-none text-[hsl(240,4%,36%)] leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === "Specifications" && (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[hsl(240,6%,92%)]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key}>
                      <td className="py-3 pr-6 font-semibold text-[hsl(240,10%,4%)] w-40">{key}</td>
                      <td className="py-3 text-[hsl(240,4%,36%)]">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === "Compatibility" && (
              <div>
                {product.compatibleModels.length > 0 ? (
                  <>
                    <p className="text-sm text-[hsl(240,4%,46%)] mb-4">
                      This part is confirmed compatible with the following models:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.compatibleModels.map((model) => (
                        <Link
                          key={model}
                          href={`/kawai-support/${model}`}
                          className="flex items-center gap-1 rounded-md border border-[hsl(240,6%,88%)] px-3 py-2 text-sm font-semibold hover:border-[hsl(245,85%,58%)] hover:text-[hsl(245,85%,58%)] transition-colors"
                        >
                          {model.toUpperCase()}
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[hsl(240,4%,46%)]">
                    Compatibility information for this part is not yet listed. Please{" "}
                    <Link href="/contact" className="text-[hsl(245,85%,58%)] underline underline-offset-2">
                      contact us
                    </Link>{" "}
                    with your model number to confirm fitment.
                  </p>
                )}
              </div>
            )}
            {activeTab === "Shipping & Returns" && (
              <div className="space-y-4 text-sm text-[hsl(240,4%,36%)]">
                <p><strong className="text-[hsl(240,10%,4%)]">Despatch:</strong> Orders received before 2pm Monday–Friday are typically despatched the same day.</p>
                <p><strong className="text-[hsl(240,10%,4%)]">UK delivery:</strong> £7.95 — 1 to 3 working days (Royal Mail or DPD).</p>
                <p><strong className="text-[hsl(240,10%,4%)]">EU delivery:</strong> £24.95 — 3 to 7 working days.</p>
                <p><strong className="text-[hsl(240,10%,4%)]">Rest of world:</strong> £39.95 — 7 to 14 working days. Import duties are the responsibility of the recipient.</p>
                <p><strong className="text-[hsl(240,10%,4%)]">Free shipping:</strong> UK orders over £150 (ex. VAT) qualify for free standard shipping.</p>
                <p><strong className="text-[hsl(240,10%,4%)]">Returns:</strong> Unused parts in original condition may be returned within 30 days. Contact{" "}
                  <a href="mailto:sales@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">sales@wdgreenhill.com</a>{" "}
                  before returning any item.
                </p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display font-bold text-2xl mb-8">Related Parts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.sku} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <EnquireModal product={enquireProduct} onClose={() => setEnquireProduct(null)} />
    </div>
  );
}
