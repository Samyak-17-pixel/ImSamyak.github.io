import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

type Props = {
  mouseRef: MutableRefObject<THREE.Vector2>;
  depthRef: MutableRefObject<number>;
};

const STRANDS = 10;

/** Abstract kelp / tether silhouettes — sways with time + pointer (underwater current). */
export function KelpStrands({ mouseRef, depthRef }: Props) {
  const group = useRef<THREE.Group>(null);

  const paths = useMemo(() => {
    return Array.from({ length: STRANDS }).map((_, i) => {
      const x = (i / (STRANDS - 1) - 0.5) * 26 + (Math.random() - 0.5) * 1.5;
      const z = -7 - Math.random() * 7;
      const h = 11 + Math.random() * 7;
      const points: THREE.Vector3[] = [];
      const segs = 20;
      for (let s = 0; s <= segs; s++) {
        const t = s / segs;
        const y = -13 + t * h;
        const sway = Math.sin(t * Math.PI) * 1.1;
        points.push(new THREE.Vector3(x + sway * 0.25, y, z));
      }
      return {
        curve: new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4),
        phase: Math.random() * Math.PI * 2,
        radius: 0.055 + (i % 4) * 0.018,
      };
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouseRef.current.x;
    // The seafloor (and its kelp) rises into view over the last stretch of the dive
    const floor = THREE.MathUtils.smoothstep(depthRef.current, 0.6, 1);
    group.current.position.y = THREE.MathUtils.lerp(-16, 0, floor);
    group.current.visible = floor > 0.001;
    group.current.children.forEach((child, i) => {
      const c = paths[i];
      if (!c) return;
      child.rotation.z = Math.sin(t * 0.38 + c.phase + mx * 2.2) * 0.18;
      child.rotation.x = Math.cos(t * 0.32 + c.phase * 0.8) * 0.07 + mx * 0.09;
    });
  });

  return (
    <group ref={group}>
      {paths.map((p, i) => (
        <mesh key={i} position={[0, -1.5, 0]}>
          <tubeGeometry args={[p.curve, 28, p.radius, 6, false]} />
          <meshStandardMaterial
            color="#2a3442"
            emissive="#10161e"
            emissiveIntensity={0.35}
            metalness={0.2}
            roughness={0.88}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
