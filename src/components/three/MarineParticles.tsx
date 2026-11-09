import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

type Props = {
  count: number;
  mouseRef: MutableRefObject<THREE.Vector2>;
  /** Scroll velocity (px/ms); scrolling down makes particles stream upward. */
  velocityRef: MutableRefObject<number>;
};

/** Marine snow — drifts with a slight current and streams past while the page descends. */
export function MarineParticles({ count, mouseRef, velocityRef }: Props) {
  const ref = useRef<THREE.Points>(null);
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

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const rise = Math.max(-0.6, Math.min(0.6, velocityRef.current * 0.12));
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const ph = phases[i];
      let x = arr[ix] + Math.sin(t * 0.12 + ph + my * 2) * 0.02 + mx * 0.03;
      let y = arr[ix + 1] + Math.cos(t * 0.1 + ph * 0.7) * 0.012 - 0.004 + rise * (0.6 + (ph % 1));
      const z = arr[ix + 2] + Math.sin(t * 0.11 + ph * 0.5 + mx) * 0.016;
      if (x > 26) x = -26;
      if (x < -26) x = 26;
      if (y > 18) y = -18;
      if (y < -18) y = 18;
      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
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
        size={0.026}
        color="#c3cfdd"
        transparent
        opacity={0.38}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
