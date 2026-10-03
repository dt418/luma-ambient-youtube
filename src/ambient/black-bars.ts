import type { CropBounds } from "../shared/types";
export class BlackBarDetector {
  private current: CropBounds | undefined;
  private candidate = "";
  private stable = 0;
  constructor(private sensitivity = 0.5) {}
  reset() {
    this.current = undefined;
    this.candidate = "";
    this.stable = 0;
  }
  detect(p: Uint8ClampedArray, w: number, h: number): CropBounds {
    const full = { x: 0, y: 0, width: w, height: h };
    if (!this.current || this.current.width > w || this.current.height > h)
      this.current = full;
    const lum = (x: number, y: number) => {
      const i = (y * w + x) * 4;
      return 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2];
    };
    let total = 0,
      n = 0;
    for (let y = 0; y < h; y += 3)
      for (let x = 0; x < w; x += 3) {
        total += lum(x, y);
        n++;
      }
    // A dark scene is not proof that the entire video is a black bar.
    if (total / Math.max(1, n) < 12) return { ...this.current };
    const threshold = 3 + this.sensitivity * 12;
    const darkRow = (y: number) => {
      let sum = 0,
        max = 0;
      for (let x = 0; x < w; x += 2) {
        const v = lum(x, y);
        sum += v;
        max = Math.max(max, v);
      }
      return sum / Math.ceil(w / 2) < threshold && max < threshold * 2;
    };
    const darkCol = (x: number) => {
      let sum = 0,
        max = 0;
      for (let y = 0; y < h; y += 2) {
        const v = lum(x, y);
        sum += v;
        max = Math.max(max, v);
      }
      return sum / Math.ceil(h / 2) < threshold && max < threshold * 2;
    };
    let top = 0,
      bottom = 0,
      left = 0,
      right = 0;
    while (top < Math.floor(h * 0.25) && darkRow(top)) top++;
    while (bottom < Math.floor(h * 0.25) && darkRow(h - 1 - bottom)) bottom++;
    while (left < Math.floor(w * 0.25) && darkCol(left)) left++;
    while (right < Math.floor(w * 0.25) && darkCol(w - 1 - right)) right++;
    const crop = {
      x: left,
      y: top,
      width: w - left - right,
      height: h - top - bottom,
    };
    const key = JSON.stringify(crop);
    if (key === this.candidate) this.stable++;
    else {
      this.candidate = key;
      this.stable = 1;
    }
    if (this.stable >= 5) this.current = crop;
    return { ...this.current };
  }
}
