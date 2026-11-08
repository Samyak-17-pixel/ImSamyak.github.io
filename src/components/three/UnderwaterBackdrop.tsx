import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uFlow;
uniform float uDepth;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.1;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 m = uMouse * uFlow;

  // Tight “water lens” only near cursor (small UV radius — subtle ripple)
  vec2 muv = vec2(uMouse.x * 0.5 + 0.5, uMouse.y * 0.5 + 0.5);
  vec2 delta = uv - muv;
  float dist = length(delta);
  float sigma = 0.042 * uFlow;
  float w = exp(-dist * dist / (2.0 * sigma * sigma));
  vec2 dir = dist > 1e-4 ? normalize(delta) : vec2(0.0);
  float rip = sin(dist * 150.0 - uTime * 7.5) * 0.012 + sin(dist * 100.0 + uTime * 5.0) * 0.005;
  uv += dir * rip * w;
  uv += vec2(cos(uTime * 5.5 + dist * 110.0), sin(uTime * 5.0 + dist * 105.0)) * 0.0032 * w;

  // Gentle ambient drift (whole frame — mouse influence kept small)
  vec2 flow = vec2(
    sin(uTime * 0.25 + uv.y * 6.0) * 0.018,
    cos(uTime * 0.2 + uv.x * 5.0) * 0.016
  );
  flow += m * vec2(0.055, 0.045);

  uv += flow;
  uv.x += sin(uv.y * 14.0 + uTime * 0.5 + m.x * 3.0) * 0.012;
  uv.y += cos(uv.x * 11.0 + uTime * 0.45 + m.y * 2.8) * 0.01;

  // Depth gradient: lit teal near the surface → near-black abyss as uDepth → 1
  float d = clamp(uDepth, 0.0, 1.0);
  vec3 abyss = mix(vec3(0.01, 0.05, 0.07), vec3(0.0, 0.012, 0.018), d);
  vec3 mid = mix(vec3(0.02, 0.16, 0.2), vec3(0.004, 0.03, 0.04), d);
  vec3 upper = mix(vec3(0.07, 0.42, 0.45), vec3(0.01, 0.05, 0.07), pow(d, 0.6));
  float depthMix = pow(clamp(uv.y, 0.0, 1.0), 0.82);
  vec3 col = mix(abyss, mid, depthMix);
  col = mix(col, upper, smoothstep(0.32, 1.0, uv.y) * 0.62);

  // Caustics fade out as sunlight is lost
  vec2 cuv = uv * vec2(18.0, 14.0) + m * 6.0;
  float c1 = fbm(cuv + uTime * 0.12);
  float c2 = fbm(cuv * 1.7 - uTime * 0.09 + m * 4.0);
  float caust = smoothstep(0.35, 0.95, c1 * 0.6 + c2 * 0.4) * (1.0 - smoothstep(0.0, 0.45, d));
  col += vec3(0.1, 0.55, 0.5) * caust * 0.34 * smoothstep(0.2, 1.0, uv.y);

  // Murk
  float murk = fbm(uv * 3.5 + uTime * 0.04) * 0.11;
  col = mix(col, col * vec3(0.8, 0.92, 0.94), murk);

  // Bioluminescent blooms grow with depth
  float bioField = fbm(uv * vec2(7.0, 5.0) + vec2(uTime * 0.03, -uTime * 0.02));
  float bio = smoothstep(0.62, 0.9, bioField) * (0.25 + 0.75 * sin(uTime * 0.8 + uv.x * 20.0) * 0.5 + 0.5) * smoothstep(0.25, 1.0, d);
  col += vec3(0.12, 0.62, 0.5) * bio * 0.22;

  // Faint sonar shimmer
  float scan = sin(uv.x * 40.0 + uv.y * 12.0 + uTime * 1.8 + m.x * 8.0) * 0.5 + 0.5;
  col += vec3(0.02, 0.14, 0.13) * smoothstep(0.85, 1.0, scan) * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  mouseRef: MutableRefObject<THREE.Vector2>;
  depthRef: MutableRefObject<number>;
  flowScale?: number;
};

export function UnderwaterBackdrop({ mouseRef, depthRef, flowScale = 1 }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uFlow: { value: flowScale },
      uDepth: { value: 0 },
    }),
    [flowScale]
  );

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uMouse.value.copy(mouseRef.current);
    mat.current.uniforms.uDepth.value = depthRef.current;
  });

  return (
    <mesh position={[0, 0, -32]} renderOrder={-1000}>
      <planeGeometry args={[90, 55, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
