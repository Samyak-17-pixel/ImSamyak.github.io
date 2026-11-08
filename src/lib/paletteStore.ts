import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

export function setPaletteOpen(next: boolean) {
  if (open === next) return;
  open = next;
  listeners.forEach((l) => l());
}

export function usePaletteOpen() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open
  );
}
