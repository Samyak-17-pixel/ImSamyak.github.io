import { useLayoutEffect, useRef } from "react";
import { hash } from "./sensorMath";

type Props = { p: number };

const W = 44;
const H = 120;

function getDpr() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

/** A-scan — crisp lines at device pixel ratio. */
export function AScanCanvas({ p }: Props) {
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
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const seed = p * 29.4;
    ctx.fillStyle = "rgba(8, 12, 24, 0.96)";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(51, 65, 85, 0.45)";
    for (let i = 0; i < 5; i++) {
      const x = 4 + (i / 4) * (W - 8);
      ctx.beginPath();
      ctx.moveTo(x, 4);
      ctx.lineTo(x, H - 4);
      ctx.stroke();
    }

    const mid = W / 2;
    ctx.strokeStyle = "rgba(82, 115, 138, 0.88)";
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    for (let y = 4; y <= H - 4; y++) {
      const r = (y - 4) / (H - 8);
      const env = Math.exp(-r * 2.8) * (0.35 + 0.65 * hash(r * 10, seed, 4));
      const pk =
        Math.abs(Math.sin(seed * 3 + r * 40)) * env * 14 +
        Math.abs(Math.sin(seed * 5 + r * 88)) * env * 7;
      const half = pk * 0.5;
      ctx.moveTo(mid - half, y);
      ctx.lineTo(mid + half, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(56, 71, 96, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = 4; y <= H - 4; y++) {
      const r = (y - 4) / (H - 8);
      const pk = hash(r * 20, seed, 5) * 9;
      ctx.moveTo(mid - pk, y);
      ctx.lineTo(mid + pk, y);
    }
    ctx.stroke();
  }, [p]);

  return <canvas ref={ref} className="sensor-canvas sensor-canvas--ascan" />;
}
