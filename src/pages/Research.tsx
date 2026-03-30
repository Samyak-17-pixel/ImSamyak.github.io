import { PageShell } from "@/components/ui/PageShell";
import { research } from "@/content/research";

export function Research() {
  const p1 = research.paper1;
  const p2 = research.paper2;
  return (
    <PageShell
      title="Research"
      subtitle="Reliability, perception, and autonomy for underwater robots in harsh, GPS-denied environments."
    >
      <div className="panel panel--hud" style={{ marginBottom: 18 }}>
        <h2 className="section-title">Active research (at a glance)</h2>
        <div className="prose">
          <ul>
            <li>
              <strong>{p1.title}</strong> — learning-based sensor integrity monitoring to improve navigation robustness under
              time-varying degradation and faults.
            </li>
            <li>
              <strong>{p2.title}</strong> — low-cost 3D reconstruction using forward-scan sonar with Gaussian splatting to
              handle sparse, elevation-ambiguous measurements.
            </li>
          </ul>
        </div>
      </div>

      <div className="panel">
        <h2 className="section-title">Research overview</h2>
        <div className="prose">
          <p>{research.overview}</p>
          <ul>
            {research.environmentBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <h2 className="section-title" style={{ marginTop: 18 }}>
          Core research themes
        </h2>
        <div className="tag-row">
          {research.themes.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="paper-card">
        <h3>{p1.title}</h3>
        <h2 className="section-title">{p1.problemContext.title}</h2>
        <div className="prose">
          {p1.problemContext.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <h2 className="section-title">{p1.limitations.title}</h2>
        <div className="prose">
          {p1.limitations.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <h2 className="section-title">{p1.approach.title}</h2>
        <p className="prose">{p1.approach.intro}</p>
        {p1.approach.components.map((c) => (
          <div key={c.name} className="role-card">
            <h3 style={{ fontSize: "0.95rem", marginBottom: 6 }}>{c.name}</h3>
            <ul className="prose">
              {c.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        <h2 className="section-title">Key contributions</h2>
        <ul className="prose">
          {p1.contributions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <h2 className="section-title">Results & impact</h2>
        <ul className="prose">
          {p1.results.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="paper-card">
        <h3>{p2.title}</h3>
        <h2 className="section-title">{p2.problemContext.title}</h2>
        <div className="prose">
          {p2.problemContext.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <h2 className="section-title">{p2.challenge.title}</h2>
        <div className="prose">
          {p2.challenge.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <h2 className="section-title">Proposed solution</h2>
        <p className="prose">{p2.solution}</p>
        <h2 className="section-title">Methodology</h2>
        {p2.methodology.map((m) => (
          <div key={m.title} className="role-card">
            <h3 style={{ fontSize: "0.95rem", marginBottom: 6 }}>{m.title}</h3>
            <ul className="prose">
              {m.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        <h2 className="section-title">Validation</h2>
        <p className="prose">{p2.validation}</p>
        <h2 className="section-title">Key contributions</h2>
        <ul className="prose">
          {p2.contributions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <h2 className="section-title">Impact</h2>
        <ul className="prose">
          {p2.impact.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
