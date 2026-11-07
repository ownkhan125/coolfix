"use client";

import dynamic from "next/dynamic";

// Loads the 3D scene only in the browser (no server render) and shows a clay circle while it downloads
const ClayHeroScene = dynamic(() => import("./ClayHeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="clay-placeholder h-40 w-40" aria-hidden="true" />
    </div>
  ),
});

// Hero scene loader: drop this into any page section that should show the 3D AC unit and fridge
export default function HeroSceneLoader() {
  return <ClayHeroScene />;
}
