import { EDGES, type AmbientFrame, type RenderSettings } from "../shared/types";
import type { AmbientRenderer } from "./renderer";
export class Canvas2DRenderer implements AmbientRenderer {
  private canvas: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | null = null;
  private host: HTMLElement | undefined;
  private settings: RenderSettings | undefined;
  private settingsKey = "";
  private bounds: DOMRectReadOnly = new DOMRect();
  private paused = false;
  private last: AmbientFrame | undefined;
  start(host: HTMLElement, s: RenderSettings) {
    this.destroy();
    this.host = host;
    this.settings = s;
    const c = document.createElement("canvas");
    c.className = "luma-ambient-canvas";
    c.setAttribute("aria-hidden", "true");
    Object.assign(c.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "0",
      transition: "opacity 220ms ease",
      opacity: "0",
    });
    host.prepend(c);
    this.canvas = c;
    this.ctx = c.getContext("2d");
    this.updateSettings(s);
  }
  updateSettings(s: RenderSettings) {
    const key = JSON.stringify(s);
    if (this.settingsKey === key) return;
    this.settingsKey = key;
    this.settings = s;
    if (this.canvas) {
      this.canvas.style.filter = `blur(${s.blur * 0.75}px)`;
      this.canvas.style.transitionDuration = `${Math.min(s.fadeMs, 240)}ms`;
    }
    if (this.last) this.draw(this.last);
  }
  resize(b: DOMRectReadOnly) {
    this.bounds = b;
    if (!this.canvas) return;
    const box =
      this.host === document.body
        ? { width: innerWidth || b.width, height: innerHeight || b.height }
        : this.host!.getBoundingClientRect();
    const scale = Math.min(
      devicePixelRatio || 1,
      1.5,
      960 / Math.max(1, box.width, box.height),
    );
    this.canvas.width = Math.max(1, Math.round(box.width * scale));
    this.canvas.height = Math.max(1, Math.round(box.height * scale));
    if (this.last) this.draw(this.last);
  }
  render(frame: AmbientFrame) {
    this.last = frame;
    // Playback scheduling pauses separately; explicit seek/settings frames still paint.
    if (frame.changed) this.draw(frame);
  }
  private draw(frame: AmbientFrame) {
    const c = this.canvas,
      ctx = this.ctx,
      s = this.settings;
    if (!c || !ctx || !s) return;
    const origin =
      this.host === document.body
        ? {
            left: 0,
            top: 0,
            width: innerWidth || this.bounds.width,
            height: innerHeight || this.bounds.height,
          }
        : this.host!.getBoundingClientRect();
    const sx = c.width / Math.max(1, origin.width),
      sy = c.height / Math.max(1, origin.height);
    ctx.clearRect(0, 0, c.width, c.height);
    const b = this.bounds;
    const spread =
      130 + Math.min(origin.width, origin.height) * 0.34 * s.spread;
    for (const edge of EDGES) {
      if (!s.edges[edge]) continue;
      const colors = frame.edges[edge];
      colors.forEach((rgb, i) => {
        const fraction = (i + 0.5) / colors.length;
        const x =
          edge === "left"
            ? b.left
            : edge === "right"
              ? b.right
              : b.left + b.width * fraction;
        const y =
          edge === "top"
            ? b.top
            : edge === "bottom"
              ? b.bottom
              : b.top + b.height * fraction;
        const px = (x - origin.left) * sx,
          py = (y - origin.top) * sy,
          radius = spread * Math.max(sx, sy);
        const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
        g.addColorStop(0, `rgba(${rgb.join(", ")}, ${s.intensity * 0.75})`);
        g.addColorStop(0.42, `rgba(${rgb.join(", ")}, ${s.intensity * 0.55})`);
        g.addColorStop(0.78, `rgba(${rgb.join(", ")}, ${s.intensity * 0.18})`);
        g.addColorStop(1, `rgba(${rgb.join(", ")}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
      });
    }
    c.style.opacity = "1";
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
  destroy() {
    this.canvas?.remove();
    this.canvas = undefined;
    this.ctx = null;
    this.last = undefined;
    this.host = undefined;
    this.paused = false;
    this.settingsKey = "";
  }
}
