import { Fragment, useLayoutEffect, useRef } from "react";
import type { ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/quality";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  delay?: number;
};

/** Heading whose letters rise out of a mask. The full text stays readable to assistive tech. */
export function SplitTitle({ text, as: Tag = "h2", className, immediate = false, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || env.reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".split-char"), {
        yPercent: 115,
        rotate: 6,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.022,
        delay,
        scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [text, immediate, delay]);

  const words = text.split(" ");
  return (
    <Tag ref={ref} className={"split-title " + (className ?? "")} aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="split-word" aria-hidden>
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="split-char">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
