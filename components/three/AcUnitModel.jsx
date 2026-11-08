import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { MathUtils } from "three";
import CoolAirEffects from "./CoolAirEffects";
import { applyModelPlacement } from "./scene-placement";

// Clay look shared by every part: fully matte, no metal
const CLAY_ROUGHNESS = 0.9;

// How far the unit turns toward the mouse, in radians (about 8 degrees)
const MOUSE_TILT_ANGLE = 0.14;

// Wall-mounted split AC unit built from rounded shapes.
// Outer group sits on its page anchor (see scene-placement.js); inner group runs float, flap and mouse tilt.
export default function AcUnitModel({ colors, shouldReduceMotion, sceneStateRef, snowflakeCount }) {
  const placementRef = useRef(null);
  const unitRef = useRef(null);
  const flapRef = useRef(null);

  useFrame((state) => {
    // Placement: follow the page anchors (reduced motion turns instantly instead of easing)
    applyModelPlacement(placementRef.current, "ac", sceneStateRef.current, state, shouldReduceMotion ? 1 : 0.1);
    if (shouldReduceMotion) return;

    const time = state.clock.elapsedTime;
    const unit = unitRef.current;

    // Float slowly up and down
    unit.position.y = 0.6 + Math.sin(time * 0.8) * 0.12;

    // Ease a little toward the mouse (pointer goes from -1 to 1 across the screen)
    unit.rotation.y = MathUtils.lerp(unit.rotation.y, state.pointer.x * MOUSE_TILT_ANGLE, 0.05);
    unit.rotation.x = MathUtils.lerp(unit.rotation.x, -state.pointer.y * MOUSE_TILT_ANGLE, 0.05);

    // Swing the vent flap between almost closed (0.15) and open (0.75)
    flapRef.current.rotation.x = 0.15 + (Math.sin(time * 0.6) + 1) * 0.3;
  });

  return (
    <group ref={placementRef}>
      <group ref={unitRef} position={[0, 0.6, 0]}>
        {/* Body: big rounded white box */}
        <RoundedBox args={[3, 1.1, 0.9]} radius={0.3} smoothness={4}>
          <meshStandardMaterial color={colors.white} roughness={CLAY_ROUGHNESS} metalness={0} />
        </RoundedBox>

        {/* Vent strip: lilac band across the lower front */}
        <RoundedBox args={[2.6, 0.22, 0.1]} radius={0.05} position={[0, -0.3, 0.42]}>
          <meshStandardMaterial color={colors.lilac} roughness={CLAY_ROUGHNESS} metalness={0} />
        </RoundedBox>

        {/* Vent flap: the group is the hinge on the top edge, the box hangs forward from it */}
        <group ref={flapRef} position={[0, -0.42, 0.46]} rotation={[0.45, 0, 0]}>
          <RoundedBox args={[2.5, 0.06, 0.24]} radius={0.03} position={[0, 0, 0.12]}>
            <meshStandardMaterial color={colors.white} roughness={CLAY_ROUGHNESS} metalness={0} />
          </RoundedBox>
        </group>

        {/* Display light: small glowing mint dot on the top right of the front */}
        <mesh position={[1.1, 0.22, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 24]} />
          <meshStandardMaterial
            color={colors.mint}
            emissive={colors.mint}
            emissiveIntensity={0.6}
            roughness={CLAY_ROUGHNESS}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Shadow: soft purple blur under the unit, travels with it (drawn once when motion is reduced) */}
      <ContactShadows
        position={[0, -0.9, 0]}
        color={colors.shadow}
        opacity={0.3}
        blur={2.5}
        scale={4}
        far={2}
        resolution={128}
        frames={shouldReduceMotion ? 1 : Infinity}
      />

      {/* Air waves and snowflakes: inside the placement group so they stay with the unit when it moves */}
      <CoolAirEffects
        colors={colors}
        shouldReduceMotion={shouldReduceMotion}
        sceneStateRef={sceneStateRef}
        snowflakeCount={snowflakeCount}
      />
    </group>
  );
}
