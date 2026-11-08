import { useEffect, useRef } from "react";
import { SECTIONS, SENSORS, SENSOR_ORDER, sectionById } from "@/content/sections";
import type { SensorId } from "@/content/sections";
import { SensorIcon } from "@/components/sensors/SensorIcon";
import { getScrollState, useActiveSection } from "@/lib/scrollStore";
import { useGoToSection } from "@/lib/navigation";
import { telemetry } from "./sensorMath";

type Readings = ReturnType<typeof telemetry>;

const fmt: Record<SensorId, (r: Readings) => string> = {
  usbl: (r) => `RNG ${r.usbl_range_m.toFixed(1)} m`,
  imu: (r) => `HDG ${r.heading_deg.toFixed(0).padStart(3, "0")}° R${r.roll_deg >= 0 ? "+" : ""}${r.roll_deg.toFixed(1)}`,
  depth: (r) => `${r.depth_m.toFixed(1)} m · ${r.pressure_bar.toFixed(1)} bar`,
  imaging: (r) => `SNR ${r.img_snr_db.toFixed(1)} dB`,
  fls: (r) => `RNG ${r.fls_range_m.toFixed(1)} m`,
  dvl: (r) => `ALT ${r.dvl_alt_m.toFixed(2)} m · ${r.dvl_vx.toFixed(2)} m/s`,
  sidescan: (r) => `SWATH ${r.sss_swath_m.toFixed(0)} m`,
  transponder: (r) => `${r.xpdr_count} BEACONS · LBL`,
  modem: (r) => `${r.modem_bps} bps`,
};

/** Right-hand instrument rail: every sensor Samyak has worked with, the active section's sensor lit up. */
export function InstrumentRail() {
  const active = useActiveSection();
  const go = useGoToSection();
  const values = useRef<Partial<Record<SensorId, HTMLSpanElement | null>>>({});
  const activeSensors = sectionById(active)?.sensors ?? [];

  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => {
      const r = telemetry(getScrollState().depth, (performance.now() - start) / 1000);
      for (const s of SENSOR_ORDER) {
        const el = values.current[s];
        if (el) el.textContent = fmt[s](r);
      }
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  return (
    <aside className="instrument-rail" aria-label="Sensor suite">
      <div className="instrument-rail__head">
        <span className="instrument-rail__led" aria-hidden />
        Sensor suite
      </div>
      <ul>
        {SENSOR_ORDER.map((id) => {
          const on = activeSensors.includes(id);
          const home = SECTIONS.find((s) => s.sensors.includes(id));
          return (
            <li key={id} className={on ? "is-on" : ""}>
              <button type="button" onClick={() => home && go(home.id)} title={`${SENSORS[id].name} — ${home?.label}`}>
                <span className="instrument-rail__icon">
                  <SensorIcon id={id} size={15} />
                </span>
                <span className="instrument-rail__text">
                  <span className="instrument-rail__name">{SENSORS[id].short}</span>
                  <span
                    className="instrument-rail__value"
                    ref={(el) => {
                      values.current[id] = el;
                    }}
                    aria-hidden
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
