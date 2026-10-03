export class Scheduler {
  private video: HTMLVideoElement | undefined;
  private callback: ((time: number) => void) | undefined;
  private pending: number | undefined;
  private running = false;
  private fps = 24;
  private last = -Infinity;
  private mediaTime = -1;
  setFps(fps: number) {
    const next = Math.max(1, Math.min(30, fps));
    if (next === this.fps) return;
    this.fps = next;
    if (this.pending !== undefined) {
      clearTimeout(this.pending);
      this.pending = undefined;
      this.queue();
    }
  }
  start(video: HTMLVideoElement, onFrame: (time: number) => void) {
    this.destroy();
    this.video = video;
    this.callback = onFrame;
    this.resume();
  }
  private queue() {
    if (!this.running || this.pending !== undefined) return;
    this.pending = window.setTimeout(
      () => this.frame(performance.now()),
      1000 / this.fps,
    );
  }
  private frame = (time: number) => {
    this.pending = undefined;
    if (!this.running) return;
    const media = this.video?.currentTime ?? 0;
    if (time - this.last >= 1000 / this.fps - 0.1 && media !== this.mediaTime) {
      this.last = time;
      this.mediaTime = media;
      this.callback?.(time);
    }
    this.queue();
  };
  pause() {
    this.running = false;
    if (this.pending !== undefined) clearTimeout(this.pending);
    this.pending = undefined;
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
    this.last = -Infinity;
    this.mediaTime = -1;
  }
}
