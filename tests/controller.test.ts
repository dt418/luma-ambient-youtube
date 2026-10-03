// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { ContentController } from "../src/content/controller";
import { SettingsStore, type StorageBackend } from "../src/shared/storage";
it("resamples paused color settings and applies surface blur immediately", async () => {
  const painted: string[] = [];
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
    createRadialGradient() {
      return {
        addColorStop(offset: number, color: string) {
          if (offset === 0) painted.push(color);
        },
      };
    },
    fillRect() {},
    drawImage() {},
    getImageData(_x: number, _y: number, w: number, h: number) {
      const data = new Uint8ClampedArray(w * h * 4);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 180;
        data[i + 1] = 80;
        data[i + 2] = 40;
        data[i + 3] = 255;
      }
      return { data };
    },
  } as any);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  window.history.replaceState({}, "", "/watch?v=paused");
  document.body.innerHTML = '<div id="movie_player"><video></video></div>';
  Object.defineProperties(document.querySelector("video")!, {
    readyState: { value: 2 },
    videoWidth: { value: 160 },
    videoHeight: { value: 90 },
  });
  const storage = store(),
    c = new ContentController(storage);
  try {
    await c.start();
    const before = painted.at(-1);
    await storage.patch({ brightness: 0.2, blur: 90 });
    expect(painted.at(-1)).not.toBe(before);
    expect(
      document.documentElement.style.getPropertyValue("--luma-surface-blur"),
    ).toBe("22.5px");
    await storage.patch({ blur: 80 });
    expect(
      document.documentElement.style.getPropertyValue("--luma-surface-blur"),
    ).toBe("20px");
    expect(c.status.current.state).toBe("paused");
  } finally {
    c.destroy();
    storage.destroy();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  }
});
it("recovers once when a new media source replaces an unreadable source on the same element", async () => {
  let bad = true,
    reads = 0;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
    createRadialGradient() {
      return { addColorStop() {} };
    },
    fillRect() {},
    drawImage() {},
    getImageData(_x: number, _y: number, w: number, h: number) {
      reads++;
      if (bad) throw new DOMException("tainted", "SecurityError");
      return { data: new Uint8ClampedArray(w * h * 4) };
    },
  } as any);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  window.history.replaceState({}, "", "/watch?v=bad");
  document.body.innerHTML = '<div id="movie_player"><video></video></div>';
  const video = document.querySelector("video")!;
  Object.defineProperties(video, {
    readyState: { value: 2 },
    videoWidth: { value: 160 },
    videoHeight: { value: 90 },
  });
  const storage = store(),
    c = new ContentController(storage);
  await c.start();
  expect(c.status.current.state).toBe("error");
  expect(reads).toBe(1);
  c.reconcile();
  expect(reads).toBe(1);
  bad = false;
  video.dispatchEvent(new Event("emptied"));
  video.dispatchEvent(new Event("loadeddata"));
  expect(c.status.current.state).toBe("paused");
  expect(reads).toBeGreaterThan(1);
  c.destroy();
  storage.destroy();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function store() {
  let data = {};
  const listeners = new Set<any>();
  const b: StorageBackend = {
    async read() {
      return data;
    },
    async write(p) {
      data = { ...data, ...p };
      listeners.forEach((fn) => fn(p));
    },
    listen(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
  return new SettingsStore(b);
}
it("attaches once, rebinds replacement video and tears down outside watch", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
  } as any);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  window.history.replaceState({}, "", "/watch?v=one");
  document.body.innerHTML =
    '<div id="movie_player"><video class="html5-main-video"></video></div>';
  const storage = store();
  const c = new ContentController(storage);
  await c.start();
  c.reconcile();
  c.reconcile();
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(1);
  const v = document.querySelector("video")!;
  v.replaceWith(document.createElement("video"));
  c.reconcile();
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(1);
  await storage.patch({ enabled: false });
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(0);
  await storage.patch({ enabled: true });
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(1);
  window.history.replaceState({}, "", "/");
  c.reconcile();
  expect(document.querySelector(".luma-ambient-canvas")).toBeNull();
  expect(document.documentElement.classList.contains("luma-active")).toBe(
    false,
  );
  c.destroy();
  storage.destroy();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("reparents to fullscreen and keeps one canvas after video replacement", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
  } as any);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  window.history.replaceState({}, "", "/watch?v=full");
  document.body.innerHTML = '<div id="movie_player"><video></video></div>';
  const video = document.querySelector("video")!;
  Object.defineProperty(video, "paused", { value: false });
  const storage = store(),
    c = new ContentController(storage);
  await c.start();
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(1);
  const host = document.querySelector("#movie_player")!;
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    value: host,
  });
  window.dispatchEvent(new Event("fullscreenchange"));
  expect(document.querySelector(".luma-ambient-canvas")?.parentElement).toBe(
    host,
  );
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    value: null,
  });
  window.dispatchEvent(new Event("fullscreenchange"));
  expect(document.querySelector(".luma-ambient-canvas")?.parentElement).toBe(
    document.body,
  );
  video.replaceWith(document.createElement("video"));
  c.reconcile();
  expect(document.querySelectorAll(".luma-ambient-canvas")).toHaveLength(1);
  c.destroy();
  storage.destroy();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("ignores unrelated text mutations instead of scheduling reconcile loops", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect() {},
  } as any);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  window.history.replaceState({}, "", "/watch?v=still");
  document.body.innerHTML =
    '<div id="movie_player"><video></video></div><p id="counter"></p>';
  const storage = store(),
    c = new ContentController(storage);
  await c.start();
  await new Promise((r) => setTimeout(r, 0));
  let updates = 0;
  const off = c.status.subscribe(() => updates++);
  const before = updates;
  document.querySelector("#counter")!.textContent = "unrelated";
  await new Promise((r) => setTimeout(r, 220));
  expect(updates).toBe(before);
  off();
  c.destroy();
  storage.destroy();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
