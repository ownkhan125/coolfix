import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import FridgeMist from "./FridgeMist";

// Clay look shared by every part: fully matte, no metal
const CLAY_ROUGHNESS = 0.9;

// Door timing: an 8 second cycle; during the first 30% the door opens and closes, then it rests
const DOOR_CYCLE_SECONDS = 8;
const DOOR_OPEN_PART = 0.3;
const DOOR_OPEN_ANGLE = 0.35; // radians, about 20 degrees

// Tall two-door clay fridge with float, door and inside-glow animations, plus mist from the door.
// position / rotation / scale place the whole fridge (a scroll animation will drive them later).
export default function FridgeModel({ colors, shouldReduceMotion, position, rotation, scale }) {
  const fridgeRef = useRef(null);
  const doorRef = useRef(null);
  const glowMaterialRef = useRef(null);
  // Shared with FridgeMist each frame: progress = 0 → 1 through the open/close move, openness = 0 closed → 1 fully open
  const doorStateRef = useRef({ progress: 0, openness: 0 });

  useFrame((state) => {
    if (shouldReduceMotion) return;
    const time = state.clock.elapsedTime;

    // Float slowly, with a different speed and start point than the AC so they are out of sync
    fridgeRef.current.position.y = Math.sin(time * 0.65 + 1.8) * 0.1;

    // Door: rises from closed to open and back during the open part of the cycle, closed otherwise
    const cycleProgress = (time % DOOR_CYCLE_SECONDS) / DOOR_CYCLE_SECONDS;
    const doorProgress = Math.min(cycleProgress / DOOR_OPEN_PART, 1);
    const openness = doorProgress < 1 ? Math.sin(doorProgress * Math.PI) : 0;
    doorStateRef.current = { progress: doorProgress, openness };

    // Hinge on the left edge: a negative angle swings the right edge toward the camera
    doorRef.current.rotation.y = -openness * DOOR_OPEN_ANGLE;
    glowMaterialRef.current.emissiveIntensity = openness * 1.2;
  });

  return (
    // Outer group: placement from props. Inner group: idle float.
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={fridgeRef}>
        {/* Body: tall rounded white box */}
        <RoundedBox args={[1.3, 2.6, 1]} radius={0.25} smoothness={4}>
          <meshStandardMaterial color={colors.white} roughness={CLAY_ROUGHNESS} metalness={0} />
        </RoundedBox>

        {/* Inside glow: butter panel behind the big door, it lights up as the door opens */}
        <mesh position={[0, -0.34, 0.505]}>
          <boxGeometry args={[1.1, 1.5, 0.01]} />
          <meshStandardMaterial
            ref={glowMaterialRef}
            color={colors.butter}
            emissive={colors.butter}
            emissiveIntensity={0}
            roughness={CLAY_ROUGHNESS}
            metalness={0}
          />
        </mesh>

        {/* Freezer door: small top door with a lilac handle and the mint status light */}
        <RoundedBox args={[1.24, 0.72, 0.1]} radius={0.05} position={[0, 0.9, 0.55]}>
          <meshStandardMaterial color={colors.white} roughness={CLAY_ROUGHNESS} metalness={0} />
        </RoundedBox>
        <mesh position={[0.42, 0.8, 0.64]}>
          <capsuleGeometry args={[0.045, 0.28, 4, 12]} />
          <meshStandardMaterial color={colors.lilac} roughness={CLAY_ROUGHNESS} metalness={0} />
        </mesh>
        <mesh position={[-0.4, 1.05, 0.61]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.04, 24]} />
          <meshStandardMaterial
            color={colors.mint}
            emissive={colors.mint}
            emissiveIntensity={0.6}
            roughness={CLAY_ROUGHNESS}
            metalness={0}
          />
        </mesh>

        {/* Big door: the group is the hinge on the left edge, the door and handle hang to the right of it */}
        <group ref={doorRef} position={[-0.62, -0.34, 0.55]}>
          <RoundedBox args={[1.24, 1.66, 0.1]} radius={0.05} position={[0.62, 0, 0]}>
            <meshStandardMaterial color={colors.white} roughness={CLAY_ROUGHNESS} metalness={0} />
          </RoundedBox>
          <mesh position={[1.04, 0.35, 0.09]}>
            <capsuleGeometry args={[0.045, 0.5, 4, 12]} />
            <meshStandardMaterial color={colors.lilac} roughness={CLAY_ROUGHNESS} metalness={0} />
          </mesh>
        </group>

        {/* Mist: puffs out of the door gap while the door is open */}
        <FridgeMist colors={colors} shouldReduceMotion={shouldReduceMotion} doorStateRef={doorStateRef} />
      </group>
    </group>
  );
}
