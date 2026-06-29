import type { Metadata } from "next";
import { Suspense } from "react";
import { RepairRequestClient } from "./RepairRequestClient";
import { getBrands, getKawaiModels } from "@/lib/sanity/data";

export const metadata: Metadata = {
  title: "Request a Repair",
  description:
    "Submit a repair request for your digital piano, keyboard, or organ. WD Greenhill & Co repairs all makes — Kawai, Yamaha, Roland, Hammond, Wurlitzer, and 25+ more.",
};

export const revalidate = 60;

export default async function RepairRequestPage() {
  const [brands, kawaiModels] = await Promise.all([getBrands(), getKawaiModels()]);
  return (
    <Suspense>
      <RepairRequestClient brands={brands} kawaiModels={kawaiModels} />
    </Suspense>
  );
}
