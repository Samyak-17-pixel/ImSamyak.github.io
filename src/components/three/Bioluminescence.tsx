import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const vertex = /* glsl */ `
attribute float aPhase;
attribute float aSize;
uniform float uTime;
uniform float uPixelRatio;
varying float vGlow;
void main() {
  vec3 p = position;
  p.x += sin(uTime * 0.2 + aPhase) * 0.6;
  p.y += cos(uTime * 0.15 + aPhase * 1.3) * 0.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vGlow = pow(0.5 + 0.5 * sin(uTime * (0.6 + fract(aPhase) * 1.4) + aPhase * 6.0), 3.0);
  gl_PointSize = aSize * uPixelRatio * (40.0 / -mv.z) * (0.6 + vGlow);
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform float uOpacity;
varying float vGlow;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(vec3(0.21, 0.79, 1.0), vec3(0.37, 0.95, 0.84), vGlow);
  gl_FragColor = vec4(col, a * a * uOpacity * (0.25 + vGlow));
}
`;

type Props = {
  count: number;
  depthRef: MutableRefObject<number>;
  velocityRef: MutableRefObject<number>;
};

/** Twinkling plankton that only lights up in the deep. */
export function Bioluminescence({ count, depthRef, velocityRef }: Props) {
  const points = useRef<THREE.Points>(null);
  const { positions, phases, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 2] = -Math.random() * 18;
      phases[i] = Math.random() * 100;
      sizes[i] = 1.5 + Math.random() * 3.5;
    }
    return { positions, phases, sizes };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uOpacity.value = THREE.MathUtils.smoothstep(depthRef.current, 0.08, 0.7) * 0.95;
    if (!points.current) return;
    const arr = points.current.geometry.attributes.position.array as Float32Array;
    const rise = Math.max(-0.5, Math.min(0.5, velocityRef.current * 0.1));
    if (Math.abs(rise) < 0.001) return;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + rise;
      if (y > 13) y = -13;
      if (y < -13) y = 13;
      arr[i * 3 + 1] = y;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
    </points>
  );
}
