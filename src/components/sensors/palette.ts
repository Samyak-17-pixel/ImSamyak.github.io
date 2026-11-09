/** Canvas colours (RGB triplets) matching the CSS tokens in styles/tokens.css. */
import { getTheme, onThemeChange } from "@/lib/theme";

/* Canvas colours (RGB triplets) for the academic theme. They are live bindings:
 * the canvases redraw every frame, so they follow the light/dark toggle. */
const PALETTES = {
  light: {
    BIO: "31, 58, 95",
    CYAN: "59, 103, 151",
    AMBER: "154, 91, 30",
    INK: "247, 247, 245",
    TEXT: "26, 29, 33",
    PANEL: "222, 228, 236",
    PANEL_HI: "200, 215, 233",
  },
  dark: {
    BIO: "143, 179, 224",
    CYAN: "169, 195, 227",
    AMBER: "214, 164, 106",
    INK: "18, 20, 23",
    TEXT: "225, 230, 238",
    PANEL: "16, 22, 32",
    PANEL_HI: "38, 56, 80",
  },
};

export let BIO = "";
export let CYAN = "";
export let AMBER = "";
export let INK = "";
export let TEXT = "";
/** Dark (or, in light mode, pale) fills behind instrument graphics. */
export let PANEL = "";
export let PANEL_HI = "";

function apply() {
  const p = PALETTES[getTheme()];
  ({ BIO, CYAN, AMBER, INK, TEXT, PANEL, PANEL_HI } = p);
}
apply();
onThemeChange(apply);

export const rgba = (rgb: string, a: number) => `rgba(${rgb}, ${a})`;

export const MONO = '"JetBrains Mono", ui-monospace, monospace';

/** Copper/amber side-scan colormap, 0..1 → [r, g, b]. */
export function copper(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  return [Math.min(255, 20 + x * 300), Math.min(255, 12 + x * 190), Math.min(255, 6 + x * 90)];
}

/** Steel-blue sonar colormap, 0..1 → [r, g, b]. */
export function sonarTeal(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  return [Math.min(255, 12 + x * x * 200), Math.min(255, 18 + x * 190), Math.min(255, 30 + x * 210)];
}
