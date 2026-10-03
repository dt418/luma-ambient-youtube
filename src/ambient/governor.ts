import type { Quality, Settings } from "../shared/types";
export const QUALITY: Record<Quality, { fps: number; width: number }> = {
  eco: { fps: 12, width: 48 },
  balanced: { fps: 24, width: 96 },
  ultra: { fps: 30, width: 160 },
};
const order: Quality[] = ["eco", "balanced", "ultra"];
export class PerformanceGovernor {
  quality: Quality;
  private start = -1;
  private samples: number[] = [];
  private high = 0;
  private low = 0;
  private changedAt = -Infinity;
  constructor(
    private mode: Settings["performanceMode"] = "auto",
    private ceiling: Quality = "ultra",
  ) {
    this.quality =
      mode === "auto" ? order[Math.min(1, order.indexOf(ceiling))] : mode;
  }
  record(cost: number, now: number): Quality {
    if (this.mode !== "auto") return this.quality;
    if (this.start < 0) this.start = now;
    this.samples.push(cost);
    if (now - this.start < 1000) return this.quality;
    const mean = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    this.samples = [];
    this.start = now;
    this.high = mean > (this.quality === "eco" ? 10 : 6) ? this.high + 1 : 0;
    this.low = mean < 3 ? this.low + 1 : 0;
    if (now - this.changedAt < 10000) return this.quality;
    const index = order.indexOf(this.quality);
    if (this.high >= 3 && index > 0) {
      this.quality = order[index - 1];
      this.changedAt = now;
      this.high = this.low = 0;
    } else if (this.low >= 15 && index < order.indexOf(this.ceiling)) {
      this.quality = order[index + 1];
      this.changedAt = now;
      this.high = this.low = 0;
    }
    return this.quality;
  }
  reset() {
    this.quality =
      this.mode === "auto"
        ? order[Math.min(1, order.indexOf(this.ceiling))]
        : this.mode;
    this.start = -1;
    this.samples = [];
    this.high = this.low = 0;
    this.changedAt = -Infinity;
  }
}
