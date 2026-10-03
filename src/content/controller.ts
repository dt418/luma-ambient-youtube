import { SettingsStore } from "../shared/storage";
import { normalizeSettings } from "../shared/settings";
import { StatusSource } from "../shared/messages";
import type { Settings } from "../shared/types";
import { createRenderer, type AmbientRenderer } from "../ambient/renderer";
import { FrameSampler } from "../ambient/sampler";
import { ambientPalette } from "../ui/appearance";
import { Scheduler } from "../ambient/scheduler";
import { PerformanceGovernor, QUALITY } from "../ambient/governor";
import { findPlayer } from "./youtube-adapter";
export class ContentController {
  readonly status = new StatusSource(() => this.retry());
  private settings = normalizeSettings(null);
  private sampler: FrameSampler | undefined;
  private renderer: AmbientRenderer | undefined;
  private scheduler = new Scheduler();
  private governor = new PerformanceGovernor();
  private video: HTMLVideoElement | undefined;
  private host: HTMLElement | undefined;
  private renderHost: HTMLElement | undefined;
  private lifetime: AbortController | undefined;
  private binding: AbortController | undefined;
  private observer: MutationObserver | undefined;
  private resize: ResizeObserver | undefined;
  private intersection: IntersectionObserver | undefined;
  private off: () => void = () => {};
  private timer: ReturnType<typeof setTimeout> | undefined;
  private visible = true;
  private failed = false;
  private destroyed = false;
  private lastStatus = 0;
  private surfaceKey = "";
  private onBinding: (host: HTMLElement | null) => void;
  constructor(
    private store: SettingsStore,
    onBinding: (host: HTMLElement | null) => void = () => {},
  ) {
    this.onBinding = onBinding;
  }
  async start() {
    this.settings = await this.store.get();
    if (this.destroyed) return;
    this.lifetime = new AbortController();
    const signal = this.lifetime.signal;
    this.off = this.store.subscribe((s) => {
      const prev = this.settings;
      this.settings = s;
      if (
        prev.performanceMode !== s.performanceMode ||
        prev.performanceCeiling !== s.performanceCeiling
      )
        this.governor = new PerformanceGovernor(
          s.performanceMode,
          s.performanceCeiling,
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
        "reducedMotion",
      ] as const;
      if (colorKeys.some((k) => prev[k] !== s[k])) {
        this.sampler?.reset();
        this.sampleOnce(performance.now(), true);
      }
    });
    for (const ev of ["yt-navigate-finish", "popstate", "fullscreenchange"])
      window.addEventListener(ev, () => this.reconcile(), { signal });
    document.addEventListener("visibilitychange", () => this.syncPlayback(), {
      signal,
    });
    window.addEventListener("scroll", () => this.position(), {
      signal,
      passive: true,
    });
    this.observer = new MutationObserver((records) => {
      const relevant =
        "video,#movie_player,#shorts-player,#miniplayer,ytd-miniplayer,ytd-watch-flexy";
      if (
        !records.some((r) =>
          Array.from(r.addedNodes)
            .concat(Array.from(r.removedNodes))
            .some(
              (n) =>
                n instanceof Element &&
                !n.closest("[data-luma-root]") &&
                (n.matches(relevant) || n.querySelector(relevant)),
            ),
        )
      )
        return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.reconcile(), 150);
    });
    this.observer.observe(document.querySelector("ytd-app") ?? document.body, {
      childList: true,
      subtree: true,
    });
    this.reconcile();
  }
  reconcile() {
    const pathname = location.pathname;
    const isHome = pathname === "/";
    const isSupported =
      isHome || pathname === "/watch" || pathname.startsWith("/shorts/");
    if (!isSupported) {
      this.detach();
      this.status.publish({ ...this.status.current, state: "idle" });
      return;
    }
    const target = findPlayer(document, pathname);
    if (!target) {
      const keepPageSurface = isHome && this.settings.enabled;
      if (
        this.video ||
        this.renderer ||
        (!keepPageSurface &&
          document.documentElement.classList.contains("luma-active"))
      )
        this.detach(keepPageSurface);
      if (isHome && this.settings.enabled) {
        // Home uses a stable tint instead of extracting colors from feed or
        // miniplayer video. Other supported pages keep the live video palette.
        if (
          this.status.current.accent.some(
            (channel, i) => channel !== [126, 187, 218][i],
          )
        )
          this.status.publish({
            ...this.status.current,
            state: "idle",
            accent: [126, 187, 218],
          });
        document.documentElement.classList.add("luma-active");
        this.updateSurface();
      }
      this.status.publish({ ...this.status.current, state: "idle" });
      return;
    }
    const fullscreen = document.fullscreenElement as HTMLElement | null;
    const canvasHost = fullscreen ?? document.body;
    if (
      target.video !== this.video ||
      target.host !== this.host ||
      canvasHost !== this.renderHost
    ) {
      this.detach();
      this.video = target.video;
      this.host = target.host;
      this.renderHost = canvasHost;
      this.failed = false;
      this.visible = true;
      this.sampler = new FrameSampler();
      this.governor = new PerformanceGovernor(
        this.settings.performanceMode,
        this.settings.performanceCeiling,
      );
      this.binding = new AbortController();
      const signal = this.binding.signal;
      for (const ev of [
        "play",
        "pause",
        "ended",
        "loadeddata",
        "seeked",
        "emptied",
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
          { signal },
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
      this.renderer.start(this.renderHost!, {
        ...this.settings,
        effectiveQuality: this.governor.quality,
      });
      this.renderHost?.classList.toggle(
        "luma-fullscreen",
        this.renderHost !== document.body,
      );
      document.documentElement.classList.add("luma-active");
      this.updateSurface();
      this.configure();
      this.position();
      this.scheduler.start(this.video!, (t) => this.sampleOnce(t));
      this.sampleOnce(performance.now());
    }
    this.syncPlayback();
  }
  private updateSurface() {
    const dark = document.documentElement.hasAttribute("dark");
    const palette = ambientPalette(this.status.current.accent, dark);
    const key = JSON.stringify([palette, this.settings.blur]);
    if (key === this.surfaceKey) return;
    this.surfaceKey = key;
    document.documentElement.style.setProperty(
      "--luma-surface-rgb",
      palette.surface.join(","),
    );
    document.documentElement.style.setProperty(
      "--luma-video-accent",
      this.status.current.accent.map(Math.round).join(","),
    );
    document.documentElement.style.setProperty(
      "--luma-surface",
      `rgba(${palette.surface.join(",")},.5)`,
    );
    document.documentElement.style.setProperty(
      "--luma-page-backdrop",
      `rgb(${palette.backdrop.join(",")})`,
    );
    document.documentElement.style.setProperty(
      "--luma-surface-blur",
      `${this.settings.blur * 0.25}px`,
    );
  }
  private effectiveSettings() {
    const reduced =
      this.settings.reducedMotion === "on" ||
      (typeof matchMedia === "function" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches);
    return { ...this.settings, fadeMs: reduced ? 0 : this.settings.fadeMs };
  }
  private configure() {
    const q = QUALITY[this.governor.quality];
    this.sampler?.setSampleWidth(Math.min(q.width, this.settings.sampleWidth));
    this.scheduler.setFps(this.targetFps());
    this.renderer?.updateSettings({
      ...this.effectiveSettings(),
      effectiveQuality: this.governor.quality,
    });
    if (this.renderer) this.updateSurface();
  }
  private targetFps() {
    const qualityFps =
      this.settings.performanceMode === "auto"
        ? 30
        : QUALITY[this.governor.quality].fps;
    return Math.min(qualityFps, this.settings.fpsLimit, 30);
  }
  private sampleOnce(t: number, instant = false) {
    if (
      !this.video ||
      !this.sampler ||
      !this.renderer ||
      this.failed ||
      !this.settings.enabled ||
      document.hidden ||
      !this.visible
    )
      return;
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        !chrome.runtime.id
      ) {
        this.destroy();
        return;
      }
      const start = performance.now();
      const effective = this.effectiveSettings();
      const frame = this.sampler.sample(
        this.video,
        instant ? { ...effective, fadeMs: 0 } : effective,
        t,
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
          luminance: frame.luminance,
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
        error: "frame",
      });
    }
  }
  private syncPlayback() {
    if (!this.video) return;
    const active =
      this.settings.enabled &&
      !this.failed &&
      !this.video.paused &&
      !this.video.ended &&
      !document.hidden &&
      this.visible;
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
        state: !this.settings.enabled
          ? "disabled"
          : active
            ? "playing"
            : "paused",
        quality: this.governor.quality,
      });
  }
  private position() {
    if (this.renderer) this.updateSurface();
    if (this.video) this.renderer?.resize(this.video.getBoundingClientRect());
  }
  private removeRenderer(preserveSurface = false) {
    this.surfaceKey = "";
    this.renderer?.destroy();
    this.renderer = undefined;
    if (preserveSurface) {
      this.renderHost?.classList.remove("luma-fullscreen");
      return;
    }
    document.documentElement.classList.remove("luma-active");
    document.documentElement.style.removeProperty("--luma-surface");
    document.documentElement.style.removeProperty("--luma-surface-rgb");
    document.documentElement.style.removeProperty("--luma-video-accent");
    document.documentElement.style.removeProperty("--luma-page-backdrop");
    document.documentElement.style.removeProperty("--luma-surface-blur");
    this.renderHost?.classList.remove("luma-fullscreen");
  }
  private detach(preserveSurface = false) {
    this.scheduler.destroy();
    this.removeRenderer(preserveSurface);
    this.binding?.abort();
    this.resize?.disconnect();
    this.intersection?.disconnect();
    this.sampler?.destroy();
    this.sampler = undefined;
    this.video = undefined;
    this.host = undefined;
    this.renderHost = undefined;
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
}
