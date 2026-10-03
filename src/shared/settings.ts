import type { Settings } from "./types";
export const DEFAULTS: Settings = {
  schemaVersion: 1,
  enabled: true,
  preset: "cinematic",
  intensity: 0.55,
  blur: 48,
  spread: 1,
  fadeMs: 220,
  saturation: 1.05,
  vibrance: 0.12,
  brightness: 0.85,
  highlightLimit: 0.8,
  edges: { top: true, right: true, bottom: true, left: true },
  blackBarDetection: true,
  blackBarSensitivity: 0.5,
  performanceMode: "auto",
  performanceCeiling: "ultra",
  sampleWidth: 160,
  floatingControl: true,
  reducedMotion: "system",
  renderer: "canvas2d",
};
const bounds: Record<string, [number, number]> = {
  intensity: [0, 1],
  blur: [0, 120],
  spread: [0, 2],
  fadeMs: [0, 1000],
  saturation: [0, 2],
  vibrance: [0, 1],
  brightness: [0, 1.5],
  highlightLimit: [0.3, 1],
  blackBarSensitivity: [0, 1],
  sampleWidth: [32, 192],
};
const choices: Record<string, string[]> = {
  preset: ["calm", "cinematic", "vivid", "custom"],
  performanceMode: ["auto", "eco", "balanced", "ultra"],
  performanceCeiling: ["eco", "balanced", "ultra"],
  reducedMotion: ["system", "on"],
  renderer: ["canvas2d"],
};
export function normalizeSettings(input: unknown): Settings {
  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const result: Record<string, unknown> = {
    ...DEFAULTS,
    edges: { ...DEFAULTS.edges },
  };
  for (const [key, def] of Object.entries(DEFAULTS)) {
    const v = raw[key];
    if (bounds[key] && typeof v === "number" && Number.isFinite(v)) {
      result[key] = Math.min(bounds[key][1], Math.max(bounds[key][0], v));
    } else if (typeof def === "boolean" && typeof v === "boolean")
      result[key] = v;
    else if (choices[key]?.includes(v as string)) result[key] = v;
  }
  if (raw.edges && typeof raw.edges === "object")
    for (const e of ["top", "right", "bottom", "left"]) {
      const v = (raw.edges as Record<string, unknown>)[e];
      if (typeof v === "boolean")
        (result.edges as Record<string, boolean>)[e] = v;
    }
  return result as unknown as Settings;
}
