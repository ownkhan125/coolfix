// Clay snowflake: 3 crossed rounded arms. Used by CoolAirEffects (falling flakes) and FridgeMist (door mist).
// The parent animates it through `ref`, so this file has no animation of its own.
export default function ClaySnowflake({ ref, color, size, position, rotation, scale }) {
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {[0, Math.PI / 3, (Math.PI * 2) / 3].map((armAngle) => (
        <mesh key={armAngle} rotation={[0, 0, armAngle]}>
          <capsuleGeometry args={[size * 0.3, size * 2, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}
