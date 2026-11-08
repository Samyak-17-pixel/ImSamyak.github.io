import { useEffect, useRef } from "react";
import { env } from "@/lib/quality";

const INTERACTIVE = "a, button, [role='button'], [role='option'], input, label, summary, [data-cursor]";

/** Sonar reticle cursor: instant pip, lagging range ring that locks onto interactive targets. */
export function SonarCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const enabled = !env.coarsePointer && !env.reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-sonar-cursor");
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      const next = !!target;
      if (next !== hovering) {
        hovering = next;
        ring.current?.classList.toggle("is-locked", hovering);
      }
      if (label.current) label.current.textContent = target?.dataset.cursor ?? "";
      ring.current?.classList.toggle("has-label", !!target?.dataset.cursor);
    };
    const onDown = () => ring.current?.classList.add("is-ping");
    const onUp = () => window.setTimeout(() => ring.current?.classList.remove("is-ping"), 220);
    const onLeave = () => {
      pos.x = ringPos.x = -100;
      pos.y = ringPos.y = -100;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-sonar-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="sonar-cursor" aria-hidden>
      <div className="sonar-cursor__ring" ref={ring}>
        <span className="sonar-cursor__tick sonar-cursor__tick--n" />
        <span className="sonar-cursor__tick sonar-cursor__tick--e" />
        <span className="sonar-cursor__tick sonar-cursor__tick--s" />
        <span className="sonar-cursor__tick sonar-cursor__tick--w" />
        <span className="sonar-cursor__label" ref={label} />
      </div>
      <div className="sonar-cursor__dot" ref={dot} />
    </div>
  );
}
