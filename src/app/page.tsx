"use client";

import dynamic from "next/dynamic";

const SimulationView = dynamic(() => import("@/components/SimulationView"), {
  ssr: false,
});

export default function Home() {
  return <SimulationView />;
}
