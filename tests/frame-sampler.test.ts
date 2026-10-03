// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { FrameSampler } from "../src/ambient/sampler";
import { normalizeSettings } from "../src/shared/settings";
it("keeps rendering a gradual fade instead of comparing only adjacent samples", () => {
  let level = 0;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage() {},
    getImageData(_x: number, _y: number, w: number, h: number) {
      const p = new Uint8ClampedArray(w * h * 4);
      for (let i = 0; i < p.length; i += 4)
        p.set([level, level, level, 255], i);
      return { data: p };
    },
  } as any);
  const video = document.createElement("video");
  Object.defineProperties(video, {
    readyState: { value: 2 },
    videoWidth: { value: 160 },
    videoHeight: { value: 90 },
  });
  const sampler = new FrameSampler(),
    settings = normalizeSettings({
      brightness: 1,
      saturation: 1,
      blackBarDetection: false,
    });
  let draws = 0,
    painted = 0;
  for (let i = 0; i <= 160; i++) {
    level = i / 2;
    const f = sampler.sample(video, settings, i * 42)!;
    if (f.changed) {
      draws++;
      painted = f.edges.top[0][0];
    }
  }
  expect(draws).toBeGreaterThan(20);
  expect(painted).toBeGreaterThan(75);
  sampler.destroy();
  vi.restoreAllMocks();
});
it("does not read an unready video and surfaces a security error once ready", () => {
  const context = {
    drawImage() {},
    getImageData() {
      throw new DOMException("tainted", "SecurityError");
    },
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as any,
  );
  const video = document.createElement("video"),
    sampler = new FrameSampler();
  expect(sampler.sample(video, normalizeSettings(null), 0)).toBeNull();
  Object.defineProperties(video, {
    readyState: { value: 2 },
    videoWidth: { value: 1920 },
    videoHeight: { value: 1080 },
  });
  expect(() => sampler.sample(video, normalizeSettings(null), 100)).toThrow(
    "tainted",
  );
  sampler.destroy();
  vi.restoreAllMocks();
});
