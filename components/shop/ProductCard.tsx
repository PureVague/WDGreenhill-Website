"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MessageSquare } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart-store";
import { useCartFlyStore } from "@/lib/cart-fly-store";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onEnquire, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const launch = useCartFlyStore((s) => s.launch);
  const reduced = useReducedMotion();
  const inStock = product.stock > 0;
  const [imgSrc, setImgSrc] = useState(product.images[0] ?? "/images/placeholder-part.svg");
  const [added, setAdded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    addItem({
      sku: product.sku,
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: imgSrc,
    });

    // Fly animation
    if (!reduced && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      launch({ imageUrl: imgSrc, fromRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } });
    }

    // "Added" feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      className={cn("group relative flex flex-col bg-white rounded-xl border border-[hsl(240,6%,88%)] overflow-hidden", className)}
      whileHover={reduced ? {} : { y: -6, boxShadow: "0 20px 40px -8px rgba(79,70,229,0.15), 0 8px 16px -4px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Image */}
      <Link
        href={`/shop/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[hsl(240,5%,96%)]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div ref={imgRef} className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            whileHover={reduced ? {} : { scale: 1.06 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={imgSrc}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-6"
              onError={() => setImgSrc("/images/placeholder-part.svg")}
            />
          </motion.div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[hsl(245,85%,58%)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

        {/* CTA overlay that slides up from bottom on hover */}
        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-[hsl(245,85%,58%)] text-white text-center text-xs font-bold py-2 px-3 flex items-center justify-center gap-1.5">
              <ShoppingCart className="w-3 h-3" />
              Quick Add
            </div>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Brand + stock */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[hsl(240,4%,46%)]">
            {product.brand.replace(/-/g, " ")}
          </span>
          <Badge variant={inStock ? "instock" : "outofstock"}>
            {inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/shop/product/${product.slug}`} className="flex-1">
          <h3 className="text-sm font-semibold text-[hsl(240,10%,4%)] leading-snug line-clamp-2 group-hover:text-[hsl(245,85%,58%)] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* SKU */}
        <p className="text-xs text-[hsl(240,4%,56%)] font-mono">SKU: {product.sku}</p>

        {/* Price */}
        <div>
          <p className="text-xl font-bold text-[hsl(240,10%,4%)]">{formatPrice(product.price)}</p>
          <p className="text-xs text-[hsl(240,4%,56%)]">ex. VAT</p>
        </div>

        {/* Actions */}
        {inStock ? (
          <Button
            size="sm"
            className={cn("w-full gap-2 transition-colors duration-200", added && "bg-emerald-600 hover:bg-emerald-700")}
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            {added ? "Added ✓" : "Add to Cart"}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2"
            onClick={() => onEnquire?.(product)}
            aria-label={`Enquire about ${product.title}`}
          >
            <MessageSquare className="w-4 h-4" />
            Enquire
          </Button>
        )}
      </div>
    </motion.article>
  );
}
