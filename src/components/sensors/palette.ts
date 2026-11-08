/** Canvas colours (RGB triplets) matching the CSS tokens in styles/tokens.css. */
export const BIO = "94, 242, 214";
export const CYAN = "54, 201, 255";
export const AMBER = "255, 181, 71";
export const INK = "1, 10, 14";
export const TEXT = "214, 245, 240";

export const rgba = (rgb: string, a: number) => `rgba(${rgb}, ${a})`;

export const MONO = '"JetBrains Mono", ui-monospace, monospace';

/** Copper/amber side-scan colormap, 0..1 → [r, g, b]. */
export function copper(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  return [Math.min(255, 20 + x * 300), Math.min(255, 12 + x * 190), Math.min(255, 6 + x * 90)];
}

/** Teal sonar colormap, 0..1 → [r, g, b]. */
export function sonarTeal(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  return [Math.min(255, 4 + x * x * 200), Math.min(255, 18 + x * 230), Math.min(255, 24 + x * 200)];
}
