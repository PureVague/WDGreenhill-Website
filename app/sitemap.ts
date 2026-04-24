import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { kawaiModels } from "@/data/models";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wdgreenhill.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${SITE_URL}/kawai-support`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/kawai-support/faq`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/repairs/request`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/manuals`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const productPages = products.map((p) => ({
    url: `${SITE_URL}/shop/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const brandPages = brands.map((b) => ({
    url: `${SITE_URL}/shop/brand/${b.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${SITE_URL}/shop/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const kawaiPages = kawaiModels.map((m) => ({
    url: `${SITE_URL}/kawai-support/${m.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...brandPages, ...categoryPages, ...kawaiPages];
}
