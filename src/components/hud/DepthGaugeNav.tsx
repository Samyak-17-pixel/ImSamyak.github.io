import { useEffect, useRef } from "react";
import { SECTIONS } from "@/content/sections";
import { onScrollFrame, useActiveSection } from "@/lib/scrollStore";
import { sectionPath, useGoToSection } from "@/lib/navigation";

/** Position along the gauge (0..1): sections are evenly spaced, depth interpolates between them. */
function gaugePos(depth: number) {
  const n = SECTIONS.length - 1;
  for (let i = 0; i < n; i++) {
    const a = SECTIONS[i].depthM;
    const b = SECTIONS[i + 1].depthM;
    if (depth <= b) return (i + (depth - a) / (b - a || 1)) / n;
  }
  return 1;
}

/** Floating vertical depth scale on the left: click a marker to dive straight to that section. */
export function DepthGaugeNav() {
  const active = useActiveSection();
  const go = useGoToSection();
  const marker = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      onScrollFrame((s) => {
        const p = gaugePos(s.depth);
        if (marker.current) marker.current.style.top = `${p * 100}%`;
        if (fill.current) fill.current.style.transform = `scaleY(${p})`;
        if (readout.current) readout.current.textContent = s.depth.toFixed(1);
      }),
    []
  );

  return (
    <nav className="depth-gauge" aria-label="Depth gauge">
      <div className="depth-gauge__track">
        <div className="depth-gauge__fill" ref={fill} />
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${sectionPath(s.id)}`}
            className={"depth-gauge__stop" + (active === s.id ? " is-active" : "")}
            style={{ top: `${(i / (SECTIONS.length - 1)) * 100}%` }}
            onClick={(e) => {
              e.preventDefault();
              go(s.id);
            }}
            aria-current={active === s.id ? "true" : undefined}
          >
            <span className="depth-gauge__dot" aria-hidden />
            <span className="depth-gauge__label">
              <span className="depth-gauge__m">{s.depthM} m</span>
              {s.label}
            </span>
          </a>
        ))}
        <div className="depth-gauge__marker" ref={marker} aria-hidden>
          <span ref={readout}>0.0</span>
          <em>m</em>
        </div>
      </div>
    </nav>
  );
}
