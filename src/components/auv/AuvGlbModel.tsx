import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type RenderMode = "solid" | "sonar";

const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`;

/** Creased-normal geometry per model URL, so revisits don't redo the work. */
const geometryCache = new Map<string, THREE.BufferGeometry>();

function useHullGeometry(url: string) {
  const gltf = useGLTF(url, DRACO_PATH);
  return useMemo(() => {
    const cached = geometryCache.get(url);
    if (cached) return cached;
    let source: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((o) => {
      if (!source && (o as THREE.Mesh).isMesh) source = (o as THREE.Mesh).geometry;
    });
    const geom = toCreasedNormals(source ?? new THREE.BoxGeometry(), (32 * Math.PI) / 180);
    geom.computeBoundingSphere();
    geometryCache.set(url, geom);
    return geom;
  }, [gltf, url]);
}

const sonarVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vPosL;
void main() {
  vPosL = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPosW = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const sonarFragment = /* glsl */ `
uniform float uTime;
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vPosL;
void main() {
  vec3 V = normalize(cameraPosition - vPosW);
  float fres = pow(1.0 - abs(dot(normalize(vNormalW), V)), 2.2);
  float band = fract(vPosL.x * 1.2 - uTime * 0.35);
  float sweep = smoothstep(0.0, 0.04, band) * (1.0 - smoothstep(0.04, 0.14, band));
  float lines = smoothstep(0.92, 1.0, abs(sin(vPosL.y * 180.0))) * 0.25;
  vec3 teal = vec3(0.37, 0.95, 0.84);
  vec3 col = teal * (0.08 + fres * 0.9 + lines * fres) + vec3(1.0, 0.71, 0.28) * sweep * 0.9;
  gl_FragColor = vec4(col, 0.25 + fres * 0.75 + sweep * 0.5);
}
`;

type Props = {
  url: string;
  mode?: RenderMode;
  autoRotate?: boolean;
};

export function AuvGlbModel({ url, mode = "solid", autoRotate = true }: Props) {
  const geom = useHullGeometry(url);
  const group = useRef<THREE.Group>(null);

  const solid = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#a9b6bd"),
        metalness: 0.9,
        roughness: 0.24,
        envMapIntensity: 1.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        sheen: 0.3,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color("#5ef2d6"),
      }),
    []
  );

  const sonar = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sonarVertex,
        fragmentShader: sonarFragment,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state, delta) => {
    sonar.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current && autoRotate) group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group} rotation={[0.08, 0.55, 0]}>
      <mesh geometry={geom} material={mode === "sonar" ? sonar : solid} />
    </group>
  );
}

export function preloadAuv(url: string) {
  useGLTF.preload(url, DRACO_PATH);
}
