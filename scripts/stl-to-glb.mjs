// Convert binary STL CAD exports into small, Draco-compressed GLB files for the web.
// Usage: node scripts/stl-to-glb.mjs <input.stl> <output.glb> [ratio=0.12]
//
// Pipeline: parse STL → weld duplicate vertices → meshoptimizer simplify →
// centre + normalise to unit size → Draco-compressed GLB. Normals are rebuilt at
// runtime (creased) so hard CAD edges stay crisp.
import fs from "node:fs";
import { Document, NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { MeshoptSimplifier } from "meshoptimizer";
import draco3d from "draco3dgltf";

const [, , input, output, ratioArg] = process.argv;
if (!input || !output) {
  console.error("Usage: node scripts/stl-to-glb.mjs <input.stl> <output.glb> [ratio]");
  process.exit(1);
}
const ratio = Number(ratioArg ?? 0.12);

function parseBinaryStl(buf) {
  const triCount = buf.readUInt32LE(80);
  if (84 + triCount * 50 !== buf.length) throw new Error("Not a binary STL (size mismatch)");
  const positions = new Float32Array(triCount * 9);
  let o = 84;
  for (let t = 0; t < triCount; t++) {
    o += 12; // skip facet normal
    for (let k = 0; k < 9; k++) positions[t * 9 + k] = buf.readFloatLE(o + k * 4);
    o += 38;
  }
  return positions;
}

function weld(soup, epsilon) {
  const map = new Map();
  const verts = [];
  const indices = new Uint32Array(soup.length / 3);
  const q = (v) => Math.round(v / epsilon);
  for (let i = 0; i < soup.length / 3; i++) {
    const x = soup[i * 3], y = soup[i * 3 + 1], z = soup[i * 3 + 2];
    const key = `${q(x)},${q(y)},${q(z)}`;
    let idx = map.get(key);
    if (idx === undefined) {
      idx = verts.length / 3;
      verts.push(x, y, z);
      map.set(key, idx);
    }
    indices[i] = idx;
  }
  return { positions: new Float32Array(verts), indices };
}

function compact(positions, indices) {
  const remap = new Int32Array(positions.length / 3).fill(-1);
  const out = [];
  const outIdx = new Uint32Array(indices.length);
  for (let i = 0; i < indices.length; i++) {
    const v = indices[i];
    if (remap[v] === -1) {
      remap[v] = out.length / 3;
      out.push(positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2]);
    }
    outIdx[i] = remap[v];
  }
  return { positions: new Float32Array(out), indices: outIdx };
}

function normalise(positions) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], positions[i + k]);
      max[k] = Math.max(max[k], positions[i + k]);
    }
  }
  const c = min.map((m, k) => (m + max[k]) / 2);
  const s = 1 / Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
  for (let i = 0; i < positions.length; i += 3) {
    for (let k = 0; k < 3; k++) positions[i + k] = (positions[i + k] - c[k]) * s;
  }
}

const t0 = Date.now();
const soup = parseBinaryStl(fs.readFileSync(input));
console.log(`parsed ${soup.length / 9} triangles`);

let { positions, indices } = weld(soup, 1e-4);
console.log(`welded → ${positions.length / 3} vertices`);

await MeshoptSimplifier.ready;
const target = Math.floor((indices.length * ratio) / 3) * 3;
const [simplified, err] = MeshoptSimplifier.simplify(indices, positions, 3, target, 0.01, ["LockBorder"]);
console.log(`simplified → ${simplified.length / 3} triangles (error ${err.toFixed(4)})`);

({ positions, indices } = compact(positions, simplified));
normalise(positions);

const doc = new Document();
const buffer = doc.createBuffer();
const prim = doc
  .createPrimitive()
  .setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(positions).setBuffer(buffer))
  .setIndices(doc.createAccessor().setType("SCALAR").setArray(indices).setBuffer(buffer));
const mesh = doc.createMesh("hull").addPrimitive(prim);
doc.createScene().addChild(doc.createNode("hull").setMesh(mesh));

doc
  .createExtension(KHRDracoMeshCompression)
  .setRequired(true)
  .setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER, quantizePosition: 14 });

const io = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({ "draco3d.encoder": await draco3d.createEncoderModule() });
await io.write(output, doc);

const mb = (fs.statSync(output).size / 1e6).toFixed(2);
console.log(`wrote ${output} (${mb} MB) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
