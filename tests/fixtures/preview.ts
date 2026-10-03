// Development fixture: real runtime modules, local synthetic media only.
import { SettingsStore, type StorageBackend } from "../../src/shared/storage";
import { ContentController } from "../../src/content/controller";
import { mountFloatingControl } from "../../src/ui/floating-control";
import { mountPanel } from "../../src/ui/panel";
import pageCss from "../../src/content/page-surfaces.css?raw";
let data: Record<string, unknown> = {};
try {
  data = JSON.parse(localStorage.getItem("luma-demo") ?? "{}");
} catch {}
const listeners = new Set<(v: Record<string, unknown>) => void>();
const backend: StorageBackend = {
  async read() {
    return data;
  },
  async write(p) {
    data = { ...data, ...p };
    localStorage.setItem("luma-demo", JSON.stringify(data));
    listeners.forEach((fn) => fn(p));
  },
  listen(fn) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
const store = new SettingsStore(backend);
let floating: ReturnType<typeof mountFloatingControl> | undefined;
const controller = new ContentController(store, (host) => {
  floating?.destroy();
  if (host) floating = mountFloatingControl(host, store, controller.status);
});
const style = document.createElement("style");
style.textContent = pageCss;
document.head.append(style);
mountPanel(
  document.querySelector<HTMLElement>("#popup-preview")!,
  store,
  controller.status,
);
const canvas = document.createElement("canvas");
canvas.width = 960;
canvas.height = 540;
const ctx = canvas.getContext("2d")!;
const video = document.querySelector("video")!;
video.srcObject = canvas.captureStream(30);
void video.play();
let bright = false;
function draw(t: number) {
  const w = canvas.width,
    h = canvas.height;
  const sky = ctx.createLinearGradient(0, 0, w, h);
  sky.addColorStop(0, bright ? "#f5e7b4" : "#22546e");
  sky.addColorStop(0.6, bright ? "#b7edf2" : "#3c6174");
  sky.addColorStop(1, bright ? "#f0a27d" : "#b96659");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = bright ? "#f7eac8" : "#e1b1a0";
  ctx.beginPath();
  ctx.arc(w * 0.71 + Math.sin(t / 7000) * 16, h * 0.32, 38, 0, Math.PI * 2);
  ctx.fill();
  for (let layer = 0; layer < 3; layer++) {
    ctx.fillStyle = ["#526d78", "#314b5b", "#182b3c"][layer];
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
      const y =
        h * (0.55 + layer * 0.13) +
        Math.sin(x / (130 - layer * 20) + layer + t / 25000) * 32 +
        Math.sin(x / 70) * 10;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.fill();
  }
  ctx.fillStyle = "#f4f7fa";
  ctx.font = "28px Georgia";
  ctx.fillText("A slower kind of cinema.", 46, h - 64);
  ctx.font = "13px Segoe UI";
  ctx.fillStyle = "#c5d6df";
  ctx.fillText("LUMA  /  LOCAL VIDEO STUDY", 48, h - 36);
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
document.querySelector("#scene")!.addEventListener("click", () => {
  bright = !bright;
});
document.querySelector("#pause")!.addEventListener("click", () => {
  if (video.paused) void video.play();
  else video.pause();
});
document
  .querySelector("#fullscreen")!
  .addEventListener(
    "click",
    () => void document.querySelector("#movie_player")!.requestFullscreen(),
  );
document.querySelector("#navigate")!.addEventListener("click", () => {
  history.pushState(
    {},
    "",
    location.pathname === "/watch" ? "/" : "/watch?v=demo",
  );
  window.dispatchEvent(new Event("yt-navigate-finish"));
});
controller.status.subscribe((s) => {
  document.querySelector("#metrics")!.textContent =
    `${s.state} · ${s.quality} · ${s.fps || "—"} FPS · Canvas: ${document.querySelectorAll(".luma-ambient-canvas").length}`;
});
void controller.start();
