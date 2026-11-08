import { useSyncExternalStore } from "react";

/** Lets pages with their own WebGL canvas freeze the background scene. */
let paused = false;
const listeners = new Set<() => void>();

export function setBackgroundPaused(next: boolean) {
  if (paused === next) return;
  paused = next;
  listeners.forEach((l) => l());
}

export function useBackgroundPaused() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => paused
  );
}
