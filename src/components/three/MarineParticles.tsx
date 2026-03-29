import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

type Intensity = "hero" | "ambient";

type Props = {
  intensity: Intensity;
  mouseRef: MutableRefObject<THREE.Vector2>;
};

/** Fine suspended matter + micro-life — drifts with subtle current + mouse. */
export function MarineParticles({ intensity, mouseRef }: Props) {
  const ref = useRef<THREE.Points>(null);
  const count = intensity === "hero" ? 5200 : 3200;
  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 32;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, [count]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const ph = phases[i];
      tmp.set(arr[ix], arr[ix + 1], arr[ix + 2]);
      tmp.x += Math.sin(t * 0.12 + ph + my * 2) * 0.02 + mx * 0.035;
      tmp.y += Math.cos(t * 0.1 + ph * 0.7) * 0.015;
      tmp.z += Math.sin(t * 0.11 + ph * 0.5 + mx) * 0.018;
      if (tmp.x > 26) tmp.x = -26;
      if (tmp.x < -26) tmp.x = 26;
      if (tmp.y > 18) tmp.y = -18;
      if (tmp.y < -18) tmp.y = 18;
      arr[ix] = tmp.x;
      arr[ix + 1] = tmp.y;
      arr[ix + 2] = tmp.z;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.006 + mx * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={intensity === "hero" ? 0.028 : 0.022}
        color="#93c5fd"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
