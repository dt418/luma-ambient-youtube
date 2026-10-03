// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { mountFloatingControl } from "../src/ui/floating-control";
import { SettingsStore, type StorageBackend } from "../src/shared/storage";
import { StatusSource } from "../src/shared/messages";
it("keeps expanded content inside a small viewport including its actual top offset", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("innerHeight", 720);
  vi.stubGlobal("innerWidth", 320);
  const b: StorageBackend = {
    async read() {
      return {};
    },
    async write() {},
    listen() {
      return () => {};
    },
  };
  const store = new SettingsStore(b),
    host = document.createElement("div");
  host.getBoundingClientRect = () => new DOMRect(0, 100, 600, 340);
  document.body.append(host);
  const f = mountFloatingControl(host, store, new StatusSource());
  await store.get();
  const root = document.querySelector("[data-luma-root]")!.shadowRoot!;
  root
    .querySelector<HTMLButtonElement>('[aria-label="Mở thiết lập Luma"]')!
    .click();
  const pop = root.querySelector<HTMLElement>(".luma-popover")!;
  expect(
    parseFloat(pop.style.top) + parseFloat(pop.style.maxHeight),
  ).toBeLessThanOrEqual(710);
  expect(parseFloat(pop.style.width)).toBeLessThanOrEqual(300);
  f.destroy();
  store.destroy();
  host.remove();
  vi.unstubAllGlobals();
});
it("opens settings, returns focus on Escape, and can be hidden from the popup", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
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
  const store = new SettingsStore(b);
  const host = document.createElement("div");
  document.body.append(host);
  const f = mountFloatingControl(host, store, new StatusSource());
  await store.get();
  const container = document.querySelector<HTMLElement>("[data-luma-root]")!,
    root = container.shadowRoot!,
    open = root.querySelector<HTMLButtonElement>(
      'button[aria-label="Mở thiết lập Luma"]',
    )!;
  open.click();
  expect(root.querySelector('[role="dialog"]')).not.toBeNull();
  root.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  expect(root.querySelector('[role="dialog"]')).toBeNull();
  expect(root.activeElement).toBe(open);
  await store.patch({ floatingControl: false });
  expect(container.hidden).toBe(true);
  f.destroy();
  expect(document.querySelector("[data-luma-root]")).toBeNull();
  store.destroy();
  host.remove();
  vi.unstubAllGlobals();
});
