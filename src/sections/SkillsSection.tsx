import { useState } from "react";
import { skills } from "@/content/skills";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { TransponderNet } from "@/components/sensors/TransponderNet";

const stacks = skills.groups;

export function SkillsSection() {
  const [active, setActive] = useState(-1);
  return (
    <SectionFrame
      id="skills"
      title="Skills"
      kicker="Every beacon is a capability"
      lead={<p>Hover a capability and its transponder answers the ping.</p>}
    >
      <div className="skills">
        <TransponderNet className="skills__net" active={active} />
        <Reveal className="stack-list" stagger={0.06}>
          {stacks.map((s) => (
            <div key={s.label} className="stack-row">
              <span className="stack-row__label">{s.label}</span>
              <div className="chip-row">
                {s.items.map((it) => (
                  <span key={it} className="chip">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="expertise-grid" stagger={0.07}>
          {skills.expertise.map((e, i) => (
            <GlowCard
              key={e.title}
              className={"card expertise-card" + (active === i ? " is-active" : "")}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(-1)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
              tabIndex={0}
            >
              <span className="expertise-card__id">
                <span className="expertise-card__beacon" aria-hidden />
                XPDR {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{e.title}</h3>
              <ul>
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </GlowCard>
          ))}
        </Reveal>
      </div>
    </SectionFrame>
  );
}
