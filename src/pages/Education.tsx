import { PageShell } from "@/components/ui/PageShell";
import { education } from "@/content/education";

export function Education() {
  const e = education;
  return (
    <PageShell
      title="Education & recognition"
      subtitle="Coursework, awards, conferences, leadership, and research interests."
    >
      <div className="panel">
        <h2 className="section-title">Education</h2>
        <p className="prose">
          <strong>{e.degree.title}</strong>
          <br />
          {e.degree.school}
          <br />
          {e.degree.graduation}
        </p>
        <h2 className="section-title">Relevant coursework</h2>
        <ul className="prose">
          {e.coursework.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2 className="section-title">Awards & achievements</h2>
        {e.awards.map((a) => (
          <div key={a.title} className="role-card">
            <h3 style={{ fontSize: "1rem", margin: "0 0 6px" }}>{a.title}</h3>
            <p className="prose">{a.detail}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="section-title">Conferences & exposure</h2>
        {e.conferences.map((c) => (
          <div key={c.title} className="role-card">
            <h3 style={{ fontSize: "1rem", margin: "0 0 6px" }}>{c.title}</h3>
            <p className="prose">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="section-title">Leadership & activities</h2>
        {e.leadership.map((l) => (
          <div key={l.role} className="role-card">
            <h3 style={{ fontSize: "1rem", margin: "0 0 4px" }}>
              {l.role} — {l.org}
            </h3>
            <p className="prose">{l.detail}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="section-title">Events & organizational experience</h2>
        {e.events.map((ev) => (
          <div key={ev.title}>
            <h3 style={{ fontSize: "1rem", margin: "0 0 6px" }}>{ev.title}</h3>
            <p className="prose">{ev.detail}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="section-title">Research interests</h2>
        <div className="tag-row">
          {e.researchInterests.map((r) => (
            <span key={r} className="tag">
              {r}
            </span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
