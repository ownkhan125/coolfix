"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

// Loads the 3D scene only in the browser (no server render).
// While it downloads, a clay circle sits where the hero model appears (right column).
const ClayHeroScene = dynamic(() => import("./ClayHeroScene"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto grid h-full max-w-6xl grid-cols-2 items-center px-4">
      <div className="clay-placeholder col-start-2 mx-auto h-40 w-40" aria-hidden="true" />
    </div>
  ),
});

// Desktop screen check for useSyncExternalStore: React calls subscribe once and re-reads the value
// whenever the window crosses 1024px. On the server there is no window, so it counts as "not desktop".
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToScreenChange(onChange) {
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  desktopQuery.addEventListener("change", onChange);
  return () => desktopQuery.removeEventListener("change", onChange);
}

function readIsDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function readIsDesktopOnServer() {
  return false;
}

// Hero scene loader: renders the full-page 3D scene with the AC unit and fridge, on desktop only.
// Phones and tablets get no 3D at all, so the scene code is never downloaded there.
export default function HeroSceneLoader() {
  const isDesktop = useSyncExternalStore(subscribeToScreenChange, readIsDesktop, readIsDesktopOnServer);

  if (!isDesktop) return null;
  return <ClayHeroScene />;
}
