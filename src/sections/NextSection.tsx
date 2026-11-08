import { Link } from "react-router-dom";
import { next } from "@/content/next";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { UsblFix } from "@/components/sensors/UsblFix";

export function NextSection() {
  return (
    <SectionFrame
      id="next"
      title="The Next Dive"
      kicker="What comes after the pool"
      lead={<p>{next.lead}</p>}
      aside={
        <div className="instrument-card instrument-card--wide">
          <div className="instrument-card__head">
            <span>USBL · position fix</span>
            <span className="instrument-card__live">live</span>
          </div>
          <UsblFix className="instrument-card__canvas" />
        </div>
      }
    >
      <div className="subhead">
        <span className="eyebrow">What I want to work on</span>
      </div>
      <Reveal className="next-grid" stagger={0.1}>
        {next.directions.map((d, i) => (
          <GlowCard key={d.title} className="card next-card">
            <span className="spec-card__n">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="next-card__title">{d.title}</h3>
            <p className="next-card__text">{d.text}</p>
            <div className="chip-row">
              <span className="next-card__builds">Builds on</span>
              {d.buildsOn.map((b) => (
                <Link key={b.to} to={b.to} className="chip chip--accent" data-cursor="READ">
                  {b.label}
                </Link>
              ))}
            </div>
          </GlowCard>
        ))}
      </Reveal>

      <div className="subhead">
        <span className="eyebrow">What I want to do</span>
      </div>
      <Reveal as="ol" className="next-path" stagger={0.12}>
        {next.path.map((p) => (
          <li key={p.title} className="next-path__step">
            <span className="next-path__when">{p.when}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </Reveal>

      <Reveal className="belief">
        <blockquote>
          <p>{next.quote}</p>
        </blockquote>
      </Reveal>
    </SectionFrame>
  );
}
