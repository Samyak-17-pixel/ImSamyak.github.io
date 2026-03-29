import { PageShell } from "@/components/ui/PageShell";
import { experience } from "@/content/experience";

export function Experience() {
  return (
    <PageShell
      title="Work experience"
      subtitle="AUV sensing & control, systems integration, and hardware design across competition and research teams."
    >
      {experience.map((role) => (
        <div key={role.title + role.period} className="panel role-card">
          <h2 className="section-title" style={{ color: "#e0f2fe", marginBottom: 4 }}>
            {role.title}
          </h2>
          <div className="role-meta">
            {role.org} · {role.period}
          </div>
          {role.intro ? <p className="prose">{role.intro}</p> : null}
          {role.sections.map((sec) => (
            <div key={sec.heading}>
              <h3
                style={{
                  fontSize: "0.95rem",
                  margin: "14px 0 8px",
                  color: "#bae6fd",
                }}
              >
                {sec.heading}
              </h3>
              <ul className="prose">
                {sec.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </PageShell>
  );
}
