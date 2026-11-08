import { noise1 } from "@/components/hud/sensorMath";
import { useSensorCanvas } from "./useSensorCanvas";
import { AMBER, BIO, MONO, TEXT, rgba } from "./palette";

const BEAM_ANGLES = [-30, -12, 12, 30].map((d) => (d * Math.PI) / 180);

/** DVL: four Janus beams bottom-lock onto scrolling terrain; hits pulse and drive velocity readouts. */
export function DvlBeams({ className }: { className?: string }) {
  const ref = useSensorCanvas(({ ctx, w, h, t }) => {
    ctx.clearRect(0, 0, w, h);
    const speed = 60;
    const scroll = t * speed;
    const vx = w / 2;
    const vy = h * 0.2;
    const floor = (x: number) => h * 0.78 + (noise1((x + scroll) * 0.012, 2) - 0.5) * h * 0.22 + (noise1((x + scroll) * 0.05, 4) - 0.5) * 10;

    // Seafloor
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) ctx.lineTo(x, floor(x));
    ctx.lineTo(w, h);
    ctx.closePath();
    const sg = ctx.createLinearGradient(0, h * 0.6, 0, h);
    sg.addColorStop(0, "rgba(12, 60, 66, 0.55)");
    sg.addColorStop(1, "rgba(2, 12, 16, 0.2)");
    ctx.fillStyle = sg;
    ctx.fill();
    ctx.strokeStyle = rgba(BIO, 0.45);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6) (x === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, x, floor(x));
    ctx.stroke();

    // Beams + hits
    let altSum = 0;
    BEAM_ANGLES.forEach((ang, i) => {
      // March along the beam until it meets the terrain
      let px = vx;
      let py = vy;
      for (let s = 0; s < 400; s++) {
        px = vx + Math.sin(ang) * s * 3;
        py = vy + Math.cos(ang) * s * 3;
        if (py >= floor(px)) break;
      }
      altSum += py - vy;
      const g = ctx.createLinearGradient(vx, vy, px, py);
      g.addColorStop(0, rgba(BIO, 0.55));
      g.addColorStop(1, rgba(BIO, 0.08));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      const spread = 0.035;
      const len = Math.hypot(px - vx, py - vy);
      ctx.lineTo(vx + Math.sin(ang - spread) * len, vy + Math.cos(ang - spread) * len);
      ctx.lineTo(vx + Math.sin(ang + spread) * len, vy + Math.cos(ang + spread) * len);
      ctx.closePath();
      ctx.fill();
      const pulse = ((t * 1.6 + i * 0.25) % 1);
      ctx.strokeStyle = rgba(AMBER, (1 - pulse) * 0.9);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(px, py, 4 + pulse * 16, 2 + pulse * 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = rgba(AMBER, 1);
      ctx.beginPath();
      ctx.arc(px, py, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `9px ${MONO}`;
      ctx.fillStyle = rgba(TEXT, 0.4);
      ctx.textAlign = "center";
      ctx.fillText(`B${i + 1}`, px, py + 16);
    });

    // Vehicle silhouette
    ctx.save();
    ctx.translate(vx, vy);
    ctx.rotate(Math.sin(t * 0.8) * 0.02);
    ctx.fillStyle = "rgba(10, 40, 48, 0.95)";
    ctx.strokeStyle = rgba(BIO, 0.85);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, -8, 62, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-62, -8);
    ctx.lineTo(-76, -18);
    ctx.lineTo(-76, 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = rgba(AMBER, 0.9);
    ctx.fillRect(-6, 2, 12, 4);
    ctx.restore();

    // Readouts
    const alt = (altSum / 4 / h) * 8;
    ctx.font = `10px ${MONO}`;
    ctx.textAlign = "left";
    ctx.fillStyle = rgba(BIO, 0.9);
    ctx.fillText("DVL ▪ BOTTOM LOCK", 12, 18);
    ctx.fillStyle = rgba(TEXT, 0.6);
    ctx.fillText(`vx ${(0.82 + Math.sin(t) * 0.04).toFixed(2)}  vy ${(Math.sin(t * 0.7) * 0.03).toFixed(2)}  vz ${(Math.sin(t * 1.3) * 0.01).toFixed(2)} m/s`, 12, 34);
    ctx.textAlign = "right";
    ctx.fillText(`ALT ${alt.toFixed(2)} m`, w - 12, 18);
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
