import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/** Mounts children the first time the placeholder nears the viewport, and keeps them mounted. */
export function LazyMount({ children, className, margin = "400px" }: { children: ReactNode; className?: string; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [on, margin]);
  return (
    <div ref={ref} className={className}>
      {on ? children : null}
    </div>
  );
}
