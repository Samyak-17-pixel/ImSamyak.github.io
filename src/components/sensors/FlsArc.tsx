import { useRef } from "react";
import { hash } from "@/components/hud/sensorMath";
import { useSensorCanvas } from "./useSensorCanvas";
import { AMBER, BIO, CYAN, MONO, TEXT, rgba } from "./palette";

const SPAN = (90 * Math.PI) / 180;
const PING_HZ = 2.2;

type Arc = { r: number; ang: number; born: number; strength: number };

/** Structure seen by the sonar: a pipe span with two pillars, in normalised (bearing, range). */
function structureRange(bearing: number) {
  // bearing in [-1, 1]
  const pipe = 0.62 + Math.sin(bearing * 1.4) * 0.05;
  return pipe;
}

/**
 * Forward-scan sonar: each ping returns elevation-ambiguous arcs across the beam,
 * which pile up over passes into the outline of a structure (the paper's core idea).
 */
export function FlsArc({ className }: { className?: string }) {
  const arcs = useRef<Arc[]>([]);
  const lastPing = useRef(-1);

  const ref = useSensorCanvas(({ ctx, w, h, t }) => {
    ctx.clearRect(0, 0, w, h);
    const ox = w / 2;
    const oy = h * 0.96;
    const R = Math.min(h * 0.9, w * 0.7);
    const a0 = -Math.PI / 2 - SPAN / 2;
    const bearing = Math.sin(t * 0.35);
    const beamAng = -Math.PI / 2 + bearing * (SPAN / 2) * 0.9;

    // Fire pings
    const pingIdx = Math.floor(t * PING_HZ);
    if (pingIdx !== lastPing.current) {
      lastPing.current = pingIdx;
      const sr = structureRange(bearing);
      for (let k = 0; k < 3; k++) {
        arcs.current.push({
          r: (sr + (hash(pingIdx, k, 3) - 0.5) * 0.08) * R,
          ang: beamAng,
          born: t,
          strength: 0.6 + hash(pingIdx, k, 9) * 0.4,
        });
      }
      if (hash(pingIdx, 0, 5) > 0.55) {
        arcs.current.push({ r: (0.3 + hash(pingIdx, 1, 5) * 0.2) * R, ang: beamAng, born: t, strength: 0.4 });
      }
      if (arcs.current.length > 240) arcs.current.splice(0, arcs.current.length - 240);
    }

    // Fan
    ctx.fillStyle = "rgba(4, 30, 38, 0.35)";
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.arc(ox, oy, R, a0, a0 + SPAN);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(BIO, 0.25);
    ctx.stroke();
    for (let i = 1; i < 4; i++) {
      ctx.strokeStyle = rgba(BIO, 0.08);
      ctx.beginPath();
      ctx.arc(ox, oy, (R * i) / 4, a0, a0 + SPAN);
      ctx.stroke();
    }

    // Accumulated arcs (each spans the vertical aperture → elevation ambiguity)
    const halfWidth = 0.16;
    for (const a of arcs.current) {
      const age = t - a.born;
      const life = Math.max(0, 1 - age / 9);
      if (life <= 0) continue;
      ctx.strokeStyle = rgba(age < 0.4 ? AMBER : CYAN, a.strength * life * (age < 0.4 ? 0.9 : 0.45));
      ctx.lineWidth = age < 0.4 ? 2 : 1.2;
      ctx.beginPath();
      ctx.arc(ox, oy, a.r, a.ang - halfWidth, a.ang + halfWidth);
      ctx.stroke();
    }

    // Current beam wedge
    const wedge = ctx.createRadialGradient(ox, oy, 0, ox, oy, R);
    wedge.addColorStop(0, rgba(BIO, 0.0));
    wedge.addColorStop(1, rgba(BIO, 0.18));
    ctx.fillStyle = wedge;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.arc(ox, oy, R, beamAng - halfWidth, beamAng + halfWidth);
    ctx.closePath();
    ctx.fill();

    // Ping wavefront
    const front = ((t * PING_HZ) % 1) * R;
    ctx.strokeStyle = rgba(BIO, 0.6 * (1 - front / R));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ox, oy, front, beamAng - halfWidth, beamAng + halfWidth);
    ctx.stroke();

    ctx.font = `10px ${MONO}`;
    ctx.fillStyle = rgba(TEXT, 0.5);
    ctx.textAlign = "left";
    ctx.fillText(`FLS · BRG ${(bearing * 45).toFixed(1)}°`, 12, 18);
    ctx.fillText(`ARCS ${arcs.current.length}`, 12, 32);
    ctx.textAlign = "right";
    ctx.fillStyle = rgba(AMBER, 0.75);
    ctx.fillText("ELEVATION AMBIGUOUS", w - 12, 18);
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
