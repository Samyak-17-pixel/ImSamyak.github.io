import { useEffect, useRef } from "react";
import { SENSORS, sectionById } from "@/content/sections";
import { SensorIcon } from "@/components/sensors/SensorIcon";
import { onScrollFrame, useActiveSection } from "@/lib/scrollStore";
import { setPaletteOpen } from "@/lib/paletteStore";

/** Compact depth + sensor readout for small screens; tapping opens quick jump. */
export function DepthPill() {
  const active = sectionById(useActiveSection());
  const depth = useRef<HTMLSpanElement>(null);
  useEffect(
    () =>
      onScrollFrame((s) => {
        if (depth.current) depth.current.textContent = `${s.depth.toFixed(0)} m`;
      }),
    []
  );
  const sensor = active?.sensors[0];
  return (
    <button type="button" className="depth-pill" onClick={() => setPaletteOpen(true)} aria-label="Jump to a section">
      <span className="depth-pill__depth" ref={depth}>
        0 m
      </span>
      {sensor ? (
        <span className="depth-pill__sensor">
          <SensorIcon id={sensor} size={13} />
          {SENSORS[sensor].short}
        </span>
      ) : null}
      <span className="depth-pill__label">{active?.label}</span>
    </button>
  );
}
