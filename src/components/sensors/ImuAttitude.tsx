import { useRef } from "react";
import { pointer } from "@/lib/pointer";
import { getScrollState } from "@/lib/scrollStore";
import { useSensorCanvas } from "./useSensorCanvas";
import { AMBER, BIO, MONO, TEXT, rgba } from "./palette";

/** IMU attitude indicator: roll/pitch follow the pointer and scroll velocity; heading tape below. */
export function ImuAttitude({ className }: { className?: string }) {
  const att = useRef({ roll: 0, pitch: 0, yaw: 112 });

  const ref = useSensorCanvas(({ ctx, w, h, t, dt }) => {
    const a = att.current;
    const v = getScrollState().velocity;
    const targetRoll = pointer.x * 22 + Math.sin(t * 0.7) * 2;
    const targetPitch = pointer.y * 12 + Math.max(-10, Math.min(10, v * 6)) + Math.sin(t * 0.5) * 1.2;
    const k = 1 - Math.exp(-dt * 3);
    a.roll += (targetRoll - a.roll) * k;
    a.pitch += (targetPitch - a.pitch) * k;
    a.yaw = (a.yaw + dt * (4 + pointer.x * 10) + 360) % 360;

    ctx.clearRect(0, 0, w, h);
    const tapeH = 34;
    const cx = w / 2;
    const cy = (h - tapeH) / 2;
    const R = Math.min(w, h - tapeH) * 0.42;
    const roll = (a.roll * Math.PI) / 180;
    const pxPerDeg = R / 30;

    // Horizon ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(cx, cy);
    ctx.rotate(-roll);
    ctx.translate(0, a.pitch * pxPerDeg);
    const sky = ctx.createLinearGradient(0, -R * 2, 0, 0);
    sky.addColorStop(0, "rgba(6, 60, 72, 0.9)");
    sky.addColorStop(1, "rgba(14, 110, 120, 0.75)");
    ctx.fillStyle = sky;
    ctx.fillRect(-R * 2, -R * 3, R * 4, R * 3);
    const sea = ctx.createLinearGradient(0, 0, 0, R * 2);
    sea.addColorStop(0, "rgba(3, 30, 38, 0.95)");
    sea.addColorStop(1, "rgba(1, 10, 14, 1)");
    ctx.fillStyle = sea;
    ctx.fillRect(-R * 2, 0, R * 4, R * 3);
    ctx.strokeStyle = rgba(BIO, 0.95);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-R * 2, 0);
    ctx.lineTo(R * 2, 0);
    ctx.stroke();
    // Pitch ladder
    ctx.strokeStyle = rgba(TEXT, 0.5);
    ctx.fillStyle = rgba(TEXT, 0.55);
    ctx.font = `9px ${MONO}`;
    ctx.textAlign = "left";
    ctx.lineWidth = 1;
    for (let d = -30; d <= 30; d += 10) {
      if (d === 0) continue;
      const y = -d * pxPerDeg;
      const half = d % 20 === 0 ? R * 0.32 : R * 0.2;
      ctx.beginPath();
      ctx.moveTo(-half, y);
      ctx.lineTo(half, y);
      ctx.stroke();
      ctx.fillText(`${Math.abs(d)}`, half + 5, y + 3);
    }
    ctx.restore();

    // Bezel + roll scale
    ctx.strokeStyle = rgba(BIO, 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = rgba(TEXT, 0.55);
    for (const d of [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60]) {
      const ang = (d * Math.PI) / 180 - Math.PI / 2;
      const len = d % 30 === 0 ? 10 : 6;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * (R + 3), cy + Math.sin(ang) * (R + 3));
      ctx.lineTo(cx + Math.cos(ang) * (R + 3 + len), cy + Math.sin(ang) * (R + 3 + len));
      ctx.stroke();
    }
    // Roll pointer
    const pa = -roll - Math.PI / 2;
    ctx.fillStyle = rgba(AMBER, 1);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(pa) * (R - 2), cy + Math.sin(pa) * (R - 2));
    ctx.lineTo(cx + Math.cos(pa - 0.06) * (R - 12), cy + Math.sin(pa - 0.06) * (R - 12));
    ctx.lineTo(cx + Math.cos(pa + 0.06) * (R - 12), cy + Math.sin(pa + 0.06) * (R - 12));
    ctx.fill();

    // Vehicle symbol (fixed)
    ctx.strokeStyle = rgba(AMBER, 1);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.5, cy);
    ctx.lineTo(cx - R * 0.16, cy);
    ctx.lineTo(cx - R * 0.08, cy + 8);
    ctx.moveTo(cx + R * 0.5, cy);
    ctx.lineTo(cx + R * 0.16, cy);
    ctx.lineTo(cx + R * 0.08, cy + 8);
    ctx.stroke();
    ctx.fillStyle = rgba(AMBER, 1);
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // Heading tape
    const ty = h - tapeH + 6;
    ctx.save();
    ctx.beginPath();
    ctx.rect(8, ty, w - 16, tapeH - 8);
    ctx.clip();
    ctx.fillStyle = "rgba(2, 16, 22, 0.7)";
    ctx.fillRect(8, ty, w - 16, tapeH - 8);
    const pxPerHdg = 4;
    ctx.strokeStyle = rgba(TEXT, 0.45);
    ctx.fillStyle = rgba(TEXT, 0.7);
    ctx.textAlign = "center";
    ctx.font = `9px ${MONO}`;
    const base = Math.floor(a.yaw / 5) * 5;
    for (let d = base - 60; d <= base + 60; d += 5) {
      const x = cx + (d - a.yaw) * pxPerHdg;
      const hdg = ((d % 360) + 360) % 360;
      const major = hdg % 30 === 0;
      ctx.beginPath();
      ctx.moveTo(x, ty);
      ctx.lineTo(x, ty + (major ? 9 : 5));
      ctx.stroke();
      if (major) {
        const lbl = { 0: "N", 90: "E", 180: "S", 270: "W" }[hdg] ?? String(hdg).padStart(3, "0");
        ctx.fillText(lbl, x, ty + 21);
      }
    }
    ctx.restore();
    ctx.fillStyle = rgba(AMBER, 1);
    ctx.beginPath();
    ctx.moveTo(cx, ty + 2);
    ctx.lineTo(cx - 5, ty - 5);
    ctx.lineTo(cx + 5, ty - 5);
    ctx.fill();

    // Corner readouts
    ctx.textAlign = "left";
    ctx.font = `10px ${MONO}`;
    ctx.fillStyle = rgba(BIO, 0.85);
    ctx.fillText(`R ${a.roll >= 0 ? "+" : ""}${a.roll.toFixed(1)}°`, 10, 16);
    ctx.fillText(`P ${a.pitch >= 0 ? "+" : ""}${a.pitch.toFixed(1)}°`, 10, 30);
    ctx.textAlign = "right";
    ctx.fillText(`Y ${a.yaw.toFixed(1).padStart(5, "0")}°`, w - 10, 16);
    ctx.fillStyle = rgba(TEXT, 0.4);
    ctx.fillText(`ωz ${(pointer.x * 0.12).toFixed(3)}`, w - 10, 30);
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
