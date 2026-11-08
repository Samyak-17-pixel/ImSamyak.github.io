import { useSyncExternalStore } from "react";
import { SECTIONS } from "@/content/sections";

/**
 * Maps page scroll to a dive depth. Depth is interpolated between section tops, so each
 * section lands exactly on its zone depth and the depth gauge markers line up.
 */
type ScrollState = {
  depth: number;
  progress: number;
  activeId: string;
  velocity: number;
};

const state: ScrollState = { depth: 0, progress: 0, activeId: "home", velocity: 0 };

let tops: { id: string; top: number; depth: number }[] = [];
let depthOverride: number | null = null;
let lastY = 0;
let lastT = 0;
let settleTimer = 0;

const activeListeners = new Set<() => void>();
const frameListeners = new Set<(s: ScrollState) => void>();

export function getScrollState() {
  return state;
}

function measure() {
  tops = SECTIONS.flatMap((s) => {
    const el = document.getElementById(s.id);
    if (!el) return [];
    return [{ id: s.id, top: el.getBoundingClientRect().top + window.scrollY, depth: s.depthM }];
  });
}

function update() {
  const y = window.scrollY;
  const now = performance.now();
  const dt = Math.max(1, now - lastT);
  state.velocity = state.velocity * 0.8 + ((y - lastY) / dt) * 0.2;
  lastY = y;
  lastT = now;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  state.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

  let activeId = state.activeId;
  if (depthOverride !== null) {
    state.depth = depthOverride;
  } else if (tops.length) {
    const lead = window.innerHeight * 0.4;
    const probe = y + lead;
    let i = 0;
    while (i < tops.length - 1 && tops[i + 1].top <= probe) i++;
    activeId = tops[i].id;
    // Depth eases its probe in from the viewport top, so the surface reads exactly 0 m.
    const depthProbe = y + lead * Math.min(1, y / lead);
    let j = 0;
    while (j < tops.length - 1 && tops[j + 1].top <= depthProbe) j++;
    const a = tops[j];
    const b = tops[j + 1];
    if (b) {
      const f = Math.min(1, Math.max(0, (depthProbe - a.top) / (b.top - a.top)));
      state.depth = a.depth + (b.depth - a.depth) * f;
    } else {
      state.depth = a.depth;
    }
    // Bottom of the page always reads as the deepest zone.
    if (state.progress > 0.995) {
      activeId = tops[tops.length - 1].id;
      state.depth = tops[tops.length - 1].depth;
    }
  }

  // Velocity is only measured on scroll events, so zero it once scrolling settles.
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    state.velocity = 0;
    frameListeners.forEach((l) => l(state));
  }, 140);

  frameListeners.forEach((l) => l(state));
  if (activeId !== state.activeId) {
    state.activeId = activeId;
    activeListeners.forEach((l) => l());
  }
}

/** Start tracking the dive page. Returns a cleanup. */
export function startScrollTracking() {
  depthOverride = null;
  measure();
  update();
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      update();
    });
  };
  const ro = new ResizeObserver(() => {
    measure();
    update();
  });
  ro.observe(document.body);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(raf);
  };
}

/** Detail pages pin the scene to their zone depth. */
export function setDepthOverride(depth: number | null) {
  depthOverride = depth;
  if (depth !== null) state.depth = depth;
  frameListeners.forEach((l) => l(state));
}

export function onScrollFrame(cb: (s: ScrollState) => void) {
  frameListeners.add(cb);
  cb(state);
  return () => {
    frameListeners.delete(cb);
  };
}

function subscribeActive(cb: () => void) {
  activeListeners.add(cb);
  return () => {
    activeListeners.delete(cb);
  };
}

export function useActiveSection() {
  return useSyncExternalStore(subscribeActive, () => state.activeId);
}
