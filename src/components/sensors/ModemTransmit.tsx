import { useSensorCanvas } from "./useSensorCanvas";
import { AMBER, BIO, MONO, TEXT, rgba } from "./palette";

const MESSAGE = "HELLO FROM 1000 m ";
const BITS = Array.from(MESSAGE)
  .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
  .join("");
const BIT_RATE = 14;

/** Acoustic modem: FSK waveform of a real message, with the decoded bitstream scrolling under it. */
export function ModemTransmit({ className }: { className?: string }) {
  const ref = useSensorCanvas(({ ctx, w, h, t }) => {
    ctx.clearRect(0, 0, w, h);
    const mid = h * 0.42;
    const amp = h * 0.22;
    const bitW = 22;
    const offset = t * BIT_RATE * bitW;

    // Baseline grid
    ctx.strokeStyle = rgba(BIO, 0.08);
    ctx.lineWidth = 1;
    for (let y = mid - amp; y <= mid + amp + 1; y += amp / 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // FSK waveform: bit 1 → high tone, bit 0 → low tone, framed in bursts
    ctx.beginPath();
    for (let x = 0; x <= w; x += 1.5) {
      const pos = x + offset;
      const bitIdx = Math.floor(pos / bitW);
      const bit = BITS[((bitIdx % BITS.length) + BITS.length) % BITS.length];
      const burst = Math.floor(bitIdx / 16) % 3 !== 2;
      const env = burst ? 1 : 0.08;
      const f = bit === "1" ? 0.55 : 0.28;
      const y = mid + Math.sin(pos * f) * amp * env * (0.85 + Math.sin(pos * 0.013) * 0.15);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, rgba(BIO, 0.1));
    g.addColorStop(0.3, rgba(BIO, 0.85));
    g.addColorStop(1, rgba(BIO, 0.85));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Bitstream + decoded characters
    ctx.font = `10px ${MONO}`;
    ctx.textAlign = "center";
    const first = Math.floor(offset / bitW);
    for (let i = first; i < first + Math.ceil(w / bitW) + 1; i++) {
      const x = i * bitW - offset + bitW / 2;
      const b = BITS[((i % BITS.length) + BITS.length) % BITS.length];
      ctx.fillStyle = rgba(b === "1" ? AMBER : TEXT, b === "1" ? 0.75 : 0.3);
      ctx.fillText(b, x, h * 0.82);
      if (i % 8 === 0) {
        const ch = MESSAGE[Math.floor(((i % BITS.length) + BITS.length) % BITS.length / 8)];
        ctx.fillStyle = rgba(BIO, 0.7);
        ctx.fillText(ch === " " ? "␣" : ch, x + bitW * 3.5, h * 0.95);
        ctx.strokeStyle = rgba(BIO, 0.12);
        ctx.beginPath();
        ctx.moveTo(x - bitW / 2, h * 0.72);
        ctx.lineTo(x - bitW / 2, h);
        ctx.stroke();
      }
    }

    ctx.textAlign = "left";
    ctx.fillStyle = rgba(BIO, 0.85);
    ctx.fillText("MODEM ▪ TX", 10, 16);
    ctx.textAlign = "right";
    ctx.fillStyle = rgba(TEXT, 0.45);
    ctx.fillText(`FSK · ${BIT_RATE * 34} bps`, w - 10, 16);
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
