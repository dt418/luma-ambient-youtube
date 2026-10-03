import { it, expect } from "vitest";
import { extractFrame, adjustColor, smoothColor } from "../src/ambient/colors";
import { normalizeSettings } from "../src/shared/settings";
it("samples each edge independently", () => {
  const p = new Uint8ClampedArray(10 * 10 * 4);
  for (let i = 0; i < 100; i++)
    p.set(i < 10 ? [240, 0, 0, 255] : [0, 40, 200, 255], i * 4);
  const f = extractFrame(p, 10, 10, { x: 0, y: 0, width: 10, height: 10 }, 0);
  expect(f.edges.top[0]).toEqual([240, 0, 0]);
  expect(f.edges.bottom[0]).toEqual([0, 40, 200]);
});
it("caps colors and interpolates instead of jumping", () => {
  const c = adjustColor(
    [255, 255, 255],
    normalizeSettings({ brightness: 1.5, highlightLimit: 0.8 }),
  );
  expect(Math.max(...c)).toBeLessThanOrEqual(204);
  const s = smoothColor([0, 0, 0], [200, 100, 50], 100, 200);
  expect(s[0]).toBeGreaterThan(0);
  expect(s[0]).toBeLessThan(200);
});
