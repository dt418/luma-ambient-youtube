import type { RGB } from "../shared/types";
export const FOREGROUND: RGB = [245, 247, 250],
  SECONDARY: RGB = [198, 206, 218],
  BORDER: RGB = [170, 181, 195];
export function ambientPalette(accent: RGB, dark = true) {
  const peak = Math.max(1, ...accent);
  const tint = accent.map((v) => Math.max(0, Math.min(1, v / peak)));
  const rgb = (base: number, range: number) =>
    tint.map((v) => Math.round(base + range * v)) as unknown as RGB;
  return {
    glass: rgb(40, 28),
    surface: dark ? rgb(42, 12) : rgb(232, 8),
    backdrop: dark ? rgb(36, 10) : rgb(224, 12),
    highlight: rgb(190, 50),
  };
}
function relative(c: RGB) {
  const s = c.map((v) =>
    v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}
export function contrastRatio(a: RGB, b: RGB) {
  const x = relative(a),
    y = relative(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function glassAppearance(background: RGB) {
  const bright = (background[0] + background[1] + background[2]) / 765;
  const alpha = bright > 0.45 ? 0.95 : 0.92;
  const palette = ambientPalette(background);
  const base = palette.glass;
  return {
    alpha,
    foreground: FOREGROUND,
    secondary: SECONDARY,
    border: BORDER,
    ...palette,
    composited: base.map(
      (v, i) => v * alpha + background[i] * (1 - alpha),
    ) as unknown as RGB,
  };
}
export function applyGlassAppearance(element: HTMLElement, accent: RGB) {
  const a = glassAppearance(accent);
  element.style.setProperty("--luma-surface-rgb", a.glass.join(","));
  element.style.setProperty("--luma-glass-alpha", String(a.alpha));
  element.style.setProperty(
    "--luma-video-accent",
    accent.map(Math.round).join(","),
  );
  element.style.setProperty(
    "--luma-highlight",
    `rgb(${a.highlight.join(",")})`,
  );
}
