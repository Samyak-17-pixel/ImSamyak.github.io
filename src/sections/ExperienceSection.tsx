import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience } from "@/content/experience";
import type { Role } from "@/content/experience";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { SideScanWaterfall } from "@/components/sensors/SideScanWaterfall";

function RoleCard({ role, index }: { role: Role; index: number }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={"timeline__item" + (index % 2 ? " timeline__item--right" : "")}>
      <span className="timeline__contact" aria-hidden>
        <span className="timeline__contact-ring" />
        <span className="timeline__contact-label">CONTACT {String(index + 1).padStart(2, "0")}</span>
      </span>
      <Reveal variant="scan">
        <GlowCard className="card role-card">
          <span className="role-card__period">{role.period}</span>
          <h3 className="role-card__title">{role.title}</h3>
          <span className="role-card__org">{role.org}</span>
          {role.intro ? <p className="role-card__intro">{role.intro}</p> : null}
          <ul className="accordion">
            {role.sections.map((sec, i) => {
              const isOpen = open === i;
              const panelId = `role-${index}-${i}`;
              return (
                <li key={sec.heading} className={isOpen ? "is-open" : ""}>
                  <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span className="accordion__n">{String(i + 1).padStart(2, "0")}</span>
                    {sec.heading}
                    <span className="accordion__icon" aria-hidden />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        className="accordion__panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {sec.bullets.map((b) => (
                          <p key={b}>{b}</p>
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </GlowCard>
      </Reveal>
    </div>
  );
}

export function ExperienceSection() {
  return (
    <SectionFrame
      id="experience"
      title="Experience"
      kicker="Contacts along the track"
      lead={<p>Each role shows up as a contact on the side-scan record.</p>}
    >
      <div className="timeline">
        <div className="timeline__spine" aria-hidden>
          <SideScanWaterfall className="timeline__waterfall" />
          <span className="timeline__spine-label timeline__spine-label--port">PORT</span>
          <span className="timeline__spine-label timeline__spine-label--stbd">STBD</span>
        </div>
        {experience.map((r, i) => (
          <RoleCard key={r.title} role={r} index={i} />
        ))}
      </div>
    </SectionFrame>
  );
}
