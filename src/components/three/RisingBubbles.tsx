import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

type Props = {
  count: number;
  mouseRef: MutableRefObject<THREE.Vector2>;
  depthRef: MutableRefObject<number>;
};

/** Bubbles near the surface; they thin out and vanish as the dive goes deeper. */
export function RisingBubbles({ count, mouseRef, depthRef }: Props) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const speed: number[] = [];
    const phase: number[] = [];
    const scale: number[] = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 38,
          (Math.random() - 0.5) * 22 - 4,
          (Math.random() - 0.5) * 22 - 8
        )
      );
      speed.push(0.4 + Math.random() * 1.1);
      phase.push(Math.random() * Math.PI * 2);
      scale.push(0.015 + Math.random() * 0.04);
    }
    return { pos, speed, phase, scale };
  }, [count]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    for (let i = 0; i < count; i++) {
      const p = data.pos[i];
      dummy.position.copy(p);
      dummy.scale.setScalar(data.scale[i]);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, data, dummy]);

  useFrame((state) => {
    if (mat.current) mat.current.opacity = 0.4 * (1 - THREE.MathUtils.smoothstep(depthRef.current, 0.05, 0.35));
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    for (let i = 0; i < count; i++) {
      const p = data.pos[i];
      const sp = data.speed[i];
      const ph = data.phase[i];
      p.y += sp * 0.016;
      p.x += Math.sin(t * 0.7 + ph) * 0.008 + mx * 0.012;
      p.z += Math.cos(t * 0.55 + ph * 0.7) * 0.006 + my * 0.01;
      if (p.y > 16) {
        p.y = -14 - Math.random() * 6;
        p.x = (Math.random() - 0.5) * 38;
        p.z = (Math.random() - 0.5) * 22 - 8;
      }
      dummy.position.copy(p);
      const s = data.scale[i] * (1 + Math.sin(t * 2 + ph) * 0.08);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial
        ref={mat}
        color="#c9fbf1"
        transparent
        opacity={0.46}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
