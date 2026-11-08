import { useLayoutEffect, useRef } from "react";
import { education } from "@/content/education";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/quality";

type Fix = { kind: string; title: string; detail: string };

const fixes: Fix[] = [
  ...education.awards.map((a) => ({ kind: "Award", title: a.title, detail: a.detail })),
  ...education.conferences.map((c) => ({ kind: "Conference", title: c.title, detail: c.detail })),
  ...education.leadership.map((l) => ({ kind: "Leadership", title: `${l.role} — ${l.org}`, detail: l.detail })),
  ...education.events.map((e) => ({ kind: "Event", title: e.title, detail: e.detail })),
];

/** Dead-reckoning track: the line draws as you scroll; each item is a position fix collapsing its uncertainty. */
function Track() {
  const ref = useRef<HTMLOListElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || env.reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".track__fill",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.5 } }
      );
      el.querySelectorAll<HTMLElement>(".track__fix").forEach((fix) => {
        gsap.fromTo(
          fix.querySelector(".track__ellipse"),
          { scale: 2.6, opacity: 0.5 },
          { scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: fix, start: "top 72%", end: "top 45%", scrub: 0.5 } }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <ol className="track" ref={ref}>
      <span className="track__line" aria-hidden>
        <span className="track__fill" />
      </span>
      {fixes.map((f) => (
        <li key={f.title} className="track__fix">
          <span className="track__ellipse" aria-hidden />
          <Reveal className="track__body">
            <span className="track__kind">{f.kind}</span>
            <h3>{f.title}</h3>
            <p>{f.detail}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function EducationSection() {
  const e = education;
  return (
    <SectionFrame id="education" title="Education" kicker="Dead reckoning: where I've been">
      <div className="edu-grid">
        <div className="edu-main">
          <Reveal>
            <GlowCard className="card degree-card">
              <span className="eyebrow">Degree</span>
              <h3 className="degree-card__title">{e.degree.title}</h3>
              <p className="degree-card__school">{e.degree.school}</p>
              <p className="degree-card__grad">{e.degree.graduation}</p>
            </GlowCard>
          </Reveal>
          <Reveal>
            <span className="eyebrow">Relevant coursework</span>
            <div className="chip-row">
              {e.coursework.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <span className="eyebrow">Research interests</span>
            <div className="chip-row">
              {e.researchInterests.map((r) => (
                <span key={r} className="chip chip--accent">
                  {r}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="edu-track">
          <span className="eyebrow">Recognition · conferences · leadership</span>
          <Track />
        </div>
      </div>
    </SectionFrame>
  );
}
