import { normalizeSettings } from "./settings";
import type { PresetId, Settings } from "./types";
const values: Record<PresetId, number[]> = {
  calm: [0.3, 80, 0.7, 240, 0.85, 0.05, 0.7, 0.65],
  cinematic: [0.55, 64, 1, 220, 1.05, 0.12, 0.85, 0.8],
  vivid: [0.75, 48, 1.3, 180, 1.35, 0.25, 1, 0.9],
};
export function applyPreset(s: Settings, preset: PresetId): Settings {
  const [
    intensity,
    blur,
    spread,
    fadeMs,
    saturation,
    vibrance,
    brightness,
    highlightLimit,
  ] = values[preset];
  return normalizeSettings({
    ...s,
    preset,
    intensity,
    blur,
    spread,
    fadeMs,
    saturation,
    vibrance,
    brightness,
    highlightLimit,
  });
}
