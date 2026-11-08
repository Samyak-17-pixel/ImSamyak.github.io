import { useRef } from "react";
import { hash, noise1, noise2 } from "@/components/hud/sensorMath";
import { useSensorCanvas } from "./useSensorCanvas";
import { copper } from "./palette";

const ROWS_PER_SEC = 38;
const TARGET_EVERY = 170;

function intensityAt(x: number, W: number, row: number) {
  const c = W / 2;
  const side = x < c ? 0 : 1;
  const d = Math.abs(x - c) / c;
  const nadir = 0.12 + noise1(row * 0.01, 7) * 0.08;
  if (d < nadir) return 0.04 + hash(x, row, 1) * 0.04;
  const rr = (d - nadir) / (1 - nadir);
  if (rr < 0.025) return 0.85 + hash(x, row, 2) * 0.15; // first bottom return
  let v =
    noise2(x * 0.06, row * 0.04, side + 3) * 0.55 +
    noise2(x * 0.25, row * 0.15, side + 5) * 0.2 +
    hash(x, row, 4) * 0.25 +
    Math.sin(row * 0.35 + rr * 30) * 0.06;
  v *= 1 - rr * 0.55;

  // Contacts with acoustic shadows
  const ti = Math.round(row / TARGET_EVERY);
  const tRow = ti * TARGET_EVERY;
  const tSide = hash(ti, 0, 11) > 0.5 ? 1 : 0;
  const tPos = 0.15 + hash(ti, 1, 11) * 0.55;
  const dr = Math.abs(row - tRow);
  if (side === tSide && dr < 7) {
    if (Math.abs(rr - tPos) < 0.035) v = 1.0;
    else if (rr > tPos + 0.035 && rr < tPos + 0.2) v *= 0.12;
  }
  return v;
}

/** Side-scan sonar waterfall: port/starboard seabed imagery scrolling down the timeline spine. */
export function SideScanWaterfall({ className }: { className?: string }) {
  const row = useRef(0);
  const acc = useRef(0);
  const size = useRef({ w: 0, h: 0 });

  const ref = useSensorCanvas(
    ({ ctx, w, h, dt }) => {
      const W = Math.round(w);
      const H = Math.round(h);
      if (W < 2 || H < 2) return;
      const canvas = ctx.canvas;

      const paintRows = (n: number) => {
        const img = ctx.createImageData(W, n);
        for (let y = 0; y < n; y++) {
          const r = row.current + (n - 1 - y);
          for (let x = 0; x < W; x++) {
            const [cr, cg, cb] = copper(intensityAt(x, W, r));
            const i = (y * W + x) * 4;
            img.data[i] = cr;
            img.data[i + 1] = cg;
            img.data[i + 2] = cb;
            img.data[i + 3] = 255;
          }
        }
        row.current += n;
        ctx.putImageData(img, 0, 0);
      };

      if (size.current.w !== W || size.current.h !== H) {
        size.current = { w: W, h: H };
        // Fill the whole strip once, newest rows at the top.
        const img = ctx.createImageData(W, H);
        for (let y = 0; y < H; y++) {
          const r = row.current + (H - 1 - y);
          for (let x = 0; x < W; x++) {
            const [cr, cg, cb] = copper(intensityAt(x, W, r));
            const i = (y * W + x) * 4;
            img.data[i] = cr;
            img.data[i + 1] = cg;
            img.data[i + 2] = cb;
            img.data[i + 3] = 255;
          }
        }
        row.current += H;
        ctx.putImageData(img, 0, 0);
        return;
      }

      acc.current += dt * ROWS_PER_SEC;
      const n = Math.floor(acc.current);
      if (n < 1) return;
      acc.current -= n;
      ctx.drawImage(canvas, 0, 0, W, H - n, 0, n, W, H - n);
      paintRows(n);
    },
    { dprCap: 1 }
  );

  return <canvas ref={ref} className={className} aria-hidden />;
}
