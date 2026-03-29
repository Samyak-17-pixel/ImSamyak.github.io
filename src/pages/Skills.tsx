import { PageShell } from "@/components/ui/PageShell";
import { skills } from "@/content/skills";

export function Skills() {
  return (
    <PageShell
      title="Skills & technical expertise"
      subtitle="Software, hardware, perception, and systems integration for underwater robotics."
    >
      <div className="panel">
        <h2 className="section-title">Programming</h2>
        <div className="tag-row">
          {skills.programming.map((x) => (
            <span key={x} className="tag">
              {x}
            </span>
          ))}
        </div>
        <h2 className="section-title">Robotics</h2>
        <ul className="prose">
          {skills.robotics.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">AI / ML</h2>
        <ul className="prose">
          {skills.ai.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">Simulation</h2>
        <ul className="prose">
          {skills.simulation.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2 className="section-title">Hardware</h2>
        <ul className="prose">
          {skills.hardware.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2 className="section-title">Technical expertise (expanded)</h2>
        {skills.expertise.map((block) => (
          <div key={block.title} style={{ marginBottom: 16 }}>
            <h3
              style={{
                fontSize: "0.98rem",
                margin: "0 0 8px",
                color: "#e0f2fe",
                textTransform: "capitalize",
              }}
            >
              {block.title}
            </h3>
            <ul className="prose">
              {block.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
