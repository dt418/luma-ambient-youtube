// @vitest-environment jsdom
import { it, expect } from "vitest";
import { mountPanel } from "../src/ui/panel";
import { SettingsStore, type StorageBackend } from "../src/shared/storage";
import { StatusSource } from "../src/shared/messages";
const tick = () => new Promise((r) => setTimeout(r, 0));
it("shows only blur before Advanced and synchronizes ambient tint and motion", async () => {
  const listeners = new Set<(p: Record<string, unknown>) => void>();
  const store = new SettingsStore({
    async read() {
      return {};
    },
    async write(p) {
      listeners.forEach((fn) => fn(p));
    },
    listen(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  });
  const root = document.createElement("div"),
    status = new StatusSource();
  const ui = mountPanel(root, store, status);
  await tick();
  const simple = Array.from(
    root.querySelectorAll<HTMLInputElement>('input[type="range"]'),
  ).filter((e) => !e.closest("details"));
  expect(simple.map((e) => e.dataset.setting)).toEqual(["blur"]);
  expect(
    root.querySelector("[data-preset]")!.closest("details"),
  ).not.toBeNull();
  await store.patch({ blur: 80, reducedMotion: "on" });
  status.publish({ ...status.current, accent: [240, 30, 20] });
  const panel = root.querySelector<HTMLElement>(".luma-panel")!;
  expect(panel.style.getPropertyValue("--luma-glass-blur")).toBe("24px");
  expect(panel.style.getPropertyValue("--luma-surface-rgb")).not.toBe("");
  expect(panel.dataset.reducedMotion).toBe("true");
  ui.destroy();
  store.destroy();
});
it("preserves independent edge edits from two panels before storage events arrive", async () => {
  let data: Record<string, unknown> = {};
  const backend: StorageBackend = {
    async read() {
      return { ...data };
    },
    async write(p) {
      data = { ...data, ...p };
    },
    listen() {
      return () => {};
    },
  };
  const a = new SettingsStore(backend),
    b = new SettingsStore(backend),
    ra = document.createElement("div"),
    rb = document.createElement("div");
  document.body.append(ra, rb);
  const pa = mountPanel(ra, a, new StatusSource()),
    pb = mountPanel(rb, b, new StatusSource());
  await tick();
  for (const [root, edge] of [
    [ra, "top"],
    [rb, "left"],
  ] as const) {
    const el = root.querySelector<HTMLInputElement>(`[data-edge="${edge}"]`)!;
    el.checked = false;
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  await tick();
  const fresh = new SettingsStore(backend);
  expect((await fresh.get()).edges).toMatchObject({
    top: false,
    left: false,
    right: true,
    bottom: true,
  });
  pa.destroy();
  pb.destroy();
  a.destroy();
  b.destroy();
  fresh.destroy();
  ra.remove();
  rb.remove();
});
it("selecting a look never overwrites a newer toggle from another tab", async () => {
  let data: Record<string, unknown> = {};
  const backend: StorageBackend = {
    async read() {
      return data;
    },
    async write(p) {
      data = { ...data, ...p };
    },
    listen() {
      return () => {};
    },
  };
  const store = new SettingsStore(backend);
  const root = document.createElement("div");
  document.body.append(root);
  const panel = mountPanel(root, store, new StatusSource());
  await tick();
  data["ambient.v1.enabled"] = false;
  root.querySelector<HTMLButtonElement>('[data-preset="vivid"]')!.click();
  await tick();
  expect(data["ambient.v1.enabled"]).toBe(false);
  expect(data["ambient.v1.intensity"]).toBe(0.75);
  panel.destroy();
  store.destroy();
  root.remove();
});
it("changes presets, saves intensity as custom, and resets accessibly", async () => {
  let data: Record<string, unknown> = {};
  const subs = new Set<any>();
  const backend: StorageBackend = {
    async read() {
      return data;
    },
    async write(p) {
      data = { ...data, ...p };
      subs.forEach((fn) => fn(p));
    },
    listen(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
  const store = new SettingsStore(backend),
    root = document.createElement("div");
  document.body.append(root);
  const status = new StatusSource();
  const panel = mountPanel(root, store, status);
  await tick();
  const preset = root.querySelector<HTMLButtonElement>('[data-preset="calm"]')!;
  preset.click();
  await tick();
  expect((await store.get()).preset).toBe("calm");
  expect(preset.getAttribute("aria-pressed")).toBe("true");
  const slider = root.querySelector<HTMLInputElement>(
    '[data-setting="intensity"]',
  )!;
  slider.value = ".7";
  slider.dispatchEvent(new Event("change", { bubbles: true }));
  await tick();
  expect(await store.get()).toMatchObject({ intensity: 0.7, preset: "custom" });
  expect(
    root.querySelector('input[aria-label="Bật ánh sáng ambient"]'),
  ).not.toBeNull();
  root.querySelector<HTMLButtonElement>('[data-action="reset"]')!.click();
  await tick();
  expect((await store.get()).intensity).toBe(0.55);
  status.publish({ ...status.current, state: "error", error: "frame" });
  expect(root.textContent).toContain("Thử lại");
  expect(
    root.querySelector('[data-action="retry"]')?.hasAttribute("hidden"),
  ).toBe(false);
  panel.destroy();
  store.destroy();
  root.remove();
});
