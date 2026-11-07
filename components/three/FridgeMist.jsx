import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import ClaySnowflake from "./ClaySnowflake";

// Mist parts start at the door gap (right edge of the big door) and drift out, forward and slightly down.
// height = start height, spread = how far it drifts sideways, spin = start rotation
const MIST_SNOWFLAKES = [
  { height: 0.2, spread: 0.9, spin: 0, size: 0.06, color: "sky" },
  { height: -0.1, spread: 0.6, spin: 1, size: 0.05, color: "lilac" },
  { height: -0.4, spread: 1.1, spin: 2, size: 0.07, color: "sky" },
  { height: -0.7, spread: 0.7, spin: 3, size: 0.05, color: "lilac" },
  { height: 0.0, spread: 1.3, spin: 4, size: 0.05, color: "sky" },
  { height: -0.55, spread: 0.4, spin: 5, size: 0.06, color: "sky" },
];
const MIST_PUFFS = [
  { height: 0.1, spread: 0.5, radius: 0.2 },
  { height: -0.35, spread: 0.8, radius: 0.26 },
  { height: -0.75, spread: 0.6, radius: 0.18 },
];

// Where a mist part is, from the door's progress (0 → 1) and openness (0 closed → 1 open)
function getMistState(mistPart, doorState) {
  return {
    position: [
      0.62 + doorState.progress * mistPart.spread,
      mistPart.height - doorState.progress * 0.3,
      0.6 + doorState.progress * 0.5,
    ],
    scale: doorState.openness,
  };
}

// The closed door state, used for the first frame (and the still frame when motion is reduced)
const CLOSED_DOOR = { progress: 0, openness: 0 };

// Fridge mist: soft sky puffs and small clay snowflakes that appear while the fridge door is open
export default function FridgeMist({ colors, shouldReduceMotion, doorStateRef }) {
  const snowflakeRefs = useRef([]);
  const puffRefs = useRef([]);

  useFrame(() => {
    if (shouldReduceMotion) return;
    const doorState = doorStateRef.current;

    MIST_SNOWFLAKES.forEach((mistSnowflake, index) => {
      const flake = snowflakeRefs.current[index];
      const mistState = getMistState(mistSnowflake, doorState);
      flake.position.set(...mistState.position);
      flake.rotation.z = mistSnowflake.spin + doorState.progress * 3;
      flake.scale.setScalar(mistState.scale);
    });

    MIST_PUFFS.forEach((mistPuff, index) => {
      const puff = puffRefs.current[index];
      const mistState = getMistState(mistPuff, doorState);
      puff.position.set(...mistState.position);
      puff.scale.setScalar(0.5 + doorState.progress);
      puff.material.opacity = mistState.scale * 0.35;
    });
  });

  return (
    <group>
      {/* Mist snowflakes: the shared clay snowflake, hidden (scale 0) while the door is closed */}
      {MIST_SNOWFLAKES.map((mistSnowflake, index) => (
        <ClaySnowflake
          key={index}
          ref={(group) => (snowflakeRefs.current[index] = group)}
          color={colors[mistSnowflake.color]}
          size={mistSnowflake.size}
          position={getMistState(mistSnowflake, CLOSED_DOOR).position}
          rotation={[0, 0, mistSnowflake.spin]}
          scale={0}
        />
      ))}

      {/* Mist puffs: soft see-through sky spheres, invisible (opacity 0) while the door is closed */}
      {MIST_PUFFS.map((mistPuff, index) => (
        <mesh
          key={index}
          ref={(mesh) => (puffRefs.current[index] = mesh)}
          position={getMistState(mistPuff, CLOSED_DOOR).position}
        >
          <sphereGeometry args={[mistPuff.radius, 20, 20]} />
          <meshStandardMaterial color={colors.sky} roughness={0.9} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
