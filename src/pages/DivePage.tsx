import { useEffect, useLayoutEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import { sectionById } from "@/content/sections";
import { HeroSection } from "@/sections/HeroSection";
import { AboutSection } from "@/sections/AboutSection";
import { TelemetrySection } from "@/sections/TelemetrySection";
import { FleetSection } from "@/sections/FleetSection";
import { ResearchSection } from "@/sections/ResearchSection";
import { ProjectsSection } from "@/sections/ProjectsSection";
import { ExperienceSection } from "@/sections/ExperienceSection";
import { SkillsSection } from "@/sections/SkillsSection";
import { EducationSection } from "@/sections/EducationSection";
import { ContactSection } from "@/sections/ContactSection";
import { startScrollTracking, useActiveSection } from "@/lib/scrollStore";
import { replaceSectionHash } from "@/lib/navigation";
import { scrollToSection } from "@/lib/smoothScroll";
import { ScrollTrigger } from "@/lib/gsap";

/** The single long-scroll dive. "/<section>" lands directly on that section. */
export function DivePage() {
  const { section } = useParams();
  const known = !section || !!sectionById(section);
  const active = useActiveSection();
  const landed = useRef(false);

  useEffect(() => startScrollTracking(), []);

  // Land on the requested section: jump on first load, glide on later in-app navigations.
  useLayoutEffect(() => {
    if (!known) return;
    const id = section ?? "home";
    const first = !landed.current;
    landed.current = true;
    if (first && id === "home") return;
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      scrollToSection(id, { immediate: first });
    });
    return () => cancelAnimationFrame(frame);
  }, [section, known]);

  // Keep the address bar on the section being read, so links can be shared.
  useEffect(() => {
    if (landed.current) replaceSectionHash(active);
  }, [active]);

  if (!known) return <Navigate to="/" replace />;

  return (
    <div className="dive">
      <HeroSection />
      <AboutSection />
      <TelemetrySection />
      <FleetSection />
      <ResearchSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
    </div>
  );
}
