import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AuvPartId } from "./sensorInfo";

export type AuvViewMode = "structure" | "sensors" | "dataflow";

export type HoverState = {
  id: AuvPartId;
  label: string;
  x: number;
  y: number;
} | null;

type PartProps = {
  id: AuvPartId;
  label: string;
  isHot: boolean;
  onHover: (next: HoverState) => void;
  onSelect: (id: AuvPartId) => void;
  children: React.ReactNode;
  edgeColor?: string;
  edgeStrength?: number;
};

function Part({
  id,
  label,
  isHot,
  onHover,
  onSelect,
  children,
  edgeColor,
  edgeStrength,
}: PartProps) {
  return (
    <group
      onPointerMove={(e) => {
        e.stopPropagation();
        onHover({ id, label, x: e.clientX, y: e.clientY });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover({ id, label, x: e.clientX, y: e.clientY });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <group>
        {children}
        {isHot ? (
          <group>
            <Edges
              scale={1.0}
              threshold={20}
              color={edgeColor ?? "#5ee7ff"}
              opacity={0.9}
            />
            <mesh>
              <sphereGeometry args={[0.001, 3, 2]} />
              <meshBasicMaterial
                transparent
                opacity={0}
                depthWrite={false}
              />
            </mesh>
            {/* subtle additive halo via fake sprite-like light */}
            <pointLight
              color={edgeColor ?? "#5ee7ff"}
              intensity={edgeStrength ?? 1.2}
              distance={2.2}
            />
          </group>
        ) : null}
      </group>
    </group>
  );
}

type Props = {
  mode: AuvViewMode;
  hoveredId: AuvPartId | null;
  selectedId: AuvPartId | null;
  onHover: (next: HoverState) => void;
  onSelect: (id: AuvPartId) => void;
};

export function AuvModel({ mode, hoveredId, selectedId, onHover, onSelect }: Props) {
  const root = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((s, delta) => {
    if (!root.current) return;
    t.current += delta;
    root.current.position.y = Math.sin(s.clock.elapsedTime * 0.7) * 0.06;
  });

  const mats = useMemo(() => {
    const hull = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#cbd5e1"),
      metalness: 0.75,
      roughness: 0.22,
      emissive: new THREE.Color("#0b2238"),
      emissiveIntensity: 0.75,
    });
    const frame = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#94a3b8"),
      metalness: 0.65,
      roughness: 0.35,
      emissive: new THREE.Color("#0b1220"),
      emissiveIntensity: 0.18,
    });
    const sensorCold = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1d4ed8"),
      metalness: 0.35,
      roughness: 0.32,
      emissive: new THREE.Color("#0ea5e9"),
      emissiveIntensity: 0.65,
    });
    const sensorHot = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#38bdf8"),
      metalness: 0.25,
      roughness: 0.22,
      emissive: new THREE.Color("#5ee7ff"),
      emissiveIntensity: 1.1,
    });
    const sonar = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#a78bfa"),
      metalness: 0.35,
      roughness: 0.22,
      emissive: new THREE.Color("#c4b5fd"),
      emissiveIntensity: 0.55,
    });
    return { hull, frame, sensorCold, sensorHot, sonar };
  }, []);

  const showHull = mode !== "sensors" || selectedId === null;

  const isHot = (id: AuvPartId) => id === hoveredId || id === selectedId;
  const sensorMat = (id: AuvPartId) => (isHot(id) ? mats.sensorHot : mats.sensorCold);

  return (
    <group ref={root} rotation={[0.06, 0.55, 0]} position={[0, 0, 0]}>
      {/* Body (horizontal) */}
      {showHull ? (
        <group rotation={[0, 0, -Math.PI / 2]}>
          <mesh>
            <capsuleGeometry args={[0.52, 2.55, 10, 36]} />
            <primitive object={mats.hull} attach="material" />
            <Edges color="rgba(240,249,255,0.45)" />
          </mesh>
          <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.38, 0.06, 14, 56]} />
            <meshStandardMaterial
              color="#60a5fa"
              metalness={0.55}
              roughness={0.3}
              emissive="#22d3ff"
              emissiveIntensity={0.55}
            />
            <Edges color="rgba(94,231,255,0.5)" />
          </mesh>
        </group>
      ) : null}

      {/* Axial thruster (rear) */}
      <Part
        id="thruster_axial"
        label="Axial thruster"
        isHot={isHot("thruster_axial")}
        onHover={onHover}
        onSelect={onSelect}
        edgeColor="#5ee7ff"
        edgeStrength={1.6}
      >
        <group position={[-1.55, 0.0, 0.0]} rotation={[0, 0, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.23, 0.23, 0.28, 22]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.6}
              roughness={0.35}
              emissive={isHot("thruster_axial") ? "#22d3ff" : "#0b1220"}
              emissiveIntensity={isHot("thruster_axial") ? 0.7 : 0.18}
            />
            <Edges color="rgba(186,230,253,0.45)" />
          </mesh>
          <mesh position={[-0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.12, 0.03, 12, 28]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive={isHot("thruster_axial") ? "#5ee7ff" : "#1e293b"}
              emissiveIntensity={isHot("thruster_axial") ? 0.8 : 0.2}
              metalness={0.2}
              roughness={0.45}
            />
          </mesh>
          <mesh position={[-0.16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <coneGeometry args={[0.14, 0.22, 22]} />
            <meshStandardMaterial
              color="#111827"
              emissive={isHot("thruster_axial") ? "#22d3ff" : "#0b1220"}
              emissiveIntensity={isHot("thruster_axial") ? 0.55 : 0.15}
              metalness={0.2}
              roughness={0.55}
            />
          </mesh>
        </group>
      </Part>

      {/* IMU */}
      <Part id="imu" label="IMU" isHot={isHot("imu")} onHover={onHover} onSelect={onSelect}>
        <group position={[-0.18, 0.22, 0.18]} rotation={[0.15, 0.4, 0.08]}>
          <mesh>
            <boxGeometry args={[0.22, 0.08, 0.16]} />
            <primitive object={sensorMat("imu")} attach="material" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.08, 0.03, 0.08]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive={isHot("imu") ? "#5ee7ff" : "#172554"}
              emissiveIntensity={isHot("imu") ? 0.8 : 0.25}
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>
        </group>
      </Part>

      {/* DVL */}
      <Part id="dvl" label="DVL" isHot={isHot("dvl")} onHover={onHover} onSelect={onSelect}>
        <group position={[0.15, -0.5, 0.0]} rotation={[0.0, 0.2, 0.0]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 0.14, 18]} />
            <primitive object={sensorMat("dvl")} attach="material" />
            <Edges color="rgba(94,231,255,0.55)" />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <coneGeometry args={[0.15, 0.18, 18]} />
            <meshStandardMaterial
              color="#0b1d2f"
              metalness={0.25}
              roughness={0.35}
              emissive={isHot("dvl") ? "#22d3ff" : "#0b1220"}
              emissiveIntensity={isHot("dvl") ? 0.55 : 0.18}
            />
            <Edges color="rgba(94,231,255,0.45)" />
          </mesh>
        </group>
      </Part>

      {/* Ping2 echosounder (bottom) */}
      <Part id="ping2" label="Ping2" isHot={isHot("ping2")} onHover={onHover} onSelect={onSelect}>
        <group position={[0.55, -0.58, 0.0]} rotation={[0, 0.2, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.32, 18]} />
            <primitive object={sensorMat("ping2")} attach="material" />
            <Edges color="rgba(196,181,253,0.55)" />
          </mesh>
          <mesh position={[0.0, -0.05, 0.0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color="#111827"
              emissive={isHot("ping2") ? "#a78bfa" : "#1e1b4b"}
              emissiveIntensity={isHot("ping2") ? 0.7 : 0.18}
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>
        </group>
      </Part>

      {/* Side-scan sonars (bottom left/right) */}
      <Part
        id="sonar_sidescan_l"
        label="Side-scan (port)"
        isHot={isHot("sonar_sidescan_l")}
        onHover={onHover}
        onSelect={onSelect}
        edgeColor="#a78bfa"
        edgeStrength={1.2}
      >
        <group position={[0.15, -0.62, 0.72]} rotation={[0.08, 0.18, 0.0]}>
          <mesh>
            <boxGeometry args={[0.78, 0.12, 0.18]} />
            <meshStandardMaterial
              color="#c4b5fd"
              metalness={0.2}
              roughness={0.42}
              emissive={isHot("sonar_sidescan_l") ? "#a78bfa" : "#1e1b4b"}
              emissiveIntensity={isHot("sonar_sidescan_l") ? 0.5 : 0.14}
            />
            <Edges color="rgba(196,181,253,0.65)" />
          </mesh>
          <mesh position={[0.3, 0.06, 0]}>
            <boxGeometry args={[0.18, 0.06, 0.12]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive={isHot("sonar_sidescan_l") ? "#5ee7ff" : "#1e293b"}
              emissiveIntensity={isHot("sonar_sidescan_l") ? 0.5 : 0.15}
              metalness={0.2}
              roughness={0.55}
            />
          </mesh>
        </group>
      </Part>

      <Part
        id="sonar_sidescan_r"
        label="Side-scan (starboard)"
        isHot={isHot("sonar_sidescan_r")}
        onHover={onHover}
        onSelect={onSelect}
        edgeColor="#a78bfa"
        edgeStrength={1.2}
      >
        <group position={[0.15, -0.62, -0.72]} rotation={[-0.08, 0.18, 0.0]}>
          <mesh>
            <boxGeometry args={[0.78, 0.12, 0.18]} />
            <meshStandardMaterial
              color="#c4b5fd"
              metalness={0.2}
              roughness={0.42}
              emissive={isHot("sonar_sidescan_r") ? "#a78bfa" : "#1e1b4b"}
              emissiveIntensity={isHot("sonar_sidescan_r") ? 0.5 : 0.14}
            />
            <Edges color="rgba(196,181,253,0.65)" />
          </mesh>
          <mesh position={[0.3, 0.06, 0]}>
            <boxGeometry args={[0.18, 0.06, 0.12]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive={isHot("sonar_sidescan_r") ? "#5ee7ff" : "#1e293b"}
              emissiveIntensity={isHot("sonar_sidescan_r") ? 0.5 : 0.15}
              metalness={0.2}
              roughness={0.55}
            />
          </mesh>
        </group>
      </Part>

      {/* Pressure sensor */}
      <Part
        id="pressure"
        label="Pressure sensor"
        isHot={isHot("pressure")}
        onHover={onHover}
        onSelect={onSelect}
      >
        <group position={[0.0, -0.1, 0.46]} rotation={[0.0, 0.0, 0.0]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.28, 16]} />
            <primitive object={sensorMat("pressure")} attach="material" />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive={isHot("pressure") ? "#a78bfa" : "#1e1b4b"}
              emissiveIntensity={isHot("pressure") ? 0.5 : 0.18}
              metalness={0.2}
              roughness={0.45}
            />
          </mesh>
        </group>
      </Part>

      {/* Front camera */}
      <Part id="camera" label="Camera" isHot={isHot("camera")} onHover={onHover} onSelect={onSelect}>
        <group position={[1.62, 0.1, 0.0]} rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.18, 0.12, 0.18]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.25}
              roughness={0.45}
              emissive={isHot("camera") ? "#22d3ff" : "#0b1220"}
              emissiveIntensity={isHot("camera") ? 0.65 : 0.12}
            />
            <Edges color="rgba(94,231,255,0.65)" />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.1, 16]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive={isHot("camera") ? "#5ee7ff" : "#1e293b"}
              emissiveIntensity={isHot("camera") ? 0.8 : 0.18}
              metalness={0.2}
              roughness={0.35}
            />
          </mesh>
        </group>
      </Part>

      {/* Dataflow overlay: simple EKF node + links */}
      {mode === "dataflow" ? (
        <group>
          <mesh position={[-0.7, 0.55, -0.35]} rotation={[0.0, 0.2, 0.0]}>
            <boxGeometry args={[0.48, 0.18, 0.28]} />
            <meshStandardMaterial
              color="#0b1220"
              emissive="#22d3ff"
              emissiveIntensity={0.35}
              metalness={0.2}
              roughness={0.55}
            />
          </mesh>
          <lineSegments>
            <bufferGeometry
              attach="geometry"
              attributes={{
                position: new THREE.BufferAttribute(
                  new Float32Array([
                    -0.7, 0.55, -0.35, -0.2, 0.25, 0.18, // EKF -> IMU
                    -0.7, 0.55, -0.35, 0.15, -0.35, 0.0, // EKF -> DVL
                    -0.7, 0.55, -0.35, 0.0, -0.1, 0.46, // EKF -> Pressure
                    -0.7, 0.55, -0.35, 0.55, -0.58, 0.0, // EKF -> Ping2
                    -0.7, 0.55, -0.35, 1.62, 0.1, 0.0, // EKF -> Camera
                    -0.7, 0.55, -0.35, -1.55, 0.0, 0.0, // EKF -> Thruster
                    -0.7, 0.55, -0.35, 0.15, -0.62, 0.72, // EKF -> Side-scan L
                    -0.7, 0.55, -0.35, 0.15, -0.62, -0.72, // EKF -> Side-scan R
                  ]),
                  3
                ),
              }}
            />
            <lineBasicMaterial
              color="#5ee7ff"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        </group>
      ) : null}
    </group>
  );
}

