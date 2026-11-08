import type { ElementType, PointerEvent, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  [key: string]: unknown;
};

/** Glass panel with a pointer-following bioluminescent sheen on its surface and border. */
export function GlowCard({ children, className, as: Tag = "div", ...rest }: Props) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag className={"glow-card " + (className ?? "")} onPointerMove={onMove} {...rest}>
      {children}
    </Tag>
  );
}
