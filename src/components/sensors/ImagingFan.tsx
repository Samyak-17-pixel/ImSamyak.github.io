import { hash, noise2 } from "@/components/hud/sensorMath";
import { useSensorCanvas } from "./useSensorCanvas";
import { BIO, MONO, TEXT, rgba, sonarTeal } from "./palette";

const SPAN = (130 * Math.PI) / 180;
const BEAMS = 64;
const BINS = 40;

/** Imaging sonar fan overlay: range × bearing speckle with a sweeping beam. */
export function ImagingFan({ className, seed = 1 }: { className?: string; seed?: number }) {
  const ref = useSensorCanvas(({ ctx, w, h, t }) => {
    ctx.clearRect(0, 0, w, h);
    const ox = w / 2;
    const oy = h * 0.98;
    const R = Math.min(h * 0.92, w * 0.62);
    const sweep = ((Math.sin(t * 0.55) + 1) / 2) * SPAN - SPAN / 2;
    const a0 = -Math.PI / 2 - SPAN / 2;

    // Speckle cells
    for (let b = 0; b < BEAMS; b++) {
      const angA = a0 + (b / BEAMS) * SPAN;
      const angB = angA + SPAN / BEAMS + 0.002;
      const rel = angA + SPAN / BEAMS / 2 - (-Math.PI / 2 + sweep);
      const beamGlow = Math.exp(-(rel * rel) / 0.004);
      for (let r = 2; r < BINS; r++) {
        const n = noise2(b * 0.35, r * 0.3 + t * 0.15, seed) * 0.6 + hash(b, r, Math.floor(t * 8) + seed) * 0.4;
        const v = Math.max(0, n - 0.42) * 1.7 + beamGlow * 0.35;
        if (v < 0.08) continue;
        const [cr, cg, cb] = sonarTeal(v);
        ctx.fillStyle = `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${Math.min(0.55, v * 0.6)})`;
        const r0 = (r / BINS) * R;
        const r1 = ((r + 1) / BINS) * R;
        ctx.beginPath();
        ctx.arc(ox, oy, r1, angA, angB);
        ctx.arc(ox, oy, r0, angB, angA, true);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Fan outline + range rings
    ctx.strokeStyle = rgba(BIO, 0.28);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.arc(ox, oy, R, a0, a0 + SPAN);
    ctx.closePath();
    ctx.stroke();
    ctx.font = `9px ${MONO}`;
    ctx.fillStyle = rgba(TEXT, 0.4);
    ctx.textAlign = "left";
    for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = rgba(BIO, 0.1);
      ctx.beginPath();
      ctx.arc(ox, oy, (R * i) / 4, a0, a0 + SPAN);
      ctx.stroke();
      ctx.fillText(`${i * 5}m`, ox + Math.cos(a0 + SPAN) * ((R * i) / 4) + 4, oy + Math.sin(a0 + SPAN) * ((R * i) / 4));
    }

    // Sweep beam
    const sa = -Math.PI / 2 + sweep;
    const g = ctx.createLinearGradient(ox, oy, ox + Math.cos(sa) * R, oy + Math.sin(sa) * R);
    g.addColorStop(0, rgba(BIO, 0.0));
    g.addColorStop(1, rgba(BIO, 0.7));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + Math.cos(sa) * R, oy + Math.sin(sa) * R);
    ctx.stroke();
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
