"use strict";
(() => {
  // raw-css:C:\Users\Thanh\Documents\Codex\2026-10-03\ha\outputs\github-pages\luma-ambient-youtube\src\content\page-surfaces.css
  var page_surfaces_default = `html.luma-active,
html.luma-active body {
  background: var(--luma-page-backdrop) !important;
}
html.luma-active ytd-app {
  --yt-spec-base-background: var(--luma-surface);
  --yt-spec-raised-background: var(--luma-surface);
  --yt-spec-menu-background: var(--luma-surface);
  background: transparent !important;
  position: relative;
  z-index: 1;
}
/* Keep YouTube's own menus and confirmation dialogs above the ambient page layer. */
html.luma-active ytd-popup-container {
  z-index: 2147483003 !important;
}
html.luma-active ytd-popup-container,
html.luma-active ytd-popup-container ytd-multi-page-menu-renderer,
html.luma-active ytd-popup-container ytd-notification-menu-renderer,
html.luma-active ytd-popup-container ytd-menu-popup-renderer {
  --yt-spec-base-background: var(--luma-surface);
  --yt-spec-raised-background: var(--luma-surface);
  --yt-spec-menu-background: var(--luma-surface);
  --yt-spec-10-percent-layer: rgba(var(--luma-surface-rgb, 56, 64, 68), 0.3);
  --paper-dialog-background-color: var(--luma-surface);
}
html.luma-active ytd-watch-flexy {
  background: transparent !important;
}
html.luma-active #cinematics {
  visibility: hidden !important;
}
html.luma-active #primary #below,
html.luma-active #secondary-inner,
html.luma-active #masthead-container,
html.luma-active #guide-content,
html.luma-active #playlist #items,
html.luma-active #playlist .header,
html.luma-active #playlist ytd-playlist-panel-video-renderer[selected],
html.luma-active #playlist #header-contents,
html.luma-active
  ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]
  #content,
html.luma-active
  ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]
  ytd-engagement-panel-title-header-renderer
  #header,
html.luma-active .ytSearchboxComponentInputBoxDark,
html.luma-active .ytSearchboxComponentSearchButtonDark,
html.luma-active
  ytd-popup-container
  tp-yt-iron-dropdown[opened]
  #contentWrapper,
html.luma-active ytd-popup-container ytd-multi-page-menu-renderer,
html.luma-active ytd-popup-container ytd-multi-page-menu-renderer #container,
html.luma-active ytd-popup-container ytd-notification-menu-renderer,
html.luma-active ytd-popup-container ytd-notification-menu-renderer #items,
html.luma-active ytd-popup-container ytd-menu-popup-renderer,
html.luma-active ytd-popup-container tp-yt-paper-dialog {
  background: var(--luma-surface) !important;
  backdrop-filter: blur(var(--luma-surface-blur, 18px));
  -webkit-backdrop-filter: blur(var(--luma-surface-blur, 18px));
  border-color: rgba(var(--luma-video-accent, 126, 187, 218), 0.32) !important;
  transition:
    background-color 180ms ease,
    backdrop-filter 180ms ease;
}
html.luma-active #guide-content,
html.luma-active #playlist #items,
html.luma-active #playlist .header,
html.luma-active #playlist ytd-playlist-panel-video-renderer[selected],
html.luma-active
  ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]
  #content,
html.luma-active
  ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]
  ytd-engagement-panel-title-header-renderer
  #header,
html.luma-active .ytSearchboxComponentInputBoxDark {
  background: rgba(var(--luma-surface-rgb, 56, 64, 68), 0.5) !important;
}
html.luma-active #playlist .header #header-contents {
  background: transparent !important;
}
html.luma-active #playlist ytd-playlist-panel-video-renderer[selected] {
  box-shadow: inset 3px 0 0 rgba(var(--luma-video-accent, 126, 187, 218), 0.8);
}
html.luma-active #primary #below {
  border-radius: 16px;
  margin-top: 12px;
  padding: 16px;
  box-sizing: border-box;
}
html.luma-active #secondary-inner {
  border-radius: 18px;
  padding: 12px;
  box-sizing: border-box;
}
html.luma-active ytd-watch-metadata #description.item {
  border-radius: 12px;
  box-sizing: border-box;
  background-color: rgba(var(--luma-surface-rgb, 56, 64, 68), 0.32) !important;
  transition:
    background-color 180ms ease,
    backdrop-filter 180ms ease;
}
html.luma-active ytd-watch-metadata #description.item:hover,
html.luma-active ytd-watch-metadata #description.item:focus-within {
  background-color: rgba(var(--luma-surface-rgb, 56, 64, 68), 0.5) !important;
  backdrop-filter: blur(var(--luma-surface-blur, 18px));
  -webkit-backdrop-filter: blur(var(--luma-surface-blur, 18px));
}
.luma-fullscreen .html5-video-container,
.luma-fullscreen .ytp-chrome-bottom,
.luma-fullscreen .ytp-chrome-top,
.luma-fullscreen .ytp-caption-window-container {
  z-index: 2 !important;
}
.luma-fullscreen {
  background: transparent !important;
}
`;

  // src/shared/settings.ts
  var DEFAULTS = {
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
    fpsLimit: 30,
    sampleWidth: 160,
    floatingControl: true,
    reducedMotion: "system",
    renderer: "canvas2d"
  };
  var bounds = {
    intensity: [0, 1],
    blur: [0, 120],
    spread: [0, 2],
    fadeMs: [0, 1e3],
    saturation: [0, 2],
    vibrance: [0, 1],
    brightness: [0, 1.5],
    highlightLimit: [0.3, 1],
    blackBarSensitivity: [0, 1],
    fpsLimit: [1, 30],
    sampleWidth: [32, 192]
  };
  var choices = {
    preset: ["calm", "cinematic", "vivid", "custom"],
    performanceMode: ["auto", "eco", "balanced", "ultra"],
    performanceCeiling: ["eco", "balanced", "ultra"],
    reducedMotion: ["system", "on"],
    renderer: ["canvas2d"]
  };
  function normalizeSettings(input) {
    const raw = input && typeof input === "object" ? input : {};
    const result = {
      ...DEFAULTS,
      edges: { ...DEFAULTS.edges }
    };
    for (const [key, def] of Object.entries(DEFAULTS)) {
      const v = raw[key];
      if (bounds[key] && typeof v === "number" && Number.isFinite(v)) {
        result[key] = Math.min(bounds[key][1], Math.max(bounds[key][0], v));
      } else if (typeof def === "boolean" && typeof v === "boolean")
        result[key] = v;
      else if (choices[key]?.includes(v)) result[key] = v;
    }
    if (raw.edges && typeof raw.edges === "object")
      for (const e of ["top", "right", "bottom", "left"]) {
        const v = raw.edges[e];
        if (typeof v === "boolean")
          result.edges[e] = v;
      }
    return result;
  }

  // src/shared/messages.ts
  var StatusSource = class {
    constructor(retry = () => {
    }) {
      this.retry = retry;
    }
    listeners = /* @__PURE__ */ new Set();
    current = {
      state: "idle",
      quality: "balanced",
      fps: 30,
      accent: [126, 187, 218],
      luminance: 0.2
    };
    publish(status) {
      this.current = status;
      this.listeners.forEach((fn) => fn(status));
    }
    subscribe(fn) {
      this.listeners.add(fn);
      fn(this.current);
      return () => {
        this.listeners.delete(fn);
      };
    }
  };

  // src/shared/types.ts
  var EDGES = ["top", "right", "bottom", "left"];

  // src/ambient/canvas-renderer.ts
  var Canvas2DRenderer = class {
    canvas;
    ctx = null;
    host;
    settings;
    settingsKey = "";
    bounds = new DOMRect();
    paused = false;
    last;
    start(host, s) {
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
        opacity: "0"
      });
      host.prepend(c);
      this.canvas = c;
      this.ctx = c.getContext("2d");
      this.updateSettings(s);
    }
    updateSettings(s) {
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
    resize(b) {
      this.bounds = b;
      if (!this.canvas) return;
      const box = this.host === document.body ? { width: innerWidth || b.width, height: innerHeight || b.height } : this.host.getBoundingClientRect();
      const scale = Math.min(
        devicePixelRatio || 1,
        1.5,
        960 / Math.max(1, box.width, box.height)
      );
      this.canvas.width = Math.max(1, Math.round(box.width * scale));
      this.canvas.height = Math.max(1, Math.round(box.height * scale));
      if (this.last) this.draw(this.last);
    }
    render(frame) {
      this.last = frame;
      if (frame.changed) this.draw(frame);
    }
    draw(frame) {
      const c = this.canvas, ctx = this.ctx, s = this.settings;
      if (!c || !ctx || !s) return;
      const origin = this.host === document.body ? {
        left: 0,
        top: 0,
        width: innerWidth || this.bounds.width,
        height: innerHeight || this.bounds.height
      } : this.host.getBoundingClientRect();
      const sx = c.width / Math.max(1, origin.width), sy = c.height / Math.max(1, origin.height);
      ctx.clearRect(0, 0, c.width, c.height);
      const b = this.bounds;
      const spread = 100 + Math.min(origin.width, origin.height) * 0.24 * s.spread;
      for (const edge of EDGES) {
        if (!s.edges[edge]) continue;
        const colors = frame.edges[edge];
        colors.forEach((rgb, i) => {
          const fraction = (i + 0.5) / colors.length;
          const x = edge === "left" ? b.left : edge === "right" ? b.right : b.left + b.width * fraction;
          const y = edge === "top" ? b.top : edge === "bottom" ? b.bottom : b.top + b.height * fraction;
          const px = (x - origin.left) * sx, py = (y - origin.top) * sy, radius = spread * Math.max(sx, sy);
          const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
          g.addColorStop(0, `rgba(${rgb.join(", ")}, ${s.intensity * 0.65})`);
          g.addColorStop(0.42, `rgba(${rgb.join(", ")}, ${s.intensity * 0.4})`);
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
      this.canvas = void 0;
      this.ctx = null;
      this.last = void 0;
      this.host = void 0;
      this.paused = false;
      this.settingsKey = "";
    }
  };

  // src/ambient/renderer.ts
  function createRenderer(_backend) {
    return new Canvas2DRenderer();
  }

  // src/ambient/black-bars.ts
  var BlackBarDetector = class {
    constructor(sensitivity = 0.5) {
      this.sensitivity = sensitivity;
    }
    current;
    candidate = "";
    stable = 0;
    reset() {
      this.current = void 0;
      this.candidate = "";
      this.stable = 0;
    }
    detect(p, w, h) {
      const full = { x: 0, y: 0, width: w, height: h };
      if (!this.current || this.current.width > w || this.current.height > h)
        this.current = full;
      const lum = (x, y) => {
        const i = (y * w + x) * 4;
        return 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2];
      };
      let total = 0, n = 0;
      for (let y = 0; y < h; y += 3)
        for (let x = 0; x < w; x += 3) {
          total += lum(x, y);
          n++;
        }
      if (total / Math.max(1, n) < 12) return { ...this.current };
      const threshold = 3 + this.sensitivity * 12;
      const darkRow = (y) => {
        let sum = 0, max = 0;
        for (let x = 0; x < w; x += 2) {
          const v = lum(x, y);
          sum += v;
          max = Math.max(max, v);
        }
        return sum / Math.ceil(w / 2) < threshold && max < threshold * 2;
      };
      const darkCol = (x) => {
        let sum = 0, max = 0;
        for (let y = 0; y < h; y += 2) {
          const v = lum(x, y);
          sum += v;
          max = Math.max(max, v);
        }
        return sum / Math.ceil(h / 2) < threshold && max < threshold * 2;
      };
      let top = 0, bottom = 0, left = 0, right = 0;
      while (top < Math.floor(h * 0.25) && darkRow(top)) top++;
      while (bottom < Math.floor(h * 0.25) && darkRow(h - 1 - bottom)) bottom++;
      while (left < Math.floor(w * 0.25) && darkCol(left)) left++;
      while (right < Math.floor(w * 0.25) && darkCol(w - 1 - right)) right++;
      const crop = {
        x: left,
        y: top,
        width: w - left - right,
        height: h - top - bottom
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
  };

  // src/ambient/colors.ts
  function luminance(c) {
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
  }
  function adjustColor(c, s) {
    const mean = (c[0] + c[1] + c[2]) / 3;
    const sat = s.saturation + s.vibrance * (1 - (Math.max(...c) - Math.min(...c)) / 255);
    return c.map(
      (v) => Math.min(
        255 * s.highlightLimit,
        Math.max(0, (mean + (v - mean) * sat) * s.brightness)
      )
    );
  }
  function smoothColor(a, b, delta, fade) {
    const mix = fade === 0 ? 1 : 1 - Math.exp(-Math.max(0, delta) / fade);
    return a.map((v, i) => v + (b[i] - v) * mix);
  }
  function extractFrame(p, w, h, c, timestamp) {
    const sample = (x0, y0, x1, y1) => {
      const sums = [0, 0, 0];
      let n = 0;
      for (let y = Math.max(0, Math.floor(y0)); y < Math.min(h, Math.max(Math.floor(y0) + 1, Math.ceil(y1))); y++)
        for (let x = Math.max(0, Math.floor(x0)); x < Math.min(w, Math.max(Math.floor(x0) + 1, Math.ceil(x1))); x++) {
          const i = (y * w + x) * 4;
          for (let k = 0; k < 3; k++) sums[k] += p[i + k];
          n++;
        }
      return sums.map((v) => Math.round(v / Math.max(1, n)));
    };
    const edges = {};
    for (const e of EDGES) {
      edges[e] = [];
      for (let i = 0; i < 6; i++) {
        const a = i / 6, b = (i + 1) / 6;
        let box;
        if (e === "top")
          box = [
            c.x + c.width * a,
            c.y,
            c.x + c.width * b,
            c.y + Math.max(1, c.height * 0.08)
          ];
        else if (e === "bottom")
          box = [
            c.x + c.width * a,
            c.y + c.height - Math.max(1, c.height * 0.08),
            c.x + c.width * b,
            c.y + c.height
          ];
        else if (e === "left")
          box = [
            c.x,
            c.y + c.height * a,
            c.x + Math.max(1, c.width * 0.08),
            c.y + c.height * b
          ];
        else
          box = [
            c.x + c.width - Math.max(1, c.width * 0.08),
            c.y + c.height * a,
            c.x + c.width,
            c.y + c.height * b
          ];
        edges[e].push(sample(box[0], box[1], box[2], box[3]));
      }
    }
    const list = EDGES.flatMap((e) => edges[e]);
    const accent = [0, 1, 2].map(
      (k) => list.reduce((s, c2) => s + c2[k], 0) / list.length
    );
    return {
      timestamp,
      edges,
      luminance: luminance(accent),
      accent,
      changed: true
    };
  }

  // src/ambient/sampler.ts
  var FrameSampler = class {
    canvas = document.createElement("canvas");
    ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    detector = new BlackBarDetector();
    last;
    emitted;
    sampleWidth = 96;
    sensitivity = 0.5;
    setSampleWidth(w) {
      this.sampleWidth = Math.round(w);
    }
    reset() {
      this.last = void 0;
      this.emitted = void 0;
      this.detector.reset();
    }
    sample(video, s, time) {
      if (video.readyState < 2 || !video.videoWidth || !video.videoHeight)
        return null;
      if (!this.ctx) throw new Error("Canvas unavailable");
      const w = this.sampleWidth, h = Math.max(1, Math.round(w * video.videoHeight / video.videoWidth));
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
      const crop = s.blackBarDetection ? this.detector.detect(pixels, w, h) : { x: 0, y: 0, width: w, height: h };
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
              s.fadeMs
            );
            const painted = this.emitted?.edges[e][i] ?? old;
            delta += next.reduce(
              (sum, v, k) => sum + Math.abs(v - painted[k]),
              0
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
  };

  // src/ui/appearance.ts
  var FOREGROUND = [245, 247, 250];
  var SECONDARY = [198, 206, 218];
  var BORDER = [170, 181, 195];
  function ambientPalette(accent, dark = true) {
    const peak = Math.max(1, ...accent);
    const tint = accent.map((v) => Math.max(0, Math.min(1, v / peak)));
    const rgb = (base, range) => tint.map((v) => Math.round(base + range * v));
    return {
      glass: rgb(40, 28),
      surface: dark ? rgb(42, 12) : rgb(232, 8),
      backdrop: dark ? rgb(36, 10) : rgb(224, 12),
      highlight: rgb(190, 50)
    };
  }
  function glassAppearance(background) {
    const bright = (background[0] + background[1] + background[2]) / 765;
    const alpha = bright > 0.45 ? 0.95 : 0.92;
    const palette = ambientPalette(background);
    const base = palette.glass;
    return {
      alpha,
      foreground: FOREGROUND,
      secondary: SECONDARY,
      border: BORDER,
      ...palette,
      composited: base.map(
        (v, i) => v * alpha + background[i] * (1 - alpha)
      )
    };
  }
  function applyGlassAppearance(element, accent) {
    const a = glassAppearance(accent);
    element.style.setProperty("--luma-surface-rgb", a.glass.join(","));
    element.style.setProperty("--luma-glass-alpha", String(a.alpha));
    element.style.setProperty(
      "--luma-video-accent",
      accent.map(Math.round).join(",")
    );
    element.style.setProperty(
      "--luma-highlight",
      `rgb(${a.highlight.join(",")})`
    );
  }

  // src/ambient/scheduler.ts
  var Scheduler = class {
    video;
    callback;
    pending;
    running = false;
    fps = 24;
    last = -Infinity;
    mediaTime = -1;
    setFps(fps) {
      const next = Math.max(1, Math.min(30, fps));
      if (next === this.fps) return;
      this.fps = next;
      if (this.pending !== void 0) {
        clearTimeout(this.pending);
        this.pending = void 0;
        this.queue();
      }
    }
    start(video, onFrame) {
      this.destroy();
      this.video = video;
      this.callback = onFrame;
      this.resume();
    }
    queue() {
      if (!this.running || this.pending !== void 0) return;
      this.pending = window.setTimeout(
        () => this.frame(performance.now()),
        1e3 / this.fps
      );
    }
    frame = (time) => {
      this.pending = void 0;
      if (!this.running) return;
      const media = this.video?.currentTime ?? 0;
      if (time - this.last >= 1e3 / this.fps - 0.1 && media !== this.mediaTime) {
        this.last = time;
        this.mediaTime = media;
        this.callback?.(time);
      }
      this.queue();
    };
    pause() {
      this.running = false;
      if (this.pending !== void 0) clearTimeout(this.pending);
      this.pending = void 0;
    }
    resume() {
      if (!this.video) return;
      this.running = true;
      this.queue();
    }
    destroy() {
      this.pause();
      this.video = void 0;
      this.callback = void 0;
      this.last = -Infinity;
      this.mediaTime = -1;
    }
  };

  // src/ambient/governor.ts
  var QUALITY = {
    eco: { fps: 12, width: 48 },
    balanced: { fps: 24, width: 96 },
    ultra: { fps: 30, width: 160 }
  };
  var order = ["eco", "balanced", "ultra"];
  var PerformanceGovernor = class {
    constructor(mode = "auto", ceiling = "ultra") {
      this.mode = mode;
      this.ceiling = ceiling;
      this.quality = mode === "auto" ? order[Math.min(1, order.indexOf(ceiling))] : mode;
    }
    quality;
    start = -1;
    samples = [];
    high = 0;
    low = 0;
    changedAt = -Infinity;
    record(cost, now) {
      if (this.mode !== "auto") return this.quality;
      if (this.start < 0) this.start = now;
      this.samples.push(cost);
      if (now - this.start < 1e3) return this.quality;
      const mean = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
      this.samples = [];
      this.start = now;
      this.high = mean > (this.quality === "eco" ? 10 : 6) ? this.high + 1 : 0;
      this.low = mean < 3 ? this.low + 1 : 0;
      if (now - this.changedAt < 1e4) return this.quality;
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
      this.quality = this.mode === "auto" ? order[Math.min(1, order.indexOf(this.ceiling))] : this.mode;
      this.start = -1;
      this.samples = [];
      this.high = this.low = 0;
      this.changedAt = -Infinity;
    }
  };

  // src/content/youtube-adapter.ts
  function findPlayer(doc) {
    const main = doc.querySelector(
      "#movie_player video.html5-main-video"
    ) ?? doc.querySelector("#movie_player video");
    const video = main ?? Array.from(
      doc.querySelectorAll("ytd-watch-flexy video")
    ).find((v) => v.getBoundingClientRect().width > 0);
    const host = video?.closest("#movie_player") ?? video?.parentElement;
    return video && host ? { video, host } : null;
  }

  // src/content/controller.ts
  var ContentController = class {
    constructor(store, onBinding = () => {
    }) {
      this.store = store;
      this.onBinding = onBinding;
    }
    status = new StatusSource(() => this.retry());
    settings = normalizeSettings(null);
    sampler;
    renderer;
    scheduler = new Scheduler();
    governor = new PerformanceGovernor();
    video;
    host;
    renderHost;
    lifetime;
    binding;
    observer;
    resize;
    intersection;
    off = () => {
    };
    timer;
    visible = true;
    failed = false;
    destroyed = false;
    lastStatus = 0;
    surfaceKey = "";
    onBinding;
    async start() {
      this.settings = await this.store.get();
      if (this.destroyed) return;
      this.lifetime = new AbortController();
      const signal = this.lifetime.signal;
      this.off = this.store.subscribe((s) => {
        const prev = this.settings;
        this.settings = s;
        if (prev.performanceMode !== s.performanceMode || prev.performanceCeiling !== s.performanceCeiling)
          this.governor = new PerformanceGovernor(
            s.performanceMode,
            s.performanceCeiling
          );
        this.reconcile();
        this.configure();
        const colorKeys = [
          "saturation",
          "vibrance",
          "brightness",
          "highlightLimit",
          "blackBarDetection",
          "blackBarSensitivity",
          "reducedMotion"
        ];
        if (colorKeys.some((k) => prev[k] !== s[k])) {
          this.sampler?.reset();
          this.sampleOnce(performance.now(), true);
        }
      });
      for (const ev of ["yt-navigate-finish", "popstate", "fullscreenchange"])
        window.addEventListener(ev, () => this.reconcile(), { signal });
      document.addEventListener("visibilitychange", () => this.syncPlayback(), {
        signal
      });
      window.addEventListener("scroll", () => this.position(), {
        signal,
        passive: true
      });
      this.observer = new MutationObserver((records) => {
        const relevant = "video,#movie_player,ytd-watch-flexy";
        if (!records.some(
          (r) => Array.from(r.addedNodes).concat(Array.from(r.removedNodes)).some(
            (n) => n instanceof Element && !n.closest("[data-luma-root]") && (n.matches(relevant) || n.querySelector(relevant))
          )
        ))
          return;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.reconcile(), 150);
      });
      this.observer.observe(document.querySelector("ytd-app") ?? document.body, {
        childList: true,
        subtree: true
      });
      this.reconcile();
    }
    reconcile() {
      if (location.pathname !== "/watch") {
        this.detach();
        this.status.publish({ ...this.status.current, state: "idle" });
        return;
      }
      const target = findPlayer(document);
      if (!target) {
        this.detach();
        this.status.publish({ ...this.status.current, state: "idle" });
        return;
      }
      const fullscreen = document.fullscreenElement;
      const canvasHost = fullscreen ?? document.body;
      if (target.video !== this.video || canvasHost !== this.renderHost) {
        this.detach();
        this.video = target.video;
        this.host = target.host;
        this.renderHost = canvasHost;
        this.failed = false;
        this.visible = true;
        this.sampler = new FrameSampler();
        this.governor = new PerformanceGovernor(
          this.settings.performanceMode,
          this.settings.performanceCeiling
        );
        this.binding = new AbortController();
        const signal = this.binding.signal;
        for (const ev of [
          "play",
          "pause",
          "ended",
          "loadeddata",
          "seeked",
          "emptied"
        ])
          this.video.addEventListener(
            ev,
            () => {
              if (ev === "emptied") {
                this.scheduler.destroy();
                this.removeRenderer();
                this.sampler?.destroy();
                this.sampler = new FrameSampler();
                this.failed = false;
              }
              if (ev === "loadeddata") this.reconcile();
              if (ev === "loadeddata" || ev === "seeked") {
                this.sampler?.reset();
                this.sampleOnce(performance.now(), true);
              }
              this.syncPlayback();
            },
            { signal }
          );
        this.resize = new ResizeObserver(() => this.position());
        this.resize.observe(this.host);
        this.intersection = new IntersectionObserver((entries) => {
          this.visible = entries.some((e) => e.isIntersecting);
          this.syncPlayback();
        });
        this.intersection.observe(this.host);
        this.onBinding(this.host);
      }
      if (!this.settings.enabled) {
        this.removeRenderer();
        this.scheduler.pause();
        this.status.publish({ ...this.status.current, state: "disabled" });
        return;
      }
      if (!this.renderer && !this.failed) {
        this.renderer = createRenderer("canvas2d");
        this.renderer.start(this.renderHost, {
          ...this.settings,
          effectiveQuality: this.governor.quality
        });
        this.renderHost?.classList.toggle(
          "luma-fullscreen",
          this.renderHost !== document.body
        );
        document.documentElement.classList.add("luma-active");
        this.updateSurface();
        this.configure();
        this.position();
        this.scheduler.start(this.video, (t) => this.sampleOnce(t));
        this.sampleOnce(performance.now());
      }
      this.syncPlayback();
    }
    updateSurface() {
      const dark = document.documentElement.hasAttribute("dark");
      const palette = ambientPalette(this.status.current.accent, dark);
      const key = JSON.stringify([palette, this.settings.blur]);
      if (key === this.surfaceKey) return;
      this.surfaceKey = key;
      document.documentElement.style.setProperty(
        "--luma-surface-rgb",
        palette.surface.join(",")
      );
      document.documentElement.style.setProperty(
        "--luma-video-accent",
        this.status.current.accent.map(Math.round).join(",")
      );
      document.documentElement.style.setProperty(
        "--luma-surface",
        `rgba(${palette.surface.join(",")},.5)`
      );
      document.documentElement.style.setProperty(
        "--luma-page-backdrop",
        `rgb(${palette.backdrop.join(",")})`
      );
      document.documentElement.style.setProperty(
        "--luma-surface-blur",
        `${this.settings.blur * 0.25}px`
      );
    }
    effectiveSettings() {
      const reduced = this.settings.reducedMotion === "on" || typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      return { ...this.settings, fadeMs: reduced ? 0 : this.settings.fadeMs };
    }
    configure() {
      const q = QUALITY[this.governor.quality];
      this.sampler?.setSampleWidth(Math.min(q.width, this.settings.sampleWidth));
      this.scheduler.setFps(this.targetFps());
      this.renderer?.updateSettings({
        ...this.effectiveSettings(),
        effectiveQuality: this.governor.quality
      });
      if (this.renderer) this.updateSurface();
    }
    targetFps() {
      const qualityFps = this.settings.performanceMode === "auto" ? 30 : QUALITY[this.governor.quality].fps;
      return Math.min(qualityFps, this.settings.fpsLimit, 30);
    }
    sampleOnce(t, instant = false) {
      if (!this.video || !this.sampler || !this.renderer || this.failed || !this.settings.enabled || document.hidden || !this.visible)
        return;
      try {
        if (typeof chrome !== "undefined" && chrome.runtime && !chrome.runtime.id) {
          this.destroy();
          return;
        }
        const start = performance.now();
        const effective = this.effectiveSettings();
        const frame = this.sampler.sample(
          this.video,
          instant ? { ...effective, fadeMs: 0 } : effective,
          t
        );
        if (frame) this.renderer.render(frame);
        const quality = this.governor.record(performance.now() - start, t);
        this.configure();
        if (frame && (instant || t - this.lastStatus > 750)) {
          this.lastStatus = t;
          this.status.publish({
            state: this.video.paused ? "paused" : "playing",
            quality,
            fps: this.targetFps(),
            accent: frame.accent,
            luminance: frame.luminance
          });
          this.updateSurface();
        }
      } catch {
        this.failed = true;
        this.scheduler.pause();
        this.removeRenderer();
        this.status.publish({
          ...this.status.current,
          state: "error",
          error: "frame"
        });
      }
    }
    syncPlayback() {
      if (!this.video) return;
      const active = this.settings.enabled && !this.failed && !this.video.paused && !this.video.ended && !document.hidden && this.visible;
      if (active) {
        this.renderer?.resume();
        this.scheduler.resume();
      } else {
        this.scheduler.pause();
        this.renderer?.pause();
      }
      if (!this.failed)
        this.status.publish({
          ...this.status.current,
          state: !this.settings.enabled ? "disabled" : active ? "playing" : "paused",
          quality: this.governor.quality
        });
    }
    position() {
      if (this.renderer) this.updateSurface();
      if (this.video) this.renderer?.resize(this.video.getBoundingClientRect());
    }
    removeRenderer() {
      this.surfaceKey = "";
      this.renderer?.destroy();
      this.renderer = void 0;
      document.documentElement.classList.remove("luma-active");
      document.documentElement.style.removeProperty("--luma-surface");
      document.documentElement.style.removeProperty("--luma-surface-rgb");
      document.documentElement.style.removeProperty("--luma-video-accent");
      document.documentElement.style.removeProperty("--luma-page-backdrop");
      document.documentElement.style.removeProperty("--luma-surface-blur");
      this.renderHost?.classList.remove("luma-fullscreen");
    }
    detach() {
      this.scheduler.destroy();
      this.removeRenderer();
      this.binding?.abort();
      this.resize?.disconnect();
      this.intersection?.disconnect();
      this.sampler?.destroy();
      this.sampler = void 0;
      this.video = void 0;
      this.host = void 0;
      this.renderHost = void 0;
      this.onBinding(null);
    }
    retry() {
      this.failed = false;
      this.detach();
      this.reconcile();
    }
    destroy() {
      this.destroyed = true;
      if (this.timer) clearTimeout(this.timer);
      this.observer?.disconnect();
      this.lifetime?.abort();
      this.off();
      this.detach();
    }
  };

  // src/shared/storage.ts
  function merge(a, b) {
    return {
      ...a,
      ...b,
      edges: { ...a.edges ?? {}, ...b.edges ?? {} }
    };
  }
  var PREFIX = "ambient.v1.";
  function chromeBackend() {
    return {
      read: () => chrome.storage.local.get(null),
      write: (values2) => chrome.storage.local.set(values2),
      listen(fn) {
        const cb = (changes, area) => {
          if (area === "local")
            fn(
              Object.fromEntries(
                Object.entries(changes).map(([k, c]) => [k, c.newValue])
              )
            );
        };
        chrome.storage.onChanged.addListener(cb);
        return () => {
          try {
            chrome.storage.onChanged.removeListener(cb);
          } catch {
          }
        };
      }
    };
  }
  var SettingsStore = class {
    constructor(backend = chromeBackend()) {
      this.backend = backend;
      this.off = backend.listen((changes) => {
        const patch = this.decode(changes);
        if (Object.keys(patch).length) {
          if (!this.loaded) this.pending = merge(this.pending, patch);
          const next = normalizeSettings(merge(this.state, patch));
          if (JSON.stringify(next) !== JSON.stringify(this.state)) {
            this.state = next;
            this.emit();
          }
        }
      });
    }
    state = normalizeSettings(null);
    ready;
    loaded = false;
    pending = {};
    subscribers = /* @__PURE__ */ new Set();
    writeQueue = Promise.resolve();
    off;
    decode(values2) {
      const decoded = Object.fromEntries(
        Object.entries(values2).filter(([k]) => k.startsWith(PREFIX)).map(([k, v]) => [k.slice(PREFIX.length), v])
      );
      const edges = { ...decoded.edges ?? {} };
      for (const edge of EDGES) {
        if (`edges.${edge}` in decoded) edges[edge] = decoded[`edges.${edge}`];
        delete decoded[`edges.${edge}`];
      }
      if (Object.keys(edges).length) decoded.edges = edges;
      return decoded;
    }
    emit() {
      for (const cb of this.subscribers) cb(normalizeSettings(this.state));
    }
    async get() {
      if (!this.ready)
        this.ready = this.backend.read().then((v) => {
          this.state = normalizeSettings(merge(this.decode(v), this.pending));
          this.loaded = true;
          this.pending = {};
        }).catch((e) => {
          this.ready = void 0;
          throw e;
        });
      await this.ready;
      return normalizeSettings(this.state);
    }
    async patch(patch) {
      await this.get();
      const previous = normalizeSettings(this.state);
      const next = normalizeSettings(merge(this.state, patch));
      if (JSON.stringify(next) !== JSON.stringify(this.state)) {
        this.state = next;
        this.emit();
      }
      const values2 = Object.fromEntries(
        Object.keys(patch).filter((k) => k in DEFAULTS && k !== "edges").map((k) => [PREFIX + k, next[k]])
      );
      for (const edge of EDGES)
        if (patch.edges && edge in patch.edges)
          values2[PREFIX + "edges." + edge] = next.edges[edge];
      const write = this.writeQueue.catch(() => {
      }).then(() => this.backend.write(values2));
      this.writeQueue = write;
      try {
        await write;
      } catch (error) {
        if (JSON.stringify(this.state) === JSON.stringify(next)) {
          this.state = previous;
          this.emit();
        }
        throw error;
      }
    }
    preview(patch) {
      if (!this.loaded) this.pending = merge(this.pending, patch);
      const next = normalizeSettings(merge(this.state, patch));
      if (JSON.stringify(next) === JSON.stringify(this.state)) return;
      this.state = next;
      this.emit();
    }
    async reset() {
      await this.patch(normalizeSettings(null));
    }
    subscribe(fn) {
      this.subscribers.add(fn);
      void this.get().then(fn).catch(() => {
      });
      return () => {
        this.subscribers.delete(fn);
      };
    }
    destroy() {
      this.off();
      this.subscribers.clear();
    }
  };

  // raw-css:C:\Users\Thanh\Documents\Codex\2026-10-03\ha\outputs\github-pages\luma-ambient-youtube\src\ui\glass.css
  var glass_default = ':host {\n  all: initial;\n  color-scheme: dark;\n}\n.luma-panel,\n.luma-float {\n  --luma-text: #f5f7fa;\n  --luma-muted: #c6ceda;\n  --luma-border: #aab5c3;\n  --luma-accent: var(--luma-highlight, #c6e0ec);\n  font-family: "Aptos", "Segoe UI", sans-serif;\n  font-size: 14px;\n  line-height: 1.5;\n  color: var(--luma-text);\n  color-scheme: dark;\n  box-sizing: border-box;\n}\n.luma-panel *,\n.luma-float * {\n  box-sizing: border-box;\n}\n.luma-panel {\n  width: 360px;\n  max-width: 100%;\n  max-height: calc(100vh - 16px);\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(198, 206, 218, 0.6) transparent;\n  padding: 24px 22px 18px;\n  border: 1px solid rgba(222, 237, 255, 0.38);\n  border-radius: 26px;\n  background:\n    linear-gradient(155deg, rgba(215, 237, 255, 0.055), transparent 40%),\n    rgba(var(--luma-surface-rgb, 56, 64, 68), var(--luma-glass-alpha, 0.92));\n  backdrop-filter: blur(var(--luma-glass-blur, 18px)) saturate(120%);\n  -webkit-backdrop-filter: blur(var(--luma-glass-blur, 18px)) saturate(120%);\n  box-shadow:\n    0 22px 70px #0007,\n    inset 0 1px 0 #fff3;\n  position: relative;\n  isolation: isolate;\n}\n.luma-panel::before {\n  content: "";\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 24px;\n  right: 50px;\n  height: 1px;\n  background: linear-gradient(90deg, transparent, #f0fcffbd, transparent);\n}\n.luma-panel button,\n.luma-panel select,\n.luma-float button {\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n}\n.luma-panel button,\n.luma-float button {\n  border: 0;\n  background: none;\n}\n.luma-panel button:focus-visible,\n.luma-panel input:focus-visible,\n.luma-panel select:focus-visible,\n.luma-panel summary:focus-visible,\n.luma-float button:focus-visible {\n  outline: 2px solid #b6edf4;\n  outline-offset: 4px;\n}\n.luma-brand-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 22px;\n}\n.luma-brand {\n  font-family: Georgia, serif;\n  font-size: 31px;\n  line-height: 1;\n  letter-spacing: -1.8px;\n  color: #f5f7fa;\n  font-style: italic;\n}\n.luma-brand-row small {\n  letter-spacing: 2.2px;\n  font-size: 10px;\n  color: var(--luma-muted);\n  text-transform: uppercase;\n  padding-top: 6px;\n  display: block;\n}\n.luma-version {\n  font-size: 11px;\n  letter-spacing: 1px;\n  color: var(--luma-muted);\n}\n.luma-switch-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n}\n.luma-switch-row strong {\n  font-size: 16px;\n  font-weight: 600;\n  display: block;\n  letter-spacing: -0.25px;\n}\n.luma-caption {\n  font-size: 12px;\n  color: var(--luma-muted);\n  margin: 3px 0 0;\n}\n.luma-switch {\n  position: relative;\n  display: inline-flex;\n  flex-shrink: 0;\n  width: 48px;\n  height: 28px;\n}\n.luma-switch input {\n  appearance: none;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 20px;\n  background: rgba(var(--luma-surface-rgb, 56, 64, 68), 1);\n  border: 1px solid var(--luma-border);\n  cursor: pointer;\n  transition: background 180ms;\n}\n.luma-switch input:checked {\n  background: var(--luma-accent);\n  border-color: var(--luma-accent);\n}\n.luma-switch input::after {\n  content: "";\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: #f5f7fa;\n  box-shadow: 0 1px 5px #0006;\n  transition: transform 180ms;\n}\n.luma-switch input:checked::after {\n  transform: translateX(20px);\n  background: #13212a;\n}\n.luma-scene {\n  position: relative;\n  height: 110px;\n  margin: 22px 0 16px;\n  overflow: hidden;\n  border-radius: 16px;\n  background:\n    radial-gradient(\n      ellipse at 22% 60%,\n      rgba(var(--luma-video-accent, 81, 164, 192), 0.65),\n      transparent 66%\n    ),\n    radial-gradient(\n      ellipse at 86% 60%,\n      rgba(var(--luma-video-accent, 81, 164, 192), 0.35),\n      transparent 65%\n    ),\n    rgb(var(--luma-surface-rgb, 56, 64, 68));\n  display: grid;\n  place-items: center;\n}\n.luma-screen {\n  width: 123px;\n  height: 69px;\n  border-radius: 5px;\n  background: linear-gradient(\n    140deg,\n    rgba(var(--luma-video-accent, 81, 164, 192), 0.35),\n    rgb(var(--luma-surface-rgb, 56, 64, 68)) 40%,\n    rgba(var(--luma-video-accent, 81, 164, 192), 0.45) 65%,\n    rgba(var(--luma-video-accent, 81, 164, 192), 0.7)\n  );\n  box-shadow:\n    0 0 26px rgba(var(--luma-video-accent, 81, 164, 192), 0.55),\n    0 8px 16px #0009;\n  display: grid;\n  place-items: center;\n  border: 1px solid #b0d4e54d;\n}\n.luma-screen svg {\n  width: 20px;\n  height: 20px;\n  fill: #f5f7fa;\n}\n.luma-scene-label {\n  position: absolute;\n  bottom: 7px;\n  left: 12px;\n  font-size: 10px;\n  letter-spacing: 1.5px;\n  color: #e0e8ef;\n  text-transform: uppercase;\n}\n.luma-badge {\n  position: absolute;\n  right: 10px;\n  top: 9px;\n  color: #f5f7fa;\n  background: rgba(var(--luma-surface-rgb, 56, 64, 68), 0.92);\n  padding: 3px 7px;\n  border-radius: 5px;\n  font-size: 10px;\n  letter-spacing: 0.6px;\n}\n.luma-label {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 12px;\n  color: var(--luma-muted);\n  margin-bottom: 9px;\n}\n.luma-label output {\n  font-variant-numeric: tabular-nums;\n  color: var(--luma-text);\n}\n.luma-presets {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 5px;\n  padding: 4px;\n  border-radius: 14px;\n  background: rgba(var(--luma-surface-rgb, 56, 64, 68), 0.92);\n  border: 1px solid #607186;\n}\n.luma-presets button {\n  font-size: 12px;\n  padding: 9px 4px;\n  border-radius: 10px;\n  color: #d5dde7;\n  transition:\n    background 180ms,\n    color 180ms;\n}\n.luma-presets button[aria-pressed="true"] {\n  background: var(--luma-accent);\n  color: #10222c;\n  box-shadow: 0 2px 7px #0003;\n  font-weight: 600;\n}\n.luma-presets button:hover:not([aria-pressed="true"]) {\n  background: #ffffff14;\n}\n.luma-intensity {\n  margin-top: 20px;\n}\n.luma-panel input[type="range"] {\n  appearance: none;\n  width: 100%;\n  height: 5px;\n  display: block;\n  margin: 15px 0;\n  border-radius: 5px;\n  background: #728293;\n  accent-color: #b6edf4;\n  cursor: pointer;\n}\n.luma-panel input[type="range"]::-webkit-slider-thumb {\n  appearance: none;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: var(--luma-accent);\n  border: 3px solid rgb(var(--luma-surface-rgb, 56, 64, 68));\n  box-shadow: 0 0 0 1px var(--luma-accent);\n}\n.luma-range-extents {\n  display: flex;\n  justify-content: space-between;\n  color: var(--luma-muted);\n  font-size: 11px;\n  margin-top: -3px;\n}\n.luma-auto {\n  width: 100%;\n  margin-top: 20px !important;\n  padding: 11px !important;\n  border: 1px solid var(--luma-border) !important;\n  border-radius: 12px;\n  font-size: 13px !important;\n  text-align: center;\n  background: #b6edf40a !important;\n  transition: background 180ms;\n}\n.luma-auto:hover {\n  background: #b6edf41a !important;\n}\n.luma-auto span {\n  margin-right: 6px;\n  color: #b6edf4;\n}\n.luma-note {\n  margin: 7px 0 18px;\n  font-size: 11px;\n  color: var(--luma-muted);\n  text-align: center;\n}\n.luma-advanced {\n  border-top: 1px solid #ffffff30;\n  padding-top: 14px;\n}\n.luma-panel summary {\n  cursor: pointer;\n  font-weight: 600;\n  list-style: none;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 30px;\n}\n.luma-panel summary::after {\n  content: "+";\n  color: #c6ceda;\n  font-size: 20px;\n  font-weight: 400;\n}\n.luma-panel details[open] > summary::after {\n  content: "\u2212";\n}\n.luma-pro-group {\n  margin: 17px 0 22px;\n}\n.luma-pro-group h3 {\n  font-size: 10px;\n  text-transform: uppercase;\n  letter-spacing: 1.7px;\n  margin: 0 0 14px;\n  color: var(--luma-accent);\n}\n.luma-field {\n  margin: 13px 0 17px;\n}\n.luma-field p {\n  font-size: 11px;\n  color: var(--luma-muted);\n  margin: 4px 0;\n}\n.luma-field input[type="range"] {\n  margin: 10px 0;\n}\n.luma-check {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin: 10px 0;\n  font-size: 13px;\n  cursor: pointer;\n}\n.luma-check input {\n  width: 16px;\n  height: 16px;\n  accent-color: #b6edf4;\n}\n.luma-directions {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 6px;\n}\n.luma-directions .luma-check {\n  margin: 0;\n  padding: 7px;\n  border: 1px solid #627184;\n  border-radius: 8px;\n  font-size: 12px;\n}\n.luma-panel select {\n  display: block;\n  width: 100%;\n  background: rgb(var(--luma-surface-rgb, 56, 64, 68));\n  border: 1px solid #728293;\n  border-radius: 10px;\n  padding: 9px;\n  font-size: 12px;\n}\n.luma-footer {\n  display: flex;\n  justify-content: space-between;\n  border-top: 1px solid #ffffff30;\n  padding-top: 14px;\n  margin-top: 14px;\n}\n.luma-footer button {\n  font-size: 11px !important;\n  color: var(--luma-muted) !important;\n  padding: 3px 0 !important;\n}\n.luma-footer button:hover {\n  color: #fff !important;\n}\n.luma-privacy {\n  font-size: 11px;\n  color: var(--luma-muted);\n  margin-top: 10px;\n}\n.luma-message {\n  font-size: 12px;\n  color: #f6dca4;\n  margin: 12px 0 4px;\n}\n.luma-retry {\n  border: 1px solid #c6ceda !important;\n  border-radius: 8px;\n  padding: 5px 10px !important;\n  font-size: 12px !important;\n}\n.luma-panel [hidden] {\n  display: none !important;\n}\n.luma-float {\n  display: flex;\n  gap: 2px;\n  align-items: center;\n  padding: 4px;\n  border: 1px solid #d0e2ef73;\n  border-radius: 24px;\n  background: rgba(var(--luma-surface-rgb, 56, 64, 68), 0.98);\n  backdrop-filter: blur(var(--luma-glass-blur, 18px));\n  -webkit-backdrop-filter: blur(var(--luma-glass-blur, 18px));\n  box-shadow:\n    inset 0 1px 0 #fff3,\n    0 6px 22px #0005;\n  opacity: 0.94;\n  transition: opacity 180ms;\n  pointer-events: auto;\n}\n.luma-float:hover,\n.luma-float:focus-within {\n  opacity: 1;\n}\n.luma-float button {\n  min-height: 32px;\n  min-width: 32px;\n  padding: 4px 10px;\n  border-radius: 18px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: #f5f7fa;\n}\n.luma-float button:hover {\n  background: #ffffff14;\n}\n.luma-float svg {\n  width: 16px;\n  height: 16px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 1.6;\n}\n.luma-indicator {\n  width: 5px;\n  height: 5px;\n  background: #b6edf4;\n  border-radius: 50%;\n}\n.luma-float [aria-pressed="false"] .luma-indicator {\n  background: #8994a3;\n}\n.luma-popover {\n  position: fixed;\n  z-index: 2147483001;\n  max-height: calc(100vh - 28px);\n  overflow-y: auto;\n  border-radius: 26px;\n  overscroll-behavior: contain;\n  pointer-events: auto;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(198, 206, 218, 0.6) transparent;\n}\n.luma-popover .luma-panel {\n  box-shadow: none;\n  max-height: none;\n  overflow: visible;\n}\n@supports not (backdrop-filter: blur(1px)) {\n  .luma-panel,\n  .luma-float {\n    background: rgb(var(--luma-surface-rgb, 56, 64, 68));\n  }\n}\n@media (prefers-contrast: more) {\n  .luma-panel,\n  .luma-float {\n    background: rgb(var(--luma-surface-rgb, 56, 64, 68));\n    border-color: #c6ceda;\n  }\n  .luma-caption {\n    color: #e1e6ef;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .luma-panel *,\n  .luma-float {\n    transition: none !important;\n    animation: none !important;\n  }\n}\n.luma-panel[data-reduced-motion="true"] *,\n.luma-float[data-reduced-motion="true"] {\n  transition: none !important;\n  animation: none !important;\n}\n.luma-player-controls {\n  display: grid;\n  grid-template-columns: repeat(2, 48px);\n  align-items: center;\n  width: 96px;\n  height: 48px;\n  pointer-events: auto;\n}\n.luma-ytp-button {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: #fff;\n  cursor: pointer;\n}\n.luma-ytp-button:hover,\n.luma-ytp-button:focus-visible {\n  background: #ffffff1f;\n}\n.luma-ytp-button[aria-pressed="false"] {\n  color: #b7bbc3;\n}\n.luma-ytp-button svg {\n  display: block;\n  width: 22px;\n  height: 22px;\n  fill: currentColor;\n  stroke: currentColor;\n  stroke-width: 1.5;\n}\n';

  // src/shared/presets.ts
  var values = {
    calm: [0.3, 80, 0.7, 240, 0.85, 0.05, 0.7, 0.65],
    cinematic: [0.55, 64, 1, 220, 1.05, 0.12, 0.85, 0.8],
    vivid: [0.75, 48, 1.3, 180, 1.35, 0.25, 1, 0.9]
  };
  function applyPreset(s, preset) {
    const [
      intensity,
      blur,
      spread,
      fadeMs,
      saturation,
      vibrance,
      brightness,
      highlightLimit
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
      highlightLimit
    });
  }

  // src/ui/panel.ts
  function mountPanel(root, store, statusSource, previewSettings) {
    let state = normalizeSettings(null);
    const style = document.createElement("style");
    style.textContent = glass_default;
    const panel = document.createElement("section");
    panel.className = "luma-panel";
    panel.setAttribute("aria-label", "Luma \xB7 Thi\u1EBFt l\u1EADp \xE1nh s\xE1ng");
    const range = (key, label, desc, min, max, step) => `<div class="luma-field"><label class="luma-label" for="luma-${key}">${label}<output data-output="${key}"></output></label><input id="luma-${key}" type="range" data-setting="${key}" min="${min}" max="${max}" step="${step}" aria-describedby="luma-help-${key}"><p id="luma-help-${key}">${desc}</p></div>`;
    const check = (key, label) => `<label class="luma-check">${label}<input type="checkbox" data-setting="${key}"></label>`;
    panel.innerHTML = `<header class="luma-brand-row"><div><div class="luma-brand">Luma</div><small>\xC1nh s\xE1ng theo c\u1EA3m x\xFAc</small></div><span class="luma-version">01 / AMBIENT</span></header>
    <div class="luma-switch-row"><div><strong data-enabled-text>Ambient \u0111ang b\u1EADt</strong><p class="luma-caption" data-status-text>Theo m\xE0u video \xB7 T\u1EF1 \u0111\u1ED9ng</p></div><label class="luma-switch"><input type="checkbox" data-setting="enabled" aria-label="B\u1EADt \xE1nh s\xE1ng ambient"></label></div>
    <div class="luma-scene" aria-hidden="true"><div class="luma-screen"><svg viewBox="0 0 24 24"><path d="M8 5v14l12-7z"/></svg></div><span class="luma-scene-label">Kh\xF4ng gian c\u1EE7a b\u1EA1n</span><span class="luma-badge" data-quality>Balanced</span></div>
    ${range("blur", "\u0110\u1ED9 blur", "M\xE0u t\u1EF1 \u0111\u1ED3ng b\u1ED9 v\u1EDBi video. Ch\u1EC9 c\u1EA7n ch\u1ECDn \u0111\u1ED9 m\u1EC1m b\u1EA1n th\xEDch.", 0, 120, 1)}
    <details class="luma-advanced"><summary>N\xE2ng cao</summary>
    <section class="luma-pro-group"><h3>B\u1EA7u kh\xF4ng kh\xED</h3>
    <div class="luma-label"><span>B\u1EA7u kh\xF4ng kh\xED</span><span data-custom hidden>T\xF9y ch\u1EC9nh</span></div><div class="luma-presets" aria-label="Preset \xE1nh s\xE1ng">${["calm", "cinematic", "vivid"].map((p, i) => `<button type="button" data-preset="${p}" aria-pressed="false">${["\xCAm d\u1ECBu", "\u0110i\u1EC7n \u1EA3nh", "R\u1EF1c r\u1EE1"][i]}</button>`).join("")}</div>
    <div class="luma-intensity"><label class="luma-label" for="luma-intensity">C\u01B0\u1EDDng \u0111\u1ED9<output data-output="intensity"></output></label><input type="range" id="luma-intensity" data-setting="intensity" min="0" max="1" step=".01"><div class="luma-range-extents"><span>Nh\u1EB9 nh\xE0ng</span><span>\u0110\u1EAFm ch\xECm</span></div></div>
    <button class="luma-auto" data-action="auto" type="button"><span aria-hidden="true">\u2727</span> T\u1EF1 \u0111\u1ED9ng c\xE2n ch\u1EC9nh</button><p class="luma-note">Ch\u1EA5t l\u01B0\u1EE3ng t\u1EF1 th\xEDch nghi v\u1EDBi m\xE1y c\u1EE7a b\u1EA1n.</p>
    </section><section class="luma-pro-group"><h3>\xC1nh s\xE1ng</h3>${range("spread", "\u0110\u1ED9 lan", "M\u1EDF r\u1ED9ng \xE1nh s\xE1ng ra ph\xEDa ngo\xE0i video.", 0, 2, 0.05)}${range("fadeMs", "Chuy\u1EC3n m\xE0u", "Th\u1EDDi gian \u0111\u1EC3 m\xE0u m\u1EDBi h\xF2a v\xE0o m\xE0u tr\u01B0\u1EDBc.", 0, 1e3, 10)}<div class="luma-directions">${EDGES.map((e, i) => `<label class="luma-check">${["Tr\xEAn", "Ph\u1EA3i", "D\u01B0\u1EDBi", "Tr\xE1i"][i]}<input type="checkbox" data-edge="${e}"></label>`).join("")}</div></section>
    <section class="luma-pro-group"><h3>M\xE0u s\u1EAFc</h3>${range("saturation", "\u0110\u1ED9 b\xE3o h\xF2a", "\u0110\u1ED9 \u0111\u1EADm m\xE0u c\u1EE7a \xE1nh s\xE1ng, kh\xF4ng \u0111\u1ED5i m\xE0u video.", 0, 2, 0.05)}${range("vibrance", "S\u1EAFc \u0111\u1ED9", "T\u0103ng m\xE0u nh\u1EA1t m\u1ED9t c\xE1ch nh\u1EB9 nh\xE0ng.", 0, 1, 0.05)}${range("brightness", "\u0110\u1ED9 s\xE1ng", "\u0110i\u1EC1u ch\u1EC9nh \u0111\u1ED9 s\xE1ng c\u1EE7a \xE1nh s\xE1ng xung quanh.", 0, 1.5, 0.05)}${range("highlightLimit", "Gi\u1EDBi h\u1EA1n v\xF9ng s\xE1ng", "Gi\u1EEF c\xE1c c\u1EA3nh tr\u1EAFng kh\xF4ng qu\xE1 ch\xF3i.", 0.3, 1, 0.05)}</section>
    <section class="luma-pro-group"><h3>Khung h\xECnh</h3>${check("blackBarDetection", "B\u1ECF vi\u1EC1n \u0111en khi l\u1EA5y m\xE0u")}${range("blackBarSensitivity", "\u0110\u1ED9 nh\u1EA1y vi\u1EC1n \u0111en", "Ch\u1EC9 \u1EA3nh h\u01B0\u1EDFng v\xF9ng l\u1EA5y m\xE0u, kh\xF4ng c\u1EAFt video.", 0, 1, 0.05)}</section>
    <section class="luma-pro-group"><h3>Hi\u1EC7u n\u0103ng</h3><div class="luma-field"><label class="luma-label" for="luma-mode">Ch\u1EA5t l\u01B0\u1EE3ng</label><select id="luma-mode" data-setting="performanceMode"><option value="auto">T\u1EF1 \u0111\u1ED9ng \xB7 Khuy\xEAn d\xF9ng</option><option value="eco">Eco \xB7 Ti\u1EBFt ki\u1EC7m</option><option value="balanced">Balanced \xB7 C\xE2n b\u1EB1ng</option><option value="ultra">Ultra \xB7 M\u01B0\u1EE3t h\u01A1n</option></select></div><div class="luma-field"><label class="luma-label" for="luma-ceiling">M\u1EE9c cao nh\u1EA5t khi t\u1EF1 \u0111\u1ED9ng</label><select id="luma-ceiling" data-setting="performanceCeiling"><option value="eco">Eco</option><option value="balanced">Balanced</option><option value="ultra">Ultra</option></select></div>${range("fpsLimit", "Gi\u1EDBi h\u1EA1n c\u1EADp nh\u1EADt", "T\u1ED1i \u0111a 30 FPS, \u0111\u1ED9c l\u1EADp t\u1EA7n s\u1ED1 qu\xE9t m\xE0n h\xECnh.", 1, 30, 1)}${range("sampleWidth", "\u0110\u1ED9 chi ti\u1EBFt l\u1EA5y m\xE0u", "S\u1ED1 pixel ngang t\u1ED1i \u0111a d\xF9ng \u0111\u1EC3 \u0111\u1ECDc m\xE0u video.", 32, 192, 8)}${check("floatingControl", "Hi\u1EC7n n\xFAt tr\xEAn YouTube")}<label class="luma-check">Gi\u1EA3m chuy\u1EC3n \u0111\u1ED9ng<input type="checkbox" data-reduced-motion></label><p class="luma-caption">Lu\xF4n t\xF4n tr\u1ECDng c\xE0i \u0111\u1EB7t gi\u1EA3m chuy\u1EC3n \u0111\u1ED9ng c\u1EE7a h\u1EC7 th\u1ED1ng.</p></section></details>
    <p class="luma-message" data-message role="status" aria-live="polite" hidden></p><button type="button" class="luma-retry" data-action="retry" hidden>Th\u1EED l\u1EA1i</button><footer class="luma-footer"><button type="button" data-action="reset">\u0110\u1EB7t l\u1EA1i m\u1EB7c \u0111\u1ECBnh</button><button type="button" data-action="privacy" aria-expanded="false">Ri\xEAng t\u01B0 tr\xEAn m\xE1y \u2197</button></footer><p class="luma-privacy" hidden>Kh\xF4ng theo d\xF5i, kh\xF4ng g\u1EEDi khung h\xECnh ho\u1EB7c l\u1ECBch s\u1EED xem. C\xE0i \u0111\u1EB7t \u0111\u01B0\u1EE3c l\u01B0u trong Chrome tr\xEAn m\xE1y n\xE0y.</p>`;
    root.append(style, panel);
    const abort = new AbortController();
    const signal = abort.signal;
    const pendingWrites = /* @__PURE__ */ new Map();
    const query = (selector) => panel.querySelector(selector);
    const sync = (s) => {
      state = s;
      panel.style.setProperty("--luma-glass-blur", `${s.blur * 0.3}px`);
      panel.dataset.reducedMotion = String(s.reducedMotion === "on");
      panel.querySelectorAll("[data-setting]").forEach((el) => {
        const k = el.dataset.setting;
        const v = s[k];
        if (el instanceof HTMLInputElement && el.type === "checkbox")
          el.checked = Boolean(v);
        else if (document.activeElement !== el) el.value = String(v);
      });
      for (const e of EDGES)
        query(`[data-edge="${e}"]`).checked = s.edges[e];
      query("[data-reduced-motion]").checked = s.reducedMotion === "on";
      panel.querySelectorAll("[data-preset]").forEach(
        (b) => b.setAttribute("aria-pressed", String(b.dataset.preset === s.preset))
      );
      query("[data-custom]").hidden = s.preset !== "custom";
      query("[data-enabled-text]").textContent = s.enabled ? "Ambient \u0111ang b\u1EADt" : "Ambient \u0111ang t\u1EAFt";
      panel.querySelectorAll("[data-output]").forEach((o) => {
        const k = o.dataset.output;
        const v = s[k];
        o.value = k === "intensity" ? `${Math.round(v * 100)}%` : k === "blur" ? `${v}px` : k === "fadeMs" ? `${v}ms` : ["fpsLimit", "sampleWidth"].includes(k) ? String(Math.round(v)) : `${Math.round(v * 100)}%`;
      });
    };
    const error = () => {
      const el = query("[data-message]");
      el.hidden = false;
      el.textContent = "Ch\u01B0a l\u01B0u \u0111\u01B0\u1EE3c c\xE0i \u0111\u1EB7t. H\xE3y m\u1EDF l\u1EA1i Luma ho\u1EB7c t\u1EA3i l\u1EA1i trang.";
    };
    const settingPatch = (el) => {
      const key = el.dataset.setting;
      if (!key) return;
      const value = el instanceof HTMLInputElement ? el.type === "checkbox" ? el.checked : Number(el.value) : el.value;
      const custom = [
        "intensity",
        "blur",
        "spread",
        "fadeMs",
        "saturation",
        "vibrance",
        "brightness",
        "highlightLimit"
      ].includes(key);
      return {
        [key]: value,
        ...custom ? { preset: "custom" } : {}
      };
    };
    const write = (key, patch, delay = 0) => {
      store.preview(patch);
      previewSettings?.(patch);
      const previous = pendingWrites.get(key);
      if (previous) clearTimeout(previous.timer);
      pendingWrites.delete(key);
      if (!delay) {
        void store.patch(patch).catch(error);
        return;
      }
      const timer = setTimeout(() => {
        pendingWrites.delete(key);
        void store.patch(patch).catch(error);
      }, delay);
      pendingWrites.set(key, { timer, patch });
    };
    const flushWrites = () => {
      for (const [key, pending] of pendingWrites) {
        clearTimeout(pending.timer);
        pendingWrites.delete(key);
        void store.patch(pending.patch).catch(error);
      }
    };
    panel.addEventListener(
      "change",
      (ev) => {
        const el = ev.target;
        const key = el.dataset.setting;
        if (key) {
          const patch = settingPatch(el);
          if (patch) write(key, patch);
        } else if (el instanceof HTMLInputElement && el.dataset.edge) {
          write(`edge:${el.dataset.edge}`, {
            edges: { [el.dataset.edge]: el.checked },
            preset: "custom"
          });
        } else if (el instanceof HTMLInputElement && el.hasAttribute("data-reduced-motion")) {
          write("reducedMotion", {
            reducedMotion: el.checked ? "on" : "system"
          });
        }
      },
      { signal }
    );
    panel.addEventListener(
      "input",
      (ev) => {
        const el = ev.target;
        if (el.type === "range") {
          const key = el.dataset.setting;
          const output = query(`[data-output="${key}"]`);
          output.value = key === "intensity" ? `${Math.round(Number(el.value) * 100)}%` : key === "blur" ? `${el.value}px` : el.value;
          const patch = settingPatch(el);
          if (patch) write(key, patch, 90);
        }
      },
      { signal }
    );
    panel.addEventListener(
      "click",
      (ev) => {
        const b = ev.target.closest("button");
        if (!b) return;
        if (b.dataset.preset) {
          flushWrites();
          const next = applyPreset(state, b.dataset.preset);
          const keys = [
            "preset",
            "intensity",
            "blur",
            "spread",
            "fadeMs",
            "saturation",
            "vibrance",
            "brightness",
            "highlightLimit"
          ];
          const patch = Object.fromEntries(
            keys.map((k) => [k, next[k]])
          );
          store.preview(patch);
          previewSettings?.(patch);
          void store.patch(patch).catch(error);
        } else if (b.dataset.action === "auto") {
          flushWrites();
          const patch = { performanceMode: "auto" };
          store.preview(patch);
          previewSettings?.(patch);
          void store.patch(patch).then(() => statusSource.retry()).catch(error);
        } else if (b.dataset.action === "reset") {
          flushWrites();
          const defaults = normalizeSettings(null);
          store.preview(defaults);
          previewSettings?.(defaults);
          void store.reset().catch(error);
        } else if (b.dataset.action === "retry") statusSource.retry();
        else if (b.dataset.action === "privacy") {
          const p = query(".luma-privacy");
          p.hidden = !p.hidden;
          b.setAttribute("aria-expanded", String(!p.hidden));
        }
      },
      { signal }
    );
    const off = store.subscribe(sync), offStatus = statusSource.subscribe((s) => {
      applyGlassAppearance(panel, s.accent);
      query("[data-quality]").textContent = s.quality === "eco" ? "Eco" : s.quality === "ultra" ? "Ultra" : "Balanced";
      query("[data-status-text]").textContent = s.state === "playing" ? "Theo m\xE0u video \xB7 \u0110ang ph\xE1t" : s.state === "paused" ? "Gi\u1EEF \xE1nh s\xE1ng \xB7 Video t\u1EA1m d\u1EEBng" : s.state === "disabled" ? "B\u1EADt \u0111\u1EC3 th\u1EAFp s\xE1ng kh\xF4ng gian" : s.state === "idle" ? "M\u1EDF video YouTube \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u" : "Kh\xF4ng th\u1EC3 \u0111\u1ECDc m\xE0u video";
      const msg = query("[data-message]");
      msg.hidden = s.state !== "error" && s.state !== "idle";
      msg.textContent = s.state === "error" ? "Ch\u01B0a \u0111\u1ECDc \u0111\u01B0\u1EE3c khung h\xECnh. Th\u1EED k\u1EBFt n\u1ED1i l\u1EA1i ho\u1EB7c t\u1EA3i l\u1EA1i trang." : s.state === "idle" ? "Luma ho\u1EA1t \u0111\u1ED9ng tr\xEAn trang xem video YouTube." : "";
      query('[data-action="retry"]').hidden = s.state !== "error";
    });
    sync(state);
    return {
      destroy() {
        flushWrites();
        abort.abort();
        off();
        offStatus();
        panel.remove();
        style.remove();
      }
    };
  }

  // src/ui/floating-control.ts
  function mountFloatingControl(host, store, status) {
    const container = document.createElement("div");
    container.dataset.lumaRoot = "";
    container.className = "luma-control-host";
    Object.assign(container.style, {
      position: "relative",
      display: "none",
      flex: "0 0 96px",
      width: "96px",
      height: "48px",
      zIndex: "2"
    });
    (document.fullscreenElement ?? document.body).append(container);
    const shadow = container.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = glass_default;
    shadow.append(style);
    const floating = document.createElement("div");
    floating.className = "luma-player-controls";
    floating.innerHTML = '<button class="luma-ytp-button" type="button" title="B\u1EADt ho\u1EB7c t\u1EAFt Luma" aria-label="B\u1EADt ho\u1EB7c t\u1EAFt ambient" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 2.8"/></svg></button><button class="luma-ytp-button" type="button" title="C\xE0i \u0111\u1EB7t Luma" aria-label="M\u1EDF thi\u1EBFt l\u1EADp Luma" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16M9 4v6m6 4v6"/></svg></button>';
    shadow.append(floating);
    const buttons = floating.querySelectorAll("button"), toggle = buttons[0], open = buttons[1];
    let panel, popover;
    let enabled = true;
    const abort = new AbortController(), signal = abort.signal;
    const position = () => {
      if (popover) {
        const b = open.getBoundingClientRect();
        const width = Math.max(1, Math.min(360, innerWidth - 20));
        popover.style.width = `${width}px`;
        const chromeTop = host.querySelector(".ytp-chrome-bottom")?.getBoundingClientRect().top ?? innerHeight;
        const bottom = Math.min(innerHeight - 12, chromeTop - 10);
        if (bottom <= 12) {
          popover.style.visibility = "hidden";
          return;
        }
        popover.style.visibility = "";
        const maxHeight = bottom - 12;
        popover.style.maxHeight = `${maxHeight}px`;
        const height = Math.min(popover.scrollHeight || 440, maxHeight);
        const top = Math.max(12, Math.min(b.top - height - 10, bottom - height));
        popover.style.left = `${Math.max(10, Math.min(innerWidth - width - 10, b.right - width))}px`;
        popover.style.top = `${top}px`;
      }
    };
    const placeInToolbar = () => {
      const toolbar = host.querySelector(".ytp-right-controls-left") ?? host.querySelector(".ytp-right-controls");
      if (!toolbar || container.parentElement === toolbar) return;
      const settings = toolbar.querySelector(".ytp-settings-button");
      toolbar.insertBefore(container, settings ?? null);
      position();
    };
    const close = () => {
      panel?.destroy();
      panel = void 0;
      popover?.remove();
      popover = void 0;
      floating.style.position = "";
      floating.style.zIndex = "";
      open.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener(
      "click",
      () => void store.patch({ enabled: !enabled }).catch(
        () => status.publish({
          ...status.current,
          state: "error",
          error: "storage"
        })
      ),
      { signal }
    );
    open.addEventListener(
      "click",
      () => {
        if (panel) {
          close();
          return;
        }
        popover = document.createElement("div");
        popover.className = "luma-popover";
        popover.setAttribute("role", "dialog");
        popover.setAttribute("aria-label", "Thi\u1EBFt l\u1EADp Luma");
        shadow.append(popover);
        panel = mountPanel(popover, store, status);
        floating.style.position = "relative";
        floating.style.zIndex = "2147483002";
        open.setAttribute("aria-expanded", "true");
        position();
        popover.querySelector("input,button")?.focus();
      },
      { signal }
    );
    shadow.addEventListener("toggle", position, { signal, capture: true });
    shadow.addEventListener(
      "keydown",
      (ev) => {
        const e = ev;
        if (!popover) return;
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          close();
          open.focus();
        }
        if (e.key === "Tab") {
          const items = Array.from(
            popover.querySelectorAll("button,input,select,summary")
          ).filter(
            (el) => el.getClientRects().length && !el.hasAttribute("hidden")
          );
          const first = items[0], last = items.at(-1);
          if (e.shiftKey && shadow.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && shadow.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      },
      { signal }
    );
    document.addEventListener(
      "pointerdown",
      (e) => {
        if (popover && !e.composedPath().includes(container)) close();
      },
      { signal }
    );
    for (const ev of ["scroll", "resize"])
      window.addEventListener(ev, position, { signal, passive: true });
    const resize = new ResizeObserver(position);
    resize.observe(host);
    const toolbarObserver = new MutationObserver(placeInToolbar);
    toolbarObserver.observe(host, { childList: true, subtree: true });
    const off = store.subscribe((s) => {
      enabled = s.enabled;
      floating.style.setProperty("--luma-glass-blur", `${s.blur * 0.3}px`);
      floating.dataset.reducedMotion = String(s.reducedMotion === "on");
      toggle.setAttribute("aria-pressed", String(enabled));
      container.hidden = !s.floatingControl;
      container.style.display = s.floatingControl ? "flex" : "none";
      if (!s.floatingControl) close();
    });
    placeInToolbar();
    const offStatus = status.subscribe(
      (s) => applyGlassAppearance(floating, s.accent)
    );
    position();
    return {
      destroy() {
        close();
        off();
        offStatus();
        resize.disconnect();
        toolbarObserver.disconnect();
        abort.abort();
        container.remove();
      }
    };
  }

  // src/content/index.ts
  function boot() {
    const style = document.createElement("style");
    style.className = "luma-page-style";
    style.textContent = page_surfaces_default;
    document.head.append(style);
    const store = new SettingsStore();
    let floating;
    const controller = new ContentController(store, (host) => {
      floating?.destroy();
      floating = void 0;
      if (host) floating = mountFloatingControl(host, store, controller.status);
    });
    const message = (msg, sender, respond) => {
      if (sender.id !== chrome.runtime.id) return;
      const type = msg?.type;
      if (type === "ambient:retry") controller.retry();
      if (type === "ambient:preview") {
        const patch = msg.patch;
        if (patch) store.preview(patch);
        respond(Boolean(patch));
        return;
      }
      if (type === "ambient:status" || type === "ambient:retry")
        respond(controller.status.current);
    };
    chrome.runtime.onMessage.addListener(message);
    void controller.start().catch(
      () => controller.status.publish({
        ...controller.status.current,
        state: "error",
        error: "storage"
      })
    );
    const cleanup = () => {
      clearInterval(contextWatch);
      controller.destroy();
      floating?.destroy();
      store.destroy();
      style.remove();
      try {
        chrome.runtime.onMessage.removeListener(message);
      } catch {
      }
    };
    const contextWatch = setInterval(() => {
      try {
        if (!chrome.runtime.id) cleanup();
      } catch {
        cleanup();
      }
    }, 2e3);
    return cleanup;
  }
  var dispose = boot();
  window.addEventListener("pagehide", () => dispose());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      dispose();
      dispose = boot();
    }
  });
})();
