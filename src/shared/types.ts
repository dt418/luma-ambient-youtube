export type RGB = readonly [number, number, number];
export type Edge = "top" | "right" | "bottom" | "left";
export type Quality = "eco" | "balanced" | "ultra";
export type PresetId = "calm" | "cinematic" | "vivid";
export interface Settings {
  schemaVersion: 1;
  enabled: boolean;
  preset: PresetId | "custom";
  intensity: number;
  blur: number;
  spread: number;
  fadeMs: number;
  saturation: number;
  vibrance: number;
  brightness: number;
  highlightLimit: number;
  edges: Record<Edge, boolean>;
  blackBarDetection: boolean;
  blackBarSensitivity: number;
  performanceMode: "auto" | Quality;
  performanceCeiling: Quality;
  fpsLimit: number;
  sampleWidth: number;
  floatingControl: boolean;
  reducedMotion: "system" | "on";
  renderer: "canvas2d";
}
export interface Status {
  state: "idle" | "playing" | "paused" | "disabled" | "error";
  quality: Quality;
  fps: number;
  accent: RGB;
  luminance: number;
  error?: "frame" | "storage" | "reload";
}
export interface AmbientFrame {
  timestamp: number;
  edges: Record<Edge, RGB[]>;
  luminance: number;
  accent: RGB;
  changed: boolean;
}
export interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
export type RenderSettings = Settings & { effectiveQuality: Quality };
export const EDGES: Edge[] = ["top", "right", "bottom", "left"];
