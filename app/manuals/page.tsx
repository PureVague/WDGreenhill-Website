import type { Metadata } from "next";
import { ManualsClient } from "./ManualsClient";

export const metadata: Metadata = {
  title: "Piano & Organ Manuals — Owner's, Service & Schematics",
  description:
    "Search over 5,000 owner's manuals, service manuals, and schematics for digital pianos, keyboards, and electronic organs. Kawai, Yamaha, Roland, Hammond, Wurlitzer and more.",
};

export default function ManualsPage() {
  return <ManualsClient />;
}
