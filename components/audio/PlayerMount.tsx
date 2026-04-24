"use client";

import dynamic from "next/dynamic";

const AmbientPlayer = dynamic(
  () => import("./ambient-player").then(m => m.AmbientPlayer),
  { ssr: false },
);

export function PlayerMount() {
  return <AmbientPlayer />;
}
