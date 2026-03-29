import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/** Rotating sonar wedge + faint outer ring — reads as active acoustic mapping. */
export function SonarSweep() {
  const sweep = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (sweep.current) sweep.current.rotation.z = t * 0.55;
    if (outer.current) outer.current.rotation.z = -t * 0.09;
  });

  return (
    <group position={[0, 0.2, -5.5]}>
      <group ref={sweep} rotation={[Math.PI / 2.1, 0, 0]}>
        <mesh>
          <ringGeometry args={[5.2, 5.45, 64, 1, 0, Math.PI / 3.2]} />
          <meshBasicMaterial
            color="#22d3ff"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[5.2, 5.28, 64, 1, 0, Math.PI / 14]} />
          <meshBasicMaterial
            color="#c4b5fd"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      <group ref={outer} rotation={[Math.PI / 2.12, 0, 0]}>
        <mesh>
          <ringGeometry args={[8.2, 8.35, 80, 1, 0, Math.PI * 2]} />
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
