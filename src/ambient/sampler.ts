import { BlackBarDetector } from "./black-bars";
import { extractFrame, adjustColor, smoothColor } from "./colors";
import { EDGES, type AmbientFrame, type Settings } from "../shared/types";
export class FrameSampler {
  private canvas = document.createElement("canvas");
  private ctx = this.canvas.getContext("2d", { willReadFrequently: true });
  private detector = new BlackBarDetector();
  private last: AmbientFrame | undefined;
  private emitted: AmbientFrame | undefined;
  private sampleWidth = 96;
  private sensitivity = 0.5;
  setSampleWidth(w: number) {
    this.sampleWidth = Math.round(w);
  }
  reset() {
    this.last = undefined;
    this.emitted = undefined;
    this.detector.reset();
  }
  sample(
    video: HTMLVideoElement,
    s: Settings,
    time: number,
  ): AmbientFrame | null {
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight)
      return null;
    if (!this.ctx) throw new Error("Canvas unavailable");
    const w = this.sampleWidth,
      h = Math.max(1, Math.round((w * video.videoHeight) / video.videoWidth));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.detector.reset();
    }
    if (this.sensitivity !== s.blackBarSensitivity) {
      this.sensitivity = s.blackBarSensitivity;
      this.detector = new BlackBarDetector(this.sensitivity);
    }
    this.ctx.drawImage(video, 0, 0, w, h);
    const pixels = this.ctx.getImageData(0, 0, w, h).data;
    const crop = s.blackBarDetection
      ? this.detector.detect(pixels, w, h)
      : { x: 0, y: 0, width: w, height: h };
    const frame = extractFrame(pixels, w, h, crop, time);
    let delta = 0;
    for (const e of EDGES)
      frame.edges[e] = frame.edges[e].map((c, i) => {
        const color = adjustColor(c, s);
        const old = this.last?.edges[e][i];
        if (old) {
          const next = smoothColor(
            old,
            color,
            time - (this.last?.timestamp ?? time),
            s.fadeMs,
          );
          const painted = this.emitted?.edges[e][i] ?? old;
          delta += next.reduce(
            (sum, v, k) => sum + Math.abs(v - painted[k]),
            0,
          );
          return next;
        }
        return color;
      });
    frame.changed = !this.emitted || delta / (24 * 3) >= 1;
    if (frame.changed) this.emitted = frame;
    this.last = frame;
    return frame;
  }
  destroy() {
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.reset();
  }
}
