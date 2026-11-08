import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SECTIONS } from "@/content/sections";
import { isDivePath, sectionPath, useGoToSection } from "@/lib/navigation";
import { setPaletteOpen } from "@/lib/paletteStore";
import { lockScroll } from "@/lib/smoothScroll";
import { useActiveSection } from "@/lib/scrollStore";

const links = SECTIONS.filter((s) => s.inNav);
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export function Nav() {
  const { pathname } = useLocation();
  const onDive = isDivePath(pathname);
  const active = useActiveSection();
  const go = useGoToSection();
  const [compact, setCompact] = useState(false);
  const [drawer, setDrawer] = useState(false);

  // Detail pages highlight their parent section.
  const current = onDive ? active : pathname.startsWith("/research") ? "research" : pathname.startsWith("/models") ? "models" : "";

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(drawer);
  }, [drawer]);

  const onLink = (id: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setDrawer(false);
    go(id);
  };

  return (
    <header className={"nav-shell" + (compact ? " is-compact" : "")}>
      <motion.div
        className="nav-inner"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <Link to="/" className="nav-brand" onClick={onLink("home")} aria-label="Samyak Kumar — back to surface">
          <span className="nav-brand-mark" aria-hidden />
          <span className="nav-brand-text">
            Samyak<span className="nav-brand-light">Kumar</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Sections">
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`#${sectionPath(id)}`}
              onClick={onLink(id)}
              className={"nav-link" + (current === id ? " nav-link--active" : "")}
              aria-current={current === id ? "true" : undefined}
            >
              {current === id ? <motion.span layoutId="nav-pill" className="nav-link__pill" /> : null}
              <span className="nav-link__text">{label}</span>
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button type="button" className="nav-cmd" onClick={() => setPaletteOpen(true)} aria-label="Open quick jump">
            <span className="nav-cmd__label">Jump to</span>
            <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd>K</kbd>
          </button>
          <button
            type="button"
            className={"nav-burger" + (drawer ? " is-open" : "")}
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            onClick={() => setDrawer((d) => !d)}
          >
            <span />
            <span />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {drawer ? (
          <motion.nav
            className="nav-drawer"
            aria-label="Sections"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <ol>
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                >
                  <a href={`#${sectionPath(s.id)}`} onClick={onLink(s.id)} className={current === s.id ? "is-active" : ""}>
                    <span className="nav-drawer__depth">{s.depthM} m</span>
                    <span className="nav-drawer__label">{s.label}</span>
                  </a>
                </motion.li>
              ))}
            </ol>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
