import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { MAX_DEPTH_M } from "@/content/sections";
import { byTier, env, maxDpr } from "@/lib/quality";
import { getScrollState, onScrollFrame } from "@/lib/scrollStore";
import { useBackgroundPaused } from "@/lib/sceneControl";
import { UnderwaterBackdrop } from "./UnderwaterBackdrop";
import { RisingBubbles } from "./RisingBubbles";
import { MarineParticles } from "./MarineParticles";
import { KelpStrands } from "./KelpStrands";
import { Bioluminescence } from "./Bioluminescence";
import { useSmoothedPointer } from "./useSmoothedPointer";

const BG = "#010a0e";
const SURFACE_FOG = new THREE.Color("#04303a");
const ABYSS_FOG = new THREE.Color("#010508");

const shaftVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const shaftFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
void main() {
  float across = pow(sin(vUv.x * 3.14159), 2.0);
  float along = smoothstep(0.0, 0.9, vUv.y);
  float flicker = 0.85 + 0.15 * sin(uTime * 0.7 + vUv.y * 6.0);
  gl_FragColor = vec4(uColor, across * along * uOpacity * flicker);
}
`;

/** Soft god-rays from the surface; they fade out as sunlight is lost with depth. */
function LightShafts({
  mouseRef,
  depthRef,
}: {
  mouseRef: MutableRefObject<THREE.Vector2>;
  depthRef: MutableRefObject<number>;
}) {
  const g = useRef<THREE.Group>(null);
  const materials = useMemo(
    () =>
      [0, 1, 2, 3].map(
        (i) =>
          new THREE.ShaderMaterial({
            vertexShader: shaftVertex,
            fragmentShader: shaftFragment,
            uniforms: {
              uColor: { value: new THREE.Color(i % 2 ? "#a7f3e4" : "#7fe3ff") },
              uOpacity: { value: 0.1 },
              uTime: { value: 0 },
            },
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          })
      ),
    []
  );
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.elapsedTime;
    const mx = mouseRef.current.x;
    g.current.rotation.z = Math.sin(t * 0.08) * 0.04 + mx * 0.05;
    g.current.position.x = mx * 1.2;
    const light = 1 - THREE.MathUtils.smoothstep(depthRef.current, 0.0, 0.3);
    materials.forEach((m, i) => {
      m.uniforms.uTime.value = t + i * 2;
      m.uniforms.uOpacity.value = (0.11 + Math.sin(t * 0.4 + i * 2) * 0.03) * light;
    });
    g.current.visible = light > 0.01;
  });
  return (
    <group ref={g} position={[0, 8, -10]}>
      {materials.map((m, i) => (
        <mesh key={i} position={[(i - 1.5) * 5.5, 0, -i * 1.5]} rotation={[0.2, 0, 0.1 * (i - 1.5)]} material={m}>
          <planeGeometry args={[3.5 + (i % 2) * 2.5, 30]} />
        </mesh>
      ))}
    </group>
  );
}

function OceanFloor({ depthRef }: { depthRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const k = THREE.MathUtils.smoothstep(depthRef.current, 0.6, 1);
    ref.current.position.y = THREE.MathUtils.lerp(-26, -12, k);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.85 * k;
  });
  return (
    <mesh ref={ref} position={[0, -26, 2]} rotation={[-Math.PI / 2.05, 0, 0]}>
      <planeGeometry args={[120, 70]} />
      <meshBasicMaterial color="#020c10" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function SceneContent() {
  const pointer = useSmoothedPointer(0.075);
  const depthRef = useRef(0);
  const velocityRef = useRef(0);
  const { scene, camera } = useThree();

  useFrame((_, delta) => {
    pointer.tick(delta);
    const s = getScrollState();
    const target = s.depth / MAX_DEPTH_M;
    depthRef.current += (target - depthRef.current) * (1 - Math.exp(-delta * 3));
    velocityRef.current += (s.velocity - velocityRef.current) * (1 - Math.exp(-delta * 6));

    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.copy(SURFACE_FOG).lerp(ABYSS_FOG, Math.min(1, depthRef.current * 1.6));
      fog.far = THREE.MathUtils.lerp(55, 30, depthRef.current);
    }
    // Gentle camera parallax with the pointer
    camera.position.x += (pointer.current.current.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (0.15 + pointer.current.current.y * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -6);
  });

  const mouseRef = pointer.current;

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={["#04303a", 10, 55]} />

      <hemisphereLight args={["#7fe3ff", "#02161c", 0.4]} />
      <ambientLight intensity={0.2} color="#cdeffa" />

      <UnderwaterBackdrop mouseRef={mouseRef} depthRef={depthRef} />
      <OceanFloor depthRef={depthRef} />
      <LightShafts mouseRef={mouseRef} depthRef={depthRef} />

      <MarineParticles count={byTier(4200)} mouseRef={mouseRef} velocityRef={velocityRef} />
      <RisingBubbles count={byTier(90)} mouseRef={mouseRef} depthRef={depthRef} />
      <Bioluminescence count={byTier(700)} depthRef={depthRef} velocityRef={velocityRef} />
      <KelpStrands mouseRef={mouseRef} depthRef={depthRef} />

      <Sparkles count={byTier(110)} scale={[26, 16, 18]} size={1.4} speed={0.2} opacity={0.28} color="#7fe3ff" />
    </>
  );
}

/** Invalidate the demand-rendered scene on scroll (reduced motion renders only when depth changes). */
function DemandOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => onScrollFrame(() => invalidate()), [invalidate]);
  return null;
}

export function MarineScene({ className }: { className?: string }) {
  const paused = useBackgroundPaused();
  const frameloop = paused ? "never" : env.reducedMotion ? "demand" : "always";
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={Math.min(maxDpr(), 1.5)}
        frameloop={frameloop}
        gl={{ antialias: env.tier === "high", alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.15, 14], fov: 46 }}
        onCreated={({ gl }) => gl.setClearColor(BG, 1)}
      >
        <Suspense fallback={null}>
          <SceneContent />
          {env.reducedMotion ? <DemandOnScroll /> : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
