import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { env } from "./quality";

/** Fixed nav height + breathing room, used when landing on a section. */
const SECTION_OFFSET = -72;

let lenis: Lenis | null = null;

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
  if (env.reducedMotion || lenis) return () => {};
  const instance = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
  lenis = instance;
  instance.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    lenis = null;
  };
}

const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

export function scrollToSection(id: string, opts: { immediate?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === "home" ? 0 : SECTION_OFFSET;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  scrollToY(top, opts);
}

export function scrollToY(top: number, { immediate = false }: { immediate?: boolean } = {}) {
  if (lenis) {
    const distance = Math.abs(top - window.scrollY);
    lenis.scrollTo(top, {
      immediate,
      force: true,
      duration: Math.min(2.2, 0.8 + distance / 4000),
      easing: easeInOutQuart,
    });
  } else {
    window.scrollTo({ top, behavior: immediate || env.reducedMotion ? "auto" : "smooth" });
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("scroll-locked", locked);
}
