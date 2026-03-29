import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Normalized device coords (-1..1), Y up — updated from window mousemove (does not steal clicks from UI). */
export function useSmoothedPointer(smooth = 0.06) {
  const target = useRef(new THREE.Vector2(0, 0));
  const current = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      target.current.set(x, y);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const tick = (delta: number) => {
    const k = 1 - Math.exp(-smooth * 60 * delta);
    current.current.lerp(target.current, k);
  };

  return { current, target, tick };
}
