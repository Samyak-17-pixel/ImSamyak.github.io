/** Decorative readouts derived from scroll progress only (0–1). */

/** Maximum depth (m) at bottom of page — “mission” ceiling for HUD. */
export const DEPTH_MAX_M = 36;

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function missionPhaseFromP(pe: number): { label: string; id: string } {
  if (pe < 0.2) return { id: "surf", label: "SURFACE / IDLE" };
  if (pe < 0.52) return { id: "transit", label: "DESCENT / TRANSIT" };
  if (pe < 0.82) return { id: "survey", label: "SURVEY / MAPPING" };
  return { id: "ascent", label: "ASCENT / RECOVERY" };
}

/** All values derive from scroll `p` ∈ [0, 1]. Depth increases 0 → DEPTH_MAX_M with eased progress. */
export function readoutsFromProgress(p: number) {
  const pe = smoothstep(p);
  const depth_m = pe * DEPTH_MAX_M;
  const s = p * Math.PI * 14;
  const w = (f: number) => Math.sin(s * f);

  const heading_deg = ((112 + w(0.35) * 85 + 360) % 360 + 360) % 360;
  const pitch_deg = w(1.05) * 5.5;
  const roll_deg = w(0.92) * 7;

  // ~1 bar at surface + ~0.1 bar per metre (decorative, not calibrated)
  const pressure_bar = 1.013 + depth_m * 0.1008;

  // Bottom range increases with depth + small oscillation
  const echo_range_m = Math.max(14, depth_m + 10 + w(0.9) * 4 + w(1.5) * 2);

  return {
    depth_m,
    depth_max_m: DEPTH_MAX_M,
    scroll_eased: pe,
    mission_phase: missionPhaseFromP(pe),
    heading_deg,
    pitch_deg,
    roll_deg,
    imu_m_s2: {
      ax: w(2.1) * 0.55,
      ay: w(2.35) * 0.48,
      az: 9.78 + w(1.4) * 0.12,
    },
    imu_rad_s: {
      wx: w(3.2) * 0.045,
      wy: w(2.9) * 0.038,
      wz: w(2.4) * 0.022,
    },
    dvl_m_s: {
      vx: w(1.15) * 0.42,
      vy: w(0.88) * 0.31,
      vz: w(1.55) * 0.09,
    },
    dvl_alt_m: 1.85 + w(0.72) * 0.55,
    pressure_bar,
    echo_range_m,
    modem_dbm: -41 + w(1.65) * 14,
    modem_pkts: Math.floor(800 + p * 2400 + w(1) * 120),
    usbl_m: {
      x: w(0.48) * 12,
      y: w(0.55) * 9,
      z: -(11.2 + w(0.38) * 3.5),
    },
    snr_db: 15 + w(1.18) * 11,
    imaging_contrast: 0.35 + w(1.9) * 0.4,
    sweep_rad: p * Math.PI * 12,
  };
}

export function fract(n: number) {
  return n - Math.floor(n);
}

export function hash(a: number, r: number, seed: number) {
  return fract(Math.sin(a * 12.9898 + r * 78.233 + seed * 31.374) * 43758.5453123);
}

/** Blue → cyan → yellow (0–1). */
export function heatRgb(t: number) {
  const x = Math.min(1, Math.max(0, t));
  const r = Math.min(1, x * 3);
  const g = Math.min(1, x < 1 / 3 ? x * 3 : 1.5 - x * 1.5);
  const b = Math.max(0, 1 - x * 2.2);
  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)] as const;
}

/** Muted sonar heat — stays close to page bg (#080c18): deep slate → cool cyan-grey. */
export function heatRgbSonar(t: number) {
  const x = Math.min(1, Math.max(0, t));
  const r = Math.floor(10 + x * 38);
  const g = Math.floor(14 + x * 52);
  const b = Math.floor(22 + x * 68);
  return [r, g, b] as const;
}

/** Lightweight 3×3 box blur on RGBA (in-place on non-edge pixels). */
export function blurRgb3InPlace(data: Uint8ClampedArray, w: number, h: number) {
  const src = new Uint8ClampedArray(data);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const j = ((y + dy) * w + (x + dx)) * 4;
          r += src[j];
          g += src[j + 1];
          b += src[j + 2];
        }
      }
      const i = (y * w + x) * 4;
      data[i] = r / 9;
      data[i + 1] = g / 9;
      data[i + 2] = b / 9;
    }
  }
}
