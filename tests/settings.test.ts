import { describe, it, expect } from "vitest";
import { normalizeSettings } from "../src/shared/settings";
import { applyPreset } from "../src/shared/presets";
describe("settings safety", () => {
  it("starts enabled with cinematic auto and all edges", () => {
    expect(normalizeSettings(null)).toMatchObject({
      enabled: true,
      preset: "cinematic",
      performanceMode: "auto",
      renderer: "canvas2d",
      edges: { top: true, right: true, bottom: true, left: true },
    });
  });
  it("normalizes corrupt and out-of-range settings", () => {
    const s = normalizeSettings({
      intensity: 5,
      blur: NaN,
      fpsLimit: 90,
      enabled: "false",
      preset: "invalid",
      secret: "x",
    });
    expect(s.intensity).toBe(1);
    expect(s.blur).toBe(48);
    expect(s.fpsLimit).toBe(30);
    expect(s.enabled).toBe(true);
    expect(s.preset).toBe("cinematic");
    expect(s).not.toHaveProperty("secret");
  });
  it("replaces visuals but preserves user playback preferences", () => {
    const s = applyPreset(
      normalizeSettings({ enabled: false, floatingControl: false }),
      "calm",
    );
    expect(s).toMatchObject({
      enabled: false,
      floatingControl: false,
      intensity: 0.3,
      blur: 80,
      preset: "calm",
    });
  });
});
