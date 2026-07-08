import type { Metadata } from "next";
import { CartClient } from "./CartClient";
import { getShippingSettings, getProductsShipping } from "@/lib/sanity/data";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function CartPage() {
  const [shippingSettings, productShipping] = await Promise.all([
    getShippingSettings(),
    getProductsShipping(),
  ]);

  return <CartClient shippingSettings={shippingSettings} productShipping={productShipping} />;
}
