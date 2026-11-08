import { Link } from "react-router-dom";
import { about } from "@/content/about";
import { home } from "@/content/home";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { ScrubText } from "@/components/ui/ScrubText";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { ImuAttitude } from "@/components/sensors/ImuAttitude";

export function AboutSection() {
  return (
    <SectionFrame id="about" title="About" kicker="Who is piloting this thing">
      <div className="about-grid">
        <div className="about-main">
          {about.intro.map((p) => (
            <ScrubText key={p} text={p} className="about-intro" />
          ))}

          <Reveal className="about-intersection">
            <span className="eyebrow">Working at the intersection of</span>
            <div className="chip-row">
              {about.intersection.map((x, i) => (
                <span key={x} className="chip chip--lg">
                  <span className="chip__n">{String(i + 1).padStart(2, "0")}</span>
                  {x}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="prose about-prose">
            <p>{home.summary}</p>
            <p>{about.focus}</p>
          </Reveal>

          <Reveal className="about-mavlab">
            <GlowCard className="card card--accent">
              <span className="eyebrow">MAVLAB · IIT Madras</span>
              <p className="prose">{about.mavlab}</p>
              <ul className="emphasis-grid">
                {about.mavlabEmphasis.map((e, i) => (
                  <li key={e}>
                    <span className="emphasis-grid__n">{String(i + 1).padStart(2, "0")}</span>
                    {e}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </Reveal>

          <Reveal className="about-highlights">
            <span className="eyebrow">Mission highlights</span>
            <ul className="check-list">
              {home.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <aside className="about-aside">
          <div className="instrument-card">
            <div className="instrument-card__head">
              <span>IMU · attitude</span>
              <span className="instrument-card__live">live</span>
            </div>
            <ImuAttitude className="instrument-card__canvas instrument-card__canvas--square" />
            <p className="instrument-card__caption">Roll and pitch follow your cursor; pitch reacts to scroll speed.</p>
          </div>
        </aside>
      </div>

      <Reveal className="belief">
        <blockquote>
          <p>{about.belief}</p>
        </blockquote>
      </Reveal>

      <div className="subhead">
        <span className="eyebrow">Positions</span>
      </div>
      <Reveal className="positions-grid" stagger={0.08}>
        {about.positions.map((p) => (
          <GlowCard key={p.role} className="card position-card">
            <span className="position-card__role">{p.role}</span>
            <span className="position-card__org">{p.org}</span>
          </GlowCard>
        ))}
      </Reveal>

      <p className="about-next">
        <Link to="/next" data-cursor="DIVE">
          Where I want to go next →
        </Link>
      </p>
    </SectionFrame>
  );
}
