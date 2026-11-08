import { stats } from "@/content/stats";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Odometer } from "@/components/ui/Odometer";
import { Reveal } from "@/components/ui/Reveal";
import { DepthColumn } from "@/components/sensors/DepthColumn";

export function TelemetrySection() {
  return (
    <SectionFrame id="telemetry" title="Telemetry" kicker="Dive log so far" className="dive-section--compact">
      <div className="telemetry">
        <DepthColumn className="telemetry__column" />
        <Reveal className="stats-grid" stagger={0.1}>
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <Odometer value={s.value} />
              <span className="stat__label">{s.label}</span>
              <span className="stat__detail">{s.detail}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </SectionFrame>
  );
}
