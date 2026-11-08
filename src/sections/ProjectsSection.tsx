import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_LABEL, projectCatalog, thumbOf } from "@/content/projectCatalog";
import type { ProjectCategory } from "@/content/projectCatalog";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { DvlBeams } from "@/components/sensors/DvlBeams";

type Filter = "All" | ProjectCategory;
const FILTERS: Filter[] = ["All", ...(Object.keys(CATEGORY_LABEL) as ProjectCategory[])];

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = filter === "All" ? projectCatalog : projectCatalog.filter((p) => p.category === filter);

  return (
    <SectionFrame
      id="projects"
      title="Projects"
      kicker="Built from the hull up"
      lead={<p>Vehicles I have built, the software that runs them, and the research around them. Open any card for the full write-up.</p>}
    >
      <div className="instrument-card instrument-card--banner">
        <div className="instrument-card__head">
          <span>Doppler velocity log · 4-beam bottom lock</span>
          <span className="instrument-card__live">live</span>
        </div>
        <DvlBeams className="instrument-card__canvas instrument-card__canvas--banner" />
      </div>

      <div className="segmented project-filter" role="radiogroup" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button key={f} type="button" role="radio" aria-checked={filter === f} className={filter === f ? "is-on" : ""} onClick={() => setFilter(f)}>
            {f === "All" ? "All" : CATEGORY_LABEL[f]}
            <span className="project-filter__n">{f === "All" ? projectCatalog.length : projectCatalog.filter((p) => p.category === f).length}</span>
          </button>
        ))}
      </div>

      <Reveal key={filter} className="project-grid" stagger={0.05}>
        {shown.map((p) => {
          const cover = p.images[0];
          return (
            <GlowCard key={p.slug} className="card project-card">
              <Link to={`/projects/${p.slug}`} className="project-card__link" data-cursor="READ">
                <div className={"project-card__media" + (cover ? "" : " project-card__media--empty")}>
                  {cover ? (
                    <img src={`${import.meta.env.BASE_URL}${thumbOf(cover.src)}`} alt={cover.alt} loading="lazy" decoding="async" />
                  ) : (
                    <span aria-hidden>{p.pipeline?.map((s) => s.title).join(" → ")}</span>
                  )}
                  <span className="project-card__cat">{CATEGORY_LABEL[p.category]}</span>
                </div>
                <div className="project-card__body">
                  <h3 className="project-card__title">{p.title}</h3>
                  <p className="project-card__summary">{p.summary}</p>
                  <div className="chip-row">
                    {p.stack.slice(0, 4).map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="link-arrow">
                    Read more <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </GlowCard>
          );
        })}
      </Reveal>
    </SectionFrame>
  );
}
