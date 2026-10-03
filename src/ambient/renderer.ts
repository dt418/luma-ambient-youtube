import type { AmbientFrame, RenderSettings } from "../shared/types";
import { Canvas2DRenderer } from "./canvas-renderer";
export interface AmbientRenderer {
  start(host: HTMLElement, settings: RenderSettings): void;
  render(frame: AmbientFrame): void;
  resize(bounds: DOMRectReadOnly): void;
  pause(): void;
  resume(): void;
  updateSettings(settings: RenderSettings): void;
  destroy(): void;
}
export function createRenderer(_backend: "canvas2d"): AmbientRenderer {
  return new Canvas2DRenderer();
}
