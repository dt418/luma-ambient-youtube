// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { Canvas2DRenderer } from "../src/ambient/canvas-renderer";
import { normalizeSettings } from "../src/shared/settings";
it("paints an explicit changed frame while the recurring playback is paused", () => {
  let painted = "";
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
    createRadialGradient() {
      return {
        addColorStop(n: number, c: string) {
          if (n === 0) painted = c;
        },
      };
    },
    fillRect() {},
  } as any);
  const r = new Canvas2DRenderer();
  r.start(document.body, {
    ...normalizeSettings(null),
    effectiveQuality: "balanced",
  });
  r.resize(new DOMRect(0, 0, 600, 340));
  const frame = {
    timestamp: 0,
    edges: { top: [[200, 0, 0] as const], right: [], bottom: [], left: [] },
    accent: [200, 0, 0] as const,
    luminance: 0.2,
    changed: true,
  };
  r.render(frame);
  r.pause();
  r.render({
    ...frame,
    edges: { ...frame.edges, top: [[0, 0, 200] as const] },
  });
  expect(painted).toContain("0, 0, 200");
  r.destroy();
  vi.restoreAllMocks();
});
it("does not redraw a static frame when effective settings are unchanged", () => {
  let paints = 0;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {
      paints++;
    },
    createRadialGradient() {
      return { addColorStop() {} };
    },
    fillRect() {},
  } as any);
  const r = new Canvas2DRenderer();
  const s = {
    ...normalizeSettings(null),
    effectiveQuality: "balanced" as const,
  };
  r.start(document.body, s);
  r.resize(new DOMRect(0, 0, 640, 360));
  const f = {
    timestamp: 0,
    edges: { top: [[20, 30, 40] as const], right: [], bottom: [], left: [] },
    accent: [20, 30, 40] as const,
    luminance: 0.1,
    changed: true,
  };
  r.render(f);
  const before = paints;
  r.updateSettings({ ...s });
  r.render({ ...f, changed: false });
  expect(paints).toBe(before);
  r.destroy();
  vi.restoreAllMocks();
});
it("owns exactly one noninteractive canvas and cleans it up idempotently", () => {
  const colors: string[] = [];
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
    createRadialGradient() {
      return {
        addColorStop(_: number, c: string) {
          colors.push(c);
        },
      };
    },
    fillRect() {},
  } as any);
  const r = new Canvas2DRenderer();
  const host = document.createElement("div");
  document.body.append(host);
  const s = {
    ...normalizeSettings(null),
    effectiveQuality: "balanced" as const,
  };
  r.start(host, s);
  r.resize(new DOMRect(100, 100, 640, 360));
  r.resize(new DOMRect(0, 0, 800, 400));
  expect(host.querySelectorAll("canvas").length).toBe(1);
  expect(host.querySelector("canvas")?.style.pointerEvents).toBe("none");
  r.updateSettings({
    ...s,
    edges: { top: false, right: false, bottom: true, left: false },
  });
  r.render({
    timestamp: 0,
    edges: {
      top: [[255, 0, 0]],
      right: [[0, 255, 0]],
      bottom: [[0, 0, 200]],
      left: [[255, 255, 0]],
    },
    accent: [0, 0, 200],
    luminance: 0.1,
    changed: true,
  });
  expect(colors.join(" ")).not.toContain("255, 0, 0");
  expect(colors.join(" ")).toContain("0, 0, 200");
  r.destroy();
  r.destroy();
  expect(host.querySelector("canvas")).toBeNull();
  host.remove();
  vi.restoreAllMocks();
});
