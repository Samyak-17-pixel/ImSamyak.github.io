import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/quality";

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);

/** Rolling-digit counter, like a pressure readout spinning up when it scrolls into view. */
export function Odometer({ value, digits = 2 }: { value: number; digits?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const str = String(value).padStart(digits, "0");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cols = Array.from(el.querySelectorAll<HTMLElement>(".odo-col"));
    const targets = cols.map((_, i) => -(10 + Number(str[i])) * 5);
    if (env.reducedMotion) {
      cols.forEach((c, i) => (c.style.transform = `translateY(${targets[i]}%)`));
      return;
    }
    const ctx = gsap.context(() => {
      cols.forEach((c, i) => {
        gsap.fromTo(
          c,
          { yPercent: 0 },
          {
            yPercent: targets[i],
            duration: 1.6 + i * 0.35,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, [str]);

  return (
    <span className="odo" ref={ref} aria-label={String(value)} role="img">
      {Array.from(str).map((_, i) => (
        <span key={i} className="odo-cell" aria-hidden>
          <span className="odo-col">
            {DIGITS.map((d, j) => (
              <span key={j}>{d}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
