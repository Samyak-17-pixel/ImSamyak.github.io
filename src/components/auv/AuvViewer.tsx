import { Canvas } from "@react-three/fiber";
import { Bounds, ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { maxDpr } from "@/lib/quality";
import { AuvGlbModel } from "./AuvGlbModel";
import type { RenderMode } from "./AuvGlbModel";

type Props = {
  src: string;
  name: string;
  className?: string;
  mode?: RenderMode;
  autoRotate?: boolean;
  /** Orbit/zoom controls; off for card previews so the page keeps scrolling. */
  interactive?: boolean;
};

function Loader({ name }: { name: string }) {
  return (
    <div className="auv-loading" role="status">
      <span className="auv-loading__ring" />
      Acquiring {name}…
    </div>
  );
}

export function AuvViewer({ src, name, className, mode = "solid", autoRotate = true, interactive = true }: Props) {
  return (
    <div className={"auv-stage " + (className ?? "")} aria-label={`${name} 3D model`} role="img">
      <Suspense fallback={<Loader name={name} />}>
        <Canvas
          dpr={maxDpr()}
          camera={{ position: [0, 0.25, 4.2], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.25} color="#cdeffa" />
          <directionalLight position={[3.5, 4.2, 5.5]} intensity={1.1} color="#e9fbff" />
          <pointLight position={[-3.2, 1.2, 2]} intensity={1.2} color="#5ef2d6" />
          <pointLight position={[2.2, -1.6, 1.2]} intensity={0.8} color="#36c9ff" />

          <Environment resolution={256}>
            <Lightformer form="rect" intensity={2.2} position={[0, 3, 2]} scale={[6, 1.4, 1]} color="#e6fbff" />
            <Lightformer form="rect" intensity={1.4} position={[-4, 0.5, -1]} scale={[2, 4, 1]} color="#5ef2d6" />
            <Lightformer form="rect" intensity={1.0} position={[4, -0.5, 1]} scale={[2, 4, 1]} color="#36c9ff" />
            <Lightformer form="ring" intensity={0.9} position={[0, -3, 0]} scale={3} color="#ffb547" />
          </Environment>

          <Bounds fit clip observe margin={1.12}>
            <AuvGlbModel url={`${import.meta.env.BASE_URL}${src}`} mode={mode} autoRotate={autoRotate} />
          </Bounds>
          {mode === "solid" ? (
            <ContactShadows position={[0, -0.42, 0]} opacity={0.45} scale={3} blur={2.6} far={1.2} color="#000" />
          ) : null}

          {interactive ? (
            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={0.5} maxDistance={8} />
          ) : null}
        </Canvas>
      </Suspense>
    </div>
  );
}
