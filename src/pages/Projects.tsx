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
      <div className="panel panel--hud" style={{ marginBottom: 18 }}>
        <h2 className="section-title">Flagship build</h2>
        <div className="prose">
          <p>
            <strong>{a.title}</strong> — {a.overview}
          </p>
          <ul>
            <li>
              <strong>System architecture:</strong> modular frame + independent control / compute-power / comms-battery modules
            </li>
            <li>
              <strong>Sensors:</strong> IMU, DVL A50, Ping2, Ping360, side-scan, pressure (USBL + camera planned)
            </li>
            <li>
              <strong>Compute:</strong> Jetson Orin Nano + Pixhawk + Arduino
            </li>
            <li>
              <strong>Control:</strong> depth/heading/velocity regulation with safety constraints for real missions
            </li>
          </ul>
        </div>
      </div>

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
