import type { Metadata } from "next";
import { RepairRequestClient } from "./RepairRequestClient";

export const metadata: Metadata = {
  title: "Request a Repair",
  description:
    "Submit a repair request for your digital piano, keyboard, or organ. WD Greenhill & Co repairs all makes — Kawai, Yamaha, Roland, Hammond, Wurlitzer, and 25+ more.",
};

export default function RepairRequestPage() {
  return <RepairRequestClient />;
}
