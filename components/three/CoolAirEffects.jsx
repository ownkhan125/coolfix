import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import ClaySnowflake from "./ClaySnowflake";

// Air waves: 3 curved arcs, each one third of a cycle behind the previous one
const WAVE_START_OFFSETS = [0, 1 / 3, 2 / 3];
const WAVE_CYCLE_SECONDS = 3;
const WAVE_ARC = Math.PI * 0.45;

// Snowflakes: fixed start values (no random numbers, so every render looks the same)
// x / z = position, speed = cycles per second, delay = where in the fall it starts (0 to 1)
const SNOWFLAKES = [
  { x: -2.4, z: 0.8, speed: 0.07, delay: 0.0, size: 0.09, color: "sky" },
  { x: -1.7, z: -0.6, speed: 0.06, delay: 0.55, size: 0.07, color: "lilac" },
  { x: -1.1, z: 1.3, speed: 0.08, delay: 0.3, size: 0.06, color: "sky" },
  { x: -0.4, z: -0.9, speed: 0.05, delay: 0.8, size: 0.08, color: "lilac" },
  { x: 0.3, z: 1.5, speed: 0.07, delay: 0.15, size: 0.07, color: "sky" },
  { x: 0.9, z: -0.5, speed: 0.06, delay: 0.65, size: 0.09, color: "lilac" },
  { x: 1.5, z: 1.1, speed: 0.08, delay: 0.4, size: 0.06, color: "sky" },
  { x: 2.1, z: -0.8, speed: 0.05, delay: 0.9, size: 0.08, color: "lilac" },
  { x: 2.6, z: 0.6, speed: 0.07, delay: 0.2, size: 0.07, color: "sky" },
  { x: -2.9, z: -0.2, speed: 0.06, delay: 0.7, size: 0.08, color: "lilac" },
];

// Where a wave is at a point in its cycle (progress goes 0 → 1): moves down and forward, grows, fades in and out
function getWaveState(progress) {
  return {
    position: [0, 1.1 - progress * 0.9, 0.6 + progress * 0.9],
    scale: 0.7 + progress * 0.6,
    opacity: Math.sin(progress * Math.PI) * 0.6,
  };
}

// Where a snowflake is at a given time: falls from top to bottom, sways, spins, and shrinks away at both ends
function getSnowflakeState(snowflake, time) {
  const progress = (time * snowflake.speed + snowflake.delay) % 1;
  return {
    position: [snowflake.x + Math.sin(time * 0.8 + snowflake.delay * 6) * 0.15, 2.3 - progress * 4.6, snowflake.z],
    rotation: time * 0.6 + snowflake.delay * 6,
    scale: Math.sin(progress * Math.PI),
  };
}

// Cool air effects: soft air waves from the vent and slowly falling clay snowflakes
export default function CoolAirEffects({ colors, shouldReduceMotion }) {
  const waveRefs = useRef([]);
  const snowflakeRefs = useRef([]);

  useFrame((state) => {
    if (shouldReduceMotion) return;
    const time = state.clock.elapsedTime;

    WAVE_START_OFFSETS.forEach((startOffset, index) => {
      const wave = waveRefs.current[index];
      const waveState = getWaveState((time / WAVE_CYCLE_SECONDS + startOffset) % 1);
      wave.position.set(...waveState.position);
      wave.scale.setScalar(waveState.scale);
      wave.material.opacity = waveState.opacity;
    });

    SNOWFLAKES.forEach((snowflake, index) => {
      const flake = snowflakeRefs.current[index];
      const flakeState = getSnowflakeState(snowflake, time);
      flake.position.set(...flakeState.position);
      flake.rotation.z = flakeState.rotation;
      flake.scale.setScalar(flakeState.scale);
    });
  });

  return (
    <group>
      {/* Air waves: thin sky-blue arcs, turned so the curve hangs below the vent like a smile */}
      {WAVE_START_OFFSETS.map((startOffset, index) => {
        const waveState = getWaveState(startOffset);
        return (
          <mesh
            key={startOffset}
            ref={(mesh) => (waveRefs.current[index] = mesh)}
            position={waveState.position}
            scale={waveState.scale}
            rotation={[0, 0, -Math.PI / 2 - WAVE_ARC / 2]}
          >
            <torusGeometry args={[1.4, 0.035, 12, 48, WAVE_ARC]} />
            <meshStandardMaterial
              color={colors.sky}
              roughness={0.9}
              transparent
              opacity={waveState.opacity}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Snowflakes: clay flakes in sky or lilac */}
      {SNOWFLAKES.map((snowflake, index) => {
        const flakeState = getSnowflakeState(snowflake, 0);
        return (
          <ClaySnowflake
            key={index}
            ref={(group) => (snowflakeRefs.current[index] = group)}
            color={colors[snowflake.color]}
            size={snowflake.size}
            position={flakeState.position}
            rotation={[0, 0, flakeState.rotation]}
            scale={flakeState.scale}
          />
        );
      })}
    </group>
  );
}
