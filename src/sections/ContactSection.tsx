import { useState } from "react";
import { contact } from "@/content/contact";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { ModemTransmit } from "@/components/sensors/ModemTransmit";
import { useGoToSection } from "@/lib/navigation";

function EmailRow({ label, email }: { label: string; email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <GlowCard className="card channel">
      <span className="eyebrow">{label}</span>
      <a href={`mailto:${email}`} className="channel__value">
        {email.split("@")[0]}
        <wbr />@{email.split("@")[1]}
      </a>
      <button type="button" className="channel__copy" onClick={copy} aria-live="polite">
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </GlowCard>
  );
}

export function ContactSection() {
  const go = useGoToSection();
  const cvHref = `${import.meta.env.BASE_URL}${contact.cvFile}`;
  return (
    <SectionFrame
      id="contact"
      title="Open a channel"
      kicker="Contact"
      lead={<p>Reach out for collaborations, research conversations, or marine robotics opportunities.</p>}
      className="dive-section--contact"
    >
      <div className="instrument-card instrument-card--banner">
        <div className="instrument-card__head">
          <span>Acoustic modem · transmitting</span>
          <span className="instrument-card__live">tx</span>
        </div>
        <ModemTransmit className="instrument-card__canvas instrument-card__canvas--modem" />
      </div>

      <Reveal className="channels" stagger={0.08}>
        <EmailRow label="Personal" email={contact.emailPersonal} />
        <EmailRow label="Institute" email={contact.emailInstitute} />
        <GlowCard as="a" href={contact.linkedin} target="_blank" rel="noreferrer" className="card channel channel--link">
          <span className="eyebrow">LinkedIn</span>
          <span className="channel__value">Samyak Kumar</span>
          <span className="channel__go" aria-hidden>
            ↗
          </span>
        </GlowCard>
        <GlowCard as="a" href={contact.githubUrl} target="_blank" rel="noreferrer" className="card channel channel--link">
          <span className="eyebrow">GitHub</span>
          <span className="channel__value">{contact.githubUser}</span>
          <span className="channel__go" aria-hidden>
            ↗
          </span>
        </GlowCard>
      </Reveal>

      <Reveal className="cv-cta">
        <a className="btn btn-primary btn-xl" href={cvHref} download data-cursor="PDF">
          Download CV
          <span className="btn__arrow" aria-hidden>
            ↓
          </span>
        </a>
      </Reveal>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Samyak Kumar · Max depth 1000 m</span>
        <button type="button" className="link-arrow" onClick={() => go("home")}>
          Ascend to surface <span aria-hidden>↑</span>
        </button>
      </footer>
    </SectionFrame>
  );
}
