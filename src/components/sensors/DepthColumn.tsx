import { getScrollState } from "@/lib/scrollStore";
import { MAX_DEPTH_M, SECTIONS } from "@/content/sections";
import { useSensorCanvas } from "./useSensorCanvas";
import { AMBER, BIO, MONO, TEXT, rgba, PANEL, PANEL_HI } from "./palette";

/** Depth sensor: a horizontal water column 0 → 1000 m with zone bands and the live vehicle depth. */
export function DepthColumn({ className }: { className?: string }) {
  const ref = useSensorCanvas(({ ctx, w, h, t }) => {
    ctx.clearRect(0, 0, w, h);
    const depth = getScrollState().depth;
    const pad = 12;
    const y0 = h * 0.42;
    const barH = 10;
    const x = (d: number) => pad + (d / MAX_DEPTH_M) * (w - pad * 2);

    const grad = ctx.createLinearGradient(pad, 0, w - pad, 0);
    grad.addColorStop(0, rgba(PANEL_HI, 0.75));
    grad.addColorStop(0.2, rgba(PANEL_HI, 0.5));
    grad.addColorStop(1, rgba(PANEL, 0.9));
    ctx.fillStyle = grad;
    ctx.fillRect(pad, y0, w - pad * 2, barH);

    // Filled portion
    ctx.fillStyle = rgba(BIO, 0.85);
    ctx.shadowColor = rgba(BIO, 0.8);
    ctx.shadowBlur = 10;
    ctx.fillRect(pad, y0 + barH / 2 - 1, x(depth) - pad, 2);
    ctx.shadowBlur = 0;

    // Ticks
    ctx.font = `9px ${MONO}`;
    ctx.textAlign = "center";
    for (let d = 0; d <= MAX_DEPTH_M; d += 50) {
      const major = d % 200 === 0;
      ctx.strokeStyle = rgba(TEXT, major ? 0.45 : 0.18);
      ctx.beginPath();
      ctx.moveTo(x(d), y0 + barH + 3);
      ctx.lineTo(x(d), y0 + barH + (major ? 10 : 6));
      ctx.stroke();
      if (major) {
        ctx.fillStyle = rgba(TEXT, 0.45);
        ctx.fillText(`${d}`, x(d), y0 + barH + 22);
      }
    }

    // Section markers
    for (const s of SECTIONS) {
      ctx.fillStyle = rgba(TEXT, 0.3);
      ctx.fillRect(x(s.depthM) - 0.5, y0 - 6, 1, 6);
    }

    // Vehicle marker
    const vx = x(depth);
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    ctx.strokeStyle = rgba(AMBER, 0.35 + pulse * 0.4);
    ctx.beginPath();
    ctx.arc(vx, y0 + barH / 2, 7 + pulse * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = rgba(AMBER, 1);
    ctx.beginPath();
    ctx.moveTo(vx, y0 - 3);
    ctx.lineTo(vx - 5, y0 - 11);
    ctx.lineTo(vx + 5, y0 - 11);
    ctx.fill();
    ctx.textAlign = vx > w - 80 ? "right" : "left";
    ctx.fillStyle = rgba(AMBER, 0.95);
    ctx.fillText(`${depth.toFixed(1)} m · ${(1.013 + depth * 0.1005).toFixed(2)} bar`, vx + (vx > w - 80 ? -8 : 8), y0 - 14);
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
