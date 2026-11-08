import { Link } from "react-router-dom";
import { SENSORS } from "@/content/sections";
import type { SensorId } from "@/content/sections";
import { SensorIcon } from "@/components/sensors/SensorIcon";

type Props = { back: string; backLabel: string; depth: number; sensor: SensorId; tag: string };

export function DetailHeader({ back, backLabel, depth, sensor, tag }: Props) {
  return (
    <div className="detail-bar">
      <Link to={back} className="link-arrow link-arrow--back">
        <span aria-hidden>←</span> {backLabel}
      </Link>
      <div className="detail-bar__meta" aria-hidden>
        <span>{tag}</span>
        <span className="section-head__rule" />
        <span>{depth} m</span>
        <span className="sensor-chip">
          <SensorIcon id={sensor} size={14} />
          {SENSORS[sensor].name}
        </span>
      </div>
    </div>
  );
}
