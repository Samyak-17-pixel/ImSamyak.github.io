import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { UnderwaterBackdrop } from "./UnderwaterBackdrop";
import { RisingBubbles } from "./RisingBubbles";
import { MarineParticles } from "./MarineParticles";
import { KelpStrands } from "./KelpStrands";
import { SonarSweep } from "./SonarSweep";
import { useSmoothedPointer } from "./useSmoothedPointer";

type Intensity = "hero" | "ambient";

function SonarRings({ intensity }: { intensity: Intensity }) {
  const group = useRef<THREE.Group>(null);
  const rings = 5;
  useFrame((s) => {
    if (!group.current) return;
    group.current.rotation.z = s.clock.elapsedTime * 0.06;
  });
  const scalePulse = intensity === "hero" ? 1 : 0.88;
  return (
    <group ref={group} position={[0, 0, -4]}>
      {Array.from({ length: rings }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2.15, 0, 0]}>
          <ringGeometry args={[1.1 + i * 1.35, 1.24 + i * 1.35, 64]} />
          <meshBasicMaterial
            color="#22d3ff"
            transparent
            opacity={0.09 + i * 0.032}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2.15, 0, 0]} scale={scalePulse}>
        <circleGeometry args={[9.5, 64]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function PulseRing() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!mesh.current) return;
    const t = s.clock.elapsedTime;
    const sc = 4.2 + Math.sin(t * 1.1) * 0.55;
    mesh.current.scale.setScalar(sc);
    const m = mesh.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.07 + Math.sin(t * 1.1) * 0.035;
  });
  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]} position={[0, -2.5, -6]}>
      <ringGeometry args={[1, 1.06, 64]} />
      <meshBasicMaterial
        color="#a78bfa"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function AbstractHull() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.1;
    ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.16) * 0.04;
  });
  return (
    <Float speed={1.0} rotationIntensity={0.22} floatIntensity={0.4}>
      <group ref={ref} position={[3.5, 0.12, -1.35]}>
        {/* Capsule default axis is Y; rotate −90° Z so hull lies horizontal along +X */}
        <group rotation={[0, 0, -Math.PI / 2]}>
          <mesh>
            <capsuleGeometry args={[0.48, 2.3, 8, 28]} />
            <meshStandardMaterial
              color="#1e3a5f"
              metalness={0.82}
              roughness={0.28}
              emissive="#0c1929"
              emissiveIntensity={0.45}
            />
          </mesh>
          <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.36, 0.055, 12, 48]} />
            <meshStandardMaterial
              color="#5b7a9e"
              emissive="#2d4a6f"
              emissiveIntensity={0.4}
              metalness={0.55}
              roughness={0.32}
            />
          </mesh>
          <mesh position={[0, 0.35, 0.4]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.18, 0.055, 0.12]} />
            <meshStandardMaterial
              color="#64748b"
              emissive="#475569"
              emissiveIntensity={0.35}
              metalness={0.35}
              roughness={0.38}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function OceanFloor() {
  return (
    <mesh position={[0, -16, 2]} rotation={[-Math.PI / 2.05, 0, 0]}>
      <planeGeometry args={[120, 70]} />
      <meshBasicMaterial color="#050818" transparent opacity={0.72} depthWrite={false} />
    </mesh>
  );
}

function LightShafts({ mouseRef }: { mouseRef: MutableRefObject<THREE.Vector2> }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.elapsedTime;
    const mx = mouseRef.current.x;
    g.current.rotation.z = Math.sin(t * 0.08) * 0.04 + mx * 0.05;
    g.current.position.x = mx * 1.2;
  });
  return (
    <group ref={g} position={[0, 8, -10]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 6.5, 0, -i * 2]} rotation={[0.2, 0, 0.08 * (i - 1)]}>
          <planeGeometry args={[5, 28]} />
          <meshBasicMaterial
            color={i === 1 ? "#7dd3fc" : "#c4b5fd"}
            transparent
            opacity={0.045}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({ intensity }: { intensity: Intensity }) {
  const pointer = useSmoothedPointer(0.075);
  useFrame((_, delta) => {
    pointer.tick(delta);
  });
  const mouseRef = pointer.current;
  const flow = intensity === "hero" ? 1.12 : 0.88;

  const sparkCount = intensity === "hero" ? 140 : 85;

  return (
    <>
      <color attach="background" args={["#080c18"]} />
      <fog attach="fog" args={["#0c1228", 10, 50]} />

      <hemisphereLight args={["#7dd3fc", "#1e1b4b", 0.42]} />
      <ambientLight intensity={0.2} color="#c7d2fe" />
      <pointLight position={[6, 5, 12]} intensity={1.15} color="#22d3ff" distance={62} />
      <pointLight position={[-8, -3, 8]} intensity={0.65} color="#a78bfa" distance={52} />
      <pointLight position={[0, -6, 4]} intensity={0.35} color="#6366f1" distance={40} />
      <directionalLight position={[2, 14, 6]} intensity={0.42} color="#e0f2fe" />

      <UnderwaterBackdrop mouseRef={mouseRef} flowScale={flow} />
      <OceanFloor />
      <LightShafts mouseRef={mouseRef} />

      <MarineParticles intensity={intensity} mouseRef={mouseRef} />
      <RisingBubbles intensity={intensity} mouseRef={mouseRef} />
      <KelpStrands mouseRef={mouseRef} />

      <Sparkles
        count={sparkCount}
        scale={[26, 16, 18]}
        size={intensity === "hero" ? 1.55 : 1.2}
        speed={0.2}
        opacity={0.32}
        color="#5ee7ff"
      />
      <Sparkles
        count={intensity === "hero" ? 90 : 55}
        scale={[26, 16, 18]}
        size={intensity === "hero" ? 1.15 : 0.9}
        speed={0.22}
        opacity={0.18}
        color="#c4b5fd"
      />

      <SonarSweep />
      <SonarRings intensity={intensity} />
      <PulseRing />
      <AbstractHull />
    </>
  );
}

type MarineSceneProps = {
  intensity: Intensity;
  className?: string;
};

const BG = "#080c18";

export function MarineScene({ intensity, className }: MarineSceneProps) {
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={dpr}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.15, 14], fov: 46 }}
        onCreated={({ gl }) => {
          gl.setClearColor(BG, 1);
        }}
      >
        <Suspense fallback={null}>
          <SceneContent intensity={intensity} />
        </Suspense>
      </Canvas>
    </div>
  );
}
