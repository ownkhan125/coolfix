import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import AcUnitModel from "./AcUnitModel";
import FridgeModel from "./FridgeModel";

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

// Clay hero scene: one canvas with the AC unit (left) and the fridge (right), lights and a soft shadow
export default function ClayHeroScene() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  // This file only runs in the browser (ssr: false), so the colors can be read once on first render
  const [sceneColors] = useState(readThemeColors);
  const shouldReduceMotion = useReducedMotion();

  // Pause rendering while the canvas is scrolled off screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // "always" = render every frame; "demand" = render once and then only when something changes
  const isAnimating = isVisible && !shouldReduceMotion;

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 7], fov: 35 }}
        frameloop={isAnimating ? "always" : "demand"}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lights: soft fill plus a key light and a cool rim light */}
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color={sceneColors.sky} />

        {/* Models: AC unit on the left, fridge on the right (placement props are ready for scroll animation) */}
        <AcUnitModel
          colors={sceneColors}
          shouldReduceMotion={shouldReduceMotion}
          position={[-1.6, 0.4, 0]}
          rotation={[0, 0, 0]}
          scale={0.8}
        />
        <FridgeModel
          colors={sceneColors}
          shouldReduceMotion={shouldReduceMotion}
          position={[1.7, -0.2, 0]}
          rotation={[0, -0.15, 0]}
          scale={0.85}
        />

        {/* Shadow: soft purple blur under both models (drawn once when motion is reduced) */}
        <ContactShadows
          position={[0, -1.5, 0]}
          color={sceneColors.shadow}
          opacity={0.35}
          blur={2.5}
          scale={10}
          far={4}
          resolution={256}
          frames={shouldReduceMotion ? 1 : Infinity}
        />
      </Canvas>
    </div>
  );
}
