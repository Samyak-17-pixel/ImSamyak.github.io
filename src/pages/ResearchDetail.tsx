import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { paperBySlug, papers } from "@/content/research";
import { sectionById } from "@/content/sections";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { Reveal } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { FlsArc } from "@/components/sensors/FlsArc";
import { setDepthOverride } from "@/lib/scrollStore";
import { scrollToSection } from "@/lib/smoothScroll";
import { DetailHeader } from "./DetailHeader";

export function ResearchDetail() {
  const { slug } = useParams();
  const paper = paperBySlug(slug);
  const [current, setCurrent] = useState("");
  const depth = sectionById("research")?.depthM ?? 150;

  useEffect(() => {
    setDepthOverride(depth);
    return () => setDepthOverride(null);
  }, [depth]);

  const toc = paper
    ? [
        ...paper.sections.map((s) => ({ id: s.id, title: s.title })),
        { id: "pipeline", title: paper.pipelineTitle },
        { id: "contributions", title: "Key contributions" },
        { id: "outcomes", title: paper.outcomesTitle },
      ]
    : [];

  useEffect(() => {
    if (!paper) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setCurrent(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    document.querySelectorAll(".paper-doc [data-toc]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [paper]);

  if (!paper) return <Navigate to="/research" replace />;

  const i = papers.indexOf(paper);
  const next = papers[(i + 1) % papers.length];

  return (
    <article className="detail paper-doc">
      <DetailHeader back="/research" backLabel="Back to the dive" depth={depth} sensor="fls" tag={`Paper ${paper.index}`} />

      <header className="paper-doc__hero">
        <div>
          <span className="eyebrow">Research paper {paper.index}</span>
          <SplitTitle as="h1" text={paper.title} className="paper-doc__title" immediate delay={0.2} />
          <p className="paper-doc__authors">{paper.authors}</p>
          <p className="paper-doc__venue">
            {paper.venue}
            {paper.role ? ` · ${paper.role}` : ""}
          </p>
          <p className="paper-doc__summary">{paper.summary}</p>
          <div className="paper-doc__links">
            {paper.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="paper-doc__link" data-cursor="OPEN">
                {l.label} ↗
              </a>
            ))}
          </div>
          <div className="chip-row">
            {paper.keywords.map((k) => (
              <span key={k} className="chip">
                {k}
              </span>
            ))}
          </div>
        </div>
        <div className="instrument-card paper-doc__fls">
          <FlsArc className="instrument-card__canvas" />
        </div>
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
          {paper.sections.map((s) => (
            <Reveal key={s.id} as="section" className="paper-block" >
              <div id={s.id} data-toc className="anchor" />
              <h2>{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          ))}

          <section className="paper-block">
            <div id="pipeline" data-toc className="anchor" />
            <h2>{paper.pipelineTitle}</h2>
            <Reveal as="ol" className="pipeline" stagger={0.12}>
              {paper.pipeline.map((step, k) => (
                <li key={step.title} className="pipeline__step">
                  <span className="pipeline__n">{String(k + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <ul>
                    {step.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </Reveal>
          </section>

          <section className="paper-block">
            <div id="contributions" data-toc className="anchor" />
            <h2>Key contributions</h2>
            <Reveal className="contrib-grid" stagger={0.08}>
              {paper.contributions.map((c, k) => (
                <GlowCard key={c} className="card contrib-card">
                  <span className="spec-card__n">{String(k + 1).padStart(2, "0")}</span>
                  <p>{c}</p>
                </GlowCard>
              ))}
            </Reveal>
          </section>

          <section className="paper-block">
            <div id="outcomes" data-toc className="anchor" />
            <h2>{paper.outcomesTitle}</h2>
            <Reveal as="ul" className="check-list check-list--lg" stagger={0.06}>
              {paper.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </Reveal>
          </section>

          <Link to={`/research/${next.slug}`} className="next-card" data-cursor="NEXT">
            <span className="eyebrow">Next paper · {next.index}</span>
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
