/** Device capability snapshot, taken once at startup. Drives particle counts, DPR caps and motion. */
export type QualityTier = "high" | "low" | "minimal";

type Env = {
  tier: QualityTier;
  reducedMotion: boolean;
  coarsePointer: boolean;
};

function detect(): Env {
  if (typeof window === "undefined") return { tier: "high", reducedMotion: false, coarsePointer: false };
  const mq = (q: string) => window.matchMedia?.(q).matches ?? false;
  const reducedMotion = mq("(prefers-reduced-motion: reduce)");
  const coarsePointer = mq("(pointer: coarse)");
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const small = window.innerWidth < 760;
  const tier: QualityTier = reducedMotion
    ? "minimal"
    : coarsePointer || small || cores <= 4 || memory <= 4
      ? "low"
      : "high";
  return { tier, reducedMotion, coarsePointer };
}

export const env = detect();

/** Scale a count by the current tier (high = 1, low ≈ 0.35, minimal ≈ 0.2). */
export function byTier(n: number) {
  const k = env.tier === "high" ? 1 : env.tier === "low" ? 0.35 : 0.2;
  return Math.max(1, Math.round(n * k));
}

export function maxDpr() {
  if (typeof window === "undefined") return 1;
  const cap = env.tier === "high" ? 2 : 1.5;
  return Math.min(window.devicePixelRatio || 1, cap);
}
