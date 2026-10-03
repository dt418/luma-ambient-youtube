export class Scheduler {
  private video: HTMLVideoElement | undefined;
  private callback: ((time: number) => void) | undefined;
  private videoFrameRequest: number | undefined;
  private animationFrameRequest: number | undefined;
  private fallbackTimer: number | undefined;
  private running = false;
  private mediaTime = -1;
  private lastFrameTime = -1;
  private currentFps = 0;
  get fps() {
    return this.currentFps;
  }
  start(video: HTMLVideoElement, onFrame: (time: number) => void) {
    this.destroy();
    this.video = video;
    this.callback = onFrame;
    this.resume();
  }
  private queue() {
    if (!this.running || this.hasPending()) return;
    if (this.video && "requestVideoFrameCallback" in this.video) {
      this.videoFrameRequest = this.video.requestVideoFrameCallback((time) => {
        this.videoFrameRequest = undefined;
        this.frame(time);
      });
    } else if (typeof window.requestAnimationFrame === "function") {
      this.animationFrameRequest = window.requestAnimationFrame((time) => {
        this.animationFrameRequest = undefined;
        this.frame(time);
      });
    } else {
      this.fallbackTimer = window.setTimeout(() => {
        this.fallbackTimer = undefined;
        this.frame(performance.now());
      }, 1000 / 60);
    }
  }
  private hasPending() {
    return (
      this.videoFrameRequest !== undefined ||
      this.animationFrameRequest !== undefined ||
      this.fallbackTimer !== undefined
    );
  }
  private frame = (time: number) => {
    if (!this.running) return;
    const media = this.video?.currentTime ?? 0;
    if (media !== this.mediaTime) {
      if (this.lastFrameTime >= 0 && time > this.lastFrameTime)
        this.currentFps = Math.round(1000 / (time - this.lastFrameTime));
      this.lastFrameTime = time;
      this.mediaTime = media;
      this.callback?.(time);
    }
    this.queue();
  };
  pause() {
    this.running = false;
    if (this.videoFrameRequest !== undefined)
      this.video?.cancelVideoFrameCallback(this.videoFrameRequest);
    if (this.animationFrameRequest !== undefined)
      window.cancelAnimationFrame(this.animationFrameRequest);
    if (this.fallbackTimer !== undefined) clearTimeout(this.fallbackTimer);
    this.videoFrameRequest =
      this.animationFrameRequest =
      this.fallbackTimer =
        undefined;
    this.lastFrameTime = -1;
  }
  resume() {
    if (!this.video) return;
    this.running = true;
    this.queue();
  }
  destroy() {
    this.pause();
    this.video = undefined;
    this.callback = undefined;
    this.mediaTime = -1;
    this.currentFps = 0;
  }
}
