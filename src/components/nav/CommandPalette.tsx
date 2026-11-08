import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SECTIONS, SENSORS } from "@/content/sections";
import { papers } from "@/content/research";
import { auvs } from "@/content/auvs";
import { projectCatalog } from "@/content/projectCatalog";
import { contact } from "@/content/contact";
import { SensorIcon } from "@/components/sensors/SensorIcon";
import type { SensorId } from "@/content/sections";
import { useGoToSection } from "@/lib/navigation";
import { setPaletteOpen, usePaletteOpen } from "@/lib/paletteStore";
import { lockScroll } from "@/lib/smoothScroll";

type Item = {
  id: string;
  group: "Dive to" | "Read" | "Inspect" | "Contact";
  label: string;
  hint: string;
  sensor?: SensorId;
  run: () => void;
};

/** Subsequence match with a bonus for contiguous runs and word starts; -1 when no match. */
function score(query: string, text: string) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let ti = 0;
  let s = 0;
  let run = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    run = found === ti ? run + 1 : 0;
    s += 1 + run * 2 + (found === 0 || t[found - 1] === " " ? 3 : 0);
    ti = found + 1;
  }
  return s - t.length * 0.01;
}

export function CommandPalette() {
  const open = usePaletteOpen();
  const go = useGoToSection();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const list = useRef<HTMLUListElement>(null);
  // Only keyboard moves should scroll the list; mouse hover must not make it jump.
  const keyNav = useRef(false);

  const items = useMemo<Item[]>(() => {
    const cv = `${import.meta.env.BASE_URL}${contact.cvFile}`;
    return [
      ...SECTIONS.map<Item>((s) => ({
        id: `s-${s.id}`,
        group: "Dive to",
        label: s.label,
        hint: `${s.depthM} m · ${s.sensors.map((x) => SENSORS[x].short).join(" + ")}`,
        sensor: s.sensors[0],
        run: () => go(s.id),
      })),
      ...papers.map<Item>((p) => ({
        id: `p-${p.slug}`,
        group: "Read",
        label: p.title,
        hint: `Paper ${p.index}`,
        sensor: "fls",
        run: () => navigate(`/research/${p.slug}`),
      })),
      ...auvs.map<Item>((a) => ({
        id: `a-${a.slug}`,
        group: "Inspect",
        label: `${a.name} — ${a.tagline}`,
        hint: "3D model",
        sensor: "imaging",
        run: () => navigate(`/models/${a.slug}`),
      })),
      ...projectCatalog.map<Item>((p) => ({
        id: `pr-${p.slug}`,
        group: "Read",
        label: p.title,
        hint: `Project · ${p.category}`,
        sensor: "dvl",
        run: () => navigate(`/projects/${p.slug}`),
      })),
      { id: "c-cv", group: "Contact", label: "Download CV (PDF)", hint: "PDF", run: () => window.open(cv, "_blank") },
      { id: "c-mail", group: "Contact", label: "Email Samyak", hint: contact.emailPersonal, sensor: "modem", run: () => (window.location.href = `mailto:${contact.emailPersonal}`) },
      { id: "c-in", group: "Contact", label: "LinkedIn", hint: "Profile", run: () => window.open(contact.linkedin, "_blank", "noopener") },
      { id: "c-gh", group: "Contact", label: "GitHub", hint: contact.githubUser, run: () => window.open(contact.githubUrl, "_blank", "noopener") },
    ];
  }, [go, navigate]);

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((it) => ({
        it,
        // Hints (emails, depths) only count on a literal match, so stray letters don't surface them.
        s: Math.max(score(query, it.label), it.hint.toLowerCase().includes(query.toLowerCase()) ? 1 : -1),
      }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.it);
  }, [items, query]);

  // Global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    lockScroll(open);
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => input.current?.focus());
    } else {
      lastFocus.current?.focus?.();
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  // Keep the highlighted row visible when moving with the arrow keys.
  useEffect(() => {
    if (!keyNav.current) return;
    keyNav.current = false;
    const el = list.current?.querySelector<HTMLElement>(".palette__item.is-active");
    (el?.closest("li") ?? el)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const run = (item: Item | undefined) => {
    if (!item) return;
    setPaletteOpen(false);
    // Let the scroll lock release before scrolling.
    requestAnimationFrame(() => item.run());
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      keyNav.current = true;
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      keyNav.current = true;
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[cursor]);
    } else if (e.key === "Escape") {
      setPaletteOpen(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPaletteOpen(false);
          }}
        >
          <motion.div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Quick jump"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="palette__search">
              <SensorIcon id="usbl" size={18} />
              <input
                ref={input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections, papers, AUVs…"
                aria-label="Search"
                aria-controls="palette-list"
                aria-activedescendant={results[cursor] ? `pal-${results[cursor].id}` : undefined}
                role="combobox"
                aria-expanded="true"
              />
              <kbd>esc</kbd>
            </div>
            <ul ref={list} className="palette__list" id="palette-list" role="listbox" data-lenis-prevent>
              {results.length === 0 ? <li className="palette__empty">No contacts on sonar.</li> : null}
              {results.map((item, i) => {
                const header = item.group !== lastGroup && !query ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.id} role="presentation">
                    {header ? <div className="palette__group">{header}</div> : null}
                    <div
                      id={`pal-${item.id}`}
                      role="option"
                      aria-selected={i === cursor}
                      className={"palette__item" + (i === cursor ? " is-active" : "")}
                      onMouseMove={() => setCursor(i)}
                      onClick={() => run(item)}
                    >
                      <span className="palette__icon">{item.sensor ? <SensorIcon id={item.sensor} size={15} /> : "↗"}</span>
                      <span className="palette__label">{item.label}</span>
                      <span className="palette__hint">{item.hint}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="palette__foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> go
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
