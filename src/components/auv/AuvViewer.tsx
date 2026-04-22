import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { DhwaniStlModel } from "./DhwaniStlModel";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

type Props = {
  className?: string;
  name?: string;
  stlPath?: string;
};

export function AuvViewer({
  className,
  name = "DHWANI",
  stlPath = "models/DHWANI.stl",
}: Props) {
  const [hovered, setHovered] = useState<{ label: string; x: number; y: number } | null>(null);

  return (
    <div className={"auv-viewer " + (className ?? "")}>
      <div className="auv-viewer__top">
        <div className="auv-viewer__label-wrap">
          <span className="auv-viewer__label">
            <span className="auv-viewer__label-text">{name}</span>
          </span>
        </div>
      </div>

      <div className="auv-viewer__stage" aria-label={`${name} 3D model`}>
        <Canvas
          dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
          camera={{ position: [0, 0.25, 4.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.32} color="#c7d2fe" />
          <hemisphereLight args={["#7dd3fc", "#1e1b4b", 0.55]} />
          <directionalLight position={[3.5, 4.2, 5.5]} intensity={0.9} color="#e0f2fe" />
          <pointLight position={[-3.2, 1.2, 2.0]} intensity={0.7} color="#a78bfa" />
          <pointLight position={[2.2, -1.6, 1.2]} intensity={0.55} color="#22d3ff" />

          <Environment preset="studio" environmentIntensity={0.55} />

          <Bounds fit clip observe margin={1.06}>
            <DhwaniStlModel
              url={`${import.meta.env.BASE_URL}${stlPath}`}
              label={name}
              onHover={setHovered}
            />
          </Bounds>

          <OrbitControls
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={0.6}
            maxDistance={20}
            rotateSpeed={0.7}
            zoomSpeed={0.8}
          />
        </Canvas>

        {hovered ? (
          <div
            className="auv-tooltip"
            style={{
              left: clamp(hovered.x + 14, 10, window.innerWidth - 180),
              top: clamp(hovered.y + 14, 10, window.innerHeight - 80),
            }}
            role="status"
            aria-live="polite"
          >
            <div className="auv-tooltip__label">{hovered.label}</div>
            <div className="auv-tooltip__meta">hover highlight</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

