import { useSensorCanvas } from "./useSensorCanvas";
import { AMBER, BIO, CYAN, MONO, TEXT, rgba } from "./palette";

/** Beacon layout in normalised section coords. */
const NODES = [
  { x: 0.08, y: 0.18 },
  { x: 0.92, y: 0.14 },
  { x: 0.05, y: 0.62 },
  { x: 0.95, y: 0.58 },
  { x: 0.18, y: 0.94 },
  { x: 0.84, y: 0.95 },
];

const PING_PERIOD = 4.2;

/**
 * Acoustic transponder network (LBL): the vehicle pings, each beacon replies in turn,
 * and range lines flash as replies arrive. `active` highlights one beacon.
 */
export function TransponderNet({ className, active = -1 }: { className?: string; active?: number }) {
  const ref = useSensorCanvas(({ ctx, w, h, t }) => {
    ctx.clearRect(0, 0, w, h);
    const vx = w * (0.5 + Math.sin(t * 0.13) * 0.18);
    const vy = h * (0.5 + Math.cos(t * 0.11) * 0.2);
    const maxR = Math.hypot(w, h) * 0.75;
    const cycle = (t % PING_PERIOD) / PING_PERIOD;
    const front = cycle * maxR;

    // Vehicle interrogation ping
    ctx.strokeStyle = rgba(CYAN, 0.18 * (1 - cycle));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(vx, vy, front, 0, Math.PI * 2);
    ctx.stroke();

    NODES.forEach((n, i) => {
      const nx = n.x * w;
      const ny = n.y * h;
      const dist = Math.hypot(nx - vx, ny - vy);
      const reached = front >= dist;
      const since = reached ? (front - dist) / maxR : 0;
      const isActive = i === active;

      // Range line
      ctx.setLineDash([2, 6]);
      ctx.strokeStyle = rgba(isActive ? AMBER : BIO, reached ? Math.max(0.08, 0.5 - since * 1.2) : 0.06);
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      ctx.setLineDash([]);

      // Reply ring
      if (reached && since < 0.35) {
        ctx.strokeStyle = rgba(isActive ? AMBER : BIO, (0.35 - since) * 1.8);
        ctx.beginPath();
        ctx.arc(nx, ny, since * maxR * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Beacon
      const glow = isActive ? 1 : reached && since < 0.15 ? 0.9 : 0.45;
      ctx.fillStyle = rgba(isActive ? AMBER : BIO, glow);
      ctx.shadowColor = rgba(isActive ? AMBER : BIO, 0.9);
      ctx.shadowBlur = isActive ? 18 : 8;
      ctx.beginPath();
      ctx.arc(nx, ny, isActive ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = rgba(isActive ? AMBER : BIO, 0.35);
      ctx.beginPath();
      ctx.arc(nx, ny, isActive ? 12 : 9, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = `9px ${MONO}`;
      ctx.fillStyle = rgba(TEXT, isActive ? 0.85 : 0.35);
      ctx.textAlign = n.x > 0.5 ? "right" : "left";
      const lx = n.x > 0.5 ? nx - 16 : nx + 16;
      ctx.fillText(`XPDR ${String(i + 1).padStart(2, "0")} · ${(dist / 40).toFixed(1)} m`, lx, ny + 3);
    });

    // Vehicle
    ctx.fillStyle = rgba(CYAN, 0.95);
    ctx.beginPath();
    ctx.arc(vx, vy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = rgba(CYAN, 0.4);
    ctx.beginPath();
    ctx.arc(vx, vy, 10, 0, Math.PI * 2);
    ctx.stroke();
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
