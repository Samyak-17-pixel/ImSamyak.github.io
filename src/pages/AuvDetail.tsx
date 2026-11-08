import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { auvBySlug, auvs } from "@/content/auvs";
import { SENSORS, sectionById } from "@/content/sections";
import { AUV_PARTS } from "@/components/auv/sensorInfo";
import type { AuvPartId } from "@/components/auv/sensorInfo";
import type { RenderMode } from "@/components/auv/AuvGlbModel";
import { SensorIcon } from "@/components/sensors/SensorIcon";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { GlowCard } from "@/components/ui/GlowCard";
import { projectBySlug } from "@/content/projectCatalog";
import { setDepthOverride } from "@/lib/scrollStore";
import { setBackgroundPaused } from "@/lib/sceneControl";
import { DetailHeader } from "./DetailHeader";

const AuvViewer = lazy(() => import("@/components/auv/AuvViewer").then((m) => ({ default: m.AuvViewer })));

export function AuvDetail() {
  const { slug } = useParams();
  const auv = auvBySlug(slug);
  const [mode, setMode] = useState<RenderMode>("solid");
  const [spin, setSpin] = useState(true);
  const [part, setPart] = useState<AuvPartId>(auv?.suite?.[0] ?? "imu");
  useEffect(() => setPart(auv?.suite?.[0] ?? "imu"), [auv]);
  const depth = sectionById("models")?.depthM ?? 80;

  useEffect(() => {
    setDepthOverride(depth);
    setBackgroundPaused(true);
    return () => {
      setDepthOverride(null);
      setBackgroundPaused(false);
    };
  }, [depth]);

  if (!auv) return <Navigate to="/models" replace />;
  const other = auvs[(auvs.indexOf(auv) + 1) % auvs.length];
  const info = AUV_PARTS[part];
  const project = projectBySlug(auv.project);

  return (
    <article className="detail auv-doc">
      <DetailHeader back="/models" backLabel="Back to the fleet" depth={depth} sensor="imaging" tag="Vehicle" />

      <div className="auv-doc__layout">
        <div className="auv-doc__viewer" data-cursor="DRAG">
          <Suspense fallback={null}>
            <AuvViewer key={auv.slug} src={auv.model} name={auv.name} mode={mode} autoRotate={spin} />
          </Suspense>
          <div className="auv-doc__controls" role="toolbar" aria-label="Viewer controls">
            <div className="segmented" role="radiogroup" aria-label="Render mode">
              {(["solid", "sonar"] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? "is-on" : ""} onClick={() => setMode(m)}>
                  {m === "solid" ? "Hull" : "Sonar"}
                </button>
              ))}
            </div>
            <button type="button" className={"toggle" + (spin ? " is-on" : "")} aria-pressed={spin} onClick={() => setSpin((s) => !s)}>
              Auto-rotate
            </button>
          </div>
          <span className="auv-doc__hint">Drag to orbit · scroll to zoom</span>
        </div>

        <div className="auv-doc__info">
          <span className="eyebrow">{auv.tagline}</span>
          <SplitTitle as="h1" text={auv.name} className="auv-doc__name" immediate delay={0.15} />
          <p className="prose">{auv.description}</p>
          <div className="auv-doc__group">
            <span className="eyebrow">Focus</span>
            <div className="chip-row">
              {auv.focus.map((f) => (
                <span key={f} className="chip chip--lg">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="auv-doc__group">
            <span className="eyebrow">Key sensors</span>
            <div className="chip-row">
              {auv.sensors.map((s) => (
                <span key={s} className="chip chip--sensor">
                  <SensorIcon id={s} size={13} />
                  {SENSORS[s].name}
                </span>
              ))}
              {auv.extras?.map((x) => (
                <span key={x} className="chip chip--sensor">
                  <SensorIcon id="camera" size={13} />
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {project ? (
        <section className="auv-doc__spec">
          <h2 className="detail-h2">Build story</h2>
          <Link to={`/projects/${project.slug}`} className="card project-link-card" data-cursor="READ">
            <span className="eyebrow">{project.org}</span>
            <span className="project-link-card__title">{project.title}</span>
            <span className="project-link-card__text">{project.summary}</span>
            <span className="link-arrow">
              Read the full write-up <span aria-hidden>→</span>
            </span>
          </Link>
        </section>
      ) : null}

      {auv.suite ? (
        <section className="auv-doc__spec">
          {auv.suite ? (
            <>
              <h2 className="detail-h2">Sensor reference</h2>
              <div className="sensor-ref">
                <div className="sensor-ref__list" role="tablist" aria-label="Sensors">
                  {auv.suite.map((id) => (
                    <button key={id} type="button" role="tab" aria-selected={part === id} className={part === id ? "is-on" : ""} onClick={() => setPart(id)}>
                      {AUV_PARTS[id].label}
                    </button>
                  ))}
                </div>
                <GlowCard className="card sensor-ref__panel" role="tabpanel">
                  <h3>{info.label}</h3>
                  <p>{info.role}</p>
                  <span className="eyebrow">Data</span>
                  <ul className="check-list">
                    {info.data.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </GlowCard>
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      <Link to={`/models/${other.slug}`} className="next-card" data-cursor="NEXT">
        <span className="eyebrow">Next vehicle</span>
        <span className="next-card__title">
          {other.name} — {other.tagline}
        </span>
        <span className="next-card__go" aria-hidden>
          →
        </span>
      </Link>
    </article>
  );
}
