import { useLayoutEffect, useRef } from "react";
import { blurRgb3InPlace, hash, heatRgbSonar } from "./sensorMath";

type Props = { p: number; contrast: number };

const N = 80;

function getDpr() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

/** Range × bearing patch — denser grid + blur. */
export function ImagingGridCanvas({ p, contrast }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = getDpr();
    const IW = Math.round(N * dpr);
    const IH = Math.round(N * dpr);
    canvas.width = IW;
    canvas.height = IH;
    canvas.style.width = "52px";
    canvas.style.height = "52px";

    const seed = p * 23.9;
    const img = ctx.createImageData(IW, IH);

    for (let py = 0; py < IH; py++) {
      for (let px = 0; px < IW; px++) {
        const nx = (px + 0.5) / dpr / N;
        const ny = (py + 0.5) / dpr / N;
        const d = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.52) ** 2);
        const t =
          hash(nx * 8, ny * 8, seed) * contrast +
          (d < 0.18 ? 0.4 : 0) +
          Math.max(0, 0.35 - d * 0.8);
        const [r, g, b] = heatRgbSonar(Math.min(1, t));
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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = "rgba(56, 71, 96, 0.35)";
    ctx.strokeRect(0, 0, N, N);
  }, [p, contrast]);

  return <canvas ref={ref} className="sensor-canvas sensor-canvas--img" />;
}
