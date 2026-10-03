import { it, expect } from "vitest";
import {
  glassAppearance,
  contrastRatio,
  ambientPalette,
} from "../src/ui/appearance";
it("uses one video hue for glass and page, without near-black surfaces", () => {
  for (const color of [
    [240, 30, 20],
    [20, 80, 240],
  ] as const) {
    const p = ambientPalette(color);
    expect(Math.min(...p.glass)).toBeGreaterThanOrEqual(40);
    const dominant = color[0] > color[2] ? 0 : 2;
    const other = dominant === 0 ? 2 : 0;
    expect(p.glass[dominant]).toBeGreaterThan(p.glass[other]);
    expect(p.surface[dominant]).toBeGreaterThan(p.surface[other]);
    const worst = p.surface.map(
      (v) => v * 0.98 + 255 * 0.02,
    ) as unknown as typeof color;
    expect(contrastRatio([170, 170, 170], worst)).toBeGreaterThanOrEqual(4.5);
  }
});
it.each([
  [255, 255, 255],
  [0, 0, 0],
  [255, 0, 0],
  [0, 0, 255],
  [0, 255, 0],
])("keeps secondary text readable over %j", (...background) => {
  const a = glassAppearance(background as any);
  expect(contrastRatio(a.secondary, a.composited)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(a.foreground, a.composited)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(a.border, a.composited)).toBeGreaterThanOrEqual(3);
});
