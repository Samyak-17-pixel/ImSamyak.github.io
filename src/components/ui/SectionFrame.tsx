import type { ReactNode } from "react";
import { SENSORS, sectionById, sectionIndex, SECTIONS } from "@/content/sections";
import { SensorIcon } from "@/components/sensors/SensorIcon";
import { SplitTitle } from "./SplitTitle";

type Props = {
  id: string;
  title: string;
  kicker?: string;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
};

/** Shared section chrome: depth tag, driving sensor, index and an animated title. */
export function SectionFrame({ id, title, kicker, lead, children, className, aside }: Props) {
  const section = sectionById(id);
  const idx = sectionIndex(id);
  return (
    <section id={id} className={"dive-section " + (className ?? "")} aria-label={title}>
      <div className="dive-section__inner">
        <header className="section-head">
          <div className="section-head__meta" aria-hidden>
            <span className="section-head__index">
              {String(idx).padStart(2, "0")}
              <span className="section-head__total">/{String(SECTIONS.length - 1).padStart(2, "0")}</span>
            </span>
            <span className="section-head__rule" />
            <span className="section-head__depth">{section?.depthM ?? 0} m</span>
            <span className="section-head__zone">{section?.zone}</span>
            {section?.sensors.map((s) => (
              <span key={s} className="sensor-chip">
                <SensorIcon id={s} size={14} />
                {SENSORS[s].name}
              </span>
            ))}
          </div>
          {kicker ? <p className="section-head__kicker">{kicker}</p> : null}
          <div className="section-head__row">
            <div className="section-head__titles">
              <SplitTitle text={title} className="section-title-xl" />
              {lead ? <div className="section-head__lead">{lead}</div> : null}
            </div>
            {aside}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
