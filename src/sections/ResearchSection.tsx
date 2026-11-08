import { Link } from "react-router-dom";
import { research, papers } from "@/content/research";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { FlsArc } from "@/components/sensors/FlsArc";

export function ResearchSection() {
  return (
    <SectionFrame
      id="research"
      title="Research"
      kicker="Seeing without light"
      aside={
        <div className="instrument-card instrument-card--wide research-fls">
          <div className="instrument-card__head">
            <span>Forward-scan sonar · arcs</span>
            <span className="instrument-card__live">live</span>
          </div>
          <FlsArc className="instrument-card__canvas" />
        </div>
      }
      lead={
        <>
          <p>{research.overview}</p>
          <ul className="condition-list">
            {research.environmentBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </>
      }
    >
      <Reveal className="paper-list" stagger={0.15}>
        {papers.map((p) => (
          <GlowCard key={p.slug} as={Link} to={`/research/${p.slug}`} className="card paper-card" data-cursor="READ">
            <div className="paper-card__index">
              <span>Paper</span>
              <strong>{p.index}</strong>
            </div>
            <div className="paper-card__body">
              <h3 className="paper-card__title">{p.title}</h3>
              <p className="paper-card__summary">{p.summary}</p>
              <div className="chip-row">
                {p.keywords.map((k) => (
                  <span key={k} className="chip">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <span className="paper-card__go" aria-hidden>
              ↗
            </span>
          </GlowCard>
        ))}
      </Reveal>

      <div className="subhead">
        <span className="eyebrow">Research themes</span>
      </div>
      <Reveal className="theme-grid" stagger={0.06} variant="scan">
        {research.themes.map((t, i) => (
          <div key={t} className="theme-tile">
            <span className="theme-tile__ping" aria-hidden />
            <span className="theme-tile__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="theme-tile__t">{t}</span>
          </div>
        ))}
      </Reveal>
    </SectionFrame>
  );
}
