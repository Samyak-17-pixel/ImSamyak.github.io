import { useSensorCanvas } from "./useSensorCanvas";
import { AMBER, BIO, CYAN, MONO, rgba } from "./palette";

/** IIT Madras — where the fix resolves. */
const LAT = 12.9915;
const LON = 80.2337;
const LOCK_AT = 2.6;

function scramble(value: string, t: number, settle: number) {
  if (t >= settle) return value;
  return value.replace(/\d/g, (d, i) => (t > settle - 0.6 + i * 0.03 ? d : String(Math.floor((t * 37 + i * 7) % 10))));
}

/** Underwater GPS (USBL): reticle converges onto the target, acoustic replies ripple out, then locks. */
export function UsblFix({ className }: { className?: string }) {
  const ref = useSensorCanvas(({ ctx, w, h, t }) => {
    ctx.clearRect(0, 0, w, h);
    const narrow = w < 760;
    const tx = narrow ? w * 0.72 : w * 0.73;
    const ty = narrow ? h * 0.2 : h * 0.44;
    const lock = Math.min(1, t / LOCK_AT);
    const ease = 1 - (1 - lock) ** 3;
    const locked = t >= LOCK_AT;

    // Dot grid
    ctx.fillStyle = rgba(BIO, 0.07);
    const step = 34;
    for (let x = (tx % step) - step; x < w; x += step) {
      for (let y = (ty % step) - step; y < h; y += step) ctx.fillRect(x, y, 1.2, 1.2);
    }

    // Acoustic reply rings
    for (let k = 0; k < 4; k++) {
      const phase = ((t * 0.42 + k / 4) % 1 + 1) % 1;
      const r = phase * Math.max(w, h) * 0.55;
      ctx.strokeStyle = rgba(locked ? BIO : CYAN, (1 - phase) * 0.22);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(tx, ty, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Reticle wanders in, then locks with a slight hold jitter
    const jitter = locked ? 1.2 : 0;
    const rx = tx + (1 - ease) * Math.sin(t * 2.3) * w * 0.18 + Math.sin(t * 7) * jitter;
    const ry = ty + (1 - ease) * Math.cos(t * 1.7) * h * 0.22 + Math.cos(t * 6) * jitter;

    // Crosshair lines
    ctx.strokeStyle = rgba(BIO, 0.12);
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(0, ry);
    ctx.lineTo(w, ry);
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rotating bearing brackets
    const size = 34 + (1 - ease) * 40;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(t * (locked ? 0.25 : 1.4));
    ctx.strokeStyle = rgba(locked ? BIO : AMBER, 0.9);
    ctx.lineWidth = 1.5;
    for (let q = 0; q < 4; q++) {
      ctx.beginPath();
      ctx.arc(0, 0, size, q * (Math.PI / 2) + 0.25, q * (Math.PI / 2) + 1.1);
      ctx.stroke();
    }
    ctx.restore();

    // Inner pip
    ctx.fillStyle = rgba(locked ? BIO : AMBER, 1);
    ctx.shadowColor = rgba(locked ? BIO : AMBER, 0.9);
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(rx, ry, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Readout block (no room for it beside the title on narrow screens)
    if (narrow) return;
    const lat = scramble(`${LAT.toFixed(4)}°N`, t, LOCK_AT);
    const lon = scramble(`${LON.toFixed(4)}°E`, t, LOCK_AT);
    const bx = rx + size + 16;
    const by = ry - 20;
    ctx.font = `11px ${MONO}`;
    ctx.textAlign = bx + 150 > w ? "right" : "left";
    const ax = bx + 150 > w ? rx - size - 16 : bx;
    ctx.fillStyle = rgba(locked ? BIO : AMBER, 0.95);
    ctx.fillText(locked ? "USBL ▪ FIX LOCKED" : "USBL ▪ ACQUIRING…", ax, by);
    ctx.fillStyle = rgba("214, 245, 240", 0.75);
    ctx.fillText(`${lat}  ${lon}`, ax, by + 17);
    const brg = (47.3 + (1 - ease) * Math.sin(t * 3) * 40).toFixed(1).padStart(5, "0");
    const rng = (12.4 + (1 - ease) * Math.cos(t * 2) * 6).toFixed(1);
    ctx.fillStyle = rgba("214, 245, 240", 0.45);
    ctx.fillText(`BRG ${brg}°  RNG ${rng} m`, ax, by + 34);
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
