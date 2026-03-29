import { PageShell } from "@/components/ui/PageShell";
import { about } from "@/content/about";

export function About() {
  return (
    <PageShell
      title="About me"
      subtitle="Marine robotics, autonomy, and underwater systems at IIT Madras."
    >
      <div className="panel">
        <div className="prose">
          {about.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            <strong>My work lies at the intersection of:</strong>
          </p>
          <ul>
            {about.intersection.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p>{about.focus}</p>
          <p>{about.mavlab}</p>
          <ul>
            {about.mavlabEmphasis.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p>{about.belief}</p>
        </div>
      </div>

      <div className="panel">
        <h2 className="section-title">Positions & leadership</h2>
        <ul className="prose">
          {about.positions.map((p) => (
            <li key={p.role + p.org}>
              <strong>{p.role}</strong> — {p.org}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2 className="section-title">{about.careerVision.title}</h2>
        <div className="prose">
          <p>{about.careerVision.lead}</p>
          <ul>
            {about.careerVision.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel">
        <h2 className="section-title">{about.futurePlans.title}</h2>
        <div className="prose">
          <p>
            <strong>Target:</strong> {about.futurePlans.target}
          </p>
          <p>
            <strong>Focus:</strong>
          </p>
          <ul>
            {about.futurePlans.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
