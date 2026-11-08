import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import AcUnitModel from "./AcUnitModel";
import FridgeModel from "./FridgeModel";
import useSceneScroll, { createSceneState } from "./useSceneScroll";

// Reads the brand colors from the CSS variables in styles/theme.css
function readThemeColors() {
  const rootStyles = getComputedStyle(document.documentElement);
  const readColor = (variableName) => rootStyles.getPropertyValue(variableName).trim();

  return {
    white: readColor("--color-white"),
    lilac: readColor("--color-lilac"),
    mint: readColor("--color-mint"),
    sky: readColor("--color-sky"),
    butter: readColor("--color-butter"),
    shadow: readColor("--color-shadow"),
  };
}

// Clay hero scene: one full-page canvas with the AC unit and the fridge, moved by page scroll
export default function ClayHeroScene() {
  // This file only runs in the browser (ssr: false), so colors and screen size can be read on first render
  const [sceneColors] = useState(readThemeColors);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  const shouldReduceMotion = useReducedMotion();

  // Update isDesktop when the window crosses 1024px, so the snowflake count follows the screen size
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleScreenChange = (event) => setIsDesktop(event.matches);
    desktopQuery.addEventListener("change", handleScreenChange);
    return () => desktopQuery.removeEventListener("change", handleScreenChange);
  }, []);

  // Shared scene state: GSAP writes scroll values into it, the models read it every frame
  const sceneStateRef = useRef(createSceneState());
  useSceneScroll(sceneStateRef);

  return (
    <Canvas
      dpr={[1, 1.5]}
      // Camera looks straight ahead, so screen pixels map to scene units simply (see scene-placement.js)
      camera={{ position: [0, 0, 7], fov: 35 }}
      // "always" = render every frame (browsers pause this in hidden tabs); "demand" = one still frame
      frameloop={shouldReduceMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true }}
      // flat = no filmic tone mapping, which otherwise dulls pure white into grey
      flat
      // The canvas ignores clicks (pointer-events: none), so read the mouse from the page for the tilt
      eventSource={document.body}
      eventPrefix="client"
    >
      {/* Lights: bright soft fill, white-from-above / lilac-from-below bounce, a key light and a cool rim light */}
      <ambientLight intensity={1.4} />
      <hemisphereLight args={[sceneColors.white, sceneColors.lilac, 1]} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color={sceneColors.sky} />

      {/* Models: placement comes from the anchors via sceneStateRef, idle animations run on top. Each has its own shadow. */}
      <AcUnitModel
        colors={sceneColors}
        shouldReduceMotion={shouldReduceMotion}
        sceneStateRef={sceneStateRef}
        snowflakeCount={isDesktop ? 10 : 5}
      />
      <FridgeModel colors={sceneColors} shouldReduceMotion={shouldReduceMotion} sceneStateRef={sceneStateRef} />
    </Canvas>
  );
}
