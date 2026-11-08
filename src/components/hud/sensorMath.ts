/** Decorative telemetry derived from dive depth + time (not real hardware). */
import { MAX_DEPTH_M } from "@/content/sections";

export const DEPTH_MAX_M = MAX_DEPTH_M;

export function fract(n: number) {
  return n - Math.floor(n);
}

export function hash(a: number, r: number, seed: number) {
  return fract(Math.sin(a * 12.9898 + r * 78.233 + seed * 31.374) * 43758.5453123);
}

/** Smooth 1D value noise in [0, 1]. */
export function noise1(x: number, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i, 0, seed) * (1 - u) + hash(i + 1, 0, seed) * u;
}

/** Smooth 2D value noise in [0, 1]. */
export function noise2(x: number, y: number, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  return a + (b - a) * ux + (c - a) * uy * (1 - ux) + (d - b) * ux * uy;
}

/** Live-looking readouts for every sensor at a given depth. */
export function telemetry(depth_m: number, t: number) {
  const w = (f: number, ph = 0) => Math.sin(t * f + ph);
  return {
    depth_m,
    pressure_bar: 1.013 + depth_m * 0.1005,
    heading_deg: (((112 + w(0.05) * 60 + depth_m * 0.08) % 360) + 360) % 360,
    pitch_deg: w(0.6) * 2.5,
    roll_deg: w(0.45, 1) * 3.5,
    gyro_z: w(0.9) * 0.02,
    dvl_vx: 0.85 + w(0.3) * 0.12,
    dvl_alt_m: 4.2 + w(0.21) * 1.1,
    usbl_range_m: 12 + depth_m * 1.02 + w(0.4) * 0.6,
    fls_range_m: 18 + w(0.33) * 6,
    img_snr_db: 18 + w(0.7) * 5,
    sss_swath_m: 60 + w(0.2) * 4,
    xpdr_count: 4,
    modem_bps: Math.round(480 + w(0.5) * 40),
  };
}
