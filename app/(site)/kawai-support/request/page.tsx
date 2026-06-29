import type { Metadata } from "next";
import { RequestClient } from "./RequestClient";
import { getKawaiModels } from "@/lib/sanity/data";

export const metadata: Metadata = {
  title: "Kawai Support Request",
  description:
    "Submit a Kawai digital piano support or repair request to WD Greenhill & Co — official Kawai UK service partner. Include your model and serial number for fastest response.",
};

export const revalidate = 60;

export default async function KawaiRequestPage() {
  const kawaiModels = await getKawaiModels();
  return <RequestClient kawaiModels={kawaiModels} />;
}
