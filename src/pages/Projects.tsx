import { PageShell } from "@/components/ui/PageShell";
import { projects } from "@/content/projects";

export function Projects() {
  const a = projects.compactAuv;
  const s = projects.sauvc;
  return (
    <PageShell
      title="Projects & competition"
      subtitle="Compact modular AUV development and SAUVC 2026 with Team Aritra."
    >
      <div className="panel">
        <h2 className="section-title">{a.title}</h2>
        <p className="prose">{a.overview}</p>
        <h2 className="section-title">Design philosophy</h2>
        <ul className="prose">
          {a.philosophy.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">{a.mechanical.title}</h2>
        <ul className="prose">
          {a.mechanical.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <h2 className="section-title">{a.internal.title}</h2>
        <ul className="prose">
          {a.internal.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <h2 className="section-title">Sensors</h2>
        <div className="tag-row">
          {a.sensors.map((x) => (
            <span key={x} className="tag">
              {x}
            </span>
          ))}
        </div>
        <h2 className="section-title">Compute stack</h2>
        <ul className="prose">
          {a.compute.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">Power system</h2>
        <ul className="prose">
          {a.power.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">Actuation</h2>
        <ul className="prose">
          {a.actuation.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">Safety systems</h2>
        <ul className="prose">
          {a.safety.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">Applications</h2>
        <ul className="prose">
          {a.applications.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2 className="section-title">{s.title}</h2>
        <p className="prose">{s.intro}</p>
        <h2 className="section-title">Mission capabilities</h2>
        <ul className="prose">
          {s.missions.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
