import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
const KEY = "theme";
const listeners = new Set<() => void>();

function initial(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage blocked */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let theme: Theme = typeof document === "undefined" ? "light" : initial();
if (typeof document !== "undefined") document.documentElement.dataset.theme = theme;

export function getTheme() {
  return theme;
}

export function setTheme(next: Theme) {
  if (next === theme) return;
  theme = next;
  document.documentElement.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#121417" : "#f7f7f5");
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage blocked */
  }
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  setTheme(theme === "dark" ? "light" : "dark");
}

export function onThemeChange(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTheme() {
  return useSyncExternalStore(onThemeChange, getTheme, getTheme);
}
