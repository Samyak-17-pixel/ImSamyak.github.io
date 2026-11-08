import { useLayoutEffect, useRef } from "react";
import { home } from "@/content/home";
import { contact } from "@/content/contact";
import { UsblFix } from "@/components/sensors/UsblFix";
import { SensorIcon } from "@/components/sensors/SensorIcon";
import { INTRO_ACTIVE } from "@/components/effects/DescentIntro";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/quality";
import { useGoToSection } from "@/lib/navigation";
import { auvs } from "@/content/auvs";

/** Warm the 3D model cache; loaded lazily so three.js stays out of the first page load. */
function preloadFleet() {
  import("@/components/auv/AuvGlbModel").then(({ preloadAuv }) =>
    auvs.forEach((a) => preloadAuv(`${import.meta.env.BASE_URL}${a.model}`))
  );
}

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const go = useGoToSection();
  const [first, ...rest] = home.title.split(" ");
  const identity = home.identityLine.split("·").map((s) => s.trim());

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || env.reducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: INTRO_ACTIVE ? 2.7 : 0.35, defaults: { ease: "expo.out" } });
      tl.from(".hero__badge", { y: 20, opacity: 0, duration: 0.8 })
        .from(".hero__title .split-char", { yPercent: 120, rotate: 8, duration: 1.3, stagger: 0.04 }, "<0.1")
        .from(".hero__subtitle", { y: 24, opacity: 0, duration: 1 }, "<0.5")
        .from(".hero__lead", { y: 24, opacity: 0, duration: 1 }, "<0.1")
        .from(".hero__actions > *", { y: 20, opacity: 0, duration: 0.9, stagger: 0.08 }, "<0.15")
        .from(".hero__ticker", { opacity: 0, duration: 1.2 }, "<0.2")
        .from(".hero__cue", { opacity: 0, y: -10, duration: 1 }, "<0.2");

      // Parallax out as the dive begins
      gsap.to(".hero__inner", {
        yPercent: -18,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const chars = (word: string) =>
    Array.from(word).map((ch, i) => (
      <span key={i} className="split-char">
        {ch}
      </span>
    ));

  return (
    <section id="home" className="hero" ref={root} aria-label="Introduction">
      <UsblFix className="hero__canvas" />
      <div className="hero__inner">
        <p className="hero__badge">
          <span className="hero__badge-icon">
            <SensorIcon id="usbl" size={14} />
          </span>
          {home.badge}
        </p>
        <h1 className="hero__title" aria-label={home.title}>
          <span className="hero__line" aria-hidden>
            {chars(first)}
          </span>
          <span className="hero__line hero__line--outline" aria-hidden>
            {chars(rest.join(" "))}
          </span>
        </h1>
        <p className="hero__subtitle">{home.subtitle}</p>
        <p className="hero__lead">{home.lead}</p>
        <div className="hero__actions">
          <button type="button" className="btn btn-primary" onClick={() => go("about")} data-cursor="DIVE">
            Begin descent
            <span className="btn__arrow" aria-hidden>
              ↓
            </span>
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => go("models")}
            onPointerEnter={preloadFleet}
          >
            Explore the fleet
          </button>
          <a className="btn btn-ghost" href={`${import.meta.env.BASE_URL}${contact.cvFile}`} download>
            Download CV
          </a>
        </div>
      </div>

      <div className="hero__ticker" aria-hidden>
        <div className="hero__ticker-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {identity.map((t) => (
                <span key={t} className="hero__ticker-item">
                  {t}
                  <span className="hero__ticker-sep">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <button type="button" className="hero__cue" onClick={() => go("about")} aria-label="Scroll to dive">
        <span className="hero__cue-line" />
        <span>Scroll to dive</span>
      </button>
    </section>
  );
}
