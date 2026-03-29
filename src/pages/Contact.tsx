import { PageShell } from "@/components/ui/PageShell";
import { contact } from "@/content/contact";

export function Contact() {
  const cvHref = `${import.meta.env.BASE_URL}${contact.cvFile}`;
  return (
    <PageShell
      title="Contact"
      subtitle="Reach out for collaborations, research conversations, or marine robotics opportunities."
    >
      <div className="panel">
        <h2 className="section-title">Email</h2>
        <p className="prose">
          <strong>Personal:</strong>{" "}
          <a href={`mailto:${contact.emailPersonal}`}>{contact.emailPersonal}</a>
          <br />
          <strong>Institute:</strong>{" "}
          <a href={`mailto:${contact.emailInstitute}`}>{contact.emailInstitute}</a>
        </p>
        <h2 className="section-title">Profiles</h2>
        <ul className="prose">
          <li>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn — Samyak Kumar
            </a>
          </li>
          <li>
            <a href={contact.githubUrl} target="_blank" rel="noreferrer">
              GitHub — {contact.githubUser}
            </a>
          </li>
        </ul>
        <h2 className="section-title">CV</h2>
        <p className="prose">
          <a href={cvHref} download>
            Download CV (PDF)
          </a>
        </p>
      </div>
    </PageShell>
  );
}
