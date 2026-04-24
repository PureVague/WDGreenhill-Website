import type { Metadata } from "next";
import { RequestClient } from "./RequestClient";

export const metadata: Metadata = {
  title: "Kawai Support Request",
  description:
    "Submit a Kawai digital piano support or repair request to WD Greenhill & Co — official Kawai UK service partner. Include your model and serial number for fastest response.",
};

export default function KawaiRequestPage() {
  return <RequestClient />;
}
