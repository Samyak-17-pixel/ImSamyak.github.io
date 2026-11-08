import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auvs } from "@/content/auvs";
import { SENSORS } from "@/content/sections";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { LazyMount } from "@/components/ui/LazyMount";
import { Reveal } from "@/components/ui/Reveal";
import { ImagingFan } from "@/components/sensors/ImagingFan";
import { SensorIcon } from "@/components/sensors/SensorIcon";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/quality";

const AuvViewer = lazy(() => import("@/components/auv/AuvViewer").then((m) => ({ default: m.AuvViewer })));

function FleetCard({ auv, index }: { auv: (typeof auvs)[number]; index: number }) {
  const stage = useRef<HTMLDivElement>(null);

  // Imaging-sonar reveal: the model appears inside a widening sonar fan.
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (env.reducedMotion) {
      el.style.setProperty("--reveal", "1");
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { "--reveal": 0 },
        { "--reveal": 1, duration: 2.2, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <article className={"fleet-card" + (index % 2 ? " fleet-card--flip" : "")}>
      <div className="fleet-card__stage" ref={stage}>
        <LazyMount className="fleet-card__model">
          <Suspense fallback={null}>
            <AuvViewer src={auv.model} name={auv.name} interactive={false} />
          </Suspense>
        </LazyMount>
        <ImagingFan className="fleet-card__fan" seed={index + 1} />
        <span className="fleet-card__hud fleet-card__hud--tl">IMG · {auv.name}</span>
        <span className="fleet-card__hud fleet-card__hud--br">130° · 20 m</span>
      </div>
      <Reveal className="fleet-card__body" stagger={0.08}>
        <span className="eyebrow">Vehicle {String(index + 1).padStart(2, "0")}</span>
        <h3 className="fleet-card__name">{auv.name}</h3>
        <p className="fleet-card__tagline">{auv.tagline}</p>
        <p className="prose fleet-card__desc">{auv.description}</p>
        <div className="chip-row">
          {auv.sensors.map((s) => (
            <span key={s} className="chip chip--sensor">
              <SensorIcon id={s} size={13} />
              {SENSORS[s].short}
            </span>
          ))}
          {auv.extras?.map((x) => (
            <span key={x} className="chip chip--sensor">
              <SensorIcon id="camera" size={13} />
              {x}
            </span>
          ))}
        </div>
        <div className="fleet-card__actions">
          <Link to={`/models/${auv.slug}`} className="btn btn-primary" data-cursor="INSPECT">
            Inspect in 3D
            <span className="btn__arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link to={`/projects/${auv.project}`} className="btn btn-ghost" data-cursor="READ">
            Full build story
          </Link>
        </div>
      </Reveal>
    </article>
  );
}

export function FleetSection() {
  return (
    <SectionFrame
      id="models"
      title="The fleet"
      kicker="AUV models"
      lead={<p>Three vehicles, three missions: one listens, one senses everything, one finds its way home.</p>}
    >
      <div className="fleet">
        {auvs.map((a, i) => (
          <FleetCard key={a.slug} auv={a} index={i} />
        ))}
      </div>
    </SectionFrame>
  );
}
