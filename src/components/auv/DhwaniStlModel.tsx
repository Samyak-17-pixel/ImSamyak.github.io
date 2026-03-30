import { Edges } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type HoverState = { label: string; x: number; y: number } | null;

type Props = {
  url: string;
  label?: string;
  onHover: (h: HoverState) => void;
};

function normalizeGeometry(geom: THREE.BufferGeometry) {
  geom.computeVertexNormals();
  geom.computeBoundingBox();
  const box = geom.boundingBox;
  if (!box) return geom;

  const center = new THREE.Vector3();
  box.getCenter(center);
  geom.translate(-center.x, -center.y, -center.z);

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  // Normalize to ~unit size; camera `Bounds` fits the mesh to the viewer frame.
  const scale = 1 / maxDim;
  geom.scale(scale, scale, scale);

  return geom;
}

export function DhwaniStlModel({ url, label = "DHWANI", onHover }: Props) {
  const raw = useLoader(STLLoader, url);

  const geom = useMemo(() => {
    const g = raw.clone();
    return normalizeGeometry(g);
  }, [raw]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#9aa3ad"),
        metalness: 1,
        roughness: 0.18,
        envMapIntensity: 1.35,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        reflectivity: 1,
        sheen: 0.35,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color("#c7d2fe"),
      }),
    []
  );

  return (
    <group rotation={[0.08, 0.55, 0]} position={[0, 0, 0]}>
      <mesh
        geometry={geom}
        material={material}
        onPointerMove={(e) => {
          e.stopPropagation();
          onHover({ label, x: e.clientX, y: e.clientY });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover({ label, x: e.clientX, y: e.clientY });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
      >
        <Edges threshold={22} color="rgba(148, 163, 184, 0.22)" />
      </mesh>
    </group>
  );
}

