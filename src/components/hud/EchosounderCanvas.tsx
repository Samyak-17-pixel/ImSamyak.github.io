import { useLayoutEffect, useRef } from "react";
import { DEPTH_MAX_M, hash } from "./sensorMath";

type Props = { p: number; depth_m: number; echo_m: number };

const W = 240;
const H = 72;

function getDpr() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

/** Depth strip — axis anchored 0…~max depth; DPR for crisp strokes. */
export function EchosounderCanvas({ p, depth_m, echo_m }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = getDpr();
    const IW = Math.round(W * dpr);
    const IH = Math.round(H * dpr);
    canvas.width = IW;
    canvas.height = IH;
    canvas.style.width = "100%";
    canvas.style.height = `${56}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const pad = 8;
    const seed = p * 41.7;
    const yMin = 0;
    const yMax = Math.max(DEPTH_MAX_M + 2, echo_m + 2, depth_m + 1);
    const mapY = (d: number) => pad + ((yMax - d) / (yMax - yMin)) * (H - pad * 2);

    ctx.fillStyle = "rgba(8, 12, 24, 0.94)";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(51, 65, 85, 0.6)";
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const y = pad + (g / 4) * (H - pad * 2);
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(W - pad, y);
      ctx.stroke();
    }

    const n = 140;
    for (let i = 0; i < n; i++) {
      const x = pad + (i / (n - 1)) * (W - pad * 2);
      const jitter = (hash(i * 0.1, seed, 2) - 0.5) * 1.8;
      const y = mapY(depth_m + jitter);
      ctx.strokeStyle = `rgba(148, 163, 184, ${0.08 + hash(i, seed, 3) * 0.18})`;
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(71, 85, 105, 0.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const x = pad + (i / n) * (W - pad * 2);
      const trendD = depth_m * 0.88 + Math.sin(seed + i * 0.04) * 0.65;
      const y = mapY(Math.min(yMax - 0.2, Math.max(yMin + 0.2, trendD)));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(90, 120, 145, 0.85)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const x = pad + (i / n) * (W - pad * 2);
      const d = depth_m + Math.sin(seed * 0.8 + i * 0.09) * 0.35 + Math.sin(i * 0.2 + seed) * 0.15;
      const y = mapY(d);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "8px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${echo_m.toFixed(1)} m`, pad, 11);
    ctx.textAlign = "right";
    ctx.fillText("echosounder · bottom", W - pad, 11);
  }, [p, depth_m, echo_m]);

  return <canvas ref={ref} className="sensor-canvas sensor-canvas--echo" />;
}
