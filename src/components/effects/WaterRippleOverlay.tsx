import { useEffect, useRef, useState } from "react";

type Ripple = { id: number; x: number; y: number };

/** Full-screen click ripples — drop-on-water (visual only, pointer-events none). */
export function WaterRippleOverlay() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const id = ++nextId.current;
      setRipples((prev) => [...prev.slice(-14), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1150);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div className="water-ripple-layer" aria-hidden>
      {ripples.map((r) => (
        <div
          key={r.id}
          className="water-ripple-burst"
          style={{ left: r.x, top: r.y }}
        >
          <span className="water-ripple water-ripple--splash" />
          <span className="water-ripple water-ripple--1" />
          <span className="water-ripple water-ripple--2" />
          <span className="water-ripple water-ripple--3" />
        </div>
      ))}
    </div>
  );
}
