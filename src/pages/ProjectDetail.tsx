import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { projectBySlug, projectCatalog } from "@/content/projectCatalog";
import { paperBySlug } from "@/content/research";
import { auvBySlug } from "@/content/auvs";
import { sectionById } from "@/content/sections";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Gallery } from "@/components/ui/Gallery";
import { setDepthOverride } from "@/lib/scrollStore";
import { scrollToSection } from "@/lib/smoothScroll";
import { DetailHeader } from "./DetailHeader";

const url = (src: string) => `${import.meta.env.BASE_URL}${src}`;

export function ProjectDetail() {
  const { slug } = useParams();
  const project = projectBySlug(slug);
  const [current, setCurrent] = useState("");
  const depth = sectionById("projects")?.depthM ?? 250;

  useEffect(() => {
    setDepthOverride(depth);
    return () => setDepthOverride(null);
  }, [depth]);

  useEffect(() => {
    if (!project) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setCurrent(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    document.querySelectorAll(".paper-doc [data-toc]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [project]);

  if (!project) return <Navigate to="/projects" replace />;

  const [hero, ...rest] = project.images;
  const galleryImages = rest;
  const toc = [
    { id: "overview", title: "Overview" },
    ...(project.specs?.length ? [{ id: "glance", title: "At a glance" }] : []),
    ...(project.results.length ? [{ id: "results", title: "Results" }] : []),
    ...project.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(project.pipeline ? [{ id: "pipeline", title: project.pipelineTitle ?? "Pipeline" }] : []),
    ...(galleryImages.length ? [{ id: "gallery", title: "Gallery" }] : []),
  ];

  const i = projectCatalog.indexOf(project);
  const next = projectCatalog[(i + 1) % projectCatalog.length];
  const paper = paperBySlug(project.relatedPaper);
  const auv = auvBySlug(project.relatedAuv);
  const related = (project.relatedProjects ?? []).map((s) => projectBySlug(s)).filter((p) => p !== undefined);

  return (
    <article className="detail paper-doc project-doc">
      <DetailHeader back="/projects" backLabel="Back to projects" depth={depth} sensor="dvl" tag={`Project · ${project.category}`} />

      <header className={"paper-doc__hero" + (hero ? "" : " project-doc__hero--text")}>
        <div>
          <span className="eyebrow">{project.org}</span>
          <SplitTitle as="h1" text={project.title} className="paper-doc__title" immediate delay={0.2} />
          <p className="paper-doc__summary">{project.tagline}</p>
          <dl className="project-meta">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            {project.period ? (
              <div>
                <dt>When</dt>
                <dd>{project.period}</dd>
              </div>
            ) : null}
          </dl>
          <div className="chip-row">
            {project.stack.map((k) => (
              <span key={k} className="chip">
                {k}
              </span>
            ))}
          </div>
        </div>
        {hero ? (
          <figure className="project-doc__hero-img">
            <img src={url(hero.src)} alt={hero.alt} decoding="async" />
            <figcaption>{hero.caption}</figcaption>
          </figure>
        ) : null}
      </header>

      <div className="paper-doc__layout">
        <nav className="paper-toc" aria-label="On this page">
          <span className="eyebrow">On this page</span>
          <ol>
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className={current === t.id ? "is-active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(t.id);
                  }}
                >
                  {t.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="paper-doc__body">
          <section className="paper-block">
            <div id="overview" data-toc className="anchor" />
            <h2>Overview</h2>
            {project.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          {project.specs?.length ? (
            <section className="paper-block">
              <div id="glance" data-toc className="anchor" />
              <h2>At a glance</h2>
              <dl className="spec-table">
                {project.specs.map((sp) => (
                  <div key={sp.label} className="spec-table__row">
                    <dt>{sp.label}</dt>
                    <dd>{sp.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {project.results.length ? (
            <section className="paper-block">
              <div id="results" data-toc className="anchor" />
              <h2>Results</h2>
              <Reveal className="result-grid" stagger={0.06}>
                {project.results.map((r) => (
                  <GlowCard key={r.label} className="card result-card">
                    <span className="result-card__value">{r.value}</span>
                    <span className="result-card__label">{r.label}</span>
                    {r.note ? <span className="result-card__note">{r.note}</span> : null}
                  </GlowCard>
                ))}
              </Reveal>
            </section>
          ) : null}

          {project.sections.map((s) => (
            <Reveal key={s.id} as="section" className="paper-block">
              <div id={s.id} data-toc className="anchor" />
              <h2>{s.title}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.equations ? (
                <pre className="equation-block" aria-label="Formulas">
                  {s.equations.join("\n")}
                </pre>
              ) : null}
              {s.bullets ? (
                <ul className="check-list project-doc__bullets">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}

          {project.pipeline ? (
            <section className="paper-block">
              <div id="pipeline" data-toc className="anchor" />
              <h2>{project.pipelineTitle ?? "Pipeline"}</h2>
              <Reveal as="ol" className="pipeline" stagger={0.1}>
                {project.pipeline.map((step, k) => (
                  <li key={step.title} className="pipeline__step">
                    <span className="pipeline__n">{String(k + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <ul>
                      <li>{step.detail}</li>
                    </ul>
                  </li>
                ))}
              </Reveal>
            </section>
          ) : null}

          {galleryImages.length ? (
            <section className="paper-block">
              <div id="gallery" data-toc className="anchor" />
              <h2>Gallery</h2>
              <Gallery images={galleryImages} />
            </section>
          ) : null}

          {paper || auv || related.length ? (
            <section className="paper-block">
              <h2>Related</h2>
              <div className="related-links">
                {auv ? (
                  <Link to={`/models/${auv.slug}`} className="chip chip--lg">
                    Vehicle · {auv.name}
                  </Link>
                ) : null}
                {paper ? (
                  <Link to={`/research/${paper.slug}`} className="chip chip--lg">
                    Paper · {paper.title}
                  </Link>
                ) : null}
                {related.map((p) => (
                  <Link key={p.slug} to={`/projects/${p.slug}`} className="chip chip--lg">
                    {p.title.split(" — ")[0]}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <Link to={`/projects/${next.slug}`} className="next-card" data-cursor="NEXT">
            <span className="eyebrow">Next project · {next.category}</span>
            <span className="next-card__title">{next.title}</span>
            <span className="next-card__go" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
