import { useLayoutEffect, useRef } from "react";
import { blurRgb3InPlace, hash, heatRgbSonar } from "./sensorMath";

type Props = {
  p: number;
  sweepRad: number;
};

/** Internal raster resolution (higher = smoother). */
const LOGICAL = 256;
/** CSS display size (px). */
const DISPLAY = 170;

function getDpr() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

/** Polar-style scanning display — high-res buffer + DPR + light blur. */
export function PolarSonarCanvas({ p, sweepRad }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = getDpr();
    const IW = Math.round(LOGICAL * dpr);
    const IH = Math.round(LOGICAL * dpr);
    canvas.width = IW;
    canvas.height = IH;
    canvas.style.width = `${DISPLAY}px`;
    canvas.style.height = `${DISPLAY}px`;

    const cx = LOGICAL / 2;
    const cy = LOGICAL / 2;
    const rmax = LOGICAL * 0.44;

    const img = ctx.createImageData(IW, IH);
    const seed = p * 17.13;
    for (let py = 0; py < IH; py++) {
      for (let px = 0; px < IW; px++) {
        const lx = (px + 0.5) / dpr;
        const ly = (py + 0.5) / dpr;
        const dx = lx - cx;
        const dy = ly - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const i = (py * IW + px) * 4;
        if (dist > rmax || dist < 2) {
          img.data[i] = 8;
          img.data[i + 1] = 12;
          img.data[i + 2] = 22;
          img.data[i + 3] = 255;
          continue;
        }
        const ang = Math.atan2(dy, dx);
        const n =
          hash(ang * 3, dist * 0.08, seed) * 0.55 +
          hash(ang * 7, dist * 0.04, seed + 1) * 0.35 +
          (dist < rmax * 0.22 ? 0.35 : 0);
        const sweepBoost =
          Math.abs(((ang - sweepRad + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.35 ? 0.22 : 0;
        const t = Math.min(1, n + sweepBoost + Math.sin(seed + dist * 0.2) * 0.08);
        const [r, g, b] = heatRgbSonar(t);
        img.data[i] = r;
        img.data[i + 1] = g;
        img.data[i + 2] = b;
        img.data[i + 3] = 255;
      }
    }
    blurRgb3InPlace(img.data, IW, IH);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.putImageData(img, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rings = 4;
    ctx.strokeStyle = "rgba(56, 71, 96, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= rings; i++) {
      const rr = (rmax * i) / rings;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(100, 130, 158, 0.55)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepRad) * rmax, cy + Math.sin(sweepRad) * rmax);
    ctx.stroke();

    ctx.fillStyle = "rgba(71, 85, 105, 0.9)";
    ctx.beginPath();
    ctx.moveTo(cx, cy - rmax - 4);
    ctx.lineTo(cx - 4, cy - rmax + 4);
    ctx.lineTo(cx + 4, cy - rmax + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("N", cx, cy - rmax - 6);

    ctx.fillStyle = "rgba(100, 116, 139, 0.75)";
    ctx.font = "9px monospace";
    const labels = ["5", "10", "15", "20"];
    for (let i = 1; i <= rings; i++) {
      const rr = (rmax * i) / rings;
      ctx.fillText(`${labels[i - 1]}m`, cx + rr * 0.65, cy - 2);
    }
  }, [p, sweepRad]);

  return <canvas ref={ref} className="sensor-canvas sensor-canvas--polar" />;
}
