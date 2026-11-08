import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/quality";

/** Paragraph whose words light up as it scrolls through the viewport. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || env.reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".scrub-word"),
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: 0.6 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [text]);
  return (
    <p ref={ref} className={"scrub-text " + (className ?? "")}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="scrub-word">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
