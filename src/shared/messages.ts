import type { Status } from "./types";
import type { SettingsPatch } from "./storage";
export class StatusSource {
  private listeners = new Set<(status: Status) => void>();
  current: Status = {
    state: "idle",
    quality: "balanced",
    fps: 30,
    accent: [126, 187, 218],
    luminance: 0.2,
  };
  publish(status: Status) {
    this.current = status;
    this.listeners.forEach((fn) => fn(status));
  }
  subscribe(fn: (s: Status) => void) {
    this.listeners.add(fn);
    fn(this.current);
    return () => {
      this.listeners.delete(fn);
    };
  }
  constructor(public retry: () => void = () => {}) {}
}
export type AmbientMessage =
  | { type: "ambient:status" | "ambient:retry" }
  | { type: "ambient:preview"; patch: SettingsPatch };
