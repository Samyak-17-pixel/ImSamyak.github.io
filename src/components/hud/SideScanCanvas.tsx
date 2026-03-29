import { useLayoutEffect, useRef } from "react";
import { blurRgb3InPlace, hash, heatRgbSonar } from "./sensorMath";

type Props = { p: number };

const W = 360;
const H = 56;

function getDpr() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

/** Side-scan style strip — higher resolution + blur for smoother texture. */
export function SideScanCanvas({ p }: Props) {
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
    canvas.style.height = `${32}px`;

    const img = ctx.createImageData(IW, IH);
    const off = p * 400;
    const seed = p * 11.2;

    for (let py = 0; py < IH; py++) {
      for (let px = 0; px < IW; px++) {
        const lx = (px + 0.5) / dpr;
        const ly = (py + 0.5) / dpr;
        const u = (lx + off) * 0.035;
        const v = ly * 0.28;
        const t =
          hash(u, v, 6) * 0.5 +
          hash(u * 2, v * 2, 7) * 0.35 +
          (Math.abs(ly - H / 2) < 5 ? 0.22 : 0) +
          Math.sin(seed + u * 0.5) * 0.04;
        const [r, g, b] = heatRgbSonar(Math.min(1, t + Math.sin(u) * 0.06));
        const i = (py * IW + px) * 4;
        img.data[i] = r;
        img.data[i + 1] = g;
        img.data[i + 2] = b;
        img.data[i + 3] = 255;
      }
    }
    blurRgb3InPlace(img.data, IW, IH);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.putImageData(img, 0, 0);

    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "rgba(56, 71, 96, 0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
  }, [p]);

  return <canvas ref={ref} className="sensor-canvas sensor-canvas--sidescan" />;
}
