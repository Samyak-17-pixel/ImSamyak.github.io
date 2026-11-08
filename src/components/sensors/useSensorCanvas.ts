import { useEffect, useRef } from "react";
import { env, maxDpr } from "@/lib/quality";

export type DrawFrame = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  /** Seconds since mount. */
  t: number;
  dt: number;
};

/**
 * Canvas sized to its CSS box (DPR-aware) that animates only while on screen.
 * With reduced motion it renders a single representative frame.
 */
export function useSensorCanvas(draw: (f: DrawFrame) => void, { dprCap }: { dprCap?: number } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(maxDpr(), dprCap ?? 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const start = performance.now();
    let last = start;

    const render = (now: number) => {
      if (w === 0 || h === 0) return;
      const t = env.reducedMotion ? 6 : (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current({ ctx, w, h, t, dt });
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      render(now);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!visible) return;
      if (env.reducedMotion) render(performance.now());
      else raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      if (env.reducedMotion || !raf) render(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [dprCap]);

  return ref;
}
