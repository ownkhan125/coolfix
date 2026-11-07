import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import ClaySnowflake from "./ClaySnowflake";

// Mist snowflakes start at the door gap (right edge of the big door) and drift out, forward and slightly down.
// height = start height, spread = how far it drifts sideways, spin = start rotation
const MIST_SNOWFLAKES = [
  { height: 0.25, spread: 0.9, spin: 0, size: 0.05, color: "sky" },
  { height: 0.0, spread: 0.6, spin: 1, size: 0.04, color: "lilac" },
  { height: -0.2, spread: 1.2, spin: 2, size: 0.05, color: "sky" },
  { height: -0.4, spread: 0.8, spin: 3, size: 0.04, color: "lilac" },
  { height: -0.55, spread: 1.4, spin: 4, size: 0.04, color: "sky" },
  { height: -0.7, spread: 0.5, spin: 5, size: 0.05, color: "sky" },
  { height: 0.1, spread: 1.5, spin: 6, size: 0.04, color: "lilac" },
  { height: -0.85, spread: 1.0, spin: 7, size: 0.04, color: "sky" },
];

// Where a mist snowflake is, from the door's progress (0 → 1) and openness (0 closed → 1 open)
function getMistState(mistSnowflake, doorState) {
  return {
    position: [
      0.62 + doorState.progress * mistSnowflake.spread,
      mistSnowflake.height - doorState.progress * 0.3,
      0.6 + doorState.progress * 0.5,
    ],
    rotation: mistSnowflake.spin + doorState.progress * 3,
    scale: doorState.openness,
  };
}

// The closed door state, used for the first frame (and the still frame when motion is reduced)
const CLOSED_DOOR = { progress: 0, openness: 0 };

// Fridge mist: small clay snowflakes that puff out of the door gap while the fridge door is open
export default function FridgeMist({ colors, shouldReduceMotion, doorStateRef }) {
  const snowflakeRefs = useRef([]);

  useFrame(() => {
    if (shouldReduceMotion) return;
    const doorState = doorStateRef.current;

    MIST_SNOWFLAKES.forEach((mistSnowflake, index) => {
      const flake = snowflakeRefs.current[index];
      const mistState = getMistState(mistSnowflake, doorState);
      flake.position.set(...mistState.position);
      flake.rotation.z = mistState.rotation;
      flake.scale.setScalar(mistState.scale);
    });
  });

  return (
    <group>
      {/* Mist snowflakes: the shared clay snowflake, hidden (scale 0) while the door is closed */}
      {MIST_SNOWFLAKES.map((mistSnowflake, index) => {
        const mistState = getMistState(mistSnowflake, CLOSED_DOOR);
        return (
          <ClaySnowflake
            key={index}
            ref={(group) => (snowflakeRefs.current[index] = group)}
            color={colors[mistSnowflake.color]}
            size={mistSnowflake.size}
            position={mistState.position}
            rotation={[0, 0, mistState.rotation]}
            scale={mistState.scale}
          />
        );
      })}
    </group>
  );
}
