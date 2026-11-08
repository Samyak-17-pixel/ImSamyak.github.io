import { useLayoutEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/quality";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children one after another instead of the wrapper as a whole. */
  stagger?: number;
  y?: number;
  delay?: number;
  variant?: "rise" | "scan";
};

/** Scroll-triggered entrance. "scan" wipes content in like a sonar sweep from the left. */
export function Reveal({ children, as: Tag = "div", className, stagger, y = 34, delay = 0, variant = "rise" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || env.reducedMotion) return;
    const targets = stagger !== undefined ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      const from =
        variant === "scan"
          ? { clipPath: "inset(0 100% 0 0)", opacity: 0.3, x: -12 }
          : { y, opacity: 0, filter: "blur(6px)" };
      const to =
        variant === "scan"
          ? { clipPath: "inset(0 0% 0 0)", opacity: 1, x: 0 }
          : { y: 0, opacity: 1, filter: "blur(0px)" };
      gsap.fromTo(targets, from, {
        ...to,
        duration: variant === "scan" ? 1.1 : 0.9,
        ease: "power3.out",
        delay,
        stagger: stagger ?? 0,
        clearProps: "filter,clipPath",
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger, y, delay, variant]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
